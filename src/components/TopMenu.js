import React, { Component } from 'react'
import { Menu, Label, Popup, Search } from 'semantic-ui-react'
import ConnectionStatus from './ConnectionStatus'
import logo from '../images/daiEmbassyLogo.png'
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
                    // price:  `${this.numberWithCommas(cdp.daiDebt)} DAI`
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
            <Menu fluid inverted stackable borderless attached size='huge' style={{marginBottom:'5px', backgroundColor:'#3D4853', width:'100%'}}>
                <Menu.Item className='logo' style={{paddingRight:0}}>
                <a href='.'>
                    <img src={logo} alt='Logo' width='150px'/>
                    {/* <svg height="35" width="35"> */}
                        {/* <polygon points="32,0 0,0 0,32 32,32 26.946,26.828 5.054,26.828 5.054,5.172 26.946,5.172 " style={{fill:"#B8BCBF"}} /> */}
                        {/* <polygon points="9.571,20.464 17.635,24.934 25.7,20.464 25.7,11.525 17.635,7.056 9.571,11.525 " style={{fill:"#B8BCBF"}} /> */}
                        {/* <path d="M0,16.024L15.976,32L32,15.976L16.024,0L0,16.024z M15.989,23.347l-7.336-7.336l14.694-0.022L15.989,23.347z" style={{fill:"#E6BB48"}}></path>
                    </svg> */}
                    </a> 
                    {/* <a href='.'>
                    <span style={{fontFamily:"Roboto", fontWeight:500 }}>Dai Embassy</span>
                    </a>  */}

                <Popup inverted position='right center' trigger={<Label color='red' style={{textDecoration:'underline', cursor:'help'}}>Alpha</Label>} content='Alpha 0.15.2 (30-Aug-2019)'/>
                </Menu.Item>
                {this.props.cdps ? <Menu.Item fluid inverted><Search input={{ fluid: true}} style={{width:'230px'}} fluid selectFirstResult value={this.state.value} loading={this.state.isLoading} onSearchChange={this.handleSearchChange} onResultSelect={this.handleClick} results = {this.state.results} placeholder={"Search by CDP ID or Address"} size='mini'/></Menu.Item> : null}
                {this.props.searchMsg ? <Menu.Item><p style={{color:'#FF695E'}}>{this.props.searchMsg}</p></Menu.Item> : null}
                <Menu.Item position='right'><ConnectionStatus loadingMsg = {this.props.loadingMsg} account={this.props.account}/> </Menu.Item> 

            </Menu>
        )
    }

}