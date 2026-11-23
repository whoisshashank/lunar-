import * as Cesium from "cesium";

import "./style.css";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Set the ellipsoid to be the moon before creating the viewer
Cesium.Ellipsoid.default = Cesium.Ellipsoid.MOON;

const ionAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN?.trim();
if (ionAccessToken) {
  Cesium.Ion.defaultAccessToken = ionAccessToken;
}

const viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayer: false,
  timeline: false,
  animation: true,
  baseLayerPicker: false,
  geocoder: false,
  shadows: true,
});

const scene = viewer.scene;
scene.globe.show = true;

const moonTilesAssetId =
  Number(import.meta.env.VITE_MOON_TILES_ASSET_ID) || 2684829;

const localToolbar = document.createElement("div");
localToolbar.id = "local-toolbar";
viewer.container.appendChild(localToolbar);

function addToolbarButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  localToolbar.appendChild(button);
}

function addToggleButton(text, checked, onChange) {
  const label = document.createElement("label");
  label.className = "toolbar-toggle";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  checkbox.addEventListener("change", () => onChange(checkbox.checked));

  label.append(checkbox, document.createTextNode(text));
  localToolbar.appendChild(label);
}

function addToolbarMenu(options) {
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Fly to location");
  select.add(new Option("Fly to location...", ""));
  options.slice(1).forEach((option, index) => {
    select.add(new Option(option.text, String(index + 1)));
  });
  select.addEventListener("change", () => {
    const option = options[Number(select.value)];
    if (option) {
      option.onselect();
      select.value = "";
    }
  });
  localToolbar.appendChild(select);
}

const moonImageryAssetId = Number(import.meta.env.VITE_MOON_IMAGERY_ASSET_ID);
if (Number.isInteger(moonImageryAssetId) && moonImageryAssetId > 0) {
  try {
    const imageryProvider =
      await Cesium.IonImageryProvider.fromAssetId(moonImageryAssetId);
    viewer.imageryLayers.addImageryProvider(imageryProvider);
  } catch (error) {
    console.error("Unable to load the Moon imagery asset:", error);
  }
} else {
  const imageryNotice = document.createElement("small");
  imageryNotice.textContent =
    "Moon texture not configured. Set VITE_MOON_IMAGERY_ASSET_ID.";
  localToolbar.appendChild(imageryNotice);
  console.warn(
    "Moon imagery is not configured. Set VITE_MOON_IMAGERY_ASSET_ID to a Cesium ion lunar imagery asset ID.",
  );
}



// LUNAR ICE EXPLORER TARGET CRATERS 


const lunarIceTargets = [
  {
    id: "SP_875930_3125710",
    name: "Ibn Bajja / Haworth PSR",
    latitude: -87.593,
    longitude: 312.571,
    color: Cesium.Color.CYAN,
  },
  {
    id: "SP_874930_3578760",
    name: "Haworth Crater PSR",
    latitude: -87.493,
    longitude: 357.876,
    color: Cesium.Color.YELLOW,
  },
];

// Add a visible locator for each target
for (const target of lunarIceTargets) {
  viewer.entities.add({
    id: `lunar-ice-${target.id}`,
    name: target.name,
    position: Cesium.Cartesian3.fromDegrees(
      target.longitude,
      target.latitude,
      5000
    ),
    point: {
      pixelSize: 13,
      color: target.color,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    label: {
      text: target.name,
      font: "14px sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 3,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -22),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
}

// Reusable camera navigation function
function flyToLunarIceTarget(target) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      target.longitude,
      target.latitude,
      30000
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45),
      roll: 0,
    },
    duration: 3,
  });
}

// Add navigation buttons to the local toolbar
addToolbarButton("Ibn Bajja PSR", function () {
  flyToLunarIceTarget(lunarIceTargets[0]);
});

addToolbarButton("Haworth PSR", function () {
  flyToLunarIceTarget(lunarIceTargets[1]);
});

addToolbarButton("Show Both Targets", function () {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      335,
      -87.3,
      180000
    ),
    orientation: {
      heading: 0,
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
    duration: 3,
  });
});

