import React from "react";

import WarningOrSuccessPopUp from "./WarningOrSuccesPopUp";
import SuccessOrErrorVotePopUp from "./succesOrErrorVote";

export const WarningOrSuccessPopUpRef = React.createRef();
export const SuccessOrErrorVotePopUpRef = React.createRef();

class PopUpAssembler extends React.Component{
    render(){
        return(
            <>
                <WarningOrSuccessPopUp ref={WarningOrSuccessPopUpRef} />
                <SuccessOrErrorVotePopUp ref={SuccessOrErrorVotePopUpRef} />
            </>
        );
    }
}

export default PopUpAssembler;