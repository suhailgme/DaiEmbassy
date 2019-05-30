import React, { Component } from 'react'
import { Grid, Icon, Container } from 'semantic-ui-react'

export default class Footer extends Component{
    state ={}
    render(){
        return(
            <div className='footer' style={{color:'#FFF', backgroundColor:'transparent', marginTop:'24px'}}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                        <Icon inverted name='twitter'/>
                        Follow <a href="https://twitter.com/DaiEmbassy" target='_blank' style={{color:'#FFF', textDecoration:'underline'}}>DaiEmbassy</a> on Twitter
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                        <p>@cryptonomik <a href='https://chat.makerdao.com' target='_blank' style={{color:'#FFF', textDecoration:'underline'}}>(chat.makerdao.com)</a></p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

        )
    }
}