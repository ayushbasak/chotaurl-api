# ChotaURL-api
***
### Rest API for url shortening / obfuscation and pastebin clone

## Installation

* run `$ npm install`
* create a `.env` file and add
    `DB_URI=<your postgres database uri>`
* run **schema.sql** to create tables for your database

You can get away by not integrating **Auth0**.

### Usage
If using localmachine, use [localhost](http://localhost:5000/)
    otherwise use [ctlnk](https://ctlnk.herokuapp.com)

1.  #### URL Shortener / obfuscator 

* `GET https://ctlnk.herokuapp.com/q/<shortened url id>`
* `POST https://ctlnk.herokuapp.com/q/`
```js
    {
      url: '<URL to be shortened>',
      flavor: '<your endpoint name>' [optional]
    }
```

2. #### Pastebin Clone
* `GET https://ctlnk.herokuapp.com/p/<id>`
* `POST https://ctlnk.herokuapp.com/p/`

```js
    {
        title: '<title of content>',
        content: '<your content>',
        language: '<programming language if any>' [optional]
    }
```


### ErrorIds
* 1 ERROR_CREATION
* 2 ERROR_INVALID_URL
* 3 ERROR_AUTHENTICATION [Admin Authentication]
* 4 ERROR_INVALID_USER

#### My deployed version

[site](https://chotaurl.vercel.app) | [github](https://github.com/ayushbasak/chotaurl)

License: [ [MIT](LICENSE) ]