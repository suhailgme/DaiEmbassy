import React, { Component } from 'react';
import TopMenu from './components/TopMenu'
import SideMenu from './components/SideMenu'
import RecentActions from './components/RecentActions'
import AllRecentActions from './components/AllRecentActions'
import SignificantActions from './components/SignificantActions'
import Liquidations from './components/Liquidations'
import LargestDailyActions from './components/LargestDailyActions'
import DaiChart from './components/DaiChart'
import MkrChart from './components/MkrChart'
import ChartCdp from './components/ChartCdp'
import DailyActionsChart from './components/DailyActionsChart'
import DailyActionsDaiStackedChart from './components/DailyActionsDaiStackedChart'
import DailyActionsDaiChart from './components/DailyActionsDaiChart'
import DailyLockFreeChart from './components/DailyLockFreeChart'
import DailyWipeDrawChart from './components/DailyWipeDrawChart'
import CdpCollateralChart from './components/CdpCollateralChart'
import CumulativeDebt from './components/CumulativeDebtChart'
import CumulativeCollateral from './components/CumulativeCollateralChart'
import CdpDebtChart from './components/CdpDebtChart'
import Footer from './components/Footer'
import OpenCdps from './components/OpenCdps'
import ShutCdps from './components/ShutCdps'
import { Grid, Loader, Tab, Dropdown, Button, Icon, Popup } from 'semantic-ui-react'
import './App.css';
import MakerService from './MakerService'
import daiIcon from '../src/images/daiIcon.png'
import ethIcon from '../src/images/ethIcon.png'
import mkrIcon from '../src/images/mkrIcon.png'
import ReactGA from 'react-ga'
const axios = require('axios')
const Url = require('url-parse')


class App extends Component {

  state = {
    cdpId: null, // No CDP loaded by default 
    daiDebt: '',
    account: '',
    loadingMsg: '',
    searchMsg: '',
    error: false,
    updating: false,
    systemSelection: 'dailyActionsDai',
    daiSelection: 'dailyWipeDraw',
    pethSelection: 'dailyLockFree',
    mkrSelection: 'mkrOHLC',
    cdpSelection: 'pethCollateral',
    currentTab: 1, //DAI is default tab (1), cdp stats is tab 0
    cdpActionsTab: 0,
    systemOptions: 2, //For system tab dropdown, default index 2 (daily cdps activity expressed in dai),
    daiOptions: 0, // For dai tab dropdown, default index 0 (dai repaid/created)
    pethOptions: 0, // For peth tab dropdown, default index 0 (peth locked/freed)
    mkrOptions: 0, // For mkr tab dropdown, default index 0 (mkr OHLC)
    stackedActivityChart: true,
  }

