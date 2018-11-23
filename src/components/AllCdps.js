import React, { Component } from 'react'
import ReactTable from "react-table";
import "react-table/react-table.css";
const Humanize = require('humanize-plus')



export default class AllCdps extends Component{
    state = {
        cdps: this.props.cdps
    }


    componentDidMount() {
        // console.log('AllCdps: ', this.state.cdps)
    }

    truncateTx = (tx) => {
        return `${tx.slice(0,6)}...${tx.slice(-6)}` 
    }

    numberWithCommas = (number) => {
        return Humanize.formatNumber(number,2)
      }
    
      handleClick = (e) =>{
        this.props.handleSearchClick(null, {value: e.target.value})
    }

    processCdps = () =>{
        const cdps = this.state.cdps
        const processedCdps = cdps.map(cdp =>{
            return {
                cdpId: <button style={{background: 'none', border:'none', padding:0, textDecoration:'underline', color:'#FFF', cursor:'pointer'}} value={cdp.cdpId} onClick={this.handleClick}>{cdp.cdpId}</button>,
                account: <a target="_blank" href={`https://etherscan.io/address/${cdp.account}`} style={{textDecoration:'underline', color:'inherit'}}>{cdp.account}</a>,
                daiDebt: this.numberWithCommas(cdp.daiDebt),
                pethCollateral: this.numberWithCommas(cdp.pethCollateral),
                usdCollateral: this.numberWithCommas(cdp.usdCollateral),
                ratio: this.numberWithCommas(cdp.ratio),

            }
        })
        // console.log(processedCdps)
        return processedCdps
    }

    render(){
        const processedCdps = this.processCdps()
        return (
            <div style={{color:'#FFF', borderRadius:'5px', border: '2px solid #38414B',
            backgroundColor:'#273340', paddingTop:'10px', paddingLeft:'5px'}}>
                <h4>All Open CDPs (Total {processedCdps.length})</h4>
                <hr style={{opacity:'0.7'}}/>
              <ReactTable
                data = {processedCdps}
                columns= {[
                    
                            {
                                Header: 'CDP ID',
                                accessor: 'cdpId',
                            },
                            {
                                Header: 'Owner',
                                accessor: 'account'
                            },
                            {
                                Header: "Debt (DAI)",
                                accessor: "daiDebt",
                                sortMethod: (a, b) => {
                                    if (a.length === b.length) {
                                      return a > b ? 1 : -1;
                                    }
                                    return a.length > b.length ? 1 : -1;
                                  }
                            },
                            {
                                Header: "Collateral (PETH)",
                                accessor: "pethCollateral",
                                sortMethod: (a, b) => {
                                    if (a.length === b.length) {
                                      return a > b ? 1 : -1;
                                    }
                                    return a.length > b.length ? 1 : -1;
                                  }
                            },
                            {
                                Header: "Collateral (USD)",
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
                                Header: "Collateralization Ratio",
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
       
    }
}
