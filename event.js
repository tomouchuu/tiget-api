var Xray = require('x-ray');
var x = Xray();

// Event
module.exports = id => {
    return new Promise(resolve => {
        x(`https://tiget.net/events/${id}`, '#content', {
            'name': '.pg-event__header__title',
            'artists': '.pg-event__section.pg-event__detail > .pg-event__detail__section:nth-child(1) > .pg-event__detail__contents',
            'details': ['.pg-event__section.pg-event__detail > .pg-event__detail__description .lead'],
            'date': '.pg-event__section.pg-event__detail > .pg-event__detail__section:nth-child(2) > .pg-event__detail__contents',
            'location': '.pg-event__section.pg-event__detail > .pg-event__detail__section:nth-child(4) > .pg-event__detail__contents',
            'time': '.pg-event__ordering__program__datetime',
            'prices': x('pg-event__detail__section', '.pg-event__detail__ticket', ['p']),
            'tickets': x('.pg-event__ordering__program__ticket', '.c-ordering-btn', [{
                'availability': '.c-ordering-btn__content__status',
                'info': '.c-ordering-btn__content__name',
                'link': 'a@href'
            }]),
            user: x('.pg-event__section.pg-event__detail > .pg-event__detail__section:nth-child(2)', '.pg-event__detail__contents', {
                name: '.eventer',
                link: '.eventer@href'
            })
        })((err, data) => {
            console.log(err);

            const details = data.details.join('\r\n');
            const time = data.time.replace('▼', '').replace(data.date, '').trim();

            const tickets = [];
            for (let i = 0; i < data.prices.length; i++) {
                const priceData = data.prices[i];

                const price = {
                    type: priceData.match(/([\W]+：)+/g)[0].replace('：', ''),
                    cost: priceData.match(/([\d,])+/g)[0]+'円',
                    drinkRequired: /\+D/g.test(priceData)
                }

                const matchingTicket = data.tickets.find(o => o.info.includes(price.cost));

                if (matchingTicket) {
                    price.availability = matchingTicket.availability;
                    price.link = matchingTicket.link;
                }

                tickets.push(price);
            }

            const res = {
                id: id,
                name: data.name,
                artists: data.artists,
                details,
                date: data.date,
                location: data.location,
                time,
                link: `https://tiget.net/events/${id}`,
                tickets,
                user: data.user
            };

            return resolve(res);
        });
    });
};
