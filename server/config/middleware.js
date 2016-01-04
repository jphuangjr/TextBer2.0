var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport = require("passport");
var UberStrategy = require("passport-uber").Strategy
var auth = require('../../client/auth/authentification');


// Middleware can be thought of as a magical pipe that water flows through.
// Each drop of water starts at the top opening of the pipe. As it falls through,
// a magic spell is cast on it, and then it is spit out the bottom of the pipe
// where another magical pipe could be waiting for it.

// The water in this example is Express's `request` object, and the magical spell
// is just a function passed to `app.use`. Any function passed into `app.use`
// will get run on every single request that your server receives

// The order of middleware is defined matters quite a bit! Requests flow through
// middleware functions in the order they are defined. This is useful because
// many times  middleware function is responsible for modifying the `request`
// object in some way so that the next middleware function (or route handler)
// has access to whatever the previous one just did.

// Middleware is useful when you want to do something for every request
// that hits your server. Logging and parsing are two operations
// commonly found in a middleware stack.

module.exports = function (app, express) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));
  passport.use(new UberStrategy({
        clientID: auth.clientID,
        clientSecret: auth.clientSecret,
        callbackURL: "http://localhost:8000/auth/uber/callback",
        scope: "request"

      },
      function(accessToken, refreshToken, profile, done){

      }))
};

