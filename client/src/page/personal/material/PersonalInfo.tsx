import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import GlobalStyle from 'globalStyles';
import defaultImg from 'img/defaultPersonalImg.png';

import { SERVER_PATH } from 'config/path';
import { Link } from 'react-router-dom';
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { followUser, getIsFollow } from 'redux/actions/userAction';
import { media } from 'component/customMediaQuery';
import { IPersonalInfoProps } from 'page/personal/material/PersonalInterface';

const Whole=styled.section`
    display:flex;
    margin-top: 62px;
    justify-content: space-around;

    ${media.tablet}{
        width: 600px;
        height: 300px;
    }

    ${media.phone}{
        width: 300px;
        height: 230px;
    }

`;

const PersonalImg = styled.img`
    width: 150px;
    height: 150px;
    margin-right: 40px;

    border: 1px solid #d1d2d3;
    border-radius: 75px;

    object-fit: 'contain';

    ${media.tablet}{
        width: 110px;
        height: 110px;
        margin-right: 0px;
    }

    ${media.phone}{
        width: 70px;
        height: 70px;
    }
`;

const PersonalInfoBox = styled.div`
    width: 630px;
    height: 332px;
    padding: 36px 44px;

    border: 1px solid #d1d2d3;
    border-radius: 8px;

    ${media.tablet}{
        padding: 32px 36px;
        width: 420px;
        height: 280px;
    }

    ${media.phone}{
        padding: 10px 16px;
        width: 240px;
        height: 160px;
        
    }
`;

const PersonalInfoUpper = styled.div`
    width: 100%;
    display: flex;
    justify-content:space-between;
    align-items: center;
`;

const IDTxt = styled.p`
    margin-right : 1.4em;
    font-size: 1.2rem;
    font-weight: 800;
    line-height:20px;
    color: #00A0FF;
    ${media.tablet}{
        margin-right : 1.2em;
    }

    ${media.phone}{
        margin-right : 0.6em;
        font-size: 1rem;
    }
`;

const IconBox = styled.div`
    width: 40px;
    height: 40px;
    margin-right : 0.4em;

    font-size: 1.8rem;
    color: #00A0FF;
    text-align: center;

    ${media.tablet}{
        margin-right : 0.2em;
    }
    ${media.phone}{
        width: 32px;
        height: 36px;
        font-size: 1.6rem;
        margin-right : 0em;
        margin-top: 8px;
    }
`;

const BlueBtn = styled.button`
    width: 130px;
    height: 45px;

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

    ${media.tablet}{
        width: 100px;
        height: 38px;
    }
    ${media.phone}{
        width: 78px;
        height: 30px;
        font-size: 0.8rem;
    }
`;

const PersonalRecord = styled.p`
    margin-top: 15px;
    font-weight: 500;
    font-size: 1rem;

    ${media.phone}{
        margin-top: 6px;
    }
`;

const PersonalDescription = styled.p`
    width: 517px;
    height: 168px;
    margin-top: 25px;
    padding: 4px 8px;

    ${media.tablet}{
        width: 340px;
        height: 120px;
    }
    ${media.phone}{
        margin-top: 12px;
        width: 190px;
        height: 50px;
        font-size: 0.4rem;
    }
`;

function PersonalInfo({personalInfo}:{personalInfo:IPersonalInfoProps | undefined}){

    const photoData = personalInfo?.photo;
    const [isFollow, setIsFollow] = useState<boolean>(false);

    // follow 버튼 클릭 시, 해당 작가의 팔로우 추가
    const onIsFollowHandler = () => {
        setIsFollow(!isFollow);
        const body = {
            follow: !isFollow,
            key : personalInfo?.key,
        };
        followUser(body).then(
            response => {
                console.log(response);
        });
    };

    useEffect(() => {
        // 현재 작가 페이지의 팔로우 이력을 가져온다.
        getIsFollow({key : personalInfo?.key,}).then(
            response=>{
                if(response.payload.success){
                    setIsFollow(response.payload.result);
                }
            }
        );
    }, [personalInfo?.key]);
    
    return (
    <>
        <GlobalStyle />
        <Whole>
            {/* personal img 영역 */}
            <PersonalImg src={ !personalInfo?.personalImgName ? defaultImg : `${SERVER_PATH}${personalInfo?.personalImgPath}` } />

            <PersonalInfoBox>
                <PersonalInfoUpper>
                    {/* 작가명, homepage, twitter 아이콘 */}
                    <div style={{ display:"flex", alignItems: "center"}}>
                        <IDTxt>{personalInfo?.authorName}</IDTxt>
                        <IconBox> <a target="_blank" href={"https://" + personalInfo?.homepage}> <FontAwesomeIcon icon={faHome}/> </a> </IconBox>     
                        <IconBox> <a target="_blank" href={"https://" + personalInfo?.twitter}> <FontAwesomeIcon icon={faTwitter}/> </a> </IconBox>
                    </div>

                    {/* 자신 개인 페이지면 프로필 변경 아이콘, 다른 사람이 들어온 경우면 follow 버튼 */}
                    {personalInfo?.isUser && <div>
                        <Link to='/personal_modify'>
                            <BlueBtn >프로필 변경</BlueBtn>
                        </Link>
                    </div>}
                    {!personalInfo?.isUser && <BlueBtn onClick={onIsFollowHandler} >{isFollow ? `Followed!` : `Follow!`}</BlueBtn>}
                </PersonalInfoUpper>

                {/* // 작가의 작품수, follower, follow 기록을 보여줌 */}
                <PersonalRecord>
                    작품 수&nbsp;&nbsp;&nbsp;&nbsp;{photoData?.length}&nbsp;&nbsp;&nbsp;&nbsp;
                    Follower&nbsp;&nbsp;&nbsp;&nbsp;{personalInfo?.follower.length}&nbsp;&nbsp;&nbsp;&nbsp;
                    Follow&nbsp;&nbsp;&nbsp;&nbsp;{personalInfo && personalInfo.follow.length + Number(isFollow)}
                </PersonalRecord>

                {/* // 작가 설명 */}
                <PersonalDescription>
                    {personalInfo?.instruction}
                </PersonalDescription>
            </PersonalInfoBox>
        </Whole>
    </>);
}
export default PersonalInfo;