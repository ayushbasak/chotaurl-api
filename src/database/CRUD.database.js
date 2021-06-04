const { urls , Op} = require('./models/Urls.models')

const insert = async (url)=>{

    //Randomly Choose to Delete old records
    if(Math.floor(Math.random() * 10) === 1)
        await clearPrevious(7)


    let newId = Math.random().toString(36).substring(2)
    await urls.create({
        id: newId,
        url: url,
        epoch: new Date().getTime()
    })
        .catch(err => {
            console.log(err)
            newId = undefined
        })
    return newId
}

const insertCheck = async (url, flavor)=>{
    //Randomly Choose to Delete old records
    if(Math.floor(Math.random() * 10) === 1)
        await clearPrevious(7)

    const exists = await findThis(flavor);
    if(exists !== undefined)
        return undefined;
    
    await urls.create({
        id: flavor,
        url: url,
        epoch: new Date().getTime()
    })
        .catch(err =>{
            console.log(err)
            return undefined
        })
    return flavor
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
                [Op.gt] : currTime
            }
        }
    })
        .then(response => console.log(`deleted`))
}

module.exports = {
    insert: insert,
    insertCheck: insertCheck,
    findThis: findThis
}