import React, { Component } from 'react';
import TopMenu from './components/TopMenu'
import SideMenu from './components/SideMenu'
import RecentActions from './components/RecentActions'
import AllRecentActions from './components/AllRecentActions'
import SignificantActions from './components/SignificantActions'
import Liquidations from './components/Liquidations'
import DaiChart from './components/DaiChart'
import MkrChart from './components/MkrChart'
import ChartCdp from './components/ChartCdp'
import DailyActionsChart from './components/DailyActionsChart'
import DailyLockFreeChart from './components/DailyLockFreeChart'
import DailyWipeDrawChart from './components/DailyWipeDrawChart'
import CdpCollateralChart from './components/CdpCollateralChart'
import CumulativeDebt from './components/CumulativeDebtChart'
import CumulativeCollateral from './components/CumulativeCollateralChart'
import CdpDebtChart from './components/CdpDebtChart'


import Footer from './components/Footer'
import AllCdps from './components/AllCdps'
import { Grid, Loader, Tab, Dropdown } from 'semantic-ui-react'
import './App.css';
import MakerService from './MakerService'
import { getCdps } from './api/daiService'
import { getMarketData, getEthTicker, getDaiHistorical } from './api/marketData'
import ReactGA from 'react-ga'
const axios = require('axios')



class App extends Component {

  state = {
    cdpId: null,
    pethCollateral: '',
    usdCollateral: '',
    daiDebt: '',
    fees: '',
    account: '',
    loadingMsg: '',
    searchMsg: '',
    error: false,
    updating: false,
    selectedMarket: 'daiOHLC',
    systemSelection: 'dailyWipeDraw',
    cdpSelection: 'pethCollateral',
    currentTab: 0, //System is default tab (1), cdp stats is tab 0
    cdpActionsTab: 0,
    systemOptions: 3, //For system tab dropdown, default index 3 (dai repaid/created),
    marketOptions: 0 //For markets tab dropdown, default index 0 (dai ohlc)
  }

