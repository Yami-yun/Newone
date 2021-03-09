import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import Header from 'component/Header';
import Footer from 'component/Footer';
import AdminDataList from './component/AdminDataList';
import { useSelector, useDispatch } from 'react-redux';
import { getData, getAllUserData, deleteUserInfo, getAllPhotoData, deletePhotoInfo } from 'redux/actions/adminAction';
import { getChartData } from './component/data';
import {
    canvasW, 
    canvasH, 
    Rect, 
    Line, 
    Text,
    GetBarW, } from './component/graphMaker';
import { media } from 'component/customMediaQuery';

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

const AlarmTxt=styled.section`
    display:none;
    width: 100%;
    height: 50vh;
    text-align: center;
    line-height: 50vh;

    font-size: 1.4rem;
    font-weight: 500;
    ${media.tablet}{
        display: contents;
    }
`;

const PageLayout=styled.section`
    width: 1000px;
    display: flex;
    flex-direction : column;
    align-items:center;
    padding-bottom: 95px;
    background: #ffffff;

    ${media.tablet}{
        display: none;
    }

`;



const ChartBox=styled.article`
    width: 804px;
    height: 600px;
    margin: 25px auto;
`;

const Chart=styled.canvas`
    margin-top: 25px;
`;

const ChartTitle=styled.h1`
    font-size: 1rem;
`;

function Admin(){
    const dispatch = useDispatch();
    const userData = useSelector((state:any) => state.user.auth);             // 현재 등록한 유저 정보
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
            
            const offset = {x: 60, y: 50};          // 그래프 시작 위치
            const barGapW = 40;                     // 막대 사이 간격
            const xDataLen = 10;                    // x축 막대 갯수
            const yCount = 6;                       // y축 실선 갯수

            const w = GetBarW({offset: offset, barGapW: barGapW, xDataLen:xDataLen });

            // y축 숫자의 최대 자리 수 가져오기
            let maxCount = 0;
            chartData.forEach((value)=>{
                let tmp = value.count.toString().length;
                if(maxCount < tmp){
                    maxCount = tmp;
                }
            })

            const maxY = Math.pow(10, maxCount);            // y축 최대 값

            //Y축 숫자
            ctx.clearRect(0, 0, canvasW, canvasH);

            // y축 단위 생성
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

            // 그래프 실선 render
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

            // 막대 render
 
            for(let i=0; i< xDataLen; i++){
                Rect({ctx: ctx, x: offset.x + i * (w + barGapW), y: offset.y, 
                    w: w, h: chartData[i].count / maxY * (canvasH -2 * offset.y), c: "#7daef8"});
            }


            // x 축 날짜 render
            for(let i=0; i< xDataLen; i++){
                Text({ctx: ctx, x: offset.x + i * (w + barGapW), y: offset.y - 24, text: chartData[i].date.slice(5,10), size: 12});
            }

        }
    }
    
    useEffect(() => {
        // 방문자 수 데이터 불러오기 api
        getData().then(
            response => {
                if(response.payload.success){
                    setVisitorData(response.payload.result);
                    dispatch(response);
                }
            });

        // 모든 유저 데이터 불러오기 api
        getAllUserData().then(
            response => {
                if(response.payload.success)
                {
                    setAllUserData(response.payload.result);
                    dispatch(response);
                }
            });

        // 모든 작품 데이터 불러오기 api
        getAllPhotoData().then(
            response => {
                if(response.payload.success){
                    setAllPhotoData(response.payload.result);
                    dispatch(response);
                }
            });

        // 그래프 그리기
        drawGraph();

    }, []);
    return (
    <>
        <GlobalStyle />
        <TopLayout>
            <Header userData={userData}/>
        </TopLayout>
        <BottomLayout>

            {/* 일반 테블릿 사이즈 이하일 때 관리자페이지 내용 대신 아래 문구가 뜸 */}
            <AlarmTxt>관리자 페이지는 PC에서만 사용 가능합니다.</AlarmTxt>
            {/* 여기서부터 Page 내용 */}
            <PageLayout>
                {/* // 10일 동안 일일 방문자 수 그래프*/}
                <ChartBox>
                    <ChartTitle>일일 방문자 수 그래프</ChartTitle>
                    <Chart width="800" height="520" ref={canvasRef}/>
                </ChartBox>

                {/* 작가 관리 섹션 */}
                <AdminDataList title={"가입한 작가 목록 리스트"} data={allUserData} onDeleteHandler={onDeleteUserInfoHandler} type={"USER"}/>

                {/* 작품 관리 섹션 */}
                <AdminDataList title={"등록한 작품 목록 리스트"} data={allPhotoData} onDeleteHandler={onDeletePhotoInfoHandler} type={"PHOTO"}/>
            </PageLayout>
        </BottomLayout>
        <Footer />
    </>);
}
export default Admin;