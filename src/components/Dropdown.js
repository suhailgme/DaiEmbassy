import React from 'react'
import { Accordion, Loader } from 'semantic-ui-react'
import WipeDrawWidget from './WipeDrawWidget'
import CdpDetails from './CdpDetails'
import SystemStatusWidget from './SystemStatusWidget'



const WidgetAccordion = (props) => <Accordion defaultActiveIndex={[0,1,2]} panels={[
  {
    key: '0',
    title: `Manage CDP ${props.cdpId}`,
    content: {content: props.wipeDraw ? (<WipeDrawWidget wipeDraw={props.wipeDraw}/>) : <Loader active inverted inline='centered'/>}
  },
  {
    key: '1',
    title: `Details CDP ${props.cdpId}`,
    content: {content: props.cdpDetails ? (<CdpDetails cdpDetails={props.cdpDetails}/>) : <Loader active inverted inline='centered'/>},
  },
  {
    key: '2',
    title: 'System Status',
    content: {content: props.systemStatus ? (<SystemStatusWidget systemStatus={props.systemStatus} />) : <Loader active inverted inline='centered'/>},
  }
]} exclusive={false} inverted />

export default WidgetAccordion
