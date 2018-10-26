import React, { Component } from 'react'
import { Table, Segment} from 'semantic-ui-react'
const Humanize = require('humanize-plus')


class RecentActions extends Component{
    state = { 
        cdp: this.props.cdps.find((cdp) =>{
        return cdp.cdpId === this.props.cdpId
    })}

    componentDidMount(){
        let actions = this.state.cdp.actions
        // console.log('actions: ', actions)
        // console.log('Recent Actions State: ',this.state)
    }

    getActions = () =>{
        let recentActions = []
        const actions = this.state.cdp.actions
        // console.log('actions: ', actions)
        actions.forEach(action => {
            recentActions.push(<Table.Row>
                <Table.Cell singleLine>
                    {new Date(action.time).toString().slice(0,-37)}
                </Table.Cell>
                <Table.Cell>
                    {`${action.act} `}{action.act === 'OPEN' || action.act === 'GIVE' ? '' : action.act == 'DRAW' || action.act == 'WIPE' ? `${this.numberWithCommas(action.arg)} DAI` : `${this.numberWithCommas(action.arg)} PETH`}
                </Table.Cell>
                <Table.Cell>
                    <a target="_blank" href={`https://etherscan.io/tx/${action.tx}`} style={{textDecoration:'underline', color:'inherit'}}>{this.truncateTx(action.tx)}</a>
                </Table.Cell>
                <Table.Cell>
                    {`$${this.numberWithCommas(action.pip)}`}
                </Table.Cell>
            </Table.Row>)
        })
        return recentActions
    }

    truncateTx = (tx) => {
        return `${tx.slice(0,6)}...${tx.slice(-6)}` 
    }

    numberWithCommas = (number) => {
        return Humanize.formatNumber(number,2)
        // return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }

    render(){
        return(
            <Segment style={{paddingTop:'10px', backgroundColor:'#232D39', borderRadius:'5px', border: '2px solid #38414B',maxHeight:384.5, overflow:'auto'}}>
            <Table inverted compact style={{backgroundColor:'#3D4853',}}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date (Local)</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                        <Table.HeaderCell>Tx Hash</Table.HeaderCell>
                        <Table.HeaderCell>ETH/USD</Table.HeaderCell>

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