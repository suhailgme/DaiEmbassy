import React, { Component } from 'react'
import { Grid, Icon, Container } from 'semantic-ui-react'

export default class Footer extends Component{
    state ={}
    render(){
        return(
            <div className='footer' style={{color:'#FFF', backgroundColor:'transparent'}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                        <Icon inverted name='twitter'/>
                        <a href="https://twitter.com/DaiEmbassy" target='_blank' style={{color:'#FFF', textDecoration:'underline'}}>Follow DaiEmbassy</a>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                        <p>Or find cryptonomik @ <a href='https://chat.makerdao.com' target='_blank' style={{color:'#FFF', textDecoration:'underline'}}>MakerDAO Chat</a></p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

        )
    }
}