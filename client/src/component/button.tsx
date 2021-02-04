import { media } from 'component/customMediaQuery';
import styled, { css } from 'styled-components';

// 재활용성이 높은 버튼들을 정의하는 컴포넌트들

// 파란 버튼 UI
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

// 회원가입, 비밀번호 찾기 인증 버튼  UI
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

// 포토 페이지용 파란 버튼  UI
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

// 하얀색 버튼  UI
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