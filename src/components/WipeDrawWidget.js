import React, { Component } from 'react'
import { Input, Form, Button, Progress, Grid, Icon, Popup, Dropdown, Modal, Table, Segment } from 'semantic-ui-react'
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
    
    componentDidMount(){
        // console.log('wipeDraw', this.props)
        isNaN(this.props.wipeDraw.liquidationPrice) ? this.setState({liquidationPrice:0}) : null
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
            newLiquidationPrice = (((this.state.daiDebt - value) * this.state.liquidationRatio) / ((this.state.pethCollateral + peth) * this.state.pethWethRatio))
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
        <label style={{paddingBottom:'5px'}}>
        <Popup inverted trigger={<a href="#"style={{textDecoration:'underline', color:'inherit', cursor:'help'}}>Simulate</a>} on='hover'>
            <Popup.Header>Simulate CDP {this.state.cdpId}</Popup.Header>
            <Popup.Content>
                Calculate the liquidation ratio of CDP {this.state.cdpId} by adjusting the quantity DAI Created (as debt) or Repaid. 
                <br/>
                <br/>
                Alternatively, the quantity of PETH Deposited (used as collateral) or Withdrawn (removed from collateral) will affect the liquidation ratio.
            </Popup.Content>  
        </Popup>       
        </label>
                        <Input fluid label={<Dropdown onChange={this.handleDropdownChange} defaultValue='DAI' options={[
                            {key:'DAI', text:'DAI', value:'DAI', id:'DAI'},
                            {key:'PETH', text:'PETH', value:'PETH', id:'PETH'}
                            ]}/>} placeholder={`Quantity ${this.state.selected}`} onChange={this.handleInput} type='number' value={this.state.inputValue ?  Math.abs(this.state.inputValue) : ''}/>
                    </Form.Field>
                    <Form.Field>
                        <Button.Group fluid>
                            <Button positive id='positiveButton'onClick={this.handleClick} style={this.state.positiveButton ? {opacity:0.9} : {opacity:0.3}}>{this.state.selected === 'DAI' ? 'Repay' : 'Deposit'}</Button>
                            <Button.Or />
                            <Button negative id='negativeButton' onClick={this.handleClick} style={this.state.negativeButton ? {opacity:0.9} : {opacity:0.3}}>{this.state.selected === 'DAI' ? 'Create' : 'Withdraw'}</Button>
                        </Button.Group>
                    </Form.Field>
                    <Form.Field>
                        <Progress inverted indicating percent={this.getLiquidationRatio()}>
                            <label>Liqudation Ratio {this.getLiquidationRatio()} % 
                                <Popup trigger={<Icon style={{paddingLeft:'3px', cursor:'help'}} name='question circle' />} header='Liquidation Ratio' content='The percent ETH must fall for this CDP to be
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
                    {/* <Modal size={'tiny'} trigger={<Button primary fluid disabled>Submit</Button>}>
                        <Modal.Header style={{ backgroundColor: '#38414B', fontSize:'0.9em', textAlign:'center', color:'#FFF'}}>Confirm Changes to CDP {this.state.cdpId}</Modal.Header>
                        <Modal.Header style={{paddingBottom:'5px', textAlign:'center', color:this.state.positiveButton ?'#369639':'#AF2024', backgroundColor:'#273340'}}>{this.state.positiveButton ? this.state.selected==='DAI' ? 'Repay DAI' : 'Lock Peth' : this.state.selected==='DAI' ? 'Create DAI' : 'Free Peth' }<hr/></Modal.Header>
                        <Modal.Content style={{textAlign:'center', color:'#FFF', backgroundColor:'#273340', fontSize:'1.2em'}}>Create 1,000 DAI at 202.13 USD/ETH</Modal.Content>    
                        <Modal.Content style={{backgroundColor:'#273340',paddingTop:'10' }}>
                        <Segment inverted style={{
                                    backgroundColor:'#273340', 
                                    borderRadius:'5px', 
                                    border: '2px solid #38414B',
                                    // textAlign:'center'
                                    }}> */}
                            {/* <label style={{color:'#FFF', paddingBottom:'5px'}}>Liqudation Price: $138.34 USD </label> */}
                            {/* <Progress inverted indicating percent={this.getLiquidationRatio()}>
                                <label style={{color:'#FFF'}}>Liqudation Ratio {this.getLiquidationRatio()} %
                                <Popup inverted trigger={<Icon style={{paddingLeft:'3px',color:'#FFF'}} name='question circle' />} 
                                content='Percent Eth must fall for your CDP to be liquidated' /></label>
                            </Progress>
                        </Segment>
                        </Modal.Content>
                        <Modal.Content style={{backgroundColor:'#273340'}}>
                            <Table style={{backgroundColor:'#273340'}} inverted celled>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>
                                            Liqudation Price
                                        </Table.Cell>
                                        <Table.Cell style={{color:'red'}}>
                                            138.34 USD <Icon name='arrow up'/>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            Current Price
                                        </Table.Cell>
                                        <Table.Cell>
                                            202.13 USD/ETH
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            Transaction Value
                                        </Table.Cell>
                                        <Table.Cell>
                                            1,000 DAI Worth 4.94 ETH
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            Collateral After Execution
                                        </Table.Cell>
                                        <Table.Cell>
                                            127.86 PETH
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            Debt After Execution
                                        </Table.Cell>
                                        <Table.Cell style={{color:'red'}}>
                                            11,792.28 DAI <Icon name='arrow up'/>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>
                                            Status
                                        </Table.Cell>
                                        <Table.Cell style={{color:'red'}}>
                                            Not Executed
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Modal.Content>
                        <Modal.Actions style={{backgroundColor:'#273340'}}>
                        <Button.Group fluid>
                            <Button  style={{opacity:0.9}} negative>Cancel</Button>
                            <Button.Or />
                            <Button  style={{opacity:0.9}} positive>Submit</Button>
                        </Button.Group>
                        </Modal.Actions>
                    </Modal> */}
                    <hr style={{marginTop:'5px'}}/>
                </Form>
            </div>
        )
    }
}
