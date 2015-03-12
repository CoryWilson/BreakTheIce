var app = require('./app.js');
var index = require('./routes/index.js');
var request = require('request');

exports.powderLinesClosest = function(lat,lng,callback){
	var powderLinesClosest = 'http://api.powderlin.es/closest_stations?lat='+lat+'&lng='+lng+'&data=true&days=0&count=5';
    request(powderLinesClosest, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = JSON.parse(body);
            callback(results);
        }
    });
};

exports.powderLinesStation = function(triplet,callback){
    var powderLinesStation = 'http://api.powderlin.es/station/'+triplet;
    request(powderLinesStation, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = JSON.parse(body);
            callback(results);
        }
    });
};

exports.flickrCall = function(lat,lng,callback){
    var flickrKey = '6a499e7169f57f2dc2c7d74a917dac96';
    var flickrSecret = 'f446b4bb915d18b2';
    var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+flickrKey+'&safe_search=1&place_id=&has_geo=&geo_context=2&lat='+lat+'&lon='+lng+'&per_page=5&page=&format=json&nojsoncallback=1';
    
    request(flickrAPI, function(error,response,body){
        if(!error && response.statusCode == 200){   
            var flickr = JSON.parse(body);
            //console.log(flickr);
            var photos = [];
            var farmId = [];
            var serverId = [];
            var photoId = [];
            var photoSecret = [];

            for(var j=0;j<flickr.photos.photo.length;j++){
                photos.push(flickr.photos.photo[j])
            }

            photos.forEach(function(item){
                farmId = farmId.concat(item.farm);
                serverId = serverId.concat(item.server);
                photoId = photoId.concat(item.id);
                photoSecret = photoSecret.concat(item.secret);
            });

            // var flickrObj = {
            //     farmId: farmId,
            //     serverId: serverId,
            //     photoId: photoId,
            //     photoSecret: photoSecret
            // }

            callback(photos);
        }
    });    
};

exports.weatherCall = function(lat,lng,callback){
    var wAPI = 'http://api.wunderground.com/api/9223f36975c7d646/geolookup/q/'+lat+','+lng+'.json';
    var weatherReq = request(wAPI, function(error,response,body){
        if(!error && response.statusCode == 200){
            var weather = JSON.parse(body);
            callback(weather);
        }
    });
};
