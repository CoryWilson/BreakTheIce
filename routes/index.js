var express = require('express');
var session = require('express-session');

var httpAdapter = require('http');
var https = require('https');

var request = require('request');
var bodyParser = require('body-parser');
var router = express.Router();
var url = require('url');
var mysql = require('mysql');
//var liftie = require('liftie');
var geolocation = require('geolocation');
var Flickr = require("flickrapi");
var najax = require('najax');

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
router.post('/coordinates',function(req,res){

    var obj = req.body; 
    var lat = obj.lat;
    var long = obj.long;
    console.log(lat+', '+long);

//     //var obj = {}
//     // res.render('coordinates',
//     // {
//     //     title: 'Coordinates',
//     //     page: 'coordinates',
//     //     coordinates: req.body
//     // });
});

// router.post('/searchResults',function(req,res){
//     // var obj = req.body; 
//     // var lat = obj.lat;
//     // var long = obj.long;
//     // console.log(lat+', '+long);

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


//swap out lat and long from geolocation to get complete functionality
router.get('/searchResults',function(req,res){
    var powderLinesAPI = 'http://api.powderlin.es/closest_stations?lat=47.3974&lng=-121.3958&data=true&days=10&count=10';
    request(powderLinesAPI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = JSON.parse(body);
            // var stations = [];
            // var name = [];
            // var elevation = [];

            // stations = results[0].station_information;
            // console.log(stations);
            // results[0].station_information.forEach(function(item){
            //     name = name.concat(item.name);
            //     elevation = elevation.concat(item.elevation);
            // });

                res.render('searchResults',
                {   title: 'Nearest Mountains',
                    page: 'results',
                    header: 'header',
                    results: results,
                    // name : name,
                    // elevation : elevation,
                    data: sess
                });
        }

    });
});

//individual page
router.post('/mountain/station/:triplet',function(req,res){
    var plAPI = 'http://api.powderlin.es/station/672:WA:SNTL?days=20';
    request(plAPI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = JSON.parse(body);
            // var stations = [];
            // var name = [];
            // stations = results.station_information;
            // results.station_information.forEach(function(item){
            //     if(item.triplet == req.params.triplet){
            //         stations.push(item);
            //         name = stations.concat(item.name);
            //     }
                
            // });
            //<%= results[i].station_information.triplet %>
            res.render('mountain',
            {   
                title: 'Mountain Info',
                classname: 'mountain',
                page: 'mountain',
                results: results,
                data: sess
                // name: name,
                // stations: stations
            });
        }

    });


});

// router.get('/test',function(req,res){
//     geocoder.geocode('29 champs elysée paris')
//         .then(function(res) {
//             console.log(res);
//         })
//         .catch(function(err) {
//             console.log(err);
//         });

// });

module.exports = router;

