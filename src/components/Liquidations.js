import React, { Component } from 'react'
import { Loader, Icon } from 'semantic-ui-react'
import ReactTable from "react-table";
import "react-table/react-table.css";
const Humanize = require('humanize-plus')
const axios = require('axios')



class Liquidations extends Component {
    state = {
        loading: false,
    }

    async componentDidMount(){
        this.setState({ loading: true })
        const liquidationsRes = await axios.get(`https://api.daiembassy.com/liquidations`)
        const liquidations = this.processActions(liquidationsRes.data.liquidations)
        this.setState({ liquidations, loading: false,})
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

    processActions = (liquidations) => {
        let recentActions = []
        liquidations.forEach((cdp, index) => {
            // console.log(cdp)
            const owner = cdp.owner
            recentActions.push(
                {
                    time: cdp.time,//new Date(action.time).toString().slice(0,-37),
                    cdpId: cdp.cdpId,
                    act: cdp.act,
                    tx: <a target="_blank" href={`https://etherscan.io/tx/${cdp.tx}`} style={{ textDecoration: 'underline', color: 'inherit' }}>{this.truncateTx(cdp.tx)}</a>,
                    owner: `${this.truncateTx(owner)}`,
                    debtRepaid: `${this.numberWithCommas(cdp.debtRepaid)} DAI`,
                    pethLiquidated: `${this.numberWithCommas(cdp.pethLiquidated)} PETH`,
                    percentCollateralLiquidated: `${this.numberWithCommas(cdp.percentCollateralLiquidated,2)} %`,
                    ratio: `${this.numberWithCommas(cdp.ratio,2)} %`,
                    liquidationPrice: `$${this.numberWithCommas(cdp.liquidationPrice,2)}`,
                    shut: cdp.shut,
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
        const liquidations = this.state.liquidations
        // console.log(recentActions, this.state.pages)

        return (
            <div style={{
                color: '#FFF', //borderRadius:'5px', border: '2px solid #38414B',
                backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px'
            }}>
                <hr style={{ opacity: '0.7' }} />
                <ReactTable
                    data={liquidations}
                    columns={[

                        {
                            id: 'date',
                            Header: <span>Date (local)<Icon inverted name='sort' /></span>,
                            accessor: 'time',
                            Cell: props => new Date(props.value).toString().slice(0, -37)
                        },
                        {
                            id: 'id' +1,
                            Header: <span>CDP ID<Icon inverted name='sort' /></span>,
                            accessor: 'cdpId',
                            Cell: props => <button style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: this.colorCdpId(props.value), cursor: 'pointer' }} value={props.value} onClick={this.handleClick}>{props.value}{props.original.shut ? '*' : ''}</button>
                            
                        },
                        {

                            Header: 'Action',
                            accessor: 'act',
                            sortable:false
                        },
                        {
                            Header: <span>Debt Repaid<Icon inverted name='sort' /></span>,
                            accessor: 'debtRepaid',
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                  return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                              }
                        },
                        {
                            Header: <span>Collateral Liquidated<Icon inverted name='sort' /></span>,
                            accessor: 'pethLiquidated',
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                  return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                              }
                        },
                        {
                            Header: <span>% Collateral Liquidated<Icon inverted name='sort' /></span>,
                            accessor: 'percentCollateralLiquidated',
                            // sortMethod: (a, b) => {
                            //     if (a.length === b.length) {
                            //       return a > b ? 1 : -1;
                            //     }
                            //     return a.length > b.length ? 1 : -1;
                            //   }
                        },
                        {
                            Header: <span>Collateralization Ratio<Icon inverted name='sort' /></span>,
                            accessor: "ratio",
                            // sortMethod: (a, b) => {
                            //     if (a.length === b.length) {
                            //       return a > b ? 1 : -1;
                            //     }
                            //     return a.length > b.length ? 1 : -1;
                            //   }
                        },
                        {
                            Header: <span>Liquidation Price<Icon inverted name='sort' /></span>,
                            accessor: "liquidationPrice",
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                  return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                              }
                        },
                        {
                            Header: "Tx Hash",
                            accessor: "tx",
                            sortable:false

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
                    NoDataComponent={() => this.state.loading? <Loader active inverted/> : null}
                    // loading={liquidations.length === 0}
                    // LoadingComponent={() => <Loader active inverted inline='centered' />}
                />
            </div>
        )
    }

}
// }

export default Liquidations