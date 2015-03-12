var username = sess.username;
var statement = 'select * from favorites join mountains on mountains.triplet = favorites.triplet where username = ?';
var query = connection.query(statement,username, function(err,rows,fields){

//console.log(query.sql);    
//console.log(rows[0]);

var favs = [];
var name = [];
var triplet = [];
var elevation = [];

for(var i=0;i<rows.length;i++){
    favs.push(rows[i]);
}
favs.forEach(function(item){
    name = name.concat(item.name);
    triplet = triplet.concat(item.triplet);
    elevation = elevation.concat(item.elevation);
});//end favs foreach

console.log(favs);
    var stm = 'select * from ratings join mountains on mountains.triplet = ratings.triplet where username = ?';
    var que = connection.query(stm,username,function(err,rows,fields){

    var ratings = [];
    var rName = [];
    var rTriplet = [];
    var rElevation = [];

    for(var j=0;j<rows.length;j++){
        ratings.push(rows[j]);
    }
    ratings.forEach(function(x){
        name = rTriplet.concat(x.name);
        triplet = rTriplet.concat(x.triplet);
        elevation = rElevation.concat(x.elevation);
    });
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
    });