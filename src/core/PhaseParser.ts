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
export const parsePhase = (phaseName: string): ParsedPhase | null => {
  const name = phaseName.trim();

  // Depth phases (lowercase prefix)
  const isDepthPhase = /^[ps][PSK]/.test(name);

  // Map well-known phases to properties
  const phaseMap: Record<string, ParsedPhase> = {
    "P": {
      name: "P",
      isDepthPhase: false,
      maxDepth: "mantle",
      segments: [
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "S": {
      name: "S",
      isDepthPhase: false,
      maxDepth: "mantle",
      segments: [
        { waveType: "S", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "S", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "PP": {
      name: "PP",
      isDepthPhase: false,
      maxDepth: "mantle",
      segments: [
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: true,  reflectAtSurface: true,  reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "SS": {
      name: "SS",
      isDepthPhase: false,
      maxDepth: "mantle",
      segments: [
        { waveType: "S", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "S", isDowngoing: false, isReflection: true,  reflectAtSurface: true,  reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "S", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "S", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "PcP": {
      name: "PcP",
      isDepthPhase: false,
      maxDepth: "core",
      segments: [
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: true,  reflectAtSurface: false, reflectAtCMB: true,  reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "ScS": {
      name: "ScS",
      isDepthPhase: false,
      maxDepth: "core",
      segments: [
        { waveType: "S", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "S", isDowngoing: false, isReflection: true,  reflectAtSurface: false, reflectAtCMB: true,  reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "ScP": {
      name: "ScP",
      isDepthPhase: false,
      maxDepth: "core",
      segments: [
        { waveType: "S", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: true,  reflectAtSurface: false, reflectAtCMB: true,  reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "PKP": {
      name: "PKP",
      isDepthPhase: false,
      maxDepth: "core",
      segments: [
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: false },
      ]
    },
    "PKiKP": {
      name: "PKiKP",
      isDepthPhase: false,
      maxDepth: "innercore",
      segments: [
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: true,  reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: true,  passesCore: true,  passesInnerCore: false },
      ]
    },
    "PKIKP": {
      name: "PKIKP",
      isDepthPhase: false,
      maxDepth: "innercore",
      segments: [
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: true },
        { waveType: "P", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: true },
      ]
    },
    "SKS": {
      name: "SKS",
      isDepthPhase: false,
      maxDepth: "core",
      segments: [
        { waveType: "S", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: false },
        { waveType: "S", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "SKKS": {
      name: "SKKS",
      isDepthPhase: false,
      maxDepth: "core",
      segments: [
        { waveType: "S", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: true,  reflectAtSurface: false, reflectAtCMB: true,  reflectAtICB: false, passesCore: true,  passesInnerCore: false },
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: true,  passesInnerCore: false },
        { waveType: "S", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "pP": {
      name: "pP",
      isDepthPhase: true,
      maxDepth: "mantle",
      segments: [
        { waveType: "P", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: true,  reflectAtSurface: true,  reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "sS": {
      name: "sS",
      isDepthPhase: true,
      maxDepth: "mantle",
      segments: [
        { waveType: "S", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "S", isDowngoing: false, isReflection: true,  reflectAtSurface: true,  reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "S", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "S", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "Pdiff": {
      name: "Pdiff",
      isDepthPhase: false,
      maxDepth: "core",
      segments: [
        { waveType: "P", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "P", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
    "Sdiff": {
      name: "Sdiff",
      isDepthPhase: false,
      maxDepth: "core",
      segments: [
        { waveType: "S", isDowngoing: true,  isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
        { waveType: "S", isDowngoing: false, isReflection: false, reflectAtSurface: false, reflectAtCMB: false, reflectAtICB: false, passesCore: false, passesInnerCore: false },
      ]
    },
  };

  return phaseMap[name] ?? null;
}

export const supportedPhases = (): string[] => {
  return ["P", "S", "PP", "SS", "PcP", "ScS", "ScP", "PKP", "PKiKP", "PKIKP", "SKS", "SKKS", "pP", "sS", "Pdiff", "Sdiff"];
}
