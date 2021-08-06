const { pastebin, Op } = require('./models/Pastebin.models');

const insert = async (title, content, language)=>{

    //Randomly Choose to Delete old records
    if(Math.random() < 0.1)
        await clearPrevious(7)

    const currTime = new Date().getTime()
    let newId = Math.random().toString(36).substring(2)

    await pastebin.create({
        id: newId,
        title: title === undefined ? "[NO TITLE]" : title,
        language: language === undefined ? "TEXT" : language,
        content: content,
        epoch: currTime
    })
        .catch(err => {
            console.log(err)
            newId = undefined
        })
    return {endpoint: newId, epoch: currTime}
}

const insertCheck = async (title, content, language, flavor)=>{
    //Randomly Choose to Delete old records
    if(Math.random() < 0.1)
        await clearPrevious(7)

    const currTime = new Date().getTime()
    const exists = await findThis(flavor)

    if(exists !== undefined)
        return undefined;
    
    await pastebin.create({
        id: flavor,
        title: title === undefined ? "" : title,
        language: language === undefined ? "TEXT" : language,
        content: content,
        epoch: currTime
    })
        .catch(err =>{
            console.log(err)
            return undefined
        })
    return {endpoint: flavor, epoch: currTime}
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
            language: data.dataValues.language,
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
    let count = 0
    await pastebin.count()
        .then(response => count = response)
        .catch(err => console.log(err))
    
    return count
}

const getHostNames = async ()=>{
    let hostNames = await pastebin.findAll()
    let result = new Set()
    hostNames.map(curr =>
        result.add(curr.dataValues.url
            .split("//")[1].split('/')[0]))
    console.log(result)
    return result
}

const deleteAllData = async ()=>{
    await pastebin.destroy({
        truncate: true
    })
}

const crud = {
    insert,
    insertCheck,
    findThis,
    countAll,
    getHostNames,
    deleteAllData
}
module.exports = crud
