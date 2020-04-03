import styled from "styled-components";

import {
    Theme
} from "../../globalStyle";

export const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: ${props => props.ScrolledAfterLimit ? "90px" : "110px"};
    background-color: ${props => props.ScrolledAfterLimit ? Theme.background : Theme.backgroundLowOpacity};
    display: flex;
    padding-left: ${props => props.ScrolledAfterLimit ? "50px" : "100px"};
    padding-right: ${props => props.ScrolledAfterLimit ? "50px" : "100px"};
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    div{
        width: max-content;
        height: 100%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        transition: 0.4s;
        margin-left: 15px;
        margin-right: 15px;
    }
    transition: 0.4s;
    z-index: 3;
    h1, h2{ 
        color: ${props => props.ScrolledAfterLimit ? Theme.accent1 : Theme.accent1};
        transition: 0.4s;
    }
    h1{
        font-weight: 600;
        font-size: 27px;
    }
    h2{
        font-weight: 300;
        font-size: 20px;
        text-align: right;
    }
    @media screen and (max-width: 1000px){
        padding-left: 50px;
        padding-right: 50px;
        h1, h2{
            max-width: 300px;
        }
    }
    @media screen and (max-width: 720px){   
        display: flex;
        flex-direction: column;
        h1{ 
            margin-top: 15px;
            order: 1; 
            max-width: unset !important;
        }
        h2{
            margin-top: 4px;
            order: 2; 
            max-width: unset !important;
        }
        div{ order: 3; }
        background-color: ${Theme.background};
        height: 130px;
    }
    @media screen and (max-width: 450px){
        padding: 4px;
    }
    @media screen and (max-width: 350px){
        text-align: center;
        h1{
            font-size: 24px;
        }
        h2{
            display: none;
        }
        height: 110px;
    }
`;

