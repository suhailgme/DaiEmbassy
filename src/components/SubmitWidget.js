import React, { Component } from 'react'
import { Button, Progress, Icon, Popup, Modal, Table, Segment } from 'semantic-ui-react'


export default class SubmitWidget extends Component{
    state = {}

    render(){
        return(
            <div>
                     <Modal size={'tiny'} trigger={<Button primary fluid>Submit</Button>}>
                        <Modal.Header style={{ backgroundColor: '#38414B', fontSize:'0.9em', textAlign:'center', color:'#FFF'}}>Confirm Changes to CDP {this.state.cdpId}</Modal.Header>
                        <Modal.Header style={{paddingBottom:'5px', textAlign:'center', color:this.state.positiveButton ?'#369639':'#AF2024', backgroundColor:'#273340'}}>{this.state.positiveButton ? this.state.selected==='DAI' ? 'Wipe Dai' : 'Lock Peth' : this.state.selected==='DAI' ? 'Draw Dai' : 'Free Peth' }<hr/></Modal.Header>
                        <Modal.Content style={{textAlign:'center', color:'#FFF', backgroundColor:'#273340', fontSize:'1.2em'}}>Draw 1,000 Dai at 202.13 USD/ETH</Modal.Content>    
                        <Modal.Content style={{backgroundColor:'#273340',paddingTop:'10' }}>
                        <Segment inverted style={{
                                    backgroundColor:'#273340', 
                                    borderRadius:'5px', 
                                    border: '2px solid #38414B',
                                    // textAlign:'center'
                                    }}>
                            {/* <label style={{color:'#FFF', paddingBottom:'5px'}}>Liqudation Price: $138.34 USD </label> */}
                            <Progress inverted indicating percent={this.getLiquidationRatio()}>
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
                    </Modal>               
            </div>
        )
    }
}