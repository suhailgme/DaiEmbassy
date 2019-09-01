import React, { Component } from 'react'
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Loader, Icon, Grid } from 'semantic-ui-react'
const Humanize = require('humanize-plus')
const axios = require('axios')


export default class AllCdps extends Component {
    state = {
        ...this.props.systemStatus,
        filtered: true,
        minDebt: "0.01",
        pageSize: 10,
        loading: false
    }

    async componentDidMount() {
        this.setState({ loading: true })
        const res = await axios.get('https://api.daiembassy.com/openCdps')
        // const res = await axios.get('http://localhost:2917/openCdps')
        const cdps = res.data.openCdps
        this.setState({ cdps })
        if (this.props.systemStatus)
            this.processCdps()
    }

    componentDidUpdate(prevProps) {
        if(this.props.systemStatus !== prevProps.systemStatus){
            this.setState(this.props.systemStatus)
            this.processCdps()
        }
    }

    truncateTx = (tx) => {
        return `${tx.slice(0, 6)}...${tx.slice(-6)}`
    }

    numberWithCommas = (number) => {
        return Humanize.formatNumber(number, 2)
    }

    truncateNumber = (number) => {
        return Humanize.compactInteger(number, 2)
    }

    handleClick = (e) => {
        e.preventDefault()
        this.props.handleSearchClick(null, { value: e.target.value })
    }

    processCdps = (pageSize = 10) => {
        console.log('processing open cdps...')
        const cdps = this.state.cdps
        let top100Debt = 0
        let top100Collateral = 0
        let processedCdps = []
        cdps.forEach(cdp => {
            if (this.state.filtered) {
                if (this.numberWithCommas(cdp.daiDebt) >= this.state.minDebt)
                    processedCdps.push({
                        cdpId: <button style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: cdp.cdpId < 2000 ? '#FF695E' : cdp.cdpId < 5000 ? '#FA9473' : cdp.cdpId < 10000 ? '#E6BB48' : cdp.cdpId < 15000 ? '#dbea98' : '#6abf69', cursor: 'pointer' }} value={cdp.cdpId} onClick={this.handleClick}>{cdp.cdpId}</button>,
                        account: <span><Icon name='external' /> <a target="_blank" href={`https://etherscan.io/address/${cdp.account}`} style={{ textDecoration: 'underline', color: 'inherit' }}>{cdp.account}</a></span>,
                        daiDebt: this.numberWithCommas(cdp.daiDebt),
                        pethCollateral: this.numberWithCommas(cdp.pethCollateral),
                        usdCollateral: this.numberWithCommas(cdp.usdCollateral),
                        ratio: this.numberWithCommas(cdp.ratio),
                    })
            } else {
                processedCdps.push({
                    cdpId: <button style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: cdp.cdpId < 2000 ? '#FF695E' : cdp.cdpId < 5000 ? '#FA9473' : cdp.cdpId < 10000 ? '#E6BB48' : cdp.cdpId < 15000 ? '#dbea98' : '#6abf69', cursor: 'pointer' }} value={cdp.cdpId} onClick={this.handleClick}>{cdp.cdpId}</button>,
                    account: <span><Icon name='external' /> <a target="_blank" href={`https://etherscan.io/address/${cdp.account}`} style={{ textDecoration: 'underline', color: 'inherit' }}>{cdp.account}</a></span>,
                    daiDebt: this.numberWithCommas(cdp.daiDebt),
                    pethCollateral: this.numberWithCommas(cdp.pethCollateral),
                    usdCollateral: this.numberWithCommas(cdp.usdCollateral),
                    ratio: this.numberWithCommas(cdp.ratio),
                })
            }

        })
        // console.log(processedCdps)
        cdps.sort((a, b) => {
            return (b.daiDebt) - (a.daiDebt)
        })
        cdps.forEach((cdp, index) => {
            if (index < pageSize) {
                top100Debt += +cdp.daiDebt
            }
        })
        cdps.sort((a, b) => {
            return (b.pethCollateral) - (a.pethCollateral)
        })
        cdps.forEach((cdp, index) => {
            if (index < pageSize) {
                top100Collateral += +cdp.pethCollateral
            }
        })

        this.setState({ processedCdps, numberCDPs: processedCdps.length, top100Debt, top100Collateral, pageSize, loading: false })
    }

    filterTable = () => {
        const filtered = !this.state.filtered
        this.setState({ filtered, loading: true }, () => {
            this.processCdps()
        })

    }

    render() {
        const processedCdps = this.state.processedCdps
        const numberCDPs = this.state.numberCDPs
        return (
            <div style={{ color: '#FFF', backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px', paddingRight:'5px'}}>
                {!this.state.loading ? <Grid columns={2} stackable>
                    <Grid.Column>
                        <h4 >Tracking {numberCDPs} CDPs</h4>
                    </Grid.Column>
                    <Grid.Column textAlign={window.innerWidth < 768 ? 'left' : 'right'}>
                        <h5 style={{ marginTop: 0, }}><span style={{ display: window.innerWidth > 768 ? 'inline' : 'block', paddingRight: '5px' }}><Icon style={{ marginRight: 0 }} name='dollar' />{`Top ${this.state.pageSize} CDPs Debt: `}{this.truncateNumber(this.state.top100Debt)} DAI ({(this.state.top100Debt / this.state.circulatingDai * 100).toFixed(2)}%)</span> <Icon style={{ marginRight: 0 }} name='ethereum' />{`Top ${this.state.pageSize} CDPs Collateral`}: {this.truncateNumber(this.state.top100Collateral)} PETH ({(this.state.top100Collateral / this.state.lockedPeth * 100).toFixed(2)}%)</h5>
                    </Grid.Column>
                    <Grid.Column style={{ paddingTop: 0 }}>
                        <button style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: '#FFF', cursor: 'pointer' }} value='ShowDebt' onClick={this.filterTable}>{this.state.filtered ? "Show All CDPs" : "Hide Debt-Free CDPs"}</button>
                    </Grid.Column>

                </Grid> : null }
                <hr style={{ opacity: '0.7' }} />
                <ReactTable
                    data={processedCdps}
                    columns={[

                        {
                            Header: <span>CDP ID <Icon inverted name='sort' /></span>,
                            accessor: 'cdpId',
                            // Cell: row => <div style={{textAlign:'justify'}}>{row.value}</div>
                        },
                        {
                            Header: <span>Owner <Icon inverted name='sort' /></span>,
                            accessor: 'account',
                            Cell: row => <div style={{ textAlign: 'left' }}>{row.value}</div>
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
                    defaultPageSize={10}
                    defaultSorted={[{
                        id: 'daiDebt',
                        desc: true,
                    }]}
                    className="-striped -highlight"
                    style={{ color: '#FFF', textAlign: 'center', }}
                    previousText={<p style={{ color: '#FFF', }}>Previous</p>}
                    nextText={<p style={{ color: '#FFF', }}>Next</p>}
                    onPageSizeChange={(pageSize) => this.processCdps(pageSize)}
                    NoDataComponent={() => this.state.loading ? <Loader active inverted /> : null}

                />
            </div>
        )

    }
}
