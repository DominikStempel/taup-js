"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raySegment = raySegment;
exports.findTurningDepth = findTurningDepth;
exports.maxRayParam = maxRayParam;
exports.computeDirectRay = computeDirectRay;
exports.computeReflectedRay = computeReflectedRay;
exports.computeSurfaceBounceRay = computeSurfaceBounceRay;
exports.computeCoreRefractedRay = computeCoreRefractedRay;
exports.computePKiKP = computePKiKP;
exports.computeSKS = computeSKS;
exports.computeSKKS = computeSKKS;
exports.computeDepthPhase = computeDepthPhase;
exports.computeDiffractedRay = computeDiffractedRay;
const integration_1 = require("./integration");
/**
 * Compute total travel time and epicentral distance (radians) for a ray
 * segment from depth d1 to depth d2 with ray parameter p.
 * The ray goes from d1 toward higher depth (downward) until turning,
 * but this function simply integrates the given depth interval.
 */
function raySegment(model, p, fromDepth, toDepth, isS) {
    let T = 0;
    let X = 0;
    const d1 = Math.min(fromDepth, toDepth);
    const d2 = Math.max(fromDepth, toDepth);
    for (const layer of model.layers) {
        if (layer.botDepth <= d1 + 1e-9 || layer.topDepth >= d2 - 1e-9)
            continue;
        const segTop = Math.max(layer.topDepth, d1);
        const segBot = Math.min(layer.botDepth, d2);
        if (segBot - segTop < 1e-9)
            continue;
        const topV = layer.velocityAt(segTop, isS);
        const botV = layer.velocityAt(segBot, isS);
        if (topV <= 0 || botV <= 0)
            continue;
        const { dT, dX } = (0, integration_1.integrateLayer)(p, segTop, segBot, topV, botV, model.earthRadius);
        T += dT;
        X += dX;
    }
    return { T, X };
}
/**
 * Find turning depth for ray parameter p between minDepth and maxDepth.
 * The turning depth is where 1/v_flat(z) = p (flat-Earth transform).
 * v_flat(d) = v(d) * R / r(d)
 */
function findTurningDepth(model, p, maxDepth, isS, minDepth = 0) {
    const R = model.earthRadius;
    for (const layer of model.layers) {
        if (layer.botDepth <= minDepth + 1e-9 || layer.topDepth >= maxDepth - 1e-9)
            continue;
        if (isS && layer.topVs <= 0 && layer.botVs <= 0)
            continue;
        const segTop = Math.max(layer.topDepth, minDepth);
        const segBot = Math.min(layer.botDepth, maxDepth);
        const r1 = (0, integration_1.depthToRadius)(segTop, R);
        const r2 = (0, integration_1.depthToRadius)(segBot, R);
        const v1 = layer.velocityAt(segTop, isS);
        const v2 = layer.velocityAt(segBot, isS);
        if (v1 <= 0 || v2 <= 0)
            continue;
        const u1 = 1 / (v1 * (R / r1)); // = r1/(v1*R)
        const u2 = 1 / (v2 * (R / r2)); // = r2/(v2*R)
        if (u1 >= p && u2 <= p) {
            if (Math.abs(u1 - u2) < 1e-14)
                return segTop;
            const frac = (p - u2) / (u1 - u2);
            return segBot - frac * (segBot - segTop);
        }
    }
    return null;
}
/**
 * The ray parameter corresponding to a ray that turns exactly at `depth`.
 * p = r / (v_flat * R) = 1 / v_flat(depth)
 */
function maxRayParam(model, depth, isS) {
    const R = model.earthRadius;
    const r = (0, integration_1.depthToRadius)(depth, R);
    const v = model.velocityAt(depth, isS);
    if (v <= 0)
        return 0;
    return r / (v * R);
}
/**
 * Compute epicentral distance (radians) for a ray with parameter p that:
 *  - starts downward from sourceDepth
 *  - turns somewhere in [sourceDepth, maxSearchDepth]
 *  - comes back up to surface (depth = 0)
 */
