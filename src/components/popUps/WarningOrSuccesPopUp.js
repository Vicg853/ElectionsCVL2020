import React from "react";

import {
    Container,
} from "./style";

import {

} from "../../globalStyle";

var Timer;

class WarningOrSuccessPopUp extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            typeOfMSG: 0,
            MSG: "",
            show: false
        };
    }

    hide = () => {
        this.setState({
            show: false
        });
    }

    show = (type, msg) => {
        this.setState({
            typeOfMSG: type,
            MSG: msg,
            show: true
        });
        if(typeof window !== 'undefined' && window){
            window.clearTimeout(Timer);
            Timer = window.setTimeout(() => {this.hide()}, 4000);
        }
        return true;
    }

    render(){
        var {
            show,
            MSG,
            typeOfMSG
        } = this.state;
        return(
            <>
                <Container
                Display={show}
                TypeOfCard={typeOfMSG}>
                    {MSG}
                </Container>
            </>
        );
    }
}

export default WarningOrSuccessPopUp;