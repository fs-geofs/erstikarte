document.addEventListener('DOMContentLoaded', function (event) {
    var mapboxToken = 'pk.eyJ1Ijoibm9lcnciLCJhIjoiY2lzdzlwZDVvMDAyMDJ6bzNrNzd0ejFqNyJ9.Xe6kxs1bkjcje6Se1qtVAg';
    L.MakiMarkers.accessToken = mapboxToken;

    /* get tour data from query */
    ajax(parseQuery().tour || 'erstitour.json', function (response, statusCode) {
        if (statusCode !== 200)
            return console.error('could not get data: ' + statusCode);
        // init map with tour
        var map = L.map('map', { maxZoom: 18 }).setView([51.96, 7.63], 13);
        var tourData = JSON.parse(response);
        L.control.scale().addTo(map);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=' + mapboxToken, {
            attribution: '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a>' + ' contributors'
        }).addTo(map);
        var tour = L.control.tour()
            .addTo(map)
            .loadTour(tourData)
            .goTo(Number(window.location.hash.slice(1)) || 0);
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
