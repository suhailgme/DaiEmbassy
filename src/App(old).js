import React, { Component } from 'react';
import './App.css';
import Maker from './Maker'
import { Layout, Menu, Icon } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';

const { SubMenu } = Menu
const { Header, Sider, Content } = Layout;

class App extends Component {

  state = {
    cdpId: '',
    cdpAmount: 0,
    cdpRatio: 0,
    collateralAmount: 0,
    liquidationPrice: 0,
  }
  async componentDidMount(){
    const maker = await Maker()
    const cdp = await maker.getCdp(2663)
    let cdpAmount = await cdp.getDebtValue()
    cdpAmount = cdpAmount._amount.toNumber()
    let cdpRatio = await cdp.getCollateralizationRatio()
    cdpRatio = (cdpRatio * 100).toFixed(3)
    let collateralAmount = await cdp.getCollateralValue()
    let cdpId = await cdp.getId()
    collateralAmount = collateralAmount._amount.toNumber().toFixed(3)//toNumber results in rounding up (incorrect)
    this.setState({cdpAmount: cdpAmount, cdpRatio, collateralAmount, cdpId})

  }

  render() {
    return (
      <div className="App">
      <Layout>
        <Header className='header' style={{textAlign:'right'}}>
          <div className='logo'></div>
          <Menu theme='dark' mode='horizontal' defaultSelectedKeys={['1']} style={{lineHeight:'64px'}}>
            <Menu.Item key='1'>Home</Menu.Item>
            <Menu.Item key='2'>Send/Receieve</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          
        <Sider width={'17%'} style={{background: '#fff'}}>
          <Menu theme='dark' mode='inline' inlineIndent='5' defaultOpenKeys={['sub1']} style={{height:'100%', borderRight:0}}>
          <SubMenu key='sub1'  title={'CDP ' + this.state.cdpId}>
            <MenuItem>Dai Borrowed: {this.state.cdpAmount.toFixed(3)}</MenuItem>
            <Menu.Item key='2'>Collateralization Ratio: {this.state.cdpRatio}%</Menu.Item>
            <Menu.Item key='3'>Collateral: {this.state.collateralAmount} ETH</Menu.Item>
          </SubMenu>
         </Menu>
        </Sider>

        <Content style={{height:'100%'}} style={{backgroundColor:'#042844'}}>
          <h3 style={{color:'#fff'}}>CDP Stats</h3>
        </Content>
        </Layout>
      </Layout>
      </div>
    );
  }
}

export default App;
