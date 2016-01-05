var express = require("express");
var mongoose = require("mongoose");

/////////////////////////////////////////////////
var databaseName = "temp" /*Database Name HERE*/
////////////////////////////////////////////////

var app = express();
app.set('port', 8000);

// connect to mongo database named in databaseName
//mongoose.connect('mongodb://localhost/'+ databaseName);

// configure our server with all the middleware and routing
require('./server/config/middleware.js')(app, express);
require('./server/config/routes.js')(app, express);

app.listen(app.get('port'), function(){
    console.log("******* SERVER STARTED: Listening on port " + app.get('port') + " *******")
});

module.exports = app;