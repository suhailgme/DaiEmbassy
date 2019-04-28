import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class ManageCDP extends Component {
    state = {}
    
    componentDidMount(){

    }

  static getDerivedStateFromProps(nextProps, prevState){

  }

  getHeaderState = () =>{
      
  }
    


    render(){
        return (
            <div>
            <Modal trigger={<Button primary fluid>Submit</Button>}>
                <Modal.Header style={{fontSize:'1em', textAlign:'center'}}>`Confirm changes to ${this.state.cdpId}`</Modal.Header>
                <Modal.Header style={{textAlign:'center', color:this.state.positiveButton ?'green':':red'}}>{this.state.selected==='DAI'?}</Modal.Header>
                <Modal.Content><p>Test content</p></Modal.Content>
            </Modal>
            </div>
        )
    }
}
