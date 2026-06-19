export type WaveType = "P" | "S";
export interface PhaseSegment {
    waveType: WaveType;
    isDowngoing: boolean;
    isReflection: boolean;
    reflectAtSurface: boolean;
    reflectAtCMB: boolean;
    reflectAtICB: boolean;
    passesCore: boolean;
    passesInnerCore: boolean;
}
export interface ParsedPhase {
    name: string;
    segments: PhaseSegment[];
    isDepthPhase: boolean;
    maxDepth: "surface" | "mantle" | "core" | "innercore";
}
/**
 * Simplified phase name parser. Supports the most common seismic phases:
 * P, S, PP, SS, PcP, ScS, PKP, PKiKP, PKIKP, pP, sP, pS, sS,
 * Pdiff, Sdiff, SKS, SKKS, ScP, PCS
 */
export declare const parsePhase: (phaseName: string) => ParsedPhase | null;
export declare const supportedPhases: () => string[];
//# sourceMappingURL=PhaseParser.d.ts.map