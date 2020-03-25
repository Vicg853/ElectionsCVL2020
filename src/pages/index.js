import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { navigate } from "gatsby";

import { 
  SuccessOrErrorVotePopUpRef
} from "../components/popUps";

import {
  PresentationContainer,
  Container,
  ElectionCard
} from "../styles";

import Image0 from "../images/home_page_background.jpg";
import Image1 from "../images/mainBackground.jpg";

var electionObject = [];

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      electionsObject: [{}]
    }
  }

  getElections(){
    axios.get(process.env.HEAVY_WORK_API_URL + "/elections")
    .then((res) => {
      if(res.data.results.length != 0){
        console.log(res);
        this.setState({electionsObject: res.data.results})
      }else{
        SuccessOrErrorVotePopUpRef.current.show(2, "Une erreur c'est deroule, recharge la page s'il vous plait !");
      }
    }).catch((err) => {
      SuccessOrErrorVotePopUpRef.current.show(2, err.toString());
    });
  }

  componentDidMount(){
    this.getElections();
    setInterval(() => {
      this.getElections();
    },30000);
  }

  render(){
    return (
      <>
        <PresentationContainer
        backgroundURL={Image0}>
          <h1>
            Site web d'elections du Lycée Pasteur unité Vergueiro
          </h1>
          <h2>
            Utilisé ce site pour voter pour les elections donnés par le profs et administration de l'etablissement!
          </h2>
        </PresentationContainer>
        <Container>
          <h1>Choisissez une élection</h1>
          <sub>
            {this.state.electionsObject.map((content, index) => {
              var date = new Date(content.endDate);
              var day = date.getDate();
              var month = date.getMonth();
              var year = date.getFullYear();
              var FormattedDate = day.toString() + "/" + month + "/" + year;
              return (
                <ElectionCard
                to="/vote"
                
                key={index}
                onClick={() => {
                  window.scrollTo(0,0);
                  if(this.props.SetElectionInfo(content.id, content.name, FormattedDate, content.backgroundUrl, content.numberOfCandidatesToVote)){
                    navigate("/vote", {
                      state: {
                        ElectionID: content.id,
                      },
                    });
                  }else{
                    SuccessOrErrorVotePopUpRef.current.show(2, "Oups ! Une erreur c'est déroulé, voulez vous recharger la page s'il vous plait!");
                  }
                }}
                backgroundURL={Image1}>
                  <h1>
                    {content.name}
                  </h1>
                  <h2>
                    Fin: 
                    {FormattedDate}
                  </h2>
                </ElectionCard>
              )
            })}
          </sub>
        </Container>
      </>
    );
  } 
}

const mapStateToProps = state => {

}

const mapDispatchToProps = dispatch => ({
  SetElectionInfo: (ElectionID, ElectionName, ElectionEndDate, ElectionImgURL, ElectionNumberOfVotes) => dispatch({
    type: "SET_ELECTION_INFO",
    ElectionIDValue: ElectionID,
    ElectionNameValue: ElectionName,
    ElectionEndDateValue: ElectionEndDate,
    ElectionImgURLValue: ElectionImgURL,
    ElectionNumberOfVotesValue: ElectionNumberOfVotes,
  }),
});

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Home);