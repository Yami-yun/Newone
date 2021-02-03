import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import Header from 'component/Header';
import Footer from 'component/Footer';
import AdminDataList from './component/AdminDataList';
import { useSelector } from 'react-redux';
import { getData, getAllUserData, deleteUserInfo, getAllPhotoData, deletePhotoInfo } from 'redux/actions/adminAction';
import { getChartData } from './component/data';
import {
    canvasW, 
    canvasH, 
    Rect, 
    Line, 
    Text,
    GetBarW, } from './component/graphMaker';

const TopLayout=styled.section`
    padding: 20px 0;
    border-bottom: 1px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BottomLayout=styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #faf1f1;
`;

const PageLayout=styled.section`
    width: 1000px;
    display: flex;
    flex-direction : column;
    align-items:center;
    padding-bottom: 95px;
    background: #ffffff;
`;

const ChartBox=styled.article`
    width: 804px;
    height: 600px;
    margin: 25px auto;
    
    /* border: 1px solid; */
`;

const Chart=styled.canvas`
    margin-top: 25px;
    /* border: 1px solid; */
`;

const ChartTitle=styled.h1`
    font-size: 1rem;
`;

function Admin(){
    let testData: { authorName: string; email: string; createDate: string; follow: string[]; follower: string[]; }[] = [
    ];

    for(let i=0; i<20; i++){
        testData.push({
            authorName: `test${i}`,
            email: "test@naver.com",
            createDate: "2020-01-02",
            follow: ["3"],
            follower: ["4"],
        });
    }
    
    const userData = useSelector(state => state.user.auth);             // 현재 등록한 유저 정보
    const [visitorData, setVisitorData] = useState<any>();              // api로부터 가져온 일일 방문자 수 데이터
    const [allUserData, setAllUserData] = useState<any>();
    const [allPhotoData, setAllPhotoData] = useState<any>();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    let canvas:HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;

    const chartData = getChartData();           // 일일 방문자 수의 더미 데이터

    const onDeleteUserInfoHandler = (authorName:string) => {
        // 유저정보 삭제
        const result = window.confirm("[주의!] 해당 유저 정보를 삭제하겠습니까?");

        if(result){
            deleteUserInfo(authorName).then(
            response => {
                if(response.payload.success){
                    const tmp = allUserData.filter((value:any)=>
                        value.authorName !== authorName);

                        setAllUserData([...tmp]);
                    alert('삭제되었습니다.');
                }
                else alert('삭제가 실패되었습니다.');
            });
        }
        else {
            alert('삭제가 취소되었습니다.');
        }
    }

    const onDeletePhotoInfoHandler = (_id:string) => {
        // 유저정보 삭제
        const result = window.confirm("[주의!] 해당 작품 정보를 삭제하겠습니까?");
        console.log(_id);
        if(result){
            deletePhotoInfo({_id:_id}).then(
            response => {
                if(response.payload.success){
                    const tmp = allPhotoData.filter((value:any)=>
                        value._id !== _id);

                        setAllPhotoData([...tmp]);
                    alert('삭제되었습니다.');
                }
                else alert('삭제가 실패되었습니다.');
            });
        }
        else {
            alert('삭제가 취소되었습니다.');
        }
    }

    const drawGraph = () => {
        canvas = canvasRef.current;
        if(canvas) ctx = canvas.getContext('2d');

        if(ctx){
            const maxY = 1000;
            const offset = {x: 60, y: 50};
            const barGapW = 40;
            const xDataLen = 10;
            const yCount = 6;

            const w = GetBarW({offset: offset, barGapW: barGapW, xDataLen:xDataLen });

            // y축 숫자의 최대값 가져오기
            let maxCount = 0;
            chartData.forEach((value)=>{
                let tmp = value.count.toString().length;
                if(maxCount < tmp) maxCount = tmp;
            })

            //Y축 숫자
            ctx.clearRect(0, 0, canvasW, canvasH);

            let digit = "";
            let digitIndex = 0;
            const digitList = ["백", "천", "만", "백만"];
            if(maxCount === 3) digit = digitList[0];
            else if(maxCount === 4) {
                digit = digitList[1];
                digitIndex = 1;
            }
            else if(maxCount === 5) {
                digit = digitList[2];
                digitIndex = 2;
            }
            else {
                digit = digitList[3];
                digitIndex = 2;
            }

            // x 축
            for(let i=0; i< yCount; i++){
                
                Line({ctx: ctx, x: offset.x, y: offset.y + (canvasH - 2 * offset.y) / (yCount - 1) * i, 
                    endX: canvasW - offset.x, endY: offset.y + (canvasH - 2 * offset.y) / (yCount - 1) * i, c:"#C6C6C6" });

                // y축 기준 수 텍스트 (ex, 0 2천, 4천, 6천, 9천 ,1만)
                let _text = "";
                if(i === 0) _text = `   0`;
                else if(i === yCount - 1) _text = `1${digitList[digitIndex+1]}`;
                else _text = `${2 * i}${digit}`;
                
                // y축 기준 수
                Text({ctx: ctx, x: offset.x - 40, y: offset.y + (canvasH - 2 * offset.y) / (yCount - 1) * i, text: _text, size: 12});
            }

            // 막대
            for(let i=0; i< xDataLen; i++){
                Rect({ctx: ctx, x: offset.x + i * (w + barGapW), y: offset.y, 
                    w: w, h: chartData[i].count / maxY * (canvasH -2 * offset.y), c: "#7daef8"});
            }

            // x 축 날짜
            for(let i=0; i< xDataLen; i++){
                Text({ctx: ctx, x: offset.x + i * (w + barGapW), y: offset.y - 24, text: chartData[i].date.slice(5,10), size: 12});
            }

        }
    }
    
    useEffect(() => {
        getData().then(
            response => {
                if(response.payload.success) setVisitorData(response.payload.result);
            });

            getAllUserData().then(
                response => {
                    if(response.payload.success) setAllUserData(response.payload.result);
                });

            getAllPhotoData().then(
                response => {
                    if(response.payload.success) setAllPhotoData(response.payload.result);
                    console.log(response.payload.result);
                });

            drawGraph();

    }, []);
    return (
    <>
        <GlobalStyle />
        <TopLayout>
            <Header userData={userData}/>
        </TopLayout>
        <BottomLayout>
            {/* 여기서부터 Page 내용 */}
            <PageLayout>
                {/* admin main */}

                {/* // 10일 동안 일일 방문자 수 그래프*/}
                <ChartBox>
                    <ChartTitle>일일 방문자 수 그래프</ChartTitle>
                    {/* <Chart width={`$(canvasW)`} height={`$(canvasH)`} ref={canvasRef}/> */}
                    <Chart width="800" height="520" ref={canvasRef}/>
                </ChartBox>
                {/* 일일 작가 등록 수 그래프 */}
                {/* 일일 작품 등록 수 */}

                {/* 작가 관리 섹션 */}
                <AdminDataList title={"가입한 작가 목록 리스트"} data={allUserData} onDeleteHandler={onDeleteUserInfoHandler} type={"USER"}/>

                {/* 작품 관리 섹션 */}
                <AdminDataList title={"등록한 작품 목록 리스트"} data={allPhotoData} onDeleteHandler={onDeletePhotoInfoHandler} type={"PHOTO"}/>

                <section></section>
            </PageLayout>
        </BottomLayout>
        <Footer />
    </>);
}
export default Admin;