export class VelocityLayer {
  constructor(
    public readonly topDepth: number,
    public readonly botDepth: number,
    public readonly topVp: number,
    public readonly botVp: number,
    public readonly topVs: number,
    public readonly botVs: number,
    public readonly topDensity: number = 2.6,
    public readonly botDensity: number = 2.6
  ) {}

  get thickness(): number {
    return this.botDepth - this.topDepth;
  }

  velocityAt(depth: number, isS: boolean): number {
    const frac = this.thickness === 0
      ? 0
      : (depth - this.topDepth) / this.thickness;
    if (isS) {
      return this.topVs + frac * (this.botVs - this.topVs);
    }
    return this.topVp + frac * (this.botVp - this.topVp);
  }

  clone(): VelocityLayer {
    return new VelocityLayer(
      this.topDepth, this.botDepth,
      this.topVp, this.botVp,
      this.topVs, this.botVs,
      this.topDensity, this.botDensity
    );
  }
}
