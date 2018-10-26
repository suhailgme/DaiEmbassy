import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'

export default class Footer extends Component{
    state ={}
    render(){
        return(
            <div>
                <Grid columns={2} centered style={{color:'#FFF', backgroundColor:'#3D4853', marginTop:'5px'}}>
                    <Grid.Column>
                        Dai Embassy is a CDP Management platform for MakerDAO.<br/>
                        Notice: <br/>This product is currently in alpha testing.All aspects of this service are subject to change at any time without notice.
                        @DaiEmbassy
                    </Grid.Column>
                    <Grid.Row centered columns={2}>
                        <Grid.Column>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

   
                    {/* <Grid.Row columns={2} textAlign='right' style={{color:'#FFF', backgroundColor:'#3D4853'}}>
                        <Grid.Column>
                            Dai Embassy is a product in alpha stages of production. No warranty or guarantees are provided.
                        </Grid.Column>
                        <Grid.Column>
                            CDP Management
                        </Grid.Column>
                    </Grid.Row> */}

            </div>
        )
    }
}