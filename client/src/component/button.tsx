import { media } from 'component/customMediaQuery';
import styled, { css } from 'styled-components';

export const BlueBtn = styled.button`
    width: 300px;
    height: 40px;
    margin-top:6px;

    background: #00A0FF;
    border-radius: 8px;

    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #FFFFFF;
    cursor:pointer;

    &:active{
        background: #FFFFFF;
        color: #00A0FF;
    };
`;

export const VerifyBtn=styled.button`
    width: 38%;
    height: 40px;
    margin-left:5%;
    padding: 0 1px;

    background: #00A0FF;
    border-radius: 8px;

    font-weight: 600;
    font-size: 0.8rem;
    /* line-height: 22px; */
    text-align: center;
    color: #FFFFFF;
    cursor:pointer;

    &:active{
        background: #FFFFFF;
        color: #00A0FF;
    };
    ${media.tablet}{
        font-size:1rem;
    }
    ${media.phone}{
        font-size:1.1rem;
    }
`;

export const PhotoBlueBtn = styled.button`
    width: 100px;
    height: 38px;
    margin-left: 28px;
    margin-top:6px;

    background: #00A0FF;
    border-radius: 8px;

    font-weight: 600;
    font-size: 1rem;
    line-height: 22px;
    text-align: center;
    color: #FFFFFF;
    cursor:pointer;

    &:active{
        background: #FFFFFF;
        color: #00A0FF;
    };

    &:hover{
        font-weight: 800;
    };

    ${media.tablet}{
        width: 90px;
        font-size: 1.2rem;
    }
`;

export const WhiteBtn = styled.button<{isClicked?:boolean}>`
    width: 300px;
    height: 40px;
    margin-top:6px;

    background: #ffffff;
    border-radius: 8px;

    font-weight: 600;
    font-size: 1rem;
    line-height: 22px;
    text-align: center;
    
    cursor:pointer;

    ${props => props.isClicked && css`
        background: #00A0FF;
        color: #FFFFFF;
    `};

    ${media.tablet}{
        width: 170px;
        height: 40px;
    }
    ${media.phone}{
        width: 90px;
        height: 30px;
        font-size: 0.7rem;
    }



`;