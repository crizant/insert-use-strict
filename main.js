'use strict'

const { window, workspace, Position, WorkspaceEdit } = require('vscode')
const { EOL } = require('os')
const { pattern } = require('./constants')

const config = workspace.getConfiguration('insertUseStrict')

const getUseStrictStatement = () => {
  const QUOTE = config.useDoubleQuote ? '"' : "'"
  const TAIL = config.addTrailingSemicolon ? ';' : ''

  return `${QUOTE}use strict${QUOTE}${TAIL}`
}

const insertUseStrict = async () => {
  const files = await workspace.findFiles(
    '**/*.{js,ts,jsx}',
    '**/node_modules/**'
  )
  const USE_STRICT_STATEMENT = getUseStrictStatement()
  const startPosition = new Position(0, 0)
  const workSpaceEdit = new WorkspaceEdit()

  if (!files.length) {
    window.showErrorMessage('Your workspace contains no JavaScript files.')
    return
  }

  await Promise.all(
    files.map(async file => {
      const document = await workspace.openTextDocument(file)
      const content = document.getText()

      if (!pattern.test(content)) {
        workSpaceEdit.insert(
          file,
          startPosition,
          `${USE_STRICT_STATEMENT}${EOL}${EOL}`
        )
      }
    })
  )

  await workspace.applyEdit(workSpaceEdit)

  if (config.autoSave) {
    await workspace.saveAll()
  }

  window.showInformationMessage(`Done. ${workSpaceEdit.size} file(s) updated.`)
}

module.exports = () => {
  window.setStatusBarMessage('Inserting "use strict"...', insertUseStrict())
}
