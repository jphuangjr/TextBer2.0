//var linksController = require('../links/linkController.js');
//var userController = require('../users/userController.js');
var helpers = require('./helpers.js'); // our custom middleware
var passport = require("passport");
var request = require("request");
var auth = require("../../client/auth/authentification")
var session = require("express-session");



module.exports = function (app, express) {

    app.use(session({
        secret: "false"
    }));

    app.get('/auth/uber',
        passport.authenticate('uber'));

    app.get('/auth/uber/callback',
        passport.authenticate('uber', { failureRedirect: '/' }),
        function(req, res) {
            console.log(">>>>>>>>>>>>>> CALLBACK REQ", req.user)
            auth.accessToken = req.user.accessToken
            // Successful authentication, redirect home.

            res.redirect('/#/loggedIn');
        });

    app.get("/uberRide", function(req, res){
        console.log(">>>>>>>> Server Token",auth.serverToken)

        request({
            method: "GET",
            url: "https://sandbox-api.uber.com/v1/estimates/price",
            headers: {
                Authorization: "Token " + auth.serverToken
                //"Content-Type": "application/json"
            },
            form: {
                //server_token: auth.serverToken,
                start_latitude: 37.471,
                start_longitude: -122.2433,
                end_latitude: 37.7856394,
                end_longitude: -122.4103922
            }
        }, function(err, res, body){
            console.log(">>>>>>>>>>> POST REPONSE", body)
        })
    })

    app.get("loggedIn", function(){

    })





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

