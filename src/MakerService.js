import Maker from '@makerdao/dai';
import Web3 from 'web3'

export default class MakerService {

    constructor(cdpId = 1) {
        console.log('cdpId: ', cdpId)
        this.cdpId = cdpId
        this.hasWeb3 = true
        this.web3 = window.web3 ? new Web3(window.web3.currentProvider) : this.hasWeb3 = false
        this.loggedIn = false
    }

    init = async () => {
        try{
            this.maker = await Maker.create('browser')
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
    

    setCdpId = async (cdpId) => {
        this.cdpId = cdpId
        this.cdp = await this.maker.getCdp(this.cdpId)
        console.log('set cdp to id: ', this.cdpId)
    }

    getDaiDebt = async () => {
        let daiDebt = await (this.cdp.getDebtValue())
        daiDebt = parseFloat(daiDebt.toNumber().toFixed(2))
        return daiDebt
    }

    getEthCollateral = async () => {
        let ethCollateral = await this.cdp.getCollateralValue(Maker.PETH)
        ethCollateral = parseFloat(ethCollateral.toNumber().toFixed(2))
        return ethCollateral
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
        return parseFloat((await this.cdp.getGovernanceFee()).toNumber().toFixed(2))
    }

    getCurrentAccount = async () => {
        return this.web3.utils.toChecksumAddress(await this.maker.currentAccount().address)
    }

    getDaiSupply = async () =>{
        return parseFloat((await this.maker.getToken('DAI').totalSupply()).toNumber().toFixed(0))
    }

    getAllDetails = async () => {
        try{
            const cdpId = this.cdpId
            const daiDebt = await this.getDaiDebt()
            const ethCollateral = await this.getEthCollateral()
            const ethPrice = await this.getEthPrice()
            const mkrPrice = await this.getMkrPrice()
            const liquidationRatio = await this.getLiquidationRatio()
            const pethWethRatio = await this.getPethWethRatio()
            const circulatingDai = await this.getDaiSupply()
            // Possible issue with dai.js getLiquidationPrice when ink = 0 due to calculation 
            // with ink * liqRatio (possible issue with null as well) 
            let liquidationPrice
            try{
                 liquidationPrice = await this.getLiquidationPrice()
            }catch(e){
                // Manually calculate liqudation price when ink = 0
                 liquidationPrice = parseFloat(((daiDebt * liquidationRatio) / (ethCollateral * pethWethRatio)).toFixed(2))
            }
            
            const collateralizationRatio = await this.getCollateralizationRatio()
            const systemCollateralization = await this.getSystemCollateralization()
            const governanceFee = await this.getGovernanceFee()
            // console.log('daiDebt, ethCollateral,liquidationRatio, pethWethRatio', daiDebt,ethCollateral,liquidationRatio,pethWethRatio)

            return {
                wipeDraw: {
                    cdpId,
                    daiDebt,
                    ethCollateral,
                    ethPrice,
                    liquidationRatio,
                    pethWethRatio,
                    liquidationPrice
                },
                cdpDetails: {
                    cdpId,
                    daiDebt,
                    ethCollateral,
                    ethPrice,
                    liquidationRatio,
                    pethWethRatio,
                    liquidationPrice,
                    collateralizationRatio,
                    governanceFee
                },
                systemStatus: {
                    ethPrice,
                    mkrPrice,
                    pethWethRatio,
                    circulatingDai,
                    systemCollateralization
                }, 
            }
        }catch(error){
            console.log('AN ERROR HAS OCCURED! ', error)
            return {error}
        }

    }

    populateWipeDraw = async () => {
        const daiDebt = await this.getDaiDebt()
        const ethCollateral = await this.getEthCollateral()
        const ethPrice = await this.getEthPrice()
        const liquidationRatio = await this.getLiquidationRatio()
        const pethWethRatio = await this.getPethWethRatio()
        const liquidationPrice = await this.getLiquidationPrice()
        const account = await this.getCurrentAccount()
        return {
            daiDebt,
            ethCollateral,
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
        const ethCollateral = await this.getEthCollateral()
        const ethPrice = await this.getEthPrice()
        const account = await this.getCurrentAccount()
        return {
            cdpId,
            daiDebt,
            collateralizationRatio,
            ethPrice,
            ethCollateral,
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