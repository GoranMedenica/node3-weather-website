const request = require('postman-request');

const geocode = (address, callback) => {
    const mapBoxToken = 'pk.eyJ1Ijoiemd1bmNlMTI1IiwiYSI6ImNrY2MwbDFuZjAwNGUycXBubnB3MW0wMHQifQ.rXbnL9lAmON4PLAxrZROxQ';
    const urlMapBox = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=' + mapBoxToken + '&limit=1';
    // encodeURIComponent --> for special characters (eg. ? becomes %3F) --> safe URL !

    request({ url: urlMapBox, json: true}, (error, {body}) => {
        if(error) {
            callback('Low level OS error.Unable to connect to mapBox !', undefined);
        } else if (body.message) {
            callback('Error: ' + body.message, undefined);
        } else if (!body.features.length) {
            callback('Unable to find location.Try another search.', undefined);
        } else {
            const latLong = body.features[0].center;
            callback(undefined, {
                latitude: latLong[1],
                longitude: latLong[0],
                location: body.features[0].place_name
            });
        }
    })
}

module.exports = geocode;