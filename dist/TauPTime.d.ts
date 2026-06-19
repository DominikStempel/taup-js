import { VelocityModel } from "./models/VelocityModel";
import { VelocityModelData, Arrival } from "./types";
export type ModelName = "iasp91" | "ak135" | "prem";
export interface TauPOptions {
    model?: ModelName | VelocityModelData;
}
export declare class TauPTime {
    private readonly model;
    constructor(options?: TauPOptions);
    get modelName(): string;
    /**
     * Calculate arrivals for one or more seismic phases.
     *
     * @param sourceDepth - Source depth in km (0 = surface)
     * @param distanceDeg - Epicentral distance in degrees
     * @param phases - Phase names to calculate (default: ["P", "S"])
     */
    calculate(sourceDepth: number, distanceDeg: number, phases?: string[]): Arrival[];
    /** Calculate arrivals for all supported phases. */
    calculateAll(sourceDepth: number, distanceDeg: number): Arrival[];
    /** Calculate a single named phase. Returns null if it doesn"t arrive. */
    calculatePhase(phaseName: string, sourceDepth: number, distanceDeg: number): Arrival | null;
    /** Get velocity at a given depth. */
    velocityAt(depth: number, waveType: "P" | "S"): number;
    /** Get the underlying velocity model. */
    getModel(): VelocityModel;
    static supportedPhases(): string[];
    static supportedModels(): ModelName[];
}
//# sourceMappingURL=TauPTime.d.ts.map