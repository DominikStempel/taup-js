export interface Arrival {
    phase: string;
    time: number;
    rayParam: number;
    takeoffAngle: number;
    incidentAngle: number;
    distanceDeg: number;
    sourceDepth: number;
    piercePoints?: PiercePoint[];
    rayPath?: RayPathPoint[];
}
export interface PiercePoint {
    depth: number;
    distanceDeg: number;
    time: number;
    rayParam?: number;
}
export interface RayPathPoint {
    depth: number;
    distanceDeg: number;
    time: number;
}
export interface VelocityModelData {
    name: string;
    earthRadius: number;
    mohoDepth: number;
    cmbDepth: number;
    icbDepth: number;
    layers: VelocityLayerData[];
}
export interface VelocityLayerData {
    topDepth: number;
    botDepth: number;
    topVp: number;
    botVp: number;
    topVs: number;
    botVs: number;
    topDensity: number;
    botDensity: number;
}
export type WaveType = "P" | "S";
export interface PhaseSegment {
    waveType: WaveType;
    isDowngoing: boolean;
    isReflection: boolean;
    reflectDepth?: number;
    isCritical: boolean;
    topLayerIndex: number;
    botLayerIndex: number;
}
//# sourceMappingURL=types.d.ts.map