import React, { Component } from 'react'
import { Statistic, Form, Grid, Container, Loader } from 'semantic-ui-react'
import MakerService from '../MakerService'
const Humanize = require('humanize-plus')



export default class CdpDetails extends Component {
    state = {
        ...this.props.cdpDetails
    }

    static getDerivedStateFromProps(nextProps, prevState){
        //this does not work, fix it!!
        return {...nextProps.cdpDetails}
      }
    async componentDidMount(){
        console.log('cdpDetails: ', this.props)
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



    render(){
        return (
            <div>
                <Container textAlign='center'>
                <p>Collateral</p> 
                </Container>
                <Statistic.Group size='mini' widths='two'>
                    <Statistic  inverted size='mini' label='PETH' value={this.state.ethCollateral}/>
                    <Statistic inverted size='mini' label='USD' value={(this.numberWithCommas(this.state.ethCollateral * this.state.ethPrice))} color='red'/>
                </Statistic.Group>
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
                        <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                            <Grid.Column textAlign='left'>Debt</Grid.Column>
                            <Grid.Column textAlign='right'>{this.numberWithCommas(this.state.daiDebt)} Dai</Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                            <Grid.Column textAlign='left'>Accrued Fees</Grid.Column>
                            <Grid.Column textAlign='right'>{this.numberWithCommas(this.state.governanceFee)} USD</Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                            <Grid.Column style={{paddingTop:'0'}} textAlign='left'>Collateralization</Grid.Column>
                            <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{this.state.collateralizationRatio } %</Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <hr/>
                </Form>
            </div> 

        )
    }

    
}
