"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePhase = exports.supportedPhases = exports.PREM = exports.AK135 = exports.IASP91 = exports.VelocityLayer = exports.VelocityModel = exports.TauPTime = void 0;
var TauPTime_1 = require("./TauPTime");
Object.defineProperty(exports, "TauPTime", { enumerable: true, get: function () { return TauPTime_1.TauPTime; } });
var VelocityModel_1 = require("./models/VelocityModel");
Object.defineProperty(exports, "VelocityModel", { enumerable: true, get: function () { return VelocityModel_1.VelocityModel; } });
var VelocityLayer_1 = require("./models/VelocityLayer");
Object.defineProperty(exports, "VelocityLayer", { enumerable: true, get: function () { return VelocityLayer_1.VelocityLayer; } });
var iasp91_1 = require("./models/iasp91");
Object.defineProperty(exports, "IASP91", { enumerable: true, get: function () { return iasp91_1.IASP91; } });
var ak135_1 = require("./models/ak135");
Object.defineProperty(exports, "AK135", { enumerable: true, get: function () { return ak135_1.AK135; } });
var prem_1 = require("./models/prem");
Object.defineProperty(exports, "PREM", { enumerable: true, get: function () { return prem_1.PREM; } });
var PhaseParser_1 = require("./core/PhaseParser");
Object.defineProperty(exports, "supportedPhases", { enumerable: true, get: function () { return PhaseParser_1.supportedPhases; } });
Object.defineProperty(exports, "parsePhase", { enumerable: true, get: function () { return PhaseParser_1.parsePhase; } });
//# sourceMappingURL=index.js.map