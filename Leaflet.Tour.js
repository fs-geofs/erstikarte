L.Control.Tour = L.Control.extend({
    options: {
        position: 'topright',
    },
    initialize: function (options) {
        L.Util.setOptions(this, options);
        this.tourSteps = [];
        this.currentStep = null;
    },
    onAdd: function (map) {
        this._map = map;
        // create DOM
        var c = this._container = L.DomUtil.create('div', 'leaflet-control-tour leaflet-bar'), b = L.DomUtil.create('div', 'leaflet-control-tour-buttons', c);
        this._btnPrev = L.DomUtil.create('a', 'prev hidden', b);
        this._btnPrev.innerHTML = '<';
        this._btnPrev.href = '#';
        this._btnTitle = L.DomUtil.create('a', 'title', b);
        this._btnTitle.href = '#';
        this._btnNext = L.DomUtil.create('a', 'next hidden', b);
        this._btnNext.innerHTML = '>';
        this._btnNext.href = '#';
        this._descDiv = L.DomUtil.create('div', 'hidden leaflet-control-tour-description', c);
        this._stepList = L.DomUtil.create('ol', 'leaflet-control-tour-list', c);
        // event handling
        L.DomEvent.on(this._btnPrev, 'click', this.prev, this);
        L.DomEvent.on(this._btnNext, 'click', this.next, this);
        L.DomEvent.on(this._map, 'click', this.collapse, this);
        if (!L.Browser.android) {
            L.DomEvent.disableClickPropagation(c);
            L.DomEvent.on(c, 'mouseenter', this.expand, this);
            L.DomEvent.on(c, 'mouseleave', this.collapse, this);
        }
        if (L.Browser.touch) {
            L.DomEvent.on(c, 'click', L.DomEvent.stop);
            L.DomEvent.on(c, 'click', this.expand, this);
        } else {
            L.DomEvent.on(c, 'focus', this.expand, this);
            L.DomEvent.disableScrollPropagation(c);
        }
        return c;
    },
    onRemove: function (map) {
        L.DomEvent.off(this._btnPrev, 'click', this.prev, this);
        L.DomEvent.off(this._btnNext, 'click', this.next, this);
        L.DomEvent.off(this._container, {
            mouseenter: this.expand,
            mouseleave: this.collapse
        }, this);
        L.DomEvent.off(this._container, 'click', this.expand, this);
        L.DomEvent.off(this._container, 'focus', this.expand, this);
        for (var i = 0; i < this._stepList.childNodes.length; ++i) {
            L.DomEvent.off(this._stepList.childNodes[i], 'click', this.goTo, this);
        }
        this._map = null;
    },
    expand: function (e) {
        L.DomUtil.addClass(this._container, 'leaflet-control-tour-expanded');
        this._stepList.style.height = null;
        var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
        if (acceptableHeight < this._stepList.clientHeight) {
            L.DomUtil.addClass(this._stepList, 'leaflet-control-tour-scrollbar');
            this._stepList.style.height = acceptableHeight + 'px';
        }
        else {
            L.DomUtil.removeClass(this._stepList, 'leaflet-control-tour-scrollbar');
        }
        return this;
    },
    collapse: function (e) {
        L.DomUtil.removeClass(this._container, 'leaflet-control-tour-expanded');
        return this;
    },
    loadTour: function (data) {
        if (!this._map)
            return console.error('L.tour must be added to map before loading a tour!');
        // delete old tour
        if (this.currentStep)
            this.tourSteps[this.currentStep].removeFrom(this._map);
        for (var i = 0; i < this._stepList.childNodes.length; ++i) {
            L.DomEvent.off(this._stepList.childNodes[i], 'click', this.goTo, this);
        }
        this._stepList.innerHTML = '';
        this.tourSteps = [];
        // parse tour features
        for (var step = 0; step < data.features.length; ++step) {
            var layer = L.geoJson(data.features[step], {
                pointToLayer: L.mapbox.marker.style,
                onEachFeature: function (f, layer) {
                    if (f.geometry.type !== 'Point')
                        layer.setStyle(L.mapbox.simplestyle.style(f));
                    this._createPopup(f.properties, layer);
                }.bind(this)
            });
            layer.properties = data.features[step].properties || {};
            this.tourSteps.push(layer);
            var listItem = L.DomUtil.create('li', '', this._stepList);
            listItem.innerHTML = '<a href="#' + step + '">' + layer.properties.title + '</a>';
            L.DomEvent.on(listItem, 'click', this.goTo, this);
        }
        this._addStepLayer(0);
        return this;
    },
    _addStepLayer: function (stepIndex) {
        if (stepIndex === this.currentStep)
            return;
        if (stepIndex >= this.tourSteps.length || stepIndex < 0)
            return console.error('tour does not have step ' + stepIndex);
        if (this.currentStep !== null) {
            this._map.removeLayer(this.tourSteps[this.currentStep]);
        }
        else {
            L.DomUtil.removeClass(this._btnPrev, 'hidden');
            L.DomUtil.removeClass(this._btnNext, 'hidden');
        }
        this.currentStep = stepIndex;
        this.tourSteps[this.currentStep].addTo(this._map);
        this._map.fitBounds(this.tourSteps[this.currentStep].getBounds());
        this._btnTitle.innerHTML = this.tourSteps[this.currentStep].properties.title;
        if (this.tourSteps[this.currentStep].properties.description) {
            this._descDiv.innerHTML = this.tourSteps[this.currentStep].properties.description;
            L.DomUtil.removeClass(this._descDiv, 'hidden');
        }
        else {
            L.DomUtil.addClass(this._descDiv, 'hidden');
        }
    },
    _createPopup: function (props, layer) {
        var html = '<h4>' + props.title + '</h4>';
        if (props.description)
            html += '<p>' + props.description + '</p>';
        for (var url in props.urls) {
            var isImg = props.urls[url].split('.').pop();
            isImg = (['jpg', 'jpeg', 'png', 'svg', 'gif'].indexOf(isImg.toLowerCase()) === -1) ? false : true;
            html += '<a class="popup-link" href="' + url + '" target="_blank">';
            html += isImg ? '<img src="' + props.urls[url] + '"/>' : props.urls[url];
            html += '</a>';
        }
        layer.bindPopup(html);
    },
    goTo: function (pos) {
        // also accept DOM elements as param (from this._stepList)
        if (typeof pos !== 'number')
            this._addStepLayer(Number(pos.target.getAttribute('href').slice(1)));
        else
            this._addStepLayer(pos);
        return this;
    },
    next: function () {
        this._addStepLayer(this.currentStep + 1);
        return this;
    },
    prev: function () {
        this._addStepLayer(this.currentStep - 1);
        return this;
    },
});
L.control.tour = function (options) {
    return new L.Control.Tour(options);
};
