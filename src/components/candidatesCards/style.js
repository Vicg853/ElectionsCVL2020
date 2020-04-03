import styled from "styled-components";

import {
    Theme
} from '../../globalStyle';

export const CardContainer = styled.div`
    display: flex;
    justify-self: center;
    width: 400px;
    height: 430px;
    display: flex;
    flex-direction: column;
    border-radius: ${Theme.borderRadius};
    overflow: hidden;
    box-shadow: 4px 12px 47px 0 rgba(0,0,0,.2);
    position: relative;
    break-inside: avoid;
    page-break-inside: avoid;
    span{
        position: absolute;
        top: 0;
        left: 20px;
        right: 20px;
        display: flex;
        justify-content: space-between;
        z-index: 1;
        margin-top: 20px;
        h1{
            color: ${Theme.accent1};
            font-size: 20px;
            font-weight: 700;
        }
    }
    sub{
        display: flex;
        width: 400px;
        height: 250px;
        background-image: url("${props => props.backgroundURL}");
        background-size: cover;
        background-position: center center;
        justify-content: center;
        align-items: flex-end;
        position: relative;
        ::before{
            display: block;
            content: "";
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, rgba(34,35,52,0.8463760504201681) 15%, rgba(60,74,111,0.6558998599439776) 39%, rgba(76,97,146,0.6278886554621849) 56%, rgba(76,97,146,0.6558998599439776) 86%);
            opacity: 0.9;
        }
        h1{
            position: absolute;
            font-size: 21px;
            font-weight: 700;
            color: ${Theme.accent1};
            z-index: 1;
            bottom: 50px;
        }
    }
    div{
        background-color: ${Theme.accent1};
        width: 100%;
        height: 230px;
        display: flex;
        justify-content: center;
        h1{
            color: ${Theme.accent2};
            font-size: 16px;
            font-weight: 300;
            width: 95%;
            z-index: 1;
            background: ${Theme.accent1};
            border-radius: ${Theme.borderRadius};
            padding: 1rem;
        }
    }
    @media screen and (max-width: 430px){
        width: 98vw; 
        sub{
            width: 98vw;
        }
    }
`;