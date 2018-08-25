'use strict'

const { commands } = require('vscode')
const insertUseStrict = require('./main')

// function called when the extension is activated
exports.activate = context => {
  const disposable = commands.registerCommand(
    'extension.insertUseStrict',
    insertUseStrict
  )

  context.subscriptions.push(disposable)
}

// function called when the extension is deactivated
exports.deactivate = () => {}
