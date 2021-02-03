import { media } from 'component/customMediaQuery';
import styled from 'styled-components';

export const WhiteInputLabel = styled.label`
    margin-top: 54px;
    margin-left:20px;
    margin-bottom: 14px;

    font-weight: 600;
    font-size: 1.5rem;
    color: #000000;

    ${media.tablet}{
        font-size: 1.2rem;
        margin-top: 50px;
    }
    ${media.phone}{
        font-size: 0.9rem;
        margin-top: 44px;
    }
`;

export const InputBox=styled.input`
    width: 300px;
    height: 40px;
    margin-bottom: 14px;
    padding: 0 20px;
    font-size: 1rem;


    background: #ffffff;
    border-radius: 8px;
`;

export const InputParagraphBox=styled.textarea`
    width: 96%;
    height: 120px;
    margin-bottom: 14px;
    padding: 20px 20px;
    font-size: 1rem;
    font-weight: 500;

    background: #ffffff;
    border-radius: 8px;

    ${media.tablet}{
        width: 94%;
    }

    ${media.phone}{
        width: 86%;
    }
`;