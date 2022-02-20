const request = require('postman-request');

const forecast = (lat, long, callback) => {
    const apiKey = 'ab38c9b0969811fc2970882d2cb06357';
    const urlWeatherStackBase = 'http://api.weatherstack.com/current?access_key=' + apiKey;

    request({
        url: urlWeatherStackBase + '&query=' + lat + ',' + long,
        json: true 
    }, (error, {body}) => {
        if(error) {
            callback('Low level OS error.Unable to connect to weatherStack !', undefined)
        } else if (body.error) {
            callback(body.error.info, undefined)
        } else {
            callback(undefined, body.current);
        }
    })
}

module.exports = forecast;