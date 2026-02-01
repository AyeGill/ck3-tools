"use strict";
/**
 * Schema definition for CK3 GUI Types - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.guiTypeSchemaMap = exports.guiTypeSchema = void 0;
exports.getGuiTypeFieldNames = getGuiTypeFieldNames;
exports.getGuiTypeFieldDocumentation = getGuiTypeFieldDocumentation;
exports.guiTypeSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Name identifier for the GUI type.',
        example: 'name = "my_window"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of GUI element.',
        values: ['window', 'widget', 'button', 'icon', 'text', 'container', 'scrollbar', 'progressbar'],
        example: 'type = window',
    },
    // Position
    {
        name: 'position',
        type: 'block',
        description: 'Position of the element.',
        example: 'position = { 100 200 }',
    },
    {
        name: 'size',
        type: 'block',
        description: 'Size of the element.',
        example: 'size = { 400 300 }',
    },
    // Parent/Children
    {
        name: 'parentanchor',
        type: 'enum',
        description: 'Parent anchor point.',
        values: ['top|left', 'top|right', 'bottom|left', 'bottom|right', 'center', 'top|hcenter', 'bottom|hcenter', 'vcenter|left', 'vcenter|right'],
        example: 'parentanchor = center',
    },
    {
        name: 'widgetanchor',
        type: 'enum',
        description: 'Widget anchor point.',
        values: ['top|left', 'top|right', 'bottom|left', 'bottom|right', 'center', 'top|hcenter', 'bottom|hcenter', 'vcenter|left', 'vcenter|right'],
        example: 'widgetanchor = center',
    },
    // Visibility
    {
        name: 'visible',
        type: 'string',
        description: 'Visibility condition.',
        example: 'visible = "[GetVariableSystem.Exists(\'show_window\')]"',
    },
    // Background
    {
        name: 'background',
        type: 'block',
        description: 'Background definition.',
        example: `background = {
    using = Background_Frame
}`,
    },
    // Text
    {
        name: 'text',
        type: 'string',
        description: 'Text content or localization key.',
        example: 'text = "MY_TEXT_KEY"',
    },
    {
        name: 'fontsize',
        type: 'integer',
        description: 'Font size.',
        example: 'fontsize = 14',
    },
    // Texture
    {
        name: 'texture',
        type: 'string',
        description: 'Texture file.',
        example: 'texture = "gfx/interface/icons/icon.dds"',
    },
    // Events
    {
        name: 'onclick',
        type: 'string',
        description: 'Click event handler.',
        example: 'onclick = "[ExecuteConsoleCommand(\'event test.1\')]"',
    },
    {
        name: 'onrightclick',
        type: 'string',
        description: 'Right-click event handler.',
        example: 'onrightclick = "[GetVariableSystem.Toggle(\'show_menu\')]"',
    },
    // Tooltip
    {
        name: 'tooltip',
        type: 'string',
        description: 'Tooltip text or localization key.',
        example: 'tooltip = "TOOLTIP_KEY"',
    },
];
// Map for quick lookup
exports.guiTypeSchemaMap = new Map(exports.guiTypeSchema.map((field) => [field.name, field]));
function getGuiTypeFieldNames() {
    return exports.guiTypeSchema.map((field) => field.name);
}
function getGuiTypeFieldDocumentation(fieldName) {
    const field = exports.guiTypeSchemaMap.get(fieldName);
    if (!field)
        return undefined;
    let doc = field.description;
    if (field.type === 'enum' && field.values) {
        doc += `\n\nValid values: ${field.values.join(', ')}`;
    }
    if (field.default !== undefined) {
        doc += `\n\nDefault: ${field.default}`;
    }
    if (field.example) {
        doc += `\n\nExample:\n\`\`\`\n${field.example}\n\`\`\``;
    }
    return doc;
}
//# sourceMappingURL=guiTypeSchema.js.map