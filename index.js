const {send} = require('micro');
const getEvent = require('./event');
const getUser = require('./user');

module.exports = async (req, res) => {
    if (req.url === '/') {
        return send(res, 200, {
            routes: [
                '/event/{id}',
                '/user/{id}'
            ]
        });
    }

    if (req.url !== '/favicon.ico') {
        const url = req.url.slice(1);
        const splitUrl = url.split('/', 2);
        const route = splitUrl[0];
        const id = splitUrl[1];

        if (route === 'event') {
            const eventData = await getEvent(id);
            return send(res, 200, eventData);
        }

        if (route === 'user') {
            const userData = await getUser(id);
            return send(res, 200, userData);
        }
    }

    return res.status(404);
};