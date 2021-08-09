const { pastebin, Op } = require('./models/Pastebin.models');

const insert = async (title, content, language)=>{

    const currTime = new Date().getTime()
    let newId = Math.random().toString(36).substring(2,6)

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
    insertCheck,
    findThis,
    countAll,
    deleteAllData
}
module.exports = crud
