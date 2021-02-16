import {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { auth } from 'redux/actions/userAction';

// 현재 사용자가 해당 페이지에 접근 가능한지 여부 확인
export default function(SpecificComponent, option){

    function AuthenticationCheck(props){

        const dispatch = useDispatch();
        useEffect(()=>{
            dispatch(auth()).then(response=>{
                /// option 0 : 로그인 상관없는 페이지,  1 : 로그인 필요 페이지,  2: 로그인한 유저는 출입 불가능 페이지 , 3: 관리자 페이지
                if(option !== 0){

                    // 사이트 관리자가 아닌 자가 관리자 페이지에 접근할 경우.
                    if(option === 3 && response.payload.role !== 3){
                            props.history.push('/');
                            alert("잘못된 페이지 접근입니다.");
                    }

                    // 로그인 상태가 아닐 경우
                    if(!response.payload.isAuth){

                        if(option === 1){
                            // 로그인 상태가 아니고, 로그인 정보가 필요한 페이지로 사용자가 들어올 경우,
                            props.history.push('/login');
                            alert("로그인 해주시길 바랍니다.");
                        }
                    }else{
                        // 로그인 상태이다.
                        if(option === 2){
                            // 로그인 한 상태, register, login 페이지 같은 비로그인 상태만 허용되는 페이지로 로그인된 사용자가 들어올 경우  >> main 홈으로 이동
                            props.history.push('/');
                        }
                    }
                }

            });
        });

        return <SpecificComponent />;
    }


    return AuthenticationCheck;
}