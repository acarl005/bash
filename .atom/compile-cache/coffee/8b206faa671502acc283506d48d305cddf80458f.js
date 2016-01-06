(function() {
  var CompositeDisposable, ScriptOptionsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  module.exports = ScriptOptionsView = (function(_super) {
    __extends(ScriptOptionsView, _super);

    function ScriptOptionsView() {
      return ScriptOptionsView.__super__.constructor.apply(this, arguments);
    }

    ScriptOptionsView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top panel',
            outlet: 'scriptOptionsView'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, 'Configure Run Options');
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Current Working Directory:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputCwd'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Command');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputCommand'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Command Arguments:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputCommandArgs'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Program Arguments:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputScriptArgs'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Environment Variables:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputEnv'
                });
              });
              return _this.div({
                "class": 'block'
              }, function() {
                var css;
                css = 'btn inline-block-tight';
                _this.button({
                  "class": "btn " + css,
                  click: 'close'
                }, 'Close');
                return _this.button({
                  "class": "btn " + css,
                  click: 'run'
                }, 'Run');
              });
            });
          });
        };
      })(this));
    };

    ScriptOptionsView.prototype.initialize = function(runOptions) {
      this.runOptions = runOptions;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.toggleScriptOptions('hide');
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.toggleScriptOptions('hide');
          };
        })(this),
        'script:close-options': (function(_this) {
          return function() {
            return _this.toggleScriptOptions('hide');
          };
        })(this),
        'script:run-options': (function(_this) {
          return function() {
            return _this.toggleScriptOptions();
          };
        })(this),
        'script:save-options': (function(_this) {
          return function() {
            return _this.saveOptions();
          };
        })(this)
      }));
      atom.workspace.addTopPanel({
        item: this
      });
      return this.toggleScriptOptions('hide');
    };

    ScriptOptionsView.prototype.toggleScriptOptions = function(command) {
      switch (command) {
        case 'show':
          return this.scriptOptionsView.show();
        case 'hide':
          return this.scriptOptionsView.hide();
        default:
          return this.scriptOptionsView.toggle();
      }
    };

    ScriptOptionsView.prototype.saveOptions = function() {
      var splitArgs;
      splitArgs = function(element) {
        var item, _i, _len, _ref, _results;
        _ref = element.val().split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item !== '') {
            _results.push(item);
          }
        }
        return _results;
      };
      this.runOptions.workingDirectory = this.inputCwd.val();
      this.runOptions.cmd = this.inputCommand.val();
      this.runOptions.cmdArgs = splitArgs(this.inputCommandArgs);
      this.runOptions.env = this.inputEnv.val();
      return this.runOptions.scriptArgs = splitArgs(this.inputScriptArgs);
    };

    ScriptOptionsView.prototype.close = function() {
      return this.toggleScriptOptions('hide');
    };

    ScriptOptionsView.prototype.destroy = function() {
      var _ref;
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    ScriptOptionsView.prototype.run = function() {
      this.saveOptions();
      this.toggleScriptOptions('hide');
      return atom.commands.dispatch(this.workspaceView(), 'script:run');
    };

    ScriptOptionsView.prototype.workspaceView = function() {
      return atom.views.getView(atom.workspace);
    };

    return ScriptOptionsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1vcHRpb25zLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDSCxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sd0JBQVA7QUFBQSxZQUFpQyxNQUFBLEVBQVEsbUJBQXpDO1dBQUwsRUFBbUUsU0FBQSxHQUFBO0FBQ2pFLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2Qix1QkFBN0IsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxtQkFBUDthQUFMLEVBQWlDLFNBQUEsR0FBQTtBQUMvQixjQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sT0FBUDtlQUFMLEVBQXFCLFNBQUEsR0FBQTtBQUNuQixnQkFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLDRCQUFQLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsS0FBRCxDQUNFO0FBQUEsa0JBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxr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

//# sourceURL=/home/andy/.atom/packages/script/lib/script-options-view.coffee