function directRayDistance(model, p, sourceDepth, maxSearchDepth, isS) {
    const turnDepth = findTurningDepth(model, p, maxSearchDepth, isS, sourceDepth);
    if (turnDepth === null)
        return null;
    const { X: Xdown } = raySegment(model, p, sourceDepth, turnDepth, isS);
    const { X: Xup } = raySegment(model, p, 0, turnDepth, isS);
    return Xdown + Xup;
}
/**
 * Find the ray parameter p in [pMin, pMax] that gives targetX radians.
 *
 * The X(p) relationship can be non-monotonic (triplications) and has null
 * gaps where velocity discontinuities make no turning ray exist.  We handle
 * both by doing a coarse grid search first, then bisecting the found bracket.
 *
 * Returns the p of the FIRST arrival (deepest-turning, largest X for given p
 * on the first branch) — i.e., the earliest crossing when iterating from the
 * smallest-p end.
 */
function bisectRayParam(computeX, pMin, pMax, targetX) {
    // --- Phase 1: grid search ---
    const N = 300;
    const valid = [];
    for (let i = 0; i <= N; i++) {
        const p = pMin + (pMax - pMin) * (i / N);
        const x = computeX(p);
        if (x !== null)
            valid.push({ p, x });
    }
    if (valid.length < 2)
        return null;
    // Find the first bracket (in p-order) where X crosses targetX.
    // "First" means smallest p, which corresponds to the deepest turning ray
    // (first arrival at the given distance).
    let bracketLo = null;
    let bracketHi = null;
    for (let i = 1; i < valid.length; i++) {
        const a = valid[i - 1];
        const b = valid[i];
        if ((a.x - targetX) * (b.x - targetX) <= 0) {
            bracketLo = a;
            bracketHi = b;
            break;
        }
    }
    if (!bracketLo || !bracketHi)
        return null;
    // --- Phase 2: bisect within the valid bracket ---
    let loP = bracketLo.p, loX = bracketLo.x;
    let hiP = bracketHi.p, hiX = bracketHi.x;
    for (let i = 0; i < 60; i++) {
        const pMid = (loP + hiP) / 2;
        const xMid = computeX(pMid);
        if (xMid === null) {
            // Midpoint landed in a null gap — nudge 90% toward the lo side
            const pNudge = loP + (pMid - loP) * 0.9;
            const xNudge = computeX(pNudge);
            if (xNudge !== null) {
                if ((xNudge - targetX) * (loX - targetX) > 0) {
                    loP = pNudge;
                    loX = xNudge;
                }
                else {
                    hiP = pNudge;
                    hiX = xNudge;
                }
            }
            continue;
        }
        if (Math.abs(xMid - targetX) < 1e-8)
            return pMid;
        if ((xMid - targetX) * (loX - targetX) > 0) {
            loP = pMid;
            loX = xMid;
        }
        else {
            hiP = pMid;
            hiX = xMid;
        }
    }
    return (loP + hiP) / 2;
}
function toAngle(p, depth, model, isS) {
    const R = model.earthRadius;
    const r = (0, integration_1.depthToRadius)(depth, R);
    const v = model.velocityAt(depth, isS);
    const vf = v * (R / r);
    const sinA = Math.min(1, p * vf);
    return Math.asin(sinA) * (180 / Math.PI);
}
/** Direct P or S wave turning in the mantle (or specified depth range). */
function computeDirectRay(model, sourceDepth, distanceDeg, isS, maxSearchDepth) {
    const targetX = (distanceDeg * Math.PI) / 180;
    // p range: rays that turn from just above maxSearchDepth up to just below source
    const pMin = maxRayParam(model, maxSearchDepth, isS) * 1.0001;
    const pMax = maxRayParam(model, sourceDepth, isS) * 0.9999;
    if (pMin >= pMax)
        return null;
    const p = bisectRayParam(pp => directRayDistance(model, pp, sourceDepth, maxSearchDepth, isS), pMin, pMax, targetX);
    if (p === null)
        return null;
    const turnDepth = findTurningDepth(model, p, maxSearchDepth, isS, sourceDepth);
    if (turnDepth === null)
        return null;
    const { T: Tdown, X: Xdown } = raySegment(model, p, sourceDepth, turnDepth, isS);
    const { T: Tup, X: Xup } = raySegment(model, p, 0, turnDepth, isS);
    const T = Tdown + Tup;
    const X = Xdown + Xup;
    const takeoffAngle = toAngle(p, sourceDepth, model, isS);
    const incidentAngle = toAngle(p, 0, model, isS);
    return {
        time: T,
        distanceDeg: (X * 180) / Math.PI,
        rayParam: p,
        takeoffAngle,
        incidentAngle,
        piercePoints: [
            { depth: sourceDepth, distanceDeg: 0, time: 0 },
            { depth: turnDepth, distanceDeg: (Xdown * 180) / Math.PI, time: Tdown },
            { depth: 0, distanceDeg: (X * 180) / Math.PI, time: T },
        ]
    };
}
/** PcP, ScS — wave reflected off a depth boundary without penetrating it. */
function computeReflectedRay(model, sourceDepth, distanceDeg, isS, reflectorDepth) {
    const targetX = (distanceDeg * Math.PI) / 180;
    const R = model.earthRadius;
    const computeX = (p) => {
        const r_ref = (0, integration_1.depthToRadius)(reflectorDepth, R);
        const v_ref = model.velocityAt(reflectorDepth, isS);
        if (v_ref <= 0)
            return null;
        const vf_ref = v_ref * (R / r_ref);
        if (p >= 1 / vf_ref)
            return null;
        const { X: X1 } = raySegment(model, p, sourceDepth, reflectorDepth, isS);
        const { X: X2 } = raySegment(model, p, 0, reflectorDepth, isS);
        return X1 + X2;
    };
    // Rays that arrive at reflector: p < u_ref, but must also be achievable from source
    const pMax = maxRayParam(model, sourceDepth, isS) * 0.9999;
    const pMin = 1e-6;
    const p = bisectRayParam(computeX, pMin, pMax, targetX);
    if (p === null)
        return null;
    const { T: T1, X: X1 } = raySegment(model, p, sourceDepth, reflectorDepth, isS);
    const { T: T2, X: X2 } = raySegment(model, p, 0, reflectorDepth, isS);
    const T = T1 + T2;
    const X = X1 + X2;
    return {
        time: T,
        distanceDeg: (X * 180) / Math.PI,
        rayParam: p,
        takeoffAngle: toAngle(p, sourceDepth, model, isS),
        incidentAngle: toAngle(p, 0, model, isS),
        piercePoints: [
            { depth: sourceDepth, distanceDeg: 0, time: 0 },
            { depth: reflectorDepth, distanceDeg: (X1 * 180) / Math.PI, time: T1 },
            { depth: 0, distanceDeg: (X * 180) / Math.PI, time: T },
        ]
    };
}
/**
 * PP or SS — one surface bounce. Ray goes source→turn1→surface→turn2→receiver.
 * Both legs have the same ray parameter.
 */
