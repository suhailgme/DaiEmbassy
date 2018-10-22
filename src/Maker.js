import Maker from '@makerdao/dai'


export default async () =>{
    const maker = window.web3 ? await Maker.create('browser') : null
    await maker.authenticate()
    return maker
};