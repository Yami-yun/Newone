import React, { useState } from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const DataLayout=styled.section`
    width: 900px;
    margin: 0 auto;
`;

// Search 기능 UI
const SearchBox = styled.article`
    width: 20%;
    margin-bottom: 20px;
    margin-left: 720px;

    display: flex;
    border-bottom: 1px solid #1464A0;
`;

const SearchInput = styled.input`
    width: 88%;
    height:20px;
    padding: 6px 0.4em 0;
    color:#1464A0;
    

    &:focus{
        outline:none;
    }
`;

const SearchBtn = styled.button`
    font-size: 1.8rem;
`;

const TabList=styled.article`
    height: 30px;
    line-height: 26px;
    display: flex;
    flex: 1 1 1;
    border-top: 1px solid;
    border-bottom: 1px solid;
    text-align: center;
`;

const Tab=styled.div``;

const DataList=styled.section``;

const DataListRow=styled.div`
    display: flex;
    height: 40px;
    line-height: 38px;
    border-bottom: 1px solid;
`;

const DataListItem=styled.div`
    text-align: center;
`;

const DeleteBtn = styled.button``;

// 데이터 리스트 하단 페이징 UI
const DataListBottom = styled.article`
    height: 40px;
    margin: 20px 0 70px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 18px;
`;

const PagingTxt = styled.p`
    margin-right: 15px;
`;

const PagingBtn = styled.button`
    height: 100%;
    margin-right: 15px;

    font-size: 34px;
    font-weight: 500;
    color: #000000;
`;

interface Props{
    onDeleteHandler(authorName:string) :void,
    data:any,
    type:"USER" | "PHOTO",
    title: string,
}

// 관리자 페이지에서 작가, 작품 리스트를 보여주는 컴포넌트
function AdminDataList({onDeleteHandler, data, type, title}:Props){

    const [searchTxt, setSearchTxt] = useState<string>("");         // 검색한 단어
    const [isSearch, setIsSearch] = useState<boolean>(false);       // 검색 버튼 클릭 여부
    const SHOW_MAX_DATA = 10;                                       // 한 페이지에 보여지는 유저 데이터 갯수
    const [paging, setPaging] = useState<number>(1);                // 데이터 리스트 페이징

    // 리스트 페이징 핸들러
    const onPagingHandler = (dir:string) => {
        if(dir === "LEFT"){
            // 왼쪽 버튼 클릭 시,
            if(paging !== 1) setPaging(paging - 1);
        }else{
            if(paging !== Math.ceil(data?.length / SHOW_MAX_DATA) ) setPaging(paging + 1);
        }
    }

    // 유저 검색

    return (
    <>
        <GlobalStyle />
        <h1 style={{fontSize: "1rem", marginBottom:"20px"}}>{title}</h1>
        <DataLayout>
            {/* 리스트 목록 검색 */}
            <SearchBox >
                <SearchInput 
                placeholder={type === "USER" ? "작가명 입력" : "작가, 작품명 입력"}
                onChange={(e:any)=>{setSearchTxt(e.target.value); 
                setIsSearch(false);}} 
                defaultValue={searchTxt}
                />
                <SearchBtn onClick={()=>setIsSearch(true)}><FontAwesomeIcon icon={faSearch} size="sm" style={{color:"#33ffff"}}/></SearchBtn>
            </SearchBox>
            
            {/* 리스트 상단 항목 */}
            <TabList>
            {type === "PHOTO" && <Tab style={{width:"50%"}}>작품명</Tab>}
                <Tab style={{width:"20%"}}>작가명</Tab>
                {type === "USER" && <Tab style={{width:"30%"}}>이메일</Tab>}
                <Tab style={{width:"20%"}}>등록 날짜</Tab>
                {type === "USER" && <Tab style={{width:"10%"}}>팔로우 수</Tab>}
                {type === "USER" && <Tab style={{width:"10%"}}>팔로워 수</Tab>}
            </TabList>

            {/* 리스트 내용 */}
            <DataList>
                {data && data.map((tmp:any, index:number)=>{
                    if(((searchTxt !== tmp.authorName) && (searchTxt !== tmp?.title)) && isSearch) return ;
                    if((paging * SHOW_MAX_DATA) <= index || ((paging-1) * SHOW_MAX_DATA) > index) return ;

                    return(<DataListRow key={index}>
                        {type === "PHOTO" && <DataListItem style={{width:"50%"}} >{tmp?.title}</DataListItem>}
                        <DataListItem style={{width:"20%"}} >{tmp.authorName}</DataListItem>
                        {type === "USER" && <DataListItem style={{width:"30%"}}>{tmp?.email}</DataListItem>}
                        <DataListItem style={{width:"20%"}}>{tmp?.createDate.slice(0, 10)}</DataListItem>
                        {type === "USER" && <DataListItem style={{width:"10%"}}>{tmp?.follow.length}</DataListItem>}
                        {type === "USER" && <DataListItem style={{width:"10%"}}>{tmp?.follower.length}</DataListItem>}
                        {type === "USER" && <DeleteBtn style={{width:"10%"}} onClick={()=>{onDeleteHandler(tmp?.authorName)}}>삭제</DeleteBtn>}
                        {type === "PHOTO" && <DeleteBtn style={{width:"10%"}} onClick={()=>{onDeleteHandler(tmp?._id)}}>삭제</DeleteBtn>}
                    </DataListRow>);
                    }
                )}
            </DataList>

            {/* 리스트 바텀 영역, 페이징 버튼, 현재 페이지 넘버 */}
            <DataListBottom>
                <PagingBtn onClick={()=>{onPagingHandler("LEFT");}} >‹</PagingBtn>
                <PagingTxt>{` ${paging} / ${Math.ceil(data?.length / SHOW_MAX_DATA)} `}</PagingTxt>
                <PagingBtn onClick={()=>{onPagingHandler("RIGHT");}} >›</PagingBtn>
            </DataListBottom>
        </DataLayout>

    </>);
}
export default AdminDataList;