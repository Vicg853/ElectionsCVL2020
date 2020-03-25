import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { globalHistory } from "@reach/router";
import { navigate } from "gatsby";

import {
    Container,
    SideImageContainer,
    VoteFrm,
    DefaultInput,
    DefaultSelect,
    DefaultButton
} from "./style";

import { 
    WarningOrSuccessPopUpRef,
    SuccessOrErrorVotePopUpRef
} from "../popUps";

import Image0 from "../../images/mainBackground.jpg";

class VoteCard extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            EmptyInput: false,
            CarteirinhaNumberInputVal: "",
            CarteirinhaNumberInputEmpty: false,
            PasswordNumberInputVal: "",
            PasswordNumberInputEmpty: false,
            candidatesArraySelected: [],
            CandidateValSelectModified: true,
            ErrorInputs: false,
            candidatesAxiosRequestResults: []
        };
    }

    componentWillMount(){
        setTimeout(() => {
            if(globalHistory.location.pathname === "/vote"){
                if(!this.props.ActiveElectionID
                    || this.props.ActiveElectionID === "" 
                    || this.props.ActiveElectionID === null) navigate("/");
                else axios.post(process.env.HEAVY_WORK_API_URL + "/candidates", {
                    electionID: this.props.ActiveElectionID
                })
                .then((res) => {
                    if(res.data.results.length != 0){
                        this.setState({candidatesAxiosRequestResults: res.data.results});
                    }else{
                        SuccessOrErrorVotePopUpRef.current.show(2, "Oups ! Une erreur c'est déroulé voulez recharger la page s'il vous plait!");
                        navigate("/");
                    }
                }).catch((err) => {
                    SuccessOrErrorVotePopUpRef.current.show(2, "Oups ! Une erreur c'est déroulé voulez recharger la page s'il vous plait!");
                    navigate("/");
                });
            }
        }, 2); 
    }
    handleCandidateChange(){
        var inputs = document.getElementsByClassName("CandidateInputElement");
        var inputsArray = Array.prototype.slice.call(inputs);
        var mapResults = [];
        if(inputs.length !== 0) {
            console.log(inputsArray);
            inputsArray.forEach(element => {
                var value = element.value;
                mapResults.push(value);
            });
            this.setState({
                CandidateValSelectModified: true, 
                ErrorInputs: false,
                candidatesArraySelected: mapResults,
            });
        }
    }

    handleSubmit(){
        var { 
            CarteirinhaNumberInputVal,
            PasswordNumberInputVal,
            candidatesArraySelected,
            CarteirinhaNumberInputEmpty,
            PasswordNumberInputEmpty,
            CandidateValSelectModified
        } = this.state;

        var proceed = true;
        var notProceedVal = 0;

        if(CarteirinhaNumberInputVal === "TeresaMainha") {
            proceed = false;
            notProceedVal = 5;
            SuccessOrErrorVotePopUpRef.current.show(10);
        }

        if(CarteirinhaNumberInputEmpty 
        || CarteirinhaNumberInputVal === "" 
        || CarteirinhaNumberInputVal === null) {
            proceed = false;
            this.setState({
                CarteirinhaNumberInputEmpty: true,
                ErrorInputs: true
            });
        }
        if(PasswordNumberInputEmpty 
            || PasswordNumberInputVal === "" 
            || PasswordNumberInputVal === null) {
            proceed = false;
            this.setState({
                PasswordNumberInputEmpty: true,
                ErrorInputs: true
            });
        }
        if(candidatesArraySelected.length != this.props.ActiveElectionNumberOfVotes) {
            proceed = false;
            notProceedVal = 1
            this.setState({
                CandidateValSelectModified: false,
                ErrorInputs: true,
            });
        }

        var valuesSoFar = Object.create(null);
        for (var i = 0; i < candidatesArraySelected.length; ++i) {
            var value = candidatesArraySelected[i];
            if (value in valuesSoFar) {
                this.setState({
                    CandidateValSelectModified: false,
                    ErrorInputs: true,
                });
                return proceed = false;
            }
            valuesSoFar[value] = true;
        }
        if(proceed){
            this.setState({
                CarteirinhaNumberInputEmpty: false,
                CandidateValSelectModified: true,
                ErrorInputs: false
            });
            SuccessOrErrorVotePopUpRef.current.show(0);
            axios.post(process.env.HEAVY_WORK_API_URL + "/vote", {
                electionID: this.props.ActiveElectionID,
                schoolCardId: CarteirinhaNumberInputVal,
                password: PasswordNumberInputVal,
                candidatesArray: candidatesArraySelected
            }).then((response) => {
                setTimeout(() => {
                    SuccessOrErrorVotePopUpRef.current.updateMsg(1);
                }, 3000);
            }).catch((error) => {
                setTimeout(() => {
                    SuccessOrErrorVotePopUpRef.current.updateMsg(2, error.toString());
                }, 3000);
            });
        }else{
            if(notProceedVal === 0) WarningOrSuccessPopUpRef.current.show(1, "Vous devez remplir toutes le données necessaires !");
            if(notProceedVal === 1) WarningOrSuccessPopUpRef.current.show(1, "Vous ne pouvez voter un sule fois sur chaque candidat !");
        }
    }

    render(){
        var { 
            CarteirinhaNumberInputVal,
            CarteirinhaNumberInputEmpty,
            PasswordNumberInputVal,
            PasswordNumberInputEmpty,
            CandidateValSelectModified,
            ErrorInputs,
            candidatesAxiosRequestResults
        } = this.state;

        const items = [];

        for (var i = 0; i < this.props.ActiveElectionNumberOfVotes; i++){
            items.push(
                <>
                <DefaultSelect
                ErrorInput={!CandidateValSelectModified}
                onChange={(e) => this.handleCandidateChange()}
                className="CandidateInputElement">
                    {candidatesAxiosRequestResults.map((content, index) => (
                        <option
                        key={index}
                        value={content.id}>
                            {content.name}
                        </option>
                    ))}
                </DefaultSelect><br/>
                </>
            );
        }

        return(
            <>
                <Container>
                    <SideImageContainer BackgroundUrl={Image0}>
                        <article>
                            Photo by 
                            <a href="https://unsplash.com/@rcjphoto?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"> Ryan Jacobson </a>
                            on
                            <a href="https://unsplash.com/s/photos/school?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"> Unsplash </a>
                        </article>
                    </SideImageContainer>
                    <VoteFrm>
                        <title>
                            Inserer les info pour y voter: 
                        </title>
                        <div>
                            <label>Rentrer votre numero de carte:</label><br/>
                            <DefaultInput 
                            ErrorInput={CarteirinhaNumberInputEmpty} 
                            onChange={(e) => {
                                if(e.target.value === "" || null) this.setState({CarteirinhaNumberInputVal: e.target.value, CarteirinhaNumberInputEmpty: true, ErrorInputs: false});
                                else this.setState({CarteirinhaNumberInputVal: e.target.value, CarteirinhaNumberInputEmpty: false, ErrorInputs: false});
                            }}
                            value={CarteirinhaNumberInputVal} /><br/>
                            <label>Rentrer votre mot de passe reseau:</label><br/>
                            <DefaultInput 
                            ErrorInput={PasswordNumberInputEmpty} 
                            onChange={(e) => {
                                if(e.target.value === "" || null) this.setState({PasswordNumberInputVal: e.target.value, PasswordNumberInputEmpty: true, ErrorInputs: false});
                                else this.setState({PasswordNumberInputVal: e.target.value, PasswordNumberInputEmpty: false, ErrorInputs: false});
                            }}
                            value={PasswordNumberInputVal} /><br/>
                            <label>Rentrer les candidats de votre choix:</label><br/>
                            
                            {items}                                                                
                            <DefaultButton
                            ErrorInput={ErrorInputs}
                            onClick={() => this.handleSubmit()}>
                                Envoyer
                            </DefaultButton>
                        </div>
                    </VoteFrm>
                </Container>
            </>
        );
    }
}

const mapStateToProps = state => ({
    ActiveElectionID: state.pagesReducer.Active_Election_ID,
    ActiveElectionName: state.pagesReducer.Active_Election_Name,
    ActiveElectionEndDate: state.pagesReducer.Active_Election_EndDate,
    ActiveElectionIMG_URL: state.pagesReducer.Active_Election_IMG_URL,
    ActiveElectionNumberOfVotes: state.pagesReducer.Active_Election_Number_Of_Votes,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VoteCard);

