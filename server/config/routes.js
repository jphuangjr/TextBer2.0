//var linksController = require('../links/linkController.js');
//var userController = require('../users/userController.js');
var helpers = require('./helpers.js'); // our custom middleware
var passport = require("passport");
var request = require("request");

module.exports = function (app, express) {

    app.get('/auth/uber',
        passport.authenticate('uber'));

    app.get('/auth/uber/callback',
        passport.authenticate('uber', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });





    //app.get('/:code', linksController.navToLink);
    //
    //app.post('/api/users/signin', userController.signin);
    //app.post('/api/users/signup', userController.signup);
    //app.get('/api/users/signedin', userController.checkAuth);

    // authentication middleware used to decode token and made available on the request
    // app.use('/api/links', helpers.decode);
    //app.get('/api/links/', linksController.allLinks);
    //app.post('/api/links/', linksController.newLink);
    // app.post("/api/link/nav/", linksController.navToLink);


    // If a request is sent somewhere other than the routes above,
    // send it through our custom error handler
    app.use(helpers.errorLogger);
    app.use(helpers.errorHandler);
};

