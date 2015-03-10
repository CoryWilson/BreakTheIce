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
//var liftie = require('liftie');
var geolocation = require('geolocation');
var Flickr = require("flickrapi");

var jquery = require('jquery');
//flickrOptions = {
//    api_key: "2bc3ab2e5a635e060d20407bbea8c084",
//    secret: "41a710fd1e55ba6b"
//};
//
//Flickr.authenticate(flickrOptions, function(error, flickr) {
//
//});


//global session variable
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

        var statement = 'select * from users where username = ? and password = ?';
        var query = connection.query(statement,[user,pass], function(err,rows,fields){
            if(err) throw err;
                  console.log(rows);
                  console.log('Id: '+rows[0].id);
                  console.log('username: '+rows[0].username);
                  
                  sess.id = rows[0].id;
                  sess.email = rows[0].email;
                  sess.username = rows[0].username;
                  //sess.password = rows[0].password;

                  // console.log('Session Id: '+sess.id);
                  // console.log('Session Email: '+sess.email);
                  // console.log('Session Username: '+sess.username);
                  //console.log('Session Password: '+sess.password);
                  res.render('user',
                    {   
                        title: 'User Profile',
                        classname: 'user',
                        page: 'user',
                        header: 'header',
                        data: sess
                    });
        });

    
    // } else {
    //     res.redirect('/loginForm');
    // }
});

//check user profile session
router.get('/profile',function(req,res){
    if(sess){
      res.render('user',
            {   
                title: 'User Profile',
                classname: 'user',
                page: 'user',
                header: 'header',
                data: sess
            });
    } else {
        res.redirect('/');
    }
  
});

//end session & log user out
router.get('/logout',function(req,res){

    sess = null;
    res.redirect('/');

});


// router.get('/locationSearch',function(req,res){

//     geocoder.geocode('29 champs elysée paris', function(err, res){
//         console.log(res);

//     });
// });


// router.get('/locate',function(req,res){

//   navigator.geolocation.getCurrentPosition(function (err, position) {
//         if (err) throw err
//         console.log(position)

//       })
// });

//var geocoderProvider = 'google';
//var extra = {
//     apiKey: 'AIzaSyCeCU2QmSLPuQyTckS0K-bzbHtC8sIcziM',
//     formatter: null
//};
//var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);
//
//geocoder.geocode('29 champs elysée paris', function(err, res) {
//     console.log(res);
// });
// router.post('/url',function(req,res){
//     var googleApi = 'AIzaSyCeCU2QmSLPuQyTckS0K-bzbHtC8sIcziM';
//     var geo = 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyA9RhkovjIJCLh0mo6EaXIuWzx8LhF0Hlk';
    
//     request(geo, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             var results = JSON.parse(body);
//                 res.render('searchResults',
//                 {   title: 'Nearest Mountains',
//                     page: 'Results',
//                     results: results
//                 });
//             console.log(results);
//         }

//     });
// });
//});

//works grabs coordinates from browser through ajax call

// router.post('/searchResults',function(req,res){
    // var obj = req.body; 
    // var lat = obj.lat;
    // var long = obj.long;
    // console.log(lat+', '+long);

//     najax('/coordinates',
//     { type:'POST' }, 
//     function(html){ 
//         console.log(html); 
//     })

// var powderLinesAPI = 'http://api.powderlin.es/closest_stations?lat='+lat+'&lng='+long+'&data=true&days=10&count=10';
//     request(powderLinesAPI, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             var results = JSON.parse(body);
//                 res.render('searchResults',
//                 {   title: 'Nearest Mountains',
//                     page: 'Results',
//                     results: results
//                 });
//         }

//     });
// });

var coordinates = router.post('/coordinates',function(req,res){
    var obj = req.body;
    lat = obj.lat;
    lng = obj.lng;
    res.redirect('/searchResults');
});

//swap out lat and long from geolocation to get complete functionality
router.get('/searchResults',function(req,res){
    var powderLinesAPI = 'http://api.powderlin.es/closest_stations?lat='+lat+'&lng='+lng+'&data=true&days=0&count=5';
    request(powderLinesAPI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = JSON.parse(body);
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
            });//end stations foreach

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
        }//end if
    });//end request
});//end router.get

//individual page

//weather call with lat and long from station info
//flickr call with name of station

router.get('/mountain/:triplet',function(req,res){
    var plAPI = 'http://api.powderlin.es/station/'+req.params.triplet;
    console.log(plAPI);

    request(plAPI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = JSON.parse(body);
            var station = [];
            var conditions = [];
            var name = [];
            var lat = [];
            var lng = [];
            var triplet = [];
            var elevation = [];

            station.push(results.station_information); 
            
            for(var i=0;i<results.data.length;i++){
                conditions.push(results.data[i])
            }

            station.forEach(function(item){
                if(item.triplet == req.params.triplet){
                    station.push(item);
                    name = name.concat(item.name);
                    triplet = triplet.concat(item.triplet);
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

            //weather underground api call by lat & long
            var wAPI = 'http://api.wunderground.com/api/9223f36975c7d646/geolookup/q/'+lat+','+lng+'.json';
            console.log(wAPI);

            var weatherReq = request(wAPI, function(e,r,b){
                if(!e && r.statusCode == 200){
                    var weather = JSON.parse(b);
                    // var weather = [];
                    // //console.log(weatherJSON);
                    // weather.push(weatherJSON.location);
                    // console.log(weather);
                    var city = weather.location.city;
                }
            });

            res.render('mountain',
            {   title: 'Mountain Info',
                page: 'mountain',
                header: 'header',
                results: results,
                station: station,
                conditions: conditions,
                name: name,
                // weather: weather,
                // city: city,
                lat: lat,
                lng: lng,
                triplet: triplet,
                elevation : elevation,
                data: sess
            });//end res render
        }//end if !error
    });//end request
});//end router.get

module.exports = router;