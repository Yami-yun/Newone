import React, {useState} from 'react';
import styled, {css} from 'styled-components';
import GlobalStyle from 'globalStyles';
import {SERVER_PATH} from 'config/path';
import { Link, useHistory } from 'react-router-dom';
import { faTrashAlt, faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deletePhoto } from "redux/actions/photoAction";
import { useDispatch } from "react-redux";
import { MODIFY_PHOTO } from 'redux/actions/types';
import { media } from 'component/customMediaQuery';

const Whole=styled.section`
    width: 1000px;
    min-height: 1200px;
    margin-top: 107px;

    display: flex;
    flex-direction : column;
    align-items: center;

    ${media.tablet}{
        width: 600px;
        min-height: 600px;
    }

    ${media.phone}{
        width: 330px;
        min-height: 400px;
        margin-top: 0px;
    }
`;

const TabBar = styled.ul`
/* width: 1000px; */
    width: 100%;
    height: 60px;

    display:flex;
    text-align: center;
    
    border-radius: 8px;
`;

const TabItem = styled.li<{isClicked?:boolean}>`
    height: 60px;
    flex: 1;

    font-size: 1rem;
    font-weight: 600;
    line-height: 60px;
    border-radius: 8px;
    border: 1px solid #E8E8E8;

    ${props => props.isClicked && css`
        background:#00A0FF;
        color: #ffffff;
    `}
    cursor:pointer;

    ${media.phone}{
        height: 40px;
        line-height: 40px;
    }

`;

const IconList = styled.div`
    width: 300px;
    height: 40px;
    margin-bottom: 20px;
    /* padding-right: 20px; */
    display: flex;
    justify-content: flex-end;
    ${media.tablet}{
        width: 170px;
    }
    ${media.phone}{
        width: 94px;
    }
`;

const Icon = styled.div`
    /* display: none; */
    margin-left : 16px;
    font-size:1.8rem;
    color:#ffffff;
    cursor: pointer;

    ${media.tablet}{
        color: #c4c4c4;
        margin-left : 14px;
    }
    ${media.phone}{
        margin-left : 8px;
    }
`;

const PhotoList = styled.article`
    width: 100%;
    padding: 14px 18px 0px;
    box-sizing: border-box;
    /* border: 1px solid; */

    display: grid;
    grid-template-columns: repeat(3, 33.333333333333%);
    column-gap: 10px;

    ${media.tablet}{
        padding: 14px 12px 0px;
        column-gap: 6px;
    }

    ${media.phone}{
        padding: 14px 4px 0px;
        column-gap: 6px;
    }

`;

const PhotoLayout = styled.section`
    &:hover ${Icon}{
        color: #c4c4c4;
    }
`;

const Photo = styled.img`
    width: 300px;
    height: 300px;
    border-radius: 8px;
    cursor: pointer;

    ${media.tablet}{
        width: 188px;
        height: 188px;
    }

    ${media.phone}{
        width: 100px;
        height: 100px;
    }
`;


function BottomImgList({personalInfo}:any){
    const history = useHistory();
    const dispatch = useDispatch();
    

    const [tabNum, setTabNum] = useState<Number>(0);

    const photoData = personalInfo?.photo;
    console.log(photoData);

    // 일러스트, 만화 ,캘리그라피 Tab click시 유저가 등록한 해당 type 이미지들을 보여줌
    const onTabHandler = (tabNum:Number) => {
        setTabNum(tabNum);
    };

    // 이미지 변경 아이콘 클릭시, 이미지 변경 화면으로 이동
    const onPhotoModifyHandler = (data:any) => {
        history.push("/photo_modify");
        dispatch({type: MODIFY_PHOTO ,result: data});
    }

    // 이미지 삭제 아이콘 클릭시, 이미지 삭제함.
    const onPhotoDeleteHandler = (data:any) => {
        deletePhoto(data).then(
            response => {
                if(response.payload.success){
                    dispatch(response);
                }
            });
    };

    return (
    <>
        <GlobalStyle />
        <Whole>
            <TabBar>
                <TabItem isClicked={tabNum===0} onClick={()=>{onTabHandler(0)}}>일러스트</TabItem>
                <TabItem isClicked={tabNum===1} onClick={()=>{onTabHandler(1)}}>만화</TabItem>
                <TabItem isClicked={tabNum===2} onClick={()=>{onTabHandler(2)}}>캘리그라피</TabItem>
            </TabBar>
            <PhotoList>
                {photoData && photoData.map(
                    (data:any, index:number)=>{
                        if(data.type === tabNum) return (
                            <PhotoLayout key={index} >
                                <Link to={`/photo/${data.id}`}>
                                    <Photo src={`${SERVER_PATH}${data.path}`}/>
                                </Link>
                                
                                {personalInfo?.isUser && <IconList>
                                    {/* modify icon */}
                                    <Icon onClick={()=>{onPhotoModifyHandler(data)}}> <FontAwesomeIcon icon={faEdit}/> </Icon>
                                    {/* delete icon */}
                                    <Icon onClick={()=>{onPhotoDeleteHandler(data)}}> <FontAwesomeIcon icon={faTrashAlt}/> </Icon>
                                </IconList>}
                            </PhotoLayout>
                            );
                        }
                )}
            </PhotoList>
        </Whole>
    </>);
}
export default BottomImgList;