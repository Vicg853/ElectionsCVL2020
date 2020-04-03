import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import * as NProgress from "nprogress/nprogress"; 
import Shimmer from "react-shimmer-effect";
import VisibilitySensor from "react-visibility-sensor";
import {navigate} from "@reach/router";
import Helmet from "react-helmet";
 
import { 
  SuccessOrErrorVotePopUpRef
} from "../components/popUps";

import {
  PresentationContainer,
  Container,
  ElectionCard
} from "../styles";

import Image0 from "../images/home_page_background.jpg";

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      electionsObject: [{}],
      resultsObject: [{}],
      shimmer1: true,
      shimmer2: true
    }
  }

  getElections(){
    axios.post(process.env.HEAVY_WORK_API_URL + "/elections")
    .then((res) => {
      if(res.data.results.length !== 0){
        this.setState({electionsObject: res.data.results});
      }else{
        SuccessOrErrorVotePopUpRef.current.show(2, "Une erreur c'est deroule, recharge la page s'il vous plait !");
      }
    }).catch((err) => {
      SuccessOrErrorVotePopUpRef.current.show(2, err.toString());
    });
  }

  getResults(){
    axios.post(process.env.HEAVY_WORK_API_URL + "/results")
    .then((res) => {
      if(res.data.results.length !== 0){
        this.setState({resultsObject: res.data.results});
      }else{
        SuccessOrErrorVotePopUpRef.current.show(2, "Une erreur c'est deroule, recharge la page s'il vous plait !");
      }
    }).catch((err) => {
      SuccessOrErrorVotePopUpRef.current.show(2, err.toString());
    });
  }

  componentDidMount(){
    this.getResults();
    this.getElections();
    NProgress.start();
    setInterval(() => {
      this.getResults();
      this.getElections();
    },30000);
    setTimeout(() => {
      NProgress.done();
    }, 900);
  }

  scrollTop(){
    if(typeof window !== 'undefined' && window) window.scrollTo(0,0);
  }

  onVisible(whichCards, isVisible){
    if(whichCards === 1 && isVisible) setTimeout(() => {
      this.setState({shimmer1: false});
    }, 1200);
    else if(whichCards === 2 && isVisible) setTimeout(() => {
      this.setState({shimmer2: false});
    }, 1200);
  }

  render(){
    return (
      <>
        <Helmet>
          <title>
            LFP ELECTIONS | HOME
          </title>
        </Helmet>
        <PresentationContainer
        backgroundURL={Image0}>
          <h1>
            Site internet d'élections du Lycée Pasteur Unité Vergueiro
          </h1>
          <h2>
            Utiliser ce site pour voter pour les élections du Lycée Pasteur !
          </h2>
        </PresentationContainer>
        <Container>
          <h1>Quelle élection voulez-vous ?</h1>
          <VisibilitySensor onChange={(isVisible) => this.onVisible(1, isVisible)}>
              <sub>
                {this.state.electionsObject.map((content, index) => {
                  var date = new Date(content.endDate);
                  var day = date.getDate();
                  var month = date.getMonth();
                  var year = date.getFullYear();
                  var FormattedDate = day.toString() + "/" + month + "/" + year;
                  return (
                    <>
                    <ElectionCard
                    key={index}
                    ShimmerEffectActive={this.state.shimmer1}
                    onClick={() => {
                      if(!this.state.shimmer1){
                        window.scrollTo(0,0);
                        navigate("/vote?ElectionID=" + content.id);
                      } 
                    }}
                    backgroundURL={content.backgroundUrl}>
                      <div></div>
                      {this.state.shimmer1 ? 
                        <Shimmer> 
                          <h1>.</h1> 
                        </Shimmer>
                        :
                        <h1>
                          {content.name}
                        </h1>
                      }
                      {this.state.shimmer1 ? 
                        <Shimmer> 
                          <h2>.</h2> 
                        </Shimmer>
                        :
                        <h2>
                          A fini le: {FormattedDate}
                        </h2>
                      }
                    </ElectionCard>
                    </>
                  )
                })}
              </sub>
          </VisibilitySensor>
          <h1>Voir les résultats :</h1>
          <VisibilitySensor onChange={(isVisible) => this.onVisible(2, isVisible)}>
              <sub>
                {this.state.resultsObject.map((content, index) => {
                  var date = new Date(content.endDate);
                  var day = date.getDate();
                  var month = date.getMonth();
                  var year = date.getFullYear();
                  var FormattedDate = day.toString() + "/" + month + "/" + year;
                  return (
                    <>
                    <ElectionCard
                    key={index}
                    ShimmerEffectActive={this.state.shimmer2}
                    Results
                    onClick={() => {
                      if(!this.state.shimmer1){
                        window.scrollTo(0,0);
                        navigate("/results?ElectionID=" + content.id);
                      } 
                    }}
                    backgroundURL={content.backgroundUrl}>
                        <div></div>
                      {this.state.shimmer2 ? 
                        <Shimmer> 
                          <h1>.</h1> 
                        </Shimmer>
                        :
                        <h1>
                          {content.name}
                        </h1>
                      }
                      {this.state.shimmer2 ? 
                        <Shimmer> 
                          <h2>.</h2> 
                        </Shimmer>
                        :
                        <h2>
                          A fini le: {FormattedDate}
                        </h2>
                      }
                    </ElectionCard>
                    </>
                  )
                })}
              </sub>
          </VisibilitySensor>
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