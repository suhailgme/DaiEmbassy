import React, { Component } from 'react';
import TopMenu from './components/TopMenu'
import SideMenu from './components/SideMenu'
import RecentActions from './components/RecentActions'
import Chart from './components/Chart'
import Footer from './components/Footer'
import { Grid, Loader, Segment } from 'semantic-ui-react'
import './App.css';
import MakerService from './MakerService'
import { getCdps } from './api/daiService'
import { getMarketData} from './api/marketData'
import ReactGA from 'react-ga'



class App extends Component {

  state = {
    cdpId: '',
    pethCollateral: '',
    usdCollateral: '',
    daiDebt: '',
    fees: '',
    account:'',
    loadingMsg:'',
    searchMsg: '',
  }

  async componentDidMount(){
    ReactGA.initialize('UA-128182811-1')
    ReactGA.pageview(window.location.pathname + window.location.search)
    let account = '0xc031D5e3822bE0335027ecf88aFdfd3433A97fe1', cdpId = 5
    const maker = new MakerService() //TODO catch error here on new Maker (maybe metamask issue...)
    if(!maker.hasWeb3){
      ReactGA.event({
        category: 'Error',
        action: 'No Metamask or Mobile Wallet',
        label: new Date().toString()
      })
      this.setState({loadingMsg:'Metamask/Mobile Wallet required',})
      return
    }
    if(await maker.isLoggedIn()){
      this.setState({loadingMsg:'Initializing...',})
      await maker.init()
      const currentAccount = await maker.getCurrentAccount()
      ReactGA.event({
        category: currentAccount,
        action: 'logged in',
        label: new Date().toString()

      })
      this.setState({currentAccount,loadingMsg:'Getting CDPs...'})
      const cdps = await getCdps()
      // console.log(cdps)
      this.setState({loadingMsg:'Getting Market data...'})
      const data = await getMarketData()
      this.setState({data})
      // console.log(data)
      this.setState({loadingMsg:'Loading account...'})
      cdps.forEach((cdp) =>{
        if(cdp.account === currentAccount){
          cdpId = cdp.cdpId
          account = cdp.account
          ReactGA.event({
            category: currentAccount,
            action: `owns ${cdpId}`,
            label: new Date().toString()

          })
        }
      })

      // console.log(account, cdpId)
      await maker.setCdpId(cdpId)

      const {wipeDraw, cdpDetails, systemStatus, error} = await maker.getAllDetails()
      if(error){
        ReactGA.event({
          category: 'Error',
          action: `Error on initial load`,
          label: new Date().toString()
        })
        this.setState({loadingMsg: `Error loading CDP - Try refreshing`})
        return
      }
      cdpDetails.account = account
      systemStatus.totalCDPs = cdps.length

      this.setState({currentAccount, account, maker, cdpId, cdps, wipeDraw, cdpDetails, systemStatus,loadingMsg:'', })
    }else{
      ReactGA.event({
        category: 'Error',
        action: `Web3 available but not logged in`,
        label: new Date().toString()
      })
      this.setState({loadingMsg: 'Please login to Metamask'})
    }

  }
  
  handleSearchClick = async (e, {value}) =>{
    const id = parseInt(value)
    if(this.state.cdpId !== id){

      ReactGA.event({
        category: this.state.currentAccount,
        action: `Searched for CDP ${id}`,
        label: new Date().toString()
      })

      this.setState({wipeDraw:null, cdpDetails: null, cdpId: '', searchMsg: '', loadingMsg:`Loading CDP: ${id}`,})
      const maker = this.state.maker
      await maker.setCdpId(id)
      const {wipeDraw, cdpDetails, systemStatus, error} = await maker.getAllDetails()
      // console.log('Wipe draw after click: ', wipeDraw,cdpDetails,systemStatus, error)
      if(error){
        ReactGA.event({
          category: this.state.currentAccount,
          action: `encountered error searching for CDP ${id}`,
          label: new Date().toString()
        })
        this.setState({loadingMsg: `Error loading CDP ${id} - Please wait a few seconds before retrying.`, searchMsg: `Error loading CDP ${id}`})
        return
      }
      const { account } = this.state.cdps.find((cdp) =>{
        return cdp.cdpId === id
    })
      cdpDetails.account = account

      this.setState({wipeDraw, cdpDetails, systemStatus, cdpId:id, loadingMsg:''})
    }
  }
 
  isLoaded = () =>{
    if(this.state.wipeDraw && this.state.cdpDetails && this.state.systemStatus){
      return(
        <Grid.Row style={{paddingTop:0,paddingLeft:'2px'}} >
        <SideMenu 
        wipeDraw={this.state.wipeDraw} 
        cdpDetails={this.state.cdpDetails} 
        systemStatus={this.state.systemStatus}
        account={this.state.account} 
        cdpId={this.state.cdpId} 
        />
        
      <Grid.Column width={12} tablet={10}>
          <Segment inverted style={{
            backgroundColor:'#273340', 
            borderRadius:'5px', 
            border: '2px solid #38414B'
            }}>
            <Chart data={this.state.data} /></Segment>  
          <RecentActions cdps={this.state.cdps} cdpId={this.state.cdpId}/>  
      </Grid.Column>
      </Grid.Row>
      )
    }else{
      return(
        //return only loader element to restore previous function (remove grids, etc.) ONLY IF NEEDED
        <Grid.Row style={{paddingTop:'10%', paddingBottom:'10%'}}>
          <Grid.Column>
            <Loader inverted active content={this.state.loadingMsg}/>
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
          {this.isLoaded()}
        </Grid>
        {/* <Footer/> */}
      </div>
    );
  }
}

export default App;
