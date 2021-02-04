import React from 'react';
import styled from 'styled-components';
import Search from './Search';
import HeaderIconList from './HeaderIconList';
import MainLogo from './MainLogo';
import { media } from 'component/customMediaQuery';
import GlobalStyle from 'globalStyles';

const Whole = styled.header`
    width: 1000px;
    padding: 0 5px;
    box-sizing:border-box;

    display:flex;
    justify-content: space-between;
    align-items: center;

    ${media.tablet}{
        width: 600px;
    }

    ${media.phone}{
        width: 340px;
    }
    /* border : 1px solid; */
`;



// 모든 페이지에 들어가는 Header 컴포넌트 (login, register 는 제외)
function Header({userData}:any) {

    return (
        <>
        <GlobalStyle />
        <Whole>
            <MainLogo />

            <Search/>
            
            {/* Home, Alarm, personal icon */}
            <HeaderIconList userData={userData}/>
        </Whole>
        </>
    )
}

export default Header;
