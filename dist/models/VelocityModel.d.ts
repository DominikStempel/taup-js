import { VelocityLayer } from "./VelocityLayer";
import { VelocityModelData } from "../types";
export declare class VelocityModel {
    readonly name: string;
    readonly earthRadius: number;
    readonly mohoDepth: number;
    readonly cmbDepth: number;
    readonly icbDepth: number;
    readonly layers: VelocityLayer[];
    constructor(data: VelocityModelData);
    layerAtDepth(depth: number): VelocityLayer;
    velocityAt(depth: number, isS: boolean): number;
    layerIndexAtDepth(depth: number): number;
    get maxDepth(): number;
    depthAtTopOfLayer(layerIndex: number): number;
    depthAtBotOfLayer(layerIndex: number): number;
}
//# sourceMappingURL=VelocityModel.d.ts.map