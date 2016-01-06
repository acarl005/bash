Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _atom = require('atom');

var _treeKill = require('tree-kill');

var _treeKill2 = _interopRequireDefault(_treeKill);

var _grim = require('grim');

var _grim2 = _interopRequireDefault(_grim);

var _saveConfirmView = require('./save-confirm-view');

var _saveConfirmView2 = _interopRequireDefault(_saveConfirmView);

var _statusBarView = require('./status-bar-view');

var _statusBarView2 = _interopRequireDefault(_statusBarView);

var _targetsView = require('./targets-view');

var _targetsView2 = _interopRequireDefault(_targetsView);

var _buildView = require('./build-view');

var _buildView2 = _interopRequireDefault(_buildView);

var _googleAnalytics = require('./google-analytics');

var _googleAnalytics2 = _interopRequireDefault(_googleAnalytics);

var _errorMatcher = require('./error-matcher');

var _errorMatcher2 = _interopRequireDefault(_errorMatcher);

var _buildError = require('./build-error');

var _buildError2 = _interopRequireDefault(_buildError);

var _atomBuild = require('./atom-build');

var _atomBuild2 = _interopRequireDefault(_atomBuild);

var _providerLegacy = require('./provider-legacy');

var _providerLegacy2 = _interopRequireDefault(_providerLegacy);

'use babel';

