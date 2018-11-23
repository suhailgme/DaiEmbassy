import React, { Component } from 'react'
import { Grid, Statistic, Container } from 'semantic-ui-react'

export default class SystemStatusWidget extends Component{
    
    state = {...this.props.systemStatus}

    componentDidMount(){
        // console.log('systemStatus: ', this.state)
    }

    numberWithCommas = (circulatingDai) => {
        return circulatingDai.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    
    calculateLockedPeth = () =>{
        return ((this.state.circulatingDai*(this.state.systemCollateralization/100) / this.state.ethPrice) / this.state.pethWethRatio)
    }


    render(){
        return (
            <div>
                <Container textAlign='center'>
                    <Statistic size='mini' color='red' inverted label='ETH/USD' value={this.state.ethPrice}/>
                </Container>
                <Grid columns='equal' padded='vertically'>
                    <Grid.Row style={{paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Eth Price</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#FF695E'}}>{this.state.ethPrice} USD</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Mkr Price</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{this.state.mkrPrice} USD</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>PETH/WETH</Grid.Column>
                        <Grid.Column textAlign='right'>{this.state.pethWethRatio}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Circ. DAI</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#FF695E', whiteSpace:'nowrap'}}>{`${this.numberWithCommas(this.state.circulatingDai)}`}</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left'>Locked PETH</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#FF695E', whiteSpace:'nowrap'}}>{`${this.numberWithCommas(this.calculateLockedPeth())}`}</Grid.Column>
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
                        <Grid.Column textAlign='right'>{Date().toString().slice(16,-37)}</Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

