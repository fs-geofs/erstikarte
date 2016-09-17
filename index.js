document.addEventListener('DOMContentLoaded', function (event) {
    L.mapbox.accessToken = 'pk.eyJ1Ijoibm9lcnciLCJhIjoiY2lzdzlwZDVvMDAyMDJ6bzNrNzd0ejFqNyJ9.Xe6kxs1bkjcje6Se1qtVAg';

    /* get tour data from query */
    ajax(parseQuery().tour || 'erstitour.json', function (response, statusCode) {
        if (statusCode !== 200)
            return console.error('could not get data: ' + statusCode);
        // init map with tour
        var map = L.mapbox.map('map', 'mapbox.light', { maxZoom: 18, center: [51.96, 7.63], zoom: 13 });
        L.control.scale().addTo(map);
        var tourData = JSON.parse(response);
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
