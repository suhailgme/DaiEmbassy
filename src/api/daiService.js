const axios = require('axios')
const queries = require('../db/queries')
const url = 'https://graphql.makerdao.com/v1'
const url2 = 'https://sai-mainnet.makerfoundation.com/v1'
const kovanUrl = 'https://kovan-data.makerdao.com/v1'
//const url = 'https://dai-service.makerdao.com/cups/conditions=closed:false/sort=cupi:desc'



export async function getCdps() {
    try{
        let cdps = await axios.post(url2, {query:queries.getCdps})
        cdps = cdps.data.data.allCups.nodes.map(cdp => {
            return {
                cdpId:cdp.id,
                account: cdp.lad,
                daiDebt: cdp.art,
                pethCollateral: cdp.ink,
                fees: cdp.ire,
                usdCollateral: cdp.tab,
                ratio: cdp.ratio,
                ethUsdPrice: cdp.pip,
                actions: cdp.actions.nodes
            }
        })
        return cdps
      }catch(e){
          console.error('Error in daiService.js', e)
      }
}


// export async function getCdpByAddress(address) {
//     try{
//         const query = getCdpByAddress(address)
//         let cdps = await axios.post(url, {query:query})
//         cdps = cdps.data.data.allCups.nodes.map(cdp => {
//             return {
//                 id:cdp.id,
//                 account: cdp.lad,
//                 daiDebt: cdp.art,
//                 pethCollateral: cdp.ink,
//                 fees: cdp.ire,
//                 usdCollateral: cdp.tab,
//                 ratio: cdp.ratio,
//                 ethUsdPrice: cdp.pip,
//                 actions: cdp.actions.nodes
//             }
//         })
//         return cdps
//       }catch(e){
//           console.error(e)
//       }
// }

export async function getCdpByAccount(account){
    let cdps = await getCdps()
    let cdp = cdps.find((cdp) =>{
        return cdp.account === account
    })
    return cdp
}








