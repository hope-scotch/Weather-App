import request from 'postman-request'

const forecast = (latitude, longitude, callback) => {
    // Processing of Information and return NECESSARY info

    // 'request' fetches data -> 'forecast' processes and returns it -> callback function chooses what to do with the data
    // request has yet another callback function set up in a similar way in the API being called

    const url = 'http://api.weatherstack.com/current?access_key=67fc69364dcf3530239cdb1e64b85c32&query=' + encodeURIComponent( latitude ) + ',' + encodeURIComponent( longitude ) + '&units=m'

    // using Object Short-Hand Notation for 'url'
    request( {url, json: true}, (error, { body }) => {

        if (error)
            callback('Unable to connect to Weather Services', undefined)
        else if (body.error)
            callback('Unable to find location!', undefined)
        else {
            const { current: curr } = body
            const { temperature, precip, humidity } = curr

            callback(undefined, {
                temperature,
                precip,
                humidity,
                apparentTemperature: curr.feelslike,
                description: curr.weather_descriptions[0]
            })
        }
    })
}

export { forecast }