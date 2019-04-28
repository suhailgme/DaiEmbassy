import React, { Component } from 'react'
import { Grid, Statistic, Container } from 'semantic-ui-react'

export default class SystemStatusWidget extends Component{
    
    state = {stats: this.props.stats}

    componentDidMount(){

        // console.log("StatsWidget: ", this.state)
        // this.setState({...this.props.systemStatus})
        // console.log('systemStatus: ', this.state)
    }

    numberWithCommas = (number) => {
        return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    
    calculateAvgDebt = () =>{
        const cdps = this.state.stats
        console.log('cdps: ', cdps)
        const sum = cdps.reduce((acc,cdp) =>{
            return acc + parseFloat(cdp.daiDebt)
            // console.log(acc + cdp.daiDebt)
        },0)
        const avgDebt = sum/cdps.length
        console.log(avgDebt)
        return this.numberWithCommas(avgDebt)
    }
    


    render(){
        const avgDebt = this.calculateAvgDebt()
        return (
            <div>
                {/* <Container textAlign='center'>
                    <Statistic size='mini' color='red' inverted label='Ethereum Supply Locked' value='1.58 %'/>
                </Container> */}
                <Grid columns='equal' padded='vertically'>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left' style={{whiteSpace:'nowrap' }}>ETH Supply Locked</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>1.58 %</Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{paddingTop:'0',paddingBottom:'5px'}}>
                        <Grid.Column textAlign='left' style={{whiteSpace:'nowrap' }}>Avg. Debt</Grid.Column>
                        <Grid.Column textAlign='right' style={{color:'#6abf69'}}>{avgDebt} DAI</Grid.Column>
                    </Grid.Row>
                </Grid>
                <hr style={{marginTop:'5px'}}/>

            </div>
        )
    }
}

