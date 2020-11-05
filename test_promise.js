const fetch = require('node-fetch');
const withQuery = require('with-query').default;
const md5 = require('md5');

const publicKey = 'da0b209fa7cec1222a37bd011d1e329c';
const privateKey = '8582a2b0809a713ded125453cfdd2fc600012a63';

const baseUrl = 'https://gateway.marvel.com:443/v1/public/';
const marvelCharacter = process.argv[2];

let ts = (new Date()).getTime()
const preHash = `${ts}${privateKey}${publicKey}`
const hash = md5(preHash)

let url = withQuery(baseUrl + `characters`, {
    ts, hash, 
    apikey: publicKey, 
    nameStartsWith: marvelCharacter
})

fetch(url)
    .then(result => result.json())
    .then(result => {

        if (result.data.count <= 0)
            return Promise.reject('Not found')
        
        const charId = result.data.results[0].id;
        let ts = (new Date()).getTime();
        const preHash = `${ts}${privateKey}${publicKey}`
        const hash = md5(preHash)
    
        let url = withQuery(baseUrl + `characters/${charId}`, {
            ts, hash,
            apikey: publicKey
        })

        return fetch(url)
    })
    .then(result => result.json())
    .then(result => {
        console.log(result.data.results[0]);
    })
    .catch(e => console.error(e));