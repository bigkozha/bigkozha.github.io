var elevation_options = {

  // Default chart colors: theme lime-theme, magenta-theme, ...
  theme: "lightblue-theme",

  // Chart container outside/inside map container
  detached: true,

  // if (detached), the elevation chart container
  elevationDiv: "#elevation-div",

  // if (!detached) autohide chart profile on chart mouseleave
  autohide: false,

  // if (!detached) initial state of chart profile control
  collapsed: false,

  // if (!detached) control position on one of map corners
  position: "topright",

  // Autoupdate map center on chart mouseover.
  followMarker: true,

  // Autoupdate map bounds on chart update.
  autofitBounds: true,

  // Chart distance/elevation units.
  imperial: false,

  // [Lat, Long] vs [Long, Lat] points. (leaflet default: [Lat, Long])
  reverseCoords: false,

  // Acceleration chart profile: true || "summary" || "disabled" || false
  acceleration: false,

  // Slope chart profile: true || "summary" || "disabled" || false
  slope: false,

  // Speed chart profile: true || "summary" || "disabled" || false
  speed: false,

  // Display time info: true || "summary" || false
  time: false,

  // Display distance info: true || "summary"
  distance: true,

  // Display altitude info: true || "summary"
  altitude: true,

  // Summary track info style: "line" || "multiline" || false
  summary: 'multiline',

  // Toggle chart ruler filter.
  ruler: true,

  // Toggle chart legend filter.
  legend: true,

  // Toggle "leaflet-almostover" integration
  almostOver: true,

  // Toggle "leaflet-distance-markers" integration
  distanceMarkers: false,

  // Render chart profiles as Canvas or SVG Paths
  preferCanvas: true

};

const mapStore = localforage.createInstance({
  name: "maps",
  storeName: "saved_maps"
});

const featureStore = localforage.createInstance({
  name: "maps",
  storeName: "saved_features"
});

const almatyCoordinates = [43.263800, 76.929300];
const map = L.map("map", {
  zoomSnap: (typeof window.orientation == "undefined") ? 1 : 0,
  tap: false,
  maxZoom: 22,
  zoomControl: false,
  renderer: L.canvas({
    padding: 0.5,
    tolerance: 10
  })
}).fitWorld();
map.setView(almatyCoordinates, 6)
map.attributionControl.setPrefix(`<span id="status" style="color:${navigator.onLine ? "green" : "red"}">&#9673;</span> <a href="#" onclick="showInfo(); return false;">About</a>`);

map.once("locationfound", function (e) {
  hideLoader();
  map.fitBounds(e.bounds, { maxZoom: 18 });
});

map.on("click", function (e) {
  layers.select.clearLayers();
});

map.on("baselayerchange", function (e) {
  localStorage.setItem("basemap", e.name);
});

const layers = {
  basemaps: {
    "Улицы": L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.@2xpng", {
      maxNativeZoom: 18,
      maxZoom: map.getMaxZoom(),
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attribution">CARTO</a>',
    }).addTo(map)
  },

  select: L.featureGroup(null).addTo(map),
  overlays: {},
  groups: {}
};

/*** Begin custom input control for adding local file ***/
L.Control.AddFile = L.Control.extend({
  onAdd: function (map) {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iP(ad|od|hone)/i);
    fileInput = L.DomUtil.create("input", "hidden");
    fileInput.type = "file";
    fileInput.accept = iOS ? "*" : ".mbtiles, .geojson, .kml, .gpx, .csv";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", function () {
      const file = fileInput.files[0];
      handleFile(file);
      this.value = "";
    }, false);

    const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    div.innerHTML = `
      <a class='leaflet-bar-part leaflet-bar-part-single file-control-btn' title='Загрузить файл' onclick='fileInput.click();'>
        <i class='icon-add'></i>
      </a>
    `;
    L.DomEvent.on(div, "click", function (e) {
      L.DomEvent.stopPropagation(e);
    });
    return div
  }
});

