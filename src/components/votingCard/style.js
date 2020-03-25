import styled, { css, keyframes } from "styled-components";

import {
    Theme
} from "../../globalStyle";

export const Container = styled.div`
    width: 100vw;
    min-height: 500px;
    background-color: ${Theme.background};
    overflow: hidden;
    border-radius: ${Theme.borderRadius};
    display: inline-flex;
    align-items: center;
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
`;

export const VoteFrm = styled.div`
    width: 45%;
    height: 100vh;
    padding-top: 170px;
    padding-bottom: 170px;
    margin-left: 7.5%;
    display: flex;
    flex-direction: column;
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
    background: ${Theme.accent2};
    font-size: 17px;
    font-weight: 400;
    border-radius: ${Theme.borderRadius};
    color: ${Theme.accent1};
    border: 3px solid ${Theme.accent2};
    transition: 0.5s;
    ${props => props.ErrorInput && css`
        border: 3px solid red;
        animation: 0.55s ease-in ${ErrorInput};
    `}
    ::placeholder{
        font-size: 17px;
        font-weight: 400;
        color: ${Theme.accent1};
        opacity: 0.7;
    }
`;

export const SelectScrollContainer = styled.div`
    width: auto;
`;

export const DefaultSelect = styled.select`
    width: 350px;
    padding: 15px;
    margin-top: 5px;
    margin-bottom: 15px;
    background: ${Theme.accent2};
    font-size: 17px;
    font-weight: 400;
    border-radius: ${Theme.borderRadius};
    color: ${Theme.accent1};
    border: 3px solid ${Theme.accent2};
    transition: 0.5s;
    ${props => props.ErrorInput && css`
        border: 3px solid red;
        animation: 0.55s ease-in ${ErrorInput};
    `}
    ::placeholder{
        font-size: 17px;
        font-weight: 400;
        color: ${Theme.accent1};
        opacity: 0.7;
    }
`;

export const DefaultButton = styled.button`
    width: 350px;
    padding: 15px;
    margin-top: 20px;
    margin-bottom: 60px;
    background: ${Theme.accent2};
    font-size: 17px;
    font-weight: 600;
    border-radius: ${Theme.borderRadius};
    color: ${Theme.accent1};
    border: none;
    transition: 0.5s;
    ${props => props.ErrorInput && css`
        background: red;
    `}
    :hover{
        cursor: pointer;
    }
`;