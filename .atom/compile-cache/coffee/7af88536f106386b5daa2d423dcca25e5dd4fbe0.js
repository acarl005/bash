(function() {
  var BufferedProcess, Emitter, Runner, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('atom'), Emitter = _ref.Emitter, BufferedProcess = _ref.BufferedProcess;

  module.exports = Runner = (function() {
    Runner.prototype.bufferedProcess = null;

    function Runner(scriptOptions, emitter) {
      this.scriptOptions = scriptOptions;
      this.emitter = emitter != null ? emitter : new Emitter;
      this.createOnErrorFunc = __bind(this.createOnErrorFunc, this);
      this.onExit = __bind(this.onExit, this);
      this.stderrFunc = __bind(this.stderrFunc, this);
      this.stdoutFunc = __bind(this.stdoutFunc, this);
    }

    Runner.prototype.run = function(command, extraArgs, codeContext, inputString) {
      var args, exit, options, stderr, stdout;
      if (inputString == null) {
        inputString = null;
      }
      this.startTime = new Date();
      args = this.args(codeContext, extraArgs);
      options = this.options();
      stdout = this.stdoutFunc;
      stderr = this.stderrFunc;
      exit = this.onExit;
      this.bufferedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      if (inputString) {
        this.bufferedProcess.process.stdin.write(inputString);
        this.bufferedProcess.process.stdin.end();
      }
      return this.bufferedProcess.onWillThrowError(this.createOnErrorFunc(command));
    };

    Runner.prototype.stdoutFunc = function(output) {
      return this.emitter.emit('did-write-to-stdout', {
        message: output
      });
    };

    Runner.prototype.onDidWriteToStdout = function(callback) {
      return this.emitter.on('did-write-to-stdout', callback);
    };

    Runner.prototype.stderrFunc = function(output) {
      return this.emitter.emit('did-write-to-stderr', {
        message: output
      });
    };

    Runner.prototype.onDidWriteToStderr = function(callback) {
      return this.emitter.on('did-write-to-stderr', callback);
    };

    Runner.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    Runner.prototype.getCwd = function() {
      var cwd, paths, workingDirectoryProvided;
      cwd = this.scriptOptions.workingDirectory;
      workingDirectoryProvided = (cwd != null) && cwd !== '';
      paths = atom.project.getPaths();
      if (!workingDirectoryProvided && (paths != null ? paths.length : void 0) > 0) {
        cwd = paths[0];
      }
      return cwd;
    };

    Runner.prototype.stop = function() {
      if (this.bufferedProcess != null) {
        this.bufferedProcess.kill();
        return this.bufferedProcess = null;
      }
    };

    Runner.prototype.onExit = function(returnCode) {
      var executionTime;
      this.bufferedProcess = null;
      if ((atom.config.get('script.enableExecTime')) === true && this.startTime) {
        executionTime = (new Date().getTime() - this.startTime.getTime()) / 1000;
      }
      return this.emitter.emit('did-exit', {
        executionTime: executionTime,
        returnCode: returnCode
      });
    };

    Runner.prototype.onDidExit = function(callback) {
      return this.emitter.on('did-exit', callback);
    };

    Runner.prototype.createOnErrorFunc = function(command) {
      return (function(_this) {
        return function(nodeError) {
          _this.bufferedProcess = null;
          _this.emitter.emit('did-not-run', {
            command: command
          });
          return nodeError.handle();
        };
      })(this);
    };

    Runner.prototype.onDidNotRun = function(callback) {
      return this.emitter.on('did-not-run', callback);
    };

    Runner.prototype.options = function() {
      return {
        cwd: this.getCwd(),
        env: this.scriptOptions.mergedEnv(process.env)
      };
    };

    Runner.prototype.args = function(codeContext, extraArgs) {
      var args;
      args = (this.scriptOptions.cmdArgs.concat(extraArgs)).concat(this.scriptOptions.scriptArgs);
      if ((this.scriptOptions.cmd == null) || this.scriptOptions.cmd === '') {
        args = codeContext.shebangCommandArgs().concat(args);
      }
      return args;
    };

    return Runner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3J1bm5lci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLE9BQTZCLE9BQUEsQ0FBUSxNQUFSLENBQTdCLEVBQUMsZUFBQSxPQUFELEVBQVUsdUJBQUEsZUFBVixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHFCQUFBLGVBQUEsR0FBaUIsSUFBakIsQ0FBQTs7QUFNYSxJQUFBLGdCQUFFLGFBQUYsRUFBa0IsT0FBbEIsR0FBQTtBQUEwQyxNQUF6QyxJQUFDLENBQUEsZ0JBQUEsYUFBd0MsQ0FBQTtBQUFBLE1BQXpCLElBQUMsQ0FBQSw0QkFBQSxVQUFVLEdBQUEsQ0FBQSxPQUFjLENBQUE7QUFBQSxtRUFBQSxDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSxxREFBQSxDQUExQztJQUFBLENBTmI7O0FBQUEscUJBUUEsR0FBQSxHQUFLLFNBQUMsT0FBRCxFQUFVLFNBQVYsRUFBcUIsV0FBckIsRUFBa0MsV0FBbEMsR0FBQTtBQUNILFVBQUEsbUNBQUE7O1FBRHFDLGNBQWM7T0FDbkQ7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsSUFBQSxDQUFBLENBQWpCLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxJQUFDLENBQUEsSUFBRCxDQUFNLFdBQU4sRUFBbUIsU0FBbkIsQ0FGUCxDQUFBO0FBQUEsTUFHQSxPQUFBLEdBQVUsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUhWLENBQUE7QUFBQSxNQUlBLE1BQUEsR0FBUyxJQUFDLENBQUEsVUFKVixDQUFBO0FBQUEsTUFLQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFVBTFYsQ0FBQTtBQUFBLE1B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

//# sourceURL=/home/andy/.atom/packages/script/lib/runner.coffee
