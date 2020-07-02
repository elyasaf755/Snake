const childProcess = require("child_process");

/**
 * @param {string} command A shell command to execute
 * @return {Promise<string>} A promise that resolve to the output of the shell command, or an error
 * @example const output = await execute("ls -alh");
 */
function execute(command) {
  /**
   * @param {Function} resolve A function that resolves the promise
   * @param {Function} reject A function that fails the promise
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   */
  return new Promise(function(resolve, reject) {
    /**
     * @param {Error} error An error triggered during the execution of the childProcess.exec command
     * @param {string|Buffer} standardOutput The result of the shell command execution
     * @param {string|Buffer} standardError The error resulting of the shell command execution
     * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
     */
    childProcess.exec(command, function(error, standardOutput, standardError) {
      if (error) {
        reject();

        return;
      }

      if (standardError) {
        reject(standardError);

        return;
      }

      resolve(standardOutput);
    });
  });
}

exports.execute = async (args) => {
    // args => https://egodigital.github.io/vscode-powertools/api/interfaces/_contracts_.buttonactionscriptarguments.html

    // s. https://code.visualstudio.com/api/references/vscode-api
    const vscode = args.require('vscode');

    const currentDirectory = 'C:\\Users\\elyas\\Desktop\\Snake'
    const compilerPath = 'C:\\Users\\elyas\\OneDrive - IEPQIP\\אליסף אלבז\\לימודים\\שנה ג\\סמסטר ב\\עקרונות שפות תכנה\\Nand2Tetris\\nand2tetris\\tools';
    const command = 'cd ' + compilerPath + ' && JackCompiler ' + currentDirectory;
    const pattern = /(In \w+.jack)/g;

    try {
        const ans = await execute(command);

        if (ans.trim() === 'Compiling \"C:\\Users\\elyas\\Desktop\\Snake\" '.trim()){
          vscode.window.showInformationMessage(ans.trim() + ' . . . \xa0 SUCCESS!');
        }
        else{
          showErrors(error.toString(), 0, pattern);
        }
        
    }
    catch (error) {
        showErrors(error.toString(), 0, pattern);
    }

    // init s = error, j = 0
    function showErrors(s, j, pattern){

      s = s.substring(j)
      var i = s.search(pattern);
      
      var substring = s.substring(i + 1)
      var j = substring.search(pattern);
      let GoToFile = 'Go to File'; 

      if (j != -1){
        showErrors(s, j, pattern);
        
        var k = s.search(/(\w+.jack)/);
        var l = s.search(/(.jack)/)
        var fileName = s.substring(k, l);

        vscode.window.showInformationMessage(s.substring(i, j), GoToFile).then(selection => {
          if (selection === GoToFile) {
            vscode.workspace.openTextDocument(currentDirectory + '\\' + fileName + '.jack')
            .then(document => vscode.window.showTextDocument(document))
            .then(x=>{
              let m = s.substring(i, j).search(/\(line \d+\)/);
              let subStr = s.substring(m + 6);
              let n = subStr.search(/\)/);
              subStr = subStr.substring(0, n);
              let lineToGo = parseInt(subStr.match(/\d+/));

              let activeEditor = vscode.window.activeTextEditor;
              let range = activeEditor.document.lineAt(lineToGo - 1).range;
              activeEditor.selection =  new vscode.Selection(range.start, range.end);
              activeEditor.revealRange(range);
            })
            
          }
        });

        return;
      }
      else{
        var k = s.search(/(\w+.jack)/);
        var l = s.search(/(.jack)/)
        var fileName = s.substring(k, l);
        
        vscode.window.showInformationMessage(s.substring(i), GoToFile).then(selection => {
          if (selection === GoToFile) {
            vscode.workspace.openTextDocument(currentDirectory + '\\' + fileName + '.jack')
            .then(document => vscode.window.showTextDocument(document))
            .then(x => {
              let m = s.substring(i, j).search(/\(line \d+\)/);
              let subStr = s.substring(m + 6);
              let n = subStr.search(/\)/);
              subStr = subStr.substring(0, n);
              let lineToGo = parseInt(subStr.match(/\d+/));

              let activeEditor = vscode.window.activeTextEditor;
              let range = activeEditor.document.lineAt(lineToGo - 1).range;
              activeEditor.selection =  new vscode.Selection(range.start, range.end);
              activeEditor.revealRange(range);
            })
          }
        });

        return; 
      }
    }
};