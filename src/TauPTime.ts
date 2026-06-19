import { VelocityModel } from "./models/VelocityModel";
import { IASP91 } from "./models/iasp91";
import { AK135 } from "./models/ak135";
import { PREM } from "./models/prem";
import { VelocityModelData, Arrival } from "./types";
import {
  computeDirectRay,
  computeReflectedRay,
  computeCoreRefractedRay,
  computeSurfaceBounceRay,
  computePKiKP,
  computeSKS,
  computeSKKS,
  computeDepthPhase,
  computeDiffractedRay,
  RayResult,
} from "./core/RayCalculator";
import { supportedPhases } from "./core/PhaseParser";

export type ModelName = "iasp91" | "ak135" | "prem";

const BUILT_IN_MODELS: Record<ModelName, VelocityModelData> = {
  iasp91: IASP91,
  ak135: AK135,
  prem: PREM,
};

export interface TauPOptions {
  model?: ModelName | VelocityModelData;
}

export class TauPTime {
  private readonly model: VelocityModel;

  constructor(options: TauPOptions = {}) {
    const modelInput = options.model ?? "iasp91";
    if (typeof modelInput === "string") {
      const data = BUILT_IN_MODELS[modelInput];
      if (!data) throw new Error(`Unknown model: ${modelInput}. Use iasp91, ak135, or prem.`);
      this.model = new VelocityModel(data);
    } else {
      this.model = new VelocityModel(modelInput);
    }
  }

  get modelName(): string {
    return this.model.name;
  }

  /**
   * Calculate arrivals for one or more seismic phases.
   *
   * @param sourceDepth - Source depth in km (0 = surface)
   * @param distanceDeg - Epicentral distance in degrees
   * @param phases - Phase names to calculate (default: ["P", "S"])
   */
  calculate(
    sourceDepth: number,
    distanceDeg: number,
    phases: string[] = ["P", "S"]
  ): Arrival[] {
    if (sourceDepth < 0) throw new Error("Source depth must be >= 0");
    if (distanceDeg < 0 || distanceDeg > 360) throw new Error("Distance must be between 0 and 360 degrees");

    const arrivals: Arrival[] = [];
    for (const phaseName of phases) {
      const result = this.calculatePhase(phaseName, sourceDepth, distanceDeg);
      if (result !== null) arrivals.push(result);
    }
    arrivals.sort((a, b) => a.time - b.time);
    return arrivals;
  }

  /** Calculate arrivals for all supported phases. */
  calculateAll(sourceDepth: number, distanceDeg: number): Arrival[] {
    return this.calculate(sourceDepth, distanceDeg, supportedPhases());
  }

  /** Calculate a single named phase. Returns null if it doesn"t arrive. */
  calculatePhase(phaseName: string, sourceDepth: number, distanceDeg: number): Arrival | null {
    const m = this.model;
    const cmbDepth = m.cmbDepth;
    const icbDepth = m.icbDepth;

    let result: RayResult | null = null;
    try {
      switch (phaseName) {
        case "P":
          result = computeDirectRay(m, sourceDepth, distanceDeg, false, cmbDepth);
          break;
        case "S":
          result = computeDirectRay(m, sourceDepth, distanceDeg, true, cmbDepth);
          break;
        case "PP":
          result = computeSurfaceBounceRay(m, sourceDepth, distanceDeg, false, cmbDepth);
          break;
        case "SS":
          result = computeSurfaceBounceRay(m, sourceDepth, distanceDeg, true, cmbDepth);
          break;
        case "PcP":
          result = computeReflectedRay(m, sourceDepth, distanceDeg, false, cmbDepth);
          break;
        case "ScS":
          result = computeReflectedRay(m, sourceDepth, distanceDeg, true, cmbDepth);
          break;
        case "ScP":
          result = computeReflectedRay(m, sourceDepth, distanceDeg, true, cmbDepth);
          break;
        case "PKP":
          result = computeCoreRefractedRay(m, sourceDepth, distanceDeg, false, cmbDepth, icbDepth, false);
          break;
        case "PKiKP":
          result = computePKiKP(m, sourceDepth, distanceDeg, cmbDepth, icbDepth);
          break;
        case "PKIKP":
          result = computeCoreRefractedRay(m, sourceDepth, distanceDeg, false, cmbDepth, icbDepth, true);
          break;
        case "SKS":
          result = computeSKS(m, sourceDepth, distanceDeg, cmbDepth, icbDepth);
          break;
        case "SKKS":
          result = computeSKKS(m, sourceDepth, distanceDeg, cmbDepth, icbDepth);
          break;
        case "pP":
          result = computeDepthPhase(m, sourceDepth, distanceDeg, false, cmbDepth);
          break;
        case "sS":
          result = computeDepthPhase(m, sourceDepth, distanceDeg, true, cmbDepth);
          break;
        case "Pdiff":
          result = computeDiffractedRay(m, sourceDepth, distanceDeg, false, cmbDepth);
          break;
        case "Sdiff":
          result = computeDiffractedRay(m, sourceDepth, distanceDeg, true, cmbDepth);
          break;
        default:
          return null;
      }
    } catch {
      return null;
    }

    if (!result) return null;

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
  velocityAt(depth: number, waveType: "P" | "S"): number {
    return this.model.velocityAt(depth, waveType === "S");
  }

  /** Get the underlying velocity model. */
  getModel(): VelocityModel {
    return this.model;
  }

  static supportedPhases(): string[] {
    return supportedPhases();
  }

  static supportedModels(): ModelName[] {
    return ["iasp91", "ak135", "prem"];
  }
}