L.control.addfile = function (opts) {
  return new L.Control.AddFile(opts);
}
/*** End custom control ***/

const controls = {
  layerCtrl: L.control.layers(null, null, {
    collapsed: true,
    position: "topright",
  }).addTo(map),

  fileCtrl: L.control.addfile({
    position: "bottomright"
  }).addTo(map),

  locateCtrl: L.control.locate({
    icon: "icon-gps_fixed",
    iconLoading: "spinner icon-gps_fixed",
    setView: "untilPan",
    cacheLocation: true,
    position: "bottomright",
    flyTo: false,
    keepCurrentZoomLevel: true,
    circleStyle: {
      interactive: false
    },
    markerStyle: {
      interactive: true
    },
    metric: true,
    strings: {
      title: "Мое местоположение",
      popup: function (options) {
        const loc = controls.locateCtrl._marker.getLatLng();
        return `<div style="text-align: center;">Вы в радиусе ${Number(options.distance).toLocaleString()} метрах<br>от <strong>${loc.lat.toFixed(6)}</strong>, <strong>${loc.lng.toFixed(6)}</strong></div>`;
      }
    },
    locateOptions: {
      enableHighAccuracy: true,
      maxZoom: 18
    },
    onLocationError: function (e) {
      hideLoader();
      document.querySelector(".leaflet-control-locate").getElementsByTagName("span")[0].className = "icon-gps_off";
      alert(e.message);
    }
  }).addTo(map),

  scaleCtrl: L.control.scale({
    position: "bottomleft"
  }).addTo(map)
};

function handleFile(file) {
  showLoader();
  const name = file.name.split(".").slice(0, -1).join(".");

  if (file.name.endsWith(".mbtiles")) {
    loadRaster(file, name);
  } else if (file.name.endsWith(".geojson") || file.name.endsWith(".kml") || file.name.endsWith(".gpx") || file.name.endsWith(".csv")) {
    const format = file.name.split(".").pop();
    loadVector(file, name, format);
  } else {
    alert("Поддерживаются форматы MBTiles, GeoJSON, KML, GPX, CSV.");
    hideLoader();
  }
}

function loadVector(file, name, format) {
  const reader = new FileReader();
  let geojson = null;

  reader.onload = function (e) {
    if (format == "geojson") {
      geojson = JSON.parse(reader.result);
    } else if (format == "kml") {
      const kml = (new DOMParser()).parseFromString(reader.result, "text/xml");
      geojson = toGeoJSON.kml(kml, { styles: true });
    } else if (format == "gpx") {
      const gpx = (new DOMParser()).parseFromString(reader.result, "text/xml");
      geojson = toGeoJSON.gpx(gpx);
    } else if (format == "csv") {
      const columns = reader.result.split(/\n/).filter(Boolean)[0].split(",");
      const options = {};
      if (columns.includes("Y") && columns.includes("X")) {
        options.latfield = "Y",
          options.lonfield = "X"
      }
      csv2geojson.csv2geojson(reader.result, options, function (err, data) {
        if (data) {
          geojson = data;
        }
      });
    }

    createVectorLayer(name, geojson, null, true);
  }

  reader.readAsText(file);
}

defaultRoutes.forEach(item => {
  createVectorLayer(item.routeName, item.routeData, null, false);
})

// Instantiate elevation control.
var controlElevation = L.control.elevation(elevation_options).addTo(map);


