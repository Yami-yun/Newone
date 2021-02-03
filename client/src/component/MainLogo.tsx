import React, {useState} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { media } from 'component/customMediaQuery';
import GlobalStyle from 'globalStyles';

const Whole = styled.h1`
    padding: 0 2px;

    font-weight: 900;
    font-size: 2.5rem;
    color: #00A0FF;
    cursor: pointer;
    /* ${media.tablet}{
        font-size: 2rem;
    }

    ${media.phone}{
        font-size: 1.4rem;
    } */
    /* border: 1px solid #00A0FF; */
`;

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
