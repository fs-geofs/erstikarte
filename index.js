/// <reference path="Leaflet.d.ts" />
/// <reference path="Leaflet.Tour.d.ts" />
document.addEventListener('DOMContentLoaded', function (event) {
    /* get tour data from query */
    ajax(parseQuery().tour || 'erstitour.json', function (response, statusCode) {
        if (statusCode !== 200)
            return console.error('could not get data: ' + statusCode);
        // init map with tour
        var map = L.map('map', { maxZoom: 18 }).setView([51.96, 7.63], 13);
        var tourData = JSON.parse(response);
        L.control.scale().addTo(map);
        L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="//www.openstreetmap.org/copyright">OpenStreetMap</a>' + ' contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(map);
        var tour = L.control.tour()
            .addTo(map)
            .loadTour(tourData);
        //.goTo(1);
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
//# sourceMappingURL=index.js.map