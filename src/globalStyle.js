import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'gatsby';

export const Theme = {
    background: "#222334",
    backgroundLowOpacity: "rgba(34, 35, 52, 0.35)",
    accent1: "#FFFFFF",
    accent2: "#4c6192",
    borderRadius: "3px"
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
    
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: none !important;
      background-color: transparent !important;
    }
    
    ::-webkit-scrollbar {
      width: 6px !important;
      background-color: transparent;
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: #acacac;
    }
    .Shimmer-shimmer-0-1-1{
        background-image: linear-gradient(90deg, rgba(34,35,52,0) 42%, rgba(34,35,52,0.45) 54%, rgba(34,35,52,0.45) 56%, rgba(34,35,52,0) 69%) !important;
    }
`;

export const CustomLink = styled(Link)`
    text-decoration-line: none;
    color: ${props => props.TextColor ? props.TextColor : Theme.accent1};
    outline: none;
    transition: 0.3s;
    font-weight: 700;
    font-size: 20px;
    margin: 10px;
    :hover{
        opacity: 0.7;
        cursor: pointer;
    }
`;