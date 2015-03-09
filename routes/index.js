var httpAdapter = require('http');
var https = require('https');
var geocoderProvider = 'google';
var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var url = require('url');
var mysql = require('mysql');
var liftie = require('liftie');
var geolocation = require('geolocation');
var Flickr = require("flickrapi");
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


//flickrOptions = {
//    api_key: "2bc3ab2e5a635e060d20407bbea8c084",
//    secret: "41a710fd1e55ba6b"
//};
//
//Flickr.authenticate(flickrOptions, function(error, flickr) {
//
//});




var connection = mysql.createConnection({
    user     : 'root',
    password : 'root',
    host     : 'localhost',
    port: '8889',
    database : 'asl_node'
});



router.get('/locationSearch',function(req,res){

    geocoder.geocode('29 champs elysée paris', function(err, res){
        console.log(res);

    });
});


router.get('/locate',function(req,res){

  navigator.geolocation.getCurrentPosition(function (err, position) {
        if (err) throw err
        console.log(position)

      })
});

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index',{title: 'Home | Mountain Reports',
        classname: 'home',
        page: 'home'})

});



router.get('/searchResults',function(req,res){
    var powderLinesAPI = 'http://api.powderlin.es/closest_stations?lat=47.3974&lng=-121.3958&data=true&days=10&count=10';
    request(powderLinesAPI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = JSON.parse(body);
                res.render('searchResults',
                {   title: 'Nearest Mountains',
                    page: 'Results',
                    results: results
                });
        }

    });
});


router.get('/mountain',function(req,res){
    var plAPI = 'http://api.powderlin.es/station/791:WA:SNTL?start_date=2013-01-15&end_date=2013-01-15';
    request(plAPI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parsedJSON = JSON.parse(body);
            res.render('mountain',
            {   
                title: 'Mountain Info',
                classname: 'mountain',
                page: 'mountain',
                name: parsedJSON.station_information.name
            });
        }

    });


});


router.get('/loginForm',function(req,res){

    res.render('login',{title: 'Mountain Info',
        classname: 'search',
        page: 'login'});

});



router.post('/addUser',function(req,res){

    emailInput = req.body.email;
    usernameInput = req.body.username;
    passwordInput = req.body.password;

    var post = {email:emailInput,username:usernameInput,password:passwordInput};

    var query = connection.query('INSERT INTO users SET?',post,function(err,result){

    });

    console.log(query.sql);

    res.redirect('/');

});




router.post('/checkUsers',function(req,res){

    var user = req.body.username;
    var pass = req.body.password;


    var check = 'SELECT username from users where username = ? and password = ?';
    connection.query(check,[user,pass], function(err,rows,fields){
        if(err) throw err;
              console.log(rows);


    });
});



passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

router.post('/loginForm',
    passport.authenticate('local', { failureRedirect: '/loginForm' }),
    function(req, res) {
        res.redirect('/');
    });


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



//FB Login Credentials
// router.get('/fbLogin', function(req,res){

//     passport.use(new FacebookStrategy({
//         clientID: '623540344445376',
//         clientSecret: '673938d760b16c8d4c0d2f828d18b173',
//         callbackURL: "/"
//     },
//     function(accessToken, refreshToken, profile, done) {
//         User.findOrCreate(..., function(err, user) {
//             if (err) { return done(err); }
//             done(null, user);
//         });
//     }
//     ));

// });


module.exports = router;

