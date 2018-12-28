import React, { Component } from 'react'
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Loader, Icon } from 'semantic-ui-react'

const Humanize = require('humanize-plus')



export default class AllCdps extends Component{
    state = {
        cdps: this.props.cdps,
        filtered: true,
        minDebt: "0.01",
    }


    componentDidUpdate(prevProps) {
        if(this.props.cdps !== prevProps.cdps)
            this.processCdps()
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.cdps && nextProps.cdps !==prevState.cdps){
            return {
                cdps: nextProps.cdps
            }
        }
        return null
    }
    

    truncateTx = (tx) => {
        return `${tx.slice(0,6)}...${tx.slice(-6)}` 
    }

    numberWithCommas = (number) => {
        return Humanize.formatNumber(number,2)
      }
    
      handleClick = (e) =>{
        e.preventDefault()
        this.props.handleSearchClick(null, {value: e.target.value})
    }

    processCdps = () =>{
        const cdps = this.state.cdps
        let processedCdps = []
        cdps.forEach(cdp =>{
            if(this.state.filtered){
            if(this.numberWithCommas(cdp.daiDebt) >= this.state.minDebt)
            processedCdps.push({
                cdpId: <button style={{background: 'none', border:'none', padding:0, textDecoration:'underline', color:'#FFF', cursor:'pointer'}} value={cdp.cdpId} onClick={this.handleClick}>{cdp.cdpId}</button>,
                account: <a target="_blank" href={`https://etherscan.io/address/${cdp.account}`} style={{textDecoration:'underline', color:'inherit'}}>{cdp.account}</a>,
                daiDebt: this.numberWithCommas(cdp.daiDebt),
                pethCollateral: this.numberWithCommas(cdp.pethCollateral),
                usdCollateral: this.numberWithCommas(cdp.usdCollateral),
                ratio: this.numberWithCommas(cdp.ratio),
            }) 
        }else{
            processedCdps.push({
                cdpId: <button style={{background: 'none', border:'none', padding:0, textDecoration:'underline', color:'#FFF', cursor:'pointer'}} value={cdp.cdpId} onClick={this.handleClick}>{cdp.cdpId}</button>,
                account: <a target="_blank" href={`https://etherscan.io/address/${cdp.account}`} style={{textDecoration:'underline', color:'inherit'}}>{cdp.account}</a>,
                daiDebt: this.numberWithCommas(cdp.daiDebt),
                pethCollateral: this.numberWithCommas(cdp.pethCollateral),
                usdCollateral: this.numberWithCommas(cdp.usdCollateral),
                ratio: this.numberWithCommas(cdp.ratio),
            }) 
        }
    
        })
        // console.log(processedCdps)
        this.setState({processedCdps, numberCDPs: processedCdps.length})
    }

    filterTable = () =>{
        const filtered = !this.state.filtered
        this.setState({filtered}, () =>{
            this.processCdps()
        })

    }

    render(){
        if(this.state.cdps){
        const processedCdps = this.state.processedCdps
        const numberCDPs = this.state.numberCDPs
        return (
            <div style={{color:'#FFF', borderRadius:'5px', border: '2px solid #38414B',
            backgroundColor:'#273340', paddingTop:'10px', paddingLeft:'5px'}}>
                <h4>All Open CDPs (Total {numberCDPs})</h4>
                <button style={{background: 'none', border:'none', padding:0, textDecoration:'underline', color:'#FFF', cursor:'pointer'}} value='ShowDebt' onClick={this.filterTable}>{this.state.filtered ? "Show All CDPs" : "Hide Debt-Free CDPs"}</button>
                <hr style={{opacity:'0.7'}}/>
              <ReactTable
                data = {processedCdps}
                columns= {[
                    
                            {
                                Header: <span>CDP ID <Icon inverted name='sort'/></span>,
                                accessor: 'cdpId',
                            },
                            {
                                Header: <span>Owner <Icon inverted name='sort'/></span>,
                                accessor: 'account'
                            },
                            {
                                Header: <span>Debt (DAI) <Icon inverted name='sort'/></span>,
                                accessor: "daiDebt",
                                sortMethod: (a, b) => {
                                    if (a.length === b.length) {
                                      return a > b ? 1 : -1;
                                    }
                                    return a.length > b.length ? 1 : -1;
                                  }
                            },
                            {
                                Header: <span>Collateral (PETH) <Icon inverted name='sort'/></span>,
                                accessor: "pethCollateral",
                                sortMethod: (a, b) => {
                                    if (a.length === b.length) {
                                      return a > b ? 1 : -1;
                                    }
                                    return a.length > b.length ? 1 : -1;
                                  }
                            },
                            {
                                Header: <span>Collateral (USD) <Icon inverted name='sort'/></span>,
                                accessor: "usdCollateral",
                                sortMethod: (a, b) => {
                                    if (a.length === b.length) {
                                      return a > b ? 1 : -1;
                                    }
                                    return a.length > b.length ? 1 : -1;
                                  }
                            },
                            {
                                id: 'ratio',
                                Header: <span>Collateralization Ratio <Icon inverted name='sort'/></span>,
                                accessor: data => data.ratio,
                                Cell: props => <p style={{color: props.value == 0.00 ? '#FFF' : props.value < 170 ? '#FF695E' : props.value < 200 ? '#EFBC72' : '#FFF' }}>{`${props.value} %`}</p>,
                                sortMethod: (a, b) => {
                                    if (a.length === b.length) {
                                      return a > b ? 1 : -1;
                                    }
                                    return a.length > b.length ? 1 : -1;
                                  }
                            },  
                ]}
                defaultPageSize={10}
                className="-striped -highlight"
                style={{color:'#FFF', textAlign:'center', }}
                previousText={<p style={{color:'#FFF', }}>Previous</p>}
                nextText={<p style={{color:'#FFF',}}>Next</p>}
              />
            </div>
          )
        }else{
            return(
                <div style={{color:'#FFF', borderRadius:'5px', border: '2px solid #38414B',
                backgroundColor:'#273340', paddingTop:'10px', paddingLeft:'5px', height:'494px'}}>
                <h4>Loading All Open CDPs</h4>
                <hr style={{opacity:'0.7'}}/>
                <Loader active inverted inline='centered'/>

                </div>
            )
        }
    }
}
