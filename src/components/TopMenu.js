import React, { Component } from 'react'
import { Menu, Label, Popup, Search, Button } from 'semantic-ui-react'
import ConnectionStatus from './ConnectionStatus'
const Humanize = require('humanize-plus')

export default class TopMenu extends Component {
    state = {
        isLoading:false,
        results: [],
        value: ''
    }

    // static getDerivedStateFromProps(nextProps, prevState){
    //         if(nextProps.cdps !== prevState.cdps){
    //             // console.log('cdps from top menu: ', cdps)
    //         console.log('component get drived state from props')

    //             return {cdps: nextProps.cdps}
    //             }
    //         return null   
    //         }

    async componentDidUpdate(prevProps) {
        if (this.props.cdps && this.props.cdps !== prevProps.cdps) {
            let cdps = []
            this.props.cdps.forEach(cdp => {
                cdps.push({
                    title:`ID: ${cdp.cdpId}`, 
                    description: `Owner: ${cdp.account.slice(0,8)}...${cdp.account.slice(-6)}`,
                    price:  `${this.numberWithCommas(cdp.daiDebt)} DAI`
                })
            })
            this.setState({cdps:cdps})
        }
    }

    truncateAddress = (account) => {
        return `${account.slice(0,6)}...${account.slice(-4)}` 
        }

    handleClick = (e, { result }) =>{
        e.preventDefault()
        const cdpId = result.title.split(': ')[1]
        this.setState({activeItem:result, value: '', isLoading: false, results: []})
        this.props.handleSearchClick(e, {value: cdpId})
    }

    handleSearchChange = (e, { value }) => {
        if (this.state.cdps) {
            this.setState({ isLoading: true, value })
            setTimeout(() => {
                if (this.state.value.length < 1) {
                    this.setState({ isLoading: false, results: [], value: '' })
                    return
                }
                const results = this.state.cdps.filter((cdp) => {
                    return cdp.title === `ID: ${value}` || cdp.description === `Owner: ${value.slice(0,8)}...${value.slice(-6)}`
                })
                this.setState({ isLoading: false, results })
            }, 400)
        }
    }

    numberWithCommas = (number) => {
        if (number >100000) {
            return Humanize.compactInteger(number, 3)
        }
        return Humanize.formatNumber(number,2)
      }

    render(){
        return(
            <Menu fluid stackable borderless attached style={{backgroundColor:'transparent', paddingTop: '2px', paddingBottom: '5px', border:'0'}}>
                {this.props.cdps ? <Menu.Item fluid inverted><Search input={{ fluid: true}} style={{width:'420px'}} fluid selectFirstResult value={this.state.value} loading={this.state.isLoading} onSearchChange={this.handleSearchChange} onResultSelect={this.handleClick} results = {this.state.results} placeholder={"Search by CDP ID or Address"} size='large'/></Menu.Item> : null}
                {this.props.searchMsg ? <Menu.Item><p style={{color:'#FF695E'}}>{this.props.searchMsg}</p></Menu.Item> : null}
                <Menu.Item position='right'><Button><ConnectionStatus loadingMsg = {this.props.loadingMsg} account={this.props.account}/></Button></Menu.Item> 

            </Menu>
        )
    }

}