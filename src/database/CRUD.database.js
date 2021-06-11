const { urls , Op} = require('./models/Urls.models')

const insert = async (url)=>{

    //Randomly Choose to Delete old records
    if(Math.floor(Math.random() * 10) === 1)
        await clearPrevious(7)

    const currTime = new Date().getTime()
    let newId = Math.random().toString(36).substring(2)
    await urls.create({
        id: newId,
        url: url,
        epoch: currTime
    })
        .catch(err => {
            console.log(err)
            newId = undefined
        })
    return {endpoint: newId, epoch: currTime}
}

const insertCheck = async (url, flavor)=>{
    //Randomly Choose to Delete old records
    if(Math.floor(Math.random() * 10) === 1)
        await clearPrevious(7)

    const currTime = new Date().getTime()
    const exists = await findThis(flavor);
    if(exists !== undefined)
        return undefined;
    
    await urls.create({
        id: flavor,
        url: url,
        epoch: currTime
    })
        .catch(err =>{
            console.log(err)
            return undefined
        })
    return {endpoint: flavor, epoch: currTime}
}

const findThis= async (id)=>{
    let data = await urls.findOne({
        where: {id: id}
    })
    return data ? data.dataValues.url : undefined
}

const clearPrevious = async (days) =>{
    /**
     * Delete All records which are older than 'days' than current
     */

    const currTime = new Date().getTime() - days * 86400 * 1000
    await urls.destroy({
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
    await urls.count()
        .then(response => count = response)
        .catch(err => console.log(err))
    
    return count
}

const getHostNames = async ()=>{
    let hostNames = await urls.findAll()
    let result = new Set()
    hostNames.map(curr =>
        result.add(curr.dataValues.url
            .split("//")[1].split('/')[0]))
    console.log(result)
    return result
}

const deleteAllData = async ()=>{
    await urls.destroy({
        truncate: true
    })
}
const crud = {
    insert: insert,
    insertCheck: insertCheck,
    findThis: findThis,
    countAll: countAll,
    getHostNames: getHostNames,
    deleteAllData: deleteAllData
}
module.exports = crud