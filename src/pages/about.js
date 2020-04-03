import React from "react";
import Helmet from "react-helmet";

import {
    Container,
} from "../styles/about";

import Image0 from "../images/CodeBackground.jpg";
import Image1 from "../images/VictorGomez.jpg";

class About extends React.Component{
    
    render(){

        return(
            <>
                <Helmet>
                    <title>
                        LFP ELECTIONS | ABOUT
                    </title>
                </Helmet>
                <Container
                backgroundURL={Image0}
                userImage={Image1}>
                    <span></span>
                    <sub>
                        <span><div></div></span>
                        <title>
                            Je suis Victor Gomez, élève de Te S!
                        </title>
                        <article>
                            Catte page a été faite avec l'objectif d'augmenter l'efficacité des elections du CVL (Conseil de Vie Lycéene) du Grand Lycée Pasteur!<br/>
                            Par contre, tout système peut avoir une vulnerabilité, et en cas de bug, n'hésitez pas a contacter la vie scolaire de façon a ce qu'il me previennent !<br/>
                            Ce site utilise ReactJS, NodeJS, Kubernetes, Docker et autres ...
                        </article>
                    </sub>
                </Container>
            </>
        );
    }
}

export default About;

