# ChotaURL-api
***
## URL shortener / obfuscater API

### Installation

* run `$ npm install`
* create a `.env` file and add
    `DB_URI=<your postgres database uri>`
* run **schema.sql** to create tables for your database

### Usage
If using localmachine, use [localhost](http://localhost:5000/)
    otherwise use [ctlnk](https://ctlnk.herokuapp.com)

* `GET https://ctlnk.herokuapp.com/q/<shortened url id>`
* `POST https://ctlnk.herokuapp.com/`
```
    {
      url: '<URL to be shortened>'
    }
```

[MIT](LICENSE)