import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import { PhotoBlueBtn } from 'component/button';
import { addComment, getComment, deleteComment, modifyComment } from 'redux/actions/commentAction';
import { SERVER_PATH } from 'config/path';
import { useDispatch, useSelector } from 'react-redux';
import { faTrashAlt, faEdit, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import defaultImg from 'img/defaultPersonalImg.png';
import {auth} from 'redux/actions/userAction';
import { media } from 'component/customMediaQuery';
import { ICommentList, IPhotoInfo } from 'page/photo/material/PhotoInterface';

const Whole=styled.article`
    width: 738px;
    margin-top: 66px;

    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #E8E8E8;

    ${media.tablet}{
        width: 432px;
    }
    ${media.phone}{
        width: 288px;
    }
`;

const InnerLayout = styled.section`
    width: 90%;
    padding-top: 12px;
`;

const CommentBox = styled.div`
    position: relative;
    padding: 8px 6px;
    margin-bottom: 10px;

    display: flex;

    border-top: 1px solid #00A0FF;
    border-bottom: 1px solid #00A0FF;
`;

const IconList = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
`;

const Icon = styled.div`
    margin-left : 16px;
    font-size: 1.5rem;
    color:#C4C4C4;
    cursor: pointer;

    &:hover{
        color:#5e5e5e;
    };
`;

const UserImg = styled.img`
    width: 40px;
    height: 40px;
    margin-right: 15px;

    background: #FFFFFF;
    border-radius: 20px;

    ${media.phone}{
        width: 38px;
        height: 38px;
    }
`;

const UserIDTxt = styled.p`  
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 1.2rem;
    color: #00A0FF;
`;

const UserCommentTxt= styled.p`
    width: 450px;
    height: 50px;
    margin-top:6px;

    font-weight: normal;
    font-size: 1rem;
    white-space:normal;
    word-break:break-all;

    ${media.tablet}{
        width: 300px;
    }
    ${media.phone}{
        width: 180px;
    }
`;

const UserDateTxt = styled.p`
    margin-top:6px;
    font-weight: normal;
    font-size: 1rem;
`;

const MoreBtn = styled.button`
    width: 100%;
    height: 40px;
    margin: 38px 0;

    text-align: center;
    line-height: 40px;
    color: #ffffff;
    background: #727BFC;
`;

const CommentInputBox = styled.article`
    margin: 15px 0;
    padding-right: 28px;

    display: flex;
    align-items: center;
`;

const CommentInput = styled.input`
    width: 80%;
    height: 26px;

    padding: 0 0.4em;
    color:#1464A0;
    background: #e7f5ff;
    
    border: none;
    &:focus{
        outline:none;
    }
`;

// 작품 페이지에서 코멘트 박스 컴포넌트
function Comment({photoInfo}:{photoInfo:IPhotoInfo | undefined}){
    
    const [comment, setComment] = useState<string>("");                 // 현재 작성 중인 댓글
    const [commentList, setCommentList] = useState<ICommentList[]>([]);            // 서버에서 받아온 댓글 리스트
    const [commentCount, setCommentCount] = useState<number>(1);                // 현재 보여주는 댓글 수,  1 이면 3개, 2이면 6개를 보여준다.
    const [isCommentModify, setIsCommentModify] = useState<number>(-1);         // 수정할 댓글의 index 값
    const [modifyCommentTxt, setModifyCommentTxt] = useState<string>("");       // 변경된 텍스트 문구 
    const [userKey, setUserKey] = useState<number>(0);                          // 해당 작품 페이지에 유저가 코멘트를 달았는지를 확인할 키값
    const dispatch = useDispatch();
    const commentStatus = useSelector(state => state.comment);

    const onCommentHandler = (e:any) => { setComment(e.target.value); };
    const onCommentCountHandler = () => { setCommentCount(commentCount+1) };

    // 코멘트 추가함
    const onCommentAdd = () => {

        if(!comment) return alert("댓글을 입력해주세요");
        addComment({comment, photoInfo, }).then(
            response => {
                if(response.payload.success){
                    // 방금 등록한 코멘트가 상단위에 표시되게 추가.
                    setCommentList([response.payload.result, ...commentList]);
                    setComment("");
                }
                dispatch(response);
            });
    };

    // 코멘트 제거
    const onCommentDeleteHandler = (tmp: any) => {
        deleteComment(tmp).then(
            response => {
                dispatch(response);
            });
    };

    // 코멘트 변경 중
    const onCommentModifyHandler = (index:number) => { setIsCommentModify(index); };

    // 코멘트 변경 완료
    const onCommentModifyCompleteHandler = (tmp: any) => { 
        onCommentModifyHandler(-1); 
        modifyComment({_id:tmp._id, authorKey:tmp.authorKey, modifyCommentTxt,}).then(
            response=>{
                dispatch(response);
                setModifyCommentTxt("");
            });
    };

    useEffect(() => {
        // 서버로 부터 최근 코멘트 양식 100개만 가져옴
        if(photoInfo?._id){
            getComment(photoInfo?._id).then(
                response => {
                    setCommentList(response.payload.result);
                    dispatch(response);
                    console.log(commentList);
                }
            );
        }
        auth().then(
            response => {
                setUserKey(response.payload.key);
            });
    }, [photoInfo?._id, commentStatus.deleteComment, commentStatus.modifyComment]);

    return (
    <>
        <GlobalStyle />
        <Whole>
            <InnerLayout >
                <p style={{ fontWeight:"normal", fontSize:18 }}>댓글</p>

                {/* 댓글 달기 input */}
                <CommentInputBox>
                    <PhotoBlueBtn style={{ margin: "0 20px 0 0", height:34}} onClick={onCommentAdd}> 댓글 등록 </PhotoBlueBtn>
                    <CommentInput onChange={onCommentHandler} value={comment} maxLength={50}/>
                </CommentInputBox>

                {/* 댓글 목록 */}
                {commentList && commentList.map((tmp:ICommentList, index:number) => {
                    if(commentCount*3 > index) return(
                    <CommentBox key={index}>
                        {userKey === tmp.authorKey &&
                        <IconList>
                            {/* 댓글 수정, 삭제 */}
                            <Icon onClick={()=>{onCommentModifyHandler(index);}}> <FontAwesomeIcon icon={faEdit}/> </Icon>
                            <Icon onClick={()=>{onCommentDeleteHandler(tmp);}}> <FontAwesomeIcon icon={faTrashAlt}/> </Icon>
                        </IconList>}

                        {/* 댓글 단 사람의 이미지 아이콘 */}
                        <UserImg src={!tmp?.personalImgPath ? defaultImg : `${SERVER_PATH}${tmp?.personalImgPath}`}/>
                        <div >
                            {/* 댓글 단 사람의 작가명 */}
                            <UserIDTxt>{tmp?.authorName}</UserIDTxt>

                            {index===isCommentModify ? 
                            <div style={{ display: "flex", alignItems:"center" }}>
                                {/* 댓글 수정 폼 */}
                                <CommentInput onChange={(e:any)=>{setModifyCommentTxt(e.target.value)}} value={modifyCommentTxt || tmp?.commentTxt} maxLength={48}/> 
                                <Icon onClick={()=>{onCommentModifyCompleteHandler(tmp);} }> <FontAwesomeIcon icon={faCheckCircle}/> </Icon>
                            </div>
                            : <UserCommentTxt>{tmp?.commentTxt}</UserCommentTxt>}

                            {/* 댓글 작성 날짜 */}
                            <UserDateTxt>{tmp?.createDate.substr(0,10) + "  " + tmp?.createDate.substr(11, 5)}</UserDateTxt>
                        </div>
                    </CommentBox>);
                } )}

                <MoreBtn onClick={onCommentCountHandler}>더보기</MoreBtn>
            </InnerLayout>
            
        </Whole>
    </>);
}
export default Comment;