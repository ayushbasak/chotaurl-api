const { Op } = require('sequelize')
const { urls } = require('./models/Urls.models')

const insert = async (url)=>{

    
    // await urls.create({
    //     id: newId,
    //     url: url,
    //     epoch: currTime
    // })
    //     .catch(err => {
    //         console.log(err)
    //         newId = undefined
    //     })
    // return {endpoint: newId, epoch: currTime}
    
    try {
        const currTime = new Date().getTime()
        let newId = Math.random().toString(36).substring(2,6)
        const new_url = await urls.create({
            id: newId,
            url: url,
            epoch: currTime
        })
        return {
            endpoint: new_url.dataValues.id,
            epoch: new_url.dataValues.epoch
        };
    } catch (err) {
        throw err;
    }

}

const insertCheck = async (url, flavor)=>{    
    try {
        const currTime = new Date().getTime()
        const exists = await findThis(flavor)
        if (exists !== null) {
            throw new Error("Flavor already exists");
        }
        const new_url = await urls.create({
            id: flavor,
            url: url,
            epoch: currTime
        })

        return {
            endpoint: new_url.dataValues.id,
            epoch: new_url.dataValues.epoch
        };
    } catch (err) {
        throw err;
    }

    // if(exists !== undefined)
    //     return undefined;
    
    // await urls.create({
    //     id: flavor,
    //     url: url,
    //     epoch: currTime
    // })
    //     .catch(err =>{
    //         console.log(err)
    //         return undefined
    //     })
    // return {endpoint: flavor, epoch: currTime}
}

const findThis= async (id)=>{
    try {
        let data = await urls.findOne({
            where: {id: id}
        })
        if (data === null) {
            return null;
        }
        return data;
    } catch (err) {
        throw err;
    }
}

const clearPrevious = async (days) =>{
    /**
     * Delete All records which are older than 'days' than current
     */
    try {
        const currTime = new Date().getTime() - days * 86400 * 1000
        await urls.destroy({
            where: {
                epoch : {
                    [Op.lt] : currTime
                }
            }
        })

    } catch (err) {
        throw err;
    }
}

const countAll = async ()=>{
    //Randomly Choose to Delete old records
    if(Math.random() < 0.1)
        await clearPrevious(7)
    let count = 0
    await urls.count()
        .then(response => count = response)
        .catch(err => console.log(err))
    
    return count
}

// const getHostNames = async ()=>{
//     let hostNames = await urls.findAll()
//     let result = new Set()
//     hostNames.map(curr =>
//         result.add(curr.dataValues.url)
//     )
//     // console.log(result)
//     return result
// }

const deleteAllData = async ()=>{
    await urls.destroy({
        truncate: true
    })
}

const updateClicks = async (id) => {
    try {
        const url = await findThis(id)
        if (url === null) {
            throw new Error("URL does not exist");
        }
        // console.log(url);
        await urls.update({
            clicks: url.clicks + 1,
        }, {
            where: {
                id: id
            }
        })

        return url;
    } catch (err) {
        throw err;
    }
}

const crud = {
    insert,
    insertCheck,
    findThis,
    countAll,
    deleteAllData,
    updateClicks
}
module.exports = crud