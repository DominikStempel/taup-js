export declare class VelocityLayer {
    readonly topDepth: number;
    readonly botDepth: number;
    readonly topVp: number;
    readonly botVp: number;
    readonly topVs: number;
    readonly botVs: number;
    readonly topDensity: number;
    readonly botDensity: number;
    constructor(topDepth: number, botDepth: number, topVp: number, botVp: number, topVs: number, botVs: number, topDensity?: number, botDensity?: number);
    get thickness(): number;
    velocityAt(depth: number, isS: boolean): number;
    clone(): VelocityLayer;
}
//# sourceMappingURL=VelocityLayer.d.ts.map