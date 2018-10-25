import React, { Component } from 'react';
import TopMenu from './components/TopMenu'
import SideMenu from './components/SideMenu'
import RecentActions from './components/RecentActions'
import Chart from './components/Chart'
import { Grid, Loader, Segment } from 'semantic-ui-react'
import './App.css';
import MakerService from './MakerService'
import { getCdpByAccount,getCdps } from './api/daiService'
import { getMarketData} from './api/marketData'


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
    let account = '0xc031D5e3822bE0335027ecf88aFdfd3433A97fe1', cdpId = 5
    const maker = new MakerService()
    if(!maker.hasWeb3){
      this.setState({loadingMsg:'Metamask/Mobile Wallet required',})
      return
    }
    if(await maker.isLoggedIn()){
      this.setState({loadingMsg:'Initializing...',})
      await maker.init()
      const currentAccount = await maker.getCurrentAccount()
      this.setState({currentAccount})
      this.setState({loadingMsg:'Getting CDPs...'})
      const cdps = await getCdps()
      // console.log(cdps)
      this.setState({loadingMsg:'Getting Market data...'})
      const data = await getMarketData()
      this.setState({data})
      // const data = 0 // remove this and restore above const data!!
      // console.log(data)
      this.setState({loadingMsg:'Loading account...'})
      cdps.forEach((cdp) =>{
        if(cdp.account === currentAccount){
          cdpId = cdp.cdpId
          account = cdp.account
        }
      })

      // console.log(account, cdpId)
      let circulatingDai = 0
      cdps.forEach(cdp => {
        circulatingDai+= +cdp.daiDebt
      })
      circulatingDai = parseFloat(circulatingDai.toFixed(2))

      await maker.setCdpId(cdpId)

      const {wipeDraw, cdpDetails, systemStatus, error} = await maker.getAllDetails()
      if(error){
        this.setState({loadingMsg: `Error loading CDP - Try refreshing`})
        return
      }
      cdpDetails.account = account
      systemStatus.circulatingDai = circulatingDai

      this.setState({account, maker, cdpId, cdps, wipeDraw, cdpDetails,circulatingDai, systemStatus,loadingMsg:'', })
    }else{
      this.setState({loadingMsg: 'Please login to Metamask'})
    }

  }
  
  handleSearchClick = async (e, {value}) =>{
    const id = parseInt(value)
    if(this.state.cdpId !== id){
      this.setState({wipeDraw:null, cdpDetails: null, cdpId: '', searchMsg: '', loadingMsg:`Loading CDP: ${id}`,})
      const maker = this.state.maker
      await maker.setCdpId(id)
      const {wipeDraw, cdpDetails, systemStatus, error} = await maker.getAllDetails()
      console.log('Wipe draw after click: ', wipeDraw,cdpDetails,systemStatus, error)
      if(error){
        this.setState({loadingMsg: `Error loading CDP ${id}`, searchMsg: `Error loading CDP ${id}`})
        return
      }
      const { account } = this.state.cdps.find((cdp) =>{
        return cdp.cdpId === id
    })
      cdpDetails.account = account
      systemStatus.circulatingDai = this.state.circulatingDai

      this.setState({wipeDraw, cdpDetails, systemStatus, cdpId:id, loadingMsg:''})
    }
  }
 


  render() {
    return (
      <div className="App" style={{backgroundColor:'#232D39'}}>
        <Grid stackable>
          <Grid.Row style={{paddingBottom:0, paddingLeft:'2px'}}>
            <TopMenu searchMsg={this.state.searchMsg} loadingMsg={this.state.loadingMsg} handleSearchClick={this.handleSearchClick} cdps={this.state.cdps} account={this.state.currentAccount}/>
          </Grid.Row>
        {this.state.wipeDraw && this.state.cdpDetails && this.state.systemStatus ? 
          <Grid.Row style={{paddingTop:0,paddingLeft:'2px'}} >
            <SideMenu 
            wipeDraw={this.state.wipeDraw} 
            cdpDetails={this.state.cdpDetails} 
            systemStatus={this.state.systemStatus}
            account={this.state.account} 
            cdpId={this.state.cdpId} 
            />
            
          <Grid.Column width={12} tablet={10} >
              <Segment inverted style={{
                backgroundColor:'#273340', 
                borderRadius:'5px', 
                border: '2px solid #38414B'}}>
                <Chart data={this.state.data} /></Segment>  
              <RecentActions cdps={this.state.cdps} cdpId={this.state.cdpId}/>  
               
          </Grid.Column>
          </Grid.Row>
        : <Loader inverted active content={this.state.loadingMsg} /> }

        </Grid>

      </div>
    );
  }
}

export default App;
