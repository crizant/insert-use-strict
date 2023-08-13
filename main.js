"use strict";

const { minimatch } = require("minimatch");
const { window, workspace, Position, WorkspaceEdit } = require("vscode");
const { EOL } = require("os");
const { pattern } = require("./constants");

const getUseStrictStatement = () => {
  const config = workspace.getConfiguration("insertUseStrict");
  const QUOTE = config.useDoubleQuote ? '"' : "'";
  const TAIL = config.addTrailingSemicolon ? ";" : "";

  return `${QUOTE}use strict${QUOTE}${TAIL}`;
};

const needToInsert = async (file) => {
  const document = await workspace.openTextDocument(file);
  const content = document.getText();
  return !pattern.test(content);
};

const applyToWorkspace = async () => {
  const config = workspace.getConfiguration("insertUseStrict");
  const files = await workspace.findFiles(
    config.globPattern,
    "**/node_modules/**"
  );
  const USE_STRICT_STATEMENT = getUseStrictStatement();
  const startPosition = new Position(0, 0);
  const workSpaceEdit = new WorkspaceEdit();

  if (!files.length) {
    window.showErrorMessage("Your workspace contains no JavaScript files.");
    return;
  }

  await Promise.all(
    files.map(async (file) => {
      if (await needToInsert(file)) {
        workSpaceEdit.insert(
          file,
          startPosition,
          `${USE_STRICT_STATEMENT}${EOL}${EOL}`
        );
      }
    })
  );

  await workspace.applyEdit(workSpaceEdit);

  if (config.autoSave) {
    await workspace.saveAll();
  }

  window.showInformationMessage(`Done. ${workSpaceEdit.size} file(s) updated.`);
};

const applyToNewFiles = async (event) => {
  const config = workspace.getConfiguration("insertUseStrict");
  if (config.autoApplyToNewFiles) {
    const USE_STRICT_STATEMENT = getUseStrictStatement();
    const startPosition = new Position(0, 0);
    const workSpaceEdit = new WorkspaceEdit();
    const files = event.files.filter((file) =>
      minimatch(file.path, config.globPattern)
    );

    await Promise.all(
      files.map(async (file) => {
        if (await needToInsert(file)) {
          workSpaceEdit.insert(
            file,
            startPosition,
            `${USE_STRICT_STATEMENT}${EOL}${EOL}`
          );
        }
      })
    );

    await workspace.applyEdit(workSpaceEdit);

    if (config.autoSave) {
      await workspace.saveAll();
    }

    window.showInformationMessage(`${workSpaceEdit.size} new file(s) updated.`);
  }
};

module.exports = {
  applyToWorkspace: () => {
    window.setStatusBarMessage(
      'Inserting "use strict" to workspace...',
      applyToWorkspace()
    );
  },
  applyToNewFiles,
};
