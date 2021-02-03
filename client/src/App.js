// import Search from './component/Search';
import styled from 'styled-components';

import GlobalStyle from './globalStyles';

import Main from 'page/main/Main';
import Personal from 'page/personal/Personal';
import Photo from 'page/photo/Photo';
import Login from 'page/login/Login';
import Register from 'page/register/Register';
import PhotoUpload from 'page/upload/PhotoUpload';

import {Switch, Route} from "react-router-dom";
import Auth from './hoc/auth';
import PersonalModify from 'page/personal/PersonalModify';
import PhotoModify from 'page/upload/PhotoModify';

import Test from 'component/Test';
import SearchPage from 'page/search/SearchPage';
import FindPassword from 'page/findPassowrd/FindPassord';
import Admin from 'page/admin/Admin';

const Whole = styled.section``;


function App() {
  return (
    <>
      <GlobalStyle />
      <Whole>
        <Switch>
          {/* // 0 : 로그인 상관없는 페이지,  1 : 로그인 필요 페이지,  2: 로그인한 유저는 출입 불가능 페이지 */}
          <Route exact path="/" component={Auth(Main, 0)}/>
          <Route path="/personal/:id" component={Auth(Personal, 1)}/>
          <Route path="/login" component={Auth(Login, 2)}/>
          <Route path="/register" component={Auth(Register, 2)}/>
          <Route path="/photo/:id" component={Auth(Photo, 1)}/>
          <Route path="/upload" component={Auth(PhotoUpload, 1)}/>
          <Route path="/photo_modify" component={Auth(PhotoModify, 1)}/>
          <Route path="/personal_modify" component={Auth(PersonalModify, 1)}/>
          <Route path="/test" component={Auth(Test, 0)}/>
          <Route path="/search/:text" component={Auth(SearchPage, 1)}/>
          <Route path="/findpassword" component={Auth(FindPassword, 0)}/>
          <Route path="/admin" component={Auth(Admin, 3)}/>

          
        </Switch>
        
      </Whole>
    </>
  );
}

export default App;

