import React, { Component } from 'react'
import Dropdown from './Dropdown' 
import { Menu, Responsive } from 'semantic-ui-react'

export default class SideMenu extends Component{
    state = {
        fluid:true
    }

    componentDidMount(){
        // console.log(window.innerWidth)
        let fluid = window.innerWidth < 768 ? true : false
        this.setState({fluid})
    }


    handleUpdate = (e, {width})=>{
        let fluid = this.state.fluid
        fluid = width < 768 ? true : false
        this.setState({fluid})
    }

    render(){
        // console.log('props:', this.props)
        return(
            <div>
                <Responsive onUpdate={this.handleUpdate}>
                <Menu stackable fluid={this.state.fluid}inverted vertical size='large' attached style={{marginTop:'0', backgroundColor:'#273340', borderRadius:'5px', border: '2px solid #38414B'}}>
                    <Menu.Item>
                    <Dropdown {...this.props}/>
                    </Menu.Item>
                </Menu>
                </Responsive>
            </div>

        )
    }
}