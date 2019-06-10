import React, { Component } from 'react'
import { Menu, Label, Popup, Search, Responsive } from 'semantic-ui-react'
import Dropdown from './Dropdown' 
import Footer from './Footer'
import logo from '../images/daiEmbassyLogo.png'

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
            <Responsive onUpdate={this.handleUpdate}>
            <Menu fluid={this.state.fluid} fixed='left' inverted vertical size='huge' style={{ background:'#233142' }}>
                <Menu.Item className='logo'>
                <a href='.'>
                    <img src={logo} alt='Logo' width='155px'/>
                    {/* <svg height="35" width="35"> */}
                        {/* <polygon points="32,0 0,0 0,32 32,32 26.946,26.828 5.054,26.828 5.054,5.172 26.946,5.172 " style={{fill:"#B8BCBF"}} /> */}
                        {/* <polygon points="9.571,20.464 17.635,24.934 25.7,20.464 25.7,11.525 17.635,7.056 9.571,11.525 " style={{fill:"#B8BCBF"}} /> */}
                        {/* <path d="M0,16.024L15.976,32L32,15.976L16.024,0L0,16.024z M15.989,23.347l-7.336-7.336l14.694-0.022L15.989,23.347z" style={{fill:"#eca94b"}}></path>
                    </svg> */}
                    </a> 
                    {/* <a href='.'>
                    <span style={{fontFamily:"Roboto", fontWeight:500 }}>Dai Embassy</span>
                    </a>  */}

                <Popup inverted position='right center' trigger={<Label color='grey' style={{cursor:'help'}}>Alpha</Label>} content='Alpha 0.13.0 (22-May-2019)'/>
                </Menu.Item>
                <Menu.Item>
                    <Dropdown {...this.props}/>
                </Menu.Item>
                <Menu.Item>
                    <Footer />
                </Menu.Item>
            </Menu>
            </Responsive>
        )
    }
}