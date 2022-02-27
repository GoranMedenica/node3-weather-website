// EXPRESS

// (koristeci Node server mozemo 'servirati' sve sto nasoj app treba 
// --> da li je to webserver --> website i svi potrebni assets-i (html, css, images, client side JS...)
// ili recimo http json based API)

const path = require('path'); // core module
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// generate app
const app = express();

// process.env.PORT will exist only on Heroku, locally we will use 3000
const port = process.env.PORT || 3000;

// console.log(__dirname); // absolutni path direktorijuma u kom se ovaj fajl nalazi
// console.log(__filename); // absolutni path ovog fajla

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// *****from a static file*****
// customize server, configure our express app
// put all static assets that our app will serve
// servirace index.html kada odemo na root nase app --> u <head> tagu dodati/povezati css + js
// !!! morao sam da obrisem index.html iz public foldera, da bi mogao da ucita index.hbs umesto njega
// Setup static directory to serve !!!
app.use(express.static(publicDirectoryPath));
// **********

// *****DYNAMIC --> template engine hbs*****
// render dynamic pages using express (handlebars plugin for express)

// set handlebars engine
app.set('view engine', 'hbs');
// set custom folder for templates (set view location)
// --> sto znaci da ce defaultno traziti hbs fajl u templates/views folderu a ne vise index.html u public folderu !!!
app.set('views', viewPath);
// register partials
hbs.registerPartials(partialsPath);
// **********

// ***** response as HTML, JSON or plain text*****
// app.com --> send some HTML
// app.get('', (req, res) => {
//     // ako neko napravi request iz koda --> request library ili ako neko posalje request iz browsera
//     res.send('<h1>Hello express!</h1>') // html
// })

// app.com/help --> send some JSON back
// app.get('/help', (req, res) => {
//     res.send({
//         name: 'Goran',
//         age: 34
//     })
//     // json --> express is automatically stringify it
// })

// app.com/weather
// app.get('/weather', (req, res) => {
//     res.send('Weather page')
// })
// **********

//  *****za renderovanje dinamickog sadrzaja*****
// ***** SERVER RENDERED pages *****
app.get('', (req, res) => {
    res.render('index', {
        title: 'Handlebars root view',
        content: 'Home page content',
        name: 'Me'
    }); // samo naziv viewa,bez ekstenzije
    // drugi argument je objekat sa podacima koji ce biti dostupni u view-u
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        content: 'About content',
        name: 'Me'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        content: 'Help content',
        name: 'Me'
    })
})

app.get('/products', (req, res) => {
    // query string --> '?search=games&rating=5'
    if(!req.query.search) { // recimo da je search param neophodan
        return res.send({
            error: 'You must provide search term'
        })
    }

    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            console.log(forecastData)
            res.render('weather', {
                title: 'Weather',
                location,
                forecast: forecastData,
                address: req.query.address,
                name: 'Me'
            })
        })
    })
})

// samo API (JSON http endpoint)
app.get('/weather-api', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                title: 'Weather',
                location,
                forecast: forecastData,
                address: req.query.address,
                name: 'Me'
            })
        })
    })
})
//////////

app.get('/help/*', (req, res) => {
    res.render('not-found', {
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('not-found', {
        errorMessage: 'Page not found'
    });
})
// **********

// start app and listen to specific port
// 3000 is common for development port (different will be used for Heroku)
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})

// ***** Nodemon *****
// 'nodemon src/app.js -e js,hbs' --> nodemon ce pratiti promene i na js i na hbs fajlovima
// **********