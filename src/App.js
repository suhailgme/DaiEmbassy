import React, { Component } from 'react';
import TopMenu from './components/TopMenu'
import SideMenu from './components/SideMenu'
import RecentActions from './components/RecentActions'
import Chart from './components/Chart'
import { Grid, Loader } from 'semantic-ui-react'
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
  }

  async componentDidMount(){
    let account = '0xc031D5e3822bE0335027ecf88aFdfd3433A97fe1', cdpId = 5
    this.setState({loadingMsg:'Metamask/Mobile Wallet required',})
    const maker = new MakerService()
    if(await maker.isLoggedIn()){
      await maker.init()
      this.setState({loadingMsg:'Getting CDPs...'})
      const cdps = await getCdps()
      this.setState({loadingMsg:'Getting Market data...'})
      const data = await getMarketData()
      this.setState({data})
      // const data = 0 // remove this and restore above const data!!
      // console.log(data)
      const currentAccount = await maker.getCurrentAccount()
      console.log('CURRENT ACCOUNT', currentAccount)
      this.setState({loadingMsg:'Loading account...'})
      cdps.forEach((cdp) =>{
        if(cdp.account === currentAccount){
          cdpId = cdp.cdpId
          account = cdp.account
        }
      })
      // const {cdpId, account} = 
      // cdps.find((cdp) =>{
      //     return cdp.account === currentAccount
      // })

      console.log(account, cdpId)
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
      this.setState({account, maker, cdpId, currentAccount, cdps, wipeDraw, cdpDetails, systemStatus,loadingMsg:''})
    }else{
      this.setState({loadingMsg: 'Please login to Metamask'})
    }

  }
  
  handleSearchClick = async (e, {value}) =>{
    const id = parseInt(value)
    if(this.state.cdpId !== id){
      this.setState({wipeDraw:null, cdpDetails: null, cdpId: '', loadingMsg:''})
      const maker = this.state.maker
      await maker.setCdpId(id)
      const {wipeDraw, cdpDetails, systemStatus, error} = await maker.getAllDetails()
      console.log('Wipe draw after click so: ', wipeDraw, error)
      if(error){
        this.setState({loadingMsg: `Error loading CDP ${id}`})
        console.log(this.state)
        return
      }
      const { account } = this.state.cdps.find((cdp) =>{
        return cdp.cdpId === id
    })
      cdpDetails.account = account
      this.setState({wipeDraw, cdpDetails, systemStatus, cdpId:id})
    }
  }
 


  render() {
    return (
      <div className="App" style={{backgroundColor:'#232D39'}}>
        <Grid stackable>
          <Grid.Row style={{paddingBottom:0, paddingLeft:'2px'}}>
            <TopMenu loadingMsg={this.state.loadingMsg} handleSearchClick={this.handleSearchClick} cdps={this.state.cdps} account={this.state.currentAccount}/>
          </Grid.Row>
          <Grid.Row style={{paddingTop:0,paddingLeft:'2px'}}>
            <SideMenu 
            wipeDraw={this.state.wipeDraw} 
            cdpDetails={this.state.cdpDetails} 
            systemStatus={this.state.systemStatus}
            account={this.state.account} 
            cdpId={this.state.cdpId} 
            />
          <Grid.Column width={12} tablet={10}>
              {this.state.data ? <Chart data={this.state.data} /> : <Loader inverted active/>}
          </Grid.Column>
            {/* <Grid.Column width={3}>
              <RecentActions/>
            </Grid.Column> */}
          </Grid.Row>

        </Grid>
      </div>
    );
  }
}

export default App;
