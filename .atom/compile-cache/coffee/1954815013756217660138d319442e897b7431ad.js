(function() {
  var CommandContext, Emitter, Runtime, _;

  CommandContext = require('./command-context');

  _ = require('underscore');

  Emitter = require('atom').Emitter;

  module.exports = Runtime = (function() {
    Runtime.prototype.observers = [];

    function Runtime(runner, codeContextBuilder, observers, emitter) {
      this.runner = runner;
      this.codeContextBuilder = codeContextBuilder;
      this.observers = observers != null ? observers : [];
      this.emitter = emitter != null ? emitter : new Emitter;
      this.scriptOptions = this.runner.scriptOptions;
      _.each(this.observers, (function(_this) {
        return function(observer) {
          return observer.observe(_this);
        };
      })(this));
    }

    Runtime.prototype.addObserver = function(observer) {
      this.observers.push(observer);
      return observer.observe(this);
    };

    Runtime.prototype.destroy = function() {
      this.stop();
      this.runner.destroy();
      _.each(this.observers, (function(_this) {
        return function(observer) {
          return observer.destroy();
        };
      })(this));
      this.emitter.dispose();
      return this.codeContextBuilder.destroy();
    };

    Runtime.prototype.execute = function(argType, input) {
      var codeContext, commandContext;
      if (argType == null) {
        argType = "Selection Based";
      }
      if (input == null) {
        input = null;
      }
      if (atom.config.get('script.stopOnRerun')) {
        this.stop();
      }
      this.emitter.emit('did-execute-start');
      codeContext = this.codeContextBuilder.buildCodeContext(atom.workspace.getActiveTextEditor(), argType);
      if (codeContext.lang == null) {
        return;
      }
      commandContext = CommandContext.build(this, this.scriptOptions, codeContext);
      if (!commandContext) {
        return;
      }
      this.emitter.emit('did-context-create', {
        lang: codeContext.lang,
        filename: codeContext.filename,
        lineNumber: codeContext.lineNumber
      });
      return this.runner.run(commandContext.command, commandContext.args, codeContext, input);
    };

    Runtime.prototype.stop = function() {
      this.runner.stop();
      return this.emitter.emit('did-execute-stop');
    };

    Runtime.prototype.onDidExecuteStart = function(callback) {
      return this.emitter.on('did-execute-start', callback);
    };

    Runtime.prototype.onDidExecuteStop = function(callback) {
      return this.emitter.on('did-execute-stop', callback);
    };

    Runtime.prototype.onDidNotSpecifyLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSpecifyLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportLanguage = function(callback) {
      return this.codeContextBuilder.onDidNotSupportLanguage(callback);
    };

    Runtime.prototype.onDidNotSupportMode = function(callback) {
      return this.emitter.on('did-not-support-mode', callback);
    };

    Runtime.prototype.onDidNotBuildArgs = function(callback) {
      return this.emitter.on('did-not-build-args', callback);
    };

    Runtime.prototype.onDidContextCreate = function(callback) {
      return this.emitter.on('did-context-create', callback);
    };

    Runtime.prototype.onDidWriteToStdout = function(callback) {
      return this.runner.onDidWriteToStdout(callback);
    };

    Runtime.prototype.onDidWriteToStderr = function(callback) {
      return this.runner.onDidWriteToStderr(callback);
    };

    Runtime.prototype.onDidExit = function(callback) {
      return this.runner.onDidExit(callback);
    };

    Runtime.prototype.onDidNotRun = function(callback) {
      return this.runner.onDidNotRun(callback);
    };

    Runtime.prototype.modeNotSupported = function(argType, lang) {
      return this.emitter.emit('did-not-support-mode', {
        argType: argType,
        lang: lang
      });
    };

    Runtime.prototype.didNotBuildArgs = function(error) {
      return this.emitter.emit('did-not-build-args', {
        error: error
      });
    };

    return Runtime;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3J1bnRpbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBakIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUZKLENBQUE7O0FBQUEsRUFJQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FKRCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNCQUFBLFNBQUEsR0FBVyxFQUFYLENBQUE7O0FBS2EsSUFBQSxpQkFBRSxNQUFGLEVBQVcsa0JBQVgsRUFBZ0MsU0FBaEMsRUFBaUQsT0FBakQsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLHFCQUFBLGtCQUN0QixDQUFBO0FBQUEsTUFEMEMsSUFBQyxDQUFBLGdDQUFBLFlBQVksRUFDdkQsQ0FBQTtBQUFBLE1BRDJELElBQUMsQ0FBQSw0QkFBQSxVQUFVLEdBQUEsQ0FBQSxPQUN0RSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQXpCLENBQUE7QUFBQSxNQUNBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLFNBQVIsRUFBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxHQUFBO2lCQUFjLFFBQVEsQ0FBQyxPQUFULENBQWlCLEtBQWpCLEVBQWQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQixDQURBLENBRFc7SUFBQSxDQUxiOztBQUFBLHNCQWVBLFdBQUEsR0FBYSxTQUFDLFFBQUQs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

//# sourceURL=/home/andy/.atom/packages/script/lib/runtime.coffee
