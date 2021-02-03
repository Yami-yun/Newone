import { media } from 'component/customMediaQuery';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    html {
        ${media.tablet}{
            font-size: 12px;
        }

        ${media.phone}{
            font-size: 10px;
        }
    };
    * {
        margin: 0;
        padding: 0;  
        /* font-size: 12px; */

    };

    body {
        margin: 0;
        padding: 0;
        font-family: 'Noto Sans KR', sans-serif;
        box-sizing: border-box;
        color: #000000;
    };

    section, div, input, button, img, article, header, footer{
        box-sizing: border-box;
        padding: 0px;
        margin: 0px;

        /* ${media.tablet}{
            font-size: 10px;
        } */
    };

    li{
        list-style: none;
        color: #00A0FF;
    };

    button{
        background: #ffffff;
        color: #00A0FF;
        border: none;
        cursor:pointer;
        &:focus{
            outline:none;
            /* background :#00A0FF; */
        }
    };

    input, textarea{
        color: #00A0FF;
        border: none;
        resize : vertical;
    };

    a{
        text-decoration: none;
        color: #00A0FF;

    };


`;

export default GlobalStyle;