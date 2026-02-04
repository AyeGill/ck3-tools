/**
 * Workspace-wide index of CK3 entities for cross-file validation
 *
 * Tracks defined entities (script values, traits, events, etc.) across the workspace
 * and game files to enable validation that references actually exist.
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Location of a defined entity
 */
export interface EntityLocation {
  uri: string;      // File URI
  line: number;     // Line number (0-indexed)
  name: string;     // Entity name
}

/**
 * Types of entities we track
 */
export type EntityType =
  | 'script_value'
  | 'trait'
  | 'event'
  | 'on_action'
  | 'scripted_modifier'
  | 'scripted_effect'
  | 'scripted_trigger'
  | 'decision';

/**
 * Mapping from entity type to the folder path pattern
 */
const ENTITY_TYPE_PATHS: Record<EntityType, string> = {
  script_value: '/common/script_values/',
  trait: '/common/traits/',
  event: '/events/',
  on_action: '/common/on_action/',
  scripted_modifier: '/common/scripted_modifiers/',
  scripted_effect: '/common/scripted_effects/',
  scripted_trigger: '/common/scripted_triggers/',
  decision: '/common/decisions/',
};

/**
 * Workspace index for CK3 entities
 */
export class CK3WorkspaceIndex {
  private indices: Map<EntityType, Map<string, EntityLocation>>;
  private fileToEntities: Map<string, Map<EntityType, Set<string>>>;
  private initialized = false;
  private indexingPromise: Promise<void> | null = null;

  constructor() {
    this.indices = new Map();
    this.fileToEntities = new Map();

    // Initialize empty indices for each entity type
    for (const type of Object.keys(ENTITY_TYPE_PATHS) as EntityType[]) {
      this.indices.set(type, new Map());
    }
  }

  /**
   * Check if an entity exists
   */
  public has(type: EntityType, name: string): boolean {
    return this.indices.get(type)?.has(name) ?? false;
  }

  /**
   * Get an entity's location
   */
  public get(type: EntityType, name: string): EntityLocation | undefined {
    return this.indices.get(type)?.get(name);
  }

  /**
   * Get all entities of a type
   */
  public getAll(type: EntityType): Map<string, EntityLocation> {
    return this.indices.get(type) ?? new Map();
  }

  /**
   * Get count of entities by type
   */
  public getCount(type: EntityType): number {
    return this.indices.get(type)?.size ?? 0;
  }

  /**
   * Get total count of all entities
   */
  public getTotalCount(): number {
    let total = 0;
    for (const index of this.indices.values()) {
      total += index.size;
    }
    return total;
  }

  /**
   * Index the entire workspace
   */
  public async indexWorkspace(): Promise<void> {
    if (this.indexingPromise) {
      return this.indexingPromise;
    }

    this.indexingPromise = this.doIndexWorkspace();
    await this.indexingPromise;
    this.indexingPromise = null;
  }

