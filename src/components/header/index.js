import React from "react";

import {
    Container,
} from "./style";

import {
    Theme,
    CustomLink
} from "../../globalStyle";

import {
    FaHome,
} from "react-icons/fa";

class Header extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            ScrolledAfterLimit: false
        }
    }

    componentDidMount(){
        if(typeof window !== 'undefined' && window) window.addEventListener("scroll", () => {
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
                    <div>
                        <CustomLink
                        to="/">
                            <FaHome size={20} color={Theme.accent1}/>
                        </CustomLink>
                        <CustomLink
                        to="/about">About</CustomLink>
                    </div>
                    <h2>
                        Developed by Victor Gomez Te S
                    </h2>
                </Container>
            </>
        );
    }
}

export default Header;

