import React, { Component } from 'react'
import { Statistic, Form, Grid, Container, Popup, Icon, Segment } from 'semantic-ui-react'
import MakerService from '../MakerService'
const Humanize = require('humanize-plus')



export default class CdpDetails extends Component {
    state = {
        ...this.props.cdpDetails,
    }

    static getDerivedStateFromProps(nextProps, prevState){
        //this does not work, fix it!!
        // console.log(nextProps)
        return {...nextProps.cdpDetails}
      }
    async componentDidMount(){
        // console.log('cdpDetails: ', this.props)
        }

    numberWithCommas = (number) => {
        if (number >100000) {
            return Humanize.compactInteger(number, 3)
        }
        return Humanize.formatNumber(number,2)
        // return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }

    truncateAddress = (account) => {
    return `${account.slice(0,6)}...${account.slice(-4)}` 
    }

    calculateLiqudationPenalty = () =>{
        let remainingCollateral = ((this.state.pethCollateral * this.state.liquidationPrice * this.state.pethWethRatio) - (0.13 * this.state.daiDebt)) - this.state.daiDebt
        remainingCollateral = (remainingCollateral / this.state.liquidationPrice) / this.state.pethWethRatio
        const liquidationPenalty = (this.state.pethCollateral - remainingCollateral) * this.state.pethWethRatio
        return !liquidationPenalty ? 0 : this.numberWithCommas(liquidationPenalty)
        
    }



    render(){
        return (
            <Segment inverted>
                <Container textAlign='center'>
                <p>Collateral</p> 
                </Container>
                <Statistic.Group size='mini' widths={2}>
                    <Statistic style={{opacity:0.99}} color='green' inverted size='mini' label='PETH' value={this.numberWithCommas(this.state.pethCollateral)}/>
                    <Statistic style={{opacity:0.99}} color='green' inverted size='mini' label='USD' value={(this.numberWithCommas((this.state.pethCollateral * this.state.pethWethRatio) * this.state.ethPrice))}/>
                </Statistic.Group>
                <Container style={{paddingTop:'5px'}}textAlign='center'>
                    <p>Debt</p>
                </Container>
                <Container textAlign='center'>
                    <Statistic size='mini' color='red' inverted label='DAI' value={this.numberWithCommas(this.state.daiDebt)}/>
                </Container>
                
                <Form inverted>
                    <Grid columns='equal' padded='vertically'>
                        <Grid.Row style={{paddingBottom:'5px'}}>
                            <Grid.Column textAlign='left'>CDP ID</Grid.Column>
                            <Grid.Column textAlign='right'>{this.state.cdpId}</Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                            <Grid.Column textAlign='left'>Owner</Grid.Column>
                            <Grid.Column textAlign='right'> <a target="_blank" href={`https://etherscan.io/address/${this.state.account}`} style={{textDecoration:'underline', color:'inherit'}}>{this.truncateAddress(this.state.account)}</a></Grid.Column>
                        </Grid.Row>
                        {/* <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                            <Grid.Column textAlign='left'>Debt</Grid.Column>
                            <Grid.Column textAlign='right'>{this.numberWithCommas(this.state.daiDebt)} DAI</Grid.Column>
                        </Grid.Row> */}
                        <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                            <Grid.Column textAlign='left'>Accrued Fees</Grid.Column>
                            <Grid.Column textAlign='right' style={{whiteSpace:'nowrap'}}>{this.numberWithCommas(this.state.governanceFee)} USD</Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                            <Grid.Column style={{paddingTop:'0'}} textAlign='left'> Liq. Penalty
                                    <Popup trigger={<Icon style={{paddingLeft:'3px', cursor:'help'}} 
                                        name='question circle' 
                                        size='small'/>}

                                        header='Liquidation Penalty' 
                                        content='Total value subtracted from CDP should liquidation occur at the liquidation price.' 
                                        inverted/>
                            </Grid.Column>
                            <Grid.Column textAlign='right' style={{whiteSpace:'nowrap'}}>{`${this.calculateLiqudationPenalty()} ETH`}</Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                            <Grid.Column style={{paddingTop:'0'}} textAlign='left'>Collateralization</Grid.Column>
                            <Grid.Column textAlign='right' style={{color: this.state.collateralizationRatio == "Infinity" ? '#FFF' : this.state.collateralizationRatio < 170 ? '#FF695E' : this.state.collateralizationRatio < 200 ? '#EFBC72' : '#6ABF69' }}>{this.state.collateralizationRatio } %</Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
            </Segment> 

        )
    }

    
}
