/**
 * Created by patrickhalton on 3/7/15.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}


function showPosition(position) {

    var lat = position.coords.latitude;
    var long = position.coords.longitude;


}