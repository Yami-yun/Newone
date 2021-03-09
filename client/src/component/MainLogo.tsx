import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import GlobalStyle from 'globalStyles';
import { media } from 'component/customMediaQuery';

const Whole = styled.h1`
    padding: 0 2px;

    font-weight: 900;
    font-size: 2.5rem;
    color: #00A0FF;
    cursor: pointer;

    ${media.phone}{
        font-size: 2rem;
    }
`;

// 헤더 좌측에 들어가는 Newone 로고 컴포넌트
function MainLogo() {

    return (
        <>
        <GlobalStyle />
        <Whole>
            
            <Link to="/">Newone</Link>
        </Whole>
        </>
    )
}

export default MainLogo;
