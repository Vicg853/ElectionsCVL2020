import { createGlobalStyle } from 'styled-components';

export const Theme = {
    background: "#222334",
    backgroundLowOpacity: "rgba(34, 35, 52, 0.35)",
    accent1: "#FFFFFF",
    accent2: "#4c6192",
    borderRadius: "5px"
};

export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0px;
        padding: 0px;
        -webkit-font-smoothing: antialiased !important;
        text-rendering: optimizeLegibility !important;
        text-decoration-line: none;
        outline: none;
        font-family: "Montserrat";
        box-sizing: border-box; 
    }
    html{
        width: 100vw;
        height: 100vh;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    body{
        width: 100vw;
        overflow: hidden;
    }
`;