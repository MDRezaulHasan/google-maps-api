document.addEventListener('DOMContentLoaded', function () {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, { edge: 'left' });
    // add recipe form
    //const forms = document.querySelectorAll('.side-form');
    //M.Sidenav.init(forms, {edge: 'left'});
});

var marker;
var map;
var infoWindow;

function initMap() {
    var myOptions = {
        zoom: 16,
        center: new google.maps.LatLng(59.3498092, 18.0684758),
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        FullscreenControl: false,
        /*restriction: {
            latLngBounds: {
                north: 70.00,
                south: 50.00,
                west: 10.00,
                east: 30.00,
            }
        },*/
        disableDoubleClickZoom: true,
        clickableIcons: false,
    }
    map = new google.maps.Map(document.getElementById('map'), myOptions);

    infoWindow = new google.maps.InfoWindow;

    /*marker = new google.maps.Marker({
        position: new google.maps.LatLng(59.3498092, 18.0684758),
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: 'KTH'
    });*/

    //current_loc(map, infoWindow);
    initFullscreenControl(map);

    var controlButtonUI_1 = document.getElementById('roadmap');
    controlButtonUI_1.addEventListener("click", function () {
        map.setMapTypeId('roadmap');
    });
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(controlButtonUI_1);
    //controlButtonUI_1.style.visibility="visible";
    

    var controlButtonUI_2 = document.getElementById('satellite');
    controlButtonUI_2.addEventListener("click", function () {
        map.setMapTypeId('satellite');
    });
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(controlButtonUI_2);

    var controlButtonUI_3 = document.getElementById('terrain');
    controlButtonUI_3.addEventListener("click", function () {
        map.setMapTypeId('terrain');
    });
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(controlButtonUI_3);

    var controlButtonUI_4 = document.getElementById('fullScreen');
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlButtonUI_4);

    var controlButtonUI_5 = document.getElementById('my_loc');
    controlButtonUI_5.addEventListener("click", function () {
        current_loc(map, infoWindow);
    });
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlButtonUI_5);

    var controlButtonUI_6 = document.getElementById('streetview');
    controlButtonUI_6.addEventListener("click", function () {
        if (map.getTilt() == 0)
            map.setTilt(45);
        else
            map.setTilt(0);
    });
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlButtonUI_6);

}

function current_loc(map, infoWindow) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("I am here");
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function initFullscreenControl(map) {
    var elementToSendFullscreen = map.getDiv().firstChild;
    var fullscreenControl = document.querySelector('#fullScreen');
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
        fullscreenControl);


    fullscreenControl.onclick = function () {
        if (isFullscreen(elementToSendFullscreen)) {
            exitFullscreen();
        } else {
            requestFullscreen(elementToSendFullscreen);
        }
    };

    document.onwebkitfullscreenchange =
        document.onmsfullscreenchange =
        document.onmozfullscreenchange =
        document.onfullscreenchange = function () {
            if (isFullscreen(elementToSendFullscreen)) {
                fullscreenControl.classList.add('is-fullscreen');
            } else {
                fullscreenControl.classList.remove('is-fullscreen');
            }
        };
}

function isFullscreen(element) {
    return (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement) == element;
}
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullScreen) {
        element.msRequestFullScreen();
    }
}
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msCancelFullScreen) {
        document.msCancelFullScreen();
    }
}

function toggleBounce() {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

var locations = ["KTH Main Campus", "Lidl", "KTH Kista", "Royal Palace, Gamlastan", "Skanstull Pendaltag", "Burger King"]
function addMarker(location, value) {
    if(marker != null) {
        marker.setMap(null);
        marker = null;
    }
    marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        optimized: false,
        label: {
            text: locations[value],
            color: 'orange',
            fontSize: '30px'
        }
    });
    map.setCenter(location);
    map.setZoom(16);
    marker.addListener('click', toggleBounce);
    marker.setMap(map);
}