  async componentDidMount() {
    ReactGA.initialize('UA-128182811-1')
    ReactGA.pageview(window.location.pathname + window.location.search)
    const maker = new MakerService(5) //TODO catch error here on new Maker (maybe metamask issue...)
    this.setState({ loadingMsg: 'Initializing...', })
    await maker.init()
    const currentAccount = 'Dai Embassy Node'//await maker.getCurrentAccount()

    this.setState({ loadingMsg: 'Getting Market Data...' })
    // const data = await getMarketData()
    // const ethTicker = await getEthTicker()
    // const ethSupply = ethTicker.circulating_supply
    // Data2 is DAI price from coinPaprika. Restore to setState({data}) to show ETH price from cryptoCompare.
    // const data2 = await getDaiHistorical()
    // const dailyCdpsRes = await axios.get('https://dai-embassy-server.herokuapp.com/dailyCdps')
    const dailyWipeDrawRes = await axios.get('https://dai-embassy-server.herokuapp.com/dailywipedraw')
    // const dailyWipeDrawRes = await axios.get('http://localhost:2917/dailywipedraw')


    const marketRes = await axios.get('https://dai-embassy-server.herokuapp.com/daiOHLC')
    // const marketRes = await axios.get('http://localhost:2917/daiOHLC')

    // let dailyActions = await axios.get('https://dai-embassy-server.herokuapp.com/dailyActions')
    const systemStatusRes = await axios.get('https://dai-embassy-server.herokuapp.com/systemStatus')

    const systemStatus = systemStatusRes.data
    // let allRecentActions = await axios.get('http://localhost:2917/allRecentActions')
    // allRecentActions = allRecentActions.data.allRecentActions


    let data2 = marketRes.data.daiOHLC
    data2.forEach(day => {
      day.date = new Date(day.date)
    })
    // let data3 = dailyCdpsRes.data.dailyCdps.reverse()
    // data3.forEach(day =>{
    //   day.date = new Date(day.date)
    // })
    let dailyWipeDraw = dailyWipeDrawRes.data.dailyWipeDraw.reverse()
    dailyWipeDraw.forEach(day => {
      day.date = new Date(day.date)
    })
    // dailyActions = (dailyActions.data.dailyActions).reverse()
    // dailyActions.forEach(action => {
    //   action.date = new Date(action.date)
    // })


    this.setState({ marketData: data2, dailyWipeDraw, systemStatus, })
    this.setState({ currentAccount, loadingMsg: 'Getting CDPs...' })
    const res = await axios.get('https://dai-embassy-server.herokuapp.com/searchableCdps')
    const cdps = res.data.searchableCdps
    // console.log(cdps)
    // const cdps = await getCdps()

    // let mostDebt = 0
    // let cdpId = null

    // Search for largest CDP by debt and set its cdpid to its id
    // cdps.forEach(cdp => {
    //   if (+cdp.daiDebt > mostDebt) {
    //     mostDebt = +cdp.daiDebt
    //     cdpId = cdp.cdpId
    //   }
    // })

    // console.log(cdps)

    // After setting cdpid to lagest debtor, set loading msg for user
    // this.setState({ loadingMsg: `Loading CDP ${cdpId}...` })

    // Set account to owner of the associated cdpid. Currently account is set to 'dai embassy node'
    // This is for use with metamask if a cdp is loaded from metamask eth account
    // const { account } = cdps.find((cdp) => {
    //   return cdp.cdpId === cdpId
    // })

    // console.log(account, cdpId)

    // Set dai.js maker instance to current cdpid. Used when loading largest debtor cdp or cdp from metamask.
    // try {
    //   await maker.setCdpId(cdpId)
    // } catch (error) {
    //   this.setState({ currentAccount, account, maker, cdpId, error: true, loadingMsg: `Error loading CDP - Click to retry` })
    //   return
    // }

    // this.setState({ cdpId })

    // Retrieve chart data for peth collateral and dai debt from server using cdpId
    //const cdpCollateralDebtRes = await axios.get(`https://dai-embassy-server.herokuapp.com/collateralDebt?&id=${this.state.cdpId}`)
    // const cdpCollateralDebtRes = await axios.get(`http://localhost:2917/collateralDebt?&id=${this.state.cdpId}`)

    // Create date object from each string date for use in cdp specific charts
    // let cdpCollateralDebt = cdpCollateralDebtRes.data.collateralDebt
    // cdpCollateralDebt.forEach(day => {
    //   day.date = new Date(day.date)
    // })

    // Get all specific CDP details for use in simulator and details widgets on the sidebar.
    // Used when loading a cdp by default (largest debtor, or from metamask account)
    // const { wipeDraw, cdpDetails, error } = await maker.getAllDetails()

    // Catch error resulting from failed api calls from wipeDraw and cdpDetails calls
    // if (error) {
    //   ReactGA.event({
    //     category: 'Error',
    //     action: `Error on initial load`,
    //     label: new Date().toString()
    //   })
    //   this.setState({ currentAccount, account, maker, cdpId, error: true, loadingMsg: `Error loading CDP - Click to retry` })
    //   return
    // }

    // Provide cdp details widget with the owners account associated with the specific cdpid
    // cdpDetails.account = account

    this.setState({ cdps, updating: false, currentAccount, maker, loadingMsg: '', })
    // this.updateData()
    // console.log(this.state.cdpCollateralDebt)

  }

  handleSearchClick = async (e, { value }) => {
    if (!this.state.loadingMsg) {

      window.scrollTo(0, 0)
      const id = parseInt(value)
      if (this.state.cdpId !== id || e) {
        ReactGA.event({
          category: this.state.currentAccount,
          action: `Searched for CDP ${id}`,
          label: new Date().toString()
        })
        this.setState({ error: false, wipeDraw: null, cdpDetails: null, systemStatus: null, cdpId: null, searchMsg: '', loadingMsg: `Loading CDP: ${id}`, updating: true })

        const maker = this.state.maker
        try {
          await maker.setCdpId(id) // needs error handling! If error occurs, site loads properly with last CDP info (not accurate)
          this.setState({ cdpId: id })
        } catch (error) {
          this.setState({ error: true, loadingMsg: `Error loading CDP ${id} - Please wait a few seconds before retrying.`, searchMsg: `Error loading CDP ${id}` })
          return
        }
        const cdpCollateralDebtRes = await axios.get(`https://dai-embassy-server.herokuapp.com/collateralDebt?&id=${this.state.cdpId}`)
        // const cdpCollateralDebtRes = await axios.get(`http://localhost:2917/collateralDebt?&id=${this.state.cdpId}`)

        let cdpCollateralDebt = cdpCollateralDebtRes.data.collateralDebt
        cdpCollateralDebt.forEach(day => {
          day.date = new Date(day.date)
        })

        const systemStatusRes = await axios.get('https://dai-embassy-server.herokuapp.com/systemStatus')
        const systemStatus = systemStatusRes.data
        const { wipeDraw, cdpDetails, error } = await maker.getAllDetails()
        // console.log('Wipe draw after click: ', wipeDraw,cdpDetails,systemStatus, error)
        if (error) {
          ReactGA.event({
            category: this.state.currentAccount,
            action: `encountered error searching for CDP ${id}`,
            label: new Date().toString()
          })
          this.setState({ error: true, loadingMsg: `Error loading CDP ${id} - Please wait a few seconds before retrying.`, searchMsg: `Error loading CDP ${id}` })
          return
        }
        const { account } = this.state.cdps.find((cdp) => {
          return cdp.cdpId === id
        })

        cdpDetails.account = account

        // if (this.state.updating) {
        this.setState({ error: false, wipeDraw, cdpDetails, systemStatus, cdpId: id, loadingMsg: '', cdpCollateralDebt, updating: false })
        // } else {
        //   this.setState({ updating: true, error: false, wipeDraw, cdpDetails, systemStatus, cdpId: id, loadingMsg: '', cdpCollateralDebt })
        //   // this.updateData()
        // }
        // console.log(cdpCollateralDebt)
        ReactGA.pageview(`/cdp/${id}`)

      }
    }
  }

