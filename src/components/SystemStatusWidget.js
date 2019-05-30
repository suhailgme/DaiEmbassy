import React, { Component } from 'react'
import { Grid, Statistic, Container, Form, Popup } from 'semantic-ui-react'

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
            <div>
                <Container textAlign='center' style={{paddingBottom:'10px'}}>
                    <Statistic.Group size='mini' widths={2}>
                    <Statistic color='red' inverted  label='ETH/USD' value={systemStatus.ethPrice}/>
                    <Statistic inverted>
                        <Statistic.Value style={{color:'#E6BB48'}}>{systemStatus.daiPrice.dai_usd_price}</Statistic.Value>
                        <Popup inverted content='DAI price provided by daiprice.info' trigger={<Statistic.Label>DAI/USD</Statistic.Label>}/>
                    </Statistic>
                </Statistic.Group>
                </Container>
                <Form>
                <Grid columns='equal' padded='vertically'>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>MKR Price</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{systemStatus.mkrPrice} USD</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left' style={{whiteSpace:'nowrap' }}>ETH Supply Locked</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{systemStatus.lockedEthSupply} %</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>
                        <Popup inverted trigger={<a href="#" style={{textDecoration:'underline', color:'inherit', cursor:'help'}}> Locked ETH</a>} on='hover'>
                            <Popup.Header>Locked PETH{this.state.cdpId}</Popup.Header>
                            <Popup.Content>
                            {`${this.numberWithCommas(systemStatus.lockedPeth)}`}
                            </Popup.Content>  
                            </Popup> 
                        </Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#FF695E', whiteSpace:'nowrap'}}> {`${this.numberWithCommas(systemStatus.lockedEth)}`}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>PETH/ETH</Grid.Column>
                        <Grid.Column textAlign='right'>{systemStatus.pethWethRatio}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Circ. DAI</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#FF695E', whiteSpace:'nowrap'}}>{`${this.numberWithCommas(systemStatus.circulatingDai)}`}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px', cursor:'help'}} onMouseEnter={this.onMouseOverDai.bind(this)} onMouseLeave={this.onMouseoutDai.bind(this)} id='dai'>
                        <Grid.Column textAlign='left' style={{whiteSpace:'nowrap', textDecoration:'underline', color:'inherit', }}>{this.state.displayDai}</Grid.Column>
                        <Grid.Column textAlign='right' style={{ color: this.state.displayDaiAvg ?'#6abf69' : '#FF695E'}} >{this.state.displayDaiAvg ? `${this.numberWithCommas(systemStatus.avgDebt)} DAI` : `${this.numberWithCommas(systemStatus.medianDebt)} DAI`}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px', cursor:'help'}} onMouseEnter={this.onMouseOverPeth.bind(this)} onMouseLeave={this.onMouseoutPeth.bind(this)} id='peth'>
                        <Grid.Column textAlign='left' style={{whiteSpace:'nowrap', textDecoration:'underline'}}>{this.state.displayPeth}</Grid.Column>
                        <Grid.Column textAlign='right' style={{color: this.state.displayCollaterAvg ?'#6abf69' : '#FF695E'}}>{this.state.displayCollaterAvg ? `${this.numberWithCommas(systemStatus.avgCollateral)} PETH` : `${parseFloat(systemStatus.medianCollateral).toFixed(2)} PETH`}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Collateralization</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{systemStatus.systemCollateralization} %</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Stability Fee</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#FF695E'}}>{systemStatus.stabilityFee} %</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Total CDPs</Grid.Column>
                        <Grid.Column textAlign='right'>{systemStatus.totalCdps}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Updated</Grid.Column>
                        <Grid.Column textAlign='right'>{Date().toString().slice(4,-47) + Date().toString().slice(16,-37)}</Grid.Column>
                    </Grid.Row>
                </Grid>
                </Form>
            </div>
        )
    }
}