console.log("Lunar Ice Explorer: target locations added.");



//  LAYER VISIBILITY CONTROLS



const targetEntities = lunarIceTargets.map((target) =>
  viewer.entities.getById(`lunar-ice-${target.id}`)
);


function setTargetLayerVisibility(graphicType, visible) {
  targetEntities.forEach((entity) => {
    if (entity && entity[graphicType]) {
      entity[graphicType].show = visible;
    }
  });

  viewer.scene.requestRender();
}


addToggleButton(
  "Target points",
  true,
  function (checked) {
    setTargetLayerVisibility("point", checked);
  }
);


addToggleButton(
  "Target labels",
  true,
  function (checked) {
    setTargetLayerVisibility("label", checked);
  }
);

console.log("Lunar Ice Explorer: layer controls initialized.");


 
 
 

const lunarIceInfoPanel = document.createElement("div");

lunarIceInfoPanel.id = "lunar-ice-info-panel";

lunarIceInfoPanel.style.cssText = `
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 290px;
  padding: 16px;
  background: rgba(10, 20, 35, 0.92);
  color: white;
  border: 1px solid #36c5d8;
  border-radius: 8px;
  font-family: sans-serif;
  z-index: 1000;
  box-shadow: 0 3px 12px rgba(0,0,0,0.5);
`;


lunarIceInfoPanel.innerHTML = `
  <button id="ice-close-panel"
    title="Close information panel"
    style="position:absolute;top:8px;right:10px;
    background:transparent;border:none;color:white;
    font-size:23px;cursor:pointer;">
    &times;
  </button>

  <h3 style="margin:0 30px 12px 0;color:#36c5d8;">
    Lunar Ice Explorer
  </h3>

  <div style="margin-bottom:12px;">
    <button id="ice-target-1">Target 1</button>
    <button id="ice-target-2">Target 2</button>
  </div>

  <hr style="border-color:#456;">

  <div id="ice-target-details">
    Select a target to view its information.
  </div>

  <hr style="border-color:#456;">

  <div style="font-size:12px;color:#ffd166;">
    Dataset status
  </div>

  <div style="font-size:12px;margin-top:5px;">
    PSR boundary: Not loaded<br>
    Radar data: Not loaded<br>
    Ice candidate map: Not loaded<br>
    Terrain analysis: Not loaded
  </div>
`;


viewer.container.appendChild(lunarIceInfoPanel);

 
const lunarIceReopenButton = document.createElement("button");

lunarIceReopenButton.id = "ice-reopen-panel";
lunarIceReopenButton.textContent = "Open Ice Explorer";

lunarIceReopenButton.style.cssText = `
  position:absolute;
  bottom:15px;
  right:15px;
  display:none;
  padding:9px 13px;
  background:#102b40;
  color:white;
  border:1px solid #36c5d8;
  border-radius:6px;
  cursor:pointer;
  z-index:1001;
`;

viewer.container.appendChild(lunarIceReopenButton);


document.getElementById("ice-close-panel").onclick = function () {
  lunarIceInfoPanel.style.display = "none";
  lunarIceReopenButton.style.display = "block";
};


lunarIceReopenButton.onclick = function () {
  lunarIceInfoPanel.style.display = "block";
  lunarIceReopenButton.style.display = "none";
};


function showLunarIceTargetInfo(target) {
  const details = document.getElementById("ice-target-details");

  details.innerHTML = `
    <div style="font-weight:bold;color:#ffd166;margin-bottom:8px;">
      ${target.name}
    </div>

    <div style="font-size:12px;line-height:1.8;">
      <b>Target ID:</b><br>
      ${target.id}<br>
      <b>Latitude:</b> ${target.latitude}°<br>
      <b>Longitude:</b> ${target.longitude}°
    </div>

    <button id="ice-fly-to"
      style="margin-top:12px;width:100%;padding:7px;cursor:pointer;">
      Fly to this crater
    </button>
  `;

  document.getElementById("ice-fly-to").onclick = function () {
    flyToLunarIceTarget(target);
  };
}


document.getElementById("ice-target-1").onclick = function () {
  showLunarIceTargetInfo(lunarIceTargets[0]);
};

