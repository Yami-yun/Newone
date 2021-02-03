import React, { useEffect, useRef, useState } from 'react';
import styled, {css} from 'styled-components';
import GlobalStyle from 'globalStyles';
import RandomTagStyle from './RandomTagStyle';
import { media } from 'component/customMediaQuery';


const Whole = styled.section`
    display: flex;
    justify-content: center;
`;

const WordCloud = styled.article`
    margin-top: 30px;
    width: 900px;
    height: 100px;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    ${media.tablet}{
        width: 500px;
    }

    ${media.phone}{
        width: 320px;
    }
`;

function FamousTagList({famousTagList}:any){

    return (
    <>
        <GlobalStyle />
        <Whole>
            <WordCloud>
                <RandomTagStyle famousTagList={famousTagList}/>
            </WordCloud>
        </Whole>
    </>);
}
export default FamousTagList;