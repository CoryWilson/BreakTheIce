var httpAdapter = require('http');
var geocoderProvider = 'google';
var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var url = require('url');
var mysql      = require('mysql');
var liftie = require('liftie');
var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);



request('http://api.powderlin.es/station/791:WA:SNTL?start_date=2013-01-15&end_date=2013-01-15', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body); // Show the HTML for the Google homepage.
    }

});

var connection = mysql.createConnection({
    user     : 'root',
    password : 'root',
    host     : 'localhost',
    port: '8889',
    database : 'asl_node'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

router.get('/mountain',function(req,res){
    var plAPI = 'http://api.powderlin.es/station/791:WA:SNTL?start_date=2013-01-15&end_date=2013-01-15';
    request(plAPI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parsedJSON = JSON.parse(body);
            res.render('mountain',{title: 'Mountain Info',
                classname: 'mountain',
                page: 'mountain',
                name: parsedJSON.station_information.name

            });
        }

    });


});

router.get('/test',function(req,res){
    geocoder.geocode('29 champs elysée paris')
        .then(function(res) {
            console.log(res);
        })
        .catch(function(err) {
            console.log(err);
        });

});

router.get('/processSearch',function(req,res){

    console.log('work mother fucker');
});



/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index',{title: 'Home | Mountain Reports',
        classname: 'home',
        page: 'home'})

});

router.get('/loginForm',function(req,res){

    res.render('login',{title: 'Mountain Info',
        classname: 'search',
        page: 'login'});

});

router.post('/processLogin',function(req,res){

    usernameInput = req.body.username;
    passwordInput = req.body.password;

    var checkUser = 'SELECT username, password from users where username = '+usernameInput+' and password = '+passwordInput;
    connection.query(checkUser, function(err,rows,fields){
        res.render('user',{title: 'User Page',
            classname: 'user',
            page: 'user',
            username: req.body.username,
            password: req.body.password
        });
    });
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

router.get('/checkUsers',function(req,res){
    var check = 'SELECT * FROM users';
    connection.query(check, function(err,rows,fields){
        if(err) throw err;

        for(var i in rows){
            res.render('user',{title: 'User Page',
                classname: 'user',
                page: 'user',
                username: rows[i].username,
                password: rows[i].password
            });
            console.log(rows[i].username);
            console.log(rows[i].password);
        }
    });

});

//connection.end();

module.exports = router;

