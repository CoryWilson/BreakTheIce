$(function(){
	$('.coordinates').click(function(e){
		e.preventDefault();
		var demo = $('#demo');
		var msg = 'sorry, no bueno';

		if(Modernizr.geolocation){
			navigator.geolocation.getCurrentPosition(success,fail);
			demo.html('checking...');

		}	else{
			demo.html(msg);
		}

		function success(position){
			
			//demo.html(lat+', '+long);
			var data = {};
			data.lat = position.coords.latitude;
			data.long = position.coords.longitude;
		
			$.ajax({
				type: 'post',
				data: JSON.stringify(data),
		        contentType: 'application/json',
                url: 'http://localhost:3000/searchResults',
                success: function(data) {
                    console.log('success');
                    //window.location.href = '/coordinates';  
                    //console.log(JSON.stringify(data));
                }
			});
		}

		function fail(msg){

			console.log(msg);
		}
	});
	

});

