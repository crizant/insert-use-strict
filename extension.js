"use strict";

const { commands, workspace } = require("vscode");
const { applyToWorkspace, applyToNewFiles } = require("./main");

// function called when the extension is activated
exports.activate = (context) => {
  const command = commands.registerCommand(
    "extension.insertUseStrict",
    applyToWorkspace
  );

  const fileCreateHandler = workspace.onDidCreateFiles(applyToNewFiles);

  context.subscriptions.push(command, fileCreateHandler);
};

// function called when the extension is deactivated
exports.deactivate = () => {};