function createVectorLayer(name, data, key, save) {
  let radius = 4;
  var key = key ? key : Date.now().toString();
  const layer = L.geoJSON(data, {
    key: key,
    bubblingMouseEvents: false,
    style: function (feature) {
      return {
        color: feature.properties.hasOwnProperty("stroke") ? feature.properties["stroke"] : feature.properties["marker-color"] ? feature.properties["marker-color"] : "#ff0000",
        opacity: feature.properties.hasOwnProperty("stroke-opacity") ? feature.properties["stroke-opacity"] : 1.0,
        weight: feature.properties.hasOwnProperty("stroke-width") ? feature.properties["stroke-width"] : 3,
        fillColor: feature.properties.hasOwnProperty("fill") ? feature.properties["fill"] : feature.properties["marker-color"] ? feature.properties["marker-color"] : "#ff0000",
        fillOpacity: feature.properties.hasOwnProperty("fill-opacity") ? feature.properties["fill-opacity"] : feature.geometry.type != "Point" ? 0.2 : feature.geometry.type == "Point" ? 1 : "",
      };
    },
    pointToLayer: function (feature, latlng) {
      const size = feature.properties.hasOwnProperty("marker-size") ? feature.properties["marker-size"] : "small";
      const sizes = {
        small: 4,
        medium: 6,
        large: 8
      };
      radius = sizes[size];
      return L.circleMarker(latlng, {
        radius: radius
      });
    },
    onEachFeature: function (feature, layer) {
      let table = "<div style='overflow:auto;'><table>";
      const hiddenProps = ["styleUrl", "styleHash", "styleMapHash", "stroke", "stroke-opacity", "stroke-width", "opacity", "fill", "fill-opacity", "icon", "scale", "coordTimes", "marker-size", "marker-color", "marker-symbol"];
      for (const key in feature.properties) {
        if (feature.properties.hasOwnProperty(key) && hiddenProps.indexOf(key) == -1) {
          table += "<tr><th>" + key.toUpperCase() + "</th><td>" + formatProperty(feature.properties[key]) + "</td></tr>";
        }
      }
      table += "</table></div>";
      layer.bindPopup(table, {
        // closeButton: false,
        maxHeight: 300,
        maxWidth: 250
      });
      layer.on({
        popupclose: function (e) {
          layers.select.clearLayers();
        },
        click: function (e) {
          layers.select.clearLayers();
          layers.select.addLayer(L.geoJSON(layer.toGeoJSON(), {
            style: {
              color: "#00FFFF",
              weight: 5
            },
            pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
                radius: radius,
                color: "#00FFFF",
                fillColor: "#00FFFF",
                fillOpacity: 1
              });
            }
          }))
        }
      });
    }
  });

  if (save) {
    const value = {
      "name": name,
      "features": data
    };
    featureStore.setItem(key, value).then(function (value) {
      addOverlayLayer(layer, name, null, true);
      layers.overlays[L.Util.stamp(layer)] = layer;
      layer.addTo(map);
      zoomToLayer(L.Util.stamp(layer));
    }).catch(function (err) {
      alert("Error saving data!");
    });
  } else {
    addOverlayLayer(layer, name, null, true);
    layers.overlays[L.Util.stamp(layer)] = layer;
  }
}

function loadRaster(file, name) {
  const reader = new FileReader();

  reader.onload = function (e) {
    createRasterLayer(name, reader.result);
  }

  reader.readAsArrayBuffer(file);
}

function createRasterLayer(name, data) {
  const key = Date.now().toString();
  const layer = L.tileLayer.mbTiles(data, {
    autoScale: true,
    fitBounds: true,
    updateWhenIdle: false,
    key: key
  }).on("databaseloaded", function (e) {
    name = (layer.options.name ? layer.options.name : name);
    // addOverlayLayer(layer, name);
    const value = {
      "name": name,
      "mbtiles": data
    };
    mapStore.setItem(key, value).then(function (value) {
      addOverlayLayer(layer, name, null, false);
    }).catch(function (err) {
      alert("Error saving data!");
    });

  }).addTo(map);
  layers.overlays[L.Util.stamp(layer)] = layer;
}

