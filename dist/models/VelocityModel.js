"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VelocityModel = void 0;
const VelocityLayer_1 = require("./VelocityLayer");
class VelocityModel {
    constructor(data) {
        this.name = data.name;
        this.earthRadius = data.earthRadius;
        this.mohoDepth = data.mohoDepth;
        this.cmbDepth = data.cmbDepth;
        this.icbDepth = data.icbDepth;
        this.layers = data.layers.map(l => new VelocityLayer_1.VelocityLayer(l.topDepth, l.botDepth, l.topVp, l.botVp, l.topVs, l.botVs, l.topDensity, l.botDensity));
    }
    layerAtDepth(depth) {
        for (const layer of this.layers) {
            if (depth >= layer.topDepth && depth <= layer.botDepth) {
                return layer;
            }
        }
        throw new Error(`Depth ${depth} km is out of model range`);
    }
    velocityAt(depth, isS) {
        const layer = this.layerAtDepth(depth);
        return layer.velocityAt(depth, isS);
    }
    layerIndexAtDepth(depth) {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            if (depth >= layer.topDepth && depth <= layer.botDepth) {
                return i;
            }
        }
        return this.layers.length - 1;
    }
    get maxDepth() {
        return this.layers[this.layers.length - 1].botDepth;
    }
    depthAtTopOfLayer(layerIndex) {
        return this.layers[layerIndex].topDepth;
    }
    depthAtBotOfLayer(layerIndex) {
        return this.layers[layerIndex].botDepth;
    }
}
exports.VelocityModel = VelocityModel;
//# sourceMappingURL=VelocityModel.js.map