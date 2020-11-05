//load libraries
const express = require('express');
const handlebars = require('express-handlebars');
const fetch = require('node-fetch');
const withQuery = require('with-query').default;
const md5 = require('md5');

// configure environment
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

// configure for Marvel API
const PUBLIC = process.env.PUBLIC;
const PRIVATE = process.env.PRIVATE;
const baseUrl = 'https://gateway.marvel.com:443/v1/public/';

// create express instance
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configure handlebars
app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs');

// configure routes
app.get('/', (req, res) => {
    res.status(200)
    res.type('text/html')
    res.render('index')
})

app.get('/list', (req, res) => {

    let ts = (new Date()).getTime()
    const preHash = `${ts}${PRIVATE}${PUBLIC}`
    const hash = md5(preHash)

    let url = withQuery(baseUrl + `characters`, {
        ts, hash,
        apikey: PUBLIC, 
        nameStartsWith: req.query.charName
    })

    fetch(url)
        .then(res => res.json())
        .then(json => {

            if (json.code != 200) {
                console.log(`Error code ${json.code} : ${json.status}`);
                return Promise.reject();
            }

            if (json.data.count <= 0) {
                // return Promise.reject('Not found');
                res.status(404)
                res.type('text/html')
                res.render('error', {
                    name : req.query.charName
                })
            }

            const recs = json.data.results

            res.status(200)
            res.type('text/html')
            res.render('list', {
                recs, 
                name : req.query.charName
            })
        })
        .catch(e => console.error(e));

})

app.get('/details/:id', (req, res) => {

    charId = req.params['id'];

    let ts = (new Date()).getTime()
    const preHash = `${ts}${PRIVATE}${PUBLIC}`
    const hash = md5(preHash)

    let url = withQuery(baseUrl + 'characters/' + charId , {
        ts, hash, 
        apikey: PUBLIC
    })

    fetch(url)
        .then(res => res.json())
        .then(json => {

            if (json.code != 200) {
                console.log(`Error code ${json.code} : ${json.status}`);
                return Promise.reject();
            }

            if (json.data.count <= 0) {
                res.status(404)
                res.type('text/html')
                res.render('error')
            }

            const recs = json.data.results[0];
            const extUrl = recs.urls[0].url;

            // res.redirect(extUrl);

            res.status(200)
            res.type('text/html')
            res.render('detail', {
                thumbnail: recs.thumbnail,
                name: recs.name,
                url: recs.urls[0]
            })
        })
        .catch(e => console.error(e));

})

// load static resources 
app.use(express.static(__dirname + '/public'));


// start the app
app.listen(PORT, () => {
    console.log(`Application started on PORT: ${PORT} at ${new Date()}`);
})
