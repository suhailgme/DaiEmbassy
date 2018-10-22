const axios = require('axios');

export async function getMarketData() {
    try{
        let res = await axios.get('https://min-api.cryptocompare.com/data/histohour?fsym=ETH&tsym=USD&limit=1000')
        let marketData = res.data.Data.map(day=>{
            return{
                date: new Date(day.time*1000),
                open: +day.open,
                high: +day.high,
                low: +day.close,
                close: +day.close,
                
            }
        })
    return marketData

    }catch(e){
        console.error(e)
    }

}

export async function getEthPrice() {
    try{
        let res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
        let price = res.data.USD
    return price

    }catch(e){
        console.error(e)
    }

}

