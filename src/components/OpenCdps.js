import React, { Component } from 'react'
import { Loader, Icon, Button } from 'semantic-ui-react'
import ReactTable from "react-table";
import "react-table/react-table.css";
const Humanize = require('humanize-plus')
const axios = require('axios')



class OpenCdps2 extends Component {
    state = {
        loading: false,
        pages: 0,
        filtered: true
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


    processActions = (allRecentActions) => {
        let recentActions = []
        allRecentActions.forEach((cdp, index) => {
            // console.log(cdp)
            const owner = cdp.owner
            recentActions.push(
                {
                    cdpId: <button style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: this.colorCdpId(cdp.cdpId), cursor: 'pointer' }} value={cdp.cdpId} onClick={this.handleClick}>{cdp.cdpId}</button>,
                    account: <a target="_blank" href={`https://etherscan.io/address/${cdp.account}`} style={{ textDecoration: 'underline', color: 'inherit' }}>{this.truncateTx(cdp.account)}</a>,
                    daiDebt: this.numberWithCommas(cdp.daiDebt),
                    pethCollateral: this.numberWithCommas(cdp.pethCollateral),
                    usdCollateral: this.numberWithCommas(cdp.usdCollateral,2),
                    ratio: this.numberWithCommas(cdp.ratio,2),
                })
        })
        return recentActions
        // this.setState({recentActions})
    }


    truncateTx = (tx) => {
        return `${tx.slice(0, 6)}...${tx.slice(-6)}`
    }

    numberWithCommas = (number, commas=2) => {
        return Humanize.formatNumber(number, commas)
        // return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    handleClick = (e) => {
        e.preventDefault()
        this.props.handleSearchClick(null, { value: e.target.value })
    }

    handleFilter = (e) =>{
        this.setState({filtered:!this.state.filtered}, () => this.table.fireFetchData())
        
    }


    render() {
        // if (this.state.recentActions) {
        const recentActions = this.state.recentActions
        // console.log(recentActions, this.state.pages)

        return (
            <div style={{
                color: '#FFF', //borderRadius:'5px', border: '2px solid #38414B',
                backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px'
            }}>
                <h4>Tracking {this.numberWithCommas(this.state.trackedCdps,0)} CDPs {this.state.filtered ? '(With At Least 0.01 Debt)' : '(All Open CDPs)'}</h4>
                <Button size='tiny' compact value='ShowDebt' onClick={this.handleFilter}>{this.state.filtered ? "Show All CDPs" : "Hide Debt-Free CDPs"}</Button>
                <hr style={{ opacity: '0.7' }} />
                <ReactTable
                    ref={(instance) => { this.table = instance; }}
                    data={recentActions}
                    columns={[

                        {
                            Header: <span>CDP ID <Icon inverted name='sort' /></span>,
                            accessor: 'cdpId',
                            // Cell: row => <div style={{textAlign:'justify'}}>{row.value}</div>
                        },
                        {
                            Header: 'Owner',
                            accessor: 'account',
                            Cell: row => <div style={{ textAlign: 'center' }}>{row.value}</div>,
                            sortable: false
                        },
                        {
                            Header: <span>Debt (DAI) <Icon inverted name='sort' /></span>,
                            id: 'daiDebt',
                            accessor: "daiDebt",
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                    return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                            }
                        },
                        {
                            Header: <span>Collateral (PETH) <Icon inverted name='sort' /></span>,
                            accessor: "pethCollateral",
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                    return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                            }
                        },
                        {
                            Header: <span>Collateral (USD) <Icon inverted name='sort' /></span>,
                            accessor: "usdCollateral",
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                    return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                            }
                        },
                        {
                            id: 'ratio',
                            Header: <span>Collateralization Ratio <Icon inverted name='sort' /></span>,
                            accessor: data => data.ratio,
                            Cell: props => <p style={{ color: props.value == 0.00 ? '#FFF' : props.value < 170 ? '#FF695E' : props.value < 200 ? '#EFBC72' : '#FFF' }}>{`${props.value} %`}</p>,
                            sortMethod: (a, b) => {
                                if (a.length === b.length) {
                                    return a > b ? 1 : -1;
                                }
                                return a.length > b.length ? 1 : -1;
                            }
                        },
                    ]}
                    className="-striped -highlight"
                    defaultPageSize={10}
                    style={{ color: '#FFF', textAlign: 'center', }}
                    previousText={<p style={{ color: '#FFF', }}>Previous</p>}
                    nextText={<p style={{ color: '#FFF', }}>Next</p>}
                    defaultSorted={[{
                        id: 'daiDebt',
                        desc: true,
                    }]}
                    filterable={false}
                    pages={this.state.pages}
                    // LoadingComponent={() => this.state.loading? <Loader active inverted/> : null}
                    NoDataComponent={() => this.state.loading ? <Loader active inverted /> : null}
                    manual
                    ref={(instance) => { this.table = instance }}
                    onFetchData={async (state, instance) => {
                        const id = state.sorted[0].id
                        const desc = state.sorted[0].desc
                        const filtered = this.state.filtered
                        // console.log(id, desc, filtered)
                        this.setState({ loading: true })
                        const allRecentActionsRes = await axios.get(`https://api.daiembassy.com/openCdps?page=${state.page + 1}&pageSize=${state.pageSize}&id=${id}&desc=${desc}&filtered=${filtered}`)
                        const recentActions = this.processActions(allRecentActionsRes.data.page)
                        this.setState({ recentActions, pages: allRecentActionsRes.data.numPages, loading: false, trackedCdps:allRecentActionsRes.data.trackedCdps,  reload: false })
                    }}
                />
            </div>
        )
        // } else {
        //     return (
        //         <div style={{
        //             color: '#FFF', borderRadius: '5px',
        //             backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px', height: '494px'
        //         }}>
        //             <h4><Icon name='lightning' />Loading Significant CDP Actions</h4>
        //             <hr style={{ opacity: '0.7' }} />
        //             <Loader active inverted inline='centered' />
        //         </div>
        //     )
        // }
    }


}

export default OpenCdps2