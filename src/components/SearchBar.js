import React, { Component, Search } from 'react'

export default class SearchBar extends Component{
    state = {}

    render(){
        return(
            <Search value={this.state.value} loading={this.state.isLoading} onSearchChange={this.handleSearchChange} results = {this.state.results} size='mini'/>
        )
    }

}