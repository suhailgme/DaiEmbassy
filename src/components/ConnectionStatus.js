import React, { Component } from 'react'
import { Dropdown, Icon } from 'semantic-ui-react'
import metamaskLogo from '../images/metamask.svg'
const Humanize = require('humanize-plus')


class ConnectionStatus extends Component {
    state={
        loadingMsg: ''
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
                <Icon size='small' color={!account ? 'orange' : 'green'} name='circle' style={{paddingRight:'5px'}} />
                {!account ? this.state.loadingMsg :    
                <Dropdown pointing='top right' text={this.truncateAddress(account)} style={{paddingRight:'5px'}}> 
                    <Dropdown.Menu>
                        <Dropdown.Item>
                        <img style={{width:'50px'}}src={metamaskLogo} alt='metamask logo'/>
                        {account} 
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                }

            </div>
        )
    }
}

export default ConnectionStatus