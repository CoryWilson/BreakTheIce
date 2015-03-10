$(function(){ 
	$('.search').click(function(e){
		e.preventDefault();
		navigator.geolocation.getCurrentPosition(function(position){
			$.ajax({
				method: 'post',
				url: '/coordinates/',
				dataType: 'jsonp',
				//jsonpCallback: 'callback',
				data: {
					lat: position.coords.latitude, 
					lng: position.coords.longitude
				},
				success: function(data){
					console.log(data.lat+ ', ' +data.lng)
				}
			});//end ajax
		});//end getCurrentPosition
	});
});


if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
	} else {
		$(".map").text("Your browser is out of fashion, there\'s no geolocation!");
	}


var lat = position.coords.latitude;
var lng = position.coords.longitude;
var acr = position.coords.accuracy;