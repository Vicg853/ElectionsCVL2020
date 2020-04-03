import styled, {css} from "styled-components";
import { Theme } from "../globalStyle";

export const PresentationContainer = styled.div`
    width: 100vw;
    height: 90vh;
    background-color: ${Theme.accent2};
    background-image: url("${props => props.backgroundURL}");
    background-size: cover;
    background-position: center center;
    padding-top: 220px;
    position: relative;
    overflow: hidden;
    h1{
        margin-left: 110px;
        margin-right: 110px;
        color: ${Theme.accent1};
        font-weight: 600;
        max-width: 700px;
        ::after{
            display: block;
            content: "";
            width: 15%;
            height: 4px;
            background-color: ${Theme.accent1};
            margin-top: 20px;
        }
        z-index: 1;
        position: relative;
    }
    h2{
        font-size: 18px;
        font-weight: 500;
        color: ${Theme.accent1};
        margin-left: 110px;
        margin-right: 110px;
        max-width: 400px;
        margin-top: 60px;
        z-index: 1;
        position: relative;
    }
    ::before{
        display: block;
        position: absolute;
        content: "";
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: ${Theme.background};
        opacity: .3;
    }
    @media screen and (max-width: 720px){
        h1, h2{
            margin-left: 60px;
            margin-right: 60px;
        }
    }
    @media screen and (max-width: 400px){
        h1, h2{
            margin-left: 25px;
            margin-right: 25px;
        }
    }
    @media screen and (max-width: 350px) and (max-height: 630px){
        h1{
            font-size: 23px;
        }
        h2{
            font-size: 16px;
        }
    }
`;

export const Container = styled.div`
    width: 100vw;
    min-height: 100vh;
    background-color: ${Theme.accent2};
    display: flex;
    flex-direction: column;
    padding-left: 100px;
    padding-right: 100px;
    padding-top: 70px; 
    h1{
        font-size: 22px;
        font-weight: 500;
        color: ${Theme.accent1};
        ::after{
            display: block;
            content: "";
            width: 60px;
            height: 4px;
            background-color: ${Theme.accent1};
            margin-top: 7px;
        }
        @media screen and (max-width: 716px) {
            padding-left: 50px;
            padding-right: 50px;
        }
    }
    sub{
        display: inline-flex;
        flex-wrap: wrap;
        width: calc(100% + 2.5%);
        justify-content: center;
        @media screen and (max-width: 716px) {
            width: 100vw;
        }
        padding-bottom: 40px;
    }
    @media screen and (max-width: 716px) {
        padding-left: 0px;
        padding-right: 0px;
    }
`;

export const ElectionCard = styled.div`
    width: 400px;
    height: 246px;
    display: block;
    position: relative;
    margin: 1.15%;
    border-radius: ${Theme.borderRadius};
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    overflow: hidden;
    margin-top: 30px;
    div{
        width: 100%;
        height: 100%;
        position: absolute;
        background-size: cover;
        background-position: center center;
        background-color: ${Theme.backgroundLowOpacity};
        background-image: url('${props => props.backgroundURL}');
        margin: 0px;
        padding: 0;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        ${props => props.ShimmerEffectActive && css`
            filter: blur(7px);
        `}
    }
    h1{
        font-size: 21px;
        font-weight: 600;
        color: ${Theme.accent1};
        z-index: 2;
        ::after{
            display: none;
        }
        @media screen and (max-width: 716px) {
            padding-left: unset !important;
            padding-right: unset !important;
        }
        ${props => props.ShimmerEffectActive && css`
            border-radius: ${Theme.borderRadius};
            margin-bottom: 3px;
            width: 150px;
            filter: blur(0.2px);
        `}
    }
    h2{
        z-index: 2;
        font-size: 16px;
        font-weight: 400;
        color: ${Theme.accent1};
        margin-bottom: 40px;
        ${props => props.ShimmerEffectActive && css`
            border-radius: ${Theme.borderRadius};
            width: 150px;
            filter: blur(0.2px);
        `}
    }
    ::before{
        z-index: 1;
        display: block;
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 200px;
        background-color: ${Theme.backgroundLowOpacity};
    }
    ::after{
        ${props => props.Results ? css`
            content: "${props => props.ShimmerEffectActive ? "Chargement en cours" : "Resultats ❯" }";
        ` : css`
            content: "${props => props.ShimmerEffectActive ? "Chargement en cours" : "Voter ❯" }";
        `}
        display: flex;
        height: 46px;
        background-color: ${Theme.accent1};
        color: ${Theme.accent2};
        position: absolute;
        width: 100%;
        top: 200px;
        left: 0;
        right: 0;
        bottom: 0;
        font-size: 17px;
        font-weight: 700;
        justify-content: center;
        justify-items: center;
        align-content: center;
        align-items: center;
        text-align: center;
        z-index: 2;
    }
    transition: 0.3s;
    :hover{
        cursor: pointer;
        transform: translateY(-3px);
        box-shadow: 0px 10px 20px 2px rgba(0,0,0,0.17);

    }
    @media screen and (max-width: 716px) {
        margin: 0px;
        margin-top: 40px;
    }
    @media screen and (max-width: 500px){
        width: 94vw;
    }
`;