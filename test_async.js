const fetch = require('node-fetch');
const withQuery = require('with-query').default;
const md5 = require('md5');

const baseUrl = 'https://gateway.marvel.com:443/v1/public/';
const publicKey = 'da0b209fa7cec1222a37bd011d1e329c';
const privateKey = '8582a2b0809a713ded125453cfdd2fc600012a63';
const ts = (new Date()).toString();

const limit = 5;
const marvelCharacter = process.argv[2]

// const URL_getChars = baseUrl + 'characters';
// const URL_getComics = baseUrl + 'comics';

//Fetches lists of characters.
const charId = fetch(withQuery(baseUrl + 'characters', {
    ts : ts,
    apikey: publicKey,
    hash : md5(ts+privateKey+publicKey),
    limit,
    nameStartsWith: marvelCharacter
}))
.then(res => res.json())
.then(json => {

    if (json.code != 200) {
        console.log(`Error code ${json.code} : ${json.status}`);
        return -1;
    }

    console.log(json);

    console.log(`Fetch first ${limit} characters`);
    for (i=0; i<json.data.results.length; i++) {
        console.log(i+1,'>>> ',json.data.results[i].id,'>>> ',json.data.results[i].name);    
    }

    return parseInt(json.data.results[0].id);
})
.catch(e => console.error(e))

//Fetches a single character by id.
fetch(withQuery(baseUrl + 'characters/'+ charId, {
    ts : ts,
    apikey: publicKey,
    hash : md5(ts+privateKey+publicKey),
}))
.then(res => res.json())
.then(json => {

    if (json.code != 200) {
        console.log(`Error code ${json.code} : ${json.status}`);
        return;
    }
    
    console.log(`Fetch specific ${charId} characters`);
    console.log(1,'>>> ',json.data.results[0].name);    
})
.catch(e => console.error(e))






//Fetches lists of comics.
// fetch(withQuery(URL_getComics, {
//     ts : (new Date()).toString(),
//     apikey: publicKey,
//     hash : md5((new Date()).toString()+privateKey+publicKey),
//     limit
// }))
// .then(res => res.json())
// .then(json => {

//     if (json.code != 200) {
//         console.log(`Error code ${json.code} : ${json.status}`);
//         return;
//     }

//     console.log(`Fetch first ${limit} comics`);
//     for (i=0; i<json.data.results.length; i++) {
//         console.log(i+1,'>>> ',json.data.results[i].title);    
//     }
// })
// .catch(e => console.error(e))