const { pastebin_metrics } = require('./models/pastebin_metrics');

const fetch_pastebin = async (pastebin_id) => {
    try {
        const currTime = new Date().getTime();
        await pastebin_metrics.create({
            id: Math.random().toString(36).substring(2, 6),
            pastebin_id: pastebin_id,
            epoch: currTime
        });
    } catch (err) {
        throw err;
    }
}

const getMetrics = async (pastebin_id) => {
    try {
        const metrics = await pastebin_metrics.findAll({
            where: {
                pastebin_id: pastebin_id
            }
        });
        return metrics;
    } catch (err) {
        throw err;
    }
}

module.exports = { fetch_pastebin, getMetrics };