import React from 'react';
import { useHistory } from 'react-router-dom';
import styled, {css} from 'styled-components';
import { media } from 'component/customMediaQuery';

let color = [
    "#fc5c65",
    "#fd9644", 
    "#fed330", 
    "#26de81", 
    "#2bcbba", 
    "#eb3b5a", 
    "#fa8231", 
    "#f7b731", 
    "#20bf6b", 
    "#0fb9b1",
    "#45aaf2",
    "#4b7bec",
    "#a55eea",
    "#d1d8e0",
    "#778ca3",
    "#2d98da",
    "#3867d6",
    "#8854d0",
    "#a5b1c2",
    "#4b6584",
];

const Text = styled.p<{color:string, size:number, weight:number}>`
    height: 38px;
    display: inline-block;
    margin: 5px 6px;
    padding: 0 2px;
    
    ${props=> {
        return css`
        color: ${props.color};
        font-size: ${props.size}px;
        font-weight: ${props.weight};
    `}}

    border: 4px solid;
    border-radius: 8px;
    cursor: pointer;

    &:hover{ transform: scale(1.2); }
    &:active{ transform: scale(0.8); }
    
    ${media.phone}{
        height: 28px;
        font-size: 16px;
    }
`;

// 배열을 셔플한다.
function shuffle(array:any) {
    array.sort(() => Math.random() - 0.5);
}

interface Props{
    famousTagList:{_id:string, count:number}[],
};

export default function RandomTagStyle({famousTagList}:Props){
    const history = useHistory();
    shuffle(color);

    // 태그 클릭시 해당 검색으로 간다.
    const onTagClick = (tag:string) => { history.push(`/search/${tag}`); };

    return (
        <>
        <Text color={"#00A0FF"} size={22} weight={700}># 태그 순위</Text>
        {
            famousTagList && famousTagList.reverse().map((tmp:{_id:string, count:number}, index:number) => 
            (<Text onClick={()=>{onTagClick(tmp._id)}} key={index} color={color[index]} size={index*0.3 + 18} weight={500 + index*20}># {tmp._id}</Text>))
        } 
        </>
    );

}
