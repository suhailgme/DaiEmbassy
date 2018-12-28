import React, { Component } from 'react'
import {  Loader } from 'semantic-ui-react'
import ReactTable from "react-table";
import "react-table/react-table.css";
const Humanize = require('humanize-plus')


class RecentActions extends Component{
    state = { 
        // cdp: this.props.cdps.find((cdp) =>{
        // return cdp.cdpId === this.props.cdpId
        // }),
        // cdpId: this.props.cdpId
    }

    componentDidMount(){
    }
    
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.cdps && nextProps.cdpId !==prevState.cdpId){
            const cdp = nextProps.cdps.find((cdp) =>{
                return cdp.cdpId === nextProps.cdpId
                })
            return {
                cdp, 
                cdpId: nextProps.cdpId, 
            }
        }
        return null
    }


    getActions = () =>{
        let recentActions = []
        const actions = this.state.cdp.actions
        // console.log("actions:", actions)
        
        // console.log('actions: ', actions)
        actions.forEach((action, index) => {
            recentActions.push(
                {
                    time: action.time,//new Date(action.time).toString().slice(0,-37),
                    act: `${action.act} ${action.act === 'OPEN' || action.act === 'GIVE' ? '' : action.act == 'DRAW' || action.act == 'WIPE' ? `${this.numberWithCommas(action.arg)} DAI` : `${this.numberWithCommas(action.arg)} PETH`}`,
                    tx: <a target="_blank" href={`https://etherscan.io/tx/${action.tx}`} style={{textDecoration:'underline', color:'inherit'}}>{this.truncateTx(action.tx)}</a>,
                    price: `$${this.numberWithCommas(action.pip)}`,
                    debt: `${this.numberWithCommas(action.art)} DAI`,
                    collateral: `${this.numberWithCommas(action.ink)} PETH`,
                    ratio: `${this.numberWithCommas(action.ratio)}`,
                    id: index
                })
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
        const loaded = this.state.cdp
        if(loaded){
        const actions = this.getActions()
        return (
            <div style={{color:'#FFF', borderRadius:'5px', border: '2px solid #38414B',
            backgroundColor:'#273340', paddingTop:'10px', paddingLeft:'5px'}}>
                <h4>Recent Actions (CDP {this.state.cdpId})</h4>
                <hr style={{opacity:'0.7'}}/>
              <ReactTable
                data = {actions}
                columns= {[
                    
                            {
                                id: 'date',
                                Header: 'Date (local)',
                                accessor: data => new Date(data.time).toString().slice(0,-37)
                            },
                            {
                                Header: 'Action',
                                accessor: 'act'
                            },
                            {
                                Header: 'Debt',
                                accessor: 'debt'
                            },
                            {
                                Header: 'Collateral',
                                accessor: 'collateral'
                            },
                            {
                                id: 'ratio',
                                Header: 'Collateralization Ratio',
                                accessor: data =>data.ratio,
                                Cell: props => <p style={{color: props.value == 0.00 ? '#FFF' : props.value < 170 ? '#FF695E' : props.value < 200 ? '#EFBC72' : '#FFF' }}>{`${props.value} %`}</p>,

                            },
                            {
                                Header: "ETH/USD",
                                accessor: "price"
                            },  
                            {
                                Header: "Tx Hash",
                                accessor: "tx"
                            },  
                ]}
                defaultPageSize={10}
                className="-striped -highlight"
                style={{color:'#FFF', textAlign:'center', height:'350px',}}
                showPagination = {false}
                defaultPageSize = {actions.length}
                sortable = {false}
              />
            </div>
          )
        }else{
            return (
                <div style={{color:'#FFF', borderRadius:'5px', border: '2px solid #38414B',
                backgroundColor:'#273340', paddingTop:'10px', paddingLeft:'5px', height:'406px'}}>
                <h4>Loading Recent Actions</h4>
                <hr style={{opacity:'0.7'}}/>
                <Loader active inverted inline='centered'/>
                
                </div>
                )
        }
        // return(
        //     <Segment style={{paddingTop:'10px', backgroundColor:'#232D39', borderRadius:'5px', border: '2px solid #38414B',maxHeight:384.5, overflow:'auto'}}>
        //     <Table inverted compact style={{backgroundColor:'#3D4853',}}>
        //         <Table.Header>
        //             <Table.Row>
        //                 <Table.HeaderCell>Date (Local)</Table.HeaderCell>
        //                 <Table.HeaderCell>Action</Table.HeaderCell>
        //                 <Table.HeaderCell>Tx Hash</Table.HeaderCell>
        //                 <Table.HeaderCell>ETH/USD</Table.HeaderCell>

        //             </Table.Row>
        //         </Table.Header>
        //         <Table.Body style={{backgroundColor:'#273340'}}>
        //             {this.getActions()}
        //         </Table.Body>
        //     </Table>
        //     </Segment>
        // )
    }
}

export default RecentActions