import Maker from '@makerdao/dai';
import Web3 from 'web3'


export default class MakerService {

    constructor(cdpId) {
        console.log('cdpId: ', cdpId)
        this.cdpId = cdpId
        this.hasWeb3 = true
        this.web3 = window.web3 ? new Web3(window.web3.currentProvider) : this.hasWeb3 = false
        this.loggedIn = false
    }

    init = async () => {
        try{
            // Previous host was 'mainnet' provided by Maker. Switched to infura 27-Mar-19.
            // Private key is random Maker private key from github used on Kovan testnet.
            // this.maker = await Maker.create('mainnet', {
            //     privateKey: 'b178ad06eb08e2cd34346b5c8ec06654d6ccb1cadf1c9dbd776afd25d44ab8d0'

            // })
            this.maker = await Maker.create('http', {
                privateKey: 'b178ad06eb08e2cd34346b5c8ec06654d6ccb1cadf1c9dbd776afd25d44ab8d0',
                url: 'https://mainnet.infura.io/v3/9b85e55cfa5b40a7ac195fba882f04de'

            })
            await this.maker.authenticate()
            this.price = await this.maker.service('price')
            this.ethCdp = await this.maker.service('cdp')
            this.cdp = await this.maker.getCdp(this.cdpId)
        }catch(e){
            console.log('Error authenticating: ', e)
        }
    }

    isLoggedIn = async()=>{
        const accounts = await this.web3.eth.getAccounts()
        accounts[0] ? this.loggedIn = true : this.loggedIn = false
        return this.loggedIn
    }

    hasWeb3 = () => {
        return this.web3 ? true : false
    }
    

    setCdpId = async (cdpId) => {
        if(this.cdpId !== cdpId){
        try{
            this.cdpId = cdpId
            this.cdp = await this.maker.getCdp(this.cdpId)
            console.log('set cdp to id: ', this.cdpId)
            return true
        }
        catch(e){
            console.error('Maker Service: Unable to get CDP ', this.cdpId) //, e)
            return false 
        }
    }

    }

    getDaiDebt = async () => {
        let daiDebt = await (this.cdp.getDebtValue())
        daiDebt = parseFloat(daiDebt.toNumber().toFixed(2))
        return daiDebt
    }

    getPethCollateral = async () => {
        let pethCollateral = await this.cdp.getCollateralValue(Maker.PETH)
        pethCollateral = parseFloat(pethCollateral.toNumber().toFixed(2))
        return pethCollateral
    }

    getEthPrice = async () => {
        let ethUsdPrice = await this.price.getEthPrice()
        ethUsdPrice = parseFloat(ethUsdPrice.toNumber().toFixed(2))
        return ethUsdPrice
    }

    getMkrPrice = async () => {
        return parseFloat((await this.price.getMkrPrice()).toNumber().toFixed(2))
    }

    getLiquidationRatio = async () => {
        return await this.ethCdp.getLiquidationRatio()
    }

    getPethWethRatio = async () => {
        return parseFloat((await this.price.getWethToPethRatio()).toFixed(4))
    }

    getLiquidationPrice = async () => {
        let liquidationPrice = await this.cdp.getLiquidationPrice()
        liquidationPrice = parseFloat(liquidationPrice.toNumber().toFixed(2))
        return liquidationPrice
    }

    getCollateralizationRatio = async () => {
        let collateralizationRatio = await this.cdp.getCollateralizationRatio()
        collateralizationRatio = parseFloat((collateralizationRatio * 100).toFixed(2))
        return collateralizationRatio
    }

    getSystemCollateralization = async () => {
        return parseFloat(((await this.ethCdp.getSystemCollateralization()) * 100).toFixed(2))
    }

    getGovernanceFee = async() =>{
        return parseFloat((await this.cdp.getGovernanceFee(Maker.USD)).toNumber().toFixed(2))
    }

    getGovernanceFeeMkr = async() =>{
        return parseFloat((await this.cdp.getGovernanceFee()).toNumber().toFixed(2))
    }

