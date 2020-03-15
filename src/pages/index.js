import React from "react";
import Helmet from "react-helmet";

import { GlobalStyle } from "../globalStyle";

import Header from "../components/header";
import VoteCard from "../components/votingCard";
import PopUpAssembler from "../components/popUps";

const IndexPage = () => (
  <>
    <Helmet>
      <script
        src="https://code.jquery.com/jquery-3.3.1.min.js"
        integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
        crossOrigin="anonymous"
        />
      <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet" />
    </Helmet>
    <GlobalStyle />
    <Header />
    <PopUpAssembler />
    <VoteCard />
  </>
)

export default IndexPage
