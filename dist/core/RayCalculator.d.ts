import { VelocityModel } from "../models/VelocityModel";
export interface RayResult {
    time: number;
    distanceDeg: number;
    rayParam: number;
    takeoffAngle: number;
    incidentAngle: number;
    piercePoints: Array<{
        depth: number;
        distanceDeg: number;
        time: number;
    }>;
}
/**
 * Compute total travel time and epicentral distance (radians) for a ray
 * segment from depth d1 to depth d2 with ray parameter p.
 * The ray goes from d1 toward higher depth (downward) until turning,
 * but this function simply integrates the given depth interval.
 */
export declare const raySegment: (model: VelocityModel, p: number, fromDepth: number, toDepth: number, isS: boolean) => {
    T: number;
    X: number;
};
/**
 * Find turning depth for ray parameter p between minDepth and maxDepth.
 * The turning depth is where 1/v_flat(z) = p (flat-Earth transform).
 * v_flat(d) = v(d) * R / r(d)
 */
export declare const findTurningDepth: (model: VelocityModel, p: number, maxDepth: number, isS: boolean, minDepth?: number) => number | null;
/**
 * The ray parameter corresponding to a ray that turns exactly at `depth`.
 * p = r / (v_flat * R) = 1 / v_flat(depth)
 */
export declare const maxRayParam: (model: VelocityModel, depth: number, isS: boolean) => number;
/** Direct P or S wave turning in the mantle (or specified depth range). */
export declare const computeDirectRay: (model: VelocityModel, sourceDepth: number, distanceDeg: number, isS: boolean, maxSearchDepth: number) => RayResult | null;
/** PcP, ScS — wave reflected off a depth boundary without penetrating it. */
export declare const computeReflectedRay: (model: VelocityModel, sourceDepth: number, distanceDeg: number, isS: boolean, reflectorDepth: number) => RayResult | null;
/**
 * PP or SS — one surface bounce. Ray goes source→turn1→surface→turn2→receiver.
 * Both legs have the same ray parameter.
 */
export declare const computeSurfaceBounceRay: (model: VelocityModel, sourceDepth: number, distanceDeg: number, isS: boolean, maxSearchDepth: number) => RayResult | null;
/**
 * PKP / PKIKP — refracted through the outer core (and optionally inner core).
 * Mantle legs use P velocity; core leg uses P velocity in fluid outer core.
 */
export declare const computeCoreRefractedRay: (model: VelocityModel, sourceDepth: number, distanceDeg: number, topWaveIsS: boolean, cmbDepth: number, icbDepth: number, passesInnerCore: boolean) => RayResult | null;
/** PKiKP — reflected off the inner core boundary. */
export declare const computePKiKP: (model: VelocityModel, sourceDepth: number, distanceDeg: number, cmbDepth: number, icbDepth: number) => RayResult | null;
/** SKS — S in mantle, P in outer core, S back in mantle. */
export declare const computeSKS: (model: VelocityModel, sourceDepth: number, distanceDeg: number, cmbDepth: number, icbDepth: number) => RayResult | null;
/** SKKS — S in mantle, two legs in outer core with CMB bounce. */
export declare const computeSKKS: (model: VelocityModel, sourceDepth: number, distanceDeg: number, cmbDepth: number, icbDepth: number) => RayResult | null;
/** pP / sS — depth phase: upgoing from source, surface reflection, then direct. */
export declare const computeDepthPhase: (model: VelocityModel, sourceDepth: number, distanceDeg: number, isS: boolean, maxSearchDepth: number) => RayResult | null;
/** Pdiff / Sdiff — diffracted along the CMB. Valid for distances > ~97°. */
export declare const computeDiffractedRay: (model: VelocityModel, sourceDepth: number, distanceDeg: number, isS: boolean, cmbDepth: number) => RayResult | null;
//# sourceMappingURL=RayCalculator.d.ts.map