    getCurrentAccount = async () => {
        try{
        return this.web3.utils.toChecksumAddress(await this.maker.currentAccount().address)
        }catch(e){
            console.error(e)
            return 0
        }
    }

    getDaiSupply = async () =>{
        return parseFloat((await this.maker.getToken('DAI').totalSupply()).toNumber().toFixed(0))
    }

        //TODO, reduces number of calls to blockchain by 3 by removing getPethCollateral, getDaiDebt, 
    getCdpInfo = async () =>{
        const cdpInfo = await this.ethCdp.getInfo(this.cdpId)
        const pethCollateral = this.web3.utils.fromWei(cdpInfo[1].toString())
        const daiDebt = this.web3.utils.fromWei(cdpInfo[2].toString())
        console.log(cdpInfo, pethCollateral, daiDebt)
    }

    getAllDetails = async () => {
        try{
            // await this.getCdpInfo()
            const cdpId = this.cdpId
            const daiDebt = await this.getDaiDebt()
            const pethCollateral = await this.getPethCollateral()
            const ethPrice = await this.getEthPrice()
            const liquidationRatio = await this.getLiquidationRatio()
            const pethWethRatio = await this.getPethWethRatio()
            // Possible issue with dai.js getLiquidationPrice when ink = 0 due to calculation 
            // with ink * liqRatio (possible issue with null as well) 
            let liquidationPrice
            try{
                 liquidationPrice = await this.getLiquidationPrice()
            }catch(e){
                // Manually calculate liqudation price when ink = 0
                 liquidationPrice = parseFloat(((daiDebt * liquidationRatio) / (pethCollateral * pethWethRatio)).toFixed(2))
            }
            
            const collateralizationRatio = await this.getCollateralizationRatio()
            const governanceFee = await this.getGovernanceFee()
            const governanceFeeMkr = await this.getGovernanceFeeMkr()
            
            // console.log('daiDebt, pethCollateral,liquidationRatio, pethWethRatio', daiDebt,pethCollateral,liquidationRatio,pethWethRatio)

            return {
                wipeDraw: {
                    cdpId,
                    daiDebt,
                    pethCollateral,
                    ethPrice,
                    liquidationRatio,
                    pethWethRatio,
                    liquidationPrice
                },
                cdpDetails: {
                    cdpId,
                    daiDebt,
                    pethCollateral,
                    ethPrice,
                    liquidationRatio,
                    pethWethRatio,
                    liquidationPrice,
                    collateralizationRatio,
                    governanceFee,
                    governanceFeeMkr
                }
            }
        }catch(error){
            console.log('AN ERROR HAS OCCURED! ', error)
            // const block = await this.web3.eth.getBlock('latest')
            // console.log('block: ', block)
            return {error}
        }

    }

    populateWipeDraw = async () => {
        const daiDebt = await this.getDaiDebt()
        const pethCollateral = await this.getPethCollateral()
        const ethPrice = await this.getEthPrice()
        const liquidationRatio = await this.getLiquidationRatio()
        const pethWethRatio = await this.getPethWethRatio()
        const liquidationPrice = await this.getLiquidationPrice()
        const account = await this.getCurrentAccount()
        return {
            daiDebt,
            pethCollateral,
            ethPrice,
            liquidationRatio,
            pethWethRatio,
            liquidationPrice,
            account
        }
    }

    populateCdpDetails = async () => {
        const cdpId = this.cdpId
        const daiDebt = await this.getDaiDebt()
        const collateralizationRatio = await this.getCollateralizationRatio()
        const pethCollateral = await this.getPethCollateral()
        const ethPrice = await this.getEthPrice()
        const account = await this.getCurrentAccount()
        return {
            cdpId,
            daiDebt,
            collateralizationRatio,
            ethPrice,
            pethCollateral,
            account
        }
    }

    populateSystemStatus = async () => {
        const ethPrice = await this.getEthPrice()
        const mkrPrice = await this.getMkrPrice()
        const pethWethRatio = await this.getPethWethRatio()
        const systemCollateralization = await this.getSystemCollateralization()
        return {
            ethPrice,
            mkrPrice,
            pethWethRatio,
            systemCollateralization
        }

    }





}