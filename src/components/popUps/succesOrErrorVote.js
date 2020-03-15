import React from "react";
import Lottie from 'react-lottie';

import {
    Container2,
    ButtonCloseCard
} from "./style";

import {

} from "../../globalStyle"; 

import * as chargingAnimation from "../../lotties/charging.json";
import * as successAnimation from "../../lotties/success.json";
import * as errorAnimation from "../../lotties/error.json";

class SuccessOrErrorVotePopUp extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            typeOfMSG: 0, //Type of msg 0 == charging, 1 == error, 2 == success
            show: false
        };
    }

    hide = () => {
        this.setState({
            show: false
        });
    }

    updateMsg = (type) => {
        this.setState({
            typeOfMSG: type,
        });
    }

    show = (type) => {
        this.setState({
            typeOfMSG: type,
            show: true
        });
    }

    render(){
        var {
            show,
            typeOfMSG
        } = this.state;

        const chargingAnimationOptions = {
            loop: true,
            autoplay: true, 
            animationData: chargingAnimation.default,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          };

          const successAnimationOptions = {
            loop: false,
            autoplay: true, 
            animationData: successAnimation.default,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          };

          const errorAnimationOptions = {
            loop: false,
            autoplay: true, 
            animationData: errorAnimation.default,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          };

        return(
            <>
                <Container2
                Display={show}>
                    <div>
                        <span>
                            {typeOfMSG === 0 && <Lottie 
                            options={chargingAnimationOptions}
                            height={300}
                            width={300}
                            isStopped={this.state.isStopped}
                            isPaused={this.state.isPaused}/>}
                            {typeOfMSG === 1 && <Lottie 
                            options={successAnimationOptions}
                            height={500}
                            width={500}
                            isStopped={this.state.isStopped}
                            isPaused={this.state.isPaused}/>}
                            {typeOfMSG === 2 && <Lottie 
                            options={errorAnimationOptions}
                            height={300}
                            width={300}
                            isStopped={this.state.isStopped}
                            isPaused={this.state.isPaused}/>}
                        </span>
                        <article>
                            {typeOfMSG === 0 && "Validation du vote en cours..."}
                            {typeOfMSG === 1 && "Succes dans la validation du vote !"}
                            {typeOfMSG === 2 && "Erreur lors de la validation de votre vote !"}
                            {typeOfMSG > 0 &&
                                <ButtonCloseCard
                                onClick={() => this.hide()}>
                                        J'ai pris connaisance de cette info
                                </ButtonCloseCard>       
                            }
                        </article>
                    </div>
                </Container2>
            </>
        );
    }
}

export default SuccessOrErrorVotePopUp;