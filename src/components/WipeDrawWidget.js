import React, { Component } from 'react'
import { Input, Form, Button, Progress, Grid, Icon, Popup, Dropdown, Loader } from 'semantic-ui-react'
import MakerService from '../MakerService'
//Consider limit orders for lock/free and wipe/draw to be executed when oracle prices reaches n
export default class WipeDrawWidget extends Component {
    state = {
        positiveButton: true,
        negativeButton: false,
        inputValue: 0,
        selected: 'DAI',
        ...this.props.wipeDraw
    }
    


  static getDerivedStateFromProps(nextProps, prevState){
    // console.log('WipeDraw derived state: ' , prevState, 'props ', nextProps)
    if(nextProps.wipeDraw.cdpId !== prevState.cdpId)
        return {...nextProps.wipeDraw, inputValue: 0, tempLiquidationPrice: null}
    return null
  }
    
    getLiquidationRatio = () => {
        return (((1-(this.state.liquidationPrice / this.state.ethPrice))*100).toFixed(2))
    }

    updateLiquidationPrice = (value) => {
        // Store actual liqudation price in temp variable
        let tempLiquidationPrice = this.state.tempLiquidationPrice ? this.state.tempLiquidationPrice :  this.state.liquidationPrice
        let newLiquidationPrice
        // by default this method calculates liquidation price based on wipe/draw of dai
        let peth = 0
         if(value && value != 0){
             // If peth is selected, calculate liqudation price on lock/free of peth 
             if(this.state.selected === 'PETH'){
                peth = value 
                value = 0
             }
            newLiquidationPrice = (((this.state.daiDebt - value) * this.state.liquidationRatio) / (this.state.ethCollateral + peth * this.state.pethWethRatio))
            newLiquidationPrice = parseFloat(newLiquidationPrice.toFixed(2))
            newLiquidationPrice = newLiquidationPrice < 0 ? 0 : newLiquidationPrice
            // restore value if it was changed to calculate liquidation using peth
            value = peth ? peth : value
            // console.log('value is: ', value)

            this.setState({tempLiquidationPrice, liquidationPrice: newLiquidationPrice})
        } else{
            this.setState({liquidationPrice: tempLiquidationPrice})
        }
    }


    handleClick = (e) => {
        e.preventDefault()
        const target = e.currentTarget.id
        if(target == 'positiveButton'){
            this.updateLiquidationPrice(Math.abs(this.state.inputValue))
            this.setState({positiveButton:true, negativeButton:false})
        }else {
            this.updateLiquidationPrice(-Math.abs(this.state.inputValue))
            this.setState({positiveButton:false, negativeButton:true})
        }
        // console.log(e.currentTarget.id, this.state)
    }

    handleInput = (e) => {
        e.preventDefault()
        let value = e.currentTarget.value
        value = this.state.positiveButton ? Math.abs(value) : -Math.abs(value)
        this.updateLiquidationPrice(value)
        this.setState({inputValue: value})

    }

    handleDropdownChange = (e) => {
        e.preventDefault()
        const selected = e.currentTarget.id
        const inputValue = 0
        this.updateLiquidationPrice(inputValue)
        this.setState({selected, inputValue})
    
    }

    render(){
        return (
            <div>
                <Form inverted style={{paddingBottom:'0'}}>
                    <Form.Field>
        <label style={{paddingBottom:'5px'}}><Popup inverted trigger={<a href="#" style={{textDecoration:'underline', color:'inherit'}}>Manage</a>} content='Shut or Give CDP' on='hover'/></label>
                        <Input fluid label={<Dropdown onChange={this.handleDropdownChange} defaultValue='DAI' options={[
                            {key:'DAI', text:'DAI', value:'DAI', id:'DAI'},
                            {key:'PETH', text:'PETH', value:'PETH', id:'PETH'}
                            ]}/>} placeholder={`Quantity ${this.state.selected}`} onChange={this.handleInput} type='number' value={this.state.inputValue ?  Math.abs(this.state.inputValue) : ''}/>
                    </Form.Field>
                    <Form.Field>
                        <Button.Group fluid>
                            <Button positive id='positiveButton'onClick={this.handleClick} style={this.state.positiveButton ? {opacity:0.9} : {opacity:0.3}}>{this.state.selected === 'DAI' ? 'Wipe' : 'Lock'}</Button>
                            <Button.Or />
                            <Button negative id='negativeButton' onClick={this.handleClick} style={this.state.negativeButton ? {opacity:0.9} : {opacity:0.3}}>{this.state.selected === 'DAI' ? 'Draw' : 'Free'}</Button>
                        </Button.Group>
                    </Form.Field>
                    <Form.Field>
                        <Progress inverted indicating percent={this.getLiquidationRatio()}>
                            <label>Liqudation Ratio {this.getLiquidationRatio()} % 
                                <Popup trigger={<Icon style={{paddingLeft:'3px'}} name='question circle' />} content='Percent Eth must fall for your CDP to be
                                liquidated' inverted/></label>
                        </Progress>
                    </Form.Field>
                    <Grid columns='equal' padded='vertically'>
                        <Grid.Row style={{paddingBottom:'5px'}}>
                            <Grid.Column textAlign='left'>Eth Price</Grid.Column>
                            <Grid.Column textAlign='right'>{this.state.ethPrice} USD</Grid.Column>
                        </Grid.Row>
                        <Grid.Row style={{paddingTop:'0'}}>
                            <Grid.Column textAlign='left' style={{paddingRight:0}}>Liq. Price</Grid.Column>
                            <Grid.Column textAlign='right' style={{whiteSpace:'nowrap', paddingLeft:0}}>{this.state.liquidationPrice} USD</Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Button primary fluid>Submit</Button>
                    <hr style={{marginTop:'5px'}}/>
                </Form>
            </div>
        )
    }
}