  async componentDidMount() {
    ReactGA.initialize('UA-128182811-1')
    ReactGA.pageview(window.location.pathname + window.location.search)
    const maker = new MakerService(5) //TODO catch error here on new Maker (maybe metamask issue...)
    this.setState({ loadingMsg: 'Initializing...', })
    await maker.init()
    const currentAccount = 'Dai Embassy Node'//await maker.getCurrentAccount()

    this.setState({ loadingMsg: 'Getting Market Data...' })

    const dailyWipeDrawRes = await axios.get('https://api.daiembassy.com/dailywipedraw')
    // const dailyWipeDrawRes = await axios.get('http://localhost:2917/dailywipedraw')

    const dailyLockFreeRes = await axios.get('https://api.daiembassy.com/dailylockfree')

    const marketRes = await axios.get('https://api.daiembassy.com/mkrOHLC')
    // const marketRes = await axios.get('http://localhost:2917/daiOHLC')

    const dailyActionsDaiRes = await axios.get('https://api.daiembassy.com/dailyActionsDai')
    // const dailyActionsDaiRes = await axios.get('http://localhost:2917/dailyActionsDai')



    // let dailyActions = await axios.get('https://api.daiembassy.com/dailyActions')
    const systemStatusRes = await axios.get('https://api.daiembassy.com/systemStatus')
    const systemStatus = systemStatusRes.data
    // let allRecentActions = await axios.get('http://localhost:2917/allRecentActions')
    // allRecentActions = allRecentActions.data.allRecentActions

    // Temporary client-side fix for API error. Error with coinpaprika api needs to be debugged
    // on server.
    let mkrOHLC
    if (marketRes.data.mkrOHLC.length) {
      mkrOHLC = marketRes.data.mkrOHLC.reverse()
      mkrOHLC.forEach(day => {
        day.date = new Date(day.date)
      })
    } else {
      mkrOHLC = null
    }


    let dailyWipeDraw = dailyWipeDrawRes.data.dailyWipeDraw.reverse()
    dailyWipeDraw.forEach(day => {
      day.date = new Date(day.date)
    })

    let dailyLockFree = dailyLockFreeRes.data.dailyLockFree.reverse()
    dailyLockFree.forEach(day => {
      day.date = new Date(day.date)
    })

    let dailyActionsDai = (dailyActionsDaiRes.data.dailyActionsDai).reverse()
    dailyActionsDai.forEach(day => {
      day.date = new Date(day.date)
    })


    this.setState({ mkrOHLC, dailyWipeDraw, systemStatus, dailyLockFree, dailyActionsDai })
    this.setState({ currentAccount, loadingMsg: 'Getting CDPs...' })
    const res = await axios.get('https://api.daiembassy.com/searchableCdps')
    // const res = await axios.get('http://localhost:2917/searchableCdps')

    const cdps = res.data.searchableCdps
    // console.log(cdps)

    /***************** Used when loading CDP by default upon page load *****************/
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
    //const cdpCollateralDebtRes = await axios.get(`https://api.daiembassy.com/collateralDebt?&id=${this.state.cdpId}`)
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


    this.setState({ cdps, updating: false, currentAccount, maker, loadingMsg: '' })

    let path = window.location.href
    let url = new Url(path, true)
    if (url.pathname === '/cdp') {
      let cdpId = parseInt(url.query.id)
      const cdpExists = cdps.find(cdp => {
        return cdp.cdpId === cdpId
      })
      if (cdpExists) this.handleSearchClick(null, { value: cdpId })
      else this.setState({ searchMsg: `CDP ${cdpId} does not exist!`, cdpId: null })
    }
    
    // if(url.pathname ==='/chart'){
    //   let chartName = url.query.id.toLocaleLowerCase()
    //   switch(chartName){
    //     case 'cumulativedebt': {
    //       this.handleDaiButton(null, {value:'cumulativeDebt'})
    //       break;
    //     }
    //     case 'circulatingdai':{
    //       this.handleDaiButton(null, {value:'dailyWipeDraw'})
    //       break;
    //     }
    //     case 'daiprice':{
    //       this.handleDaiButton(null, {value:'daiOHLC'})
    //       break;
    //     }
    //     default: break;
    //   }
    // }

    window.onpopstate = () => {
      let path = window.location.href
      let url = new Url(path, true)
      // console.log(url)
      if (url.pathname === '/cdp') {
        let cdpId = parseInt(url.query.id)
        const cdpExists = cdps.find(cdp => {
          return cdp.cdpId === cdpId
        })
        if (cdpExists) this.handleSearchClick(null, { value: cdpId })
        else this.setState({ searchMsg: `CDP ${cdpId} does not exist!`, cdpId: null, currentTab: 1 })
      }
      if (url.pathname === '/' && this.state.cdpId !== null)
        this.clearCdp()
    }
    // console.log(url)



    // let path = window.location.pathname.toLocaleLowerCase()
    // console.log(path.lastIndexOf('/cdp/'))
    // if(path === '/cdp/2796'){
    //   this.handleSearchClick(null, { value: 2796 })
    //   // window.location.pathname = '/chart/lockedsomethingorother'
    // }

    // console.log(window.location.pathname + window.location.href)

    // this.updateData()
    // console.log(this.state.cdpCollateralDebt)

  }

