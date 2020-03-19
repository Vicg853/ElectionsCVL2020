import styled from "styled-components";

import {
    Theme
} from "../../globalStyle";

export const Container = styled.div`
    width: fit-content;
    height: fit-content;
    position: fixed;
    top: 150px;
    margin-left: ${props => props.Display ? "25px" : "-100vw"};
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 12px;
    padding-bottom: 12px;
    background: ${Theme.accent1};
    border-radius: ${Theme.borderRadius};
    border: 3px solid ${props => props.TypeOfCard === 0 ? "green" : "red"};
    transition: 0.5s;
    font-size: 19px;
    color: ${props => props.TypeOfCard === 0 ? "green" : "red"};
    font-weight: 600;
`;

export const Container2 = styled.div`
    width: 100vw;
    height: 100vh;
    background: ${Theme.backgroundLowOpacity};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: ${props => props.Display ? "flex" : "none"};
    justify-content: center;
    align-items: center;
    z-index: 5;
    div{
        width: 70%;
        height: 70%;
        background: ${Theme.accent1};
        border-radius: ${Theme.borderRadius};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    span{
        width: 300px;
        height: 300px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    article{
        font-size: 18px;
        font-weight: 700;
        color: ${Theme.background};
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
`;

export const ButtonCloseCard = styled.button`
    width: fit-content;
    height: fit-content;
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 25px;
    padding-right: 25px;
    background: ${Theme.background};
    color: ${Theme.accent1};
    border-radius: ${Theme.borderRadius};
    font-weight: 700;
    font-size: 18px;
    margin-top: 15px;
    &:hover{
        cursor: pointer;
    }
`; 