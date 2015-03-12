var app = require('../app.js');
var index = require('../routes/index.js');
var mysql = require('mysql');

//DB Connection
var connection = mysql.createConnection({
    user     : 'root',
    password : 'root',
    host     : 'localhost',
    port: '8889',
    database : 'asl_node'
});

exports.favorites = function(username,callback){
    var statement = 'select * from favorites join mountains on mountains.triplet = favorites.triplet where username = ?';
    var query = connection.query(statement,username, function(err,rows,fields){
        var favs = [];
        for(var i=0;i<rows.length;i++){
            favs.push(rows[i]);
        }
        callback(favs);
    });
};

exports.ratings = function(username,callback){
    var statement = 'select * from ratings join mountains on mountains.triplet = ratings.triplet where username = ?';
    var query = connection.query(statement,username,function(err,rows,fields){

    var ratings = [];
    for(var i=0;i<rows.length;i++){
        ratings.push(rows[i]);
    }
    callback(ratings);
    });
};

// exports.checkUser = function(username,password,callback){
//     var statement = 'select * from users where username = ? and password = ?';
//     var query = connection.query(statement,[user,pass], function(err,rows,fields){
//         if(err) throw err;
//         send.id = rows[0].id;
//         sess.email = rows[0].email;
//         sess.username = rows[0].email;
//     });
// };
