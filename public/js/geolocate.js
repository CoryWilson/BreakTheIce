// var x = document.getElementById("demo");
// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         x.innerHTML = "Geolocation is not supported by this browser.";
//     }
// }
// function showPosition(position) {
//     x.innerHTML = "Latitude: " + position.coords.latitude + 
//     "<br>Longitude: " + position.coords.longitude; 
// }


$(function(){

	function getLocation(){
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
		$.ajax({
		  type:'POST',
		  data: JSON.stringify(showPosition),
		  contentType: 'application/json',
		  url:'/search',
		  success: function(showPosition){
		    console.log('success');
		    console.log(JSON.stringify(showPosition));
		  }
		});
	    } else {
	        $('#demo').html('Geolocation is not supported by this browser.');
	    }
	}
	function showPosition(position) {
		var data = {};
		data.latitude = position.coords.latitude;
		data.longitude = position.coords.longitude;		

		return data;    
		// $('#demo').html('Latitude: ' + position.coords.latitude + 
	 //    '<br>Longitude: ' + position.coords.longitude); 
	}

	$('.coordinates').click(function(e){
		e.preventDefault();
		getLocation();

	});
});