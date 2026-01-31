"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const templateGenerator_1 = require("./lib/templateGenerator");
const addTrait_1 = require("./codeActions/addTrait");
const addBuilding_1 = require("./codeActions/addBuilding");
const addEvent_1 = require("./codeActions/addEvent");
const addDecision_1 = require("./codeActions/addDecision");
const generateLocalization_1 = require("./localization/generateLocalization");
const navigationProvider_1 = require("./localization/navigationProvider");
let generator;
function activate(context) {
    console.log('CK3 Modding Tools extension is now active');
    // Initialize template generator
    generator = new templateGenerator_1.TemplateGenerator(context.extensionPath);
    // Register commands
    (0, addTrait_1.registerAddTraitCommand)(context, generator);
    (0, addBuilding_1.registerAddBuildingCommand)(context, generator);
    (0, addEvent_1.registerAddEventCommand)(context, generator);
    (0, addDecision_1.registerAddDecisionCommand)(context, generator);
    (0, generateLocalization_1.registerGenerateLocalizationCommand)(context, generator);
    (0, navigationProvider_1.registerGoToLocalizationCommand)(context);
    vscode.window.showInformationMessage('CK3 Modding Tools loaded!');
}
function deactivate() {
    console.log('CK3 Modding Tools extension is now deactivated');
}
//# sourceMappingURL=extension.js.map