// 'express' exposes a single function rather than an object
// Call it to create an 'express application'

import path from 'path'
import express from 'express'
import hbs from 'hbs'
import { geocode } from './utils/geocode.js'
import { forecast } from './utils/forecast.js'

var __dirname = path.resolve()
// console.log(__dirname)
// console.log(__filename)
// console.log(path.join(__dirname, '/public'))


// Doesn't take any arguments
// We can configure our server using various methods on 'app' now
const app = express()
// Heroku will provide us with a unique port dynamically to run our app
// via an environment variable (a key value pair, here set-up by Heroku, at the OS level)
const port = process.env.PORT || 3000 // default/local value: 3000

// Define Paths for Express config
const publicDirPath = path.join(__dirname, '/public')
const viewsPath = path.join(__dirname, '/templates/views')
const partialsPath = path.join(__dirname, '/templates/partials')


// Set-up handlebars engine and views location
app.set('view engine', 'hbs') // app.set() -> set a value for a given Express Setting
// param1: key -> setting name, param2: value
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Serve up static directory
app.use(express.static(publicDirPath)) // app.use() -> Customize the server

// What the server should do when a user tries to access the URL
/* app.get('', (req, res) => { // callback() => param 1: obj containing info about the incoming req, param 2: read from database/HTML/JSON

    // res.send('Hello Express!') // Send back
    res.send('<h1>Weather</h1>') // HTML

})*/ // get() => param 1: route, param 2: callback func -> what to do/execute/send back if someone requests for the specific page

// app.com -> root
// app.com/help -> route
// app.com/about -> route

/* app.get('/help', (req, res) => {
    
    // res.send('Help Page')
    res.send({
        name: 'Sayantan',
        age: 21
    })
    // Express detects if we have provided an object, and stringifies it before rendering JSON
    // Can also be an Array of Objects
}) */

/* app.get('/about', (req, res) => {
    res.send('<h1>About Page</h1>')
}) */

// Home Page using hbs
app.get('', (req, res) => {
    
    // Instead of 'send' to send back data, we use 'render' to render one of our views
    res.render('index', {
        title: 'Weather',
        name: 'Sayantan Biswas'
    }) // No file extension
})

// About Page using hbs
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Sayantan Biswas'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'Welcome to the Help Page',
        name: 'Sayantan Biswas'
    })
})

app.get('/weather', (req, res) => {

    if (!req.query.address) {
        return res.send({
            error: 'Address must be provided',
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({
                error: error,
            })
        }

        forecast(latitude, longitude, (error, response = {}) => {
            if(error) {
                return res.send({
                    error: error
                })
            }

            res.send({
                temp: response.temperature,
                precip: response.precip,
                desc: response.description,
                humid: response.humidity,
                appTemp: response.apparentTemperature,
                location
            })
        })

    })
})

app.get('/products', (req, res) => {
    // query -> object
    // query string -> key-value pairs
    // can be accessed through the query object
    // console.log(req.query.search)

    if (!req.query.search) { // To make 'search' mandatory in query string
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

// Error Handling 404 Page
// Express keeps finding for 'matching route handlers' IN ORDER
// ' Wildcard Character' -> '*' for ALL except the ones ALREADY listed

// For help 404s
app.get('/help/*', (req, res) => {
    res.render('error', {
        title: 'Error: 404',
        name: 'Sayantan Biswas',
        errorMsg: 'Help article not found.'
    })
})

// For any 404s
app.get('*', (req, res) => {
    res.render('error', {
        title: 'Error: 404',
        name: 'Sayantan Biswas',
        errorMsg: 'Page not found.'
    })
})

// To start up the server
app.listen(port, () => {
    console.log('Server is up on port ' + port)
}) // port for local development env -> localhost:3000

// Handlebars Templating Engine
/*********** To dynamically serve data from our server, we use a templating engine
// Handlebars is a low-level templating module for JS
// We use hbs -> a plug-in for Express.js to implement handlebars 
// hbs files -> html files with features to inject dynamic value
// Instead of being served as a static html file, we use hbs to render it using express to serve it up to the user
***********/