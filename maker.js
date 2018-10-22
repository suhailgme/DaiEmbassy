const Maker = require('@makerdao/dai')
const maker = Maker.create('test');

(async () =>{
    await maker.authenticate()
//     const priceService = maker.service('price');
//     const newCdp = await maker.openCdp()
//     console.log(newCdp)
})()