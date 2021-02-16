import React from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import RandomTagStyle from './RandomTagStyle';
import { media } from 'component/customMediaQuery';
import { IFamousTagList } from 'page/main/material/MainInterface';


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

function FamousTagList({famousTagList}:{famousTagList:IFamousTagList[]}){

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