  private async doIndexWorkspace(): Promise<void> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return;
    }

    // Find all .txt files in relevant folders
    const patterns = Object.values(ENTITY_TYPE_PATHS).map(p => `**${p}**/*.txt`);

    for (const pattern of patterns) {
      const files = await vscode.workspace.findFiles(pattern);
      for (const file of files) {
        await this.indexFile(file);
      }
    }

    this.initialized = true;
  }

  /**
   * Index game files from a specific path
   */
  public async indexGameFiles(gamePath: string): Promise<void> {
    if (!fs.existsSync(gamePath)) {
      console.log(`CK3 game path not found: ${gamePath}`);
      return;
    }

    for (const [entityType, pathPattern] of Object.entries(ENTITY_TYPE_PATHS)) {
      const folder = path.join(gamePath, 'game', pathPattern.replace(/\//g, path.sep));
      if (!fs.existsSync(folder)) {
        continue;
      }

      await this.indexFolder(folder, entityType as EntityType);
    }
  }

  private async indexFolder(folder: string, entityType: EntityType): Promise<void> {
    const entries = fs.readdirSync(folder, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(folder, entry.name);

      if (entry.isDirectory()) {
        await this.indexFolder(fullPath, entityType);
      } else if (entry.name.endsWith('.txt')) {
        const uri = vscode.Uri.file(fullPath);
        await this.indexFile(uri);
      }
    }
  }

  /**
   * Check if a file is inside the workspace
   */
  private isInWorkspace(uri: vscode.Uri): boolean {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return false;

    return workspaceFolders.some(folder =>
      uri.fsPath.startsWith(folder.uri.fsPath)
    );
  }

  /**
   * Index a single file
   */
  public async indexFile(uri: vscode.Uri): Promise<void> {
    const filePath = uri.fsPath;
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Determine entity type from path
    const entityType = this.getEntityTypeFromPath(normalizedPath);
    if (!entityType) {
      return;
    }

    // Remove old entries from this file
    this.removeFile(uri.toString());

    // Read and parse the file
    // For workspace files, try VS Code's document API first (handles already-open files)
    // For game files (outside workspace), read directly to avoid triggering document events
    let text: string;
    const inWorkspace = this.isInWorkspace(uri);

    if (inWorkspace) {
      try {
        const doc = await vscode.workspace.openTextDocument(uri);
        text = doc.getText();
      } catch {
        try {
          text = fs.readFileSync(filePath, 'utf-8');
        } catch {
          return;
        }
      }
    } else {
      // Game files: read directly, don't open in VS Code
      try {
        text = fs.readFileSync(filePath, 'utf-8');
      } catch {
        return;
      }
    }

    // Parse entities
    const entities = this.parseEntities(text, entityType);

    // Store in index
    const index = this.indices.get(entityType)!;
    const fileEntities = new Map<EntityType, Set<string>>();
    fileEntities.set(entityType, new Set());

    for (const entity of entities) {
      const location: EntityLocation = {
        uri: uri.toString(),
        line: entity.line,
        name: entity.name,
      };

      // Mod files override game files
      index.set(entity.name, location);
      fileEntities.get(entityType)!.add(entity.name);
    }

    this.fileToEntities.set(uri.toString(), fileEntities);
  }

  /**
   * Remove all entities from a file
   */
  public removeFile(uriString: string): void {
    const fileEntities = this.fileToEntities.get(uriString);
    if (!fileEntities) {
      return;
    }

    for (const [entityType, names] of fileEntities) {
      const index = this.indices.get(entityType);
      if (!index) continue;

      for (const name of names) {
        // Only remove if this file owns the entry
        const existing = index.get(name);
        if (existing && existing.uri === uriString) {
          index.delete(name);
        }
      }
    }

    this.fileToEntities.delete(uriString);
  }

  /**
   * Determine entity type from file path
   */
  private getEntityTypeFromPath(normalizedPath: string): EntityType | null {
    for (const [entityType, pathPattern] of Object.entries(ENTITY_TYPE_PATHS)) {
      if (normalizedPath.includes(pathPattern)) {
        return entityType as EntityType;
      }
    }
    return null;
  }

  /**
   * Parse entities from file text
   */
  private parseEntities(text: string, entityType: EntityType): Array<{ name: string; line: number }> {
    const entities: Array<{ name: string; line: number }> = [];
    const lines = text.split('\n');

    // For events, we need to track the current namespace
    let currentNamespace: string | null = null;

    let braceDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (trimmed.startsWith('#') || trimmed === '') {
        continue;
      }

      // Remove inline comments
      const commentIndex = line.indexOf('#');
      const cleanLine = commentIndex >= 0 ? line.substring(0, commentIndex) : line;

      // Count braces
      const openBraces = (cleanLine.match(/\{/g) || []).length;
      const closeBraces = (cleanLine.match(/\}/g) || []).length;

      // At top level (braceDepth 0), look for entity definitions
      if (braceDepth === 0) {
        // Check for namespace declaration (events only)
        if (entityType === 'event') {
          const namespaceMatch = cleanLine.match(/^\s*namespace\s*=\s*(\w+)/);
          if (namespaceMatch) {
            currentNamespace = namespaceMatch[1];
          }
        }

        // Check for entity start: name = { OR name = value
        if (openBraces > 0) {
          const match = cleanLine.match(/^\s*([\w.]+)\s*=\s*\{/);
          if (match) {
            let entityName = match[1];

            // For events with numeric IDs, prepend namespace
            if (entityType === 'event' && /^\d+$/.test(entityName) && currentNamespace) {
              entityName = `${currentNamespace}.${entityName}`;
            }

            entities.push({ name: entityName, line: i });
          }
        } else {
          // Simple value assignment (script values can be just `name = 100`)
          const simpleMatch = cleanLine.match(/^\s*(\w+)\s*=\s*[^{]/);
          if (simpleMatch && entityType === 'script_value') {
            entities.push({ name: simpleMatch[1], line: i });
          }
        }
      }

      braceDepth += openBraces - closeBraces;
    }

    return entities;
  }

  /**
   * Check if the index is ready
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Wait for indexing to complete
   */
  public async waitForIndex(): Promise<void> {
    if (this.indexingPromise) {
      await this.indexingPromise;
    }
  }
}
