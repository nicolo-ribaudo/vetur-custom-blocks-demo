import * as vscode from "vscode";
import * as path from "path";
import * as isEqual from "lodash.isequal";

import { generateJSONGrammar, Blocks } from "./grammar-generator";
import { writeFile } from "./fs";

const grammarPath = path.resolve(__dirname, "../../syntaxes/vue-custom-blocks.tmLanguage.json");

const BLOCKS_OPTION = "vetur-custom-blocks.blocks";
const BLOCKS_STATE = "vetur-custom-blocks.blocks";

const SETTINGS_CHANGED_MSG = "Reload VSCode to apply the changes to vetur-custom-blocks";
const RELOAD_BUTTON_MSG = "Reload";

export function activate(context: vscode.ExtensionContext) {
    vscode.workspace.onDidChangeConfiguration(async (...args) => {
        const blocks = vscode.workspace.getConfiguration().get<Blocks>(BLOCKS_OPTION);
        const oldBlocks = context.globalState.get<Blocks>(BLOCKS_STATE, {});

        if (isEqual(blocks, oldBlocks)) return;

        await context.globalState.update(BLOCKS_STATE, blocks);
        await writeFile(grammarPath, generateJSONGrammar(blocks));

        const action = await vscode.window.showInformationMessage(
            SETTINGS_CHANGED_MSG,
            RELOAD_BUTTON_MSG
        );

        if (action === RELOAD_BUTTON_MSG) {
            vscode.commands.executeCommand("workbench.action.reloadWindow");
        }
    });
}

// this method is called when your extension is deactivated
export function deactivate() {
}