function addOverlayLayer(layer, name, group, saved) {
  hideLoader();
  const layerState = getLayerState();
  controls.layerCtrl.addOverlay(layer, `
    ${name.replace(/_/g, " ")}<br>
    <span class="layer-buttons">
    <span data-layer="${L.Util.stamp(layer)}"></span>
      <a class="layer-btn" href="#" title="Приблизить" onclick="zoomToLayer(${L.Util.stamp(layer)}); return false;"><i class="icon-zoom_out_map" style="color: darkslategray; font-size: 22px;">&nbsp&nbsp&nbsp&nbsp</i></a>
      <a class="layer-btn" href="#" title="Удалить" onclick="removeLayer(${L.Util.stamp(layer)}, '${name}', '${group ? group : ''}'); return false;"><i class="icon-delete" style="color: red; font-size: 22px;"></i></a>
    </span>
    <div style="clear: both;"></div>
  `);
  updateLayerState(layerState);

  layer.on("add", function (e) {
    document.querySelector(`[data-layer='${L.Util.stamp(layer)}']`).disabled = false;
    controlElevation.clear();
    featureStore.getItem(layer.options.key, function (err, value) {
      // if err is non-null, we got an error. otherwise, value is the value
      if (value) {
        // Load track from url (allowed data types: "*.geojson", "*.gpx", "*.tcx")
        controlElevation.load(value.features);
        console.log(value.features)
      } else {
        const defaultMap = defaultRoutes.filter(i => i.routeName === name);
        if (defaultMap) {
          controlElevation.load(defaultMap[0].routeData);
          console.log(defaultMap[0].routeData.features[0].geometry.coordinates[0])
          const markerCoord = defaultMap[0].routeData.features[0].geometry.coordinates[0];
          L.marker([markerCoord[1], markerCoord[0]]).addTo(map).bindPopup("Начало маршрута");
          
        }
      }
    });

  });

  layer.on("remove", function (e) {
    document.querySelector(`[data-layer='${L.Util.stamp(layer)}']`).disabled = true;
    controlElevation.clear();
  });
}

function getLayerState() {
  const layers = {};
  document.querySelectorAll(".layer-buttons input").forEach(element => {
    const id = element.getAttribute("data-layer");
    const layer = map._layers[id];
    layers[id] = {
      disabled: map.hasLayer(layer) ? false : true,
      opacity: element.value
    }
  });
  return layers;
}

function updateLayerState(layers) {
  document.querySelectorAll(".layer-buttons input").forEach(element => {
    const id = element.getAttribute("data-layer");
    if (layers[id]) {
      element.disabled = layers[id].disabled;
      element.value = layers[id].opacity;
    }
  });
}

function zoomToLayer(id) {
  const layer = layers.overlays[id];
  if (!map.hasLayer(layer)) {
    // map.addLayer(layers.overlays[id]);
    alert("Карта должна быть выбрана!");
  }
  else if (layer.options.bounds) {
    map.fitBounds(layer.options.bounds);
  }
  else {
    map.fitBounds(layer.getBounds(), { padding: [20, 20] });
  }
}

function removeLayer(id, name, group) {
  if (confirm(`Удалить ${name.replace(/_/g, " ")}?`)) {
    const layerState = getLayerState();
    const layer = layers.overlays[id];
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
    if (layer instanceof L.TileLayer.MBTiles) {
      layer._db.close();
    }
    if (layer && layer.options && layer.options.key) {
      if (layer instanceof L.TileLayer.MBTiles) {
        mapStore.removeItem(layer.options.key).then(function () {
          controls.layerCtrl.removeLayer(layer);
          updateLayerState(layerState);
        });
      } else if (layer instanceof L.GeoJSON) {
        featureStore.removeItem(layer.options.key).then(function () {
          controls.layerCtrl.removeLayer(layer);
          updateLayerState(layerState);
        });
      }
    }
    if (group) {
      const groupLayer = layers.groups[group];
      const key = groupLayer.options.key;
      mapStore.removeItem(key).then(function () {
        controls.layerCtrl.removeLayer(groupLayer);
        updateLayerState(layerState);
      });
    } else {
      controls.layerCtrl.removeLayer(layer);
      updateLayerState(layerState);
    }
  }
}

