importScripts('assets/vendor/workbox-6.1.5/workbox-sw.js');

workbox.setConfig({
  debug: false,
  modulePathPrefix: 'assets/vendor/workbox-6.1.5/'
});

const revision = '1';

workbox.precaching.precacheAndRoute([
  {url: 'index.html', revision: revision},
  {url: 'manifest.json', revision: revision},
  {url: 'assets/js/app.js', revision: revision},
  {url: 'assets/css/app.css', revision: revision},
  {url: 'assets/img/apple-touch-icon.png', revision: revision},
  {url: 'assets/img/favicon-32x32.png', revision: revision},
  {url: 'assets/img/favicon-16x16.png', revision: revision},
  {url: 'assets/vendor/icomoon/style.css', revision: revision},
  {url: 'assets/vendor/icomoon/fonts/icomoon.ttf', revision: revision},
  {url: 'assets/vendor/icomoon/fonts/icomoon.woff', revision: revision},
  {url: 'assets/vendor/sqljs-1.5.0/sql-wasm.js', revision: revision},
  {url: 'assets/vendor/sqljs-1.5.0/sql-wasm.wasm', revision: revision},
  {url: 'assets/vendor/localForage-1.9.0/localforage.min.js', revision: revision},
  {url: 'assets/vendor/leaflet-1.7.1/images/layers.png', revision: revision},
  {url: 'assets/vendor/leaflet-1.7.1/images/layers-2x.png', revision: revision},
  {url: 'assets/vendor/leaflet-1.7.1/images/marker-icon.png', revision: revision},
  {url: 'assets/vendor/leaflet-1.7.1/images/marker-icon-2x.png', revision: revision},
  {url: 'assets/vendor/leaflet-1.7.1/images/marker-shadow.png', revision: revision},
  {url: 'assets/vendor/leaflet-1.7.1/leaflet.css', revision: revision},
  {url: 'assets/vendor/leaflet-1.7.1/leaflet.js', revision: revision},
  {url: 'assets/vendor/leaflet-locatecontrol-0.72.1/L.Control.Locate.min.js', revision: revision},
  {url: 'assets/vendor/leaflet-mbtiles/Leaflet.TileLayer.MBTiles.js', revision: revision},
  {url: 'assets/vendor/csv2geojson-5.1.1/csv2geojson.min.js', revision: revision},
  {url: 'assets/vendor/togeojson-0.16.0/togeojson.min.js', revision: revision},
  {url: 'assets/vendor/leaflet-elevation-1.6.8/leaflet-elevation.js', revision: revision},
], {
  // Ignore all URL parameters.
  ignoreURLParametersMatching: [/.*/]
});

self.addEventListener('install', (event) => {
	self.skipWaiting();
});