  setInitalState = () => {

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
        window.history.pushState({}, 'CDP ' + id, '/cdp?id=' + id)
        this.setState({ error: false, cdpCollateralDebt: null, wipeDraw: null, cdpDetails: null, cdpId: null, searchMsg: '', loadingMsg: `Loading CDP: ${id}`, updating: true, currentTab: 0 })

        const maker = this.state.maker
        // try {
        const cdpExists = await maker.setCdpId(id) // needs error handling! If error occurs, site loads properly with last CDP info (not accurate)
        this.setState({ cdpId: id })
        if (cdpExists) {
          const { wipeDraw, cdpDetails, error } = await maker.getAllDetails()
          const { account } = this.state.cdps.find((cdp) => {
            return cdp.cdpId === id
          })
          cdpDetails.account = account
          this.setState({ wipeDraw, cdpDetails, })
          // console.log('Wipe draw after click: ', wipeDraw,cdpDetails,systemStatus, error)
          // if (error) {
          //   ReactGA.event({
          //     category: this.state.currentAccount,
          //     action: `encountered error searching for CDP ${id}`,
          //     label: new Date().toString()
          //   })
          //   this.setState({ error: true, loadingMsg: `Error loading CDP ${id} - Please wait a few seconds before retrying.`, searchMsg: `Error loading CDP ${id}` })
          //   return
          // }
        }
        // } catch (error) {
        //   console.log('error')
        // this.setState({ cdpId: null })
        // this.setState({ error: true, loadingMsg: `Error loading CDP ${id} - Please wait a few seconds before retrying.`, searchMsg: `Error loading CDP ${id}` })
        // return
        // }

        const cdpCollateralDebtRes = await axios.get(`https://api.daiembassy.com/collateralDebt?&id=${this.state.cdpId}`)
        // const cdpCollateralDebtRes = await axios.get(`http://localhost:2917/collateralDebt?&id=${this.state.cdpId}`)
        let cdpCollateralDebt = cdpCollateralDebtRes.data.collateralDebt
        cdpCollateralDebt.forEach(day => {
          day.date = new Date(day.date)
        })

        const systemStatusRes = await axios.get('https://api.daiembassy.com/systemStatus')
        const systemStatus = systemStatusRes.data



        // if (this.state.updating) {
        this.setState({ error: false, systemStatus, cdpId: id, loadingMsg: '', cdpCollateralDebt, updating: false, })
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

  handleSystemButton = async (e, { value }) => {
    e.preventDefault()
    const systemOptions = { 'dailyCdps': 0, 'dailyActions': 1, 'dailyActionsDai': 2 }
    const currentSelection = this.state.systemSelection
    const selection = value
    if (selection !== currentSelection) {
      this.setState({ [selection]: null })

      ReactGA.modalview(`/${selection}`);
      const res = await axios.get(`https://api.daiembassy.com/${selection}`)
      // const res = await axios.get(`http://localhost:2917/${selection}`)

      let data = res.data[selection].reverse()
      data.forEach(day => {
        day.date = new Date(day.date)
      })
      // console.log(selection, data)

      this.setState({ [selection]: data, systemSelection: selection, systemOptions: systemOptions[selection] })
    }
  }

  handleDaiButton = async (e, { value }) => {
    // e.preventDefault()
    const daiOptions = { 'dailyWipeDraw': 0, 'cumulativeDebt': 1, 'daiOHLC': 2 }
    const currentSelection = this.state.daiSelection
    const selection = value
    if (selection !== currentSelection) {
      this.setState({ [selection]: null })

      ReactGA.modalview(`/${selection}`);
      const res = await axios.get(`https://api.daiembassy.com/${selection}`)
      // const res = await axios.get(`http://localhost:2917/${selection}`)

      let data = res.data[selection].reverse()
      data.forEach(day => {
        day.date = new Date(day.date)
      })
      // console.log(selection, data)

      this.setState({ [selection]: data, daiSelection: selection, daiOptions: daiOptions[selection] })
    }
  }

  handlePethButton = async (e, { value }) => {
    e.preventDefault()
    const pethOptions = { 'dailyLockFree': 0, 'cumulativeCollateral': 1, }
    const currentSelection = this.state.pethSelection
    const selection = value
    if (selection !== currentSelection) {
      this.setState({ [selection]: null })

      ReactGA.modalview(`/${selection}`);
      const res = await axios.get(`https://api.daiembassy.com/${selection}`)
      // const res = await axios.get(`http://localhost:2917/${selection}`)

      let data = res.data[selection].reverse()
      data.forEach(day => {
        day.date = new Date(day.date)
      })
      // console.log(selection, data)

      this.setState({ [selection]: data, pethSelection: selection, pethOptions: pethOptions[selection] })
    }
  }

  handleMkrButton = async (e, { value }) => {
    e.preventDefault()
    const mkrOptions = { 'mkrOHLC': 0, }
    const currentSelection = this.state.mkrSelection
    const selection = value
    if (selection !== currentSelection) {
      ReactGA.modalview(`/${selection}`);
      const marketRes = await axios.get(`https://api.daiembassy.com/${selection}`)
      // const marketRes = await axios.get(`http://localhost:2917/${selection}`)

      let data = marketRes.data[selection].reverse()
      data.forEach(day => {
        day.date = new Date(day.date)
      })
      this.setState({ [selection]: data, mkrSelection: selection, mkrOptions: mkrOptions[selection] })
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
    // console.log(menuItem)
    if (this.state.currentTab !== activeIndex) {
      this.setState({ currentTab: activeIndex })
      ReactGA.modalview(`/tab/${menuItem}`)
      // console.log(menuItem)
    }
  }

  handleActionsTabChange = (e, activeIndex) => {
    const tabs = ['Significant CDP Actions', 'Largest Daily CDP Actions', 'All CDP Actions', 'Liquidations', 'Open CDPs', 'Shut CDPs']
    if (this.state.cdpActionsTab !== activeIndex) {
      this.setState({ cdpActionsTab: activeIndex })
      ReactGA.modalview(`/table/${tabs[activeIndex]}`)
      // console.log(tabs[activeIndex])
    }
  }

  clearCdp = () => {
    if (!this.state.updating) {
      window.history.pushState({}, null, '/')
      let currentTab = this.state.currentTab === 0 ? 1 : this.state.currentTab - 1
      this.setState({ cdpId: null, wipeDraw: null, cdpDetails: null, currentTab })
    }
  }

  loadContent = () => {
    if (!this.state.error) {
      /***************** Options for the DAI tab chart selection dropdown *****************/
      const daiOptions = [
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
          key: 'DAI/USD (Global Avg.)',
          text: 'DAI/USD (Global Avg.)',
          value: 'daiOHLC',
        },
      ]
      /***************** Options for the PETH tab chart selection dropdown *****************/
      const pethOptions = [
        {
          key: 'PETH Deposits/Withdrawals',
          text: 'PETH Deposits/Withdrawals',
          value: 'dailyLockFree',
        },
        {
          key: 'Cumulative Collateral',
          text: 'Cumulative Collateral',
          value: 'cumulativeCollateral'
        },
      ]
      /***************** Options for the MKR tab chart selection dropdown *****************/
      const mkrOptions = [
        {
          key: 'MKR/USD (Global Avg.)',
          text: 'MKR/USD (Global Avg.)',
          value: 'mkrOHLC',
        },
      ]
      /***************** Options for the System tab chart selection dropdown *****************/
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
          key: 'CDP Activity (Expressed in DAI)',
          text: 'CDP Activity (Expressed in DAI)',
          value: 'dailyActionsDai',
        },
      ]
      /***************** Tab panes for the charts including specific CDP graphs
       ****************** and DAI/PETH/MKR charts *****************/
      const panes = [
        /***************** Tab for specific CDP charts dai debt and peth collateral *****************/
        {
          menuItem: { key: 0, icon: 'target', content: this.state.updating ? 'Loading' : `CDP ${this.state.cdpId}`, name: `CDP ${this.state.cdpId}` },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              height: '575px',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0,
              paddingBottom: 0
            }}>
              <Button compact value='pethCollateral' onClick={this.handleCdpButton}>{`PETH Collateral`}</Button>
              <Button compact value='daiDebt' onClick={this.handleCdpButton}>{`DAI Debt`}</Button>
              {/* <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='pethCollateral' onClick={this.handleCdpButton}>{`PETH Collateral`}</button> */}
              {/* <button style={{ background: 'none', border: 'none', textDecoration: 'underline', color: '#FFF', cursor: 'pointer', outline: 'none' }} value='daiDebt' onClick={this.handleCdpButton}>{`DAI Debt`}</button> */}
              <hr style={{ opacity: '0.7' }} />
              {this.state.cdpCollateralDebt ? this.state.cdpSelection === 'pethCollateral' ? <CdpCollateralChart data={this.state.cdpCollateralDebt} cdpId={this.state.cdpId} /> : <CdpDebtChart data={this.state.cdpCollateralDebt} cdpId={this.state.cdpId} /> : <Loader active inverted inline='centered' />}
              {this.state.cdpCollateralDebt ?
                <Grid>
                  <Grid.Column textAlign="right">
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
        /***************** Tab for System specific charts cdp creation/activity charts *****************/
        {
          menuItem: { key: 1, icon: 'cog', content: 'System', name: 'System' },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              height: window.innerWidth > 768 ? '575px' : this.state.systemSelection === "dailyCdps" ? '625px' : this.state.systemSelection === "dailyActionsDai" ? '655px' : '580px',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0
            }}
            >
              <Grid columns={2} stackable>
                <Grid.Column>
                  <Button compact icon labelPosition='left'>
                    <Icon name='pie graph' />
                    <Dropdown
                      options={systemOptions}
                      value={systemOptions[this.state.systemOptions].value}
                      onChange={this.handleSystemButton}
                    />
                  </Button>
                </Grid.Column>
                <Grid.Column textAlign={window.innerWidth < 768 ? 'left' : 'right'} style={{ paddingTop: window.innerWidth < 768 ? 0 : '14px' }}>
                  {this.state.systemSelection === 'dailyActionsDai' ? <Button compact value='stackedBar' onClick={(e) => this.setState({ stackedActivityChart: !this.state.stackedActivityChart })}>{this.state.stackedActivityChart ? 'Show Grouped Bar Chart' : 'Show Stacked Bar Chart'}</Button> : null}
                </Grid.Column>
              </Grid>

              <hr style={{ opacity: '0.7' }} />
              {
                this.state.dailyCdps && this.state.systemSelection === 'dailyCdps' ? <ChartCdp data={this.state.dailyCdps} /> :
                  this.state.dailyActions && this.state.systemSelection === 'dailyActions' ? <DailyActionsChart data={this.state.dailyActions} /> :
                    this.state.dailyActionsDai && this.state.systemSelection === 'dailyActionsDai' && this.state.stackedActivityChart ? <DailyActionsDaiStackedChart data={this.state.dailyActionsDai} /> :
                      this.state.dailyActionsDai && this.state.systemSelection === 'dailyActionsDai' ? <DailyActionsDaiChart data={this.state.dailyActionsDai} /> :
                        <Loader active inverted inline='centered' />
              }
              {this.state.systemSelection == "dailyCdps" && this.state.dailyCdps ?
                <Grid>
                  <Grid.Column textAlign="right" style={{ paddingRight: "27px", paddingBottom: 0, paddingTop: "12px" }}>
                    <div className={{ position: "relative" }}>
                      <div style={{ width: "10px", height: "10px", backgroundColor: '#1678C2', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                      <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>CDPs Created</span>
                      <span style={{ display: 'inline-block' }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: '#6BA583', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF", }}>System Actions (Lock, Draw, Free, etc.)</span>
                      </span>
                    </div>
                  </Grid.Column>
                </Grid> :
                this.state.systemSelection === 'dailyActionsDai' && this.state.dailyActionsDai ?
                  <Grid>
                    <Grid.Column textAlign="right" style={{ paddingRight: "27px", paddingBottom: 0, paddingTop: "12px" }}>
                      <div className={{ position: "relative" }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: '#1678C2', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>DAI Equiv. Locked</span>
                        <span style={{ display: 'inline-block' }}>
                          <div style={{ width: "10px", height: "10px", backgroundColor: '#FA7D0E', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                          <span style={{ paddingLeft: "20px", color: "#FFF", }}>DAI Equiv. Freed</span>
                        </span>
                        <span style={{ display: 'inline-block' }}>
                          <div style={{ width: "10px", height: "10px", backgroundColor: '#2B922F', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                          <span style={{ paddingLeft: "20px", color: "#FFF", }}>DAI Wiped</span>
                        </span>
                        <span style={{ display: 'inline-block' }}>
                          <div style={{ width: "10px", height: "10px", backgroundColor: '#C22324', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                          <span style={{ paddingLeft: "20px", color: "#FFF", }}>DAI Drawn</span>
                        </span>
                      </div>
                    </Grid.Column>
                  </Grid>
                  : null}
            </Tab.Pane>
        },
        /***************** Tab for specific DAI charts cumulative and daily dai wipe/draw *****************/

        {
          menuItem: { key: 2, content: <span style={{ position: 'relative', top: '-3px' }}><img style={{ position: 'relative', top: '4px', paddingRight: '6px', width: '1.6em', opacity: '0.8' }} src={daiIcon} />DAI</span>, name: 'DAI' },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              height: window.innerWidth > 768 ? '575px' : this.state.daiSelection == "cumulativeDebt" ? '615px' : '575px',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0
            }}>
              <Button compact icon labelPosition='left'>
                <Icon name='pie graph' />
                <Dropdown
                  options={daiOptions}
                  value={daiOptions[this.state.daiOptions].value}
                  onChange={this.handleDaiButton}
                />
              </Button>
              <hr style={{ opacity: '0.7' }} />
              {this.state.dailyWipeDraw && this.state.daiSelection === 'dailyWipeDraw' ? <DailyWipeDrawChart data={this.state.dailyWipeDraw} /> : this.state.cumulativeDebt && this.state.daiSelection === 'cumulativeDebt' ? <CumulativeDebt data={this.state.cumulativeDebt} /> : this.state.daiOHLC && this.state.daiSelection === 'daiOHLC' ? <DaiChart data={this.state.daiOHLC} /> : <Loader active inverted inline='centered' />}
              {(this.state.daiSelection == "dailyWipeDraw" || this.state.daiSelection == "cumulativeDebt") && (this.state.dailyWipeDraw || this.state.cumulativeDebt) ?
                <Grid>
                  <Grid.Column textAlign="right" style={{ paddingRight: "27px", paddingBottom: 0, paddingTop: "12px" }}>
                    <div className={{ position: "relative" }}>
                      <div style={{ width: "10px", height: "10px", backgroundColor: this.state.daiSelection === 'cumulativeDebt' ? "#FF0000" : '#E6BB48', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                      <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>{this.state.daiSelection === 'cumulativeDebt' ? 'Cumulative DAI Created' : 'Circulating DAI'}</span>
                      <span style={{ display: 'inline-block' }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: this.state.daiSelection === 'cumulativeDebt' ? "#189F3A" : '#FF0000', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF", }}>{this.state.daiSelection === 'cumulativeDebt' ? 'Cumulative DAI Repaid' : 'DAI Created'}</span>
                      </span>
                      <span style={{ display: 'inline-block' }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: this.state.daiSelection === 'cumulativeDebt' ? "#366b93" : '#189F3A', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF" }}>{this.state.daiSelection === 'cumulativeDebt' ? 'Cumulative DAI Liquidated' : 'DAI Repaid'}</span>
                      </span>

                    </div>
                  </Grid.Column>
                </Grid> : this.state.daiSelection === 'daiOHLC' ?
                  <Grid>
                    <Grid.Column textAlign="right" style={{ paddingRight: "27px", paddingBottom: 0, paddingTop: "12px" }}>
                      <div className={{ position: "relative" }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: '#1678C2', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>DAI Price</span>
                        <span style={{ display: 'inline-block' }}>
                          <div style={{ width: "10px", height: "10px", backgroundColor: '#E6BB48', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                          <span style={{ paddingLeft: "20px", color: "#FFF", }}>DAI Market Cap.</span>
                        </span>
                        <span style={{ display: 'inline-block' }}>
                          <div style={{ width: "5px", height: "10px", backgroundColor: '#FF0000', display: "inline-block", position: "absolute", marginLeft: "10px", marginTop: "5px" }}></div>
                          <div style={{ width: "5px", height: "10px", backgroundColor: '#6BA583', display: "inline-block", position: "absolute", marginLeft: "4px", marginTop: "5px" }}></div>
                          <span style={{ paddingLeft: "20px", color: "#FFF" }}>Volume</span>
                        </span>
                      </div>
                    </Grid.Column>
                  </Grid>
                  : null}
            </Tab.Pane>
        },
        /***************** Tab for specific PETH charts cumulative and daily peth lock/free *****************/
        {
          menuItem: { key: 3, content: <span style={{ position: 'relative', top: '-3px' }}><img style={{ position: 'relative', top: '4px', paddingRight: '6px', width: '1.6em', opacity: '0.8' }} src={ethIcon} />PETH</span>, name: 'PETH' },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              height: window.innerWidth > 768 ? '575px' : this.state.pethSelection == "cumulativeCollateral" ? '615px' : '595px',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0
            }}>
              <Button compact icon labelPosition='left'>
                <Icon name='pie graph' />
                <Dropdown
                  options={pethOptions}
                  value={pethOptions[this.state.pethOptions].value}
                  onChange={this.handlePethButton}
                />
              </Button>
              <hr style={{ opacity: '0.7' }} />
              {this.state.dailyLockFree && this.state.pethSelection === 'dailyLockFree' ? <DailyLockFreeChart data={this.state.dailyLockFree} /> : this.state.cumulativeCollateral && this.state.pethSelection === 'cumulativeCollateral' ? <CumulativeCollateral data={this.state.cumulativeCollateral} /> : <Loader active inverted inline='centered' />}
              {(this.state.pethSelection == "dailyLockFree" || this.state.pethSelection == "cumulativeCollateral") && (this.state.dailyLockFree || this.state.cumulativeCollateral) ?
                <Grid>
                  <Grid.Column textAlign="right" style={{ paddingRight: "27px", paddingBottom: 0, paddingTop: "12px" }}>
                    <div className={{ position: "relative" }}>
                      {(() => {
                        if (this.state.pethSelection == "dailyLockFree") {
                          return (
                            <span>
                              <div style={{ width: "10px", height: "10px", backgroundColor: "#2a95dd", display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                              <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>Locked ETH</span>
                            </span>
                          )
                        }
                      })()}
                      <div style={{ width: "10px", height: "10px", backgroundColor: this.state.pethSelection === 'cumulativeCollateral' ? "#189F3A" : '#E6BB48', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                      <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>{this.state.pethSelection === 'cumulativeCollateral' ? 'Cumulative PETH Deposited' : 'Locked PETH'}</span>
                      <span style={{ display: 'inline-block' }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: this.state.pethSelection === 'cumulativeCollateral' ? "#FF0000" : '#FF0000', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF", }}>{this.state.pethSelection === 'cumulativeCollateral' ? 'Cumulative PETH Withdrawn' : 'PETH Withdrawn'}</span>
                      </span>
                      <span style={{ display: 'inline-block' }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: this.state.pethSelection === 'cumulativeCollateral' ? "#366b93" : '#189F3A', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF" }}>{this.state.pethSelection === 'cumulativeCollateral' ? 'Cumulative PETH Liquidated' : 'PETH Deposited'}</span>
                      </span>

                    </div>
                  </Grid.Column>
                </Grid> : null}
            </Tab.Pane>
        },
        /***************** Tab for specific MKR charts mkr price chart *****************/
        {
          menuItem: { key: 4, content: <span style={{ position: 'relative', top: '-3px' }}><img style={{ position: 'relative', top: '4px', paddingRight: '6px', width: '1.6em', opacity: '0.8' }} src={mkrIcon} />MKR</span>, name: 'MKR' },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              height: '575px',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0
            }}>

              <Button compact icon labelPosition='left'>
                <Icon name='pie graph' />
                <Dropdown
                  options={mkrOptions}
                  value={mkrOptions[this.state.mkrOptions].value}
                  onChange={this.handleMkrButton}
                />
              </Button>
              <hr style={{ opacity: '0.7' }} />
              {this.state.mkrOHLC && this.state.mkrSelection === 'mkrOHLC' ? <MkrChart data={this.state.mkrOHLC} /> : <Loader active inverted inline='centered' />}

              {this.state.mkrSelection == "mkrOHLC" && this.state.mkrOHLC ?
                <Grid>
                  <Grid.Column textAlign="right" style={{ paddingRight: "27px", paddingBottom: 0, paddingTop: "12px" }}>
                    <div className={{ position: "relative" }}>
                      <div style={{ width: "10px", height: "10px", backgroundColor: '#1678C2', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                      <span style={{ paddingLeft: "20px", color: "#FFF", paddingRight: "5px" }}>MKR Price</span>
                      <span style={{ display: 'inline-block' }}>
                        <div style={{ width: "10px", height: "10px", backgroundColor: '#E6BB48', display: "inline-block", position: "absolute", marginLeft: "5px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF", }}>MKR Market Cap.</span>
                      </span>
                      <span style={{ display: 'inline-block' }}>
                        <div style={{ width: "5px", height: "10px", backgroundColor: '#FF0000', display: "inline-block", position: "absolute", marginLeft: "10px", marginTop: "5px" }}></div>
                        <div style={{ width: "5px", height: "10px", backgroundColor: '#6BA583', display: "inline-block", position: "absolute", marginLeft: "4px", marginTop: "5px" }}></div>
                        <span style={{ paddingLeft: "20px", color: "#FFF" }}>Volume</span>
                      </span>
                    </div>
                  </Grid.Column>
                </Grid> : null}
            </Tab.Pane>
        },
      ]
      /***************** Tab pane for the significant actions, 
       ****************** all cdp actions, liquidations, and all open CDPs tables *****************/
      const cdpActionsPane = [
        /***************** Tab for Significant CDP Actions table *****************/
        {
          menuItem: {
            key: 0,
            icon: 'lightning',
            content: <span>Significant CDP Actions <Popup trigger={<Icon size='small' style={{ paddingLeft: '3px', cursor: 'help' }}
              name='question circle' />}
              header='Significant CDP Actions'
              content={`Significant CDP Actions whose value is greater than the average CDP debt ${this.state.systemStatus ? '(' + this.state.systemStatus.avgDebt.toFixed(0) + ' DAI)' : '...'} or half the average CDP collateral ${this.state.systemStatus ? '(' + (this.state.systemStatus.avgCollateral / 2).toFixed(0) + ' PETH)' : '...'}`}
              inverted /></span>,
          },
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
              <span textAlign='right' style={{ color: '#FFF' }}>* Denotes Shut CDP</span>
            </Tab.Pane>
        },
        /***************** Tab for Largest Daily CDP Actions table *****************/
        {
          menuItem: {
            key: 1,
            icon: 'trophy',
            content: <span>Largest Daily CDP Actions <Popup trigger={<Icon size='small' style={{ paddingLeft: '3px', cursor: 'help' }}
              name='question circle' />}
              header='Largest Daily CDP Actions'
              content={`The top 5 largest transactions and their absolute and relative contribution to the total for each day. Lock and Free actions are converted from PETH to DAI equivalent for comparison purposes`}
              inverted /></span>,
          },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0,
              padding: 0
            }}
            >
              <LargestDailyActions handleSearchClick={this.handleSearchClick} />
            </Tab.Pane>
        },
        /***************** Tab for All CDP Actions table *****************/
        {
          menuItem: {
            key: 2,
            icon: 'history',
            content: <span>All CDP Actions <Popup trigger={<Icon size='small' style={{ paddingLeft: '3px', cursor: 'help' }}
              name='question circle' />}
              header='All CDP Actions'
              content={`All CDP Actions that have occurred on the MakerDAO system`}
              inverted /></span>,
          },
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
              <span textAlign='right' style={{ color: '#FFF' }}>* Denotes Shut CDP</span>
            </Tab.Pane>
        },
        /***************** Tab for Liquidations table *****************/
        {
          menuItem: {
            key: 3,
            icon: 'trash',
            content: <span>Liquidations <Popup trigger={<Icon size='small' style={{ paddingLeft: '3px', cursor: 'help' }}
              name='question circle' />}
              header='Liquidations'
              content={`All CDP Liquidations (Bites) that have occurred on the MakerDAO system`}
              inverted /></span>,
          },
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
              <span textAlign='right' style={{ color: '#FFF' }}>* Denotes Shut CDP</span>
            </Tab.Pane>
        },

        /***************** Tab for Open CDPs table *****************/
        {
          menuItem: {
            key: 5,
            icon: 'globe',
            content: <span>Open CDPs <Popup trigger={<Icon size='small' style={{ paddingLeft: '3px', cursor: 'help' }}
              name='question circle' />}
              header='Open CDPs'
              content={`All currently Open CDPs on the MakerDAO system. CDPs that have been explicitly shut will not be shown`}
              inverted /></span>,
          },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0,
              padding: 0
            }}
            >
              <OpenCdps handleSearchClick={this.handleSearchClick}/>
            </Tab.Pane>
        },
        /***************** Tab for Shut CDPs table *****************/
        {
          menuItem: {
            key: 4,
            icon: 'close',
            content: <span>Shut CDPs <Popup trigger={<Icon size='small' style={{ paddingLeft: '3px', cursor: 'help' }}
              name='question circle' />}
              header='Open CDPs'
              content={`All Shut CDPs on the MakerDAO system. Only CDPs that have been explicitly shut will be shown`}
              inverted /></span>,
          },
          render: () =>
            <Tab.Pane style={{
              backgroundColor: '#273340',
              border: '2px solid #38414B',
              borderTop: 0,
              borderTopRadius: 0,
              padding: 0
            }}
            >
              <ShutCdps handleSearchClick={this.handleSearchClick} systemStatus={this.state.systemStatus} />
              <span textAlign='right' style={{ color: '#FFF' }}>* Denotes Shut CDP</span>
            </Tab.Pane>
        },
      ]
      /***************** Return the actual viewable components to the render method *****************/
      return (
        <Grid.Row style={{ paddingTop: 0, paddingLeft: '2px' }} >
          <SideMenu
            wipeDraw={this.state.wipeDraw} // Data for simulator on sidebar (cdp specific)
            cdpDetails={this.state.cdpDetails} // Data for details on sidebar (cdp specific)
            systemStatus={this.state.systemStatus} // System status on sidebar
            account={this.state.account} // Dai Embassy Node
            cdpId={this.state.cdpId} // A cdpId or null
            updating={this.state.updating} // true if app updating or getting new cdp 
            loading={this.state.loadingMsg} // loading message when updating
          />

          <Grid.Column width={12} tablet={10}>
            <Tab
              menu={{ attached: 'top', inverted: true, style: { backgroundColor: '#273340', border: '2px solid #38414B', display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', flexWrap: 'wrap' } }}
              style={{ paddingBottom: '10px', }}
              // defaultActiveIndex={this.state.currentTab}
              activeIndex={this.state.currentTab}
              onTabChange={(e, { activeIndex }) => this.handleTabChange(e, activeIndex, (this.state.cdpId ? panes[activeIndex].menuItem.name : panes[activeIndex + 1].menuItem.name))}
              panes={this.state.cdpId || this.state.updating ? panes : panes.slice(1)}
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

            {this.state.cdpId || this.state.updating ? <RecentActions cdpId={this.state.cdpId} clearCdp={this.clearCdp} updating={this.state.updating} systemStatus={this.state.systemStatus} /> : null}
            <Tab
              menu={{ attached: 'top', inverted: true, style: { backgroundColor: '#273340', border: '2px solid #38414B', display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', flexWrap: 'wrap' } }}
              style={{ paddingTop: '10px', paddingBottom: '10px' }}
              defaultActiveIndex={this.state.cdpActionsTab}
              onTabChange={(e, { activeIndex }) => this.handleActionsTabChange(e, activeIndex)}
              panes={cdpActionsPane}
            >
            </Tab>
          </Grid.Column>
        </Grid.Row>
      )
    } else {
      return (

        <Grid.Row style={{ paddingTop: '10%', paddingBottom: '10%' }}>
          <Grid.Column>
            <Loader inverted active content={this.state.error ? <button onClick={this.handleError} style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', color: '#FFF', cursor: 'pointer' }}>{this.state.loadingMsg}</button> : this.state.loadingMsg} />
          </Grid.Column>
        </Grid.Row>

      )
    }
  }

  render() {
    return (
      <div className="App" style={{ backgroundColor: '#232D39' }}>
        <Grid stackable>
          <Grid.Row style={{ paddingBottom: 0, paddingLeft: '2px' }}>
            <TopMenu searchMsg={this.state.searchMsg} loadingMsg={this.state.loadingMsg} handleSearchClick={this.handleSearchClick} cdps={this.state.cdps} account={this.state.currentAccount} />
          </Grid.Row>
          {this.loadContent()}
        </Grid>
        <Footer />

      </div>
    );
  }
}

export default App;
