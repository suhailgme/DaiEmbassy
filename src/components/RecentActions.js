import React, { Component } from 'react'
import { Card, Feed } from 'semantic-ui-react'

class RecentActions extends Component{
    state = {}

    render(){
        return(
            <div style={{paddingTop:'10px'}}>
                <Card fluid>
                    <Card.Content header="Recent Actions"/>
                    <Card.Content>
                    <Feed><Feed.Event date='39 min ago' summary='Open CDP'/></Feed>
                    <Feed><Feed.Event date='24 min ago' summary='Lock'/></Feed>
                    <Feed><Feed.Event date='22 min ago' summary='Draw'/></Feed>
                    </Card.Content>
                </Card>
            </div>
        )
    }
}

export default RecentActions