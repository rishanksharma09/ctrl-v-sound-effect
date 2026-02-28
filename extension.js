// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const { exec } = require('child_process');
const os = require("os");



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function playSoundEffect(soundPath) {
	const platform = os.platform();

	if (platform === "win32") {
		exec(`powershell -Command "$player = New-Object System.Media.SoundPlayer(\\"${soundPath}\\"); $player.PlaySync();"`);
	}
	else if (platform === "darwin") {
		exec(`afplay "${soundPath}"`);
	}
	else if (platform === "linux") {
		exec(`aplay "${soundPath}"`);
	}
	else {
		console.log("Unsupported OS");
	}
}
/**
 * @param {vscode.ExtensionContext} context
 */


function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "bruh-paste-sound" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	// The code you place here will be executed every time your command is executed

	const soundPath = path.join(context.extensionPath, 'media/cheating-sound.wav');
	console.log('Playing sound from path:', soundPath);

	let lastPlayed = 0;
	const cooldown = 1000;


	const disposable = vscode.workspace.onDidChangeTextDocument(async (event) => {

		if (event.contentChanges.length === 0) return;

		const change = event.contentChanges[0];
		const clipboardText = await vscode.env.clipboard.readText();

		const now = Date.now();
		if (now - lastPlayed < cooldown) return;

		if (
			change.text &&
			clipboardText &&
			change.text.length > 0 &&
			clipboardText.includes(change.text)
		) {
			console.log('Detected paste action, playing sound effect.');
			lastPlayed = now;
			playSoundEffect(soundPath);
		}
	});




	// Add disposable to context subscriptions
	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