document.getElementById("ice-target-2").onclick = function () {
  showLunarIceTargetInfo(lunarIceTargets[1]);
};


showLunarIceTargetInfo(lunarIceTargets[0]);

console.log("Lunar Ice Explorer: closable information panel initialized.");



try {
  const tileset1 = await Cesium.Cesium3DTileset.fromIonAssetId(moonTilesAssetId, {
    // Allow clamp to 3D Tiles
    enableCollision: true,
  });
  viewer.scene.primitives.add(tileset1);
} catch (error) {
  console.error("Unable to load the Moon 3D Tiles asset:", error);
}

// Boundary data from https://wms.lroc.asu.edu/lroc/view_rdr/SHAPEFILE_LROC_GLOBAL_MARE
let boundarySource;
try {
  const boundariesResource = await Cesium.IonResource.fromAssetId(2683530);
  boundarySource = await Cesium.GeoJsonDataSource.load(boundariesResource, {
    clampToGround: true,
    fill: Cesium.Color.fromBytes(26, 106, 113).withAlpha(0.6),
  });
  boundarySource.show = false;
  viewer.dataSources.add(boundarySource);
} catch (error) {
  console.error("Unable to load the mare boundaries asset:", error);
}

// Possible Artemis 3 landing locations. data from https://files.actgate.com/lunar/A3_Named_regions.geojson
let artemis3Source;
try {
  const artemis3resource = await Cesium.IonResource.fromAssetId(2683531);
  artemis3Source = await Cesium.GeoJsonDataSource.load(artemis3resource, {
    clampToGround: true,
    fill: Cesium.Color.fromBytes(243, 242, 99).withAlpha(0.6),
  });
  artemis3Source.show = false;
  viewer.dataSources.add(artemis3Source);
} catch (error) {
  console.error("Unable to load the Artemis landing regions asset:", error);
}

// Positions courtesy of https://www.sciencedirect.com/science/article/abs/pii/S0019103516301518?via%3Dihub
const pointsOfInterest = [
  {
    text: "Apollo 11",
    latitude: 0.67416,
    longitude: 23.47315,
  },
  {
    text: "Apollo 14",
    latitude: -3.64417,
    longitude: 342.52135,
  },
  {
    text: "Apollo 15",
    latitude: 26.13341,
    longitude: 3.6285,
  },
  {
    text: "Lunokhod 1",
    latitude: 38.2378,
    longitude: -35.0017,
  },
  {
    text: "Lunokhod 2",
    latitude: 25.83232,
    longitude: 30.92215,
  },
];

for (const poi of pointsOfInterest) {
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(poi.longitude, poi.latitude),
    label: {
      text: poi.text,
      font: "14pt Verdana",
      outlineColor: Cesium.Color.DARKSLATEGREY,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -22),
      scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
      translucencyByDistance: new Cesium.NearFarScalar(2.5e7, 1.0, 4.0e7, 0.0),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
    point: {
      pixelSize: 10,
      color: Cesium.Color.fromBytes(243, 242, 99),
      outlineColor: Cesium.Color.fromBytes(219, 218, 111),
      outlineWidth: 2,
      scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 4.0e7, 0.1),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
}

const seaOfTranquility = {
  destination: new Cesium.Cartesian3(
    2134594.9298812235,
    1256488.0678322134,
    379606.9284823841,
  ),
  orientation: {
    direction: new Cesium.Cartesian3(
      -0.8518395698371783,
      -0.5014189063342804,
      -0.1514873843927112,
    ),
    up: new Cesium.Cartesian3(
      -0.13054959630640847,
      -0.07684549781463353,
      0.9884591910493093,
    ),
  },
  easingFunction: Cesium.EasingFunction.LINEAR_NONE,
};

const apollo11 = {
  destination: new Cesium.Cartesian3(
    1609100.311044896,
    733266.0643925276,
    53608.976740262646,
  ),
  orientation: {
    direction: new Cesium.Cartesian3(
      -0.41704286323660256,
      -0.7222280712427744,
      -0.5517806297183315,
    ),
    up: new Cesium.Cartesian3(
      0.8621189850799429,
      -0.12210806245903304,
      -0.49177278965720556,
    ),
  },
  easingFunction: Cesium.EasingFunction.LINEAR_NONE,
};

