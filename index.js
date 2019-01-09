let express = require('express');
let app = express();
var port = process.env.PORT || 8080;


if (process.env.NODE_ENV !== 'production') {
    var dotenv = require('dotenv').load();
}

app.get('/', (req, res) => res.send('api'));
app.listen(port, function () {
    console.log("Running attendance API on port " + port);
});


setInterval(function() {
    http.get("https://attendanceapp-api.herokuapp.com/");
    var d = new Date();
    console.log("Keep-alive: " + d.getMonth() + "/" +d.getDate() + " | " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
}, 900000); 
