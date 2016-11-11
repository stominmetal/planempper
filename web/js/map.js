var map;
var markers = [];
var timer = null;
var idx = 0;
function initMap() {
    var center = {lat: 42.6977, lng: 23.3219};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: center
    });

    map.addListener('idle', function () {
        if (timer != null) {
            clearTimeout(timer);
            timer = null;
        }
        getPlanes();
    });
}

function getPlanes() {
    // ajax request
    $.getJSON("/planes.json", {}, function (data) {
        var infoWindow = new google.maps.InfoWindow();
        if (len == 0) {
            data.forEach(function (item) {
                console.log(item);
                var point = (Math.round((item.HEADING * 32) / 360) % 32) * 34;
                var icon = new google.maps.MarkerImage('images/planes.png', new google.maps.Size(34, 34), new google.maps.Point(point, 0))
                var marker = new google.maps.Marker({
                    position: {lat: parseFloat(item.LAT), lng: parseFloat(item.LON)},
                    map: map,
                    icon: icon
                });

                marker.addListener('click', (function () {
                    // $.ajax({url: "http://softuni.sliven.org/rtrn.php", success: function(result){
                    //     $("#text").text(result);
                    // }});
                    return function () {
                        infoWindow.setContent(
                            `<table class="table table-striped table-bordered">
                              <thead>
                                <tr>
                                  <th colspan="2"><span style="font-size: 18px">Type</span></th>
                                </tr>
                              </thead>
                              <tbody id="tbody">
                                <tr>
                                  <td><span>Callsign</span>: </td>
                                  <td><span>Tail No</span>: </td>
                                </tr>
                                <tr>
                                  <td><span>Heading</span>: ${item.HEADING}°</td>
                                  <td><span>Speed</span>: ${item.SPEED}kts</td>
                                </tr>
                                <tr>
                                  <td><span>Altitude</span>: ${item.HEIGHT}</td>
                                  <td><span>Vertical Speed</span>: ${item.VERTSPEED}</td>
                                </tr>
                                <tr>
                                  <td><span>Latitude</span>: ${item.LAT}°</td>
                                  <td><span>Longitude</span>: ${item.LON}°</td>
                                </tr>
                              </tbody>
                            </table>`
                        );
                        infoWindow.open(map, marker);
                    }
                })());

                markers.push(marker)
            });
        } else {
            for (var i = 0; i < len; i++) {
                var item = data[i];
                markers[i].setPosition({lat: parseFloat(item.LAT), lng: parseFloat(item.LON)});
                var p = (Math.round((item.HEADING * 32) / 360) % 32) * 34;
                var icon = new google.maps.MarkerImage('images/planes.png', new google.maps.Size(34, 34), new google.maps.Point(p, 0));
                markers[i].setIcon(icon);
            }
        }

        timer = setTimeout(getPlanes, 5000);
    });
}
//
// $(function() {
//     getPlanes();
//     time = setInterval( function(){
//         getPlanes();
//     }, 5000);
// });

window.onload = initMap;