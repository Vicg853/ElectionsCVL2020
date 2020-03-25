import React from 'react';
import Helmet from "react-helmet";
import { Provider } from "react-redux";

import createStore from "./store";

import { GlobalStyle } from "./globalStyle";

import Header from "./components/header";
import PopUpAssembler from "./components/popUps";

const Layout = ({element}) => {
    const store = createStore();
    return(
      <>
        <Helmet>
          <script
            src="https://code.jquery.com/jquery-3.3.1.min.js"
            integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
            crossOrigin="anonymous"
            />
          <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet" />
        </Helmet>
        <Provider store={store}>
          <GlobalStyle />
          <Header />
          <PopUpAssembler />
          {element}
        </Provider>
      </>
    );
}

export default Layout;