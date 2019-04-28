import React, { Component } from 'react'
import { Dropdown, Icon } from 'semantic-ui-react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import qr from '../images/ethAddrQR.png'


class ConnectionStatus extends Component {
    state={
        loadingMsg: '',
        donationAddress: '0xE33fd6D4aF8698280696a8b59998209D7dB756A4'
    }

    static getDerivedStateFromProps(nextProps, prevState){
        return{loadingMsg:nextProps.loadingMsg}
    }

    truncateAddress = (account) => {
        return `${account.slice(0,6)}...${account.slice(-4)}` 
    }

    render(){
        const {account} = this.props
        return(
            <div>
                <Icon size='small' color={this.state.loadingMsg ? 'orange' : 'green'} name='circle' style={{paddingRight:'5px'}} />
                {this.state.loadingMsg ? this.state.loadingMsg :    
                <Dropdown pointing='top right' text={account} style={{paddingRight:'5px'}}> 
                    <Dropdown.Menu>
                        <Dropdown.Item disabled>
                            {/* <img style={{width:'50px'}}src={metamaskLogo} alt='metamask logo'/> */}
                            <div style={{fontSize:'0.9em', textAlign:'center'}}>{`Connected to our Remote Node`} </div>
                        </Dropdown.Item>
                        <hr/>
                        <Dropdown.Item style={{paddingTop:'0px'}}>
                            <CopyToClipboard text={this.state.donationAddress}>
                            <div>
                                <div style={{textAlign:'center', fontSize:'0.9em'}}>Donate (Click to Copy Address)</div>
                                <div style={{textAlign:'center', paddingBottom:'5px', paddingTop:'10px'}}><img style={{width:'100px'}}src={qr} alt='QR Code'/></div>
                                <span>{this.state.donationAddress}</span>
                            </div>
                            </CopyToClipboard>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                }

            </div>
        )
    }
}

export default ConnectionStatus