"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IASP91 = void 0;
exports.IASP91 = {
    name: "iasp91",
    earthRadius: 6371.0,
    mohoDepth: 35.0,
    cmbDepth: 2889.0,
    icbDepth: 5153.9,
    layers: [
        // crust
        { topDepth: 0, botDepth: 20, topVp: 5.800, botVp: 5.800, topVs: 3.360, botVs: 3.360, topDensity: 2.72, botDensity: 2.72 },
        { topDepth: 20, botDepth: 35, topVp: 6.500, botVp: 6.500, topVs: 3.750, botVs: 3.750, topDensity: 2.92, botDensity: 2.92 },
        // upper mantle
        { topDepth: 35, botDepth: 77.5, topVp: 8.040, botVp: 8.045, topVs: 4.470, botVs: 4.485, topDensity: 3.32, botDensity: 3.32 },
        { topDepth: 77.5, botDepth: 120, topVp: 8.045, botVp: 8.050, topVs: 4.485, botVs: 4.500, topDensity: 3.35, botDensity: 3.35 },
        { topDepth: 120, botDepth: 165, topVp: 8.050, botVp: 8.175, topVs: 4.500, botVs: 4.509, topDensity: 3.37, botDensity: 3.37 },
        { topDepth: 165, botDepth: 210, topVp: 8.175, botVp: 8.300, topVs: 4.509, botVs: 4.518, topDensity: 3.40, botDensity: 3.40 },
        { topDepth: 210, botDepth: 260, topVp: 8.300, botVp: 8.483, topVs: 4.523, botVs: 4.596, topDensity: 3.43, botDensity: 3.46 },
        { topDepth: 260, botDepth: 310, topVp: 8.483, botVp: 8.655, topVs: 4.596, botVs: 4.657, topDensity: 3.46, botDensity: 3.48 },
        { topDepth: 310, botDepth: 360, topVp: 8.655, botVp: 8.735, topVs: 4.657, botVs: 4.706, topDensity: 3.48, botDensity: 3.50 },
        { topDepth: 360, botDepth: 410, topVp: 8.735, botVp: 8.735, topVs: 4.706, botVs: 4.706, topDensity: 3.50, botDensity: 3.50 },
        // transition zone
        { topDepth: 410, botDepth: 460, topVp: 9.030, botVp: 9.360, topVs: 4.870, botVs: 5.080, topDensity: 3.73, botDensity: 3.78 },
        { topDepth: 460, botDepth: 510, topVp: 9.360, botVp: 9.528, topVs: 5.080, botVs: 5.186, topDensity: 3.78, botDensity: 3.83 },
        { topDepth: 510, botDepth: 560, topVp: 9.528, botVp: 9.664, topVs: 5.186, botVs: 5.276, topDensity: 3.83, botDensity: 3.87 },
        { topDepth: 560, botDepth: 610, topVp: 9.664, botVp: 9.760, topVs: 5.276, botVs: 5.341, topDensity: 3.87, botDensity: 3.91 },
        { topDepth: 610, botDepth: 660, topVp: 9.760, botVp: 9.833, topVs: 5.341, botVs: 5.383, topDensity: 3.91, botDensity: 3.92 },
        // lower mantle
        { topDepth: 660, botDepth: 760, topVp: 10.212, botVp: 11.092, topVs: 5.607, botVs: 6.094, topDensity: 4.38, botDensity: 4.56 },
        { topDepth: 760, botDepth: 909.5, topVp: 11.092, botVp: 11.335, topVs: 6.094, botVs: 6.209, topDensity: 4.56, botDensity: 4.68 },
        { topDepth: 909.5, botDepth: 1010, topVp: 11.335, botVp: 11.519, topVs: 6.209, botVs: 6.318, topDensity: 4.68, botDensity: 4.74 },
        { topDepth: 1010, botDepth: 1250, topVp: 11.519, botVp: 11.748, topVs: 6.318, botVs: 6.440, topDensity: 4.74, botDensity: 4.87 },
        { topDepth: 1250, botDepth: 1400, topVp: 11.748, botVp: 11.993, topVs: 6.440, botVs: 6.581, topDensity: 4.87, botDensity: 4.97 },
        { topDepth: 1400, botDepth: 1600, topVp: 11.993, botVp: 12.135, topVs: 6.581, botVs: 6.665, topDensity: 4.97, botDensity: 5.08 },
        { topDepth: 1600, botDepth: 1800, topVp: 12.135, botVp: 12.315, topVs: 6.665, botVs: 6.786, topDensity: 5.08, botDensity: 5.18 },
        { topDepth: 1800, botDepth: 2000, topVp: 12.315, botVp: 12.477, topVs: 6.786, botVs: 6.896, topDensity: 5.18, botDensity: 5.27 },
        { topDepth: 2000, botDepth: 2200, topVp: 12.477, botVp: 12.624, topVs: 6.896, botVs: 6.995, topDensity: 5.27, botDensity: 5.36 },
        { topDepth: 2200, botDepth: 2400, topVp: 12.624, botVp: 12.762, topVs: 6.995, botVs: 7.083, topDensity: 5.36, botDensity: 5.45 },
        { topDepth: 2400, botDepth: 2600, topVp: 12.762, botVp: 12.876, topVs: 7.083, botVs: 7.154, topDensity: 5.45, botDensity: 5.53 },
        { topDepth: 2600, botDepth: 2800, topVp: 12.876, botVp: 12.958, topVs: 7.154, botVs: 7.194, topDensity: 5.53, botDensity: 5.58 },
        { topDepth: 2800, botDepth: 2889, topVp: 12.958, botVp: 13.716, topVs: 7.194, botVs: 7.301, topDensity: 5.58, botDensity: 5.57 },
        // outer core (fluid, Vs=0)
        { topDepth: 2889, botDepth: 3000, topVp: 8.008, botVp: 8.178, topVs: 0.000, botVs: 0.000, topDensity: 9.90, botDensity: 10.01 },
        { topDepth: 3000, botDepth: 3200, topVp: 8.178, botVp: 8.570, topVs: 0.000, botVs: 0.000, topDensity: 10.01, botDensity: 10.20 },
        { topDepth: 3200, botDepth: 3400, topVp: 8.570, botVp: 9.020, topVs: 0.000, botVs: 0.000, topDensity: 10.20, botDensity: 10.38 },
        { topDepth: 3400, botDepth: 3600, topVp: 9.020, botVp: 9.443, topVs: 0.000, botVs: 0.000, topDensity: 10.38, botDensity: 10.56 },
        { topDepth: 3600, botDepth: 3800, topVp: 9.443, botVp: 9.829, topVs: 0.000, botVs: 0.000, topDensity: 10.56, botDensity: 10.73 },
        { topDepth: 3800, botDepth: 4000, topVp: 9.829, botVp: 10.174, topVs: 0.000, botVs: 0.000, topDensity: 10.73, botDensity: 10.89 },
        { topDepth: 4000, botDepth: 4200, topVp: 10.174, botVp: 10.476, topVs: 0.000, botVs: 0.000, topDensity: 10.89, botDensity: 11.05 },
        { topDepth: 4200, botDepth: 4400, topVp: 10.476, botVp: 10.729, topVs: 0.000, botVs: 0.000, topDensity: 11.05, botDensity: 11.17 },
        { topDepth: 4400, botDepth: 4600, topVp: 10.729, botVp: 10.918, topVs: 0.000, botVs: 0.000, topDensity: 11.17, botDensity: 11.25 },
        { topDepth: 4600, botDepth: 4800, topVp: 10.918, botVp: 11.029, topVs: 0.000, botVs: 0.000, topDensity: 11.25, botDensity: 11.29 },
        { topDepth: 4800, botDepth: 5000, topVp: 11.029, botVp: 11.066, topVs: 0.000, botVs: 0.000, topDensity: 11.29, botDensity: 11.30 },
        { topDepth: 5000, botDepth: 5153.9, topVp: 11.066, botVp: 11.029, topVs: 0.000, botVs: 0.000, topDensity: 11.30, botDensity: 11.30 },
        // inner core
        { topDepth: 5153.9, botDepth: 5200, topVp: 11.208, botVp: 11.228, topVs: 3.400, botVs: 3.440, topDensity: 12.76, botDensity: 12.76 },
        { topDepth: 5200, botDepth: 5400, topVp: 11.228, botVp: 11.298, topVs: 3.440, botVs: 3.520, topDensity: 12.76, botDensity: 12.76 },
        { topDepth: 5400, botDepth: 5600, topVp: 11.298, botVp: 11.374, topVs: 3.520, botVs: 3.607, topDensity: 12.76, botDensity: 12.76 },
        { topDepth: 5600, botDepth: 5800, topVp: 11.374, botVp: 11.451, topVs: 3.607, botVs: 3.692, topDensity: 12.76, botDensity: 12.76 },
        { topDepth: 5800, botDepth: 6000, topVp: 11.451, botVp: 11.528, topVs: 3.692, botVs: 3.779, topDensity: 12.76, botDensity: 12.76 },
        { topDepth: 6000, botDepth: 6200, topVp: 11.528, botVp: 11.609, topVs: 3.779, botVs: 3.868, topDensity: 12.76, botDensity: 12.76 },
        { topDepth: 6200, botDepth: 6371, topVp: 11.609, botVp: 11.670, topVs: 3.868, botVs: 3.940, topDensity: 12.76, botDensity: 12.76 },
    ]
};
//# sourceMappingURL=iasp91.js.map