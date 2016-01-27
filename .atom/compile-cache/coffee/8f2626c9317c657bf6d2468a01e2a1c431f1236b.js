(function() {
  var CompositeDisposable, actionDecorator, atomActionName, editorProxy, emmet, emmetActions, fs, getUserHome, isValidTabContext, k, loadExtensions, multiSelectionActionDecorator, path, registerInteractiveActions, resources, runAction, singleSelectionActions, toggleCommentSyntaxes, v, _ref;

  path = require('path');

  fs = require('fs');

  CompositeDisposable = require('atom').CompositeDisposable;

  emmet = require('emmet');

  emmetActions = require('emmet/lib/action/main');

  resources = require('emmet/lib/assets/resources');

  editorProxy = require('./editor-proxy');

  singleSelectionActions = ['prev_edit_point', 'next_edit_point', 'merge_lines', 'reflect_css_value', 'select_next_item', 'select_previous_item', 'wrap_with_abbreviation', 'update_tag'];

  toggleCommentSyntaxes = ['html', 'css', 'less', 'scss'];

  _ref = atom.config.get('emmet.stylus');
  for (k in _ref) {
    v = _ref[k];
    emmet.preferences.set('stylus.' + k, v);
  }

  getUserHome = function() {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE;
    }
    return process.env.HOME;
  };

  isValidTabContext = function() {
    var contains, scopes;
    if (editorProxy.getGrammar() === 'html') {
      scopes = editorProxy.getCurrentScope();
      contains = function(regexp) {
        return scopes.filter(function(s) {
          return regexp.test(s);
        }).length;
      };
      if (contains(/\.js\.embedded\./)) {
        return contains(/^string\./);
      }
    }
    return true;
  };

  actionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return runAction(action, evt);
        };
      })(this));
    };
  };

  multiSelectionActionDecorator = function(action) {
    return function(evt) {
      editorProxy.setup(this.getModel());
      return editorProxy.editor.transact((function(_this) {
        return function() {
          return editorProxy.exec(function(i) {
            runAction(action, evt);
            if (evt.keyBindingAborted) {
              return false;
            }
          });
        };
      })(this));
    };
  };

  runAction = function(action, evt) {
    var activeEditor, result, se, syntax;
    syntax = editorProxy.getSyntax();
    if (action === 'expand_abbreviation_with_tab') {
      activeEditor = editorProxy.editor;
      if (!isValidTabContext() || !activeEditor.getLastSelection().isEmpty()) {
        return evt.abortKeyBinding();
      }
      if (activeEditor.snippetExpansion) {
        se = activeEditor.snippetExpansion;
        if (se.tabStopIndex + 1 >= se.tabStopMarkers.length) {
          se.destroy();
        } else {
          return evt.abortKeyBinding();
        }
      }
    }
    if (action === 'toggle_comment' && (toggleCommentSyntaxes.indexOf(syntax) === -1 || !atom.config.get('emmet.useEmmetComments'))) {
      return evt.abortKeyBinding();
    }
    if (action === 'insert_formatted_line_break_only') {
      if (!atom.config.get('emmet.formatLineBreaks')) {
        return evt.abortKeyBinding();
      }
      result = emmet.run(action, editorProxy);
      if (!result) {
        return evt.abortKeyBinding();
      } else {
        return true;
      }
    }
    return emmet.run(action, editorProxy);
  };

  atomActionName = function(name) {
    return 'emmet:' + name.replace(/_/g, '-');
  };

  registerInteractiveActions = function(actions) {
    var name, _i, _len, _ref1, _results;
    _ref1 = ['wrap_with_abbreviation', 'update_tag', 'interactive_expand_abbreviation'];
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      name = _ref1[_i];
      _results.push((function(name) {
        var atomAction;
        atomAction = atomActionName(name);
        return actions[atomAction] = function(evt) {
          var interactive;
          editorProxy.setup(this.getModel());
          interactive = require('./interactive');
          return interactive.run(name, editorProxy);
        };
      })(name));
    }
    return _results;
  };

  loadExtensions = function() {
    var extPath, files;
    extPath = atom.config.get('emmet.extensionsPath');
    console.log('Loading Emmet extensions from', extPath);
    if (!extPath) {
      return;
    }
    if (extPath[0] === '~') {
      extPath = getUserHome() + extPath.substr(1);
    }
    if (fs.existsSync(extPath)) {
      emmet.resetUserData();
      files = fs.readdirSync(extPath);
      files = files.map(function(item) {
        return path.join(extPath, item);
      }).filter(function(file) {
        return !fs.statSync(file).isDirectory();
      });
      return emmet.loadExtensions(files);
    } else {
      return console.warn('Emmet: no such extension folder:', extPath);
    }
  };

  module.exports = {
    config: {
      extensionsPath: {
        type: 'string',
        "default": '~/emmet'
      },
      formatLineBreaks: {
        type: 'boolean',
        "default": true
      },
      useEmmetComments: {
        type: 'boolean',
        "default": false,
        description: 'disable to use atom native commenting system'
      }
    },
    activate: function(state) {
      var action, atomAction, cmd, _i, _len, _ref1;
      this.state = state;
      this.subscriptions = new CompositeDisposable;
      if (!this.actions) {
        this.subscriptions.add(atom.config.observe('emmet.extensionsPath', loadExtensions));
        this.actions = {};
        registerInteractiveActions(this.actions);
        _ref1 = emmetActions.getList();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          action = _ref1[_i];
          atomAction = atomActionName(action.name);
          if (this.actions[atomAction] != null) {
            continue;
          }
          cmd = singleSelectionActions.indexOf(action.name) !== -1 ? actionDecorator(action.name) : multiSelectionActionDecorator(action.name);
          this.actions[atomAction] = cmd;
        }
      }
      return this.subscriptions.add(atom.commands.add('atom-text-editor', this.actions));
    },
    deactivate: function() {
      return atom.config.transact((function(_this) {
        return function() {
          return _this.subscriptions.dispose();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9lbW1ldC9saWIvZW1tZXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRSQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBRkQsQ0FBQTs7QUFBQSxFQUlBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUpSLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHVCQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU1BLFNBQUEsR0FBWSxPQUFBLENBQVEsNEJBQVIsQ0FOWixDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFlLE9BQUEsQ0FBUSxnQkFBUixDQVJmLENBQUE7O0FBQUEsRUFXQSxzQkFBQSxHQUF5QixDQUN2QixpQkFEdUIsRUFDSixpQkFESSxFQUNlLGFBRGYsRUFFdkIsbUJBRnVCLEVBRUYsa0JBRkUsRUFFa0Isc0JBRmxCLEVBR3ZCLHdCQUh1QixFQUdHLFlBSEgsQ0FYekIsQ0FBQTs7QUFBQSxFQWlCQSxxQkFBQSxHQUF3QixDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCLE1BQXhCLENBakJ4QixDQUFBOztBQW1CQTtBQUFBLE9BQUEsU0FBQTtnQkFBQTtBQUNJLElBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFsQixDQUFzQixTQUFBLEdBQVksQ0FBbEMsRUFBcUMsQ0FBckMsQ0FBQSxDQURKO0FBQUEsR0FuQkE7O0FBQUEsRUFzQkEsV0FBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLElBQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFv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

//# sourceURL=/home/andy/.atom/packages/emmet/lib/emmet.coffee
