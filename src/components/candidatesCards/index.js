import React from "react";

import {
    CardContainer
} from "./style";

import {

} from "../../globalStyle";

const CandidatesCards = ({CandidateImgURL, CandidateName, CandidateMSG, CandidateClassNumber, CandidateAge}) => (
  <>
    <CardContainer
    backgroundURL={CandidateImgURL}>
        <span>
            <h1>
                {CandidateClassNumber}
            </h1>
            <h1>
                {CandidateAge} ans
            </h1>
        </span>
        <sub>
            <h1>    
                {CandidateName}
            </h1>
        </sub>
        <div>
            <h1>
                {CandidateMSG}
            </h1>
        </div>
    </CardContainer>
  </>
);

export default CandidatesCards;