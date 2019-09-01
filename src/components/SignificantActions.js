import React, { Component } from 'react'
import { Loader, Icon } from 'semantic-ui-react'
import ReactTable from "react-table";
import "react-table/react-table.css";
const Humanize = require('humanize-plus')
const axios = require('axios')



class SignificantActions extends Component {
    state = {
        loading: false,
        pages: 0,
    }


    processActions = (allRecentActions) => {
        let recentActions = []
        allRecentActions.forEach((cdp, index) => {
            // console.log(cdp)
            const owner = cdp.owner
            recentActions.push(
                {
                    time: cdp.time,//new Date(action.time).toString().slice(0,-37),
                    cdpId: cdp.shut ? <span style={{color: cdp.cdpId < 2000 ? '#FF695E' : cdp.cdpId < 5000 ? '#FA9473' : cdp.cdpId < 10000 ? '#E6BB48' : cdp.cdpId < 15000 ? '#dbea98' :'#6abf69'}}>{cdp.cdpId}</span> : <button style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: cdp.cdpId < 2000 ? '#FF695E' : cdp.cdpId < 5000 ? '#FA9473' : cdp.cdpId < 10000 ? '#E6BB48' : cdp.cdpId < 15000 ? '#dbea98' :'#6abf69', cursor: 'pointer' }} value={cdp.cdpId} onClick={this.handleClick}>{cdp.cdpId}</button>,
                    act: `${cdp.act} ${cdp.act === 'OPEN' || cdp.act === 'GIVE' ? '' : cdp.act == 'DRAW' || cdp.act == 'WIPE' ? `${this.numberWithCommas(cdp.arg)} DAI` : `${this.numberWithCommas(cdp.arg)} PETH`}`,
                    tx: <a target="_blank" href={`https://etherscan.io/tx/${cdp.tx}`} style={{ textDecoration: 'underline', color: 'inherit' }}>{this.truncateTx(cdp.tx)}</a>,
                    owner: `${this.truncateTx(owner)}`,
                    debt: `${this.numberWithCommas(cdp.debt)} DAI`,
                    collateral: `${this.numberWithCommas(cdp.collateral)} PETH`,
                    ratio: `${this.numberWithCommas(cdp.ratio)}`,
                    id: index
                })
        })
        return recentActions
        // this.setState({recentActions})
    }



    truncateTx = (tx) => {
        return `${tx.slice(0, 6)}...${tx.slice(-6)}`
    }

    numberWithCommas = (number) => {
        return Humanize.formatNumber(number, 2)
        // return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    handleClick = (e) => {
        e.preventDefault()
        this.props.handleSearchClick(null, { value: e.target.value })
    }

    handleTableView = (e) => {
        this.setState({ significantActions: !this.state.significantActions })
        this.table.fireFetchData()
    }

    render() {
        // if (this.state.recentActions) {
            <ReactTable ref={(refReactTable) => { this.refReactTable = refReactTable; }} />
            const recentActions = this.state.recentActions
            // console.log(recentActions, this.state.pages)

            return (
                <div style={{
                    color: '#FFF', //borderRadius:'5px', border: '2px solid #38414B',
                    backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px'
                }}>
                    <hr style={{ opacity: '0.7' }} />
                    <ReactTable
                        data={recentActions}
                        columns={[

                            {
                                id: 'date',
                                Header: 'Date (local)',
                                accessor: data => new Date(data.time).toString().slice(0, -37)
                            },
                            {
                                Header: 'CDP ID',
                                accessor: 'cdpId'
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
                                accessor: data => data.ratio,
                                Cell: props => <p style={{ color: props.value == 0.00 ? '#FFF' : props.value < 170 ? '#FF695E' : props.value < 200 ? '#EFBC72' : '#FFF' }}>{`${props.value} %`}</p>,

                            },
                            {
                                Header: "Tx Hash",
                                accessor: "tx"
                            },
                        ]}
                        className="-striped -highlight"
                        defaultPageSize={10}
                        style={{ color: '#FFF', textAlign: 'center', }}
                        previousText={<p style={{ color: '#FFF', }}>Previous</p>}
                        nextText={<p style={{ color: '#FFF', }}>Next</p>}
                        sortable={false}
                        filterable={false}
                        pages={this.state.pages}
                        // LoadingComponent={() => this.state.loading? <Loader active inverted/> : null}
                        NoDataComponent={() => this.state.loading? <Loader active inverted/> : null}
                        manual
                        ref={(instance) => { this.table = instance }}
                        onFetchData={async (state, instance) => {
                            this.setState({ loading: true })
                            const allRecentActionsRes = await axios.get(`https://api.daiembassy.com/significantTransactions?page=${state.page + 1}&pageSize=${state.pageSize}`)
                            const recentActions = this.processActions(allRecentActionsRes.data.page)
                            this.setState({ recentActions, pages: allRecentActionsRes.data.numPages, loading: false, reload: false })
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

export default SignificantActions