function formatProperty(value) {
  if (typeof value == "string" && value.startsWith("http")) {
    return `<a href="${value}" target="_blank">${value}</a>`;
  } else {
    return value;
  }
}

function showLoader() {
  document.getElementById("progress-bar").style.display = "block";
}

function hideLoader() {
  document.getElementById("progress-bar").style.display = "none";
}

function switchBaseLayer(name) {
  const basemaps = Object.keys(layers.basemaps);
  for (const layer of basemaps) {
    if (layer == name) {
      map.addLayer(layers.basemaps[layer]);
    } else {
      map.removeLayer(layers.basemaps[layer]);
    }
  }
}

function loadBasemapConfig(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const config = JSON.parse(reader.result);
    if (confirm("Are you sure you want to overwrite the default basemaps?")) {
      loadCustomBasemaps(config);
      localStorage.setItem("basemapConfig", JSON.stringify(config));
    }
  }
  reader.readAsText(file);
}

function loadCustomBasemaps(config) {
  const basemaps = Object.keys(layers.basemaps);
  for (const layer of basemaps) {
    map.removeLayer(layers.basemaps[layer]);
    controls.layerCtrl.removeLayer(layers.basemaps[layer]);
  }
  layers.basemaps = {};
  config.forEach((element, index) => {
    let layer = null;
    if (element.type == "wms") {
      layer = L.tileLayer.wms(element.url, {
        maxNativeZoom: element.maxZoom ? element.maxZoom : 18,
        maxZoom: map.getMaxZoom(),
        layers: element.layers,
        format: element.format ? element.format : "image/png",
        attribution: element.attribution ? element.attribution : ""
      });
    } else if (element.type == "xyz") {
      layer = L.tileLayer(element.url, {
        maxNativeZoom: element.maxZoom ? element.maxZoom : 18,
        maxZoom: map.getMaxZoom(),
        attribution: element.attribution ? element.attribution : ""
      });
    }
    if (index == 0) {
      layer.addTo(map);
    }
    layers.basemaps[element.name] = layer;
    controls.layerCtrl.addBaseLayer(layer, element.name);
  });
  layers.basemaps["Улицы"] = L.tileLayer("", { maxZoom: map.getMaxZoom() });
  controls.layerCtrl.addBaseLayer(layers.basemaps["Улицы"], "Улицы");
}

function showInfo() {
  alert("Welcome to GPSMap.app, an offline capable map viewer with GPS integration!\n\n- Tap the + button to load a raster MBTiles, GeoJSON, KML, GPX, or CSV file directly from your device or cloud storage.\n- Tap the layers button to view online basemaps and manage offline layers.\n\nDeveloped by Bryan McBride - mcbride.bryan@gmail.com");
}

function loadSavedFeatures() {
  featureStore.length().then(function (numberOfKeys) {
    if (numberOfKeys > 0) {
      featureStore.iterate(function (value, key, iterationNumber) {
        createVectorLayer(value.name, value.features, key, false);
      }).then(function () {
        // console.log("saved features loaded!");
      }).catch(function (err) {
        console.log(err);
      });
    }
  }).catch(function (err) {
    console.log(err);
  });
}

function loadSavedMaps() {
  const urlParams = new URLSearchParams(window.location.search);
  mapStore.length().then(function (numberOfKeys) {
    if (!urlParams.has("map") && numberOfKeys != 1) {
      controls.locateCtrl.start();
    }
    if (numberOfKeys > 0) {
      mapStore.iterate(function (value, key, iterationNumber) {
        const group = L.layerGroup(null, { key: key });
        const groupID = L.Util.stamp(group);
        layers.groups[groupID] = group;
        addOverlayLayer(group, value.name, groupID, true);
        group.once("add", function (e) {
          const layer = L.tileLayer.mbTiles(value.mbtiles, {
            autoScale: true,
            fitBounds: (urlParams.has("map") && urlParams.get("map") == key) ? true : (numberOfKeys == 1) ? true : false,
            updateWhenIdle: false,
            zIndex: 10
          });
          group.addLayer(layer);
          layers.overlays[groupID] = layer;
        });
        if ((numberOfKeys == 1) || (urlParams.has("map") && urlParams.get("map") == key)) {
          map.addLayer(group);
          switchBaseLayer("Улицы");
          document.querySelector(`[data-layer='${groupID}']`).disabled = false;
        }
      }).then(function () {
        // console.log("saved maps loaded!");
        loadSavedFeatures();
      }).catch(function (err) {
        console.log(err);
      });
    } else {
      loadSavedFeatures();
    }
  }).catch(function (err) {
    console.log(err);
  });
}

