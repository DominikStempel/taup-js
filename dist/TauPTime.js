"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TauPTime = void 0;
const VelocityModel_1 = require("./models/VelocityModel");
const iasp91_1 = require("./models/iasp91");
const ak135_1 = require("./models/ak135");
const prem_1 = require("./models/prem");
const RayCalculator_1 = require("./core/RayCalculator");
const PhaseParser_1 = require("./core/PhaseParser");
const BUILT_IN_MODELS = {
    iasp91: iasp91_1.IASP91,
    ak135: ak135_1.AK135,
    prem: prem_1.PREM,
};
class TauPTime {
    constructor(options = {}) {
        const modelInput = options.model ?? "iasp91";
        if (typeof modelInput === "string") {
            const data = BUILT_IN_MODELS[modelInput];
            if (!data)
                throw new Error(`Unknown model: ${modelInput}. Use iasp91, ak135, or prem.`);
            this.model = new VelocityModel_1.VelocityModel(data);
        }
        else {
            this.model = new VelocityModel_1.VelocityModel(modelInput);
        }
    }
    get modelName() {
        return this.model.name;
    }
    /**
     * Calculate arrivals for one or more seismic phases.
     *
     * @param sourceDepth - Source depth in km (0 = surface)
     * @param distanceDeg - Epicentral distance in degrees
     * @param phases - Phase names to calculate (default: ["P", "S"])
     */
    calculate(sourceDepth, distanceDeg, phases = ["P", "S"]) {
        if (sourceDepth < 0)
            throw new Error("Source depth must be >= 0");
        if (distanceDeg < 0 || distanceDeg > 360)
            throw new Error("Distance must be between 0 and 360 degrees");
        const arrivals = [];
        for (const phaseName of phases) {
            const result = this.calculatePhase(phaseName, sourceDepth, distanceDeg);
            if (result !== null)
                arrivals.push(result);
        }
        arrivals.sort((a, b) => a.time - b.time);
        return arrivals;
    }
    /** Calculate arrivals for all supported phases. */
    calculateAll(sourceDepth, distanceDeg) {
        return this.calculate(sourceDepth, distanceDeg, (0, PhaseParser_1.supportedPhases)());
    }
    /** Calculate a single named phase. Returns null if it doesn"t arrive. */
    calculatePhase(phaseName, sourceDepth, distanceDeg) {
        const m = this.model;
        const cmbDepth = m.cmbDepth;
        const icbDepth = m.icbDepth;
        let result = null;
        try {
            switch (phaseName) {
                case "P":
                    result = (0, RayCalculator_1.computeDirectRay)(m, sourceDepth, distanceDeg, false, cmbDepth);
                    break;
                case "S":
                    result = (0, RayCalculator_1.computeDirectRay)(m, sourceDepth, distanceDeg, true, cmbDepth);
                    break;
                case "PP":
                    result = (0, RayCalculator_1.computeSurfaceBounceRay)(m, sourceDepth, distanceDeg, false, cmbDepth);
                    break;
                case "SS":
                    result = (0, RayCalculator_1.computeSurfaceBounceRay)(m, sourceDepth, distanceDeg, true, cmbDepth);
                    break;
                case "PcP":
                    result = (0, RayCalculator_1.computeReflectedRay)(m, sourceDepth, distanceDeg, false, cmbDepth);
                    break;
                case "ScS":
                    result = (0, RayCalculator_1.computeReflectedRay)(m, sourceDepth, distanceDeg, true, cmbDepth);
                    break;
                case "ScP":
                    result = (0, RayCalculator_1.computeReflectedRay)(m, sourceDepth, distanceDeg, true, cmbDepth);
                    break;
                case "PKP":
                    result = (0, RayCalculator_1.computeCoreRefractedRay)(m, sourceDepth, distanceDeg, false, cmbDepth, icbDepth, false);
                    break;
                case "PKiKP":
                    result = (0, RayCalculator_1.computePKiKP)(m, sourceDepth, distanceDeg, cmbDepth, icbDepth);
                    break;
                case "PKIKP":
                    result = (0, RayCalculator_1.computeCoreRefractedRay)(m, sourceDepth, distanceDeg, false, cmbDepth, icbDepth, true);
                    break;
                case "SKS":
                    result = (0, RayCalculator_1.computeSKS)(m, sourceDepth, distanceDeg, cmbDepth, icbDepth);
                    break;
                case "SKKS":
                    result = (0, RayCalculator_1.computeSKKS)(m, sourceDepth, distanceDeg, cmbDepth, icbDepth);
                    break;
                case "pP":
                    result = (0, RayCalculator_1.computeDepthPhase)(m, sourceDepth, distanceDeg, false, cmbDepth);
                    break;
                case "sS":
                    result = (0, RayCalculator_1.computeDepthPhase)(m, sourceDepth, distanceDeg, true, cmbDepth);
                    break;
                case "Pdiff":
                    result = (0, RayCalculator_1.computeDiffractedRay)(m, sourceDepth, distanceDeg, false, cmbDepth);
                    break;
                case "Sdiff":
                    result = (0, RayCalculator_1.computeDiffractedRay)(m, sourceDepth, distanceDeg, true, cmbDepth);
                    break;
                default:
                    return null;
            }
        }
        catch {
            return null;
        }
        if (!result)
            return null;
        return {
            phase: phaseName,
            time: result.time,
            rayParam: result.rayParam,
            takeoffAngle: result.takeoffAngle,
            incidentAngle: result.incidentAngle,
            distanceDeg: result.distanceDeg,
            sourceDepth,
            piercePoints: result.piercePoints,
        };
    }
    /** Get velocity at a given depth. */
    velocityAt(depth, waveType) {
        return this.model.velocityAt(depth, waveType === "S");
    }
    /** Get the underlying velocity model. */
    getModel() {
        return this.model;
    }
    static supportedPhases() {
        return (0, PhaseParser_1.supportedPhases)();
    }
    static supportedModels() {
        return ["iasp91", "ak135", "prem"];
    }
}
exports.TauPTime = TauPTime;
//# sourceMappingURL=TauPTime.js.map