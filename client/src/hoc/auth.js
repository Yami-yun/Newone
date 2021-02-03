import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { auth } from 'redux/actions/userAction';

export default function(SpecificComponent, option, adminRoute = null){

    function AuthenticationCheck(props){

        const dispatch = useDispatch();
        useEffect(()=>{
            dispatch(auth()).then(response=>{

                if(option !== 0){
                    if(option === 3 && response.payload.role !== 3){
                            props.history.push('/');
                            alert("잘못된 페이지 접근입니다.");
                    }

                    if(!response.payload.isAuth){
                        // 로그인 상태가 아니다.
                        if(option === 1){
                            // 로그인 상태가 아니고, 로그인해야만 하는 페이지로 사용자가 들어올 경우,
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
        }, []);

        return <SpecificComponent />;
    }


    return AuthenticationCheck;
}