import React from "react";

import {
    Container,
} from "./style";

import {
    Theme
} from "../../globalStyle";

class Header extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            ScrolledAfterLimit: false
        }
    }

    componentDidMount(){
        window.addEventListener("scroll", () => {
            if(window.scrollY > window.innerHeight/2){
                this.setState({ScrolledAfterLimit: true});
            } else this.setState({ScrolledAfterLimit: false});
        });
    }
    render(){

        var { ScrolledAfterLimit } = this.state;

        return(
            <>
                <Container ScrolledAfterLimit={ScrolledAfterLimit}>
                    <h1>
                        Elections Lycée Pasteur
                    </h1>
                    <h2>
                        Developed by Victor Gomez Te S
                    </h2>
                </Container>
            </>
        );
    }
}

export default Header;

