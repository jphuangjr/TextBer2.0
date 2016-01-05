//var linksController = require('../links/linkController.js');
//var userController = require('../users/userController.js');
var helpers = require('./helpers.js'); // our custom middleware
var passport = require("passport");
var request = require("request");
var auth = require("../../client/auth/authentification")
var session = require("express-session");
var accountSid = 'AC929473a2cb1685807ff13435f9f96bf8';
var authToken = '2462ccc8b59727f001265af824ad1471';
var client = require('twilio')(accountSid, authToken)
var geocodeProvider = 'google';
var httpAdapter = 'https';
var extra = {
    apiKey: "",
    formatter: null
};
var geocoder = require('node-geocoder')(geocodeProvider, httpAdapter, extra);



module.exports = function (app, express) {

    app.use(session({
        secret: "false"
    }));

    app.get('/', function (request, response) {
        response.render('index');
    });
    app.get('/auth/uber',
        passport.authenticate('uber'));

    app.get('/auth/uber/callback',
        passport.authenticate('uber', { failureRedirect: '/' }),
        function(req, res) {
            console.log(">>>>>>>>>>>>>> CALLBACK REQ", req.user)
            auth.accessToken = req.user.accessToken
            // Successful authentication, redirect home.
            //req.user = JSON.parse(req.user)
            client.messages.create({
                to: "+16502834692",
                from: "+16506145695",
                body: "~ Textber ~   Welcome to Textber: " + req.user.first_name + " " + req.user.last_name +". You are now logged in with Uber Account: "+ req.user.email +" and your Promo Code is: " + req.user.promo_code +" :)",
                mediaUrl: "https://pbs.twimg.com/profile_images/443257735333675008/3oQBTiKh.jpeg"
            }, function(err, message) {
                console.log(message.sid);
            });

            res.redirect('/#/loggedIn');
        });

    app.post("/getPrices", function(req, res){
        console.log(req.body);
        var trip = [];
        var address1 = req.body.addy1 /*"948 Market Street, San Fransisco"*/;
        var address2 = req.body.addy2 /*"1455 Market Street, San Fransisco"*/;


        geocoder.geocode(address1, function(err, res){
            console.log("geocode")
            trip.push({lat: res[0].latitude, long: res[0].longitude});
            geocoder.geocode(address2, function(err,res){
                trip.push({lat: res[0].latitude, long: res[0].longitude})
                console.log(trip)
                request({
                    method: "GET",
                    url: "https://sandbox-api.uber.com/v1/estimates/price",
                    headers: {
                        Authorization: "Token " + auth.serverToken
                        //"Content-Type": "application/json"
                    },
                    form: {
                        //server_token: auth.serverToken,
                        start_latitude: trip[0].lat,
                        start_longitude: trip[0].long,
                        end_latitude: trip[1].lat,
                        end_longitude: trip[0].long
                    }
                }, function(err, res, body){

                    body = JSON.parse(body);
                    //console.log(">>>>>>>>>>> POST RESPONSE", body.prices[0])
                    client.messages.create({
                        to: "+16502834692",
                        from: "+16506145695",
                        body: "~ Textber ~   Price Estimate: " + body.prices[0].estimate + " || Distance: " +body.prices[0].distance +"mi || Service type: " + body.prices[0].display_name
                    }, function(err, message) {
                        console.log(message.sid);
                    });
                })
            })
        })
        console.log(">>>>>>>> Server Token",auth.serverToken)


    })

    app.post("/reqRide", function(req, res){
        console.log(">>>>>>>> Access Token",auth.accessToken)
        console.log(">>>>>>>> Access Token",auth.accessToken2)
        console.log(">>>>>>>> Server Token",auth.serverToken)
        var trip = [];
        var address1 = req.body.addy1 /*"948 Market Street, San Fransisco"*/;
        var address2 = req.body.addy2 /*"1455 Market Street, San Fransisco"*/;
        geocoder.geocode(address1, function(err, res){
            console.log("geocode")
            trip.push({lat: res[0].latitude, long: res[0].longitude});
            geocoder.geocode(address2, function(err,res){
                trip.push({lat: res[0].latitude, long: res[0].longitude})
                console.log(trip)

                request({
                    method: "POST",
                    url: "https://sandbox-api.uber.com/v1/requests",
                    headers: [{
                        name: "Content-Type", value : "application/json" },{
                        name: "Authorization", value: "Bearer " + auth.accessToken
                    }],
                    //headers : {
                    //  'Content-Type': "application/json",
                    //    'Authorization': "Bearer " + auth.accessToken
                    //},
                    form: {
                        //server_token: auth.serverToken,
                        product_id: "a1111c8c-c720-46c3-8534-2fcdd730040d",
                        start_latitude: 37.471,
                        start_longitude: -122.2433,
                        end_latitude: 37.7856394,
                        end_longitude: -122.4103922
                    }
                }, function(err, res, body){
                    console.log("made post req")

                    body = JSON.parse(body);
                    console.log(">>>>>>>>>>> POST RESPONSE", body.message)
                    client.messages.create({
                        to: "+16502834692",
                        from: "+16506145695",
                        body: "~ Textber ~    " + body
                    }, function(err, message) {
                        console.log(message.sid);
                    });
                })
            })
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




//
//curl -F 'client_secret=YOUR_CLIENT_SECRET' \
//-F 'client_id=cTs1o6JE06Qgb8_Qmyn2UEpn8Ea5XHKy' \
//-F 'grant_type=authorization_code' \
//-F 'redirect_uri=http://localhost:8000/auth/uber/callback' \
//-F 'code=oaQvq92uWCUVH4neSfiX7FAuqSKm6X' \
//https://login.uber.com/oauth/v2/token