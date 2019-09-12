import React, { Component } from 'react'
import { Loader, Icon, Header } from 'semantic-ui-react'
import ReactTable from "react-table";
import "react-table/react-table.css";
const Humanize = require('humanize-plus')
const axios = require('axios')



class ShutCdps extends Component {
    state = {
        loading: false,
    }

    async componentDidMount(){
        this.setState({ loading: true })
        const shutCdpsRes = await axios.get(`https://api.daiembassy.com/shutCdps`)
        const shutCdps = this.processActions(shutCdpsRes.data.shutCdps)
        this.setState({ shutCdps, loading: false,})
    }

    colorCdpId = (cdpId) => {
        const colors = {
            veryLow: '#FF695E',
            low: '#FA9473',
            med: '#E6BB48',
            high: '#dbea98',
            veryHigh: '#6abf69'
        }
        if (cdpId < 2000) return colors.veryLow
        if (cdpId < 5000) return colors.low
        if (cdpId < 10000) return colors.med
        if (cdpId < 15000) return colors.high
        if (cdpId > 15000) return colors.veryHigh
    }

    processActions = (shutCdps) => {
        let recentActions = []
        shutCdps.forEach((cdp, index) => {
            // console.log(cdp)
            recentActions.push(
                {
                    time: cdp.dateShut,//new Date(action.time).toString().slice(0,-37),
                    cdpId: <button style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: this.colorCdpId(cdp.cdpId), cursor: 'pointer' }} value={cdp.cdpId} onClick={this.handleClick}>{cdp.cdpId}*</button>,
                    // tx: <a target="_blank" href={`https://etherscan.io/tx/${cdp.tx}`} style={{ textDecoration: 'underline', color: 'inherit' }}>{this.truncateTx(cdp.tx)}</a>,
                    maxDebt: `${this.numberWithCommas(cdp.maxDebt)} DAI`,
                    maxCollateral: `${this.numberWithCommas(cdp.maxCollateral)} PETH`,
                    // minRatio: `${this.numberWithCommas(cdp.minRatio)} %`,
                    minRatio: cdp.minRatio,
                    // liquidated:cdp.liquidated ? <Header inverted color='red' size='tiny'>Yes</Header> : <Header inverted color='green' size='tiny'>No</Header>,
                    liquidated:cdp.liquidated,
                    id: index
                })
        })
        return recentActions
        // this.setState({recentActions})
    }



    truncateTx = (tx) => {
        return `${tx.slice(0, 6)}...${tx.slice(-6)}`
    }

    numberWithCommas = (number, commas = 3) => {
        return Humanize.formatNumber(number, commas)
        // return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    handleClick = (e) => {
        e.preventDefault()
        this.props.handleSearchClick(null, { value: e.target.value })
    }


    render() {
        <ReactTable ref={(refReactTable) => { this.refReactTable = refReactTable; }} />
        // if(this.state.loading){
        //     return (
        //         <div style={{color:'#FFF', borderRadius:'5px', border: '2px solid #38414B',
        //         backgroundColor:'#273340', paddingTop:'10px', paddingLeft:'5px', height:'406px'}}>
        //         <h4>Loading All CDP Actions</h4>
        //         <hr style={{opacity:'0.7'}}/>
        //         <Loader active inverted inline='centered'/>

        //         </div>
        //         )
        // }
        // else{
        const shutCdps = this.state.shutCdps
        // console.log(recentActions, this.state.pages)

        return (
            <div style={{
                color: '#FFF', //borderRadius:'5px', border: '2px solid #38414B',
                backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px'
            }}>
                <hr style={{ opacity: '0.7' }} />
                <ReactTable
                    data={shutCdps}
                    columns={[

                        {
                            id: 'date',
                            Header: <span>Date Shut(local)<Icon inverted name='sort' /></span>,
                            accessor: 'time',
                            Cell: props => new Date(props.value).toString().slice(0, -37)
                        },
                        
                        {
                            Header: <span>CDP ID<Icon inverted name='sort' /></span>,
                            accessor: 'cdpId',
                            
                        },
                        {
                            Header: <span>Max Debt<Icon inverted name='sort' /></span>,
                            accessor: 'maxDebt',
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                  return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                              }
                        },
                        {
                            Header: <span>Max Collateral<Icon inverted name='sort' /></span>,
                            accessor: 'maxCollateral',
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                  return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                              }
                        },
                        {
                            id: 'id',
                            Header: <span>Min. Collateralization Ratio<Icon inverted name='sort' /></span>,
                            accessor: data => `${this.numberWithCommas(data.minRatio,2)} %`,
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                  return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                              }
                        },
                        {   id: 'id' + 1,
                            Header: <span>Liquidated<Icon inverted name='sort' /></span>,
                            accessor: data => data.liquidated ? <span style={{color:'red'}}>Yes</span> : 'No',
                            // Cell: props => props.liquidated ? <Header inverted color='red' size='tiny'>Yes</Header> : <Header inverted color='green' size='tiny'>No</Header>,
                            // sortMethod: (a, b) => {
                            //     if (a === b) {
                            //         return a > b ? 1 : -1;
                            //     }
                            //     return a > b ? 1 : -1;
                            // }

                        },
                    ]}
                    className="-striped -highlight"
                    defaultPageSize={10}
                    defaultSorted={[{
                        id: 'date',
                        desc:true
                    }]}
                    style={{ color: '#FFF', textAlign: 'center', }}
                    previousText={<p style={{ color: '#FFF', }}>Previous</p>}
                    nextText={<p style={{ color: '#FFF', }}>Next</p>}
                    filterable={false}
                    // sortable={false}
                    NoDataComponent={() => this.state.loading? <Loader active inverted/> : null}
                    // loading={liquidations.length === 0}
                    // LoadingComponent={() => <Loader active inverted inline='centered' />}
                />
            </div>
        )
    }

}
// }

export default ShutCdps