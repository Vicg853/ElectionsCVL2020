import styled from "styled-components";

import {
    Theme
} from "../globalStyle";

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    position: relative;
    display: inline-flex;
    span{
        display: block;
        width: 100%;
        height: 100%;
        background-image: url("${props => props.backgroundURL}");
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
    }
    sub{
        width: 450px;
        position: absolute;
        justify-self: center;
        align-self: center;
        background: ${Theme.background};
        margin-left: 70px;
        border-radius: ${Theme.borderRadius};
        title{
            display: block;
            width: 100%;
            padding: 1.2rem;
            color: ${Theme.accent1};
            font-size: 21px;
            font-weight: 700;
        }
        article{
            width: 100%;
            padding: 1.2rem;
            color: ${Theme.accent1};
            font-size: 16px;
            font-weight: 300;          
        }
        span{
            width: 130px;
            height: 130px;
            margin-left: calc((100% - 130px) / 2);
            margin-right: calc((100% - 130px) / 2);
            border-radius: 50%;
            margin-top: -65px;
            background-image: url("${props => props.userImage}");
        }
    }
    @media screen and (max-width: 1000px){
        justify-content: center;
        align-content: center;
        sub{
            margin: 0px;
        }
    }
    @media screen and (max-width: 420px){
        align-items: unset;
        justify-content: center;
        sub{
            width: 100vw;
            height: calc(100vh - 110px);
            overflow: hidden;
            overflow-y: scroll;
            justify-self: unset;
            align-self: unset;
            margin-top: 110px;
            span{
                width: 100%;
                height: 200px;
                margin: 0px;
                border-radius: 0px;
            }
        }
    }
`;