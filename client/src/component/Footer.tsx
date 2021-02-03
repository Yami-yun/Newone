import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import { media } from 'component/customMediaQuery';

const Whole = styled.div`
    width: 100%;
    height: 80px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: 400;

    ${media.phone}{
        font-size: 0.7rem;
    }
`;

function Footer(){
    return (
    <>
        <GlobalStyle />
        <Whole>
            copyright Jong Yun - Yun  © all rights reserved
        </Whole>
    </>);
}
export default Footer;