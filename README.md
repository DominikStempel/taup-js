# taup-js

Seismic travel-time calculator for JavaScript and TypeScript, implementing the TauP method with the IASP91, AK135, and PREM reference Earth models.

## Installation

```bash
npm install taup-js
```

## Quick start

```typescript
import { TauPTime } from "taup-js";

const taup = new TauPTime(); // defaults to IASP91

const arrivals = taup.calculate(
  10,    // source depth (km)
  60,    // epicentral distance (degrees)
  ["P", "S", "PcP"]
);

for (const a of arrivals) {
  console.log(`${a.phase}: ${a.time.toFixed(1)} s`);
}
// P:   594.3 s
// PcP: 681.2 s
// S:   978.6 s
```

## API

### `new TauPTime(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `model` | `"iasp91" \| "ak135" \| "prem" \| VelocityModelData` | `"iasp91"` | Velocity model to use |

### `.calculate(sourceDepth, distanceDeg, phases?)`

Returns `Arrival[]` sorted by arrival time.

- `sourceDepth` — source depth in km (0 = surface)
- `distanceDeg` — epicentral distance in degrees (0–360)
- `phases` — array of phase names (default: `["P", "S"]`)

### `.calculateAll(sourceDepth, distanceDeg)`

Calculates all supported phases. Equivalent to calling `.calculate()` with `TauPTime.supportedPhases()`.

### `.calculatePhase(phaseName, sourceDepth, distanceDeg)`

Calculates a single named phase. Returns `Arrival | null` if the phase does not arrive at that distance.

### `.velocityAt(depth, waveType)`

Returns the P or S velocity (km/s) at a given depth in the current model.

```typescript
taup.velocityAt(35, "P");  // velocity just below the Moho
```

### Static methods

```typescript
TauPTime.supportedPhases()  // string[]
TauPTime.supportedModels()  // ["iasp91", "ak135", "prem"]
```

## Arrival object

```typescript
interface Arrival {
  phase: string;          // e.g. "P", "PKP"
  time: number;           // travel time in seconds
  rayParam: number;       // ray parameter in s/km
  takeoffAngle: number;   // angle at source (degrees from vertical)
  incidentAngle: number;  // angle at receiver (degrees from vertical)
  distanceDeg: number;    // actual computed distance in degrees
  sourceDepth: number;    // source depth in km
  piercePoints?: PiercePoint[];
}
```

## Supported phases

| Phase | Description |
|-------|-------------|
| `P`, `S` | Direct P and S waves through the mantle |
| `PP`, `SS` | Surface-reflected P and S |
| `PcP`, `ScS`, `ScP` | Reflections off the core-mantle boundary |
| `PKP`, `PKIKP` | P wave through the outer/inner core |
| `PKiKP` | P wave reflected off the inner core boundary |
| `SKS`, `SKKS` | S–P conversion through the outer core |
| `pP`, `sS` | Depth phases (upgoing leg from source) |
| `Pdiff`, `Sdiff` | Waves diffracted along the CMB (~97°–170°) |

## Velocity models

```typescript
import { TauPTime } from "taup-js";

const ak = new TauPTime({ model: "ak135" });
const prem = new TauPTime({ model: "prem" });
```

## Custom velocity model

Pass a `VelocityModelData` object directly:

```typescript
import { TauPTime, VelocityModelData } from "taup-js";

const model: VelocityModelData = {
  name: "simple",
  earthRadius: 6371,
  mohoDepth: 35,
  cmbDepth: 2889,
  icbDepth: 5154,
  layers: [
    { topDepth: 0,  botDepth: 35,   topVp: 6.0, botVp: 6.0, topVs: 3.5, botVs: 3.5, topDensity: 2.7, botDensity: 2.7 },
    { topDepth: 35, botDepth: 2889, topVp: 8.0, botVp: 13.7, topVs: 4.5, botVs: 7.3, topDensity: 3.3, botDensity: 5.6 },
    // ...
  ],
};

const taup = new TauPTime({ model });
```

Each layer uses linear interpolation of Vp, Vs, and density between `topDepth` and `botDepth`.

## Method

Travel times are computed using the **flat-Earth tau-p method**:

- Velocities are transformed to a flat-Earth equivalent (`v_flat = v · R/r`)
- Layer integrals are solved with exact analytical antiderivatives, avoiding numerical issues near turning depths
- Ray parameter inversion uses a 300-point grid scan followed by bisection, which correctly handles triplications and shadow zones
- All results represent **first arrivals** on each phase branch

