import styled from "styled-components";

import {
    Theme
} from "../globalStyle";

export const CandidatesCardsContainer = styled.div`
    width: 100vw;
    height: fit-content;
    overflow: hidden;
    title{
        width: 100%;
        max-width: 1000px;
        display: block;
        opacity: 0.8;
        color: ${Theme.accent2};
        font-size: 21px;
        font-weight: 700;
        margin-top: 50px;
        ::after{
            display: block;
            content: "";
            width: 80px;
            height: 4px;
            background-color: ${Theme.accent2};
            margin-top: 15px;
            margin-bottom: 50px;
        }
    }
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-left: 10%;
    padding-right: 10%;
    @media screen and (max-width: 1033px) {
        padding-left: unset;
        padding-right: unset;
        align-items: flex-start;
        title{
            width: 300px;
            max-width: unset;
            margin-left: 5vw;
        }
    }
    @media screen and (max-width: 395px){
        title{
            width: 100vw;
            display: flex;
            flex-direction: column;
            align-content: center;
            text-align: center;
            margin-left: 0px;
            ::after{
                margin-left: calc((100% - 80px) / 2);
                margin-right: calc((100% - 80px) / 2);
            }
        }
    }
`;

export const SubContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: 1000px;
    @media screen and (max-width: 1033px) {
        width: 100vw;
        max-width: unset;
    }
`;

export const CardCol = styled.div`
    display: flex;
    min-width: 400px;
    margin-left: calc((100% - 800px) / 4);
    margin-right: calc((100% - 800px) / 4);
    margin-top: 15px;
    margin-bottom: 15px;
    @media screen and (max-width: 870px){
        margin-left: calc((100% - 400px) / 2);
        margin-right: calc((100% - 400px) / 2);
        margin-top: 30px;
        margin-bottom: 30px;
    }
    @media screen and (max-width: 430px){
        width: 98vw;
        margin-left: 1vw;
        margin-right: 1vw;
    }
`;