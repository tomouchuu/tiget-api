var Xray = require('x-ray');
var x = Xray();

// Event
x('https://tiget.net/events/66594', '#content', {
// x('https://tiget.net/events/70074', '#content', {
    'name': '.title-box',
    'artists': '.performer-box',
    'details': ['.event-detail .lead'],
    'date': '.event-detail > div:nth-child(9) .rowdata',
    'location': '.event-detail > div:nth-child(8) p',
    'time': '.event-detail > div:nth-child(10) .open-start-time',
    'prices': x('.event-detail > div:nth-child(10)', '.ticket-types > .ticket-type', [{
        'type': '.name',
        'prices': ['.price-box tr']
    }]),
    'tickets': x('.tikcet-type-row', '.reception-button-frame', [{
        'availability': '.ticket-mark',
        'type': '.ticket-type',
        'price': '.value',
        'link': 'a@href'
    }]),
    user: x('.event-detail > div:nth-child(11)', '.rowdata', {
        name: '.eventer',
        link: '.eventer@href'
    })
})((err, data) => {
    console.log(err);

    const details = data.details.join('\r\n');

    const tickets = [];
    for (let i = 0; i < data.prices.length; i++) {
        const price = data.prices[i];
        if (!price.type) {
            price.type = 'General'
        }

        price.advPrice = price.prices[0].trim();
        price.dayPrice = price.prices[1].trim();

        const formattedAdvPrice = ' '+price.advPrice.slice(3).split('円')[0]+'円';
        const matchingTicket = data.tickets.find(o => o.price === formattedAdvPrice);

        price.availability = matchingTicket.availability;
        price.link = matchingTicket.link;

        delete price.prices;

        tickets.push(price);
    }

    const res = {
        id: 66594,
        name: data.name,
        artists: data.artists,
        details,
        date: data.date,
        location: data.location,
        time: data.time,
        link: 'https://tiget.net/events/66594',
        tickets,
        user: data.user
    };

    console.log(res);
});