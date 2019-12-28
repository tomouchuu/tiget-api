var moment = require('moment');
var Xray = require('x-ray');
var x = Xray();

// User
module.exports = id => {
    return new Promise(resolve => {
        x(`https://tiget.net/users/${id}`, '#content', {
            'artist': '.artist-name',
            'events': x('.artist-panel-scroll.live-box', {
                'date': ['.live-date'],
                'name': ['.live-title-link'],
                'link': ['.live-title-link@href'],
            })
        })((err, data) => {
            console.log(err);

            const pastEvents = [];
            const events = [];

            for (let i = 0; i < data.events.date.length; i++) {
                const event = {
                    date: data.events.date[i],
                    name: data.events.name[i],
                    link: data.events.link[i],
                };

                var now = moment();
                var eventMoment = moment(event.date, 'YYYY年MM月DD日');

                // If event.date is in the past add to pastEvents else add to events
                if (moment(eventMoment).isBefore(now)) {
                    pastEvents.push(event);
                } else {
                    events.push(event);
                }
            }

            const res = {
                id: id,
                artist: data.artist,
                link: `https://tiget.net/users/${id}`,
                pastEvents: pastEvents,
                events: events
            };

            return resolve(res);
        });
    });
};
