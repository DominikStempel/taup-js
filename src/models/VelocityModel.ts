import { VelocityLayer } from "./VelocityLayer";
import { VelocityModelData } from "../types";

export class VelocityModel {
  readonly name: string;
  readonly earthRadius: number;
  readonly mohoDepth: number;
  readonly cmbDepth: number;
  readonly icbDepth: number;
  readonly layers: VelocityLayer[];

  constructor(data: VelocityModelData) {
    this.name = data.name;
    this.earthRadius = data.earthRadius;
    this.mohoDepth = data.mohoDepth;
    this.cmbDepth = data.cmbDepth;
    this.icbDepth = data.icbDepth;
    this.layers = data.layers.map(l =>
      new VelocityLayer(l.topDepth, l.botDepth, l.topVp, l.botVp, l.topVs, l.botVs, l.topDensity, l.botDensity)
    );
  }

  layerAtDepth(depth: number): VelocityLayer {
    for (const layer of this.layers) {
      if (depth >= layer.topDepth && depth <= layer.botDepth) {
        return layer;
      }
    }
    throw new Error(`Depth ${depth} km is out of model range`);
  }

  velocityAt(depth: number, isS: boolean): number {
    const layer = this.layerAtDepth(depth);
    return layer.velocityAt(depth, isS);
  }

  layerIndexAtDepth(depth: number): number {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      if (depth >= layer.topDepth && depth <= layer.botDepth) {
        return i;
      }
    }
    return this.layers.length - 1;
  }

  get maxDepth(): number {
    return this.layers[this.layers.length - 1].botDepth;
  }

  depthAtTopOfLayer(layerIndex: number): number {
    return this.layers[layerIndex].topDepth;
  }

  depthAtBotOfLayer(layerIndex: number): number {
    return this.layers[layerIndex].botDepth;
  }
}
