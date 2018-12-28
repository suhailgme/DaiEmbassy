import React, { Component } from 'react'
import { Grid, Statistic, Container, Form } from 'semantic-ui-react'

export default class SystemStatusWidget extends Component{
    
    state = {...this.props.systemStatus}

    componentDidMount(){
        // this.setState({...this.props.systemStatus})
        // console.log('systemStatus: ', this.state)
        // console.log(this.state)
    }

    static getDerivedStateFromProps(nextProps, prevState){
        // console.log('system status: ', nextProps.systemStatus)
        return {...nextProps.systemStatus}
      }

    numberWithCommas = (number) => {
        return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    
    calculateLockedPeth = () =>{
        return ((this.state.circulatingDai*(this.state.systemCollateralization/100) / this.state.ethPrice) / this.state.pethWethRatio)
    }

 


    calculateAvgDebt = () =>{
        const cdps = this.state.cdps
        const sum = cdps.reduce((acc,cdp) =>{
            return acc + parseFloat(cdp.daiDebt)
        },0)
        const avgDebt = sum/cdps.length
        // console.log("avgDebt: ", avgDebt)
        return this.numberWithCommas(avgDebt)
    }

    calculateAvgCollateral = () =>{
        const cdps = this.state.cdps
        const sum = cdps.reduce((acc,cdp) =>{
            return acc + parseFloat(cdp.pethCollateral)
        },0)
        const avgCollateral = sum/cdps.length
        // console.log("avgCollateral: ", avgCollateral)
        return this.numberWithCommas(avgCollateral)
    }

    calculateEthSupplyLocked = () =>{
        const petWeth = this.state.pethWethRatio
        const ethSupply = this.state.ethSupply
        const lockedPeth = this.calculateLockedPeth()
        const lockedEthSupply = parseFloat((((lockedPeth * (petWeth)) / ethSupply) * 100)).toFixed(3)
        // console.log('lockedEthSupply: ', lockedEthSupply)
        return lockedEthSupply

        
    }

    render(){
        const avgDebt = this.calculateAvgDebt()
        const avgCollateral = this.calculateAvgCollateral()
        const ethSupplyLocked = this.calculateEthSupplyLocked()
        return (
            <div>
                <Container textAlign='center'>
                    <Statistic size='mini' color='red' inverted label='ETH/USD' value={this.state.ethPrice}/>
                </Container>
                <Form>
                <Grid columns='equal' padded='vertically'>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>MKR Price</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{this.state.mkrPrice} USD</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left' style={{whiteSpace:'nowrap' }}>ETH Supply Locked</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{ethSupplyLocked} %</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Locked PETH</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#FF695E', whiteSpace:'nowrap'}}>{`${this.numberWithCommas(this.calculateLockedPeth())}`}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>PETH/ETH</Grid.Column>
                        <Grid.Column textAlign='right'>{this.state.pethWethRatio}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Circ. DAI</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#FF695E', whiteSpace:'nowrap'}}>{`${this.numberWithCommas(this.state.circulatingDai)}`}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left' style={{whiteSpace:'nowrap'}}>Avg. CDP Debt</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{avgDebt} DAI</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left' style={{whiteSpace:'nowrap' }}>Avg. CDP Collateral</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{avgCollateral} PETH</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Collateralization</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{this.state.systemCollateralization}%</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Total CDPs</Grid.Column>
                        <Grid.Column textAlign='right'>{this.state.totalCDPs}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Updated</Grid.Column>
                        <Grid.Column textAlign='right'>{Date().toString().slice(4,-47) + Date().slice(16,-37)}</Grid.Column>
                    </Grid.Row>
                </Grid>
                </Form>
            </div>
        )
    }
}

