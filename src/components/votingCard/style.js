import styled, { css, keyframes } from "styled-components";

import {
    Theme
} from "../../globalStyle";

const animateArrowInfinite = keyframes`
    0%{
        transform: translateY(0px);
    }
    50%{
        transform: translateX(7px);
    }
    100%{
        transform: translateY(0px);
    }
`;


export const Container = styled.div`
    width: 100vw;
    min-height: 500px;
    background-color: ${Theme.background};
    overflow: hidden;
    border-radius: ${Theme.borderRadius};
    display: inline-flex;
    align-items: center;
    @media screen and (max-width: 870px){
        position: relative;
    }
    span{
        width: fit-content;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: ${Theme.accent1};
        font-size: 20px;
        font-weight: 500;
        position: absolute;
        right: -100px;
        border-radius: ${Theme.borderRadius};
        transform: rotate(90deg);
        background-color: ${Theme.background};
        padding: 0.2rem;
        padding-left: 0.8rem;
        padding-right: 0.8rem;
        ::after{
            content: "→";
            display: block;
            animation: ${animateArrowInfinite} infinite 1s;
            margin-left: 5px;
        }
    }
`;

export const SideImageContainer = styled.div`
    width: 40%;
    height: 100vh;
    background-image: url("${props => props.BackgroundUrl}");
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-end;
    article{
        color: ${Theme.accent2};
        font-weight: 700;
        font-size: 14px;
        padding: 15px;
        margin-left: 25px;
        margin-bottom: 25px;
        margin-right: 25px;
        background: ${Theme.accent1};
        border-radius: ${Theme.borderRadius};
        border: 1px solid ${Theme.background};
    }
    a{
        color: ${Theme.accent2};
        text-decoration-color: ${Theme.accent2};
        text-decoration-line: underline;
    }
    @media screen and (max-width: 870px){
        width: 100vw;
        filter: blur(4px);
        article{
            display: none;
        }
    }
`;

export const VoteFrm = styled.div`
    width: calc(52.5% - 12px);
    height: 100vh;
    padding-top: 140px;
    padding-bottom: 20px;
    margin-left: 7.5%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
    overflow-x: hidden;
    label{
        width: 350px;
        color: ${Theme.accent1};
        font-size: 20px;
        font-weight: 700;
    }
    title{
        font-size: 26px;
        font-weight: 600;
        color: ${Theme.accent1};
        display: block;
        width: fit-content;
        height: fit-content;
        margin-bottom: 40px;
    }
    @media screen and (max-width: 870px){
        position: absolute;
        width: 500px;
        height: 80vh;
        max-height: 650px;
        margin-left: calc((100% - 500px) / 2);
        margin-right: calc((100% - 500px) / 2);
        background-color: ${Theme.background};
        margin-bottom: 20px;
        overflow: scroll;
        overflow-x: hidden;
        padding: 1rem;
        padding-top: 20px;
        border-radius: ${Theme.borderRadius};
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    @media screen and (max-width: 560px){
        width: 100vw;
        height: 100vh;
        margin: 0px;
        padding-top: 140px;
        max-height: unset;
        background-color: transparent;
        input, select, button{
            background-color: ${Theme.accent1};
            color: ${Theme.background};
            border: solid ${Theme.accent1} 3px;
            ::placeholder{
                color: ${Theme.background};
            }
        }
    }
    @media screen and (max-width: 400px){
        label{
            width: 100vw;
            position: relative;
            left: 5vw;
            right: 5vw;
            font-size: 1.1rem;
        }
    }
`;

const ErrorInput = keyframes`
    0%{
        transform: translateX(0px);
    }
    25%{
        transform: translateX(-7px);
    }
    75%{
        transform: translateX(7px);
    }
    100%{
        transform: translateX(0px);
    }
`;

export const DefaultInput = styled.input`
    width: 350px;
    padding: 15px;
    margin-top: 5px;
    margin-bottom: 30px;
    background: ${Theme.background};
    font-size: 17px;
    font-weight: 400;
    border-radius: ${Theme.borderRadius};
    color: ${Theme.accent1};
    border: 3px solid ${Theme.accent2};
    transition: 0.5s;
    ${props => props.ErrorInput && css`
        border: 3px solid red !important;
        animation: 0.55s ease-in ${ErrorInput};
    `}
    ::placeholder{
        font-size: 17px;
        font-weight: 400;
        color: ${Theme.accent1};
        opacity: 0.7;
    }
    @media screen and (max-width: 400px){
        width: 90vw;
        margin-left: 5vw;
        margin-right: 5vw;
    }
`;

export const SelectScrollContainer = styled.div`
    width: auto;
    height: 100px;
    overflow: scroll;
    overflow-x: hidden;
`;

export const DefaultSelect = styled.select`
    width: 350px;
    margin-top: 5px;
    margin-bottom: 15px;
    background: ${Theme.background};
    font-size: 17px;
    font-weight: 400;
    border-radius: ${Theme.borderRadius};
    color: ${Theme.accent1};
    border: 3px solid ${Theme.accent2};
    transition: 0.5s;
    ${props => props.ErrorInput && css`
        border: 3px solid red !important;
        animation: 0.55s ease-in ${ErrorInput};
    `}
    ::placeholder{
        font-size: 17px;
        font-weight: 400;
        color: ${Theme.accent1};
        opacity: 0.7;
    }
    @media screen and (max-width: 400px){
        width: 90vw;
        margin-left: 5vw;
        margin-right: 5vw;
    }
`;

export const DefaultButton = styled.button`
    width: 350px;
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 60px;
    box-sizing: border-box;
    background: ${Theme.background};
    font-size: 17px;
    font-weight: 600;
    border: solid ${Theme.accent2} 3px;
    border-radius: ${Theme.borderRadius};
    color: ${Theme.accent1};
    transition: 0.5s;
    ${props => props.ErrorInput && css`
        border: solid red 3px !important;
        background: red !important;
    `}
    :hover{
        cursor: pointer;
    }
    @media screen and (max-width: 400px){
        width: 90vw;
        margin-left: 5vw;
        margin-right: 5vw;
    }
`;