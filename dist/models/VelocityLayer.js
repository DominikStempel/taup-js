"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VelocityLayer = void 0;
class VelocityLayer {
    constructor(topDepth, botDepth, topVp, botVp, topVs, botVs, topDensity = 2.6, botDensity = 2.6) {
        this.topDepth = topDepth;
        this.botDepth = botDepth;
        this.topVp = topVp;
        this.botVp = botVp;
        this.topVs = topVs;
        this.botVs = botVs;
        this.topDensity = topDensity;
        this.botDensity = botDensity;
    }
    get thickness() {
        return this.botDepth - this.topDepth;
    }
    velocityAt(depth, isS) {
        const frac = this.thickness === 0
            ? 0
            : (depth - this.topDepth) / this.thickness;
        if (isS) {
            return this.topVs + frac * (this.botVs - this.topVs);
        }
        return this.topVp + frac * (this.botVp - this.topVp);
    }
    clone() {
        return new VelocityLayer(this.topDepth, this.botDepth, this.topVp, this.botVp, this.topVs, this.botVs, this.topDensity, this.botDensity);
    }
}
exports.VelocityLayer = VelocityLayer;
//# sourceMappingURL=VelocityLayer.js.map