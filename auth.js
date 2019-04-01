let jwt = require('express-jwt');
const jwks = require('jwks-rsa');


const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 15,
        jwksUri: "https://rollcall-app.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://rollcall-api.herokuapp.com',
    issuer: "https://rollcall-app.auth0.com/",
    algorithms: ['RS256']
});

module.exports = {
    authCheck: this.authCheck
};