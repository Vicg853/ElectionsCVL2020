import styled from "styled-components";
import { Link } from "gatsby";
import { Theme } from "../globalStyle";

export const PresentationContainer = styled.div`
    width: 100vw;
    height: 90vh;
    background-color: ${Theme.accent2};
    background-image: url("${props => props.backgroundURL}");
    background-size: cover;
    background-position: center center;
    padding-top: 220px;
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
    }
    h2{
        font-size: 18px;
        font-weight: 500;
        color: ${Theme.accent1};
        margin-left: 110px;
        margin-right: 110px;
        max-width: 400px;
        margin-top: 60px;
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

export const ElectionCard = styled(Link)`
    width: 400px;
    height: 200px;
    display: block;
    margin: 1.15%;
    border-radius: ${Theme.borderRadius};
    background-size: cover;
    background-position: center center;
    background-image: url('${props => props.backgroundURL}');
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    overflow: hidden;
    margin-top: 30px;
    h1{
        font-size: 21px;
        font-weight: 600;
        color: ${Theme.accent1};
        z-index: 2;
        ::after{
            display: none;
        }
    }
    h2{
        z-index: 2;
        font-size: 16px;
        font-weight: 400;
        color: ${Theme.accent1};
    }
    ::after{
        z-index: 1;
        display: block;
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background-color: ${Theme.backgroundLowOpacity};
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
`;