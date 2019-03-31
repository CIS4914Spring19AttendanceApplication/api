let express = require('express');
let http = require('http');
let app = express();
let mongoose = require('mongoose');
let cors = require('cors');
let jwt = require('express-jwt');
const jwks = require('jwks-rsa');
var port = process.env.PORT || 8080;


app.use(express.json());
app.use(cors());


let eventRouter = require("./routes/event-route");
let userRouter = require("./routes/user-route");
let orgRouter = require("./routes/organization-route");


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


if (process.env.NODE_ENV !== 'production') {
    var dotenv = require('dotenv').load();
}

app.use(authCheck);

mongoose.connect('mongodb://seniorproject:' + process.env.MONGO_PWD + '@ds253324.mlab.com:53324/heroku_r3cbzbjn', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

app.get('/', (req, res) => res.send(''));
app.listen(port, function () {
    // console.log("Running attendance API on port " + port);
});

app.use('/api/event', eventRouter);
app.use('/api/user', userRouter);
app.use('/api/org', orgRouter);


app.get('*', (req, res) => res.send(''));

setInterval(function() {
    http.get("http://rollcall-api.herokuapp.com");
    var d = new Date();
    console.log("Keep-alive: " + d.getMonth() + "/" +d.getDate() + " | " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
}, 60000); 