  handleError = async () => {
    await this.handleSearchClick(this.state.error, { value: this.state.cdpId })
  }

  updateData = async () => {
    console.log('Updating data every 30s...')
    setInterval(async () => {
      if (!this.state.error && !this.state.loadingMsg) {
        const maker = this.state.maker
        const { wipeDraw, cdpDetails, systemStatus, error } = await maker.getAllDetails()
        console.log('Updating data')
        if (!error) {
          console.log('new data: ', systemStatus)
          this.setState({ wipeDraw, cdpDetails, systemStatus })
        }
      }
    }, 30000)
  }

  handleMarketButton = async (e, { value }) => {
    e.preventDefault()
    const marketOptions = {'daiOHLC': 0, 'mkrOHLC': 1}
    const currentSelection = this.state.selectedMarket
    const selection = value
    if (selection !== currentSelection) {
      ReactGA.modalview(`/${selection}`);
      const marketRes = await axios.get(`https://dai-embassy-server.herokuapp.com/${selection}`)
      // const marketRes = await axios.get(`http://localhost:2917/${selection}`)

      let data = marketRes.data[selection]
      data.forEach(day => {
        day.date = new Date(day.date)
      })
      this.setState({ marketData: data, selectedMarket: selection,marketOptions: marketOptions[selection] })
    }
  }

  handleSystemButton = async (e, { value }) => {
    e.preventDefault()
    const systemOptions = {'dailyCdps': 0,'dailyActions':1, 'dailyLockFree': 2, 'dailyWipeDraw': 3, 'cumulativeDebt': 4, 'cumulativeCollateral': 5}
    const currentSelection = this.state.systemSelection
    const selection = value
    if (selection !== currentSelection) {
      this.setState({ [selection]: null })

      ReactGA.modalview(`/${selection}`);
      const res = await axios.get(`https://dai-embassy-server.herokuapp.com/${selection}`)
      // const res = await axios.get(`http://localhost:2917/${selection}`)

      let data = res.data[selection].reverse()
      data.forEach(day => {
        day.date = new Date(day.date)
      })
      // console.log(selection, data)

      this.setState({ [selection]: data, systemSelection: selection, systemOptions:systemOptions[selection] })
    }
  }

  handleCdpButton = async (e) => {
    e.preventDefault()
    const currentSelection = this.state.cdpSelection
    const selection = e.target.value
    if (selection !== currentSelection) {
      ReactGA.modalview(`/${this.state.cdpId}/${selection}`);
      this.setState({ cdpSelection: selection })
    }
  }



  handleTabChange = (e, activeIndex, menuItem) => {
    e.preventDefault()
    if (this.state.currentTab !== activeIndex) {
      this.setState({ currentTab: activeIndex })
      ReactGA.modalview(`/tab/${menuItem}`)
      // console.log(menuItem)
    }
  }

  handleActionsTabChange = (e, activeIndex, menuItem) => {
    if (this.state.cdpActionsTab !== activeIndex) {
      this.setState({ cdpActionsTab: activeIndex })
      ReactGA.modalview(`/table/${menuItem}`)
      // console.log(menuItem)
    }
  }

