'use strict'

const { commands } = require('vscode')
const { applyToWorkspace } = require('./main')

// function called when the extension is activated
exports.activate = context => {
  const command = commands.registerCommand(
    'extension.insertUseStrict',
    applyToWorkspace
  )

  context.subscriptions.push(command)
}

// function called when the extension is deactivated
exports.deactivate = () => {}
