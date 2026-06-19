/**
 * Flat-Earth transformation utilities for the tau-p method.
 *
 * The flat-Earth transform maps spherical geometry to plane geometry:
 *   z_flat = R * ln(R/r)       (flat depth from surface)
 *   v_flat = v(r) * R/r        (transformed velocity)
 *
 * This preserves the ray parameter p = sin(i)/v and the travel-time
 * equations become those for a flat Earth.
 *
 * In flat-Earth coordinates:
 *   dT/dz = u² / η    (u = 1/v_flat, η = sqrt(u² − p²))
 *   dx/dz = p  / η    (x in km)
 *
 * Epicentral angle (radians) = x_flat / R
 */
export declare const EARTH_RADIUS = 6371;
export declare function depthToRadius(depth: number, earthRadius?: number): number;
export declare function flattenVelocity(v: number, depth: number, earthRadius?: number): number;
export declare function flattenDepth(depth: number, earthRadius?: number): number;
/** Vertical flat-Earth slowness. Returns 0 when p >= u (turning ray). */
export declare function eta(u: number, p: number): number;
/**
 * Integrate travel time (seconds) and epicentral angle (radians) through one
 * velocity layer using the flat-Earth transform.
 *
 * Uses the exact analytical antiderivatives under the linear-u-in-flat-z
 * approximation, which avoids all numerical near-singularity issues at
 * the turning depth and at layer boundaries where p ≈ u2.
 *
 * Antiderivative of u²/√(u²−p²) : F_T(u) = u√(u²−p²)/2 + p²/2·arccosh(u/p)
 * Antiderivative of 1/√(u²−p²)  : F_X(u) = arccosh(u/p)
 *
 * Both vanish at u = p, so the singular point is handled naturally.
 */
export declare function integrateLayer(p: number, topDepth: number, botDepth: number, topV: number, botV: number, earthRadius?: number): {
    dT: number;
    dX: number;
};
//# sourceMappingURL=integration.d.ts.map