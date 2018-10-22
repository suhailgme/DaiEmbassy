import React, { Component } from 'react'
import { Menu, Label, Popup, Search } from 'semantic-ui-react'
import ConnectionStatus from './ConnectionStatus'

export default class TopMenu extends Component {
    state = {
        isLoading:false,
        results: [],
        value: ''
    }


    static getDerivedStateFromProps(nextProps, prevState){
            if(nextProps.cdps != prevState.cdps){
                // console.log('cdps from top menu: ', cdps)
                let cdps = []
                nextProps.cdps.forEach(cdp => {
                    cdps.push({
                        title:`ID: ${cdp.cdpId}`, 
                        description: `
                        Owner: ${cdp.account.slice(0,8)}...${cdp.account.slice(-6)}`,
                        price:  `${parseFloat(cdp.pethCollateral).toFixed(2)} PETH`

                    })
                })
                return {cdps}
                }
            return null   
            }

    truncateAddress = (account) => {
        return `${account.slice(0,6)}...${account.slice(-4)}` 
        }

    handleClick = (e, { name }) =>{
        e.preventDefault()
        this.setState({activeItem:name})
    }


    handleSearchChange = (e, { value }) =>{
        if(this.state.cdps){
            this.setState({isLoading: true, value})
            setTimeout(() => {
                if(this.state.value.length < 1){
                    this.setState({isLoading:false, results: [], value: ''}) 
                    return
                }
                const results = this.state.cdps.filter((cdp) =>{
                    return cdp.title === `ID: ${value}`
                })
                this.setState({isLoading: false, results})
            }, 400)
    }



    }

    render(){
        const { activeItem } = this.state
        return(
            <Menu fluid inverted stackable borderless attached size='huge' style={{marginBottom:'5px', backgroundColor:'#3D4853'}}>
                <Menu.Item style={{opacity:'0.8'}}> 
                    <svg height="35" width="35">
                        {/* <polygon points="32,0 0,0 0,32 32,32 26.946,26.828 5.054,26.828 5.054,5.172 26.946,5.172 " style={{fill:"#B8BCBF"}} />
                        <polygon points="9.571,20.464 17.635,24.934 25.7,20.464 25.7,11.525 17.635,7.056 9.571,11.525 " style={{fill:"#B8BCBF"}} /> */}
                        <path d="M0,16.024L15.976,32L32,15.976L16.024,0L0,16.024z M15.989,23.347l-7.336-7.336l14.694-0.022L15.989,23.347z" style={{fill:"#B8BCBF"}}></path>
                    </svg><span style={{fontFamily:"Roboto", fontWeight:500}}>Dai Embassy</span>
                <Popup inverted position='right center' trigger={<Label color='red'>Alpha</Label>} content='Alpha 0.1.0'/></Menu.Item>
                <Menu.Item fluid inverted><Search fluid selectFirstResult value={this.state.value} loading={this.state.isLoading} onSearchChange={this.handleSearchChange} onResultSelect={this.props.handleSearchClick} results = {this.state.results} size='mini'/></Menu.Item>
                {this.props.account ? <Menu.Item><p style={{color:'#FF695E'}}>{this.props.loadingMsg}</p></Menu.Item> : null}
                {/* <Menu.Item name = 'CDP' color='blue' active={activeItem === 'CDP'} onClick={this.handleClick}/>
                <Menu.Item name = 'Exchange' color='blue' active={activeItem === 'Exchange'} onClick={this.handleClick}/>
                <Menu.Item name = 'Send' color='blue' active={activeItem === 'Send'} onClick={this.handleClick}/> */}
                <Menu.Item position='right'><ConnectionStatus loadingMsg = {this.props.loadingMsg} account={this.props.account}/> </Menu.Item> 

            </Menu>
        )
    }

}