function computeSurfaceBounceRay(model, sourceDepth, distanceDeg, isS, maxSearchDepth) {
    const targetX = (distanceDeg * Math.PI) / 180;
    const computeX = (p) => {
        // First half-leg: source → turn → surface
        const t1 = findTurningDepth(model, p, maxSearchDepth, isS, sourceDepth);
        if (t1 === null)
            return null;
        const { X: Xd1 } = raySegment(model, p, sourceDepth, t1, isS);
        const { X: Xu1 } = raySegment(model, p, 0, t1, isS);
        // Second half-leg: surface → turn → receiver (same as surface source)
        const t2 = findTurningDepth(model, p, maxSearchDepth, isS, 0);
        if (t2 === null)
            return null;
        const { X: Xu2 } = raySegment(model, p, 0, t2, isS);
        return Xd1 + Xu1 + 2 * Xu2;
    };
    const pMin = maxRayParam(model, maxSearchDepth, isS) * 1.0001;
    const pMax = maxRayParam(model, sourceDepth, isS) * 0.9999;
    if (pMin >= pMax)
        return null;
    const p = bisectRayParam(computeX, pMin, pMax, targetX);
    if (p === null)
        return null;
    const t1 = findTurningDepth(model, p, maxSearchDepth, isS, sourceDepth);
    if (t1 === null)
        return null;
    const { T: Td1, X: Xd1 } = raySegment(model, p, sourceDepth, t1, isS);
    const { T: Tu1, X: Xu1 } = raySegment(model, p, 0, t1, isS);
    const t2 = findTurningDepth(model, p, maxSearchDepth, isS, 0);
    if (t2 === null)
        return null;
    const { T: Tu2, X: Xu2 } = raySegment(model, p, 0, t2, isS);
    const T = Td1 + Tu1 + 2 * Tu2;
    const X = Xd1 + Xu1 + 2 * Xu2;
    return {
        time: T,
        distanceDeg: (X * 180) / Math.PI,
        rayParam: p,
        takeoffAngle: toAngle(p, sourceDepth, model, isS),
        incidentAngle: toAngle(p, 0, model, isS),
        piercePoints: [
            { depth: sourceDepth, distanceDeg: 0, time: 0 },
            { depth: t1, distanceDeg: (Xd1 * 180) / Math.PI, time: Td1 },
            { depth: 0, distanceDeg: ((Xd1 + Xu1) * 180) / Math.PI, time: Td1 + Tu1 },
            { depth: 0, distanceDeg: (X * 180) / Math.PI, time: T },
        ]
    };
}
/**
 * PKP / PKIKP — refracted through the outer core (and optionally inner core).
 * Mantle legs use P velocity; core leg uses P velocity in fluid outer core.
 */
