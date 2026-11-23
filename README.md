# Lunar Water-Ice Detection and Trajectory Planning

This project aims to identify potential water-ice deposits in lunar south-polar
permanently shadowed regions (PSRs), assess nearby terrain for safe landing,
and plan rover traverses between candidate landing areas and ice targets. The
goal is to bring lunar radar, imagery, and terrain data into a reproducible
analysis workflow, with an interactive 3D interface for exploring its results.

## Research objectives

- Analyze lunar radar observations to identify and map potential water-ice
  candidates in PSRs.
- Combine elevation, slope, roughness, illumination, and other terrain factors
  to evaluate landing-site safety.
- Rank candidate landing locations and plan feasible rover trajectories to
  areas of scientific interest.
- Where data and validated methods permit, estimate ice extent or volume and
  report uncertainty.

## Current status

The repository currently contains an early interactive lunar mapping
prototype. It can display configured lunar assets, target locations, and
landing-region overlays, but it does **not yet** process DFSAR/OHRC data,
classify water ice, calculate landing suitability, generate rover trajectories,
or estimate ice volume. Those are the project's research and development goals;
the interface is an initial component for visualizing relevant locations and
future analysis results.

## Prototype capabilities

- Moon-centered interactive map with optional lunar imagery and 3D Tiles hosted
  in Cesium ion.
- Target markers for:
  - Ibn Bajja / Haworth PSR (`SP_875930_3125710`)
  - Haworth Crater PSR (`SP_874930_3578760`)
- Controls for target markers and labels, navigation to points of interest, and
  mare-boundary visibility.
- An Artemis 3 landing-regions overlay, shown when navigating to Shackleton.
- A Lunar Ice Explorer information panel with target coordinates.

The panel's radar, ice-candidate, and terrain-analysis status entries are
placeholders; those datasets are not loaded by this prototype.

## Requirements

- Node.js 20.19+ or 22.12+
- A Cesium ion account and access token for the ion assets used by the app

## Setup

From the project directory:

```powershell
npm install
Copy-Item .env.example .env.local
```

Edit `.env.local` and set your Cesium ion token and imagery asset ID:

```dotenv
VITE_CESIUM_ION_ACCESS_TOKEN=your_public_read_only_token
VITE_MOON_TILES_ASSET_ID=2684829
VITE_MOON_IMAGERY_ASSET_ID=your_moon_imagery_asset_id
```

Start the development server:

```powershell
npm run dev
```

If PowerShell blocks the `npm` script, use `npm.cmd` instead:

```powershell
npm.cmd run dev
```

Open the local URL printed by Vite.

## Lunar map data configuration

The interactive map loads imagery and 3D Tiles separately:

- `VITE_MOON_TILES_ASSET_ID` is a Cesium ion **3D Tiles** asset ID. It defaults
  to `2684829`, the ID currently used by the project. Set it to an asset your
  token can access if that ID is not available in your account.
- `VITE_MOON_IMAGERY_ASSET_ID` must be set to an ion **imagery** asset covering
  the Moon. The globe's base layer is disabled, so without this setting the
  lunar surface texture will not load.

If you need these datasets, upload or select lunar data in Cesium ion and use
the asset IDs shown in your ion dashboard. A lunar imagery mosaic supplies
surface color; a 3D Tiles asset supplies geometry (and texture only if its tiles
include texture). The two asset types are not interchangeable.

The mare-boundary and Artemis regions currently use the project asset IDs
`2683530` and `2683531`. Your token must also be allowed to read those assets.
If an asset fails to load, check the browser console for the corresponding
error.

**Token safety:** Vite exposes `VITE_` variables in client-side code. Use a
public, read-only `assets:read` token and restrict it to the app's origin. Never
put a private or write-enabled token in `.env.local` or commit that file.
`.env.local` is excluded by `.gitignore`.

For details, see the [Cesium ion access-token guide](https://cesium.com/learn/ion/cesium-ion-access-tokens/),
[Ion imagery API](https://cesium.com/learn/cesiumjs/ref-doc/IonImageryProvider.html),
and [3D Tiles API](https://cesium.com/learn/cesiumjs/ref-doc/Cesium3DTileset.html).

## Controls

- Use the local toolbar to fly to either PSR target or other listed locations.
- Toggle target points, labels, and mare boundaries from the toolbar.
- Choose **Shackleton Crater (South Pole) and Artemis 3 landing options** to
  show the Artemis landing-region overlay.
- Use the Lunar Ice Explorer panel to view target coordinates or fly to a
  selected PSR. Close and reopen the panel with its controls.

## Planned analysis workflow

The intended research workflow includes:

1. Acquire and inspect DFSAR radar and OHRC or LOLA terrain data for selected
   south-polar targets.
2. Preprocess and align radar and terrain products.
3. Map PSRs and terrain that is permanently or doubly shadowed.
4. Evaluate radar polarization measures, including CPR and DOP, to produce
   candidate water-ice regions. Validate thresholds against published results
   and document limitations.
5. Combine terrain hazards and mission constraints to rank landing locations.
6. Plan and evaluate rover routes from candidate landing sites to areas of
   interest.
7. If supported by the data and validated methods, estimate ice abundance or
   volume and quantify uncertainty.

These are planned research steps, not implemented functionality in the current
prototype.

## Build and preview

Create a production build:

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Data sources noted in the application

- Mare boundaries: [LROC global mare shapefile](https://wms.lroc.asu.edu/lroc/view_rdr/SHAPEFILE_LROC_GLOBAL_MARE)
- Artemis 3 named regions: [GeoJSON source](https://files.actgate.com/lunar/A3_Named_regions.geojson)

Confirm the terms and attribution requirements of any source data and ion-hosted
assets before redistribution.
