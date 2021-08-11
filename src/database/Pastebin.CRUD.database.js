const { pastebin, Op } = require('./models/Pastebin.models');
const CryptoJs = require('crypto-js')

const insert = async (title, content, passcode)=>{

    const currTime = new Date().getTime()
    let newId = Math.random().toString(36).substring(2,6)

    if(passcode !== ""){
        content = CryptoJs.AES.encrypt(content, passcode).toString()
    }

    await pastebin.create({
        id: newId,
        title: title === undefined ? "[NO TITLE]" : title,
        passcode: passcode,
        content: content,
        epoch: currTime
    })
        .catch(err => {
            console.log(err)
            newId = undefined
        })
    return {endpoint: newId, epoch: currTime}
}

const findThis= async (id)=>{
    let data = await pastebin.findOne({
        where: {id: id}
    })
    if(!data)
        return undefined
    else{
        data = {
            title: data.dataValues.title,
            content: data.dataValues.content,
            epoch: data.dataValues.epoch
        }
        return data
    }
}

const clearPrevious = async (days) =>{
    /**
     * Delete All records which are older than 'days' than current
     */

    const currTime = new Date().getTime() - days * 86400 * 1000
    await pastebin.destroy({
        where: {
            epoch : {
                [Op.lt] : currTime
            }
        }
    })
        .then(response => console.log(`deleted`))
}

const countAll = async ()=>{
    //Randomly Choose to Delete old records
    if(Math.random() < 0.1)
        await clearPrevious(7)
        
    let count = 0
    await pastebin.count()
        .then(response => count = response)
        .catch(err => console.log(err))
    
    return count
}


const deleteAllData = async ()=>{
    await pastebin.destroy({
        truncate: true
    })
}

const crud = {
    insert,
    findThis,
    countAll,
    deleteAllData
}
module.exports = crud
