import React from "react";
import Helmet from "react-helmet";

import {
  SubContainer,
  CandidatesCardsContainer,
  CardCol
} from "../styles/vote";

import VoteCard from "../components/votingCard";
import CandidatesCards from "../components/candidatesCards";
import { connect } from "react-redux";

const VotePage = ({ CandidatesElectionArray, ElectionName }) => (
  <>
    <Helmet>
      <title>
        LFP | VOTER: {ElectionName}
      </title>
    </Helmet>
    <VoteCard />
    <CandidatesCardsContainer>
      <title>Candidats:</title>
      <SubContainer>
        {CandidatesElectionArray.length !== 0 &&
        CandidatesElectionArray.map((content, index) =>(
          <CardCol>
            <CandidatesCards
            CandidateImgURL={content.profileImage}
            CandidateName={content.name}
            CandidateMSG={content.text}
            CandidateClassNumber={content.classNumber}
            CandidateAge={content.age} 
            />
          </CardCol>
        ))}
      </SubContainer>
    </CandidatesCardsContainer>
  </>
);

const mapStateToProps = state => ({
  CandidatesElectionArray: state.pagesReducer.CandidatesElectionArray,
  ElectionName: state.pagesReducer.Active_Election_Name
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VotePage);

