import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import { useParams } from 'react-router-dom';
import Header from 'component/Header';
import { useDispatch, useSelector } from 'react-redux';
import SearchList from 'page/search/material/SearchList';
import { searchPhoto, searchTag } from 'redux/actions/photoAction';
import { searchAuthor } from 'redux/actions/userAction';
import Footer from 'component/Footer';

const Whole=styled.section``;

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
    height: 80%;
    background: #ffffff;
    padding-bottom: 95px;
`;

const Loading = styled.article`
    padding : 7px 24px;

    position: fixed;
    top: 50vh;
    background: #00a0ff;
    
    color: #ffffff;
    font-size: 2rem;
    font-weight: 900;
    border-radius: 22px;
    /* border: 1px solid; */
`;

const LoadingCircle = styled.div<{delay:number}>`
    position: absolute;
    top: 0px;
    left: -36px;
    width: 30px;
    height: 100%;

    background: #ffffff;
    animation: loading 2s infinite ease;
    animation-delay: ${props=> props.delay}s;
    /* border: 1px solid black; */

    @keyframes loading{
        0%{
            transform: translateX(-20px);
        }
        100%{
            transform: translateX(250px);
        }
    }
`;

// 검색 결과 화면 컴포넌트
function SearchPage(){
    const {text} = useParams<{text:string}>();
    const userData = useSelector((state:any) => state.user.auth);
    const dispatch = useDispatch();
    const [searchPhotoList, setSearchPhotoList] = useState<any>(null);
    const [searchAuthorList, setSearchAuthorList] = useState<any>(null);
    const [searchTagList, setSearchTagList] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);                          // loading 여부 확인

    useEffect(() => {
        // setIsLoading(0);
        searchPhoto(text).then(
            response=> {
                if(response.payload.success) setSearchPhotoList(response.payload.result);
                dispatch(response);
            });

        searchAuthor(text).then(
            response=> {
                if(response.payload.success) setSearchAuthorList(response.payload.result);
                dispatch(response);
            });

        searchTag(text).then(
            response=> {
                if(response.payload.success) setSearchTagList(response.payload.result);
                dispatch(response);
                setIsLoading(true);
                
            });

    }, [text]);
    
    return (
    <>
        <GlobalStyle />
        <Whole>
            <TopLayout>
                <Header userData={userData}/>
            </TopLayout>
            <BottomLayout>
                
                {/* 로딩 문구 */}
                {!isLoading &&
                <Loading>Loading...
                    <LoadingCircle delay={0}/>
                    <LoadingCircle delay={0.5}/>
                    <LoadingCircle delay={1}/>
                    <LoadingCircle delay={1.5}/>
                </Loading>}
                <PageLayout>
                    {/* 여기서부터 Page 내용 */}

                    {/* 검색 단어 관련 작가 리스트 */}
                    <SearchList searchTxt={text} title={"관련된 작가"} data={searchAuthorList}/>

                    {/* 검색 단어 관련 작품 리스트 */}
                    <SearchList searchTxt={text} title={"관련된 작품"} data={searchPhotoList}/>

                    {/* 검색 단어 관련 테그 리스트 */}
                    <SearchList searchTxt={text} title={"관련된 태그 작품"} data={searchTagList} />
                </PageLayout>
            </BottomLayout>
            <Footer />
        </Whole>
    </>);
}
export default SearchPage;