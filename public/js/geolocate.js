$(function(){
	$('.search').click(function(e){
		e.preventDefault();
		var demo = $('#demo');
		var msg = 'sorry, no bueno';

		if(Modernizr.geolocation){
			navigator.geolocation.getCurrentPosition(success,fail);
			demo.html('checking...');
			//window.location.href = 'localhost:3000/searchResults';

		}	else{
			demo.html(msg);
		}

		function success(position){
			
			//demo.html(lat+', '+long);
			var data = {};
			data.lat = position.coords.latitude;
			data.lng = position.coords.longitude;
			//$.cookie('coordinates',{lat:data.lat,lng:data.lng});
		
			$.ajax({
				url: '/coordinates/',
				type: 'post',
				data: JSON.stringify(data),
		        contentType: 'application/json',
                jsonpCallback: 'callback',
                success: function(data) {
                    console.log(data);
                }
			});
			//window.location.href = 'localhost:3000/searchResults';
		}

		function fail(msg){

			console.log(msg);
		}
	});
	

});

