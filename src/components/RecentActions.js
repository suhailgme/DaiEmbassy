import React, { Component } from 'react'
import { Table, Segment} from 'semantic-ui-react'

class RecentActions extends Component{
    state = { 
        cdp: this.props.cdps.find((cdp) =>{
        return cdp.cdpId === this.props.cdpId
    })}

    componentDidMount(){
        let actions = this.state.cdp.actions
        console.log('actions: ', actions)
        // console.log('Recent Actions State: ',this.state)
    }

    getActions = () =>{
        let recentActions = []
        const actions = this.state.cdp.actions
        console.log('actions: ', actions)
        actions.forEach(action => {
            recentActions.push(<Table.Row>
                <Table.Cell>
                    {action.act}
                </Table.Cell>
                <Table.Cell singleLine>
                    {new Date(action.time).toString().slice(0,-37)}
                </Table.Cell>
                <Table.Cell>
                    {action.act == 'DRAW' || action.act == 'WIPE' ? `${parseFloat(action.arg).toFixed(2)} DAI` : `${parseFloat(action.arg).toFixed(2)} PETH`}
                </Table.Cell>
                <Table.Cell>
                    <a target="_blank" href={`https://etherscan.io/tx/${action.tx}`} style={{textDecoration:'underline', color:'inherit'}}>{this.truncateTx(action.tx)}</a>
                </Table.Cell>
            </Table.Row>)
        })
        return recentActions
    }

    truncateTx = (tx) => {
        return `${tx.slice(0,6)}...${tx.slice(-6)}` 
    }

    render(){
        return(
            <Segment style={{paddingTop:'10px', backgroundColor:'#232D39', borderRadius:'5px', border: '2px solid #38414B',maxHeight:364, overflow:'auto'}}>
            <Table inverted compact style={{backgroundColor:'#3D4853',}}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                        <Table.HeaderCell>Tx Hash</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body style={{backgroundColor:'#273340'}}>
                    {this.getActions()}
                </Table.Body>
            </Table>
            </Segment>
        )
    }
}

export default RecentActions