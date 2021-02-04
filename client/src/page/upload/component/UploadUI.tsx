import styled from 'styled-components';
import { media } from 'component/customMediaQuery';

// 작품 업로드와 변경 페이지 관한 재활용성 component들

// 상단 레이아웃 (헤더 카테고리 hr)
export const TopLayout=styled.section`
    padding: 20px 0;
    border-bottom: 1px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
    
`;

// 그 외 Page 내용을 포함한 레이아웃
export const BottomLayout=styled.section`
    display: flex;
    justify-content: center;
    background: #faf1f1;
`;

export const PageLayout=styled.section`
    width: 1000px;
    padding-bottom: 95px;
    display:flex;
    flex-direction: column;

    ${media.tablet}{
        width: 600px;
    }

    ${media.phone}{
        width: 320px;
    }
`;

// 이미지 불러오는 박스
export const ImgDropDownBox=styled.div`
    /* position: relative; */
    /* max-height:970px; */
    width: 100%;
    height: 460px;
    background: #C4C4C4;
    outline: none;

    line-height: 460px;
    text-align: center;
    font-size: 2rem;
    font-weight: 700;

    ${media.tablet}{
        height: 300px;
        line-height: 300px;
        font-size: 1.6rem;
    }

    ${media.phone}{
        height: 200px;
        line-height: 200px;
        font-size: 0.9rem;
    }
`;

export const UploadImg=styled.img`
    border: 1px solid;
    width: 100%;
    height: 454px;
    object-fit: contain;
    z-index: 5;

    ${media.tablet}{
        height: 300px;
    }

    ${media.phone}{
        height: 200px;
    }
`;

// 입력 폼에 대한 명칭
export const InputTxt=styled.div`
    margin-top: 54px;
    margin-left:24px;

    font-weight: 600;
    font-size: 24px;
    color: #000000;
`;

export const TagList = styled.div`
    width: 1000px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
`;

// 태그 리스트 안에 있는 각 태그
export const TagBox = styled.p`
    margin-left: 18px;

    text-align: center;
    line-height: 38px;
    border-radius: 8px;
`;

export const PhotoTypeList = styled.div`
    width: 100%;

    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* border: 1px solid; */
`;
export const initUploadForm = {
    title: "",
    description: "",
    tag: "",
    tagList: [],
    photoType: 4,
};

export interface UploadFormType{
    title: string,
    description: string,
    tag: string,
    tagList: string[],
    photoType: number,
};

export const initPhotoForm = {
    photoName: "",
    photoPath: "",
};

export interface PhotoFormType{
    photoName: string,
    photoPath: string,
};