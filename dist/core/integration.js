"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EARTH_RADIUS = void 0;
exports.depthToRadius = depthToRadius;
exports.flattenVelocity = flattenVelocity;
exports.flattenDepth = flattenDepth;
exports.eta = eta;
exports.integrateLayer = integrateLayer;
exports.EARTH_RADIUS = 6371.0;
function depthToRadius(depth, earthRadius = exports.EARTH_RADIUS) {
    return earthRadius - depth;
}
function flattenVelocity(v, depth, earthRadius = exports.EARTH_RADIUS) {
    const r = depthToRadius(depth, earthRadius);
    return v * (earthRadius / r);
}
function flattenDepth(depth, earthRadius = exports.EARTH_RADIUS) {
    const r = depthToRadius(depth, earthRadius);
    return earthRadius * Math.log(earthRadius / r);
}
/** Vertical flat-Earth slowness. Returns 0 when p >= u (turning ray). */
function eta(u, p) {
    const v = u * u - p * p;
    return v > 0 ? Math.sqrt(v) : 0;
}
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
function integrateLayer(p, topDepth, botDepth, topV, botV, earthRadius = exports.EARTH_RADIUS) {
    if (botDepth - topDepth < 1e-9)
        return { dT: 0, dX: 0 };
    const R = earthRadius;
    const r1 = depthToRadius(topDepth, R);
    const r2 = depthToRadius(botDepth, R);
    const v1f = topV * (R / r1);
    const v2f = botV * (R / r2);
    const z1 = R * Math.log(R / r1);
    const z2 = R * Math.log(R / r2);
    const dz = z2 - z1;
    if (dz < 1e-9)
        return { dT: 0, dX: 0 };
    const u1 = 1 / v1f;
    const u2 = 1 / v2f;
    // Layer entirely below turning depth
    if (u1 <= p)
        return { dT: 0, dX: 0 };
    // Lower integration bound in u-space: stop at turning point if ray turns
    // inside this layer, otherwise integrate down to u2.
    const u_bot = Math.max(u2, p);
    // |b| = (u1 − u2) / dz  (positive: u decreases as flat-z increases)
    const b_abs = (u1 - u2) / dz;
    if (b_abs < 1e-14) {
        // Degenerate constant-velocity layer: use mid-layer formula
        const eta_mid = Math.sqrt(Math.max(0, u1 * u1 - p * p));
        if (eta_mid < 1e-14)
            return { dT: 0, dX: 0 };
        return { dT: u1 * u1 / eta_mid * dz, dX: p / eta_mid * dz / R };
    }
    const F_T = (u) => {
        if (u <= p)
            return 0;
        const q = Math.sqrt(u * u - p * p);
        return u * q / 2 + p * p / 2 * Math.acosh(u / p);
    };
    const F_X = (u) => {
        if (u <= p)
            return 0;
        return Math.acosh(u / p);
    };
    const dT = (F_T(u1) - F_T(u_bot)) / b_abs;
    const dX = p * (F_X(u1) - F_X(u_bot)) / b_abs / R;
    return { dT, dX };
}
//# sourceMappingURL=integration.js.map