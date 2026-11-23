(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))l(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const g of r.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&l(g)}).observe(document,{childList:!0,subtree:!0});function i(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function l(t){if(t.ep)return;t.ep=!0;const r=i(t);fetch(t.href,r)}})();Cesium.Ellipsoid.default=Cesium.Ellipsoid.MOON;const n=new Cesium.Viewer("cesiumContainer",{baseLayer:!1,timeline:!1,animation:!0,baseLayerPicker:!1,geocoder:!1,shadows:!0}),u=n.scene;u.globe.show=!0;const w=2684829,m=document.createElement("div");m.id="local-toolbar";n.container.appendChild(m);function y(e,o){const i=document.createElement("button");i.textContent=e,i.addEventListener("click",o),m.appendChild(i)}function b(e,o,i){const l=document.createElement("label");l.className="toolbar-toggle";const t=document.createElement("input");t.type="checkbox",t.checked=o,t.addEventListener("change",()=>i(t.checked)),l.append(t,document.createTextNode(e)),m.appendChild(l)}function T(e){const o=document.createElement("select");o.setAttribute("aria-label","Fly to location"),o.add(new Option("Fly to location...","")),e.slice(1).forEach((i,l)=>{o.add(new Option(i.text,String(l+1)))}),o.addEventListener("change",()=>{const i=e[Number(o.value)];i&&(i.onselect(),o.value="")}),m.appendChild(o)}const h=NaN;if(Number.isInteger(h)&&h>0)try{const e=await Cesium.IonImageryProvider.fromAssetId(h);n.imageryLayers.addImageryProvider(e)}catch(e){console.error("Unable to load the Moon imagery asset:",e)}else{const e=document.createElement("small");e.textContent="Moon texture not configured. Set VITE_MOON_IMAGERY_ASSET_ID.",m.appendChild(e),console.warn("Moon imagery is not configured. Set VITE_MOON_IMAGERY_ASSET_ID to a Cesium ion lunar imagery asset ID.")}const d=[{id:"SP_875930_3125710",name:"Ibn Bajja / Haworth PSR",latitude:-87.593,longitude:312.571,color:Cesium.Color.CYAN},{id:"SP_874930_3578760",name:"Haworth Crater PSR",latitude:-87.493,longitude:357.876,color:Cesium.Color.YELLOW}];for(const e of d)n.entities.add({id:`lunar-ice-${e.id}`,name:e.name,position:Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,5e3),point:{pixelSize:13,color:e.color,outlineColor:Cesium.Color.BLACK,outlineWidth:2,disableDepthTestDistance:Number.POSITIVE_INFINITY},label:{text:e.name,font:"14px sans-serif",fillColor:Cesium.Color.WHITE,outlineColor:Cesium.Color.BLACK,outlineWidth:3,style:Cesium.LabelStyle.FILL_AND_OUTLINE,pixelOffset:new Cesium.Cartesian2(0,-22),disableDepthTestDistance:Number.POSITIVE_INFINITY}});function I(e){n.camera.flyTo({destination:Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude,3e4),orientation:{heading:Cesium.Math.toRadians(0),pitch:Cesium.Math.toRadians(-45),roll:0},duration:3})}y("Ibn Bajja PSR",function(){I(d[0])});y("Haworth PSR",function(){I(d[1])});y("Show Both Targets",function(){n.camera.flyTo({destination:Cesium.Cartesian3.fromDegrees(335,-87.3,18e4),orientation:{heading:0,pitch:Cesium.Math.toRadians(-90),roll:0},duration:3})});console.log("Lunar Ice Explorer: target locations added.");const N=d.map(e=>n.entities.getById(`lunar-ice-${e.id}`));function x(e,o){N.forEach(i=>{i&&i[e]&&(i[e].show=o)}),n.scene.requestRender()}b("Target points",!0,function(e){x("point",e)});b("Target labels",!0,function(e){x("label",e)});console.log("Lunar Ice Explorer: layer controls initialized.");const p=document.createElement("div");p.id="lunar-ice-info-panel";p.style.cssText=`
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
`;p.innerHTML=`
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
`;n.container.appendChild(p);const c=document.createElement("button");c.id="ice-reopen-panel";c.textContent="Open Ice Explorer";c.style.cssText=`
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
`;n.container.appendChild(c);document.getElementById("ice-close-panel").onclick=function(){p.style.display="none",c.style.display="block"};c.onclick=function(){p.style.display="block",c.style.display="none"};function E(e){const o=document.getElementById("ice-target-details");o.innerHTML=`
    <div style="font-weight:bold;color:#ffd166;margin-bottom:8px;">
      ${e.name}
    </div>

    <div style="font-size:12px;line-height:1.8;">
      <b>Target ID:</b><br>
      ${e.id}<br>
      <b>Latitude:</b> ${e.latitude}°<br>
      <b>Longitude:</b> ${e.longitude}°
    </div>

    <button id="ice-fly-to"
      style="margin-top:12px;width:100%;padding:7px;cursor:pointer;">
      Fly to this crater
    </button>
  `,document.getElementById("ice-fly-to").onclick=function(){I(e)}}document.getElementById("ice-target-1").onclick=function(){E(d[0])};document.getElementById("ice-target-2").onclick=function(){E(d[1])};E(d[0]);console.log("Lunar Ice Explorer: closable information panel initialized.");try{const e=await Cesium.Cesium3DTileset.fromIonAssetId(w,{enableCollision:!0});n.scene.primitives.add(e)}catch(e){console.error("Unable to load the Moon 3D Tiles asset:",e)}let f;try{const e=await Cesium.IonResource.fromAssetId(2683530);f=await Cesium.GeoJsonDataSource.load(e,{clampToGround:!0,fill:Cesium.Color.fromBytes(26,106,113).withAlpha(.6)}),f.show=!1,n.dataSources.add(f)}catch(e){console.error("Unable to load the mare boundaries asset:",e)}let a;try{const e=await Cesium.IonResource.fromAssetId(2683531);a=await Cesium.GeoJsonDataSource.load(e,{clampToGround:!0,fill:Cesium.Color.fromBytes(243,242,99).withAlpha(.6)}),a.show=!1,n.dataSources.add(a)}catch(e){console.error("Unable to load the Artemis landing regions asset:",e)}const S=[{text:"Apollo 11",latitude:.67416,longitude:23.47315},{text:"Apollo 14",latitude:-3.64417,longitude:342.52135},{text:"Apollo 15",latitude:26.13341,longitude:3.6285},{text:"Lunokhod 1",latitude:38.2378,longitude:-35.0017},{text:"Lunokhod 2",latitude:25.83232,longitude:30.92215}];for(const e of S)n.entities.add({position:Cesium.Cartesian3.fromDegrees(e.longitude,e.latitude),label:{text:e.text,font:"14pt Verdana",outlineColor:Cesium.Color.DARKSLATEGREY,outlineWidth:2,style:Cesium.LabelStyle.FILL_AND_OUTLINE,pixelOffset:new Cesium.Cartesian2(0,-22),scaleByDistance:new Cesium.NearFarScalar(150,1,15e6,.5),translucencyByDistance:new Cesium.NearFarScalar(25e6,1,4e7,0),heightReference:Cesium.HeightReference.CLAMP_TO_GROUND},point:{pixelSize:10,color:Cesium.Color.fromBytes(243,242,99),outlineColor:Cesium.Color.fromBytes(219,218,111),outlineWidth:2,scaleByDistance:new Cesium.NearFarScalar(1500,1,4e7,.1),heightReference:Cesium.HeightReference.CLAMP_TO_GROUND}});const L={destination:new Cesium.Cartesian3(2.1345949298812235e6,1.2564880678322134e6,379606.9284823841),orientation:{direction:new Cesium.Cartesian3(-.8518395698371783,-.5014189063342804,-.1514873843927112),up:new Cesium.Cartesian3(-.13054959630640847,-.07684549781463353,.9884591910493093)},easingFunction:Cesium.EasingFunction.LINEAR_NONE},A={destination:new Cesium.Cartesian3(1609100311044896e-9,733266.0643925276,53608.976740262646),orientation:{direction:new Cesium.Cartesian3(-.41704286323660256,-.7222280712427744,-.5517806297183315),up:new Cesium.Cartesian3(.8621189850799429,-.12210806245903304,-.49177278965720556)},easingFunction:Cesium.EasingFunction.LINEAR_NONE},O={destination:new Cesium.Cartesian3(1.6135728201475781e6,-677039.3827805589,339559.7958496013),orientation:{direction:new Cesium.Cartesian3(-.10007925201262617,.8771366500325052,-.4696971795597116),up:new Cesium.Cartesian3(.9948921707513932,.08196514973381885,-.058917593354560566)},easingFunction:Cesium.EasingFunction.LINEAR_NONE},v={destination:new Cesium.Cartesian3(1.3684133560818078e6,-166198.00035620513,-1.2035767397013502e6),orientation:{direction:new Cesium.Cartesian3(-.8601315724135887,-.5073902275496569,.05223825345888711),up:new Cesium.Cartesian3(.2639103814694499,-.5303301783281616,-.8056681776681204)},easingFunction:Cesium.EasingFunction.LINEAR_NONE},R={destination:Cesium.Rectangle.fromBoundingSphere(new Cesium.BoundingSphere(new Cesium.Cartesian3(-17505.087036391753,38147.40236305639,-1.7697215748224584e6),4e4)),orientation:{direction:new Cesium.Cartesian3(.2568703591904826,-.6405212914728244,.7237058060699372),up:new Cesium.Cartesian3(.26770932874967773,-.6723714327527822,-.6901075073627064)},easingFunction:Cesium.EasingFunction.LINEAR_NONE},D=Cesium.Math.toRadians(.1),s=n.scene.postRender.addEventListener(function(e,o){n.scene.camera.rotateRight(D)}),_=[{text:"Fly to...",onselect:()=>{}},{text:"Sea of Tranquility",onselect:function(){s(),u.camera.flyTo(L),a&&(a.show=!1)}},{text:"Apollo 11 Landing Site",onselect:()=>{s(),u.camera.flyTo(A),a&&(a.show=!1)}},{text:"Copernicus Crater",onselect:()=>{s(),u.camera.flyTo(O),a&&(a.show=!1)}},{text:"Tycho Crater",onselect:()=>{s(),u.camera.flyTo(v),a&&(a.show=!1)}},{text:"Shackleton Crater (South Pole) and Artemis 3 landing options",onselect:()=>{s(),u.camera.flyTo(R),a&&(a.show=!0)}}];T(_);b("Show Mare Boundaries",!1,function(e){f&&(f.show=e)});const C=new Cesium.ScreenSpaceEventHandler(n.scene.canvas);C.setInputAction(()=>s(),Cesium.ScreenSpaceEventType.LEFT_DOWN);C.setInputAction(()=>s(),Cesium.ScreenSpaceEventType.RIGHT_DOWN);C.setInputAction(()=>s(),Cesium.ScreenSpaceEventType.MIDDLE_DOWN);C.setInputAction(()=>s(),Cesium.ScreenSpaceEventType.WHEEL);
