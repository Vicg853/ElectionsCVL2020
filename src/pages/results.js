import React from "react";
import { globalHistory } from "@reach/router";
import { navigate } from "gatsby";
import { connect } from "react-redux";
import queryString from 'query-string';
import Helmet from "react-helmet";
import axios from "axios";
import {Chart} from 'react-google-charts';
import * as NProgress from "nprogress/nprogress"; 

import {
  Theme
} from "../globalStyle";

import {
  ResultsContainer,
} from "../styles/results";

import { 
  SuccessOrErrorVotePopUpRef
} from "../components/popUps";

class Results extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      candidatesResultsObject: [],
      ElectionName: "",
      ElectionEndDate: "",
      BackgroundImageURL: ""
    }
  }

  componentDidMount(){
    if(globalHistory.location.pathname === "/results" || "/results/"){
      if(!globalHistory.location.search
        || globalHistory.location.search === "" 
        || globalHistory.location.search === null) navigate("/");
      var proceed1 = false;
      var proceed2 = false;
      NProgress.start();
      var search = queryString.parse(globalHistory.location.search);
      axios.post(process.env.HEAVY_WORK_API_URL + "/results", {
        electionID: search.ElectionID,
      }).then((res) => {
        var mapResultsArray = [
          ['Candidats', 'Votes'],
        ];
        res.data.results.forEach(content => {
          mapResultsArray.push([
            content.name,
            content.votes
          ]);
        });
        this.setState({
          candidatesResultsObject: mapResultsArray
        });
        proceed1 = true;
        doneFunction();
      }).catch(() => {
        navigate("/");
        SuccessOrErrorVotePopUpRef.current.show(2, "Oups une erreur c'est deroule. Voulez recharger la age!");
        NProgress.done();
      });
      axios.post(process.env.HEAVY_WORK_API_URL + "/elections", {
        electionID: search.ElectionID
      }).then((res) => {
        this.setState({
          ElectionName: res.data.results.name,
          ElectionEndDate: res.data.results.endDate,
          BackgroundImageURL: res.data.results.backgroundUrl
        });
        proceed2 = true;
        doneFunction();
      }).catch((err) => {
        navigate("/");
        SuccessOrErrorVotePopUpRef.current.show(2, "Oups une erreur c'est deroule. Voulez recharger la age!");
        NProgress.done();
      });
      function doneFunction(){
        if(proceed1 && proceed2) NProgress.done();
      }
    }
  }
  render(){
    return(
      <>
      <Helmet>
        <title>
          LFP | RESULTS: {this.state.ElectionName}
        </title>
      </Helmet>
      <ResultsContainer
      backgroundURL={this.state.BackgroundImageURL}>
        <span></span>
        <sub>
        <title>Resultats: {this.state.ElectionName}</title>
        <Chart
          width={'700px'}
          height={'400px'}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={this.state.candidatesResultsObject}
          options={{
            hAxis: { title: 'Candidats', textStyle: { color: Theme.background } },
            vAxis: { title: 'Votes', textStyle: { color: Theme.background } },
            legend: 'none',
            animation: {
              startup: true,
              easing: 'linear',
              duration: 600,
            },
            backgroundColor: {
              fill: Theme.accent1,
              fillOpacity: 0
            },
          }}
        />
        <article>
          Roulez vers la droite pour voir tout les reusltats →<br/>
          (La vizualization sur un ordinateur peut etre meilleure, due a une taille d'écran superieure!)
        </article>
        </sub>
      </ResultsContainer>
      </>
    );
  }
}

const mapStateToProps = state => ({
  Active_Election_ID: state.pagesReducer.Active_Election_ID,
  Active_Election_Name: state.pagesReducer.Active_Election_Name,
  Active_Election_EndDate: state.pagesReducer.Active_Election_EndDate,
  Active_Election_IMG_URL: state.pagesReducer.Active_Election_IMG_URL,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);

