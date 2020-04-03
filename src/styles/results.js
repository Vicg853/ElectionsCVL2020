import styled from "styled-components";

import {
    Theme
} from "../globalStyle";

export const ResultsContainer = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: ${Theme.background};
    display: inline-flex;
    sub{
        position: absolute;
        justify-self: center;
        align-self: center;
        align-items: center;
        width: 700px;
        max-height: 80vh;
        margin-left: calc((100% - 700px) / 2);
        margin-right: calc((100% - 700px) / 2);
        color: white;
        background: ${Theme.accent1};
        border-radius: ${Theme.borderRadius};
        overflow: scroll;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        z-index: 1;
        title{
            display: block;
            width: 100%;
            padding: 1.3rem;
            color: ${Theme.background};
            font-size: 19px;
            font-weight: 700;
        }
        article{
            display: none;
            width: 90vw;
            padding: 1.3rem;
            font-size: 17px;
            font-weight: 600;
        }
    }
    span{
        width: 100%;
        height: 100%;
        display: block;
        background-image: url("${props => props.backgroundURL}");
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        filter: blur(3px);
    }
    @media screen and (max-width: 720px){
        sub{
            width: 95vw;
            margin-left: 2.5vw;
            margin-right: 2.5vw;   
        }
    }
    @media screen and (max-width: 575px){
        sub{
            justify-self: unset;
            align-self: unset;
            justify-content: flex-start;
            align-items: flex-start;
            max-height: unset;
            margin-top: calc(5vh + 130px);
            margin-bottom: 5vh;
            height: calc(90vh - 130px);
            overflow-x: scroll;
        }
        article{
            display: block !important;
            color: ${Theme.background};
        }
    }
`;