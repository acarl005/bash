(function() {
  var CommandContext, grammarMap;

  grammarMap = require('./grammars');

  module.exports = CommandContext = (function() {
    function CommandContext() {}

    CommandContext.prototype.command = null;

    CommandContext.prototype.args = [];

    CommandContext.build = function(runtime, runOptions, codeContext) {
      var buildArgsArray, commandContext, error, errorSendByArgs;
      commandContext = new CommandContext;
      try {
        if ((runOptions.cmd == null) || runOptions.cmd === '') {
          commandContext.command = codeContext.shebangCommand() || grammarMap[codeContext.lang][codeContext.argType].command;
        } else {
          commandContext.command = runOptions.cmd;
        }
        buildArgsArray = grammarMap[codeContext.lang][codeContext.argType].args;
      } catch (_error) {
        error = _error;
        runtime.modeNotSupported(codeContext.argType, codeContext.lang);
        return false;
      }
      try {
        commandContext.args = buildArgsArray(codeContext);
      } catch (_error) {
        errorSendByArgs = _error;
        runtime.didNotBuildArgs(errorSendByArgs);
        return false;
      }
      return commandContext;
    };

    return CommandContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2NvbW1hbmQtY29udGV4dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMEJBQUE7O0FBQUEsRUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FBYixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtnQ0FDSjs7QUFBQSw2QkFBQSxPQUFBLEdBQVMsSUFBVCxDQUFBOztBQUFBLDZCQUNBLElBQUEsR0FBTSxFQUROLENBQUE7O0FBQUEsSUFHQSxjQUFDLENBQUEsS0FBRCxHQUFRLFNBQUMsT0FBRCxFQUFVLFVBQVYsRUFBc0IsV0FBdEIsR0FBQTtBQUNOLFVBQUEsc0RBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsR0FBQSxDQUFBLGNBQWpCLENBQUE7QUFFQTtBQUNFLFFBQUEsSUFBTyx3QkFBSixJQUF1QixVQUFVLENBQUMsR0FBWCxLQUFrQixFQUE1QztBQUVFLFVBQUEsY0FBYyxDQUFDLE9BQWYsR0FBeUIsV0FBVyxDQUFDLGNBQVosQ0FBQSxDQUFBLElBQWdDLFVBQVcsQ0FBQSxXQUFXLENBQUMsSUFBWixDQUFrQixDQUFBLFdBQVcsQ0FBQyxPQUFaLENBQW9CLENBQUMsT0FBM0csQ0FGRjtTQUFBLE1BQUE7QUFJRSxVQUFBLGNBQWMsQ0FBQyxPQUFmLEdBQXlCLFVBQVUsQ0FBQyxHQUFwQyxDQUpGO1NBQUE7QUFBQSxRQU1BLGNBQUEsR0FBaUIsVUFBVyxDQUFBLFdBQVcsQ0FBQyxJQUFaLENBQWtCLENBQUEsV0FBVyxDQUFDLE9BQVosQ0FBb0IsQ0FBQyxJQU5uRSxDQURGO09BQUEsY0FBQTtBQVVFLFFBREksY0FDSixDQUFBO0FBQUEsUUFBQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsV0FBVyxDQUFDLE9BQXJDLEVBQThDLFdBQVcsQ0FBQyxJQUExRCxDQUFBLENBQUE7QUFDQSxlQUFPLEtBQVAsQ0FYRjtPQUZBO0FBZUE7QUFDRSxRQUFBLGNBQWMsQ0FBQyxJQUFmLEdBQXNCLGNBQUEsQ0FBZSxXQUFmLENBQXRCLENBREY7T0FBQSxjQUFBO0FBR0UsUUFESSx3QkFDSixDQUFBO0FBQUEsUUFBQSxPQUFPLENBQUMsZUFBUixDQUF3QixlQUF4QixDQUFBLENBQUE7QUFDQSxlQUFPLEtBQVAsQ0FKRjtPQWZBO2FBc0JBLGVBdkJNO0lBQUEsQ0FIUixDQUFBOzswQkFBQTs7TUFKRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/script/lib/command-context.coffee
