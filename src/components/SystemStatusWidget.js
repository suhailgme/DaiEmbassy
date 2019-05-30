import React, { Component } from 'react'
import { Grid, Statistic, Container, Form, Popup, Segment, List } from 'semantic-ui-react'

export default class SystemStatusWidget extends Component{
    
    state = {
        systemStatus:this.props.systemStatus,
        avgDebtString: "Avg. CDP Debt",
        medDebtString: "Median CDP Debt",
        avgCollateralString: "Avg. CDP Collateral",
        medCollateralString: "Median CDP Collateral",
        displayDaiAvg: 1,
        displayCollaterAvg: 1
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.systemStatus !== this.state.systemStatus) {
    //       this.setStateStrings();
    //     }
    //   }
      
    componentDidMount(){
        this.setState({
            displayDai: this.state.avgDebtString,
            displayPeth: this.state.avgCollateralString,
        })
        // this.setState({...this.props.systemStatus})
        // console.log('systemStatus: ', this.state)
        // console.log(this.state)
    }

    static getDerivedStateFromProps(nextProps, prevState){
        // console.log('system status: ', nextProps.systemStatus)
        // console.log('systemStatus: ', prevState)

        return {
            systemStatus: nextProps.systemStatus,
            }
        }

    numberWithCommas = (number) => {
        if (number)
            return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        return null
      }

    onMouseOverDai(e) {
        this.setState({
            displayDaiAvg: !this.state.displayDaiAvg,
            displayDai: this.state.medDebtString
        })
    }

    onMouseoutDai(e) {
        this.setState({
            displayDaiAvg: !this.state.displayDaiAvg,
            displayDai: this.state.avgDebtString
        })
    }

    onMouseOverPeth(e) {
        this.setState({
            displayCollaterAvg: !this.state.displayCollaterAvg,
            displayPeth: this.state.medCollateralString

        })
    }

    onMouseoutPeth(e) {
        this.setState({
            displayCollaterAvg: !this.state.displayCollaterAvg,
            displayPeth: this.state.avgCollateralString

        })
    }
    // MOVED TO BACKEND
    // calculateLockedPeth = () =>{
    //     return ((this.state.circulatingDai*(this.state.systemCollateralization/100) / this.state.ethPrice) / this.state.pethWethRatio)
    // }

    // calculateAvgDebt = () =>{
    //     const cdps = this.state.cdps
    //     let numCdps = 0
    //     const sum = cdps.reduce((acc,cdp) =>{
    //         if (cdp.daiDebt > 0){
    //             numCdps++
    //             return acc + parseFloat(cdp.daiDebt)
    //         }else{
    //             return acc
    //         }
    //     },0)
    //     const avgDebt = sum/numCdps
    //     // console.log("avgDebt: ", avgDebt)
    //     return this.numberWithCommas(avgDebt)
    // }

    // calculateAvgCollateral = () =>{
    //     const cdps = this.state.cdps
    //     let numCdps = 0
    //     const sum = cdps.reduce((acc,cdp) =>{
    //         if(cdp.pethCollateral > 0){
    //             numCdps++
    //             return acc + parseFloat(cdp.pethCollateral)
    //         }else{
    //             return acc
    //         }
    //     },0)
    //     const avgCollateral = sum/numCdps
    //     // console.log("avgCollateral: ", avgCollateral)
    //     return this.numberWithCommas(avgCollateral)
    // }

    // calculateEthSupplyLocked = () =>{
    //     const petWeth = this.state.pethWethRatio
    //     const ethSupply = this.state.ethSupply
    //     const lockedPeth = this.calculateLockedPeth()
    //     const lockedEthSupply = parseFloat((((lockedPeth * (petWeth)) / ethSupply) * 100)).toFixed(3)
    //     // console.log('lockedEthSupply: ', lockedEthSupply)
    //     return lockedEthSupply
    // }

    render(){
        const systemStatus = this.state.systemStatus
        return (
            <Segment inverted>
                <Form>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column textAlign='left'>
                            <List divided inverted relaxed>
                                <List.Item><List.Content>
                                    <List.Header>ETH Price</List.Header>
                                    ${systemStatus.ethPrice} USD
                                </List.Content></List.Item>
                                <List.Item><List.Content>
                                    <List.Header>ETH Supply Locked</List.Header>
                                    {systemStatus.lockedEthSupply} %
                                </List.Content></List.Item>
                                <List.Item><List.Content>
                                    <List.Header>PETH/ETH</List.Header>
                                    {systemStatus.pethWethRatio}
                                </List.Content></List.Item>
                                <List.Item><List.Content style={{cursor:'help'}} onMouseEnter={this.onMouseOverDai.bind(this)} onMouseLeave={this.onMouseoutDai.bind(this)} id='dai'>
                                    <List.Header style={{textDecoration:'underline'}}>{this.state.displayDai}</List.Header>
                                    {this.state.displayDaiAvg ? `${this.numberWithCommas(systemStatus.avgDebt)} DAI` : `${this.numberWithCommas(systemStatus.medianDebt)} DAI`}
                                </List.Content></List.Item>
                                <List.Item><List.Content>
                                    <List.Header>Collateralization</List.Header>
                                    {systemStatus.systemCollateralization} %
                                </List.Content></List.Item>
                                <List.Item><List.Content>
                                    <List.Header>Total CDPs</List.Header>
                                    {systemStatus.totalCdps}
                                </List.Content></List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column textAlign='right'>
                            <List divided inverted relaxed>
                                <List.Item><List.Content>
                                    <List.Header>MKR Price</List.Header>
                                    ${systemStatus.mkrPrice} USD
                                </List.Content></List.Item>
                                <List.Item><List.Content>
                                    <Popup inverted trigger={<a href="#" style={{textDecoration:'underline', fontSize:'11px', color:'inherit', fontWeight:'bold', cursor:'help'}}> Locked ETH</a>} on='hover'>
                                    <Popup.Header>Locked PETH{this.state.cdpId}</Popup.Header>
                                    <Popup.Content>
                                        {`${this.numberWithCommas(systemStatus.lockedPeth)}`}
                                    </Popup.Content>  
                                    </Popup>
                                    <br/>{`${this.numberWithCommas(systemStatus.lockedEth)}`}
                                </List.Content></List.Item>
                                <List.Item><List.Content>
                                    <List.Header>Circulating DAI</List.Header>
                                    {`${this.numberWithCommas(systemStatus.circulatingDai)}`}
                                </List.Content></List.Item>
                                <List.Item><List.Content style={{cursor:'help'}} onMouseEnter={this.onMouseOverPeth.bind(this)} onMouseLeave={this.onMouseoutPeth.bind(this)} id='peth'>
                                    <List.Header style={{textDecoration:'underline'}}>{this.state.displayPeth}</List.Header>
                                    {this.state.displayCollaterAvg ? `${this.numberWithCommas(systemStatus.avgCollateral)} PETH` : `${parseFloat(systemStatus.medianCollateral).toFixed(2)} PETH`}
                                </List.Content></List.Item>
                                <List.Item><List.Content>
                                    <List.Header>Stability Fee</List.Header>
                                    {systemStatus.stabilityFee} %
                                </List.Content></List.Item>
                                <List.Item><List.Content>
                                    <List.Header>Updated</List.Header>
                                    {Date().toString().slice(4,-47) + Date().toString().slice(16,-37)}
                                </List.Content></List.Item>
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                </Form>
            </Segment>
        )
    }
}

