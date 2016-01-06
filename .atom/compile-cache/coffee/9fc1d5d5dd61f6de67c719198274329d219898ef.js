(function() {
  var ExpressionsRegistry, VariableExpression, registry;

  ExpressionsRegistry = require('./expressions-registry');

  VariableExpression = require('./variable-expression');

  module.exports = registry = new ExpressionsRegistry(VariableExpression);

  registry.createExpression('pigments:less', '^[ \\t]*(@[a-zA-Z0-9\\-_]+)\\s*:\\s*([^;\\n]+);?', ['*']);

  registry.createExpression('pigments:scss_params', '^[ \\t]*@(mixin|include|function)\\s+[a-zA-Z0-9\\-_]+\\s*\\([^\\)]+\\)', ['*'], function(match, solver) {
    match = match[0];
    return solver.endParsing(match.length - 1);
  });

  registry.createExpression('pigments:scss', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+)\\s*:\\s*(.*?)(\\s*!default)?;', ['*']);

  registry.createExpression('pigments:sass', '^[ \\t]*(\\$[a-zA-Z0-9\\-_]+):\\s*([^\\{]*?)(\\s*!default)?$', ['*']);

  registry.createExpression('pigments:stylus_hash', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=\\s*\\{([^=]*)\\}', ['*'], function(match, solver) {
    var buffer, char, commaSensitiveBegin, commaSensitiveEnd, content, current, inCommaSensitiveContext, key, name, scope, scopeBegin, scopeEnd, value, _i, _len, _ref, _ref1;
    buffer = '';
    _ref = match, match = _ref[0], name = _ref[1], content = _ref[2];
    current = match.indexOf(content);
    scope = [name];
    scopeBegin = /\{/;
    scopeEnd = /\}/;
    commaSensitiveBegin = /\(|\[/;
    commaSensitiveEnd = /\)|\]/;
    inCommaSensitiveContext = false;
    for (_i = 0, _len = content.length; _i < _len; _i++) {
      char = content[_i];
      if (scopeBegin.test(char)) {
        scope.push(buffer.replace(/[\s:]/g, ''));
        buffer = '';
      } else if (scopeEnd.test(char)) {
        scope.pop();
        if (scope.length === 0) {
          return solver.endParsing(current);
        }
      } else if (commaSensitiveBegin.test(char)) {
        buffer += char;
        inCommaSensitiveContext = true;
      } else if (inCommaSensitiveContext) {
        buffer += char;
        inCommaSensitiveContext = !commaSensitiveEnd.test(char);
      } else if (/[,\n]/.test(char)) {
        buffer = buffer.replace(/\s+/g, '');
        if (buffer.length) {
          _ref1 = buffer.split(/\s*:\s*/), key = _ref1[0], value = _ref1[1];
          solver.appendResult([scope.concat(key).join('.'), value, current - buffer.length - 1, current]);
        }
        buffer = '';
      } else {
        buffer += char;
      }
      current++;
    }
    scope.pop();
    if (scope.length === 0) {
      return solver.endParsing(current + 1);
    } else {
      return solver.abortParsing();
    }
  });

  registry.createExpression('pigments:stylus', '^[ \\t]*([a-zA-Z_$][a-zA-Z0-9\\-_]*)\\s*=(?!=)\\s*([^\\n;]*);?$', ['*']);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdmFyaWFibGUtZXhwcmVzc2lvbnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBOztBQUFBLEVBQUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHdCQUFSLENBQXRCLENBQUE7O0FBQUEsRUFDQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsdUJBQVIsQ0FEckIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFFBQUEsR0FBZSxJQUFBLG1CQUFBLENBQW9CLGtCQUFwQixDQUhoQyxDQUFBOztBQUFBLEVBS0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLGVBQTFCLEVBQTJDLGtEQUEzQyxFQUErRixDQUFDLEdBQUQsQ0FBL0YsQ0FMQSxDQUFBOztBQUFBLEVBUUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLHNCQUExQixFQUFrRCx3RUFBbEQsRUFBNEgsQ0FBQyxHQUFELENBQTVILEVBQW1JLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNqSSxJQUFDLFFBQVMsUUFBVixDQUFBO1dBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFqQyxFQUZpSTtFQUFBLENBQW5JLENBUkEsQ0FBQTs7QUFBQSxFQVlBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixlQUExQixFQUEyQyw2REFBM0MsRUFBMEcsQ0FBQyxHQUFELENBQTFHLENBWkEsQ0FBQTs7QUFBQSxFQWNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixlQUExQixFQUEyQyw4REFBM0MsRUFBMkcsQ0FBQyxHQUFELENBQTNHLENBZEEsQ0FBQTs7QUFBQSxFQWdCQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsc0JBQTFCLEVBQWtELDREQUFsRCxFQUFnSCxDQUFDLEdBQUQsQ0FBaEgsRUFBdUgsU0FBQyxLQUFELEVBQVEsTUFBUixHQUFBO0FBQ3JILFFBQUEscUtBQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFBQSxJQUNBLE9BQXlCLEtBQXpCLEVBQUMsZUFBRCxFQUFRLGNBQVIsRUFBYyxpQkFEZCxDQUFBO0FBQUEsSUFFQSxPQUFBLEdBQVUsS0FBSyxDQUFDLE9BQU4sQ0FBYyxPQUFkLENBRlYsQ0FBQTtBQUFBLElBR0EsS0FBQSxHQUFRLENBQUMsSUFBRCxDQUhSLENBQUE7QUFBQSxJQUlBLFVBQUEsR0FBYSxJQUpiLENBQUE7QUFBQSxJQUtBLFFBQUEsR0FBVyxJQUxYLENBQUE7QUFBQSxJQU1BLG1CQUFBLEdBQXNCLE9BTnRCLENBQUE7QUFBQSxJQU9BLGlCQUFBLEdBQW9CLE9BUHBCLENBQUE7QUFBQSxJQVFBLHVCQUFBLEdBQTBCLEtBUjFCLENBQUE7QUFTQSxTQUFBLDhDQUFBO3lCQUFBO0FBQ0UsTUFBQSxJQUFHLFVBQVUsQ0FBQyxJQUFYLENBQWdCLElBQWhCLENBQUg7QUFDRSxRQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBZSxRQUFmLEVBQXlCLEVBQXpCLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsRUFEVCxDQURGO09BQUEsTUFHSyxJQUFHLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBZCxDQUFIO0FBQ0gsUUFBQSxLQUFLLENBQUMsR0FBTixDQUFBLENBQUEsQ0FBQTtBQUNBLFFBQUEsSUFBcUMsS0FBSyxDQUFDLE1BQU4sS0FBZ0IsQ0FBckQ7QUFBQSxpQkFBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUFQLENBQUE7U0FGRztPQUFBLE1BR0EsSUFBRyxtQkFBbUIsQ0FBQyxJQUFwQixDQUF5QixJQUF6QixDQUFIO0FBQ0gsUUFBQSxNQUFBLElBQVUsSUFBVixDQUFBO0FBQUEsUUFDQSx1QkFBQSxHQUEwQixJQUQxQixDQURHO09BQUEsTUFHQSxJQUFHLHVCQUFIO0FBQ0gsUUFBQSxNQUFBLElBQVUsSUFBVixDQUFBO0FBQUEsUUFDQSx1QkFBQSxHQUEwQixDQUFBLGlCQUFrQixDQUFDLElBQWxCLENBQXVCLElBQXZCLENBRDNCLENBREc7T0FBQSxNQUdBLElBQUcsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQUg7QUFDSCxRQUFBLE1BQUEsR0FBUyxNQUFNLENBQUMsT0FBUCxDQUFlLE1BQWYsRUFBdUIsRUFBdkIsQ0FBVCxDQUFBO0FBQ0EsUUFBQSxJQUFHLE1BQU0sQ0FBQyxNQUFWO0FBQ0UsVUFBQSxRQUFlLE1BQU0sQ0FBQyxLQUFQLENBQWEsU0FBYixDQUFmLEVBQUMsY0FBRCxFQUFNLGdCQUFOLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLENBQ2xCLEtBQUssQ0FBQyxNQUFOLENBQWEsR0FBYixDQUFpQixDQUFDLElBQWxCLENBQXVCLEdBQXZCLENBRGtCLEVBRWxCLEtBRmtCLEVBR2xCLE9BQUEsR0FBVSxNQUFNLENBQUMsTUFBakIsR0FBMEIsQ0FIUixFQUlsQixPQUprQixDQUFwQixDQUZBLENBREY7U0FEQTtBQUFBLFFBV0EsTUFBQSxHQUFTLEVBWFQsQ0FERztPQUFBLE1BQUE7QUFjSCxRQUFBLE1BQUEsSUFBVSxJQUFWLENBZEc7T0FaTDtBQUFBLE1BNEJBLE9BQUEsRUE1QkEsQ0FERjtBQUFBLEtBVEE7QUFBQSxJQXdDQSxLQUFLLENBQUMsR0FBTixDQUFBLENBeENBLENBQUE7QUF5Q0EsSUFBQSxJQUFHLEtBQUssQ0FBQyxNQUFOLEtBQWdCLENBQW5CO2FBQ0UsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBQSxHQUFVLENBQTVCLEVBREY7S0FBQSxNQUFBO2FBR0UsTUFBTSxDQUFDLFlBQVAsQ0FBQSxFQUhGO0tBMUNxSDtFQUFBLENBQXZILENBaEJBLENBQUE7O0FBQUEsRUErREEsUUFBUSxDQUFDLGdCQUFULENBQTBCLGlCQUExQixFQUE2QyxpRUFBN0MsRUFBZ0gsQ0FBQyxHQUFELENBQWhILENBL0RBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/pigments/lib/variable-expressions.coffee
