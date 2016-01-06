(function() {
  var ATOM_VARIABLES, ColorBuffer, ColorContext, ColorMarkerElement, ColorProject, ColorSearch, CompositeDisposable, Emitter, Palette, PathsLoader, PathsScanner, Range, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, THEME_VARIABLES, VariablesCollection, compareArray, minimatch, _ref, _ref1,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range;

  minimatch = require('minimatch');

  _ref1 = require('./versions'), SERIALIZE_VERSION = _ref1.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = _ref1.SERIALIZE_MARKERS_VERSION;

  THEME_VARIABLES = require('./uris').THEME_VARIABLES;

  ColorBuffer = require('./color-buffer');

  ColorContext = require('./color-context');

  ColorSearch = require('./color-search');

  Palette = require('./palette');

  PathsLoader = require('./paths-loader');

  PathsScanner = require('./paths-scanner');

  ColorMarkerElement = require('./color-marker-element');

  VariablesCollection = require('./variables-collection');

  ATOM_VARIABLES = ['text-color', 'text-color-subtle', 'text-color-highlight', 'text-color-selected', 'text-color-info', 'text-color-success', 'text-color-warning', 'text-color-error', 'background-color-info', 'background-color-success', 'background-color-warning', 'background-color-error', 'background-color-highlight', 'background-color-selected', 'app-background-color', 'base-background-color', 'base-border-color', 'pane-item-background-color', 'pane-item-border-color', 'input-background-color', 'input-border-color', 'tool-panel-background-color', 'tool-panel-border-color', 'inset-panel-background-color', 'inset-panel-border-color', 'panel-heading-background-color', 'panel-heading-border-color', 'overlay-background-color', 'overlay-border-color', 'button-background-color', 'button-background-color-hover', 'button-background-color-selected', 'button-border-color', 'tab-bar-background-color', 'tab-bar-border-color', 'tab-background-color', 'tab-background-color-active', 'tab-border-color', 'tree-view-background-color', 'tree-view-border-color', 'ui-site-color-1', 'ui-site-color-2', 'ui-site-color-3', 'ui-site-color-4', 'ui-site-color-5', 'syntax-text-color', 'syntax-cursor-color', 'syntax-selection-color', 'syntax-background-color', 'syntax-wrap-guide-color', 'syntax-indent-guide-color', 'syntax-invisible-character-color', 'syntax-result-marker-color', 'syntax-result-marker-color-selected', 'syntax-gutter-text-color', 'syntax-gutter-text-color-selected', 'syntax-gutter-background-color', 'syntax-gutter-background-color-selected', 'syntax-color-renamed', 'syntax-color-added', 'syntax-color-modified', 'syntax-color-removed'];

  compareArray = function(a, b) {
    var i, v, _i, _len;
    if ((a == null) || (b == null)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
      v = a[i];
      if (v !== b[i]) {
        return false;
      }
    }
    return true;
  };

  module.exports = ColorProject = (function() {
    ColorProject.deserialize = function(state) {
      var markersVersion;
      markersVersion = SERIALIZE_MARKERS_VERSION;
      if ((state != null ? state.version : void 0) !== SERIALIZE_VERSION) {
        state = {};
      }
      if ((state != null ? state.markersVersion : void 0) !== markersVersion) {
        delete state.variables;
        delete state.buffers;
      }
      if (!compareArray(state.globalSourceNames, atom.config.get('pigments.sourceNames')) || !compareArray(state.globalIgnoredNames, atom.config.get('pigments.ignoredNames'))) {
        delete state.variables;
        delete state.buffers;
        delete state.paths;
      }
      return new ColorProject(state);
    };

    function ColorProject(state) {
      var buffers, includeThemes, timestamp, variables;
      if (state == null) {
        state = {};
      }
      includeThemes = state.includeThemes, this.ignoredNames = state.ignoredNames, this.sourceNames = state.sourceNames, this.ignoredScopes = state.ignoredScopes, this.paths = state.paths, this.searchNames = state.searchNames, this.ignoreGlobalSourceNames = state.ignoreGlobalSourceNames, this.ignoreGlobalIgnoredNames = state.ignoreGlobalIgnoredNames, this.ignoreGlobalIgnoredScopes = state.ignoreGlobalIgnoredScopes, this.ignoreGlobalSearchNames = state.ignoreGlobalSearchNames, this.ignoreGlobalSupportedFiletypes = state.ignoreGlobalSupportedFiletypes, this.supportedFiletypes = state.supportedFiletypes, variables = state.variables, timestamp = state.timestamp, buffers = state.buffers;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.colorBuffersByEditorId = {};
      this.variableExpressionsRegistry = require('./variable-expressions');
      this.colorExpressionsRegistry = require('./color-expressions');
      if (variables != null) {
        this.variables = atom.deserializers.deserialize(variables);
      } else {
        this.variables = new VariablesCollection;
      }
      this.subscriptions.add(this.variables.onDidChange((function(_this) {
        return function(results) {
          return _this.emitVariablesChangeEvent(results);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.sourceNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredNames', (function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.ignoredScopes', (function(_this) {
        return function() {
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.supportedFiletypes', (function(_this) {
        return function() {
          _this.updateIgnoredFiletypes();
          return _this.emitter.emit('did-change-ignored-scopes', _this.getIgnoredScopes());
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', function(type) {
        if (type != null) {
          return ColorMarkerElement.setMarkerType(type);
        }
      }));
      this.subscriptions.add(atom.config.observe('pigments.ignoreVcsIgnoredPaths', (function(_this) {
        return function() {
          return _this.loadPathsAndVariables();
        };
      })(this)));
      this.subscriptions.add(this.colorExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function(_arg) {
          var colorBuffer, id, name, _ref2, _results;
          name = _arg.name;
          if ((_this.paths == null) || name === 'pigments:variables') {
            return;
          }
          _this.variables.evaluateVariables(_this.variables.getVariables());
          _ref2 = _this.colorBuffersByEditorId;
          _results = [];
          for (id in _ref2) {
            colorBuffer = _ref2[id];
            _results.push(colorBuffer.update());
          }
          return _results;
        };
      })(this)));
      this.subscriptions.add(this.variableExpressionsRegistry.onDidUpdateExpressions((function(_this) {
        return function() {
          if (_this.paths == null) {
            return;
          }
          return _this.reloadVariablesForPaths(_this.getPaths());
        };
      })(this)));
      this.bufferStates = buffers != null ? buffers : {};
      if (timestamp != null) {
        this.timestamp = new Date(Date.parse(timestamp));
      }
      if (includeThemes) {
        this.setIncludeThemes(includeThemes);
      }
      this.updateIgnoredFiletypes();
      if ((this.paths != null) && (this.variables.length != null)) {
        this.initialize();
      }
      this.initializeBuffers();
    }

    ColorProject.prototype.onDidInitialize = function(callback) {
      return this.emitter.on('did-initialize', callback);
    };

    ColorProject.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    ColorProject.prototype.onDidUpdateVariables = function(callback) {
      return this.emitter.on('did-update-variables', callback);
    };

    ColorProject.prototype.onDidCreateColorBuffer = function(callback) {
      return this.emitter.on('did-create-color-buffer', callback);
    };

    ColorProject.prototype.onDidChangeIgnoredScopes = function(callback) {
      return this.emitter.on('did-change-ignored-scopes', callback);
    };

    ColorProject.prototype.onDidChangePaths = function(callback) {
      return this.emitter.on('did-change-paths', callback);
    };

    ColorProject.prototype.observeColorBuffers = function(callback) {
      var colorBuffer, id, _ref2;
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        colorBuffer = _ref2[id];
        callback(colorBuffer);
      }
      return this.onDidCreateColorBuffer(callback);
    };

    ColorProject.prototype.isInitialized = function() {
      return this.initialized;
    };

    ColorProject.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    ColorProject.prototype.initialize = function() {
      if (this.isInitialized()) {
        return Promise.resolve(this.variables.getVariables());
      }
      if (this.initializePromise != null) {
        return this.initializePromise;
      }
      return this.initializePromise = this.loadPathsAndVariables().then((function(_this) {
        return function() {
          var variables;
          _this.initialized = true;
          variables = _this.variables.getVariables();
          _this.emitter.emit('did-initialize', variables);
          return variables;
        };
      })(this));
    };

    ColorProject.prototype.destroy = function() {
      var buffer, id, _ref2;
      if (this.destroyed) {
        return;
      }
      this.destroyed = true;
      PathsScanner.terminateRunningTask();
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        buffer = _ref2[id];
        buffer.destroy();
      }
      this.colorBuffersByEditorId = null;
      this.subscriptions.dispose();
      this.subscriptions = null;
      this.emitter.emit('did-destroy', this);
      return this.emitter.dispose();
    };

    ColorProject.prototype.loadPathsAndVariables = function() {
      var destroyed;
      destroyed = null;
      return this.loadPaths().then((function(_this) {
        return function(_arg) {
          var dirtied, path, removed, _i, _len;
          dirtied = _arg.dirtied, removed = _arg.removed;
          if (removed.length > 0) {
            _this.paths = _this.paths.filter(function(p) {
              return __indexOf.call(removed, p) < 0;
            });
            _this.deleteVariablesForPaths(removed);
          }
          if ((_this.paths != null) && dirtied.length > 0) {
            for (_i = 0, _len = dirtied.length; _i < _len; _i++) {
              path = dirtied[_i];
              if (__indexOf.call(_this.paths, path) < 0) {
                _this.paths.push(path);
              }
            }
            if (_this.variables.length) {
              return dirtied;
            } else {
              return _this.paths;
            }
          } else if (_this.paths == null) {
            return _this.paths = dirtied;
          } else if (!_this.variables.length) {
            return _this.paths;
          } else {
            return [];
          }
        };
      })(this)).then((function(_this) {
        return function(paths) {
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          if (results != null) {
            return _this.variables.updateCollection(results);
          }
        };
      })(this));
    };

    ColorProject.prototype.findAllColors = function() {
      var patterns;
      patterns = this.getSearchNames();
      return new ColorSearch({
        sourceNames: patterns,
        ignoredNames: this.getIgnoredNames(),
        context: this.getContext()
      });
    };

    ColorProject.prototype.initializeBuffers = function(buffers) {
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var buffer, bufferElement;
          buffer = _this.colorBufferForEditor(editor);
          if (buffer != null) {
            bufferElement = atom.views.getView(buffer);
            return bufferElement.attach();
          }
        };
      })(this)));
    };

    ColorProject.prototype.colorBufferForEditor = function(editor) {
      var buffer, state, subscription;
      if (this.destroyed) {
        return;
      }
      if (editor == null) {
        return;
      }
      if (this.colorBuffersByEditorId[editor.id] != null) {
        return this.colorBuffersByEditorId[editor.id];
      }
      if (this.bufferStates[editor.id] != null) {
        state = this.bufferStates[editor.id];
        state.editor = editor;
        state.project = this;
        delete this.bufferStates[editor.id];
      } else {
        state = {
          editor: editor,
          project: this
        };
      }
      this.colorBuffersByEditorId[editor.id] = buffer = new ColorBuffer(state);
      this.subscriptions.add(subscription = buffer.onDidDestroy((function(_this) {
        return function() {
          _this.subscriptions.remove(subscription);
          subscription.dispose();
          return delete _this.colorBuffersByEditorId[editor.id];
        };
      })(this)));
      this.emitter.emit('did-create-color-buffer', buffer);
      return buffer;
    };

    ColorProject.prototype.colorBufferForPath = function(path) {
      var colorBuffer, id, _ref2;
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        colorBuffer = _ref2[id];
        if (colorBuffer.editor.getPath() === path) {
          return colorBuffer;
        }
      }
    };

    ColorProject.prototype.getPaths = function() {
      var _ref2;
      return (_ref2 = this.paths) != null ? _ref2.slice() : void 0;
    };

    ColorProject.prototype.appendPath = function(path) {
      if (path != null) {
        return this.paths.push(path);
      }
    };

    ColorProject.prototype.loadPaths = function(noKnownPaths) {
      if (noKnownPaths == null) {
        noKnownPaths = false;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var config, knownPaths, rootPaths, _ref2;
          rootPaths = _this.getRootPaths();
          knownPaths = noKnownPaths ? [] : (_ref2 = _this.paths) != null ? _ref2 : [];
          config = {
            knownPaths: knownPaths,
            timestamp: _this.timestamp,
            ignoredNames: _this.getIgnoredNames(),
            paths: rootPaths,
            traverseIntoSymlinkDirectories: atom.config.get('pigments.traverseIntoSymlinkDirectories'),
            sourceNames: _this.getSourceNames(),
            ignoreVcsIgnores: atom.config.get('pigments.ignoreVcsIgnoredPaths')
          };
          return PathsLoader.startTask(config, function(results) {
            var isDescendentOfRootPaths, p, _i, _len;
            for (_i = 0, _len = knownPaths.length; _i < _len; _i++) {
              p = knownPaths[_i];
              isDescendentOfRootPaths = rootPaths.some(function(root) {
                return p.indexOf(root) === 0;
              });
              if (!isDescendentOfRootPaths) {
                if (results.removed == null) {
                  results.removed = [];
                }
                results.removed.push(p);
              }
            }
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.updatePaths = function() {
      if (!this.initialized) {
        return Promise.resolve();
      }
      return this.loadPaths().then((function(_this) {
        return function(_arg) {
          var dirtied, p, removed, _i, _len;
          dirtied = _arg.dirtied, removed = _arg.removed;
          _this.deleteVariablesForPaths(removed);
          _this.paths = _this.paths.filter(function(p) {
            return __indexOf.call(removed, p) < 0;
          });
          for (_i = 0, _len = dirtied.length; _i < _len; _i++) {
            p = dirtied[_i];
            if (__indexOf.call(_this.paths, p) < 0) {
              _this.paths.push(p);
            }
          }
          _this.emitter.emit('did-change-paths', _this.getPaths());
          return _this.reloadVariablesForPaths(dirtied);
        };
      })(this));
    };

    ColorProject.prototype.isVariablesSourcePath = function(path) {
      var source, sources, _i, _len;
      if (!path) {
        return false;
      }
      path = atom.project.relativize(path);
      sources = this.getSourceNames();
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        if (minimatch(path, source, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.isIgnoredPath = function(path) {
      var ignore, ignoredNames, _i, _len;
      if (!path) {
        return false;
      }
      path = atom.project.relativize(path);
      ignoredNames = this.getIgnoredNames();
      for (_i = 0, _len = ignoredNames.length; _i < _len; _i++) {
        ignore = ignoredNames[_i];
        if (minimatch(path, ignore, {
          matchBase: true,
          dot: true
        })) {
          return true;
        }
      }
    };

    ColorProject.prototype.getPalette = function() {
      if (!this.isInitialized()) {
        return new Palette;
      }
      return new Palette(this.getColorVariables());
    };

    ColorProject.prototype.getContext = function() {
      return this.variables.getContext();
    };

    ColorProject.prototype.getVariables = function() {
      return this.variables.getVariables();
    };

    ColorProject.prototype.getVariableExpressionsRegistry = function() {
      return this.variableExpressionsRegistry;
    };

    ColorProject.prototype.getVariableById = function(id) {
      return this.variables.getVariableById(id);
    };

    ColorProject.prototype.getVariableByName = function(name) {
      return this.variables.getVariableByName(name);
    };

    ColorProject.prototype.getColorVariables = function() {
      return this.variables.getColorVariables();
    };

    ColorProject.prototype.getColorExpressionsRegistry = function() {
      return this.colorExpressionsRegistry;
    };

    ColorProject.prototype.showVariableInFile = function(variable) {
      return atom.workspace.open(variable.path).then(function(editor) {
        var buffer, bufferRange;
        buffer = editor.getBuffer();
        bufferRange = Range.fromObject([buffer.positionForCharacterIndex(variable.range[0]), buffer.positionForCharacterIndex(variable.range[1])]);
        return editor.setSelectedBufferRange(bufferRange, {
          autoscroll: true
        });
      });
    };

    ColorProject.prototype.emitVariablesChangeEvent = function(results) {
      return this.emitter.emit('did-update-variables', results);
    };

    ColorProject.prototype.loadVariablesForPath = function(path) {
      return this.loadVariablesForPaths([path]);
    };

    ColorProject.prototype.loadVariablesForPaths = function(paths) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.scanPathsForVariables(paths, function(results) {
            return resolve(results);
          });
        };
      })(this));
    };

    ColorProject.prototype.getVariablesForPath = function(path) {
      return this.variables.getVariablesForPath(path);
    };

    ColorProject.prototype.getVariablesForPaths = function(paths) {
      return this.variables.getVariablesForPaths(paths);
    };

    ColorProject.prototype.deleteVariablesForPath = function(path) {
      return this.deleteVariablesForPaths([path]);
    };

    ColorProject.prototype.deleteVariablesForPaths = function(paths) {
      return this.variables.deleteVariablesForPaths(paths);
    };

    ColorProject.prototype.reloadVariablesForPath = function(path) {
      return this.reloadVariablesForPaths([path]);
    };

    ColorProject.prototype.reloadVariablesForPaths = function(paths) {
      var promise;
      promise = Promise.resolve();
      if (!this.isInitialized()) {
        promise = this.initialize();
      }
      return promise.then((function(_this) {
        return function() {
          if (paths.some(function(path) {
            return __indexOf.call(_this.paths, path) < 0;
          })) {
            return Promise.resolve([]);
          }
          return _this.loadVariablesForPaths(paths);
        };
      })(this)).then((function(_this) {
        return function(results) {
          return _this.variables.updateCollection(results, paths);
        };
      })(this));
    };

    ColorProject.prototype.scanPathsForVariables = function(paths, callback) {
      var colorBuffer;
      if (paths.length === 1 && (colorBuffer = this.colorBufferForPath(paths[0]))) {
        return colorBuffer.scanBufferForVariables().then(function(results) {
          return callback(results);
        });
      } else {
        return PathsScanner.startTask(paths, this.variableExpressionsRegistry, function(results) {
          return callback(results);
        });
      }
    };

    ColorProject.prototype.loadThemesVariables = function() {
      var div, html, iterator, variables;
      iterator = 0;
      variables = [];
      html = '';
      ATOM_VARIABLES.forEach(function(v) {
        return html += "<div class='" + v + "'>" + v + "</div>";
      });
      div = document.createElement('div');
      div.className = 'pigments-sampler';
      div.innerHTML = html;
      document.body.appendChild(div);
      ATOM_VARIABLES.forEach(function(v, i) {
        var color, end, node, variable;
        node = div.children[i];
        color = getComputedStyle(node).color;
        end = iterator + v.length + color.length + 4;
        variable = {
          name: "@" + v,
          line: i,
          value: color,
          range: [iterator, end],
          path: THEME_VARIABLES
        };
        iterator = end;
        return variables.push(variable);
      });
      document.body.removeChild(div);
      return variables;
    };

    ColorProject.prototype.getRootPaths = function() {
      return atom.project.getPaths();
    };

    ColorProject.prototype.getSourceNames = function() {
      var names, _ref2, _ref3;
      names = ['.pigments'];
      names = names.concat((_ref2 = this.sourceNames) != null ? _ref2 : []);
      if (!this.ignoreGlobalSourceNames) {
        names = names.concat((_ref3 = atom.config.get('pigments.sourceNames')) != null ? _ref3 : []);
      }
      return names;
    };

    ColorProject.prototype.setSourceNames = function(sourceNames) {
      this.sourceNames = sourceNames != null ? sourceNames : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return;
      }
      return this.initialize().then((function(_this) {
        return function() {
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalSourceNames = function(ignoreGlobalSourceNames) {
      this.ignoreGlobalSourceNames = ignoreGlobalSourceNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getSearchNames = function() {
      var names, _ref2, _ref3, _ref4, _ref5;
      names = [];
      names = names.concat((_ref2 = this.sourceNames) != null ? _ref2 : []);
      names = names.concat((_ref3 = this.searchNames) != null ? _ref3 : []);
      if (!this.ignoreGlobalSearchNames) {
        names = names.concat((_ref4 = atom.config.get('pigments.sourceNames')) != null ? _ref4 : []);
        names = names.concat((_ref5 = atom.config.get('pigments.extendedSearchNames')) != null ? _ref5 : []);
      }
      return names;
    };

    ColorProject.prototype.setSearchNames = function(searchNames) {
      this.searchNames = searchNames != null ? searchNames : [];
    };

    ColorProject.prototype.setIgnoreGlobalSearchNames = function(ignoreGlobalSearchNames) {
      this.ignoreGlobalSearchNames = ignoreGlobalSearchNames;
    };

    ColorProject.prototype.getIgnoredNames = function() {
      var names, _ref2, _ref3, _ref4;
      names = (_ref2 = this.ignoredNames) != null ? _ref2 : [];
      if (!this.ignoreGlobalIgnoredNames) {
        names = names.concat((_ref3 = this.getGlobalIgnoredNames()) != null ? _ref3 : []);
        names = names.concat((_ref4 = atom.config.get('core.ignoredNames')) != null ? _ref4 : []);
      }
      return names;
    };

    ColorProject.prototype.getGlobalIgnoredNames = function() {
      var _ref2;
      return (_ref2 = atom.config.get('pigments.ignoredNames')) != null ? _ref2.map(function(p) {
        if (/\/\*$/.test(p)) {
          return p + '*';
        } else {
          return p;
        }
      }) : void 0;
    };

    ColorProject.prototype.setIgnoredNames = function(ignoredNames) {
      this.ignoredNames = ignoredNames != null ? ignoredNames : [];
      if ((this.initialized == null) && (this.initializePromise == null)) {
        return;
      }
      return this.initialize().then((function(_this) {
        return function() {
          var dirtied;
          dirtied = _this.paths.filter(function(p) {
            return _this.isIgnoredPath(p);
          });
          _this.deleteVariablesForPaths(dirtied);
          _this.paths = _this.paths.filter(function(p) {
            return !_this.isIgnoredPath(p);
          });
          return _this.loadPathsAndVariables(true);
        };
      })(this));
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredNames = function(ignoreGlobalIgnoredNames) {
      this.ignoreGlobalIgnoredNames = ignoreGlobalIgnoredNames;
      return this.updatePaths();
    };

    ColorProject.prototype.getIgnoredScopes = function() {
      var scopes, _ref2, _ref3;
      scopes = (_ref2 = this.ignoredScopes) != null ? _ref2 : [];
      if (!this.ignoreGlobalIgnoredScopes) {
        scopes = scopes.concat((_ref3 = atom.config.get('pigments.ignoredScopes')) != null ? _ref3 : []);
      }
      scopes = scopes.concat(this.ignoredFiletypes);
      return scopes;
    };

    ColorProject.prototype.setIgnoredScopes = function(ignoredScopes) {
      this.ignoredScopes = ignoredScopes != null ? ignoredScopes : [];
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setIgnoreGlobalIgnoredScopes = function(ignoreGlobalIgnoredScopes) {
      this.ignoreGlobalIgnoredScopes = ignoreGlobalIgnoredScopes;
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.setSupportedFiletypes = function(supportedFiletypes) {
      this.supportedFiletypes = supportedFiletypes != null ? supportedFiletypes : [];
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.updateIgnoredFiletypes = function() {
      return this.ignoredFiletypes = this.getIgnoredFiletypes();
    };

    ColorProject.prototype.getIgnoredFiletypes = function() {
      var filetypes, scopes, _ref2, _ref3;
      filetypes = (_ref2 = this.supportedFiletypes) != null ? _ref2 : [];
      if (!this.ignoreGlobalSupportedFiletypes) {
        filetypes = filetypes.concat((_ref3 = atom.config.get('pigments.supportedFiletypes')) != null ? _ref3 : []);
      }
      if (filetypes.length === 0) {
        filetypes = ['*'];
      }
      if (filetypes.some(function(type) {
        return type === '*';
      })) {
        return [];
      }
      scopes = filetypes.map(function(ext) {
        var _ref4;
        return (_ref4 = atom.grammars.selectGrammar("file." + ext)) != null ? _ref4.scopeName.replace(/\./g, '\\.') : void 0;
      }).filter(function(scope) {
        return scope != null;
      });
      return ["^(?!\\.(" + (scopes.join('|')) + "))"];
    };

    ColorProject.prototype.setIgnoreGlobalSupportedFiletypes = function(ignoreGlobalSupportedFiletypes) {
      this.ignoreGlobalSupportedFiletypes = ignoreGlobalSupportedFiletypes;
      this.updateIgnoredFiletypes();
      return this.emitter.emit('did-change-ignored-scopes', this.getIgnoredScopes());
    };

    ColorProject.prototype.themesIncluded = function() {
      return this.includeThemes;
    };

    ColorProject.prototype.setIncludeThemes = function(includeThemes) {
      if (includeThemes === this.includeThemes) {
        return Promise.resolve();
      }
      this.includeThemes = includeThemes;
      if (this.includeThemes) {
        this.themesSubscription = atom.themes.onDidChangeActiveThemes((function(_this) {
          return function() {
            var variables;
            if (!_this.includeThemes) {
              return;
            }
            variables = _this.loadThemesVariables();
            return _this.variables.updatePathCollection(THEME_VARIABLES, variables);
          };
        })(this));
        this.subscriptions.add(this.themesSubscription);
        return this.variables.addMany(this.loadThemesVariables());
      } else {
        this.subscriptions.remove(this.themesSubscription);
        this.variables.deleteVariablesForPaths([THEME_VARIABLES]);
        return this.themesSubscription.dispose();
      }
    };

    ColorProject.prototype.getTimestamp = function() {
      return new Date();
    };

    ColorProject.prototype.serialize = function() {
      var data;
      data = {
        deserializer: 'ColorProject',
        timestamp: this.getTimestamp(),
        version: SERIALIZE_VERSION,
        markersVersion: SERIALIZE_MARKERS_VERSION,
        globalSourceNames: atom.config.get('pigments.sourceNames'),
        globalIgnoredNames: atom.config.get('pigments.ignoredNames')
      };
      if (this.ignoreGlobalSourceNames != null) {
        data.ignoreGlobalSourceNames = this.ignoreGlobalSourceNames;
      }
      if (this.ignoreGlobalSearchNames != null) {
        data.ignoreGlobalSearchNames = this.ignoreGlobalSearchNames;
      }
      if (this.ignoreGlobalIgnoredNames != null) {
        data.ignoreGlobalIgnoredNames = this.ignoreGlobalIgnoredNames;
      }
      if (this.ignoreGlobalIgnoredScopes != null) {
        data.ignoreGlobalIgnoredScopes = this.ignoreGlobalIgnoredScopes;
      }
      if (this.includeThemes != null) {
        data.includeThemes = this.includeThemes;
      }
      if (this.ignoredScopes != null) {
        data.ignoredScopes = this.ignoredScopes;
      }
      if (this.ignoredNames != null) {
        data.ignoredNames = this.ignoredNames;
      }
      if (this.sourceNames != null) {
        data.sourceNames = this.sourceNames;
      }
      if (this.searchNames != null) {
        data.searchNames = this.searchNames;
      }
      data.buffers = this.serializeBuffers();
      if (this.isInitialized()) {
        data.paths = this.paths;
        data.variables = this.variables.serialize();
      }
      return data;
    };

    ColorProject.prototype.serializeBuffers = function() {
      var colorBuffer, id, out, _ref2;
      out = {};
      _ref2 = this.colorBuffersByEditorId;
      for (id in _ref2) {
        colorBuffer = _ref2[id];
        out[id] = colorBuffer.serialize();
      }
      return out;
    };

    return ColorProject;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItcHJvamVjdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMlJBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLE9BQXdDLE9BQUEsQ0FBUSxNQUFSLENBQXhDLEVBQUMsZUFBQSxPQUFELEVBQVUsMkJBQUEsbUJBQVYsRUFBK0IsYUFBQSxLQUEvQixDQUFBOztBQUFBLEVBQ0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxXQUFSLENBRFosQ0FBQTs7QUFBQSxFQUdBLFFBQWlELE9BQUEsQ0FBUSxZQUFSLENBQWpELEVBQUMsMEJBQUEsaUJBQUQsRUFBb0Isa0NBQUEseUJBSHBCLENBQUE7O0FBQUEsRUFJQyxrQkFBbUIsT0FBQSxDQUFRLFFBQVIsRUFBbkIsZUFKRCxDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUxkLENBQUE7O0FBQUEsRUFNQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBTmYsQ0FBQTs7QUFBQSxFQU9BLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FQZCxDQUFBOztBQUFBLEVBUUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBUlYsQ0FBQTs7QUFBQSxFQVNBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FUZCxDQUFBOztBQUFBLEVBVUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQVZmLENBQUE7O0FBQUEsRUFXQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVIsQ0FYckIsQ0FBQTs7QUFBQSxFQVlBLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx3QkFBUixDQVp0QixDQUFBOztBQUFBLEVBY0EsY0FBQSxHQUFpQixDQUNmLFlBRGUsRUFFZixtQkFGZSxFQUdmLHNCQUhl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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/color-project.coffee