const copernicus = {
  destination: new Cesium.Cartesian3(
    1613572.8201475781,
    -677039.3827805589,
    339559.7958496013,
  ),
  orientation: {
    direction: new Cesium.Cartesian3(
      -0.10007925201262617,
      0.8771366500325052,
      -0.4696971795597116,
    ),
    up: new Cesium.Cartesian3(
      0.9948921707513932,
      0.08196514973381885,
      -0.058917593354560566,
    ),
  },
  easingFunction: Cesium.EasingFunction.LINEAR_NONE,
};

const tycho = {
  destination: new Cesium.Cartesian3(
    1368413.3560818078,
    -166198.00035620513,
    -1203576.7397013502,
  ),
  orientation: {
    direction: new Cesium.Cartesian3(
      -0.8601315724135887,
      -0.5073902275496569,
      0.05223825345888711,
    ),
    up: new Cesium.Cartesian3(
      0.2639103814694499,
      -0.5303301783281616,
      -0.8056681776681204,
    ),
  },
  easingFunction: Cesium.EasingFunction.LINEAR_NONE,
};

const shackleton = {
  destination: Cesium.Rectangle.fromBoundingSphere(
    new Cesium.BoundingSphere(
      new Cesium.Cartesian3(
        -17505.087036391753,
        38147.40236305639,
        -1769721.5748224584,
      ),
      40000.0,
    ),
  ),
  orientation: {
    direction: new Cesium.Cartesian3(
      0.2568703591904826,
      -0.6405212914728244,
      0.7237058060699372,
    ),
    up: new Cesium.Cartesian3(
      0.26770932874967773,
      -0.6723714327527822,
      -0.6901075073627064,
    ),
  },
  easingFunction: Cesium.EasingFunction.LINEAR_NONE,
};

const rotationSpeed = Cesium.Math.toRadians(0.1);
const removeRotation = viewer.scene.postRender.addEventListener(
  function (scene, time) {
    viewer.scene.camera.rotateRight(rotationSpeed);
  },
);

const options1 = [
  {
    text: "Fly to...",
    onselect: () => {},
  },
  {
    text: "Sea of Tranquility",
    onselect: function () {
      removeRotation();
      scene.camera.flyTo(seaOfTranquility);
      if (artemis3Source) artemis3Source.show = false;
    },
  },
  {
    text: "Apollo 11 Landing Site",
    onselect: () => {
      removeRotation();
      scene.camera.flyTo(apollo11);
      if (artemis3Source) artemis3Source.show = false;
    },
  },
  {
    text: "Copernicus Crater",
    onselect: () => {
      removeRotation();
      scene.camera.flyTo(copernicus);
      if (artemis3Source) artemis3Source.show = false;
    },
  },
  {
    text: "Tycho Crater",
    onselect: () => {
      removeRotation();
      scene.camera.flyTo(tycho);
      if (artemis3Source) artemis3Source.show = false;
    },
  },
  {
    text: "Shackleton Crater (South Pole) and Artemis 3 landing options",
    onselect: () => {
      removeRotation();
      scene.camera.flyTo(shackleton);
      if (artemis3Source) artemis3Source.show = true;
    },
  },
];
addToolbarMenu(options1);

addToggleButton("Show Mare Boundaries", false, function (checked) {
  if (boundarySource) boundarySource.show = checked;
});

// Spin the moon on first load but disable the spinning upon any input
const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(
  () => removeRotation(),
  Cesium.ScreenSpaceEventType.LEFT_DOWN,
);
handler.setInputAction(
  () => removeRotation(),
  Cesium.ScreenSpaceEventType.RIGHT_DOWN,
);
handler.setInputAction(
  () => removeRotation(),
  Cesium.ScreenSpaceEventType.MIDDLE_DOWN,
);
handler.setInputAction(
  () => removeRotation(),
  Cesium.ScreenSpaceEventType.WHEEL,
);
