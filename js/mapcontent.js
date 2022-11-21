const geo_json = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/custom.geo.json";
const coords = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/average-latitude-longitude-countries.csv";

const bounds = new L.LatLngBounds(new L.LatLng(-89.93411921886802, -1326.0937500000002), new L.LatLng(89.93411921886802, 1326.0937500000002));

var map = new L.map('map').setView([0, 0], 0);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
//L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 7,
    minZoom: 3,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
}).addTo(map);


//L.Control.geocoder().addTo(map);
// https://gis.stackexchange.com/questions/179630/setting-bounds-and-making-map-bounce-back-if-moved-away

map.setMaxBounds(bounds);

// console.log(map.getBounds());
//icons
var female = L.icon({
    iconUrl: './assets/female-icon.png',
    iconSize: [38, 60], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var male = L.icon({
    iconUrl: './assets/male icon.png',
    iconSize: [38, 60], // size of the icon
    iconAnchor: [35, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});


map.createPane("D3GEOJSON");
// map.getPanes().D3GEOJSON.style.pointerEvents = 'all';
// map.getPanes().D3GEOJSON = 'mapPath';


// var svg = d3.select(map.getPanes().markerPane)
// var svg = d3.select(map.getPanes().tilePane)
// var svg = d3.select(map.getPanes().svgOverlay)
// var svg = d3.select(map.getPanes().overlayPane)

var svg = d3.select(map.getPanes().D3GEOJSON)
    .append("svg").attr("id", "mapSVG")

var g = svg.append("g")
    .attr("class", "leaflet-zoom-hide");

Promise.all([
    //d3.csv(coords),
    d3.json(geo_json)

]).then(data => {
    /*
    //Leaflet marks
    const shit = data[0]

    shit.forEach((x, i) => {
        // console.log(x);
        //https://stackoverflow.com/questions/23874561/leafletjs-marker-bindpopup-with-options
        //https://leafletjs.com/index.html#popup-option
        return L.marker([x.Latitude, x.Longitude], {icon: female}).addTo(map).bindPopup(x.Country)
    })
    shit.forEach((x, i) =>
        L.marker([x.Latitude, x.Longitude], {icon: male}).addTo(map).bindPopup(x.Country)
    )
    */
    // //GEO JSON
    /*
    const collection = data[1]
    // console.log(collection)
    var transform = d3.geoTransform({point: projectPoint});
    var path = d3.geoPath().projection(transform);

    var feature = g.selectAll("path")
        .data(collection.features)
        .enter()
        .append("path")
        .attr("class", "mapPath")

    function reset() {
        var bounds2 = path.bounds(collection),
            topLeft = bounds2[0],
            bottomRight = bounds2[1];
        svg.attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
        feature.attr("pointer-events", "all").attr("d", path);
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

    map.on('zoomend', reset);
    map.on("viewreset", reset);
    reset();
    */

    // geojson map attempt no 2
    console.log(data)
    L.geoJson(data).addTo(map);

})


/*map.on('click', function(e) {
    var temp = e.latlng
    //var popup = L.popup(e.latlng, {content: '<p>Hello world!<br />This is a nice popup.</p>'}).openOn(map)
});*/

var marker = {};

// const apiKey = "AAPK920a0bb6164f4771baac441d0777575211yFWL2LGNrd0dDnqiWYxTHLbFtOeOkNSLpat_-3ep2q84eDxGvbV_Ipyn6WCPhi"

const layerGroup = L.layerGroup().addTo(map);

map.on('click', function (e) {

    // //stop using the API for now.
    // if (marker != undefined) {
    //     map.removeLayer(marker);
    // }
    // marker = new L.marker(e.latlng, {draggable: true}).addTo(map);
    // L.esri.Geocoding
    //     .reverseGeocode({
    //         apikey: apiKey
    //     })
    //     .latlng(e.latlng)
    //
    //     .run(function (error, result) {
    //         if (error) {
    //             return;
    //         }
    //
    //         layerGroup.clearLayers();
    //
    //         console.log(result)
    //         console.log(result.address.CntryName)
    //     });
});