function computeCoreRefractedRay(model, sourceDepth, distanceDeg, topWaveIsS, cmbDepth, icbDepth, passesInnerCore) {
    const targetX = (distanceDeg * Math.PI) / 180;
    const coreMaxDepth = passesInnerCore ? model.maxDepth : icbDepth;
    const computeX = (p) => {
        // Check ray reaches CMB
        const pCMB = maxRayParam(model, cmbDepth, topWaveIsS);
        if (p >= pCMB)
            return null;
        // Mantle legs (source to CMB, CMB to surface)
        const { X: Xm1 } = raySegment(model, p, sourceDepth, cmbDepth, topWaveIsS);
        const { X: Xm2 } = raySegment(model, p, 0, cmbDepth, topWaveIsS);
        // Core leg
        const turnCore = findTurningDepth(model, p, coreMaxDepth, false, cmbDepth);
        if (turnCore === null)
            return null;
        const { X: Xc } = raySegment(model, p, cmbDepth, turnCore, false);
        return Xm1 + 2 * Xc + Xm2;
    };
    // For core phases: small p → deep turning → small X (roughly antipodal)
    //                  large p → shallow core turning → large X
    // pMax: ray parameter that just barely enters the core
    const pMax = maxRayParam(model, cmbDepth, topWaveIsS) * 0.9999;
    // pMin: ray that turns at the bottom of the search zone
    const pMin = maxRayParam(model, coreMaxDepth, false) * 1.0001;
    if (pMin >= pMax)
        return null;
    const p = bisectRayParam(computeX, pMin, pMax, targetX);
    if (p === null)
        return null;
    const { T: Tm1, X: Xm1 } = raySegment(model, p, sourceDepth, cmbDepth, topWaveIsS);
    const { T: Tm2, X: Xm2 } = raySegment(model, p, 0, cmbDepth, topWaveIsS);
    const turnCore = findTurningDepth(model, p, coreMaxDepth, false, cmbDepth);
    if (turnCore === null)
        return null;
    const { T: Tc, X: Xc } = raySegment(model, p, cmbDepth, turnCore, false);
    const T = Tm1 + 2 * Tc + Tm2;
    const X = Xm1 + 2 * Xc + Xm2;
    return {
        time: T,
        distanceDeg: (X * 180) / Math.PI,
        rayParam: p,
        takeoffAngle: toAngle(p, sourceDepth, model, topWaveIsS),
        incidentAngle: toAngle(p, 0, model, topWaveIsS),
        piercePoints: [
            { depth: sourceDepth, distanceDeg: 0, time: 0 },
            { depth: cmbDepth, distanceDeg: (Xm1 * 180) / Math.PI, time: Tm1 },
            { depth: turnCore, distanceDeg: ((Xm1 + Xc) * 180) / Math.PI, time: Tm1 + Tc },
            { depth: cmbDepth, distanceDeg: ((Xm1 + 2 * Xc) * 180) / Math.PI, time: Tm1 + 2 * Tc },
            { depth: 0, distanceDeg: (X * 180) / Math.PI, time: T },
        ]
    };
}
/** PKiKP — reflected off the inner core boundary. */
function computePKiKP(model, sourceDepth, distanceDeg, cmbDepth, icbDepth) {
    const targetX = (distanceDeg * Math.PI) / 180;
    const computeX = (p) => {
        const pCMB = maxRayParam(model, cmbDepth, false);
        const pICB = maxRayParam(model, icbDepth, false);
        if (p >= pCMB || p >= pICB)
            return null;
        const { X: Xm1 } = raySegment(model, p, sourceDepth, cmbDepth, false);
        const { X: Xc } = raySegment(model, p, cmbDepth, icbDepth, false);
        const { X: Xm2 } = raySegment(model, p, 0, cmbDepth, false);
        return Xm1 + 2 * Xc + Xm2;
    };
    const pMax = maxRayParam(model, cmbDepth, false) * 0.9999;
    const pMin = 1e-6;
    const p = bisectRayParam(computeX, pMin, pMax, targetX);
    if (p === null)
        return null;
    const { T: Tm1, X: Xm1 } = raySegment(model, p, sourceDepth, cmbDepth, false);
    const { T: Tc, X: Xc } = raySegment(model, p, cmbDepth, icbDepth, false);
    const { T: Tm2, X: Xm2 } = raySegment(model, p, 0, cmbDepth, false);
    const T = Tm1 + 2 * Tc + Tm2;
    const X = Xm1 + 2 * Xc + Xm2;
    return {
        time: T, distanceDeg: (X * 180) / Math.PI,
        rayParam: p, takeoffAngle: toAngle(p, sourceDepth, model, false),
        incidentAngle: toAngle(p, 0, model, false),
        piercePoints: [
            { depth: sourceDepth, distanceDeg: 0, time: 0 },
            { depth: cmbDepth, distanceDeg: (Xm1 * 180) / Math.PI, time: Tm1 },
            { depth: icbDepth, distanceDeg: ((Xm1 + Xc) * 180) / Math.PI, time: Tm1 + Tc },
            { depth: 0, distanceDeg: (X * 180) / Math.PI, time: T },
        ]
    };
}
/** SKS — S in mantle, P in outer core, S back in mantle. */
function computeSKS(model, sourceDepth, distanceDeg, cmbDepth, icbDepth) {
    const targetX = (distanceDeg * Math.PI) / 180;
    const computeX = (p) => {
        const pCMBs = maxRayParam(model, cmbDepth, true);
        const pICBp = maxRayParam(model, icbDepth, false);
        if (p >= pCMBs || p >= pICBp)
            return null;
        const { X: Xs1 } = raySegment(model, p, sourceDepth, cmbDepth, true);
        const { X: Xs2 } = raySegment(model, p, 0, cmbDepth, true);
        const turnCore = findTurningDepth(model, p, icbDepth, false, cmbDepth);
        if (turnCore === null)
            return null;
        const { X: Xc } = raySegment(model, p, cmbDepth, turnCore, false);
        return Xs1 + 2 * Xc + Xs2;
    };
    const pMax = Math.min(maxRayParam(model, cmbDepth, true), maxRayParam(model, cmbDepth, false)) * 0.9999;
    const pMin = maxRayParam(model, icbDepth, false) * 1.0001;
    if (pMin >= pMax)
        return null;
    const p = bisectRayParam(computeX, pMin, pMax, targetX);
    if (p === null)
        return null;
    const { T: Ts1, X: Xs1 } = raySegment(model, p, sourceDepth, cmbDepth, true);
    const { T: Ts2, X: Xs2 } = raySegment(model, p, 0, cmbDepth, true);
    const turnCore = findTurningDepth(model, p, icbDepth, false, cmbDepth);
    if (!turnCore)
        return null;
    const { T: Tc, X: Xc } = raySegment(model, p, cmbDepth, turnCore, false);
    const T = Ts1 + 2 * Tc + Ts2;
    const X = Xs1 + 2 * Xc + Xs2;
    return {
        time: T, distanceDeg: (X * 180) / Math.PI,
        rayParam: p, takeoffAngle: toAngle(p, sourceDepth, model, true),
        incidentAngle: toAngle(p, 0, model, true),
        piercePoints: [
            { depth: sourceDepth, distanceDeg: 0, time: 0 },
            { depth: cmbDepth, distanceDeg: (Xs1 * 180) / Math.PI, time: Ts1 },
            { depth: 0, distanceDeg: (X * 180) / Math.PI, time: T },
        ]
    };
}
/** SKKS — S in mantle, two legs in outer core with CMB bounce. */
function computeSKKS(model, sourceDepth, distanceDeg, cmbDepth, icbDepth) {
    const targetX = (distanceDeg * Math.PI) / 180;
    const computeX = (p) => {
        const pCMBs = maxRayParam(model, cmbDepth, true);
        const pICBp = maxRayParam(model, icbDepth, false);
        if (p >= pCMBs || p >= pICBp)
            return null;
        const { X: Xs1 } = raySegment(model, p, sourceDepth, cmbDepth, true);
        const { X: Xs2 } = raySegment(model, p, 0, cmbDepth, true);
        const turnCore = findTurningDepth(model, p, icbDepth, false, cmbDepth);
        if (turnCore === null)
            return null;
        const { X: Xc } = raySegment(model, p, cmbDepth, turnCore, false);
        return Xs1 + 4 * Xc + Xs2;
    };
    const pMax = Math.min(maxRayParam(model, cmbDepth, true), maxRayParam(model, cmbDepth, false)) * 0.9999;
    const pMin = maxRayParam(model, icbDepth, false) * 1.0001;
    if (pMin >= pMax)
        return null;
    const p = bisectRayParam(computeX, pMin, pMax, targetX);
    if (p === null)
        return null;
    const { T: Ts1, X: Xs1 } = raySegment(model, p, sourceDepth, cmbDepth, true);
    const { T: Ts2, X: Xs2 } = raySegment(model, p, 0, cmbDepth, true);
    const turnCore = findTurningDepth(model, p, icbDepth, false, cmbDepth);
    if (!turnCore)
        return null;
    const { T: Tc, X: Xc } = raySegment(model, p, cmbDepth, turnCore, false);
    const T = Ts1 + 4 * Tc + Ts2;
    const X = Xs1 + 4 * Xc + Xs2;
    return {
        time: T, distanceDeg: (X * 180) / Math.PI,
        rayParam: p, takeoffAngle: toAngle(p, sourceDepth, model, true),
        incidentAngle: toAngle(p, 0, model, true),
        piercePoints: [
            { depth: sourceDepth, distanceDeg: 0, time: 0 },
            { depth: cmbDepth, distanceDeg: (Xs1 * 180) / Math.PI, time: Ts1 },
            { depth: 0, distanceDeg: (X * 180) / Math.PI, time: T },
        ]
    };
}
/** pP / sS — depth phase: upgoing from source, surface reflection, then direct. */
function computeDepthPhase(model, sourceDepth, distanceDeg, isS, maxSearchDepth) {
    if (sourceDepth <= 0)
        return null;
    const targetX = (distanceDeg * Math.PI) / 180;
    const computeX = (p) => {
        // Upgoing from source to surface
        const { X: Xup } = raySegment(model, p, 0, sourceDepth, isS);
        // Direct P/S leg: surface source to receiver
        const d = directRayDistance(model, p, 0, maxSearchDepth, isS);
        if (d === null)
            return null;
        return Xup + d;
    };
    const pMin = maxRayParam(model, maxSearchDepth, isS) * 1.0001;
    const pMax = maxRayParam(model, sourceDepth, isS) * 0.9999;
    if (pMin >= pMax)
        return null;
    const p = bisectRayParam(computeX, pMin, pMax, targetX);
    if (p === null)
        return null;
    const { T: Tup, X: Xup } = raySegment(model, p, 0, sourceDepth, isS);
    const turn = findTurningDepth(model, p, maxSearchDepth, isS, 0);
    if (!turn)
        return null;
    const { T: Td, X: Xd } = raySegment(model, p, 0, turn, isS);
    const T = Tup + 2 * Td;
    const X = Xup + 2 * Xd;
    return {
        time: T, distanceDeg: (X * 180) / Math.PI,
        rayParam: p,
        takeoffAngle: 180 - toAngle(p, sourceDepth, model, isS),
        incidentAngle: toAngle(p, 0, model, isS),
        piercePoints: [
            { depth: sourceDepth, distanceDeg: 0, time: 0 },
            { depth: 0, distanceDeg: (Xup * 180) / Math.PI, time: Tup },
            { depth: 0, distanceDeg: (X * 180) / Math.PI, time: T },
        ]
    };
}
/** Pdiff / Sdiff — diffracted along the CMB. Valid for distances > ~97°. */
function computeDiffractedRay(model, sourceDepth, distanceDeg, isS, cmbDepth) {
    if (distanceDeg < 97 || distanceDeg > 170)
        return null;
    const targetX = (distanceDeg * Math.PI) / 180;
    const R = model.earthRadius;
    // Ray parameter for ray traveling along CMB
    const p = maxRayParam(model, cmbDepth, isS);
    const { T: T1, X: X1 } = raySegment(model, p, sourceDepth, cmbDepth, isS);
    const { T: T2, X: X2 } = raySegment(model, p, 0, cmbDepth, isS);
    const diffX = targetX - X1 - X2;
    if (diffX < 0)
        return null;
    const v_cmb = model.velocityAt(cmbDepth, isS);
    const r_cmb = (0, integration_1.depthToRadius)(cmbDepth, R);
    const diffT = diffX * r_cmb / v_cmb;
    const T = T1 + diffT + T2;
    return {
        time: T, distanceDeg,
        rayParam: p,
        takeoffAngle: toAngle(p, sourceDepth, model, isS),
        incidentAngle: toAngle(p, 0, model, isS),
        piercePoints: [
            { depth: sourceDepth, distanceDeg: 0, time: 0 },
            { depth: cmbDepth, distanceDeg: (X1 * 180) / Math.PI, time: T1 },
            { depth: cmbDepth, distanceDeg: distanceDeg - (X2 * 180) / Math.PI, time: T1 + diffT },
            { depth: 0, distanceDeg, time: T },
        ]
    };
}
//# sourceMappingURL=RayCalculator.js.map