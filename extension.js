// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Q = require('q');
const QRCode = require('qrcode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.text2qrcode', function () {
    getSelectedTextOrPrompt('Text to convert into QR code')
      .then(text => {
        if (!text) { return; }

        QRCode.toDataURL(text, {errorCorrectionLevel: 'L'}, function (err, url) {

          if (!err) {
            // Create and show panel
            const panel = vscode.window.createWebviewPanel(
              'Text2QRCode',
              'Text2QRCode',
              vscode.ViewColumn.One,
              {}
            );

            // And set its HTML content
            panel.webview.html = getPreviewHtml(url);
          } else {
            vscode.window.showErrorMessage(err.message);
          }
        });
      });
  });

  context.subscriptions.push(disposable);
}

function getPreviewHtml(image) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Text2QRCode</title>
    </head>
    <body>
    <div style="display: flex; min-height: 240px; height: 100%; width: 100%;">
        <div style="display: flex; flex: 1; flex-direction: column; justify-content: center;">
            <img src="${image}" style="align-self: center;" />
        </div>
    </div>
    </body>
    </html>`;
}

function getSelectedTextOrPrompt(prompt) {
  const activeTextEditor = vscode.window.activeTextEditor;

  if (activeTextEditor) {
    const
      selection = activeTextEditor.selection,
      start = selection.start,
      end = selection.end;

    if (start.line !== end.line || start.character !== end.character) {
      return Q(activeTextEditor.document.getText(selection));
    }
  }

  return vscode.window.showInputBox({ prompt });
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
}
