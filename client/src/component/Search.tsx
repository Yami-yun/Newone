import React, { useEffect, useState } from 'react';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { media } from 'component/customMediaQuery';

const Whole = styled.article`
    width: 300px;
    height: 43px;
    margin-top: 15px;

    display: flex;
    justify-content: center;
    align-items: center;

    ${media.tablet}{
        width: 230px;
    }
    ${media.phone}{
        width:94px;
        margin-top: 0px;
    }
`;

const SearchBox = styled.form`
    width: 100%;
    border-bottom: 1px solid #1464A0;
    display: flex;
`;

const SearchInput = styled.input`
    width: 88%;
    height:20px;

    padding: 0 0.4em;
    color:#1464A0;

    &:focus{
        outline:none;
    }
`;

const SearchBtn = styled.button`
    font-size: 1.8rem;
`;

// 헤더에 들어가는 서치바 컴포넌트
function Search() {

    const params= useParams<{text:string}>();               //  검색한 단어
    const history = useHistory();
    const [searchText, setSearchText] = useState<string>("");           // 검색 input text

    useEffect(() => {

        // 검색을 실행할때마다, 검색 input default text 변경
        setSearchText(params.text);
    }, [params])

    // 검색 input text state 변경
    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchText(e.target.value); };

    // 검색한 단어로 페이지 이동
    const onSearchSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        history.push(`/search/${searchText}`);          // 검색 페이지로 이동
    };

    return (
        <Whole>
            <SearchBox onSubmit={onSearchSubmit}>
                <SearchInput onChange={onInput} defaultValue={searchText}/>
                <SearchBtn type="submit"><FontAwesomeIcon icon={faSearch} size="sm" style={{color:"#33ffff"}}/></SearchBtn>
            </SearchBox>
        </Whole>
    );
}

export default Search;
