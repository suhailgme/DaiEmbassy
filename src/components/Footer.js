import React, { Component } from 'react'
import { Grid, Icon, Container } from 'semantic-ui-react'

export default class Footer extends Component{
    state ={}
    render(){
        return(
            <div className='footer' style={{color:'#FFF', backgroundColor:'#3D4853', marginTop:'5px'}}>
                <Grid container centered columns={3}>
                    <Grid.Column >
                        <Icon inverted name='twitter'/>
                        <a href="https://twitter.com/DaiEmbassy" target='_blank' style={{color:'#FFF', textDecoration:'underline'}}>Twitter</a>
                    </Grid.Column>
                    <Grid.Column>
                        <p>@cryptonomik <a href='https://chat.makerdao.com' target='_blank' style={{color:'#FFF', textDecoration:'underline'}}>(chat.makerdao.com)</a></p>
                    </Grid.Column>
                </Grid>
            </div>

        )
    }
}