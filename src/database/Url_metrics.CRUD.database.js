const { url_metrics } = require('./models/url_metrics');

const clicked_url = async (url_id) => {
    try {
        const currTime = new Date().getTime();
        await url_metrics.create({
            id: Math.random().toString(36).substring(2, 6),
            url_id: url_id,
            epoch: currTime
        });
    } catch (err) {
        throw err;
    }
}

const getMetrics = async (url_id) => {
    try {
        const metrics = await url_metrics.findAll({
            where: {
                url_id: url_id
            }
        });
        return metrics;
    } catch (err) {
        throw err;
    }
}

module.exports = { clicked_url, getMetrics };