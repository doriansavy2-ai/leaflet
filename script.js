// Initialisation de la carte
var map = L.map('map', {
center: [48.11, -1.67],
zoom: 12 });

// Appel des fonds de carte

var baselayers = {
OSMMapnik: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}),
 
OrthoRennesMetropole: L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {layers: 'raster:ortho2021', attribution : 'Rennes Métropole'
}),
  
ESRIWorldTopoMap: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}),
StadiaAlidadeSatellite: L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}),
Positron : L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'})}; 

baselayers.ESRIWorldTopoMap.addTo(map);

// Ajouter le controleur de couches



// Ajouter l'échelle

L.control.scale().addTo(map);

// Ajouter des marqueurs sur la carte
// Définir les logos

var sigaticon = L.icon({
  iconUrl: 'https://www.nicepng.com/png/full/717-7172573_esri-logo-png.png',
 iconSize: [50, 20],});

var pathe = L.icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/f/f8/Path%C3%A9_Logo.svg/2560px-Path%C3%A9_Logo.svg.png',
 iconSize: [50, 40],});

// Contenu des pop-ups
// Salle SIGAT
var popupsigat = '<h1>Salle SIGAT Rennes 2 </h1> <a href="https://esigat.wordpress.com/">\nVisiter le site de l association</a><br> <img src="https://esigat.wordpress.com/wp-content/uploads/2025/11/whatsapp-image-2025-09-19-a-15.39.53_ec27dad0.jpg?w=1024" width="350px"><iframe width="500" height="315" src="https://www.youtube.com/embed/P_a6itkxeSM?si=UvmoxzCCt-43eKdA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
var customOptions = {'maxWidth': '500', 'className' : 'custom'};
var Rennes2 = L.marker([48.119, -1.7013],{icon: sigaticon}).bindPopup(popupsigat,customOptions);

// Cinéma Pathé Rennes
var popupcine = '<h1>Cinéma Pathé Rennes </h1> <p> Plus de 10 salles !!! </p> <a href="https://www.pathe.fr/cinemas/cinema-pathe-rennes">Visiter le site</a> <br> <img src="https://static.actu.fr/uploads/2023/03/cinema-pathe-gaumont-rennes-esplanade-charles-de-gaulle-film-960x640.jpeg" width="350px">';
var cine = L.marker([48.10601256325143, -1.6754847590726978],{icon:pathe}).bindPopup(popupcine,customOptions);

// Ajouter des WMS en temps que couche

var trafic = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
layers: 'trp_rout:v_rva_trafic_fcd',
format: 'image/png',transparent: true}).addTo(map);

var batiment = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
layers: 'ref_cad:batiment',
format: 'image/png',transparent: true});

var cadastre = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
layers: 'ref_cad:parcelle',
format: 'image/png',transparent: true});

var metro = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',{layers: 'trp_coll:metro_station',
                               format: 'image/png',
                               transparent: true});

// Déclarer les couches à afficher

var couches = {
  "Trafic en temps réel" : trafic,
  "Bâtiments" : batiment,
  "Stations de métro" : metro,
  "Cinéma Rennes" : cine, 
  "Salle SIGAT" : Rennes2,
};

// Menu de controle des fonds de carte

L.control.layers(baselayers, couches, {position: 'topleft', collapsed:false}).addTo(map);

// Charger des données géographiques (geojson)

var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson,{
// Transformer les marqueurs en point
pointToLayer: function (geoJsonPoint, latlng) {
return L.circleMarker(latlng);
},
// Modifier la symbologie des points
style: function (geoJsonFeature) {
return {
fillColor: '#001f3f',
radius: 4,
fillOpacity: 0.7,
stroke: false};
},
}).addTo(map);
  // Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h1> Station : "+velos.feature.properties.nom+"</h1>"+"<hr><h2>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h2>" ;
});
});