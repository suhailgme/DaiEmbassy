import React, { Component } from 'react'
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Loader, Icon, Grid } from 'semantic-ui-react'
import axios from 'axios'
const Humanize = require('humanize-plus')



export default class LargestDailyActions extends Component {
    state = {}

    async componentDidMount() {
        const dailyActionsDaiRes = await axios.get('https://api.daiembassy.com/dailyactionsdai')
        let dailyActionsDai = dailyActionsDaiRes.data.dailyActionsDai
        this.setState({ dailyActionsDai })
        // console.log(dailyActionsDai)
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

    handleClick = (cdpId) => {
        this.props.handleSearchClick(null, { value: cdpId })
    }

    // processActions = () => {
    //     const dailyActionsDai = this.state.dailyActionsDai
    //     let processedActions = []
    //     dailyActionsDai.forEach(day => {
    //         processedActions.push({})
    //         day.topDraw.forEach()
    //         processedActions.push({
    //             cdpId: <button style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: '#FFF', cursor: 'pointer' }} value={cdp.cdpId} onClick={this.handleClick}>{cdp.cdpId}</button>,
    //             account: <span><Icon name='external' /> <a target="_blank" href={`https://etherscan.io/address/${cdp.account}`} style={{ textDecoration: 'underline', color: 'inherit' }}>{cdp.account}</a></span>,
    //             daiDebt: this.numberWithCommas(cdp.daiDebt),
    //             pethCollateral: this.numberWithCommas(cdp.pethCollateral),
    //             usdCollateral: this.numberWithCommas(cdp.usdCollateral),
    //             ratio: this.numberWithCommas(cdp.ratio),
    //         })
    //     })
    //     // console.log(processedCdps)
    //     this.setState({ processedCdps})
    // }

    filterTable = () => {
        const filtered = !this.state.filtered
        this.setState({ filtered }, () => {
            this.processCdps()
        })

    }

    render() {
        if (this.state.dailyActionsDai) {
            const dailyActionsDai = this.state.dailyActionsDai
            let key = 0
            return (
                <div style={{ color: '#FFF', backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px' }}>
                    <hr style={{ opacity: '0.7' }} />
                    <ReactTable
                        data={dailyActionsDai}
                        columns={[

                            {
                                Header: 'Date',
                                columns: [
                                    {
                                        accessor: 'date',
                                        width: 160,
                                        Pivot: ({ row, isExpanded }) => {
                                            return (
                                                <div>
                                                    <Grid style={{ paddingTop: '13px' }}>
                                                        {isExpanded
                                                            ? <span><Icon name='minus circle' /></span>
                                                            : <span><Icon name='plus circle' /></span>
                                                        }
                                                        {row.date}
                                                    </Grid>
                                                </div>
                                            )
                                        },
                                    },
                                ]
                            },
                            {
                                Header: 'Lock',
                                columns: [

                                    {
                                        Header: 'CDP ID',
                                        id: 'Lock CDP ID',
                                        accessor: d => d.topLock.length ? <div>
                                            <button style={{
                                                color:
                                                    d.topLock[0].cdpId < 2000 ? '#FF695E' :
                                                        d.topLock[0].cdpId < 5000 ? '#FA9473' :
                                                            d.topLock[0].cdpId < 10000 ? '#E6BB48' :
                                                                d.topLock[0].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                background: 'none',
                                                border: 'none',
                                                padding: 0,
                                            }}
                                                onClick={() => this.handleClick(d.topLock[0].cdpId)}>{d.topLock[0].cdpId}
                                            </button>
                                        </div> : null,

                                        Cell: d => {
                                            return (
                                                <div>
                                                    <div style={{ paddingBottom: '15px', }}>
                                                        <button style={{
                                                            color:
                                                                d.original.topLock[1].cdpId < 2000 ? '#FF695E' :
                                                                    d.original.topLock[1].cdpId < 5000 ? '#FA9473' :
                                                                        d.original.topLock[1].cdpId < 10000 ? '#E6BB48' :
                                                                            d.original.topLock[1].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                        }}
                                                            onClick={() => this.handleClick(d.original.topLock[1].cdpId)}>{d.original.topLock[1].cdpId}
                                                        </button>
                                                    </div>
                                                    <div style={{ paddingBottom: '15px', }}>
                                                        <button style={{
                                                            color:
                                                                d.original.topLock[2].cdpId < 2000 ? '#FF695E' :
                                                                    d.original.topLock[2].cdpId < 5000 ? '#FA9473' :
                                                                        d.original.topLock[2].cdpId < 10000 ? '#E6BB48' :
                                                                            d.original.topLock[2].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                        }}
                                                            onClick={() => this.handleClick(d.original.topLock[2].cdpId)}>{d.original.topLock[2].cdpId}
                                                        </button>
                                                    </div>
                                                    <div style={{ paddingBottom: '15px', }}>
                                                        <button style={{
                                                            color:
                                                                d.original.topLock[3].cdpId < 2000 ? '#FF695E' :
                                                                    d.original.topLock[3].cdpId < 5000 ? '#FA9473' :
                                                                        d.original.topLock[3].cdpId < 10000 ? '#E6BB48' :
                                                                            d.original.topLock[3].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                        }}
                                                            onClick={() => this.handleClick(d.original.topLock[3].cdpId)}>{d.original.topLock[3].cdpId}
                                                        </button>
                                                    </div>
                                                    <div style={{ paddingBottom: '15px', }}>
                                                        <button style={{
                                                            color:
                                                                d.original.topLock[4].cdpId < 2000 ? '#FF695E' :
                                                                    d.original.topLock[4].cdpId < 5000 ? '#FA9473' :
                                                                        d.original.topLock[4].cdpId < 10000 ? '#E6BB48' :
                                                                            d.original.topLock[4].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                        }}
                                                            onClick={() => this.handleClick(d.original.topLock[4].cdpId)}>{d.original.topLock[4].cdpId}
                                                        </button>
                                                    </div>
                                                    <hr />
                                                    <div style={{ paddingBottom: '15px', }}>Top {d.original.topLock.length}</div>
                                                </div>
                                            )

                                        },
                                    },
                                    {
                                        Header: 'DAI Equiv. Locked',
                                        id: 'DAI Equiv. Locked',
                                        accessor: d => d.topLock.length ? <div style={{
                                            color: +d.topLock[0].daiLockPercent > 25 ? 'red' :
                                                +d.topLock[0].daiLockPercent > 10 ? 'orange' : '#6abf69'
                                        }}>
                                            {this.numberWithCommas(d.topLock[0].daiLock)}</div> : null,
                                        Cell: d => {
                                            let topLockDaiTotal = 0
                                            d.original.topLock.forEach((cdp) => topLockDaiTotal += +cdp.daiLock)
                                            return (
                                                <div>
                                                    <div style={{
                                                        paddingBottom: '15px',
                                                        color: +d.original.topLock[1].daiLockPercent > 25 ? 'red' :
                                                            +d.original.topLock[1].daiLockPercent > 10 ? 'orange' : '#6abf69',
                                                    }}>
                                                        {this.numberWithCommas(d.original.topLock[1].daiLock)}
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '15px',
                                                        color: +d.original.topLock[2].daiLockPercent > 25 ? 'red' :
                                                            +d.original.topLock[2].daiLockPercent > 10 ? 'orange' : '#6abf69',
                                                    }}>
                                                        {this.numberWithCommas(d.original.topLock[2].daiLock)}
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '15px',
                                                        color: +d.original.topLock[3].daiLockPercent > 25 ? 'red' :
                                                            +d.original.topLock[3].daiLockPercent > 10 ? 'orange' : '#6abf69',
                                                    }}>
                                                        {this.numberWithCommas(d.original.topLock[3].daiLock)}
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '15px',
                                                        color: +d.original.topLock[4].daiLockPercent > 25 ? 'red' :
                                                            +d.original.topLock[4].daiLockPercent > 10 ? 'orange' : '#6abf69',
                                                    }}>
                                                        {this.numberWithCommas(d.original.topLock[4].daiLock)}
                                                    </div>

                                                    <hr />
                                                    <div style={{ paddingBottom: '15px' }}>{`${this.truncateNumber(topLockDaiTotal)} of ${this.truncateNumber(d.original.lock)}`}</div>
                                                </div>
                                            )

                                        },
                                        // Cell : props => <span>{this.numberWithCommas(props.value)}</span>
                                    },
                                    {
                                        Header: '% of Total',
                                        id: '% of Total DAI',
                                        accessor: d => d.topLock.length ? d.topLock[0].daiLockPercent : null,
                                        Cell: d => {
                                            return (
                                                <div>
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topLock[1].daiLockPercent}</div>
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topLock[2].daiLockPercent}</div>
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topLock[3].daiLockPercent}</div>
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topLock[4].daiLockPercent}</div>
                                                    <hr />
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topLockPercent}</div>
                                                </div>
                                            )
                                        },
                                    },
                                ]
                            },
                            {
                                Header: 'Draw',
                                columns: [
                                    {
                                        Header: 'CDP ID',
                                        id: 'Draw CDP ID',
                                        accessor: d => d.topDraw.length ? <div>
                                            <button style={{
                                                color:
                                                    d.topDraw[0].cdpId < 2000 ? '#FF695E' :
                                                        d.topDraw[0].cdpId < 5000 ? '#FA9473' :
                                                            d.topDraw[0].cdpId < 10000 ? '#E6BB48' :
                                                                d.topDraw[0].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                background: 'none',
                                                border: 'none',
                                                padding: 0,
                                            }}
                                                onClick={() => this.handleClick(d.topDraw[0].cdpId)}>{d.topDraw[0].cdpId}
                                            </button>
                                        </div> : null,

                                        Cell: d => {
                                            return (
                                                <div>
                                                    <div style={{ paddingBottom: '15px', }}>
                                                        <button style={{
                                                            color:
                                                                d.original.topDraw[1].cdpId < 2000 ? '#FF695E' :
                                                                    d.original.topDraw[1].cdpId < 5000 ? '#FA9473' :
                                                                        d.original.topDraw[1].cdpId < 10000 ? '#E6BB48' :
                                                                            d.original.topDraw[1].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                        }}
                                                            onClick={() => this.handleClick(d.original.topDraw[1].cdpId)}>{d.original.topDraw[1].cdpId}
                                                        </button>
                                                    </div>
                                                    <div style={{ paddingBottom: '15px', }}>
                                                        <button style={{
                                                            color:
                                                                d.original.topDraw[2].cdpId < 2000 ? '#FF695E' :
                                                                    d.original.topDraw[2].cdpId < 5000 ? '#FA9473' :
                                                                        d.original.topDraw[2].cdpId < 10000 ? '#E6BB48' :
                                                                            d.original.topDraw[2].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                        }}
                                                            onClick={() => this.handleClick(d.original.topDraw[2].cdpId)}>{d.original.topDraw[2].cdpId}
                                                        </button>
                                                    </div>
                                                    <div style={{ paddingBottom: '15px', }}>
                                                        <button style={{
                                                            color:
                                                                d.original.topDraw[3].cdpId < 2000 ? '#FF695E' :
                                                                    d.original.topDraw[3].cdpId < 5000 ? '#FA9473' :
                                                                        d.original.topDraw[3].cdpId < 10000 ? '#E6BB48' :
                                                                            d.original.topDraw[3].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                        }}
                                                            onClick={() => this.handleClick(d.original.topDraw[3].cdpId)}>{d.original.topDraw[3].cdpId}
                                                        </button>
                                                    </div>
                                                    <div style={{ paddingBottom: '15px', }}>
                                                        <button style={{
                                                            color:
                                                                d.original.topDraw[4].cdpId < 2000 ? '#FF695E' :
                                                                    d.original.topDraw[4].cdpId < 5000 ? '#FA9473' :
                                                                        d.original.topDraw[4].cdpId < 10000 ? '#E6BB48' :
                                                                            d.original.topDraw[4].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                        }}
                                                            onClick={() => this.handleClick(d.original.topDraw[4].cdpId)}>{d.original.topDraw[4].cdpId}
                                                        </button>
                                                    </div>

                                                    <hr />
                                                    <div style={{ paddingBottom: '15px', }}>Top {d.original.topDraw.length}</div>
                                                </div>
                                            )
                                        },
                                    },
                                    {
                                        Header: 'DAI Drawn',
                                        id: 'DAI Drawn',
                                        accessor: d => d.topDraw.length ? <div style={{
                                            color: +d.topDraw[0].daiDrawPercent > 25 ? 'red' :
                                                +d.topDraw[0].daiDrawPercent > 10 ? 'orange' : '#6abf69'
                                        }}>
                                            {this.numberWithCommas(d.topDraw[0].daiDraw)}</div> : null,
                                        Cell: d => {
                                            let topDrawDaiTotal = 0
                                            d.original.topDraw.forEach((cdp) => topDrawDaiTotal += +cdp.daiDraw)
                                            return (
                                                <div>
                                                    <div style={{
                                                        paddingBottom: '15px',
                                                        color: +d.original.topDraw[1].daiDrawPercent > 25 ? 'red' :
                                                            +d.original.topDraw[1].daiDrawPercent > 10 ? 'orange' : '#6abf69',
                                                    }}>
                                                        {this.numberWithCommas(d.original.topDraw[1].daiDraw)}
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '15px',
                                                        color: +d.original.topDraw[2].daiDrawPercent > 25 ? 'red' :
                                                            +d.original.topDraw[2].daiDrawPercent > 10 ? 'orange' : '#6abf69',
                                                    }}>
                                                        {this.numberWithCommas(d.original.topDraw[2].daiDraw)}
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '15px',
                                                        color: +d.original.topDraw[3].daiDrawPercent > 25 ? 'red' :
                                                            +d.original.topDraw[3].daiDrawPercent > 10 ? 'orange' : '#6abf69',
                                                    }}>
                                                        {this.numberWithCommas(d.original.topDraw[3].daiDraw)}
                                                    </div>
                                                    <div style={{
                                                        paddingBottom: '15px',
                                                        color: +d.original.topDraw[4].daiDrawPercent > 25 ? 'red' :
                                                            +d.original.topDraw[4].daiDrawPercent > 10 ? 'orange' : '#6abf69',
                                                    }}>
                                                        {this.numberWithCommas(d.original.topDraw[4].daiDraw)}
                                                    </div>
                                                    <hr />

                                                    <div style={{ paddingBottom: '15px' }}>{`${this.truncateNumber(topDrawDaiTotal)} of ${this.truncateNumber(d.original.draw)}`}</div>

                                                </div>
                                            )
                                        }
                                    },
                                    {
                                        Header: '% of Total',
                                        id: '% of Total Draw',
                                        accessor: d => d.topDraw.length ? d.topDraw[0].daiDrawPercent : null,
                                        Cell: d => {
                                            return (
                                                <div>
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topDraw[1].daiDrawPercent}</div>
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topDraw[2].daiDrawPercent}</div>
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topDraw[3].daiDrawPercent}</div>
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topDraw[4].daiDrawPercent}</div>
                                                    <hr />
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topDrawPercent}</div>
                                                </div>
                                            )
                                        },
                                    }
                                ]
                            },
                            {
                                Header: 'Free',
                                columns: [
                                    {
                                        Header: 'CDP ID',
                                        id: 'Free CDP ID',
                                        accessor: d => d.topFree.length ? <div>
                                            <button style={{
                                                color:
                                                    d.topFree[0].cdpId < 2000 ? '#FF695E' :
                                                        d.topFree[0].cdpId < 5000 ? '#FA9473' :
                                                            d.topFree[0].cdpId < 10000 ? '#E6BB48' :
                                                                d.topFree[0].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                background: 'none',
                                                border: 'none',
                                                padding: 0,
                                            }}
                                                onClick={() => this.handleClick(d.topFree[0].cdpId)}>{d.topFree[0].cdpId}
                                            </button>
                                        </div> : null,
                                        Cell: d => {
                                            return (
                                                <div>
                                                    {d.original.topFree[1] ?
                                                        <div style={{ paddingBottom: '15px', }}>
                                                            <button style={{
                                                                color:
                                                                    d.original.topFree[1].cdpId < 2000 ? '#FF695E' :
                                                                        d.original.topFree[1].cdpId < 5000 ? '#FA9473' :
                                                                            d.original.topFree[1].cdpId < 10000 ? '#E6BB48' :
                                                                                d.original.topFree[1].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                                onClick={() => this.handleClick(d.original.topFree[1].cdpId)}>{d.original.topFree[1].cdpId}
                                                            </button>
                                                        </div> : null}
                                                    {d.original.topFree[2] ?
                                                        <div style={{ paddingBottom: '15px', }}>
                                                            <button style={{
                                                                color:
                                                                    d.original.topFree[2].cdpId < 2000 ? '#FF695E' :
                                                                        d.original.topFree[2].cdpId < 5000 ? '#FA9473' :
                                                                            d.original.topFree[2].cdpId < 10000 ? '#E6BB48' :
                                                                                d.original.topFree[2].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                                onClick={() => this.handleClick(d.original.topFree[2].cdpId)}>{d.original.topFree[2].cdpId}
                                                            </button>
                                                        </div> : null}
                                                    {d.original.topFree[3] ?
                                                        <div style={{ paddingBottom: '15px', }}>
                                                            <button style={{
                                                                color:
                                                                    d.original.topFree[3].cdpId < 2000 ? '#FF695E' :
                                                                        d.original.topFree[3].cdpId < 5000 ? '#FA9473' :
                                                                            d.original.topFree[3].cdpId < 10000 ? '#E6BB48' :
                                                                                d.original.topFree[3].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                                onClick={() => this.handleClick(d.original.topFree[3].cdpId)}>{d.original.topFree[3].cdpId}
                                                            </button>
                                                        </div> : null}
                                                    {d.original.topFree[4] ?
                                                        <div style={{ paddingBottom: '15px', }}>
                                                            <button style={{
                                                                color:
                                                                    d.original.topFree[4].cdpId < 2000 ? '#FF695E' :
                                                                        d.original.topFree[4].cdpId < 5000 ? '#FA9473' :
                                                                            d.original.topFree[4].cdpId < 10000 ? '#E6BB48' :
                                                                                d.original.topFree[4].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                                onClick={() => this.handleClick(d.original.topFree[4].cdpId)}>{d.original.topFree[4].cdpId}
                                                            </button>
                                                        </div> : null}

                                                    <hr />
                                                    <div style={{ paddingBottom: '15px', }}>Top {d.original.topFree.length}</div>
                                                </div>
                                            )
                                        },

                                    },
                                    {
                                        Header: 'DAI Equiv. Freed',
                                        id: 'DAI Equiv. Freed',
                                        accessor: d => d.topFree.length ? <div style={{
                                            color: +d.topFree[0].daiFreePercent > 25 ? 'red' :
                                                +d.topFree[0].daiFreePercent > 10 ? 'orange' : '#6abf69'
                                        }}>
                                            {this.numberWithCommas(d.topFree[0].daiFree)}</div> : null,
                                        Cell: d => {
                                            let topFreeDaiTotal = 0
                                            d.original.topFree.forEach((cdp) => topFreeDaiTotal += +cdp.daiFree)
                                            return (
                                                <div>
                                                    {
                                                        d.original.topFree[1] ?
                                                            <div style={{
                                                                paddingBottom: '15px',
                                                                color: +d.original.topFree[1].daiFreePercent > 25 ? 'red' :
                                                                    +d.original.topFree[1].daiFreePercent > 10 ? 'orange' : '#6abf69',
                                                            }}>
                                                                {this.numberWithCommas(d.original.topFree[1].daiFree)}
                                                            </div> : null
                                                    }
                                                    {
                                                        d.original.topFree[2] ?
                                                            <div style={{
                                                                paddingBottom: '15px',
                                                                color: +d.original.topFree[2].daiFreePercent > 25 ? 'red' :
                                                                    +d.original.topFree[2].daiFreePercent > 10 ? 'orange' : '#6abf69',
                                                            }}>
                                                                {this.numberWithCommas(d.original.topFree[2].daiFree)}
                                                            </div> : null
                                                    }
                                                    {
                                                        d.original.topFree[3] ?
                                                            <div style={{
                                                                paddingBottom: '15px',
                                                                color: +d.original.topFree[3].daiFreePercent > 25 ? 'red' :
                                                                    +d.original.topFree[3].daiFreePercent > 10 ? 'orange' : '#6abf69',
                                                            }}>
                                                                {this.numberWithCommas(d.original.topFree[3].daiFree)}
                                                            </div> : null
                                                    }
                                                    {
                                                        d.original.topFree[4] ?
                                                            <div style={{
                                                                paddingBottom: '15px',
                                                                color: +d.original.topFree[4].daiFreePercent > 25 ? 'red' :
                                                                    +d.original.topFree[4].daiFreePercent > 10 ? 'orange' : '#6abf69',
                                                            }}>
                                                                {this.numberWithCommas(d.original.topFree[4].daiFree)}
                                                            </div> : null
                                                    }
                                                    <hr />
                                                    <div style={{ paddingBottom: '15px' }}>{`${this.truncateNumber(topFreeDaiTotal)} of ${this.truncateNumber(d.original.free)}`}</div>
                                                </div>
                                            )
                                        },

                                    },
                                    {
                                        Header: '% of Total',
                                        id: '% of Total Free',
                                        accessor: d => d.topFree.length ? d.topFree[0].daiFreePercent : null,
                                        Cell: d => {
                                            return (
                                                <div>
                                                    {d.original.topFree[1] ? <div style={{ paddingBottom: '15px' }}>{d.original.topFree[1].daiFreePercent}</div> : null}
                                                    {d.original.topFree[2] ? <div style={{ paddingBottom: '15px' }}>{d.original.topFree[2].daiFreePercent}</div> : null}
                                                    {d.original.topFree[3] ? <div style={{ paddingBottom: '15px' }}>{d.original.topFree[3].daiFreePercent}</div> : null}
                                                    {d.original.topFree[4] ? <div style={{ paddingBottom: '15px' }}>{d.original.topFree[4].daiFreePercent}</div> : null}
                                                    <hr />
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topFreePercent === 'NaN' ? 0 : d.original.topFreePercent}</div>
                                                </div>
                                            )
                                        },
                                    }
                                ]
                            },
                            {
                                Header: 'Wipe',
                                columns: [
                                    {
                                        Header: 'CDP ID',
                                        id: 'Wipe CDP ID',
                                        accessor: d => d.topWipe.length ? <div>
                                            <button style={{
                                                color:
                                                    d.topWipe[0].cdpId < 2000 ? '#FF695E' :
                                                        d.topWipe[0].cdpId < 5000 ? '#FA9473' :
                                                            d.topWipe[0].cdpId < 10000 ? '#E6BB48' :
                                                                d.topWipe[0].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                background: 'none',
                                                border: 'none',
                                                padding: 0,
                                            }}
                                                onClick={() => this.handleClick(d.topWipe[0].cdpId)}>{d.topWipe[0].cdpId}
                                            </button>
                                        </div> : null,

                                        Cell: d => {
                                            return (
                                                <div>
                                                    {d.original.topWipe[1] ?
                                                        <div style={{ paddingBottom: '15px', }}>
                                                            <button style={{
                                                                color:
                                                                    d.original.topWipe[1].cdpId < 2000 ? '#FF695E' :
                                                                        d.original.topWipe[1].cdpId < 5000 ? '#FA9473' :
                                                                            d.original.topWipe[1].cdpId < 10000 ? '#E6BB48' :
                                                                                d.original.topWipe[1].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                                onClick={() => this.handleClick(d.original.topWipe[1].cdpId)}>{d.original.topWipe[1].cdpId}
                                                            </button>
                                                        </div> : null}
                                                    {d.original.topWipe[2] ?
                                                        <div style={{ paddingBottom: '15px', }}>
                                                            <button style={{
                                                                color:
                                                                    d.original.topWipe[2].cdpId < 2000 ? '#FF695E' :
                                                                        d.original.topWipe[2].cdpId < 5000 ? '#FA9473' :
                                                                            d.original.topWipe[2].cdpId < 10000 ? '#E6BB48' :
                                                                                d.original.topWipe[2].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                                onClick={() => this.handleClick(d.original.topWipe[2].cdpId)}>{d.original.topWipe[2].cdpId}
                                                            </button>
                                                        </div> : null}
                                                    {d.original.topWipe[3] ?
                                                        <div style={{ paddingBottom: '15px', }}>
                                                            <button style={{
                                                                color:
                                                                    d.original.topWipe[3].cdpId < 2000 ? '#FF695E' :
                                                                        d.original.topWipe[3].cdpId < 5000 ? '#FA9473' :
                                                                            d.original.topWipe[3].cdpId < 10000 ? '#E6BB48' :
                                                                                d.original.topWipe[3].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                                onClick={() => this.handleClick(d.original.topWipe[3].cdpId)}>{d.original.topWipe[3].cdpId}
                                                            </button>
                                                        </div> : null}
                                                    {d.original.topWipe[4] ?
                                                        <div style={{ paddingBottom: '15px', }}>
                                                            <button style={{
                                                                color:
                                                                    d.original.topWipe[4].cdpId < 2000 ? '#FF695E' :
                                                                        d.original.topWipe[4].cdpId < 5000 ? '#FA9473' :
                                                                            d.original.topWipe[4].cdpId < 10000 ? '#E6BB48' :
                                                                                d.original.topWipe[4].cdpId < 15000 ? '#dbea98' : '#6abf69',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer',
                                                                background: 'none',
                                                                border: 'none',
                                                                padding: 0,
                                                            }}
                                                                onClick={() => this.handleClick(d.original.topWipe[4].cdpId)}>{d.original.topWipe[4].cdpId}
                                                            </button>
                                                        </div> : null}
                                                    <hr />
                                                    <div style={{ paddingBottom: '15px', }}>Top {d.original.topWipe.length}</div>
                                                </div>
                                            )
                                        },
                                    },
                                    {
                                        Header: 'DAI Wiped',
                                        id: 'DAI Wiped',
                                        accessor: d => d.topWipe.length ? <div style={{
                                            color: +d.topWipe[0].daiWipePercent > 25 ? 'red' :
                                                +d.topWipe[0].daiWipePercent > 10 ? 'orange' : '#6abf69'
                                        }}>
                                            {this.numberWithCommas(d.topWipe[0].daiWipe)}</div> : null,
                                        Cell: d => {
                                            let topWipeDaiTotal = 0
                                            d.original.topWipe.forEach((cdp) => topWipeDaiTotal += +cdp.daiWipe)
                                            return (
                                                <div>
                                                    {
                                                        d.original.topWipe[1] ?
                                                            <div style={{
                                                                paddingBottom: '15px',
                                                                color: +d.original.topWipe[1].daiWipePercent > 25 ? 'red' :
                                                                    +d.original.topWipe[1].daiWipePercent > 10 ? 'orange' : '#6abf69',
                                                            }}>
                                                                {this.numberWithCommas(d.original.topWipe[1].daiWipe)}
                                                            </div> : null
                                                    }
                                                    {
                                                        d.original.topWipe[2] ?
                                                            <div style={{
                                                                paddingBottom: '15px',
                                                                color: +d.original.topWipe[2].daiWipePercent > 25 ? 'red' :
                                                                    +d.original.topWipe[2].daiWipePercent > 10 ? 'orange' : '#6abf69',
                                                            }}>
                                                                {this.numberWithCommas(d.original.topWipe[2].daiWipe)}
                                                            </div> : null
                                                    }
                                                    {
                                                        d.original.topWipe[3] ?
                                                            <div style={{
                                                                paddingBottom: '15px',
                                                                color: +d.original.topWipe[3].daiWipePercent > 25 ? 'red' :
                                                                    +d.original.topWipe[3].daiWipePercent > 10 ? 'orange' : '#6abf69',
                                                            }}>
                                                                {this.numberWithCommas(d.original.topWipe[3].daiWipe)}
                                                            </div> : null
                                                    }
                                                    {
                                                        d.original.topWipe[4] ?
                                                            <div style={{
                                                                paddingBottom: '15px',
                                                                color: +d.original.topWipe[4].daiWipePercent > 25 ? 'red' :
                                                                    +d.original.topWipe[4].daiWipePercent > 10 ? 'orange' : '#6abf69',
                                                            }}>
                                                                {this.numberWithCommas(d.original.topWipe[4].daiWipe)}
                                                            </div> : null
                                                    }
                                                    <hr />
                                                    <div style={{ paddingBottom: '15px' }}>{`${this.truncateNumber(topWipeDaiTotal)} of ${this.truncateNumber(d.original.wipe)}`}</div>
                                                </div>
                                            )
                                        },
                                    },
                                    {
                                        Header: '% of Total',
                                        id: '% of Total Wipe',
                                        accessor: d => d.topWipe.length ? d.topWipe[0].daiWipePercent : null,
                                        Cell: d => {
                                            return (
                                                <div>
                                                    {d.original.topWipe[1] ? <div style={{ paddingBottom: '15px' }}>{d.original.topWipe[1].daiWipePercent}</div> : null}
                                                    {d.original.topWipe[2] ? <div style={{ paddingBottom: '15px' }}>{d.original.topWipe[2].daiWipePercent}</div> : null}
                                                    {d.original.topWipe[3] ? <div style={{ paddingBottom: '15px' }}>{d.original.topWipe[3].daiWipePercent}</div> : null}
                                                    {d.original.topWipe[4] ? <div style={{ paddingBottom: '15px' }}>{d.original.topWipe[4].daiWipePercent}</div> : null}
                                                    <hr />
                                                    <div style={{ paddingBottom: '15px' }}>{d.original.topWipePercent === 'NaN' ? 0 : d.original.topWipePercent}</div>
                                                </div>
                                            )
                                        },
                                    }
                                ]
                            },


                        ]}
                        defaultPageSize={14}
                        pageSizeOptions={[7, 14, 21, 28, 35]}
                        rowsText='days'
                        pivotBy={['date']}
                        sortable={false}
                        className="-striped -highlight"
                        style={{ color: '#FFF', textAlign: 'center', }}
                        previousText={<p style={{ color: '#FFF', }}>Next Week(s)</p>}
                        nextText={<p style={{ color: '#FFF', }}>Previous Week(s)</p>}
                    />
                </div>
            )
        } else {
            return (
                <div style={{
                    color: '#FFF', borderRadius: '5px', border: '2px solid #38414B',
                    backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px', height: '494px'
                }} >
                    <h4><Icon name='globe' />Loading Largest Daily CDP Actions</h4>
                    <hr style={{ opacity: '0.7' }} />
                    <Loader active inverted inline='centered' />

                </div>
            )
        }
    }
}
