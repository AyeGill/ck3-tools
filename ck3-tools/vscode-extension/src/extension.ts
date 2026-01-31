import * as vscode from 'vscode';
import { TemplateGenerator } from './lib/templateGenerator';
import { registerAddTraitCommand } from './codeActions/addTrait';
import { registerAddBuildingCommand } from './codeActions/addBuilding';
import { registerAddEventCommand } from './codeActions/addEvent';
import { registerAddDecisionCommand } from './codeActions/addDecision';
import { registerGenerateLocalizationCommand } from './localization/generateLocalization';
import { registerGoToLocalizationCommand } from './localization/navigationProvider';

let generator: TemplateGenerator;

export function activate(context: vscode.ExtensionContext) {
  console.log('CK3 Modding Tools extension is now active');

  // Initialize template generator
  generator = new TemplateGenerator(context.extensionPath);

  // Register commands
  registerAddTraitCommand(context, generator);
  registerAddBuildingCommand(context, generator);
  registerAddEventCommand(context, generator);
  registerAddDecisionCommand(context, generator);
  registerGenerateLocalizationCommand(context, generator);
  registerGoToLocalizationCommand(context);

  vscode.window.showInformationMessage('CK3 Modding Tools loaded!');
}

export function deactivate() {
  console.log('CK3 Modding Tools extension is now deactivated');
}
