var express = require("express");
var mongoose = require("mongoose");
var port = process.env.PORT || 8000;

/////////////////////////////////////////////////
var databaseName = "temp" /*Database Name HERE*/
////////////////////////////////////////////////

var app = express();

// connect to mongo database named in databaseName
//mongoose.connect('mongodb://localhost/'+ databaseName);

// configure our server with all the middleware and routing
require('./server/config/middleware.js')(app, express);
require('./server/config/routes.js')(app, express);

app.listen(port, function(){
    console.log("******* SERVER STARTED: Listening on port " + port + " *******")
});

module.exports = app;