function loadURLparams() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("map")) {
    const url = urlParams.get("map");
    mapStore.keys().then(function (keys) {
      if (!keys.includes(url)) {
        fetchFile(url);
      }
    }).catch(function (err) {
      console.log(err);
    });
    // window.history.replaceState(null, null, window.location.pathname);
  }
}

function fetchFile(url) {
  if (navigator.onLine) {
    showLoader();
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(data => {
        hideLoader();
        const layer = L.tileLayer.mbTiles(data, {
          autoScale: true,
          fitBounds: true,
          updateWhenIdle: false
        }).on("databaseloaded", function (e) {
          const name = layer.options.name ? layer.options.name : url.split("/").pop().split(".").slice(0, -1).join(".");
          const value = {
            "name": name,
            "mbtiles": data
          };
          mapStore.setItem(url, value).then(function (value) {
            addOverlayLayer(layer, name);
          }).catch(function (err) {
            alert("Error saving data!");
          });
        }).addTo(map);
        layers.overlays[L.Util.stamp(layer)] = layer;
      })
      .catch((error) => {
        hideLoader();
        console.error("Error:", error);
        alert("Error fetching remote file...");
      });
  } else {
    alert("Must be online to fetch data!");
    hideLoader();
  }
}

function updateNetworkStatus() {
  if (navigator.onLine) {
    document.getElementById("status").style.color = "green";
  } else {
    switchBaseLayer("Улицы");
    document.getElementById("status").style.color = "red";
  }
}

// Drag and drop files
const dropArea = document.getElementById("map");

["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
});

["dragenter", "dragover"].forEach(eventName => {
  dropArea.addEventListener(eventName, showLoader, false);
});

["dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, hideLoader, false);
});

dropArea.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  handleFile(file);
}, false);

window.addEventListener("offline", e => {
  updateNetworkStatus();
});

window.addEventListener("online", e => {
  updateNetworkStatus();
});

document.querySelector(".leaflet-control-layers-base").addEventListener("contextmenu", e => {
  e.preventDefault();
  let fileInput = L.DomUtil.create("input", "hidden");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    loadBasemapConfig(file);
    this.value = "";
  }, false);
  fileInput.click();
});

document.addEventListener("DOMContentLoaded", function () {
  showLoader();
  // controls.locateCtrl.start();
});

initSqlJs({
  locateFile: function () {
    return "assets/vendor/sqljs-1.5.0/sql-wasm.wasm";
  }
}).then(function (SQL) {
  loadURLparams();
  loadSavedMaps();
  if (localStorage.getItem("basemapConfig")) {
    loadCustomBasemaps(JSON.parse(localStorage.getItem("basemapConfig")));
  }
  if (!navigator.onLine) {
    switchBaseLayer("Улицы");
  } else if (localStorage.getItem("basemap")) {
    switchBaseLayer(localStorage.getItem("basemap"));
  }
  document.getElementsByClassName("leaflet-control-layers")[0].style.maxHeight = `${(document.getElementById("map").offsetHeight * .75)}px`;
  document.getElementsByClassName("leaflet-control-layers")[0].style.maxWidth = `${(document.getElementById("map").offsetWidth * .75)}px`;
});
