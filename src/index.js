document.addEventListener('DOMContentLoaded', function (event) {
    /* get tour data from query */
    ajax(parseQuery().tour || 'locations.geojson', function (response, statusCode) {
        if (statusCode !== 200)
            return console.error('could not get data: ' + statusCode);
        var tourData = JSON.parse(response);
        // init map with tour
        var map = L.map('map', { maxZoom: 17 }).setView([51.96, 7.63], 13);
        L.control.scale().addTo(map);
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ' contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(map);
        L.geoJson(tourData).addTo(map);
        var tour = L.Tour(tourData).addTo(map);
    });
    function parseQuery() {
        var query = window.location.search.split('&'), result = {};
        query.forEach(function (elem, i, arr) {
            if (i === 0)
                elem = elem.slice(1);
            var props = elem.split('=');
            result[props[0]] = props[1];
        });
        return result;
    }
    function ajax(url, success, method, mimetype) {
        var oReq = new XMLHttpRequest();
        oReq.onload = function (e) { success(e.target.response, e.target.status); };
        oReq.open(method || 'get', url, true);
        oReq.overrideMimeType(mimetype || 'text/plain');
        oReq.send();
        return oReq;
    }
});
/*function addGeoJson(map, data) {
  var colors = rainbowDash({
    uniformStops: true,
    inputRange: [0, 1]
  }, ['#e50000', '#ee6c00', '#fde703', '#9cf91a', '#0ee828']);

  var track = L.geoJson(data.track, {
    onEachFeature: function(feature, layer) {
      _createPopup(feature.properties, layer);
      layer.setStyle(speed2Style(feature.properties.speed));
    }
  });
  var pois = L.geoJson(data.events, {
    onEachFeature: function(feature, layer) {
      _createPopup(feature.properties, layer);
    },
    pointToLayer: function(feature, latlng) {
      return L.marker(latlng, {
        icon: L.AwesomeMarkers.icon({ prefix: 'ion', icon: 'arrow-down-c', markerColor: 'red' })
      });
    }
  });

  var featureGroup = L.featureGroup().addTo(map.map);
  track.addTo(featureGroup);
  pois.addTo(featureGroup);
  map.layerCtrl.addOverlay(featureGroup, data.meta.tags.toString());

  map.map.fitBounds(featureGroup.getBounds(), { padding: [60, 60]});

  function _createPopup(properties, layer) {
    var _htmlString = '';
    for (var prop in properties) {
      _htmlString += '<tr><th>' + prop + ':</th><td>' + properties[prop].toString() + '</td></tr>';
    }
    if (_htmlString !== '') layer.bindPopup(('<table>' + _htmlString + '</table>'));
  }

  function speed2Style(val) {
    var maxSpeed = 38.5;
    var percent = val / maxSpeed;
    return {
      color: colors(percent),
      opacity: 0.3 + percent * 2 / 3,
      weight: 5 + parseInt(Math.exp(2.6 - 2.6*percent) * 4)
    }
  }
}*/
