(function() {
  var CodeContextBuilder, CompositeDisposable, GrammarUtils, Runner, Runtime, ScriptOptions, ScriptOptionsView, ScriptView, ViewRuntimeObserver;

  CodeContextBuilder = require('./code-context-builder');

  GrammarUtils = require('./grammar-utils');

  Runner = require('./runner');

  Runtime = require('./runtime');

  ScriptOptions = require('./script-options');

  ScriptOptionsView = require('./script-options-view');

  ScriptView = require('./script-view');

  ViewRuntimeObserver = require('./view-runtime-observer');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      enableExecTime: {
        title: 'Output the time it took to execute the script',
        type: 'boolean',
        "default": true
      },
      escapeConsoleOutput: {
        title: 'HTML escape console output',
        type: 'boolean',
        "default": true
      },
      scrollWithOutput: {
        title: 'Scroll with output',
        type: 'boolean',
        "default": true
      },
      stopOnRerun: {
        title: 'Stop running process on rerun',
        type: 'boolean',
        "default": false
      }
    },
    scriptView: null,
    scriptOptionsView: null,
    scriptOptions: null,
    activate: function(state) {
      var codeContextBuilder, observer, runner;
      this.scriptView = new ScriptView(state.scriptViewState);
      this.scriptOptions = new ScriptOptions();
      this.scriptOptionsView = new ScriptOptionsView(this.scriptOptions);
      codeContextBuilder = new CodeContextBuilder;
      runner = new Runner(this.scriptOptions);
      observer = new ViewRuntimeObserver(this.scriptView);
      this.runtime = new Runtime(runner, codeContextBuilder, [observer]);
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'script:close-view': (function(_this) {
          return function() {
            return _this.closeScriptViewAndStopRunner();
          };
        })(this),
        'script:copy-run-results': (function(_this) {
          return function() {
            return _this.scriptView.copyResults();
          };
        })(this),
        'script:kill-process': (function(_this) {
          return function() {
            return _this.runtime.stop();
          };
        })(this),
        'script:run-by-line-number': (function(_this) {
          return function() {
            return _this.runtime.execute('Line Number Based');
          };
        })(this),
        'script:run': (function(_this) {
          return function() {
            return _this.runtime.execute('Selection Based');
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.runtime.destroy();
      this.scriptView.removePanel();
      this.scriptOptionsView.close();
      this.subscriptions.dispose();
      return GrammarUtils.deleteTempFiles();
    },
    closeScriptViewAndStopRunner: function() {
      this.runtime.stop();
      return this.scriptView.removePanel();
    },
    provideDefaultRuntime: function() {
      return this.runtime;
    },
    provideBlankRuntime: function() {
      var codeContextBuilder, runner;
      runner = new Runner(new ScriptOptions);
      codeContextBuilder = new CodeContextBuilder;
      return new Runtime(runner, codeContextBuilder, []);
    },
    serialize: function() {
      return {
        scriptViewState: this.scriptView.serialize(),
        scriptOptionsViewState: this.scriptOptionsView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUlBQUE7O0FBQUEsRUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FBckIsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBRlQsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUhWLENBQUE7O0FBQUEsRUFJQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQUpoQixDQUFBOztBQUFBLEVBS0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBTHBCLENBQUE7O0FBQUEsRUFNQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FOYixDQUFBOztBQUFBLEVBT0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBUHRCLENBQUE7O0FBQUEsRUFTQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBVEQsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sK0NBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtPQURGO0FBQUEsTUFJQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sNEJBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsSUFGVDtPQUxGO0FBQUEsTUFRQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxL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

//# sourceURL=/home/andy/.atom/packages/script/lib/script.coffee
