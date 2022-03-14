import React from "react";
import './estilo.css';

class Query extends React.Component {

    constructor(props:any) {
        super(props);
        this.displayOptionsFilters  = this.displayOptionsFilters.bind(this);
        this.displayOptionsSorting  = this.displayOptionsSorting.bind(this);
        this.printQuery             = this.printQuery.bind(this);
        this.buildQuery             = this.buildQuery.bind(this);
    }

    displayOptionsFilters(e:any) :void
    {
        let state   = e.target.checked,
            order: HTMLInputElement | null = document.querySelector("#ordination"),
            ordersUL: HTMLElement | null = document.querySelector(".sorting-options"),
            filtersUl: HTMLElement | null = document.querySelector(".filters-options")
        ;

        if(order && ordersUL && ordersUL.style.display == "block" && state){
            order.checked = false;
            ordersUL.style.display = "none";
        }

        if(filtersUl) filtersUl.style.display = state ? "block" : "none";
    }


    displayOptionsSorting(e:any) :void
    {
        let state   = e.target.checked,
            filter: HTMLInputElement | null = document.querySelector("#filter"),
            filtersUL: HTMLElement | null = document.querySelector(".filters-options"),
            ordersUL: HTMLElement | null = document.querySelector(".sorting-options")
        ;

        if(filter && filtersUL && filtersUL.style.display == "block" && state){
            filter.checked = false;
            filtersUL.style.display = "none";
        }

        if(ordersUL)  ordersUL.style.display = state ? "block" : "none";
    }


    printQuery() :HTMLElement 
    {
        const dedent = require('dedent');

        return dedent(`
            {
                search(query: "user:vcdl1997 is:public sort:name-asc",  type: REPOSITORY, first: 100) {
                    repositoryCount
                    edges {
                        node {
                            ... on Repository {
                                nameWithOwner
                                description
                                isArchived
                                isPrivate
                                url
                            }
                        }
                    }
                }
            }
        `);
    }


    buildQuery() :void
    { 
        const dedent = require('dedent');

        let repository: HTMLInputElement | null = document.querySelector(`input[name="repository-type"]:checked`),
            search: HTMLInputElement | null = document.querySelector(`input[name="search"]`),
            orientation: HTMLSelectElement | null = document.querySelector(`#orientation`),
            order: HTMLInputElement | null = document.querySelector(`input[name="sorting-type"]:checked`),
            code: HTMLElement | null = document.querySelector(".query code"),
            filters = ""
        ;

        if(repository) filters += filters == "" ? `${repository.value}` : ` ${repository.value}`;
        
        if(order && orientation) filters += filters == "" ? `${order.value}-${orientation.value}` : ` ${order.value}-${orientation.value}`;

        if(search && search.value != "") filters += filters == "" ? `${search.value} in:name,description` : ` ${search.value} in:name,description`;

       let query = dedent(`
            {
                search(query: "user:vcdl1997 ${filters}",  type: REPOSITORY, first: 100) {
                    repositoryCount
                    edges {
                        node {
                            ... on Repository {
                                nameWithOwner
                                description
                                isArchived
                                isPrivate
                                url
                            }
                        }
                    }
                }
            }
        `);

        if(code) code.innerText = query;
    }

    render() {
        return (
            <div>
                <div className="filter">
                    <div>
                        <input type="checkbox" id="filter" onChange={this.displayOptionsFilters}/>
                        <label htmlFor="filter">Filtros <i className="fa-solid fa-angle-down"></i></label>
                        <ul className="filters-options" style={{display: "none"}}>
                            <li>
                                <input type="radio" name="repository-type" id="publics" value="is:public" onChange={this.buildQuery} defaultChecked/>
                                <label htmlFor="publics">Repositórios públicos</label>
                            </li>
                            <li>
                                <input type="radio" name="repository-type" id="private" value="is:private" onChange={this.buildQuery}/>
                                <label htmlFor="private">Repositórios privados</label>
                            </li>
                            <li>
                                <input type="radio" name="repository-type" id="archived" value="archived:true" onChange={this.buildQuery}/>
                                <label htmlFor="archived">Repositórios arquivados</label>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <input type="checkbox" id="ordination" onChange={this.displayOptionsSorting}/>
                        <label htmlFor="ordination">Ordenar <i className="fa-solid fa-angle-down"></i></label>
                        <ul className="sorting-options" style={{display: "none"}}>
                            <li>
                                <input type="radio" name="sorting-type" id="alphabetic" value="sort:name" onChange={this.buildQuery} defaultChecked/>
                                <label htmlFor="alphabetic">Alfabética</label>
                            </li>
                            <li>
                                <input type="radio" name="sorting-type" id="last-commit" value="sort:updated" onChange={this.buildQuery} />
                                <label htmlFor="last-commit">Data do último commit</label>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <select name="orientation" id="orientation" onChange={this.buildQuery}>
                            <option value="asc" defaultValue={"selected"}>ASC</option>
                            <option value="desc">DESC</option>
                        </select>
                    </div>
                    <div>
                        <input type="search" name="search" onKeyUp={this.buildQuery}/>
                    </div>
                </div>
                <div className="query">
                    <code>
                        {this.printQuery()}
                    </code>
                </div>
            </div>
        );
    }
}

export default Query;
