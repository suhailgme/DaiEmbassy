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
                volume: Math.round(day.volumeto), //represents volume in USD as opposed to volumefrom eth
                
            }
        })
    return marketData

    }catch(e){
        console.error(e)
    }

}

export async function getDaiHistorical  () {
    let lastYear = new Date()
    lastYear.setDate(lastYear.getDate()-366)
    lastYear = parseInt((lastYear.getTime() / 1000)).toFixed()
    // console.log(lastYear)
    const url = `https://api.coinpaprika.com/v1/coins/dai-dai/ohlcv/historical?start=${lastYear}&limit=366`
    try{
        let res = await axios.get(url)
        const history = res.data
        const historicalData = history.map(day =>{
            return{
            date: new Date(day.time_close),
            open: +day.open,
            high: +day.high,
            low: + day.low,
            close: +day.close,
            volume: Math.round(day.volume)
            }
        })
        return historicalData
    }catch(e){
    console.error(e)
    }
}
async function getTickers() {
    const url = 'https://api.coinpaprika.com/v1/tickers'
    try{
        let res = await axios.get(url)
        const tickers = res.data
        return tickers
    }catch(e){
        console.error(e)
    }
}

export async function getEthTicker(){
    const tickers = await getTickers()
    return tickers.find((ticker) =>{
        return ticker.id === 'eth-ethereum'
    })
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

