import React from 'react'
import { Accordion, Loader, Segment, } from 'semantic-ui-react'
import WipeDrawWidget from './WipeDrawWidget'
import CdpDetails from './CdpDetails'
import SystemStatusWidget from './SystemStatusWidget'



const WidgetAccordion = (props) => {

let panel = [
  {
    key: '0',
    title: { content: props.wipeDraw ? `Simulate CDP ${props.cdpId}` : props.updating ? `Loading CDP` : `CDP Simulator and Details` },
    content: { content: props.wipeDraw ? (<WipeDrawWidget wipeDraw={props.wipeDraw} />) : props.loading ? <Loader active inverted inline='centered' /> : 
      <span>
        <Segment inverted style={{ backgroundColor: '#273340' }}>
          <p>Click on a CDP ID or search to:</p>
          <ul style={{}}>
            <li style={{paddingBottom:'10px'}}>Simulate DAI or PETH actions</li>
            <li style={{paddingBottom:'10px'}}>View debt, collateral, accrued fees, and more</li>
            <li style={{paddingBottom:'10px'}}>View complete transaction history</li>
            <li>Load debt, collateral, and liquidation price charts</li>

          </ul>
        </Segment>
        <hr />
      </span>
    }
  },
  {
    key: '1',
    title: { content: props.cdpDetails ? `Details CDP ${props.cdpId}` : props.updating ? `Loading CDP Details` : `CDP Details` },
    content: { content: props.cdpDetails ? (<CdpDetails cdpDetails={props.cdpDetails} />) : props.loading ? <Loader active inverted inline='centered' /> : <span><Segment inverted style={{ backgroundColor: '#273340' }} >Click on a CDP ID or Search for a CDP to See More Details</Segment><hr /></span> },
  },
  {
    key: '2',
    title: { content: props.systemStatus ? `Maker System Statistics` : `Loading System Statistics` },
    content: { content: props.systemStatus ? (<SystemStatusWidget systemStatus={props.systemStatus} />) : <Loader active inverted inline='centered' /> },
  },
]

  let dropdown = <Accordion defaultActiveIndex={[0, 1, 2]} panels={panel} exclusive={false} inverted />

  !props.cdpDetails ? panel.splice(1,1) : null
  return dropdown

}

export default WidgetAccordion
