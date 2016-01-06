(function() {
  var ColorExpression, Emitter, ExpressionsRegistry, vm,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Emitter = require('atom').Emitter;

  ColorExpression = require('./color-expression');

  vm = require('vm');

  module.exports = ExpressionsRegistry = (function() {
    ExpressionsRegistry.deserialize = function(serializedData, expressionsType) {
      var data, handle, name, registry, _ref;
      registry = new ExpressionsRegistry(expressionsType);
      _ref = serializedData.expressions;
      for (name in _ref) {
        data = _ref[name];
        handle = vm.runInNewContext(data.handle.replace('function', "handle = function"));
        registry.createExpression(name, data.regexpString, data.priority, data.scopes, handle);
      }
      registry.regexpString = serializedData.regexpString;
      return registry;
    };

    function ExpressionsRegistry(expressionsType) {
      this.expressionsType = expressionsType;
      this.colorExpressions = {};
      this.emitter = new Emitter;
    }

    ExpressionsRegistry.prototype.dispose = function() {
      return this.emitter.dispose();
    };

    ExpressionsRegistry.prototype.onDidAddExpression = function(callback) {
      return this.emitter.on('did-add-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidRemoveExpression = function(callback) {
      return this.emitter.on('did-remove-expression', callback);
    };

    ExpressionsRegistry.prototype.onDidUpdateExpressions = function(callback) {
      return this.emitter.on('did-update-expressions', callback);
    };

    ExpressionsRegistry.prototype.getExpressions = function() {
      var e, k;
      return ((function() {
        var _ref, _results;
        _ref = this.colorExpressions;
        _results = [];
        for (k in _ref) {
          e = _ref[k];
          _results.push(e);
        }
        return _results;
      }).call(this)).sort(function(a, b) {
        return b.priority - a.priority;
      });
    };

    ExpressionsRegistry.prototype.getExpressionsForScope = function(scope) {
      var expressions;
      expressions = this.getExpressions();
      if (scope === '*') {
        return expressions;
      }
      return expressions.filter(function(e) {
        return __indexOf.call(e.scopes, '*') >= 0 || __indexOf.call(e.scopes, scope) >= 0;
      });
    };

    ExpressionsRegistry.prototype.getExpression = function(name) {
      return this.colorExpressions[name];
    };

    ExpressionsRegistry.prototype.getRegExp = function() {
      return this.regexpString != null ? this.regexpString : this.regexpString = this.getExpressions().map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.getRegExpForScope = function(scope) {
      return this.regexpString != null ? this.regexpString : this.regexpString = this.getExpressionsForScope(scope).map(function(e) {
        return "(" + e.regexpString + ")";
      }).join('|');
    };

    ExpressionsRegistry.prototype.createExpression = function(name, regexpString, priority, scopes, handle) {
      var newExpression;
      if (priority == null) {
        priority = 0;
      }
      if (scopes == null) {
        scopes = ['*'];
      }
      if (typeof priority === 'function') {
        handle = priority;
        scopes = ['*'];
        priority = 0;
      } else if (typeof priority === 'object') {
        if (typeof scopes === 'function') {
          handle = scopes;
        }
        scopes = priority;
        priority = 0;
      }
      newExpression = new this.expressionsType({
        name: name,
        regexpString: regexpString,
        scopes: scopes,
        priority: priority,
        handle: handle
      });
      return this.addExpression(newExpression);
    };

    ExpressionsRegistry.prototype.addExpression = function(expression, batch) {
      if (batch == null) {
        batch = false;
      }
      delete this.regexpString;
      this.colorExpressions[expression.name] = expression;
      if (!batch) {
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
        this.emitter.emit('did-update-expressions', {
          name: expression.name,
          registry: this
        });
      }
      return expression;
    };

    ExpressionsRegistry.prototype.createExpressions = function(expressions) {
      return this.addExpressions(expressions.map((function(_this) {
        return function(e) {
          var expression, handle, name, priority, regexpString, scopes;
          name = e.name, regexpString = e.regexpString, handle = e.handle, priority = e.priority, scopes = e.scopes;
          if (priority == null) {
            priority = 0;
          }
          expression = new _this.expressionsType({
            name: name,
            regexpString: regexpString,
            scopes: scopes,
            handle: handle
          });
          expression.priority = priority;
          return expression;
        };
      })(this)));
    };

    ExpressionsRegistry.prototype.addExpressions = function(expressions) {
      var expression, _i, _len;
      for (_i = 0, _len = expressions.length; _i < _len; _i++) {
        expression = expressions[_i];
        this.addExpression(expression, true);
        this.emitter.emit('did-add-expression', {
          name: expression.name,
          registry: this
        });
      }
      return this.emitter.emit('did-update-expressions', {
        registry: this
      });
    };

    ExpressionsRegistry.prototype.removeExpression = function(name) {
      delete this.regexpString;
      delete this.colorExpressions[name];
      this.emitter.emit('did-remove-expression', {
        name: name,
        registry: this
      });
      return this.emitter.emit('did-update-expressions', {
        name: name,
        registry: this
      });
    };

    ExpressionsRegistry.prototype.serialize = function() {
      var expression, key, out, _ref, _ref1;
      out = {
        regexpString: this.getRegExp(),
        expressions: {}
      };
      _ref = this.colorExpressions;
      for (key in _ref) {
        expression = _ref[key];
        out.expressions[key] = {
          name: expression.name,
          regexpString: expression.regexpString,
          priority: expression.priority,
          scopes: expression.scopes,
          handle: (_ref1 = expression.handle) != null ? _ref1.toString() : void 0
        };
      }
      return out;
    };

    return ExpressionsRegistry;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvZXhwcmVzc2lvbnMtcmVnaXN0cnkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxtQkFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLGNBQUQsRUFBaUIsZUFBakIsR0FBQTtBQUNaLFVBQUEsa0NBQUE7QUFBQSxNQUFBLFFBQUEsR0FBZSxJQUFBLG1CQUFBLENBQW9CLGVBQXBCLENBQWYsQ0FBQTtBQUVBO0FBQUEsV0FBQSxZQUFBOzBCQUFBO0FBQ0UsUUFBQSxNQUFBLEdBQVMsRUFBRSxDQUFDLGVBQUgsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLFVBQXBCLEVBQWdDLG1CQUFoQyxDQUFuQixDQUFULENBQUE7QUFBQSxRQUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixJQUExQixFQUFnQyxJQUFJLENBQUMsWUFBckMsRUFBbUQsSUFBSSxDQUFDLFFBQXhELEVBQWtFLElBQUksQ0FBQyxNQUF2RSxFQUErRSxNQUEvRSxDQURBLENBREY7QUFBQSxPQUZBO0FBQUEsTUFNQSxRQUFRLENBQUMsWUFBVCxHQUF3QixjQUFjLENBQUMsWUFOdkMsQ0FBQTthQVFBLFNBVFk7SUFBQSxDQUFkLENBQUE7O0FBWWEsSUFBQSw2QkFBRSxlQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxr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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/expressions-registry.coffee
