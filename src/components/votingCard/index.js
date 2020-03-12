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
    Theme
} from "../../globalStyle";

import Image0 from "../../images/mainBackground.jpg";

var Candidates = [
    {Name: "Potato", Id: "122342355"},
    {Name: "Carrot", Id: "789756"},
    {Name: "Hello World", Id: "45455445345"},
    {Name: "LFP", Id: "565665"},

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
            axios.post("", {
                CarteirinhaNumberInputVal,
                Candidate0ValSelected,
                Candidate1ValSelected
            }).then((response) => {
                console.log(response);
            }).catch(() => {
    
            });
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
                            <label>Rentrer votre numero de carte:</label>
                            <DefaultInput 
                            ErrorInput={CarteirinhaNumberInputEmpty} 
                            onChange={(e) => {
                                if(e.target.value === "" || null) this.setState({CarteirinhaNumberInputVal: e.target.value, CarteirinhaNumberInputEmpty: true, ErrorInputs: false});
                                else this.setState({CarteirinhaNumberInputVal: e.target.value, CarteirinhaNumberInputEmpty: false, ErrorInputs: false});
                            }}
                            value={CarteirinhaNumberInputVal} /><br/>
                            <label>Rentrer un premier candidat de votre choix:</label>
                            <DefaultSelect
                            ErrorInput={!CandidateValSelectModified}
                            onChange={(e) => this.setState({Candidate0ValSelected: e.target.value, CandidateValSelectModified: true, ErrorInputs: false})}>
                                {Candidates.map((content, index) => (
                                    <option
                                    value={content.Id}>
                                        {content.Name}
                                    </option>
                                ))}
                            </DefaultSelect><br/>
                            <label>Rentrer un deuxieme candidat de votre choix:</label>
                            <DefaultSelect
                            ErrorInput={!CandidateValSelectModified}
                            onChange={(e) => this.setState({Candidate1ValSelected: e.target.value, CandidateValSelectModified: true, ErrorInputs: false}) }>
                                {Candidates.map((content, index) => (
                                    <option
                                    value={content.Id}>
                                        {content.Name}
                                    </option>
                                ))}
                            </DefaultSelect>
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

