const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.CLIENT_SECRET,
    baseURL: 'https://ctlnk.herokuapp.com',
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: 'https://ayushbasak.us.auth0.com'
  };

module.exports = {auth0: auth, config_auth0: config}