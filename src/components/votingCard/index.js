import React from "react";
import axios from "axios";

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

import API_URLS from "../../../apis_urls";

var Candidates = [
    {Name: "Lorenzo", Id: "122342355"},
    {Name: "Miguel", Id: "789756"},
    {Name: "Victor", Id: "45455445345"},
    {Name: "Joao", Id: "565665"},
];

class VoteCard extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            EmptyInput: false,
            CarteirinhaNumberInputVal: "",
            CarteirinhaNumberInputEmpty: false,
            Candidate0ValSelected: Candidates[0].Id,
            Candidate1ValSelected: Candidates[0].Id,
            CandidateValSelectModified: true,
            ErrorInputs: false
        };
    }

    handleSubmit(){
        var { 
            CarteirinhaNumberInputVal,
            Candidate0ValSelected,
            Candidate1ValSelected,
            CarteirinhaNumberInputEmpty,
            CandidateValSelectModified
        } = this.state;

        var proceed = true;
        var notProceedVal = 0;

        if(CarteirinhaNumberInputEmpty 
        || CarteirinhaNumberInputVal === "" 
        || CarteirinhaNumberInputVal === null) {
            proceed = false;
            this.setState({
                CarteirinhaNumberInputEmpty: true,
                ErrorInputs: true
            });
        }
        if(Candidate0ValSelected === Candidate1ValSelected) {
            proceed = false;
            notProceedVal = 1
            this.setState({
                CandidateValSelectModified: false,
                ErrorInputs: true,
            });
        }

        if(proceed){
            this.setState({
                CarteirinhaNumberInputEmpty: false,
                CandidateValSelectModified: true,
                ErrorInputs: false
            });
            SuccessOrErrorVotePopUpRef.current.show(0);
            axios.post(API_URLS.VOTE_ENDPOINT, {
                CarteirinhaNumberInputVal,
                Candidate0ValSelected,
                Candidate1ValSelected
            }).then((response) => {
                setTimeout(() => {
                    SuccessOrErrorVotePopUpRef.current.updateMsg(1);
                }, 3000);
            }).catch((error) => {
                setTimeout(() => {
                    console.log(error);
                    SuccessOrErrorVotePopUpRef.current.updateMsg(2);
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
            CandidateValSelectModified,
            ErrorInputs
        } = this.state;

        

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
                            <label>Rentrer un premier candidat de votre choix:</label><br/>
                            <DefaultSelect
                            ErrorInput={!CandidateValSelectModified}
                            onChange={(e) => this.setState({Candidate0ValSelected: e.target.value, CandidateValSelectModified: true, ErrorInputs: false})}>
                                {Candidates.map((content, index) => (
                                    <option
                                    key={index}
                                    value={content.Id}>
                                        {content.Name}
                                    </option>
                                ))}
                            </DefaultSelect><br/>
                            <label>Rentrer un deuxieme candidat de votre choix:</label><br/>
                            <DefaultSelect
                            ErrorInput={!CandidateValSelectModified}
                            onChange={(e) => this.setState({Candidate1ValSelected: e.target.value, CandidateValSelectModified: true, ErrorInputs: false}) }>
                                {Candidates.map((content, index) => (
                                    <option
                                    key={index}
                                    value={content.Id}>
                                        {content.Name}
                                    </option>
                                ))}
                            </DefaultSelect><br/>
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

export default VoteCard;

