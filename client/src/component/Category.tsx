import { media } from 'component/customMediaQuery';
import React from 'react'
import styled from 'styled-components';

const Whole = styled.nav`
    width: 1000px;
    /* border : 1px solid; */
    margin-top:17px;

    ${media.tablet}{
        width: 620px;
    }

    ${media.phone}{
        width: 300px;
    }

`;

const NavList = styled.ul`
    display:flex;
`;

const NavListItem = styled.li`
    list-style: none;
    margin-right: 3.2em;
    color: #00A0FF;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;

    &:hover{
        text-decoration: underline;
    }

    ${media.phone}{
        margin-right: 2em;
    }
`;

interface Props{
    setCategory(category:number):void,
}

// Main page 상단에 들어가는 category 컴포넌트
function Category({setCategory}: Props) {
    return (
        <Whole>
            <NavList>
                <NavListItem onClick={()=>{setCategory(0);}}>일러스트</NavListItem>
                <NavListItem onClick={()=>{setCategory(1);}}>만화</NavListItem>
                <NavListItem onClick={()=>{setCategory(2);}}>캘리그라피</NavListItem>
            </NavList>
        </Whole>
    )
}

export default Category;