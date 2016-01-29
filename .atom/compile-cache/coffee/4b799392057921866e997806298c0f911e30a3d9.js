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
            "class": 'overlay from-top panel options-view',
            outlet: 'scriptOptionsView'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, 'Configure Run Options');
            _this.table(function() {
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Current Working Directory:');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputCwd'
                  });
                });
              });
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Command');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputCommand'
                  });
                });
              });
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Command Arguments:');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputCommandArgs'
                  });
                });
              });
              _this.tr(function() {
                _this.td(function() {
                  return _this.label('Program Arguments:');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputScriptArgs'
                  });
                });
              });
              return _this.tr(function() {
                _this.td(function() {
                  return _this.label('Environment Variables:');
                });
                return _this.td(function() {
                  return _this.input({
                    keydown: 'traverseFocus',
                    type: 'text',
                    "class": 'editor mini native-key-bindings',
                    outlet: 'inputEnv'
                  });
                });
              });
            });
            return _this.div({
              "class": 'block buttons'
            }, function() {
              var css;
              css = 'btn inline-block-tight';
              _this.button({
                "class": "btn " + css + " cancel",
                click: 'close'
              }, function() {
                return _this.span({
                  "class": 'icon icon-x'
                }, 'Cancel');
              });
              return _this.button({
                "class": "btn " + css + " run",
                outlet: 'buttonRun',
                click: 'run'
              }, function() {
                return _this.span({
                  "class": 'icon icon-playback-play'
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
          this.scriptOptionsView.show();
          return this.inputCwd.focus();
        case 'hide':
          return this.scriptOptionsView.hide();
        default:
          this.scriptOptionsView.toggle();
          if (this.scriptOptionsView.is(':visible')) {
            return this.inputCwd.focus();
          }
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

    ScriptOptionsView.prototype.traverseFocus = function(e) {
      var row;
      if (e.keyCode !== 9) {
        return true;
      }
      row = this.find(e.target).parents('tr:first').nextAll('tr:first');
      if (row.length) {
        return row.find('input').focus();
      } else {
        return this.buttonRun.focus();
      }
    };

    ScriptOptionsView.prototype.workspaceView = function() {
      return atom.views.getView(atom.workspace);
    };

    return ScriptOptionsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1vcHRpb25zLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDSCxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8scUNBQVA7QUFBQSxZQUE4QyxNQUFBLEVBQVEsbUJBQXREO1dBQUwsRUFBZ0YsU0FBQSxHQUFBO0FBQzlFLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2Qix1QkFBN0IsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPLFNBQUEsR0FBQTtBQUNMLGNBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSSxTQUFBLEdBQUE7QUFDRixnQkFBQSxLQUFDLENBQUEsRUFBRCxDQUFJLFNBQUEsR0FBQTt5QkFBRyxLQUFDLENBQUEsS0FBRCxDQUFPLDRCQUFQLEVBQUg7Z0JBQUEsQ0FBSixDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSSxTQUFBLEdBQUE7eUJBQ0YsS0FBQyxDQUFBLEtBQUQsQ0FDRTtBQUFBLG9CQUFBLE9BQUEs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

//# sourceURL=/home/andy/.atom/packages/script/lib/script-options-view.coffee
