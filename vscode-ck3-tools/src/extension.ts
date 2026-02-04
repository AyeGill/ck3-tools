import * as vscode from 'vscode';
import { TemplateGenerator } from './lib/templateGenerator';
import { registerAddTraitCommand } from './codeActions/addTrait';
import { registerAddBuildingCommand } from './codeActions/addBuilding';
import { registerAddEventCommand } from './codeActions/addEvent';
import { registerAddDecisionCommand } from './codeActions/addDecision';
import { registerAddSecretCommand } from './codeActions/addSecret';
import { registerAddInteractionCommand } from './codeActions/addInteraction';
import { registerAddActivityCommand } from './codeActions/addActivity';
import { registerAddSchemeCommand } from './codeActions/addScheme';
import { registerGenerateLocalizationCommand } from './localization/generateLocalization';
import { registerGoToLocalizationCommand } from './localization/navigationProvider';
// TraitCompletionProvider and TraitHoverProvider removed - using unified providers instead
import { CK3HoverProvider } from './providers/ck3HoverProvider';
import { CK3CompletionProvider } from './providers/ck3CompletionProvider';
import { CK3DiagnosticsProvider } from './providers/ck3DiagnosticsProvider';
import { CK3WorkspaceIndex } from './providers/workspaceIndex';

let generator: TemplateGenerator;

// Broader selector for all CK3 script files
const CK3_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/**/*.txt' },
  { scheme: 'file', pattern: '**/events/**/*.txt' },
];

export function activate(context: vscode.ExtensionContext) {
  console.log('CK3 Modding Tools extension is now active');

  // Initialize template generator
  generator = new TemplateGenerator(context.extensionPath);

  // Register commands
  registerAddTraitCommand(context, generator);
  registerAddBuildingCommand(context, generator);
  registerAddEventCommand(context, generator);
  registerAddDecisionCommand(context, generator);
  registerAddSecretCommand(context, generator);
  registerAddInteractionCommand(context, generator);
  registerAddActivityCommand(context, generator);
  registerAddSchemeCommand(context, generator);
  registerGenerateLocalizationCommand(context, generator);
  registerGoToLocalizationCommand(context);

  // Register unified completion and hover providers for all entity types
  const ck3CompletionProvider = new CK3CompletionProvider();
  const ck3HoverProvider = new CK3HoverProvider();

  // Register hover provider for ALL CK3 files (using language ID)
  // This ensures effects/triggers get hover docs even in file types without specific schemas
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: 'ck3' },
      ck3HoverProvider
    )
  );

  // Register completion provider for all CK3 files
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      CK3_FILE_SELECTOR,
      ck3CompletionProvider,
      '=', ' '
    )
  );

  console.log('Registered completion providers for all CK3 entity types');

  // Create workspace index for cross-file validation
  const workspaceIndex = new CK3WorkspaceIndex();

  // Index workspace files in background
  workspaceIndex.indexWorkspace().then(() => {
    console.log(`CK3 workspace index ready: ${workspaceIndex.getTotalCount()} workspace entities indexed`);
  });

  // Index game files if path is configured
  const gamePath = vscode.workspace.getConfiguration('ck3-tools').get<string>('gamePath');
  if (gamePath) {
    workspaceIndex.indexGameFiles(gamePath).then(() => {
      console.log(`CK3 game files indexed: ${workspaceIndex.getTotalCount()} total entities`);
    });
  }

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('ck3-tools.gamePath')) {
        const newGamePath = vscode.workspace.getConfiguration('ck3-tools').get<string>('gamePath');
        if (newGamePath) {
          workspaceIndex.indexGameFiles(newGamePath).then(() => {
            console.log(`CK3 game files re-indexed: ${workspaceIndex.getTotalCount()} total entities`);
            // Re-validate open documents
            vscode.workspace.textDocuments.forEach(doc => {
              if (doc.languageId === 'ck3') {
                diagnosticsProvider.validateDocument(doc);
              }
            });
          });
        }
      }
    })
  );

  // Register diagnostics provider for linting
  const diagnosticsProvider = new CK3DiagnosticsProvider(workspaceIndex);
  context.subscriptions.push(diagnosticsProvider.getDiagnosticCollection());

  // Validate all currently open documents
  vscode.workspace.textDocuments.forEach(doc => {
    if (doc.languageId === 'ck3') {
      diagnosticsProvider.validateDocument(doc);
    }
  });

  // Register document change listeners
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => {
      if (doc.languageId === 'ck3') {
        diagnosticsProvider.validateDocument(doc);
      }
    }),
    vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.languageId === 'ck3') {
        diagnosticsProvider.validateDocumentDebounced(e.document);
      }
    }),
    vscode.workspace.onDidCloseTextDocument(doc => {
      diagnosticsProvider.clearDiagnostics(doc.uri);
    })
  );

  // Update workspace index when files are saved
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(doc => {
      if (doc.languageId === 'ck3') {
        workspaceIndex.indexFile(doc.uri);
      }
    }),
    vscode.workspace.onDidDeleteFiles(e => {
      for (const uri of e.files) {
        workspaceIndex.removeFile(uri.toString());
      }
    }),
    vscode.workspace.onDidCreateFiles(e => {
      for (const uri of e.files) {
        if (uri.fsPath.endsWith('.txt')) {
          workspaceIndex.indexFile(uri);
        }
      }
    })
  );

  console.log('Registered diagnostics provider for CK3 files');
  vscode.window.showInformationMessage('CK3 Modding Tools loaded!');
}

export function deactivate() {
  console.log('CK3 Modding Tools extension is now deactivated');
}
