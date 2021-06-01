const { urls } = require('./models/Urls.models')

const insert = async (url)=>{
    const newId = Math.random().toString(36).substring(2)
    await urls.create({
        id: newId,
        url: url
    })
        .then(response => {
            console.log(response)
        })
        .catch(err => {
            console.log(err)
            newId = undefined
        })
    return newId
}

const insertCheck = async (url, flavor)=>{
    const exists = await findThis(flavor);
    if(exists !== undefined)
        return undefined;
    
    await urls.create({
        id: flavor,
        url: url
    })
        .then(response => console.log(response))
        .catch(err =>{
            console.log(err)
            return undefined
        })
    return flavor
}

const findThis= async (id)=>{
    const data = await urls.findOne({
        where: {id: id}
    })
        // .then(response => console.log(response))
        // .catch(err => console.log(err))
    return data ? data.dataValues.url : undefined
}

module.exports = {
    insert: insert,
    insertCheck: insertCheck,
    findThis: findThis
}