  loadContent = () => {
    if (!this.state.error) {
      const systemOptions = [
        {
          key: 'CDP Creation',
          text: 'CDP Creation',
          value: 'dailyCdps',
        },
        {
          key: 'CDP Activity',
          text: 'CDP Activity',
          value: 'dailyActions',
        },
        {
          key: 'PETH Deposits/Withdrawals',
          text: 'PETH Deposits/Withdrawals',
          value: 'dailyLockFree',
        },
        {
          key: 'DAI Repaid/Created',
          text: 'DAI Repaid/Created',
          value: 'dailyWipeDraw',
        },
        {
          key: 'Cumulative Debt',
          text: 'Cumulative Debt',
          value: 'cumulativeDebt'
        },
        {
          key: 'Cumulative Collateral',
          text: 'Cumulative Collateral',
          value: 'cumulativeCollateral'
        }
      ]
      const marketOptions = [
        {
          key: 'DAI/USD (Global Avg.)',
          text: 'DAI/USD (Global Avg.)',
          value: 'daiOHLC',
        },
        {
          key: 'MKR/USD (Global Avg.)',
          text: 'MKR/USD (Global Avg.)',
          value: 'mkrOHLC',
        },
      ]
      const panes = [
        {
          menuItem: { key: 0, icon: 'target', content: this.state.updating ? 'Loading' : `CDP ${this.state.cdpId}` },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              height: '565px',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0,
              paddingBottom: 0
            }}>
              <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='pethCollateral' onClick={this.handleCdpButton}>{`PETH Collateral`}</button>
              <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='daiDebt' onClick={this.handleCdpButton}>{`DAI Debt`}</button>
              <hr style={{ opacity: '0.7' }} />
              {this.state.cdpCollateralDebt && this.state.cdpDetails ? this.state.cdpSelection === 'pethCollateral' ? <CdpCollateralChart data={this.state.cdpCollateralDebt} cdpId={this.state.cdpId} /> : <CdpDebtChart data={this.state.cdpCollateralDebt} cdpId={this.state.cdpId} /> : <Loader active inverted inline='centered' />}
              {this.state.cdpCollateralDebt && this.state.cdpDetails ?
                <Grid>
                  <Grid.Column textAlign="right" style={{ paddingRight: "27px", paddingBottom: 0, paddingTop: "12px" }}>
                    <div className={{ position: "relative" }}>
                      <div style={{ width: "10px", height: "10px", backgroundColor: "#E6BB48", display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                      <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>Liquidation Price</span>
                      <div style={{ width: "10px", height: "10px", backgroundColor: this.state.cdpSelection == "pethCollateral" ? "#189F3A" : "#FF0000", display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                      <span style={{ paddingLeft: "20px", color: "#FFF" }}>{this.state.cdpSelection == "pethCollateral" ? `PETH Collateral` : `DAI Debt`}</span>
                    </div>
                  </Grid.Column>
                </Grid>
                : null}

            </Tab.Pane>
        },
        {
          menuItem: { key: 1, icon: 'cog', content: 'System' },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              height: window.innerWidth > 768 ? '565px' : this.state.systemSelection == "dailyLockFree" ? '585px' : this.state.systemSelection == "cumulativeDebt"  || this.state.systemSelection == "cumulativeCollateral"  ? '605px' : '565px',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0
            }}
            >
              {/* <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='dailyCdps' onClick={this.handleSystemButton}>{`CDP Creation`}</button>
              <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='dailyActions' onClick={this.handleSystemButton}>{`CDP Activity`}</button>
              <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='dailyLockFree' onClick={this.handleSystemButton}>{`PETH Deposits/Withdrawals`}</button>
              <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='dailyWipeDraw' onClick={this.handleSystemButton}>{`DAI Repaid/Created`}</button> */}
              <Grid columns={window.innerWidth > 768 ? 2 : 1}>
                <Grid.Column>
                  <span style={{ color: '#FFF' }}>
                    {`Chart Selection: `}
                    <Dropdown
                      options={systemOptions}
                      value={systemOptions[this.state.systemOptions].value}
                      onChange={this.handleSystemButton}
                    />
                  </span>
                </Grid.Column>
                {/* <Grid.Column textAlign='right' only='computer'>
                  Download
                </Grid.Column> */}
              </Grid>



              <hr style={{ opacity: '0.7' }} />
              {this.state.dailyCdps && this.state.systemSelection === 'dailyCdps' ? <ChartCdp data={this.state.dailyCdps} /> : this.state.dailyActions && this.state.systemSelection === 'dailyActions' ? <DailyActionsChart data={this.state.dailyActions} /> : this.state.dailyLockFree && this.state.systemSelection === 'dailyLockFree' ? <DailyLockFreeChart data={this.state.dailyLockFree} /> : this.state.dailyWipeDraw && this.state.systemSelection === 'dailyWipeDraw' ? <DailyWipeDrawChart data={this.state.dailyWipeDraw} /> : this.state.cumulativeDebt && this.state.systemSelection === 'cumulativeDebt' ? <CumulativeDebt data={this.state.cumulativeDebt} /> : this.state.cumulativeCollateral && this.state.systemSelection === 'cumulativeCollateral' ? <CumulativeCollateral data={this.state.cumulativeCollateral} /> : <Loader active inverted inline='centered' />}
              {(this.state.systemSelection == "dailyWipeDraw" || this.state.systemSelection == "dailyLockFree") && (this.state.dailyWipeDraw || this.state.dailyLockFree) ?
                <Grid>
                  <Grid.Column textAlign="right" style={{ paddingRight: "27px", paddingBottom: 0, paddingTop: "12px" }}>
                    <div className={{ position: "relative" }}>
                      {(() => {
                        if (this.state.systemSelection == "dailyLockFree") {
                          return (
                            <span>
                              <div style={{ width: "10px", height: "10px", backgroundColor: "#2a95dd", display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                              <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>Locked ETH</span>
                            </span>
                          )
                        }
                      })()}
                      <div style={{ width: "10px", height: "10px", backgroundColor: "#E6BB48", display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                      <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>{this.state.systemSelection == "dailyWipeDraw" ? 'Circulating DAI' :'Locked PETH'}</span>
                      <span style={{ display: 'inline-block' }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: "#FF0000", display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF", }}>{this.state.systemSelection == "dailyWipeDraw" ? `DAI Created` : `PETH Withdrawn`}</span>
                      </span>
                      <span style={{ display: 'inline-block' }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: "#189F3A", display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF" }}>{this.state.systemSelection == "dailyWipeDraw" ? `DAI Repaid` : `PETH Deposited`}</span>
                      </span>

                    </div>
                  </Grid.Column>
                </Grid>

                : (this.state.systemSelection === 'cumulativeDebt' || this.state.systemSelection === 'cumulativeCollateral') && (this.state.cumulativeDebt || this.state.cumulativeCollateral) ? 
                <Grid>
                <Grid.Column textAlign="right" style={{ paddingRight: "27px", paddingBottom: 0, paddingTop: "12px" }}>
                  <div className={{ position: "relative" }}>
                    <div style={{ width: "10px", height: "10px", backgroundColor: this.state.systemSelection === 'cumulativeDebt' ? "#FF0000" : '#189F3A', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                    <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>{this.state.systemSelection === 'cumulativeDebt' ? 'Cumulative DAI Created' : 'Cumulative PETH Deposited'}</span>
                    <span style={{ display: 'inline-block' }}>
                      <div style={{ width: "10px", height: "10px", backgroundColor: this.state.systemSelection === 'cumulativeDebt' ? "#189F3A" : '#FF0000', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                      <span style={{ paddingLeft: "20px", color: "#FFF", }}>{this.state.systemSelection === 'cumulativeDebt' ? 'Cumulative DAI Repaid' : 'Cumulative PETH Withdrawn'}</span>
                    </span>
                    <span style={{ display: 'inline-block' }}>
                      <div style={{ width: "10px", height: "10px", backgroundColor: "#366b93", display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                      <span style={{ paddingLeft: "20px", color: "#FFF" }}>{this.state.systemSelection === 'cumulativeDebt' ? 'Cumulative DAI Liquidated' : 'Cumulative PETH Liquidated'}</span>
                    </span>

                  </div>
                </Grid.Column>
              </Grid> 
              : null}

            </Tab.Pane>
        },
        {
          menuItem: { key: 2, icon: 'area chart', content: 'Markets' },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              height: '555px',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0
            }}>
              {/* <button style={{ background: 'none', border: 'none', paddingLeft: 0, textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='daiOHLC' onClick={this.handleMarketButton}>{`DAI/USD (Global Avg.)`}</button>
              <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='mkrOHLC' onClick={this.handleMarketButton}>{`MKR/USD (Global Avg.)`}</button> */}
              <span style={{color:'#FFF'}}>
                Chart Selection:{` `}
                <Dropdown
                  options={marketOptions}
                  value={marketOptions[this.state.marketOptions].value}
                  onChange={this.handleMarketButton}
                />
              </span>
              <hr style={{ opacity: '0.7' }} />
              {this.state.marketData && this.state.selectedMarket === 'daiOHLC' ? <DaiChart data={this.state.marketData} market={this.state.selectedMarket} /> : this.state.marketData && this.state.selectedMarket === 'mkrOHLC' ? <MkrChart data={this.state.marketData} market={this.state.selectedMarket} /> : <Loader active inverted inline='centered' />}
            </Tab.Pane>
        },
      ]
      const cdpActionsPane = [
        {
          menuItem: { key: 0, icon: 'lightning', content: 'Significant CDP Actions' },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0,
              padding: 0
            }}
            >
              <SignificantActions handleSearchClick={this.handleSearchClick} />
            </Tab.Pane>
        },
        {
          menuItem: { key: 1, icon: 'history', content: 'All CDP Actions' },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0,
              padding: 0
            }}
            >
              <AllRecentActions handleSearchClick={this.handleSearchClick} />
            </Tab.Pane>
        },
        {
          menuItem: { key: 2, icon: 'trash', content: 'Liquidations' },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0,
              padding: 0
            }}
            >
              <Liquidations handleSearchClick={this.handleSearchClick} />
            </Tab.Pane>
        }]
      return (
        <Grid.Row style={{ paddingTop: 0, paddingLeft: '2px' }} >
          <SideMenu
            wipeDraw={this.state.wipeDraw}
            cdpDetails={this.state.cdpDetails}
            systemStatus={this.state.systemStatus}
            account={this.state.account}
            cdpId={this.state.cdpId}
            updating={this.state.updating}
            loading={this.state.loadingMsg}
          />

          <Grid.Column width={12} tablet={10}>
            <Tab
              menu={{ attached: 'top', inverted: true, style: { backgroundColor: '#273340', border: '2px solid #38414B' } }}
              style={{ paddingBottom: '10px', }}
              defaultActiveIndex={this.state.currentTab}
              onTabChange={(e, { activeIndex }) => this.handleTabChange(e, activeIndex, panes[activeIndex].menuItem.content)}
              panes={this.state.cdpId ? panes : panes.slice(1)}
              onMouseEnter={() => {
                if (!this.state.loadingMsg && window.innerWidth > 768) {
                  let style = document.body.style.overflow
                  document.body.style.overflow = 'hidden'
                }
              }}
              onMouseLeave={() => {
                if (!this.state.loadingMsg && window.innerWidth > 768) {
                  let style = document.body.style.overflow
                  document.body.style.overflow = 'auto'
                }
              }}

            >

            </Tab>

            {this.state.cdpId || this.state.updating ? <RecentActions cdpId={this.state.cdpId} /> : null}
            <Tab
              menu={{ attached: 'top', inverted: true, style: { backgroundColor: '#273340', border: '2px solid #38414B', display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', flexWrap: 'wrap' } }}
              style={{ paddingTop: '10px',}}
              defaultActiveIndex ={this.state.cdpActionsTab}
              onTabChange={(e, {activeIndex}) => this.handleActionsTabChange(e, activeIndex, cdpActionsPane[activeIndex].menuItem.content)}
              panes={cdpActionsPane}
            >
        </Tab>
              <div style={{paddingTop:'10px'}}>  
              <AllCdps handleSearchClick={this.handleSearchClick} cdps={this.state.cdps}  systemStatus={this.state.systemStatus}/>
            </div>
        </Grid.Column>
      </Grid.Row>
       ) 
    }else{ 
      return(
        //return only load er element  to restore previous f uncti on (remove grids, etc.) ONLY IF NEEDED
        <Grid.Row style={{paddingTop:'10%', paddingBottom:'10%'}}>
          <Grid.Column>        
            <Loader inverted active content={this.state.error ? <button onClick={this.handleError} style={{background: 'none', border:'none', padding:0, textDecoration:'underline', color:'#FFF', cursor:'pointer'}}>{this.state.loadingMsg}</button> : this.state.loadingMsg}/>
          </Grid.Column>
</Grid.Row>
        
      )
    }
  }

  render() {
    return (   
      <div className="App" style={{backgroundColor:'#232D39'}}>
        <Grid stackable>    
          <Grid.Row style={{paddingBottom:0, paddingLeft:'2px'}}> 
            <TopMenu searchMsg={this.state.searchMsg} loadingMsg={this.state.loadingMsg} handleSearchClick={this.handleSearchClick} cdps={this.state.cdps} account={this.state.currentAccount}/>
          </Grid.Row>
          {this.loadContent()}
        </Grid> 
        <Footer/>

      </div>
    );
  }
}

export default App;
