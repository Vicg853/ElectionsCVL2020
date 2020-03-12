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
    height: ${props => props.ScrolledAfterLimit ? "80px" : "110px"};;
    background-color: ${props => props.ScrolledAfterLimit ? Theme.background : Theme.backgroundLowOpacity};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: ${props => props.ScrolledAfterLimit ? "60px" : "100px"};
    padding-right: ${props => props.ScrolledAfterLimit ? "60px" : "100px"};
    transition: 0.4s;
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
    }
`;

