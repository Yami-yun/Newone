import React from 'react';
import styled, {css} from 'styled-components';
import GlobalStyle from 'globalStyles';

const Whole=styled.section``;

const Child =styled.div`
    width: 100px;
    height: 100px;
    border: 1px solid white;
`;

const Parent = styled.div`
    width: 500px;
    height: 500px;
    background: blue;
    &:hover &>div {
        background: red;
    };
`;


// 테스트용 페이지입니다.
function Test(){
    return (
    <>
        <GlobalStyle />
        <Whole>
            <Parent>
                <Child></Child>
                <Child></Child>
            </Parent>
        </Whole>
    </>);
}
export default Test;