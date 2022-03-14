import React from "react"
import './estilo.css';


class Console extends React.Component {
    constructor(props:any) {
        super(props);
        this.findRepositories = this.findRepositories.bind(this);
    }

    findRepositories(e:any) :void
    {
        const dedent = require('dedent');

        let code: HTMLElement | null = document.querySelector(".query code"),
            output: HTMLElement | null = document.querySelector(".console code"),
            query = ""
        ;

        if(!code) return;

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.REACT_APP_API_TOKEN}`);
        myHeaders.append("Content-Type", "application/json");

        let graphql = JSON.stringify({
            query: code.innerText,
            variables: {}
        })

        fetch("https://api.github.com/graphql", {
            method: 'POST',
            headers: myHeaders,
            body: graphql,
            redirect: 'follow'
        })
        .then(response => response.json())
        .then(result => {
            if(output) output.innerText = dedent(JSON.stringify(result, null, 2)); 
        })
        .catch(error => console.log('error', error));
    }

    render() {
        return (
            <div className="console">
                <div style={{width: "100%"}}>
                    <button onClick={this.findRepositories}>
                        <i className="fa-solid fa-play"></i>
                    </button>
                </div>

                <code>

                </code>
            </div>
        );
    }
}

export default Console;