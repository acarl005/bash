(function() {
  var Color, ColorContext, ColorExpression, Emitter, VariablesCollection, nextId, registry,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Emitter = require('atom').Emitter;

  ColorContext = require('./color-context');

  ColorExpression = require('./color-expression');

  Color = require('./color');

  registry = require('./color-expressions');

  nextId = 0;

  module.exports = VariablesCollection = (function() {
    VariablesCollection.deserialize = function(state) {
      return new VariablesCollection(state);
    };

    Object.defineProperty(VariablesCollection.prototype, 'length', {
      get: function() {
        return this.variables.length;
      },
      enumerable: true
    });

    function VariablesCollection(state) {
      var v, _i, _len, _ref;
      this.emitter = new Emitter;
      this.variables = [];
      this.variableNames = [];
      this.colorVariables = [];
      this.variablesByPath = {};
      this.dependencyGraph = {};
      if ((state != null ? state.content : void 0) != null) {
        _ref = state.content;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          this.restoreVariable(v);
        }
      }
    }

    VariablesCollection.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    VariablesCollection.prototype.getVariables = function() {
      return this.variables.slice();
    };

    VariablesCollection.prototype.getNonColorVariables = function() {
      return this.getVariables().filter(function(v) {
        return !v.isColor;
      });
    };

    VariablesCollection.prototype.getVariablesForPath = function(path) {
      var _ref;
      return (_ref = this.variablesByPath[path]) != null ? _ref : [];
    };

    VariablesCollection.prototype.getVariableByName = function(name) {
      return this.collectVariablesByName([name]).pop();
    };

    VariablesCollection.prototype.getVariableById = function(id) {
      var v, _i, _len, _ref;
      _ref = this.variables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        if (v.id === id) {
          return v;
        }
      }
    };

    VariablesCollection.prototype.getVariablesForPaths = function(paths) {
      var p, res, _i, _len;
      res = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        p = paths[_i];
        if (p in this.variablesByPath) {
          res = res.concat(this.variablesByPath[p]);
        }
      }
      return res;
    };

    VariablesCollection.prototype.getColorVariables = function() {
      return this.colorVariables.slice();
    };

    VariablesCollection.prototype.find = function(properties) {
      var _ref;
      return (_ref = this.findAll(properties)) != null ? _ref[0] : void 0;
    };

    VariablesCollection.prototype.findAll = function(properties) {
      var keys;
      if (properties == null) {
        properties = {};
      }
      keys = Object.keys(properties);
      if (keys.length === 0) {
        return null;
      }
      return this.variables.filter(function(v) {
        return keys.every(function(k) {
          var a, b, _ref;
          if (((_ref = v[k]) != null ? _ref.isEqual : void 0) != null) {
            return v[k].isEqual(properties[k]);
          } else if (Array.isArray(b = properties[k])) {
            a = v[k];
            return a.length === b.length && a.every(function(value) {
              return __indexOf.call(b, value) >= 0;
            });
          } else {
            return v[k] === properties[k];
          }
        });
      });
    };

    VariablesCollection.prototype.updateCollection = function(collection, paths) {
      var created, destroyed, path, pathsCollection, pathsToDestroy, remainingPaths, results, updated, v, _i, _j, _k, _len, _len1, _len2, _name, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      pathsCollection = {};
      remainingPaths = [];
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        v = collection[_i];
        if (pathsCollection[_name = v.path] == null) {
          pathsCollection[_name] = [];
        }
        pathsCollection[v.path].push(v);
        if (_ref = v.path, __indexOf.call(remainingPaths, _ref) < 0) {
          remainingPaths.push(v.path);
        }
      }
      results = {
        created: [],
        destroyed: [],
        updated: []
      };
      for (path in pathsCollection) {
        collection = pathsCollection[path];
        _ref1 = this.updatePathCollection(path, collection, true) || {}, created = _ref1.created, updated = _ref1.updated, destroyed = _ref1.destroyed;
        if (created != null) {
          results.created = results.created.concat(created);
        }
        if (updated != null) {
          results.updated = results.updated.concat(updated);
        }
        if (destroyed != null) {
          results.destroyed = results.destroyed.concat(destroyed);
        }
      }
      if (paths != null) {
        pathsToDestroy = collection.length === 0 ? paths : paths.filter(function(p) {
          return __indexOf.call(remainingPaths, p) < 0;
        });
        for (_j = 0, _len1 = pathsToDestroy.length; _j < _len1; _j++) {
          path = pathsToDestroy[_j];
          _ref2 = this.updatePathCollection(path, collection, true) || {}, created = _ref2.created, updated = _ref2.updated, destroyed = _ref2.destroyed;
          if (created != null) {
            results.created = results.created.concat(created);
          }
          if (updated != null) {
            results.updated = results.updated.concat(updated);
          }
          if (destroyed != null) {
            results.destroyed = results.destroyed.concat(destroyed);
          }
        }
      }
      results = this.updateDependencies(results);
      if (((_ref3 = results.created) != null ? _ref3.length : void 0) === 0) {
        delete results.created;
      }
      if (((_ref4 = results.updated) != null ? _ref4.length : void 0) === 0) {
        delete results.updated;
      }
      if (((_ref5 = results.destroyed) != null ? _ref5.length : void 0) === 0) {
        delete results.destroyed;
      }
      if (results.destroyed != null) {
        _ref6 = results.destroyed;
        for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
          v = _ref6[_k];
          this.deleteVariableReferences(v);
        }
      }
      return this.emitChangeEvent(results);
    };

    VariablesCollection.prototype.updatePathCollection = function(path, collection, batch) {
      var destroyed, pathCollection, results, status, v, _i, _j, _len, _len1;
      if (batch == null) {
        batch = false;
      }
      pathCollection = this.variablesByPath[path] || [];
      results = this.addMany(collection, true);
      destroyed = [];
      for (_i = 0, _len = pathCollection.length; _i < _len; _i++) {
        v = pathCollection[_i];
        status = this.getVariableStatusInCollection(v, collection)[0];
        if (status === 'created') {
          destroyed.push(this.remove(v, true));
        }
      }
      if (destroyed.length > 0) {
        results.destroyed = destroyed;
      }
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (_j = 0, _len1 = destroyed.length; _j < _len1; _j++) {
          v = destroyed[_j];
          this.deleteVariableReferences(v);
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.add = function(variable, batch) {
      var previousVariable, status, _ref;
      if (batch == null) {
        batch = false;
      }
      _ref = this.getVariableStatus(variable), status = _ref[0], previousVariable = _ref[1];
      switch (status) {
        case 'moved':
          previousVariable.range = variable.range;
          previousVariable.bufferRange = variable.bufferRange;
          return void 0;
        case 'updated':
          return this.updateVariable(previousVariable, variable, batch);
        case 'created':
          return this.createVariable(variable, batch);
      }
    };

    VariablesCollection.prototype.addMany = function(variables, batch) {
      var res, results, status, v, variable, _i, _len;
      if (batch == null) {
        batch = false;
      }
      results = {};
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        res = this.add(variable, true);
        if (res != null) {
          status = res[0], v = res[1];
          if (results[status] == null) {
            results[status] = [];
          }
          results[status].push(v);
        }
      }
      if (batch) {
        return results;
      } else {
        return this.emitChangeEvent(this.updateDependencies(results));
      }
    };

    VariablesCollection.prototype.remove = function(variable, batch) {
      var results;
      if (batch == null) {
        batch = false;
      }
      variable = this.find(variable);
      if (variable == null) {
        return;
      }
      this.variables = this.variables.filter(function(v) {
        return v !== variable;
      });
      if (variable.isColor) {
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
      }
      if (batch) {
        return variable;
      } else {
        results = this.updateDependencies({
          destroyed: [variable]
        });
        this.deleteVariableReferences(variable);
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.removeMany = function(variables, batch) {
      var destroyed, results, v, variable, _i, _j, _len, _len1;
      if (batch == null) {
        batch = false;
      }
      destroyed = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        destroyed.push(this.remove(variable, true));
      }
      results = {
        destroyed: destroyed
      };
      if (batch) {
        return results;
      } else {
        results = this.updateDependencies(results);
        for (_j = 0, _len1 = destroyed.length; _j < _len1; _j++) {
          v = destroyed[_j];
          if (v != null) {
            this.deleteVariableReferences(v);
          }
        }
        return this.emitChangeEvent(results);
      }
    };

    VariablesCollection.prototype.deleteVariablesForPaths = function(paths) {
      return this.removeMany(this.getVariablesForPaths(paths));
    };

    VariablesCollection.prototype.deleteVariableReferences = function(variable) {
      var a, dependencies;
      dependencies = this.getVariableDependencies(variable);
      a = this.variablesByPath[variable.path];
      a.splice(a.indexOf(variable), 1);
      a = this.variableNames;
      a.splice(a.indexOf(variable.name), 1);
      this.removeDependencies(variable.name, dependencies);
      return delete this.dependencyGraph[variable.name];
    };

    VariablesCollection.prototype.getContext = function() {
      return new ColorContext({
        variables: this.variables,
        colorVariables: this.colorVariables,
        registry: registry
      });
    };

    VariablesCollection.prototype.evaluateVariables = function(variables) {
      var isColor, updated, v, wasColor, _i, _len;
      updated = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        v = variables[_i];
        wasColor = v.isColor;
        this.evaluateVariableColor(v, wasColor);
        isColor = v.isColor;
        if (isColor !== wasColor) {
          updated.push(v);
          if (isColor) {
            this.buildDependencyGraph(v);
          }
        }
      }
      if (updated.length > 0) {
        return this.emitChangeEvent(this.updateDependencies({
          updated: updated
        }));
      }
    };

    VariablesCollection.prototype.updateVariable = function(previousVariable, variable, batch) {
      var added, newDependencies, previousDependencies, removed, _ref;
      previousDependencies = this.getVariableDependencies(previousVariable);
      previousVariable.value = variable.value;
      previousVariable.range = variable.range;
      previousVariable.bufferRange = variable.bufferRange;
      this.evaluateVariableColor(previousVariable, previousVariable.isColor);
      newDependencies = this.getVariableDependencies(previousVariable);
      _ref = this.diffArrays(previousDependencies, newDependencies), removed = _ref.removed, added = _ref.added;
      this.removeDependencies(variable.name, removed);
      this.addDependencies(variable.name, added);
      if (batch) {
        return ['updated', previousVariable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          updated: [previousVariable]
        }));
      }
    };

    VariablesCollection.prototype.restoreVariable = function(variable) {
      var _base, _name;
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if (variable.isColor) {
        variable.color = new Color(variable.color);
        variable.color.variables = variable.variables;
        this.colorVariables.push(variable);
        delete variable.variables;
      }
      if ((_base = this.variablesByPath)[_name = variable.path] == null) {
        _base[_name] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      return this.buildDependencyGraph(variable);
    };

    VariablesCollection.prototype.createVariable = function(variable, batch) {
      var _base, _name;
      this.variableNames.push(variable.name);
      this.variables.push(variable);
      variable.id = nextId++;
      if ((_base = this.variablesByPath)[_name = variable.path] == null) {
        _base[_name] = [];
      }
      this.variablesByPath[variable.path].push(variable);
      this.evaluateVariableColor(variable);
      this.buildDependencyGraph(variable);
      if (batch) {
        return ['created', variable];
      } else {
        return this.emitChangeEvent(this.updateDependencies({
          created: [variable]
        }));
      }
    };

    VariablesCollection.prototype.evaluateVariableColor = function(variable, wasColor) {
      var color, context;
      if (wasColor == null) {
        wasColor = false;
      }
      context = this.getContext();
      color = context.readColor(variable.value, true);
      if (color != null) {
        if (wasColor && color.isEqual(variable.color)) {
          return false;
        }
        variable.color = color;
        variable.isColor = true;
        if (__indexOf.call(this.colorVariables, variable) < 0) {
          this.colorVariables.push(variable);
        }
        return true;
      } else if (wasColor) {
        delete variable.color;
        variable.isColor = false;
        this.colorVariables = this.colorVariables.filter(function(v) {
          return v !== variable;
        });
        return true;
      }
    };

    VariablesCollection.prototype.getVariableStatus = function(variable) {
      if (this.variablesByPath[variable.path] == null) {
        return ['created', variable];
      }
      return this.getVariableStatusInCollection(variable, this.variablesByPath[variable.path]);
    };

    VariablesCollection.prototype.getVariableStatusInCollection = function(variable, collection) {
      var status, v, _i, _len;
      for (_i = 0, _len = collection.length; _i < _len; _i++) {
        v = collection[_i];
        status = this.compareVariables(v, variable);
        switch (status) {
          case 'identical':
            return ['unchanged', v];
          case 'move':
            return ['moved', v];
          case 'update':
            return ['updated', v];
        }
      }
      return ['created', variable];
    };

    VariablesCollection.prototype.compareVariables = function(v1, v2) {
      var sameLine, sameName, sameRange, sameValue;
      sameName = v1.name === v2.name;
      sameValue = v1.value === v2.value;
      sameLine = v1.line === v2.line;
      sameRange = v1.range[0] === v2.range[0] && v1.range[1] === v2.range[1];
      if ((v1.bufferRange != null) && (v2.bufferRange != null)) {
        sameRange && (sameRange = v1.bufferRange.isEqual(v2.bufferRange));
      }
      if (sameName && sameValue) {
        if (sameRange) {
          return 'identical';
        } else {
          return 'move';
        }
      } else if (sameName) {
        if (sameRange || sameLine) {
          return 'update';
        } else {
          return 'different';
        }
      }
    };

    VariablesCollection.prototype.buildDependencyGraph = function(variable) {
      var a, dependencies, dependency, _base, _i, _len, _ref, _results;
      dependencies = this.getVariableDependencies(variable);
      _results = [];
      for (_i = 0, _len = dependencies.length; _i < _len; _i++) {
        dependency = dependencies[_i];
        a = (_base = this.dependencyGraph)[dependency] != null ? _base[dependency] : _base[dependency] = [];
        if (_ref = variable.name, __indexOf.call(a, _ref) < 0) {
          _results.push(a.push(variable.name));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    VariablesCollection.prototype.getVariableDependencies = function(variable) {
      var dependencies, v, variables, _i, _len, _ref, _ref1, _ref2;
      dependencies = [];
      if (_ref = variable.value, __indexOf.call(this.variableNames, _ref) >= 0) {
        dependencies.push(variable.value);
      }
      if (((_ref1 = variable.color) != null ? (_ref2 = _ref1.variables) != null ? _ref2.length : void 0 : void 0) > 0) {
        variables = variable.color.variables;
        for (_i = 0, _len = variables.length; _i < _len; _i++) {
          v = variables[_i];
          if (__indexOf.call(dependencies, v) < 0) {
            dependencies.push(v);
          }
        }
      }
      return dependencies;
    };

    VariablesCollection.prototype.collectVariablesByName = function(names) {
      var v, variables, _i, _len, _ref, _ref1;
      variables = [];
      _ref = this.variables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        if (_ref1 = v.name, __indexOf.call(names, _ref1) >= 0) {
          variables.push(v);
        }
      }
      return variables;
    };

    VariablesCollection.prototype.removeDependencies = function(from, to) {
      var dependencies, v, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = to.length; _i < _len; _i++) {
        v = to[_i];
        if (dependencies = this.dependencyGraph[v]) {
          dependencies.splice(dependencies.indexOf(from), 1);
          if (dependencies.length === 0) {
            _results.push(delete this.dependencyGraph[v]);
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    VariablesCollection.prototype.addDependencies = function(from, to) {
      var v, _base, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = to.length; _i < _len; _i++) {
        v = to[_i];
        if ((_base = this.dependencyGraph)[v] == null) {
          _base[v] = [];
        }
        _results.push(this.dependencyGraph[v].push(from));
      }
      return _results;
    };

    VariablesCollection.prototype.updateDependencies = function(_arg) {
      var created, createdVariableNames, dependencies, destroyed, dirtyVariableNames, dirtyVariables, name, updated, variable, variables, _i, _j, _k, _len, _len1, _len2;
      created = _arg.created, updated = _arg.updated, destroyed = _arg.destroyed;
      this.updateColorVariablesExpression();
      variables = [];
      dirtyVariableNames = [];
      if (created != null) {
        variables = variables.concat(created);
        createdVariableNames = created.map(function(v) {
          return v.name;
        });
      } else {
        createdVariableNames = [];
      }
      if (updated != null) {
        variables = variables.concat(updated);
      }
      if (destroyed != null) {
        variables = variables.concat(destroyed);
      }
      variables = variables.filter(function(v) {
        return v != null;
      });
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        variable = variables[_i];
        if (dependencies = this.dependencyGraph[variable.name]) {
          for (_j = 0, _len1 = dependencies.length; _j < _len1; _j++) {
            name = dependencies[_j];
            if (__indexOf.call(dirtyVariableNames, name) < 0 && __indexOf.call(createdVariableNames, name) < 0) {
              dirtyVariableNames.push(name);
            }
          }
        }
      }
      dirtyVariables = this.collectVariablesByName(dirtyVariableNames);
      for (_k = 0, _len2 = dirtyVariables.length; _k < _len2; _k++) {
        variable = dirtyVariables[_k];
        if (this.evaluateVariableColor(variable, variable.isColor)) {
          if (updated == null) {
            updated = [];
          }
          updated.push(variable);
        }
      }
      return {
        created: created,
        destroyed: destroyed,
        updated: updated
      };
    };

    VariablesCollection.prototype.emitChangeEvent = function(_arg) {
      var created, destroyed, updated;
      created = _arg.created, destroyed = _arg.destroyed, updated = _arg.updated;
      if ((created != null ? created.length : void 0) || (destroyed != null ? destroyed.length : void 0) || (updated != null ? updated.length : void 0)) {
        this.updateColorVariablesExpression();
        return this.emitter.emit('did-change', {
          created: created,
          destroyed: destroyed,
          updated: updated
        });
      }
    };

    VariablesCollection.prototype.updateColorVariablesExpression = function() {
      var colorVariables;
      colorVariables = this.getColorVariables();
      if (colorVariables.length > 0) {
        return registry.addExpression(ColorExpression.colorExpressionForColorVariables(colorVariables));
      } else {
        return registry.removeExpression('pigments:variables');
      }
    };

    VariablesCollection.prototype.diffArrays = function(a, b) {
      var added, removed, v, _i, _j, _len, _len1;
      removed = [];
      added = [];
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        v = a[_i];
        if (__indexOf.call(b, v) < 0) {
          removed.push(v);
        }
      }
      for (_j = 0, _len1 = b.length; _j < _len1; _j++) {
        v = b[_j];
        if (__indexOf.call(a, v) < 0) {
          added.push(v);
        }
      }
      return {
        removed: removed,
        added: added
      };
    };

    VariablesCollection.prototype.serialize = function() {
      return {
        deserializer: 'VariablesCollection',
        content: this.variables.map(function(v) {
          var res;
          res = {
            name: v.name,
            value: v.value,
            path: v.path,
            range: v.range,
            line: v.line
          };
          if (v.isColor) {
            res.isColor = true;
            res.color = v.color.serialize();
            if (v.color.variables != null) {
              res.variables = v.color.variables;
            }
          }
          return res;
        })
      };
    };

    return VariablesCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdmFyaWFibGVzLWNvbGxlY3Rpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9GQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUZsQixDQUFBOztBQUFBLEVBR0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBSFIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEscUJBQVIsQ0FKWCxDQUFBOztBQUFBLEVBTUEsTUFBQSxHQUFTLENBTlQsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLG1CQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQSxtQkFBQSxDQUFvQixLQUFwQixFQURRO0lBQUEsQ0FBZCxDQUFBOztBQUFBLElBR0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsbUJBQUMsQ0FBQSxTQUF2QixFQUFrQyxRQUFsQyxFQUE0QztBQUFBLE1BQzFDLEdBQUEsRUFBSyxTQUFBLEdBQUE7ZUFBRyxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQWQ7TUFBQSxDQURxQztBQUFBLE1BRTFDLFVBQUEsRUFBWSxJQUY4QjtLQUE1QyxDQUhBLENBQUE7O0FBUWEsSUFBQSw2QkFBQyxLQUFELEdBQUE7QUFDWCxVQUFBLGlCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdB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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/variables-collection.coffee
