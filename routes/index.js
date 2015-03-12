var express = require('express');
var session = require('express-session');

var httpAdapter = require('http');
var https = require('https');

var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var router = express.Router();
var url = require('url');
var mysql = require('mysql');
var geolocation = require('geolocation');
var jquery = require('jquery');

var api = require('../modules/api.js');
var sql = require('../modules/sql.js');

//session variable
var sess;
var lat;
var lng;

//mysql connection

var connection = mysql.createConnection({
    user     : 'root',
    password : 'root',
    host     : 'localhost',
    port: '8889',
    database : 'asl_node'
});

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index',{title: 'Home | Mountain Reports',
        classname: 'home',
        header: 'header',
        page: 'home',
        lat: lat,
        lng: lng,
        data: sess
        });

});

//SQL Queries
//Login Form 
router.get('/loginForm',function(req,res){

    res.render('login',{title: 'User Login',
        classname: 'search',
        page: 'login',
        header: 'header',
        data: sess
    });

});

//Add New User
router.post('/addUser',function(req,res){

    emailInput = req.body.email;
    usernameInput = req.body.username;
    passwordInput = req.body.password;

    var post = {email:emailInput,username:usernameInput,password:passwordInput};
    var statement = 'insert into users set?';
    if(emailInput && usernameInput && passwordInput){
        var query = connection.query(statement,post,function(err,result){});
        res.redirect('/');
    } else {
        res.redirect('/');
    }
    console.log(query.sql);
});

//Checking User
router.post('/checkUser',function(req,res){
 
    sess = req.session;

    var user = req.body.username;
    var pass = req.body.password;
    if(user == '' && pass == ''){
        res.redirect('/loginForm');
    } else {
        var statement = 'select * from users where username = ? and password = ?';
        var query = connection.query(statement,[user,pass], function(err,rows,fields){
            if(err) throw err;
            console.log('Id: '+rows[0].id);
            console.log('username: '+rows[0].username);

            sess.id = rows[0].id;
            sess.email = rows[0].email;
            sess.username = rows[0].username;
            res.redirect('/');
        });
    }
});

//check user profile session
router.get('/profile',function(req,res){
    if(sess){
        var username = sess.username;
        sql.favorites(username,function(favs){
            var name = [];
            var triplet = [];
            var elevation = [];

            favs.forEach(function(item){
                name = name.concat(item.name);
                triplet = triplet.concat(item.triplet);
                elevation = elevation.concat(item.elevation);
            });//end favs foreach

            sql.ratings(username,function(ratings){
                var rName = [];
                var rTriplet = [];
                var rElevation = [];

                ratings.forEach(function(i){
                    rName = rName.concat(i.name);
                    rTriplet = rTriplet.concat(i.triplet);
                    rElevation = rElevation.concat(i.elevation);
                });//end ratings for each

                res.render('user',
                {   
                    title: 'User Profile',
                    classname: 'user',
                    page: 'user',
                    header: 'header',
                    favs: favs,
                    name: name,
                    triplet: triplet,
                    elevation: elevation,
                    ratings: ratings,
                    rName: rName,
                    rTriplet: rTriplet,
                    rElevation: rElevation,
                    data: sess
                });//end render   
            });//end ratings
        });//end favorites
    }//end if
       else {
        res.redirect('/');
    }//end else
  
});

//end session & log user out
router.get('/logout',function(req,res){

    sess = null;
    res.redirect('/');

});

//gets the coordinates from the browser
var coordinates = router.post('/coordinates',function(req,res){
    var obj = req.body;
    console.log(obj);
    lat = obj.lat;
    lng = obj.lng;
    res.redirect('/searchResults');
});

//swap out lat and long from geolocation to get complete functionality
router.get('/searchResults',function(req,res){
        
    api.powderLinesClosest(lat,lng,function(results){
        var stations = [];
        var name = [];
        var triplet = [];
        var elevation = [];

        for(var i=0;i<results.length;i++){
            stations.push(results[i].station_information);   
        }//end for

        stations.forEach(function(item){
            name = name.concat(item.name);
            triplet = triplet.concat(item.triplet);
            elevation = elevation.concat(item.elevation);
        });

        res.render('results',
        {   title: 'Nearest Mountains',
            page: 'results',
            header: 'header',
            results: results,
            stations: stations,
            name : name,
            triplet: triplet,
            elevation : elevation,
            data: sess
        });//end res.render

    });//end powderLinesAPI

});//end router.get

//individual page
var triplet;

//weather call with lat and long from station info
//flickr call with name of station
router.get('/mountain/:triplet',function(req,res){
    triplet = req.params.triplet;

    router.post('/addFavorite',function(req,res){
        username = sess.username;
        console.log(triplet+' '+username);

        var post = {triplet:triplet,username:username};
        var statement = 'insert into favorites set?';
        var query = connection.query(statement,post,function(err,callback){});
        
        console.log(query.sql);
        res.redirect('/searchResults');
    });// end add favorite

    router.post('/rate',function(req,res){
        username = sess.username;
        rating = req.body.rating;
        console.log(triplet+' '+username+' '+rating);

        var post = {triplet:triplet,username:username,rating:rating};
        var statement = 'insert into ratings set?';
        var query = connection.query(statement,post,function(err,callback){});
        
        console.log(query.sql);
        res.redirect('/searchResults');
    });// end rate

    api.powderLinesStation(triplet,function(results){
        var station = [];
        var conditions = [];
        var name = [];
        lat = [];
        lng = [];
        var rTriplet = [];
        var elevation = [];
        var rElevation = [];
        var farmId;
        var server;
        var photoSecret;
        var photoId;

        station.push(results.station_information); 
        
        for(var i=0;i<results.data.length;i++){
            conditions.push(results.data[i])
        }

        station.forEach(function(item){
            if(item.triplet == req.params.triplet){
                station.push(item);
                name = name.concat(item.name);
                elevation = elevation.concat(item.elevation);
                lat = lat.concat(item.location.lat);
                lng = lng.concat(item.location.lng);
            }
        });//end station foreach
        conditions.forEach(function(item){
            if(item.triplet == req.params.triplet){
                conditions.push(item);
            }
        });//end conditions foreach

        api.weatherCall(lat,lng,function(weather){
            var city = weather.location.city;
            var state = weather.location.state;
            var location = city+', '+state;

            var temp = weather.current_observation.temp_f;
            var windchill = weather.current_observation.windchill_f;
            var humidity = weather.current_observation.relative_humidity;

            api.flickrCall(lat,lng,function(photos){

                res.render('mountain',
                {   title: 'Mountain Info',
                    page: 'mountain',
                    header: 'header',
                    results: results,
                    station: station,
                    photos: photos,
                    conditions: conditions,
                    name: name,
                    weather: weather,
                    city: city,
                    state: state,
                    location: location,
                    temp: temp,
                    windchill: windchill,
                    humidity: humidity,
                    lat: lat,
                    lng: lng,
                    triplet: triplet,
                    elevation : elevation,
                    data: sess
                });//end res render
            });//end flickr api call
        });// end weather api call    
    });///end powderlines station api call
});//end router.get

//sup
module.exports = router;