exports['default'] = {
  config: {
    panelVisibility: {
      title: 'Panel Visibility',
      description: 'Set when the build panel should be visible.',
      type: 'string',
      'default': 'Toggle',
      'enum': ['Toggle', 'Keep Visible', 'Show on Error', 'Hidden'],
      order: 1
    },
    buildOnSave: {
      title: 'Automatically build on save',
      description: 'Automatically build your project each time an editor is saved.',
      type: 'boolean',
      'default': false,
      order: 2
    },
    saveOnBuild: {
      title: 'Automatically save on build',
      description: 'Automatically save all edited files when triggering a build.',
      type: 'boolean',
      'default': false,
      order: 3
    },
    matchedErrorFailsBuild: {
      title: 'Any matched error will fail the build',
      description: 'Even if the build has a return code of zero it is marked as "failed" if any error is being matched in the output.',
      type: 'boolean',
      'default': true,
      order: 4
    },
    scrollOnError: {
      title: 'Automatically scroll on build error',
      description: 'Automatically scroll to first matched error when a build failed.',
      type: 'boolean',
      'default': false,
      order: 5
    },
    stealFocus: {
      title: 'Steal Focus',
      description: 'Steal focus when opening build panel.',
      type: 'boolean',
      'default': true,
      order: 6
    },
    selectTriggers: {
      title: 'Selecting new target triggers the build',
      description: 'When selecting a new target (through status-bar, cmd-alt-t, etc), the newly selected target will be triggered.',
      type: 'boolean',
      'default': true,
      order: 7
    },
    monocleHeight: {
      title: 'Monocle Height',
      description: 'How much of the workspace to use for build panel when it is "maximized".',
      type: 'number',
      'default': 0.75,
      minimum: 0.1,
      maximum: 0.9,
      order: 8
    },
    minimizedHeight: {
      title: 'Minimized Height',
      description: 'How much of the workspace to use for build panel when it is "minimized".',
      type: 'number',
      'default': 0.15,
      minimum: 0.1,
      maximum: 0.9,
      order: 9
    },
    panelOrientation: {
      title: 'Panel Orientation',
      description: 'Where to attach the build panel',
      type: 'string',
      'default': 'Bottom',
      'enum': ['Bottom', 'Top', 'Left', 'Right'],
      order: 10
    },
    statusBar: {
      title: 'Status Bar',
      description: 'Where to place the status bar. Set to `Disable` to disable status bar display.',
      type: 'string',
      'default': 'Left',
      'enum': ['Left', 'Right', 'Disable'],
      order: 11
    },
    statusBarPriority: {
      title: 'Priority on Status Bar',
      description: 'Lower priority tiles are placed further to the left/right, depends on where you choose to place Status Bar.',
      type: 'number',
      'default': -1000,
      order: 12
    }
  },

  activate: function activate() {
    var _this = this;

    if (!/^win/.test(process.platform)) {
      // Manually append /usr/local/bin as it may not be set on some systems,
      // and it's common to have node installed here. Keep it at end so it won't
      // accidentially override any other node installation
      process.env.PATH += ':/usr/local/bin';
    }

    this.buildView = new _buildView2['default']();

    this.tools = [_atomBuild2['default']];
    this.instancedTools = {}; // Ordered by project path
    this.targets = {};
    this.activeTarget = {};
    this.targetsLoading = {};

    this.stdout = new Buffer(0);
    this.stderr = new Buffer(0);
    this.errorMatcher = new _errorMatcher2['default']();

    atom.commands.add('atom-workspace', 'build:refresh-targets', function () {
      return _this.refreshTargets();
    });
    atom.commands.add('atom-workspace', 'build:trigger', function () {
      return _this.build('trigger');
    });
    atom.commands.add('atom-workspace', 'build:select-active-target', function () {
      return _this.selectActiveTarget();
    });
    atom.commands.add('atom-workspace', 'build:stop', function () {
      return _this.stop();
    });
    atom.commands.add('atom-workspace', 'build:confirm', function () {
      _googleAnalytics2['default'].sendEvent('build', 'confirmed');
      document.activeElement.click();
    });
    atom.commands.add('atom-workspace', 'build:no-confirm', function () {
      if (_this.saveConfirmView) {
        _googleAnalytics2['default'].sendEvent('build', 'not confirmed');
        _this.saveConfirmView.cancel();
      }
    });

    atom.workspace.observeTextEditors(function (editor) {
      editor.onDidSave(function () {
        if (atom.config.get('build.buildOnSave')) {
          _this.build('save');
        }
      });
    });

    atom.workspace.onDidChangeActivePaneItem(function () {
      return _this.updateStatusBar();
    });

    this.errorMatcher.on('error', function (message) {
      atom.notifications.addError('Error matching failed!', { detail: message });
    });

    this.errorMatcher.on('matched', function (id) {
      _this.buildView.scrollTo(id);
    });

    this.errorMatcher.on('match', function (text, id) {
      var callback = _this.errorMatcher.goto.bind(_this.errorMatcher, id);
      _this.buildView.link(text, id, callback);
    });

    atom.packages.onDidActivateInitialPackages(function () {
      return _this.refreshTargets();
    });

    var projectPaths = atom.project.getPaths();
    atom.project.onDidChangePaths(function () {
      var addedPaths = atom.project.getPaths().filter(function (el) {
        return projectPaths.indexOf(el) === -1;
      });
      _this.refreshTargets(addedPaths);
      projectPaths = atom.project.getPaths();
    });

    atom.packages.getLoadedPackages().filter(function (p) {
      return (((p.metadata.providedServices || {}).builder || {}).versions || {})['1.0.0'];
    }).forEach(function (p) {
      return _grim2['default'].deprecate('Use 2.0.0 of builder service API instead', { packageName: p.name });
    });
  },

  deactivate: function deactivate() {
    _lodash2['default'].map(this.instancedTools, function (tools, cwd) {
      return tools.forEach(function (tool) {
        tool.removeAllListeners('refresh');
        tool.destructor && tool.destructor();
      });
    });

    if (this.child) {
      this.child.removeAllListeners();
      (0, _treeKill2['default'])(this.child.pid, 'SIGKILL');
      this.child = null;
    }

    this.statusBarView && this.statusBarView.destroy();

    clearTimeout(this.finishedTimer);
  },

  activePath: function activePath() {
    var textEditor = atom.workspace.getActiveTextEditor();
    if (!textEditor || !textEditor.getPath()) {
      /* default to building the first one if no editor is active */
      if (0 === atom.project.getPaths().length) {
        return false;
      }

      return atom.project.getPaths()[0];
    }

    /* otherwise, build the one in the root of the active editor */
    return atom.project.getPaths().sort(function (a, b) {
      return b.length - a.length;
    }).find(function (p) {
      var realpath = _fs2['default'].realpathSync(p);
      return textEditor.getPath().substr(0, realpath.length) === realpath;
    });
  },

  updateStatusBar: function updateStatusBar() {
    var activeTarget = this.activeTarget[this.activePath()];
    this.statusBarView && this.statusBarView.setTarget(activeTarget);
  },

  cmdDefaults: function cmdDefaults(cwd) {
    return {
      env: {},
      args: [],
      cwd: cwd,
      sh: true,
      errorMatch: '',
      dispose: Function.prototype
    };
  },

  settingsMakeUnique: function settingsMakeUnique(settings) {
    var diff = undefined;
    var appender = function appender(setting) {
      setting._uniqueIndex = setting._uniqueIndex || 1;
      setting._originalName = setting._originalName || setting.name;
      setting.name = setting._originalName + ' - ' + setting._uniqueIndex++;
      settings.push(setting);
    };
    var i = 0;
    do {
      var uniqueSettings = _lodash2['default'].uniq(settings, 'name');
      diff = _lodash2['default'].difference(settings, uniqueSettings);
      settings = uniqueSettings;
      diff.forEach(appender);
    } while (diff.length > 0 && i++ < 10);

    return settings;
  },

  refreshTargets: function refreshTargets(refreshPaths) {
    var _this2 = this;

    refreshPaths = refreshPaths || atom.project.getPaths();

    var pathPromise = refreshPaths.map(function (p) {
      _this2.targetsLoading[p] = true;
      _this2.targets[p] = _this2.targets[p] || [];

      _this2.instancedTools[p] = (_this2.instancedTools[p] || []).map(function (t) {
        return t.removeAllListeners && t.removeAllListeners('refresh');
      }).filter(function () {
        return false;
      }); // Just empty the array

      var settingsPromise = _this2.tools.map(function (Tool) {
        return new Tool(p);
      }).filter(function (tool) {
        return tool.isEligible();
      }).map(function (tool) {
        _this2.instancedTools[p].push(tool);
        _googleAnalytics2['default'].sendEvent('build', 'tool eligible', tool.getNiceName());

        tool.on && tool.on('refresh', _this2.refreshTargets.bind(_this2, [p]));
        return Promise.resolve().then(function () {
          return tool.settings();
        })['catch'](function (err) {
          if (err instanceof SyntaxError) {
            atom.notifications.addError('Invalid build file.', {
              detail: 'You have a syntax error in your build file: ' + err.message,
              dismissable: true
            });
          } else {
            atom.notifications.addError('Ooops. Something went wrong.', {
              detail: err.message + (err.stack ? '\n' + err.stack : ''),
              dismissable: true
            });
          }
        });
      });

      return Promise.all(settingsPromise).then(function (settings) {
        settings = _this2.settingsMakeUnique([].concat.apply([], settings).filter(Boolean).map(function (setting) {
          return _lodash2['default'].defaults(setting, _this2.cmdDefaults(p));
        }));

        if (_lodash2['default'].isNull(_this2.activeTarget[p]) || !settings.find(function (s) {
          return s.name === _this2.activeTarget[p];
        })) {
          /* Active target has been removed or not set. Set it to the highest prio target */
          _this2.activeTarget[p] = settings[0] ? settings[0].name : undefined;
        }

        _this2.targets[p].forEach(function (target) {
          return target.dispose();
        });

        settings.forEach(function (setting, index) {
          if (!setting.keymap) {
            return;
          }

          _googleAnalytics2['default'].sendEvent('keymap', 'registered', setting.keymap);
          var commandName = 'build:trigger:' + setting.name;
          var keymapSpec = { 'atom-workspace, atom-text-editor': {} };
          keymapSpec['atom-workspace, atom-text-editor'][setting.keymap] = commandName;
          var keymapDispose = atom.keymaps.add(setting.name, keymapSpec);
          var commandDispose = atom.commands.add('atom-workspace', commandName, _this2.build.bind(_this2, 'trigger'));
          settings[index].dispose = function () {
            keymapDispose.dispose();
            commandDispose.dispose();
          };
        });

        _this2.targets[p] = settings;
        _this2.targetsLoading[p] = false;
        _this2.updateStatusBar();
      });
    });

    Promise.all(pathPromise).then(function (entries) {
      if (entries.length === 0) {
        return;
      }

      var rows = refreshPaths.map(function (p) {
        return _this2.targets[p].length + ' targets at: ' + p;
      });
      atom.notifications.addInfo('Build targets parsed.', {
        detail: rows.join('\n')
      });
    });
  },

  selectActiveTarget: function selectActiveTarget() {
    var _this3 = this;

    var p = this.activePath();
    var targets = this.targets[p];
    var targetsView = new _targetsView2['default']();

    if (this.targetsLoading[p]) {
      return targetsView.setLoading('Loading project build targets…');
    }

    targetsView.setActiveTarget(this.activeTarget[p]);
    targetsView.setItems((targets || []).map(function (target) {
      return target.name;
    }));
    targetsView.awaitSelection().then(function (newTarget) {
      _this3.activeTarget[p] = newTarget;
      _this3.updateStatusBar();

      if (atom.config.get('build.selectTriggers')) {
        var workspaceElement = atom.views.getView(atom.workspace);
        atom.commands.dispatch(workspaceElement, 'build:trigger');
      }
    })['catch'](function (err) {
      return targetsView.setError(err.message);
    });
  },

  replace: function replace(value, targetEnv) {
    if (value === undefined) value = '';

    var env = _lodash2['default'].extend({}, process.env, targetEnv);
    value = value.replace(/\$(\w+)/g, function (match, name) {
      return name in env ? env[name] : match;
    });

    var editor = atom.workspace.getActiveTextEditor();

    var projectPaths = _lodash2['default'].map(atom.project.getPaths(), function (projectPath) {
      try {
        return _fs2['default'].realpathSync(projectPath);
      } catch (e) {/* Do nothing. */}
    });

    var projectPath = projectPaths[0];
    if (editor && 'untitled' !== editor.getTitle()) {
      (function () {
        var activeFile = _fs2['default'].realpathSync(editor.getPath());
        var activeFilePath = _path2['default'].dirname(activeFile);
        projectPath = _lodash2['default'].find(projectPaths, function (p) {
          return activeFilePath && activeFilePath.startsWith(p);
        });
        value = value.replace(/{FILE_ACTIVE}/g, activeFile);
        value = value.replace(/{FILE_ACTIVE_PATH}/g, activeFilePath);
        value = value.replace(/{FILE_ACTIVE_NAME}/g, _path2['default'].basename(activeFile));
        value = value.replace(/{FILE_ACTIVE_NAME_BASE}/g, _path2['default'].basename(activeFile, _path2['default'].extname(activeFile)));
      })();
    }
    value = value.replace(/{PROJECT_PATH}/g, projectPath);
    if (atom.project.getRepositories[0]) {
      value = value.replace(/{REPO_BRANCH_SHORT}/g, atom.project.getRepositories()[0].getShortHead());
    }

    return value;
  },

  startNewBuild: function startNewBuild(source, targetName) {
    var _this4 = this;

    var p = this.activePath();
    targetName = targetName || this.activeTarget[p];

    Promise.resolve(this.targets[p]).then(function (targets) {
      if (!targets || 0 === targets.length) {
        throw new _buildError2['default']('No eligible build target.', 'No configuration to build this project exists.');
      }

      var target = targets.find(function (t) {
        return t.name === targetName;
      });
      _googleAnalytics2['default'].sendEvent('build', 'triggered');

      if (!target.exec) {
        throw new _buildError2['default']('Invalid build file.', 'No executable command specified.');
      }

      var env = _lodash2['default'].extend({}, process.env, target.env);
      _lodash2['default'].forEach(env, function (value, key, list) {
        list[key] = _this4.replace(value, target.env);
      });

      var exec = _this4.replace(target.exec, target.env);
      var args = target.args.map(function (arg) {
        return _this4.replace(arg, target.env);
      });
      var cwd = _this4.replace(target.cwd, target.env);

      _this4.child = require('child_process').spawn(target.sh ? '/bin/sh' : exec, target.sh ? ['-c', [exec].concat(args).join(' ')] : args, { cwd: cwd, env: env });

      _this4.stdout = new Buffer(0);
      _this4.child.stdout.on('data', function (buffer) {
        _this4.stdout = Buffer.concat([_this4.stdout, buffer]);
        _this4.buildView.append(buffer);
      });

      _this4.stderr = new Buffer(0);
      _this4.child.stderr.on('data', function (buffer) {
        _this4.stderr = Buffer.concat([_this4.stderr, buffer]);
        _this4.buildView.append(buffer);
      });

      _this4.child.on('error', function (err) {
        _this4.buildView.append((target.sh ? 'Unable to execute with sh: ' : 'Unable to execute: ') + exec + '\n');

        if (/\s/.test(exec) && !target.sh) {
          _this4.buildView.append('`cmd` cannot contain space. Use `args` for arguments.\n');
        }

        if ('ENOENT' === err.code) {
          _this4.buildView.append('Make sure `cmd` and `cwd` exists and have correct access permissions.\n');
          _this4.buildView.append('Build finds binaries in these folders: ' + process.env.PATH + '\n');
        }
      });

      _this4.child.on('close', function (exitCode) {
        _this4.errorMatcher.set(target.errorMatch, cwd, _this4.buildView.output.text());

        var success = 0 === exitCode;
        if (atom.config.get('build.matchedErrorFailsBuild')) {
          success = success && !_this4.errorMatcher.hasMatch();
        }
        _this4.buildView.buildFinished(success);
        _this4.statusBarView && _this4.statusBarView.setBuildSuccess(success);

        if (success) {
          _googleAnalytics2['default'].sendEvent('build', 'succeeded');
          _this4.finishedTimer = setTimeout(function () {
            _this4.buildView.detach();
          }, 1000);
        } else {
          if (atom.config.get('build.scrollOnError')) {
            _this4.errorMatcher.matchFirst();
          }
          _googleAnalytics2['default'].sendEvent('build', 'failed');
        }
        _this4.child = null;
      });

      _this4.buildView.buildStarted();
      _this4.buildView.append([target.sh ? 'Executing with sh:' : 'Executing:', exec].concat(_toConsumableArray(args), ['\n']).join(' '));
    })['catch'](function (err) {
      if (err instanceof _buildError2['default']) {
        if (source === 'save') {
          // If there is no eligible build tool, and cause of build was a save, stay quiet.
          return;
        }

        atom.notifications.addWarning(err.name, { detail: err.message });
      } else {
        atom.notifications.addError('Failed to build.', { detail: err.message });
      }
    });
  },

  abort: function abort(cb) {
    var _this5 = this;

    this.child.removeAllListeners('close');
    this.child.on('close', function () {
      _this5.child = null;
      cb && cb();
    });

    try {
      (0, _treeKill2['default'])(this.child.pid);
    } catch (e) {
      /* Something may have happened to the child (e.g. terminated by itself). Ignore this. */
    }

    this.child.killed = true;
  },

  build: function build(source, event) {
    var _this6 = this;

    clearTimeout(this.finishedTimer);

    this.doSaveConfirm(this.unsavedTextEditors(), function () {
      var next = _this6.startNewBuild.bind(_this6, source, event ? event.type.substr(14) : null);
      _this6.child ? _this6.abort(next) : next();
    });
  },

  doSaveConfirm: function doSaveConfirm(modifiedTextEditors, continuecb, cancelcb) {
    var saveAndContinue = function saveAndContinue(save) {
      modifiedTextEditors.forEach(function (textEditor) {
        return save && textEditor.save();
      });
      continuecb();
    };

    if (0 === _lodash2['default'].size(modifiedTextEditors) || atom.config.get('build.saveOnBuild')) {
      return saveAndContinue(true);
    }

    if (this.saveConfirmView) {
      this.saveConfirmView.destroy();
    }

    this.saveConfirmView = new _saveConfirmView2['default']();
    this.saveConfirmView.show(saveAndContinue, cancelcb);
  },

  unsavedTextEditors: function unsavedTextEditors() {
    return atom.workspace.getTextEditors().filter(function (textEditor) {
      return textEditor.isModified() && 'untitled' !== textEditor.getTitle();
    });
  },

  stop: function stop() {
    var _this7 = this;

    clearTimeout(this.finishedTimer);
    if (this.child) {
      if (this.child.killed) {
        // This child has been killed, but hasn't terminated. Hide it from user.
        this.child.removeAllListeners();
        this.child = null;
        this.buildView.buildAborted();
        return;
      }

      this.abort(function () {
        return _this7.buildView.buildAborted();
      });

      this.buildView.buildAbortInitiated();
    } else {
      this.buildView.reset();
    }
  },

  consumeBuilderLegacy: function consumeBuilderLegacy(builder) {
    return this.consumeBuilder((0, _providerLegacy2['default'])(builder));
  },

  consumeBuilder: function consumeBuilder(builders) {
    var _this8 = this;

    builders = Array.isArray(builders) ? builders : [builders];
    this.tools = _lodash2['default'].union(this.tools, builders);
    return new _atom.Disposable(function () {
      return _this8.tools = _lodash2['default'].difference(_this8.tools, builders);
    });
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    var _this9 = this;

    this.statusBarView = new _statusBarView2['default'](statusBar);
    this.statusBarView.onClick(function () {
      return _this9.selectActiveTarget();
    });
    this.statusBarView.attach();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2J1aWxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQUVlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztzQkFDVCxRQUFROzs7O29CQUNLLE1BQU07O3dCQUNoQixXQUFXOzs7O29CQUNYLE1BQU07Ozs7K0JBRUsscUJBQXFCOzs7OzZCQUN2QixtQkFBbUI7Ozs7MkJBQ3JCLGdCQUFnQjs7Ozt5QkFDbEIsY0FBYzs7OzsrQkFDUixvQkFBb0I7Ozs7NEJBQ3ZCLGlCQUFpQjs7OzswQkFDbkIsZUFBZTs7Ozt5QkFDZixjQUFjOzs7OzhCQUNWLG1CQUFtQjs7OztBQWpCOUMsV0FBVyxDQUFDOztxQkFtQkc7QUFDYixRQUFNLEVBQUU7QUFDTixtQkFBZSxFQUFFO0FBQ2YsV0FBSyxFQUFFLGtCQUFrQjtBQUN6QixpQkFBVyxFQUFFLDZDQUE2QztBQUMxRCxVQUFJLEVBQUUsUUFBUTtBQUNkLGlCQUFTLFFBQVE7QUFDakIsY0FBTSxDQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLFFBQVEsQ0FBRTtBQUM3RCxXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0QsZUFBVyxFQUFFO0FBQ1gsV0FBSyxFQUFFLDZCQUE2QjtBQUNwQyxpQkFBVyxFQUFFLGdFQUFnRTtBQUM3RSxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7QUFDZCxXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0QsZUFBVyxFQUFFO0FBQ1gsV0FBSyxFQUFFLDZCQUE2QjtBQUNwQyxpQkFBVyxFQUFFLDhEQUE4RDtBQUMzRSxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLEtBQUs7QUFDZCxXQUFLLEVBQUUsQ0FBQztLQUNUO0FBQ0QsMEJBQXNCLEVBQUU7QUFDdEIsV0FBSyxFQUFFLHVDQUF1QztBQUM5QyxpQkFBVyxFQUFFLG1IQUFtSDtBQUNoSSxVQUFJLEVBQUUsU0FBUztBQUNmLGlCQUFTLElBQUk7QUFD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TyxDQUFDO2FBQU0sT0FBSyxrQkFBa0IsRUFBRTtLQUFBLENBQUMsQ0FBQztBQUM1RCxRQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQzdCO0NBQ0YiLCJmaWxlIjoiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCBraWxsIGZyb20gJ3RyZWUta2lsbCc7XG5pbXBvcnQgR3JpbSBmcm9tICdncmltJztcblxuaW1wb3J0IFNhdmVDb25maXJtVmlldyBmcm9tICcuL3NhdmUtY29uZmlybS12aWV3JztcbmltcG9ydCBTdGF0dXNCYXJWaWV3IGZyb20gJy4vc3RhdHVzLWJhci12aWV3JztcbmltcG9ydCBUYXJnZXRzVmlldyBmcm9tICcuL3RhcmdldHMtdmlldyc7XG5pbXBvcnQgQnVpbGRWaWV3IGZyb20gJy4vYnVpbGQtdmlldyc7XG5pbXBvcnQgR29vZ2xlQW5hbHl0aWNzIGZyb20gJy4vZ29vZ2xlLWFuYWx5dGljcyc7XG5pbXBvcnQgRXJyb3JNYXRjaGVyIGZyb20gJy4vZXJyb3ItbWF0Y2hlcic7XG5pbXBvcnQgQnVpbGRFcnJvciBmcm9tICcuL2J1aWxkLWVycm9yJztcbmltcG9ydCBDdXN0b21GaWxlIGZyb20gJy4vYXRvbS1idWlsZCc7XG5pbXBvcnQgcHJvdmlkZXJMZWdhY3kgZnJvbSAnLi9wcm92aWRlci1sZWdhY3knO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGNvbmZpZzoge1xuICAgIHBhbmVsVmlzaWJpbGl0eToge1xuICAgICAgdGl0bGU6ICdQYW5lbCBWaXNpYmlsaXR5JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IHdoZW4gdGhlIGJ1aWxkIHBhbmVsIHNob3VsZCBiZSB2aXNpYmxlLicsXG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICdUb2dnbGUnLFxuICAgICAgZW51bTogWyAnVG9nZ2xlJywgJ0tlZXAgVmlzaWJsZScsICdTaG93IG9uIEVycm9yJywgJ0hpZGRlbicgXSxcbiAgICAgIG9yZGVyOiAxXG4gICAgfSxcbiAgICBidWlsZE9uU2F2ZToge1xuICAgICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IGJ1aWxkIG9uIHNhdmUnLFxuICAgICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IGJ1aWxkIHlvdXIgcHJvamVjdCBlYWNoIHRpbWUgYW4gZWRpdG9yIGlzIHNhdmVkLicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgIG9yZGVyOiAyXG4gICAgfSxcbiAgICBzYXZlT25CdWlsZDoge1xuICAgICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IHNhdmUgb24gYnVpbGQnLFxuICAgICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IHNhdmUgYWxsIGVkaXRlZCBmaWxlcyB3aGVuIHRyaWdnZXJpbmcgYSBidWlsZC4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICBvcmRlcjogM1xuICAgIH0sXG4gICAgbWF0Y2hlZEVycm9yRmFpbHNCdWlsZDoge1xuICAgICAgdGl0bGU6ICdBbnkgbWF0Y2hlZCBlcnJvciB3aWxsIGZhaWwgdGhlIGJ1aWxkJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRXZlbiBpZiB0aGUgYnVpbGQgaGFzIGEgcmV0dXJuIGNvZGUgb2YgemVybyBpdCBpcyBtYXJrZWQgYXMgXCJmYWlsZWRcIiBpZiBhbnkgZXJyb3IgaXMgYmVpbmcgbWF0Y2hlZCBpbiB0aGUgb3V0cHV0LicsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgb3JkZXI6IDRcbiAgICB9LFxuICAgIHNjcm9sbE9uRXJyb3I6IHtcbiAgICAgIHRpdGxlOiAnQXV0b21hdGljYWxseSBzY3JvbGwgb24gYnVpbGQgZXJyb3InLFxuICAgICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IHNjcm9sbCB0byBmaXJzdCBtYXRjaGVkIGVycm9yIHdoZW4gYSBidWlsZCBmYWlsZWQuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgb3JkZXI6IDVcbiAgICB9LFxuICAgIHN0ZWFsRm9jdXM6IHtcbiAgICAgIHRpdGxlOiAnU3RlYWwgRm9jdXMnLFxuICAgICAgZGVzY3JpcHRpb246ICdTdGVhbCBmb2N1cyB3aGVuIG9wZW5pbmcgYnVpbGQgcGFuZWwuJyxcbiAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICBvcmRlcjogNlxuICAgIH0sXG4gICAgc2VsZWN0VHJpZ2dlcnM6IHtcbiAgICAgIHRpdGxlOiAnU2VsZWN0aW5nIG5ldyB0YXJnZXQgdHJpZ2dlcnMgdGhlIGJ1aWxkJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBzZWxlY3RpbmcgYSBuZXcgdGFyZ2V0ICh0aHJvdWdoIHN0YXR1cy1iYXIsIGNtZC1hbHQtdCwgZXRjKSwgdGhlIG5ld2x5IHNlbGVjdGVkIHRhcmdldCB3aWxsIGJlIHRyaWdnZXJlZC4nLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgIG9yZGVyOiA3XG4gICAgfSxcbiAgICBtb25vY2xlSGVpZ2h0OiB7XG4gICAgICB0aXRsZTogJ01vbm9jbGUgSGVpZ2h0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSG93IG11Y2ggb2YgdGhlIHdvcmtzcGFjZSB0byB1c2UgZm9yIGJ1aWxkIHBhbmVsIHdoZW4gaXQgaXMgXCJtYXhpbWl6ZWRcIi4nLFxuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwLjc1LFxuICAgICAgbWluaW11bTogMC4xLFxuICAgICAgbWF4aW11bTogMC45LFxuICAgICAgb3JkZXI6IDhcbiAgICB9LFxuICAgIG1pbmltaXplZEhlaWdodDoge1xuICAgICAgdGl0bGU6ICdNaW5pbWl6ZWQgSGVpZ2h0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnSG93IG11Y2ggb2YgdGhlIHdvcmtzcGFjZSB0byB1c2UgZm9yIGJ1aWxkIHBhbmVsIHdoZW4gaXQgaXMgXCJtaW5pbWl6ZWRcIi4nLFxuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAwLjE1LFxuICAgICAgbWluaW11bTogMC4xLFxuICAgICAgbWF4aW11bTogMC45LFxuICAgICAgb3JkZXI6IDlcbiAgICB9LFxuICAgIHBhbmVsT3JpZW50YXRpb246IHtcbiAgICAgIHRpdGxlOiAnUGFuZWwgT3JpZW50YXRpb24nLFxuICAgICAgZGVzY3JpcHRpb246ICdXaGVyZSB0byBhdHRhY2ggdGhlIGJ1aWxkIHBhbmVsJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ0JvdHRvbScsXG4gICAgICBlbnVtOiBbICdCb3R0b20nLCAnVG9wJywgJ0xlZnQnLCAnUmlnaHQnIF0sXG4gICAgICBvcmRlcjogMTBcbiAgICB9LFxuICAgIHN0YXR1c0Jhcjoge1xuICAgICAgdGl0bGU6ICdTdGF0dXMgQmFyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnV2hlcmUgdG8gcGxhY2UgdGhlIHN0YXR1cyBiYXIuIFNldCB0byBgRGlzYWJsZWAgdG8gZGlzYWJsZSBzdGF0dXMgYmFyIGRpc3BsYXkuJyxcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgZGVmYXVsdDogJ0xlZnQnLFxuICAgICAgZW51bTogWyAnTGVmdCcsICdSaWdodCcsICdEaXNhYmxlJyBdLFxuICAgICAgb3JkZXI6IDExXG4gICAgfSxcbiAgICBzdGF0dXNCYXJQcmlvcml0eToge1xuICAgICAgdGl0bGU6ICdQcmlvcml0eSBvbiBTdGF0dXMgQmFyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTG93ZXIgcHJpb3JpdHkgdGlsZXMgYXJlIHBsYWNlZCBmdXJ0aGVyIHRvIHRoZSBsZWZ0L3JpZ2h0LCBkZXBlbmRzIG9uIHdoZXJlIHlvdSBjaG9vc2UgdG8gcGxhY2UgU3RhdHVzIEJhci4nLFxuICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICBkZWZhdWx0OiAtMTAwMCxcbiAgICAgIG9yZGVyOiAxMlxuICAgIH1cbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICBpZiAoIS9ed2luLy50ZXN0KHByb2Nlc3MucGxhdGZvcm0pKSB7XG4gICAgICAvLyBNYW51YWxseSBhcHBlbmQgL3Vzci9sb2NhbC9iaW4gYXMgaXQgbWF5IG5vdCBiZSBzZXQgb24gc29tZSBzeXN0ZW1zLFxuICAgICAgLy8gYW5kIGl0J3MgY29tbW9uIHRvIGhhdmUgbm9kZSBpbnN0YWxsZWQgaGVyZS4gS2VlcCBpdCBhdCBlbmQgc28gaXQgd29uJ3RcbiAgICAgIC8vIGFjY2lkZW50aWFsbHkgb3ZlcnJpZGUgYW55IG90aGVyIG5vZGUgaW5zdGFsbGF0aW9uXG4gICAgICBwcm9jZXNzLmVudi5QQVRIICs9ICc6L3Vzci9sb2NhbC9iaW4nO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbGRWaWV3ID0gbmV3IEJ1aWxkVmlldygpO1xuXG4gICAgdGhpcy50b29scyA9IFsgQ3VzdG9tRmlsZSBdO1xuICAgIHRoaXMuaW5zdGFuY2VkVG9vbHMgPSB7fTsgLy8gT3JkZXJlZCBieSBwcm9qZWN0IHBhdGhcbiAgICB0aGlzLnRhcmdldHMgPSB7fTtcbiAgICB0aGlzLmFjdGl2ZVRhcmdldCA9IHt9O1xuICAgIHRoaXMudGFyZ2V0c0xvYWRpbmcgPSB7fTtcblxuICAgIHRoaXMuc3Rkb3V0ID0gbmV3IEJ1ZmZlcigwKTtcbiAgICB0aGlzLnN0ZGVyciA9IG5ldyBCdWZmZXIoMCk7XG4gICAgdGhpcy5lcnJvck1hdGNoZXIgPSBuZXcgRXJyb3JNYXRjaGVyKCk7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6cmVmcmVzaC10YXJnZXRzJywgKCkgPT4gdGhpcy5yZWZyZXNoVGFyZ2V0cygpKTtcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6dHJpZ2dlcicsICgpID0+IHRoaXMuYnVpbGQoJ3RyaWdnZXInKSk7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnNlbGVjdC1hY3RpdmUtdGFyZ2V0JywgKCkgPT4gdGhpcy5zZWxlY3RBY3RpdmVUYXJnZXQoKSk7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnN0b3AnLCAoKSA9PiB0aGlzLnN0b3AoKSk7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOmNvbmZpcm0nLCAoKSA9PiB7XG4gICAgICBHb29nbGVBbmFseXRpY3Muc2VuZEV2ZW50KCdidWlsZCcsICdjb25maXJtZWQnKTtcbiAgICAgIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xpY2soKTtcbiAgICB9KTtcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6bm8tY29uZmlybScsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnNhdmVDb25maXJtVmlldykge1xuICAgICAgICBHb29nbGVBbmFseXRpY3Muc2VuZEV2ZW50KCdidWlsZCcsICdub3QgY29uZmlybWVkJyk7XG4gICAgICAgIHRoaXMuc2F2ZUNvbmZpcm1WaWV3LmNhbmNlbCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKChlZGl0b3IpID0+IHtcbiAgICAgIGVkaXRvci5vbkRpZFNhdmUoKCkgPT4ge1xuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5idWlsZE9uU2F2ZScpKSB7XG4gICAgICAgICAgdGhpcy5idWlsZCgnc2F2ZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0oKCkgPT4gdGhpcy51cGRhdGVTdGF0dXNCYXIoKSk7XG5cbiAgICB0aGlzLmVycm9yTWF0Y2hlci5vbignZXJyb3InLCAobWVzc2FnZSkgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdFcnJvciBtYXRjaGluZyBmYWlsZWQhJywgeyBkZXRhaWw6IG1lc3NhZ2UgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmVycm9yTWF0Y2hlci5vbignbWF0Y2hlZCcsIChpZCkgPT4ge1xuICAgICAgdGhpcy5idWlsZFZpZXcuc2Nyb2xsVG8oaWQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5lcnJvck1hdGNoZXIub24oJ21hdGNoJywgKHRleHQsIGlkKSA9PiB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXJyb3JNYXRjaGVyLmdvdG8uYmluZCh0aGlzLmVycm9yTWF0Y2hlciwgaWQpO1xuICAgICAgdGhpcy5idWlsZFZpZXcubGluayh0ZXh0LCBpZCwgY2FsbGJhY2spO1xuICAgIH0pO1xuXG4gICAgYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlSW5pdGlhbFBhY2thZ2VzKCgpID0+IHRoaXMucmVmcmVzaFRhcmdldHMoKSk7XG5cbiAgICBsZXQgcHJvamVjdFBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCk7XG4gICAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKCkgPT4ge1xuICAgICAgY29uc3QgYWRkZWRQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpLmZpbHRlcihlbCA9PiBwcm9qZWN0UGF0aHMuaW5kZXhPZihlbCkgPT09IC0xKTtcbiAgICAgIHRoaXMucmVmcmVzaFRhcmdldHMoYWRkZWRQYXRocyk7XG4gICAgICBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgICB9KTtcblxuICAgIGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZXMoKVxuICAgICAgLmZpbHRlcihwID0+ICgoKChwLm1ldGFkYXRhLnByb3ZpZGVkU2VydmljZXMgfHwge30pLmJ1aWxkZXIgfHwge30pLnZlcnNpb25zIHx8IHt9KVsnMS4wLjAnXSkpXG4gICAgICAuZm9yRWFjaChwID0+IEdyaW0uZGVwcmVjYXRlKCdVc2UgMi4wLjAgb2YgYnVpbGRlciBzZXJ2aWNlIEFQSSBpbnN0ZWFkJywgeyBwYWNrYWdlTmFtZTogcC5uYW1lIH0pKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIF8ubWFwKHRoaXMuaW5zdGFuY2VkVG9vbHMsICh0b29scywgY3dkKSA9PiB0b29scy5mb3JFYWNoKHRvb2wgPT4ge1xuICAgICAgdG9vbC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlZnJlc2gnKTtcbiAgICAgIHRvb2wuZGVzdHJ1Y3RvciAmJiB0b29sLmRlc3RydWN0b3IoKTtcbiAgICB9KSk7XG5cbiAgICBpZiAodGhpcy5jaGlsZCkge1xuICAgICAgdGhpcy5jaGlsZC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIGtpbGwodGhpcy5jaGlsZC5waWQsICdTSUdLSUxMJyk7XG4gICAgICB0aGlzLmNoaWxkID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXR1c0JhclZpZXcgJiYgdGhpcy5zdGF0dXNCYXJWaWV3LmRlc3Ryb3koKTtcblxuICAgIGNsZWFyVGltZW91dCh0aGlzLmZpbmlzaGVkVGltZXIpO1xuICB9LFxuXG4gIGFjdGl2ZVBhdGgoKSB7XG4gICAgY29uc3QgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBpZiAoIXRleHRFZGl0b3IgfHwgIXRleHRFZGl0b3IuZ2V0UGF0aCgpKSB7XG4gICAgICAvKiBkZWZhdWx0IHRvIGJ1aWxkaW5nIHRoZSBmaXJzdCBvbmUgaWYgbm8gZWRpdG9yIGlzIGFjdGl2ZSAqL1xuICAgICAgaWYgKDAgPT09IGF0b20ucHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICB9XG5cbiAgICAvKiBvdGhlcndpc2UsIGJ1aWxkIHRoZSBvbmUgaW4gdGhlIHJvb3Qgb2YgdGhlIGFjdGl2ZSBlZGl0b3IgKi9cbiAgICByZXR1cm4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuc29ydCgoYSwgYikgPT4gKGIubGVuZ3RoIC0gYS5sZW5ndGgpKS5maW5kKHAgPT4ge1xuICAgICAgY29uc3QgcmVhbHBhdGggPSBmcy5yZWFscGF0aFN5bmMocCk7XG4gICAgICByZXR1cm4gdGV4dEVkaXRvci5nZXRQYXRoKCkuc3Vic3RyKDAsIHJlYWxwYXRoLmxlbmd0aCkgPT09IHJlYWxwYXRoO1xuICAgIH0pO1xuICB9LFxuXG4gIHVwZGF0ZVN0YXR1c0JhcigpIHtcbiAgICBjb25zdCBhY3RpdmVUYXJnZXQgPSB0aGlzLmFjdGl2ZVRhcmdldFt0aGlzLmFjdGl2ZVBhdGgoKV07XG4gICAgdGhpcy5zdGF0dXNCYXJWaWV3ICYmIHRoaXMuc3RhdHVzQmFyVmlldy5zZXRUYXJnZXQoYWN0aXZlVGFyZ2V0KTtcbiAgfSxcblxuICBjbWREZWZhdWx0cyhjd2QpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZW52OiB7fSxcbiAgICAgIGFyZ3M6IFtdLFxuICAgICAgY3dkOiBjd2QsXG4gICAgICBzaDogdHJ1ZSxcbiAgICAgIGVycm9yTWF0Y2g6ICcnLFxuICAgICAgZGlzcG9zZTogRnVuY3Rpb24ucHJvdG90eXBlXG4gICAgfTtcbiAgfSxcblxuICBzZXR0aW5nc01ha2VVbmlxdWUoc2V0dGluZ3MpIHtcbiAgICBsZXQgZGlmZjtcbiAgICBjb25zdCBhcHBlbmRlciA9IChzZXR0aW5nKSA9PiB7XG4gICAgICBzZXR0aW5nLl91bmlxdWVJbmRleCA9IHNldHRpbmcuX3VuaXF1ZUluZGV4IHx8IDE7XG4gICAgICBzZXR0aW5nLl9vcmlnaW5hbE5hbWUgPSBzZXR0aW5nLl9vcmlnaW5hbE5hbWUgfHwgc2V0dGluZy5uYW1lO1xuICAgICAgc2V0dGluZy5uYW1lID0gYCR7c2V0dGluZy5fb3JpZ2luYWxOYW1lfSAtICR7c2V0dGluZy5fdW5pcXVlSW5kZXgrK31gO1xuICAgICAgc2V0dGluZ3MucHVzaChzZXR0aW5nKTtcbiAgICB9O1xuICAgIGxldCBpID0gMDtcbiAgICBkbyB7XG4gICAgICBjb25zdCB1bmlxdWVTZXR0aW5ncyA9IF8udW5pcShzZXR0aW5ncywgJ25hbWUnKTtcbiAgICAgIGRpZmYgPSBfLmRpZmZlcmVuY2Uoc2V0dGluZ3MsIHVuaXF1ZVNldHRpbmdzKTtcbiAgICAgIHNldHRpbmdzID0gdW5pcXVlU2V0dGluZ3M7XG4gICAgICBkaWZmLmZvckVhY2goYXBwZW5kZXIpO1xuICAgIH0gd2hpbGUgKGRpZmYubGVuZ3RoID4gMCAmJiBpKysgPCAxMCk7XG5cbiAgICByZXR1cm4gc2V0dGluZ3M7XG4gIH0sXG5cbiAgcmVmcmVzaFRhcmdldHMocmVmcmVzaFBhdGhzKSB7XG4gICAgcmVmcmVzaFBhdGhzID0gcmVmcmVzaFBhdGhzIHx8IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuXG4gICAgY29uc3QgcGF0aFByb21pc2UgPSByZWZyZXNoUGF0aHMubWFwKChwKSA9PiB7XG4gICAgICB0aGlzLnRhcmdldHNMb2FkaW5nW3BdID0gdHJ1ZTtcbiAgICAgIHRoaXMudGFyZ2V0c1twXSA9IHRoaXMudGFyZ2V0c1twXSB8fCBbXTtcblxuICAgICAgdGhpcy5pbnN0YW5jZWRUb29sc1twXSA9ICh0aGlzLmluc3RhbmNlZFRvb2xzW3BdIHx8IFtdKVxuICAgICAgICAubWFwKHQgPT4gdC5yZW1vdmVBbGxMaXN0ZW5lcnMgJiYgdC5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlZnJlc2gnKSlcbiAgICAgICAgLmZpbHRlcigoKSA9PiBmYWxzZSk7IC8vIEp1c3QgZW1wdHkgdGhlIGFycmF5XG5cbiAgICAgIGNvbnN0IHNldHRpbmdzUHJvbWlzZSA9IHRoaXMudG9vbHNcbiAgICAgICAgLm1hcChUb29sID0+IG5ldyBUb29sKHApKVxuICAgICAgICAuZmlsdGVyKHRvb2wgPT4gdG9vbC5pc0VsaWdpYmxlKCkpXG4gICAgICAgIC5tYXAodG9vbCA9PiB7XG4gICAgICAgICAgdGhpcy5pbnN0YW5jZWRUb29sc1twXS5wdXNoKHRvb2wpO1xuICAgICAgICAgIEdvb2dsZUFuYWx5dGljcy5zZW5kRXZlbnQoJ2J1aWxkJywgJ3Rvb2wgZWxpZ2libGUnLCB0b29sLmdldE5pY2VOYW1lKCkpO1xuXG4gICAgICAgICAgdG9vbC5vbiAmJiB0b29sLm9uKCdyZWZyZXNoJywgdGhpcy5yZWZyZXNoVGFyZ2V0cy5iaW5kKHRoaXMsIFsgcCBdKSk7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4gdG9vbC5zZXR0aW5ncygpKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignSW52YWxpZCBidWlsZCBmaWxlLicsIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6ICdZb3UgaGF2ZSBhIHN5bnRheCBlcnJvciBpbiB5b3VyIGJ1aWxkIGZpbGU6ICcgKyBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignT29vcHMuIFNvbWV0aGluZyB3ZW50IHdyb25nLicsIHtcbiAgICAgICAgICAgICAgICBkZXRhaWw6IGVyci5tZXNzYWdlICsgKGVyci5zdGFjayA/ICdcXG4nICsgZXJyLnN0YWNrIDogJycpLFxuICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHNldHRpbmdzUHJvbWlzZSkudGhlbigoc2V0dGluZ3MpID0+IHtcbiAgICAgICAgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzTWFrZVVuaXF1ZShbXS5jb25jYXQuYXBwbHkoW10sIHNldHRpbmdzKS5maWx0ZXIoQm9vbGVhbikubWFwKHNldHRpbmcgPT5cbiAgICAgICAgICBfLmRlZmF1bHRzKHNldHRpbmcsIHRoaXMuY21kRGVmYXVsdHMocCkpXG4gICAgICAgICkpO1xuXG4gICAgICAgIGlmIChfLmlzTnVsbCh0aGlzLmFjdGl2ZVRhcmdldFtwXSkgfHwgIXNldHRpbmdzLmZpbmQocyA9PiBzLm5hbWUgPT09IHRoaXMuYWN0aXZlVGFyZ2V0W3BdKSkge1xuICAgICAgICAgIC8qIEFjdGl2ZSB0YXJnZXQgaGFzIGJlZW4gcmVtb3ZlZCBvciBub3Qgc2V0LiBTZXQgaXQgdG8gdGhlIGhpZ2hlc3QgcHJpbyB0YXJnZXQgKi9cbiAgICAgICAgICB0aGlzLmFjdGl2ZVRhcmdldFtwXSA9IHNldHRpbmdzWzBdID8gc2V0dGluZ3NbMF0ubmFtZSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGFyZ2V0c1twXS5mb3JFYWNoKHRhcmdldCA9PiB0YXJnZXQuZGlzcG9zZSgpKTtcblxuICAgICAgICBzZXR0aW5ncy5mb3JFYWNoKChzZXR0aW5nLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmICghc2V0dGluZy5rZXltYXApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBHb29nbGVBbmFseXRpY3Muc2VuZEV2ZW50KCdrZXltYXAnLCAncmVnaXN0ZXJlZCcsIHNldHRpbmcua2V5bWFwKTtcbiAgICAgICAgICBjb25zdCBjb21tYW5kTmFtZSA9ICdidWlsZDp0cmlnZ2VyOicgKyBzZXR0aW5nLm5hbWU7XG4gICAgICAgICAgY29uc3Qga2V5bWFwU3BlYyA9IHsgJ2F0b20td29ya3NwYWNlLCBhdG9tLXRleHQtZWRpdG9yJzoge30gfTtcbiAgICAgICAgICBrZXltYXBTcGVjWydhdG9tLXdvcmtzcGFjZSwgYXRvbS10ZXh0LWVkaXRvciddW3NldHRpbmcua2V5bWFwXSA9IGNvbW1hbmROYW1lO1xuICAgICAgICAgIGNvbnN0IGtleW1hcERpc3Bvc2UgPSBhdG9tLmtleW1hcHMuYWRkKHNldHRpbmcubmFtZSwga2V5bWFwU3BlYyk7XG4gICAgICAgICAgY29uc3QgY29tbWFuZERpc3Bvc2UgPSBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCBjb21tYW5kTmFtZSwgdGhpcy5idWlsZC5iaW5kKHRoaXMsICd0cmlnZ2VyJykpO1xuICAgICAgICAgIHNldHRpbmdzW2luZGV4XS5kaXNwb3NlID0gKCkgPT4ge1xuICAgICAgICAgICAga2V5bWFwRGlzcG9zZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICBjb21tYW5kRGlzcG9zZS5kaXNwb3NlKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50YXJnZXRzW3BdID0gc2V0dGluZ3M7XG4gICAgICAgIHRoaXMudGFyZ2V0c0xvYWRpbmdbcF0gPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVTdGF0dXNCYXIoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgUHJvbWlzZS5hbGwocGF0aFByb21pc2UpLnRoZW4oKGVudHJpZXMpID0+IHtcbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJvd3MgPSByZWZyZXNoUGF0aHMubWFwKHAgPT4gYCR7dGhpcy50YXJnZXRzW3BdLmxlbmd0aH0gdGFyZ2V0cyBhdDogJHtwfWApO1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0J1aWxkIHRhcmdldHMgcGFyc2VkLicsIHtcbiAgICAgICAgZGV0YWlsOiByb3dzLmpvaW4oJ1xcbicpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBzZWxlY3RBY3RpdmVUYXJnZXQoKSB7XG4gICAgY29uc3QgcCA9IHRoaXMuYWN0aXZlUGF0aCgpO1xuICAgIGNvbnN0IHRhcmdldHMgPSB0aGlzLnRhcmdldHNbcF07XG4gICAgY29uc3QgdGFyZ2V0c1ZpZXcgPSBuZXcgVGFyZ2V0c1ZpZXcoKTtcblxuICAgIGlmICh0aGlzLnRhcmdldHNMb2FkaW5nW3BdKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0c1ZpZXcuc2V0TG9hZGluZygnTG9hZGluZyBwcm9qZWN0IGJ1aWxkIHRhcmdldHNcXHUyMDI2Jyk7XG4gICAgfVxuXG4gICAgdGFyZ2V0c1ZpZXcuc2V0QWN0aXZlVGFyZ2V0KHRoaXMuYWN0aXZlVGFyZ2V0W3BdKTtcbiAgICB0YXJnZXRzVmlldy5zZXRJdGVtcygodGFyZ2V0cyB8fCBbXSkubWFwKHRhcmdldCA9PiB0YXJnZXQubmFtZSkpO1xuICAgIHRhcmdldHNWaWV3LmF3YWl0U2VsZWN0aW9uKCkudGhlbigobmV3VGFyZ2V0KSA9PiB7XG4gICAgICB0aGlzLmFjdGl2ZVRhcmdldFtwXSA9IG5ld1RhcmdldDtcbiAgICAgIHRoaXMudXBkYXRlU3RhdHVzQmFyKCk7XG5cbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnNlbGVjdFRyaWdnZXJzJykpIHtcbiAgICAgICAgY29uc3Qgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB0YXJnZXRzVmlldy5zZXRFcnJvcihlcnIubWVzc2FnZSkpO1xuICB9LFxuXG4gIHJlcGxhY2UodmFsdWUgPSAnJywgdGFyZ2V0RW52KSB7XG4gICAgY29uc3QgZW52ID0gXy5leHRlbmQoe30sIHByb2Nlc3MuZW52LCB0YXJnZXRFbnYpO1xuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFwkKFxcdyspL2csIGZ1bmN0aW9uIChtYXRjaCwgbmFtZSkge1xuICAgICAgcmV0dXJuIG5hbWUgaW4gZW52ID8gZW52W25hbWVdIDogbWF0Y2g7XG4gICAgfSk7XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICBjb25zdCBwcm9qZWN0UGF0aHMgPSBfLm1hcChhdG9tLnByb2plY3QuZ2V0UGF0aHMoKSwgKHByb2plY3RQYXRoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gZnMucmVhbHBhdGhTeW5jKHByb2plY3RQYXRoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgLyogRG8gbm90aGluZy4gKi8gfVxuICAgIH0pO1xuXG4gICAgbGV0IHByb2plY3RQYXRoID0gcHJvamVjdFBhdGhzWzBdO1xuICAgIGlmIChlZGl0b3IgJiYgJ3VudGl0bGVkJyAhPT0gZWRpdG9yLmdldFRpdGxlKCkpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZUZpbGUgPSBmcy5yZWFscGF0aFN5bmMoZWRpdG9yLmdldFBhdGgoKSk7XG4gICAgICBjb25zdCBhY3RpdmVGaWxlUGF0aCA9IHBhdGguZGlybmFtZShhY3RpdmVGaWxlKTtcbiAgICAgIHByb2plY3RQYXRoID0gXy5maW5kKHByb2plY3RQYXRocywgKHApID0+IGFjdGl2ZUZpbGVQYXRoICYmIGFjdGl2ZUZpbGVQYXRoLnN0YXJ0c1dpdGgocCkpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC97RklMRV9BQ1RJVkV9L2csIGFjdGl2ZUZpbGUpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC97RklMRV9BQ1RJVkVfUEFUSH0vZywgYWN0aXZlRmlsZVBhdGgpO1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC97RklMRV9BQ1RJVkVfTkFNRX0vZywgcGF0aC5iYXNlbmFtZShhY3RpdmVGaWxlKSk7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL3tGSUxFX0FDVElWRV9OQU1FX0JBU0V9L2csIHBhdGguYmFzZW5hbWUoYWN0aXZlRmlsZSwgcGF0aC5leHRuYW1lKGFjdGl2ZUZpbGUpKSk7XG4gICAgfVxuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgve1BST0pFQ1RfUEFUSH0vZywgcHJvamVjdFBhdGgpO1xuICAgIGlmIChhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzWzBdKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL3tSRVBPX0JSQU5DSF9TSE9SVH0vZywgYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpWzBdLmdldFNob3J0SGVhZCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH0sXG5cbiAgc3RhcnROZXdCdWlsZChzb3VyY2UsIHRhcmdldE5hbWUpIHtcbiAgICBjb25zdCBwID0gdGhpcy5hY3RpdmVQYXRoKCk7XG4gICAgdGFyZ2V0TmFtZSA9IHRhcmdldE5hbWUgfHwgdGhpcy5hY3RpdmVUYXJnZXRbcF07XG5cbiAgICBQcm9taXNlLnJlc29sdmUodGhpcy50YXJnZXRzW3BdKS50aGVuKHRhcmdldHMgPT4ge1xuICAgICAgaWYgKCF0YXJnZXRzIHx8IDAgPT09IHRhcmdldHMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IG5ldyBCdWlsZEVycm9yKCdObyBlbGlnaWJsZSBidWlsZCB0YXJnZXQuJywgJ05vIGNvbmZpZ3VyYXRpb24gdG8gYnVpbGQgdGhpcyBwcm9qZWN0IGV4aXN0cy4nKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGFyZ2V0ID0gdGFyZ2V0cy5maW5kKHQgPT4gdC5uYW1lID09PSB0YXJnZXROYW1lKTtcbiAgICAgIEdvb2dsZUFuYWx5dGljcy5zZW5kRXZlbnQoJ2J1aWxkJywgJ3RyaWdnZXJlZCcpO1xuXG4gICAgICBpZiAoIXRhcmdldC5leGVjKSB7XG4gICAgICAgIHRocm93IG5ldyBCdWlsZEVycm9yKCdJbnZhbGlkIGJ1aWxkIGZpbGUuJywgJ05vIGV4ZWN1dGFibGUgY29tbWFuZCBzcGVjaWZpZWQuJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVudiA9IF8uZXh0ZW5kKHt9LCBwcm9jZXNzLmVudiwgdGFyZ2V0LmVudik7XG4gICAgICBfLmZvckVhY2goZW52LCAodmFsdWUsIGtleSwgbGlzdCkgPT4ge1xuICAgICAgICBsaXN0W2tleV0gPSB0aGlzLnJlcGxhY2UodmFsdWUsIHRhcmdldC5lbnYpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGV4ZWMgPSB0aGlzLnJlcGxhY2UodGFyZ2V0LmV4ZWMsIHRhcmdldC5lbnYpO1xuICAgICAgY29uc3QgYXJncyA9IHRhcmdldC5hcmdzLm1hcChhcmcgPT4gdGhpcy5yZXBsYWNlKGFyZywgdGFyZ2V0LmVudikpO1xuICAgICAgY29uc3QgY3dkID0gdGhpcy5yZXBsYWNlKHRhcmdldC5jd2QsIHRhcmdldC5lbnYpO1xuXG4gICAgICB0aGlzLmNoaWxkID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLnNwYXduKFxuICAgICAgICB0YXJnZXQuc2ggPyAnL2Jpbi9zaCcgOiBleGVjLFxuICAgICAgICB0YXJnZXQuc2ggPyBbICctYycsIFsgZXhlYyBdLmNvbmNhdChhcmdzKS5qb2luKCcgJykgXSA6IGFyZ3MsXG4gICAgICAgIHsgY3dkOiBjd2QsIGVudjogZW52IH1cbiAgICAgICk7XG5cbiAgICAgIHRoaXMuc3Rkb3V0ID0gbmV3IEJ1ZmZlcigwKTtcbiAgICAgIHRoaXMuY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGJ1ZmZlcikgPT4ge1xuICAgICAgICB0aGlzLnN0ZG91dCA9IEJ1ZmZlci5jb25jYXQoWyB0aGlzLnN0ZG91dCwgYnVmZmVyIF0pO1xuICAgICAgICB0aGlzLmJ1aWxkVmlldy5hcHBlbmQoYnVmZmVyKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnN0ZGVyciA9IG5ldyBCdWZmZXIoMCk7XG4gICAgICB0aGlzLmNoaWxkLnN0ZGVyci5vbignZGF0YScsIChidWZmZXIpID0+IHtcbiAgICAgICAgdGhpcy5zdGRlcnIgPSBCdWZmZXIuY29uY2F0KFsgdGhpcy5zdGRlcnIsIGJ1ZmZlciBdKTtcbiAgICAgICAgdGhpcy5idWlsZFZpZXcuYXBwZW5kKGJ1ZmZlcik7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jaGlsZC5vbignZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgIHRoaXMuYnVpbGRWaWV3LmFwcGVuZCgodGFyZ2V0LnNoID8gJ1VuYWJsZSB0byBleGVjdXRlIHdpdGggc2g6ICcgOiAnVW5hYmxlIHRvIGV4ZWN1dGU6ICcpICsgZXhlYyArICdcXG4nKTtcblxuICAgICAgICBpZiAoL1xccy8udGVzdChleGVjKSAmJiAhdGFyZ2V0LnNoKSB7XG4gICAgICAgICAgdGhpcy5idWlsZFZpZXcuYXBwZW5kKCdgY21kYCBjYW5ub3QgY29udGFpbiBzcGFjZS4gVXNlIGBhcmdzYCBmb3IgYXJndW1lbnRzLlxcbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCdFTk9FTlQnID09PSBlcnIuY29kZSkge1xuICAgICAgICAgIHRoaXMuYnVpbGRWaWV3LmFwcGVuZCgnTWFrZSBzdXJlIGBjbWRgIGFuZCBgY3dkYCBleGlzdHMgYW5kIGhhdmUgY29ycmVjdCBhY2Nlc3MgcGVybWlzc2lvbnMuXFxuJyk7XG4gICAgICAgICAgdGhpcy5idWlsZFZpZXcuYXBwZW5kKGBCdWlsZCBmaW5kcyBiaW5hcmllcyBpbiB0aGVzZSBmb2xkZXJzOiAke3Byb2Nlc3MuZW52LlBBVEh9XFxuYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmNoaWxkLm9uKCdjbG9zZScsIChleGl0Q29kZSkgPT4ge1xuICAgICAgICB0aGlzLmVycm9yTWF0Y2hlci5zZXQodGFyZ2V0LmVycm9yTWF0Y2gsIGN3ZCwgdGhpcy5idWlsZFZpZXcub3V0cHV0LnRleHQoKSk7XG5cbiAgICAgICAgbGV0IHN1Y2Nlc3MgPSAoMCA9PT0gZXhpdENvZGUpO1xuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5tYXRjaGVkRXJyb3JGYWlsc0J1aWxkJykpIHtcbiAgICAgICAgICBzdWNjZXNzID0gc3VjY2VzcyAmJiAhdGhpcy5lcnJvck1hdGNoZXIuaGFzTWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1aWxkVmlldy5idWlsZEZpbmlzaGVkKHN1Y2Nlc3MpO1xuICAgICAgICB0aGlzLnN0YXR1c0JhclZpZXcgJiYgdGhpcy5zdGF0dXNCYXJWaWV3LnNldEJ1aWxkU3VjY2VzcyhzdWNjZXNzKTtcblxuICAgICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICAgIEdvb2dsZUFuYWx5dGljcy5zZW5kRXZlbnQoJ2J1aWxkJywgJ3N1Y2NlZWRlZCcpO1xuICAgICAgICAgIHRoaXMuZmluaXNoZWRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5idWlsZFZpZXcuZGV0YWNoKCk7XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnYnVpbGQuc2Nyb2xsT25FcnJvcicpKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yTWF0Y2hlci5tYXRjaEZpcnN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIEdvb2dsZUFuYWx5dGljcy5zZW5kRXZlbnQoJ2J1aWxkJywgJ2ZhaWxlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hpbGQgPSBudWxsO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYnVpbGRWaWV3LmJ1aWxkU3RhcnRlZCgpO1xuICAgICAgdGhpcy5idWlsZFZpZXcuYXBwZW5kKFsgKHRhcmdldC5zaCA/ICdFeGVjdXRpbmcgd2l0aCBzaDonIDogJ0V4ZWN1dGluZzonKSwgZXhlYywgLi4uYXJncywgJ1xcbiddLmpvaW4oJyAnKSk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEJ1aWxkRXJyb3IpIHtcbiAgICAgICAgaWYgKHNvdXJjZSA9PT0gJ3NhdmUnKSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gZWxpZ2libGUgYnVpbGQgdG9vbCwgYW5kIGNhdXNlIG9mIGJ1aWxkIHdhcyBhIHNhdmUsIHN0YXkgcXVpZXQuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoZXJyLm5hbWUsIHsgZGV0YWlsOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRmFpbGVkIHRvIGJ1aWxkLicsIHsgZGV0YWlsOiBlcnIubWVzc2FnZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBhYm9ydChjYikge1xuICAgIHRoaXMuY2hpbGQucmVtb3ZlQWxsTGlzdGVuZXJzKCdjbG9zZScpO1xuICAgIHRoaXMuY2hpbGQub24oJ2Nsb3NlJywgKCkgPT4ge1xuICAgICAgdGhpcy5jaGlsZCA9IG51bGw7XG4gICAgICBjYiAmJiBjYigpO1xuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGtpbGwodGhpcy5jaGlsZC5waWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8qIFNvbWV0aGluZyBtYXkgaGF2ZSBoYXBwZW5lZCB0byB0aGUgY2hpbGQgKGUuZy4gdGVybWluYXRlZCBieSBpdHNlbGYpLiBJZ25vcmUgdGhpcy4gKi9cbiAgICB9XG5cbiAgICB0aGlzLmNoaWxkLmtpbGxlZCA9IHRydWU7XG4gIH0sXG5cbiAgYnVpbGQoc291cmNlLCBldmVudCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmZpbmlzaGVkVGltZXIpO1xuXG4gICAgdGhpcy5kb1NhdmVDb25maXJtKHRoaXMudW5zYXZlZFRleHRFZGl0b3JzKCksICgpID0+IHtcbiAgICAgIGNvbnN0IG5leHQgPSB0aGlzLnN0YXJ0TmV3QnVpbGQuYmluZCh0aGlzLCBzb3VyY2UsIGV2ZW50ID8gZXZlbnQudHlwZS5zdWJzdHIoMTQpIDogbnVsbCk7XG4gICAgICB0aGlzLmNoaWxkID8gdGhpcy5hYm9ydChuZXh0KSA6IG5leHQoKTtcbiAgICB9KTtcbiAgfSxcblxuICBkb1NhdmVDb25maXJtKG1vZGlmaWVkVGV4dEVkaXRvcnMsIGNvbnRpbnVlY2IsIGNhbmNlbGNiKSB7XG4gICAgY29uc3Qgc2F2ZUFuZENvbnRpbnVlID0gKHNhdmUpID0+IHtcbiAgICAgIG1vZGlmaWVkVGV4dEVkaXRvcnMuZm9yRWFjaCgodGV4dEVkaXRvcikgPT4gc2F2ZSAmJiB0ZXh0RWRpdG9yLnNhdmUoKSk7XG4gICAgICBjb250aW51ZWNiKCk7XG4gICAgfTtcblxuICAgIGlmICgwID09PSBfLnNpemUobW9kaWZpZWRUZXh0RWRpdG9ycykgfHwgYXRvbS5jb25maWcuZ2V0KCdidWlsZC5zYXZlT25CdWlsZCcpKSB7XG4gICAgICByZXR1cm4gc2F2ZUFuZENvbnRpbnVlKHRydWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNhdmVDb25maXJtVmlldykge1xuICAgICAgdGhpcy5zYXZlQ29uZmlybVZpZXcuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuc2F2ZUNvbmZpcm1WaWV3ID0gbmV3IFNhdmVDb25maXJtVmlldygpO1xuICAgIHRoaXMuc2F2ZUNvbmZpcm1WaWV3LnNob3coc2F2ZUFuZENvbnRpbnVlLCBjYW5jZWxjYik7XG4gIH0sXG5cbiAgdW5zYXZlZFRleHRFZGl0b3JzKCkge1xuICAgIHJldHVybiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZpbHRlcigodGV4dEVkaXRvcikgPT4ge1xuICAgICAgcmV0dXJuIHRleHRFZGl0b3IuaXNNb2RpZmllZCgpICYmICgndW50aXRsZWQnICE9PSB0ZXh0RWRpdG9yLmdldFRpdGxlKCkpO1xuICAgIH0pO1xuICB9LFxuXG4gIHN0b3AoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuZmluaXNoZWRUaW1lcik7XG4gICAgaWYgKHRoaXMuY2hpbGQpIHtcbiAgICAgIGlmICh0aGlzLmNoaWxkLmtpbGxlZCkge1xuICAgICAgICAvLyBUaGlzIGNoaWxkIGhhcyBiZWVuIGtpbGxlZCwgYnV0IGhhc24ndCB0ZXJtaW5hdGVkLiBIaWRlIGl0IGZyb20gdXNlci5cbiAgICAgICAgdGhpcy5jaGlsZC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5jaGlsZCA9IG51bGw7XG4gICAgICAgIHRoaXMuYnVpbGRWaWV3LmJ1aWxkQWJvcnRlZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWJvcnQoKCkgPT4gdGhpcy5idWlsZFZpZXcuYnVpbGRBYm9ydGVkKCkpO1xuXG4gICAgICB0aGlzLmJ1aWxkVmlldy5idWlsZEFib3J0SW5pdGlhdGVkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnVpbGRWaWV3LnJlc2V0KCk7XG4gICAgfVxuICB9LFxuXG4gIGNvbnN1bWVCdWlsZGVyTGVnYWN5KGJ1aWxkZXIpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdW1lQnVpbGRlcihwcm92aWRlckxlZ2FjeShidWlsZGVyKSk7XG4gIH0sXG5cbiAgY29uc3VtZUJ1aWxkZXIoYnVpbGRlcnMpIHtcbiAgICBidWlsZGVycyA9IEFycmF5LmlzQXJyYXkoYnVpbGRlcnMpID8gYnVpbGRlcnMgOiBbIGJ1aWxkZXJzIF07XG4gICAgdGhpcy50b29scyA9IF8udW5pb24odGhpcy50b29scywgYnVpbGRlcnMpO1xuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB0aGlzLnRvb2xzID0gXy5kaWZmZXJlbmNlKHRoaXMudG9vbHMsIGJ1aWxkZXJzKSk7XG4gIH0sXG5cbiAgY29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhclZpZXcgPSBuZXcgU3RhdHVzQmFyVmlldyhzdGF0dXNCYXIpO1xuICAgIHRoaXMuc3RhdHVzQmFyVmlldy5vbkNsaWNrKCgpID0+IHRoaXMuc2VsZWN0QWN0aXZlVGFyZ2V0KCkpO1xuICAgIHRoaXMuc3RhdHVzQmFyVmlldy5hdHRhY2goKTtcbiAgfVxufTtcbiJdfQ==
//# sourceURL=/home/andy/.atom/packages/build/lib/build.js
