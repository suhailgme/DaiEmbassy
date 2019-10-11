import React, { Component } from 'react'
import { Loader, Icon, Button } from 'semantic-ui-react'
import ReactTable from "react-table";
import "react-table/react-table.css";
const Humanize = require('humanize-plus')
const axios = require('axios')


class RecentActions extends Component {
    state = {
        // cdp: this.props.cdps.find((cdp) =>{
        // return cdp.cdpId === this.props.cdpId
        // }),
        // cdpId: this.props.cdpId
        pethWethRatio: this.props.systemStatus.pethWethRatio
    }

    async componentDidMount() {
        // console.log(this.props)
        // const cdpId = this.state.cdpId
        // if (cdpId) {
        //     const cdpRes = await axios.get(`https://api.daiembassy.com/cdp?id=${cdpId}`)
        //     const recentActions = cdpRes.data.actions
        //     console.log(recentActions)
        //     this.setState({ recentActions })
        // }
    }
    async componentDidUpdate(prevProps) {
        if (this.props.cdpId && this.props.cdpId !== prevProps.cdpId) {
            const cdpRes = await axios.get(`https://api.daiembassy.com/cdp?id=${this.props.cdpId}`)
            const recentActions = cdpRes.data.actions
            this.setState({ recentActions })
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.cdpId && nextProps.cdpId !== prevState.cdpId) {
            return { cdpId: nextProps.cdpId, recentActions: null }
        }
        return null

    }


    getActions = () => {
        let recentActions = []
        const actions = this.state.recentActions
        if (new Date(actions[0].time) < new Date(actions[actions.length - 1].time)) {
            actions.reverse()
        }

        // console.log("actions:", actions)

        // console.log('actions: ', actions)
        actions.forEach((action, index) => {
            recentActions.push(
                {
                    time: action.time,//new Date(action.time).toString().slice(0,-37),
                    act: `${action.act} ${action.act === 'OPEN' || action.act === 'GIVE' ? '' : action.act == 'DRAW' || action.act == 'WIPE' ? `${this.numberWithCommas(action.arg)} DAI` : action.act == 'LOCK' || action.act == 'FREE' ? `${this.numberWithCommas(action.arg)} PETH` : ''}`,
                    tx: <a target="_blank" href={`https://etherscan.io/tx/${action.tx}`} style={{ textDecoration: 'underline', color: 'inherit' }}>{this.truncateTx(action.tx)}</a>,
                    price: `$${this.numberWithCommas(action.pip, 2)}`,
                    debt: `${this.numberWithCommas(action.art)} DAI`,
                    collateral: `${this.numberWithCommas(action.ink)} PETH`,
                    ratio: action.act === 'BITE' ? String(((actions[index + 1].ink * action.pip * this.state.pethWethRatio) / actions[index + 1].art) * 100) : action.ratio,
                    id: index
                })
        })
        return recentActions
    }

    truncateTx = (tx) => {
        return `${tx.slice(0, 6)}...${tx.slice(-6)}`
    }

    numberWithCommas = (number, commas = 3) => {
        return Humanize.formatNumber(number, commas)
        // return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }


    render() {
        const loaded = this.state.recentActions
        if (loaded) {
            const actions = this.getActions()
            return (
                <div style={{
                    color: '#FFF', borderRadius: '5px', border: '2px solid #38414B',
                    backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px'
                }}>
                    {/* <Grid columns={2}>
                    <Grid.Column>
                        <h4 ><Icon name='target'/>CDP {this.state.cdpId} Actions</h4>
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                    <button style={{ background: 'none', border:'none', padding:0, textDecoration:'underline', color:'#FFF', cursor:'pointer'}} onClick={this.props.clearCdp}>Clear CDP</button>
                    <span style={{cursor:'pointer'}}onClick={this.props.clearCdp}><Icon name='close'/></span>
                    </Grid.Column>
                </Grid> */}
                    <div style={{ display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column' }}>
                        <h4 style={{marginBottom:0, paddingRight: '10px', paddingBottom:'14px'}}><Icon name='target' />CDP {this.state.cdpId}</h4>
                        <h4 style={{marginTop:0, marginBottom:0, paddingBottom:'14px', paddingRight: '10px'}}><Icon name='sitemap' />Total Actions: {actions.length}</h4>
                        <h4 style={{marginTop:0, paddingBottom:'14px'}}><Icon name='clock' />Age: {this.numberWithCommas((Math.floor(Date.parse(new Date()) - Date.parse(actions[actions.length-1].time)) / 86400000), 0)} Days</h4>

                    </div>

                    {/* <h4>Interactions: {actions.length}</h4> */}
                    <Button size='tiny' compact onClick={this.props.clearCdp}>Clear CDP</Button>
                    <hr style={{ opacity: '0.7' }} />
                    <ReactTable
                        data={actions}
                        columns={[

                            {
                                id: 'date',
                                Header: 'Date (local)',
                                accessor: data => new Date(data.time).toString().slice(0, -34)
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
                                accessor: 'ratio',
                                Cell: props => !props.value || props.value === 'Infinity' ? <p>0.00 %</p> : <p style={{ color: props.value == 0.00 ? '#FFF' : props.value < 170 ? '#FF695E' : props.value < 200 ? '#EFBC72' : '#FFF' }}>{`${this.numberWithCommas(props.value, 2)} %`}</p>,

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
                        className="-striped -highlight"
                        style={{ color: '#FFF', textAlign: 'center', height: '350px', }}
                        showPagination={false}
                        defaultPageSize={actions.length}
                        sortable={false}
                    />
                </div>
            )
        } else {
            return (
                <div style={{
                    color: '#FFF', borderRadius: '5px', border: '2px solid #38414B',
                    backgroundColor: '#273340', paddingTop: '10px', paddingLeft: '5px', height: '406px'
                }}>
                    <h4><Icon name='target' />Loading CDP Actions</h4>
                    <hr style={{ opacity: '0.7' }} />
                    <Loader active inverted inline='centered' />

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