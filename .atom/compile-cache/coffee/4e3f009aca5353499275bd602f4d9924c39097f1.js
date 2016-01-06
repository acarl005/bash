(function() {
  var Color, ColorExpression, createVariableRegExpString;

  Color = require('./color');

  createVariableRegExpString = require('./regexes').createVariableRegExpString;

  module.exports = ColorExpression = (function() {
    ColorExpression.colorExpressionForContext = function(context) {
      return this.colorExpressionForColorVariables(context.getColorVariables());
    };

    ColorExpression.colorExpressionRegexpForColorVariables = function(colorVariables) {
      return createVariableRegExpString(colorVariables);
    };

    ColorExpression.colorExpressionForColorVariables = function(colorVariables) {
      var paletteRegexpString;
      paletteRegexpString = this.colorExpressionRegexpForColorVariables(colorVariables);
      return new ColorExpression({
        name: 'pigments:variables',
        regexpString: paletteRegexpString,
        scopes: ['*'],
        priority: 1,
        handle: function(match, expression, context) {
          var baseColor, name, _;
          _ = match[0], name = match[1];
          if (context.readColorExpression(name) === name) {
            return this.invalid = true;
          }
          baseColor = context.readColor(name);
          this.colorExpression = name;
          this.variables = baseColor != null ? baseColor.variables : void 0;
          if (context.isInvalid(baseColor)) {
            return this.invalid = true;
          }
          return this.rgba = baseColor.rgba;
        }
      });
    };

    function ColorExpression(_arg) {
      this.name = _arg.name, this.regexpString = _arg.regexpString, this.scopes = _arg.scopes, this.priority = _arg.priority, this.handle = _arg.handle;
      this.regexp = new RegExp("^" + this.regexpString + "$");
    }

    ColorExpression.prototype.match = function(expression) {
      return this.regexp.test(expression);
    };

    ColorExpression.prototype.parse = function(expression, context) {
      var color;
      if (!this.match(expression)) {
        return null;
      }
      color = new Color();
      color.colorExpression = expression;
      this.handle.call(color, this.regexp.exec(expression), expression, context);
      return color;
    };

    ColorExpression.prototype.search = function(text, start) {
      var lastIndex, match, range, re, results, _ref;
      if (start == null) {
        start = 0;
      }
      results = void 0;
      re = new RegExp(this.regexpString, 'g');
      re.lastIndex = start;
      if (_ref = re.exec(text), match = _ref[0], _ref) {
        lastIndex = re.lastIndex;
        range = [lastIndex - match.length, lastIndex];
        results = {
          range: range,
          match: text.slice(range[0], range[1])
        };
      }
      return results;
    };

    return ColorExpression;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItZXhwcmVzc2lvbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0RBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0MsNkJBQThCLE9BQUEsQ0FBUSxXQUFSLEVBQTlCLDBCQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxlQUFDLENBQUEseUJBQUQsR0FBNEIsU0FBQyxPQUFELEdBQUE7YUFDMUIsSUFBQyxDQUFBLGdDQUFELENBQWtDLE9BQU8sQ0FBQyxpQkFBUixDQUFBLENBQWxDLEVBRDBCO0lBQUEsQ0FBNUIsQ0FBQTs7QUFBQSxJQUdBLGVBQUMsQ0FBQSxzQ0FBRCxHQUF5QyxTQUFDLGNBQUQsR0FBQTthQUN2QywwQkFBQSxDQUEyQixjQUEzQixFQUR1QztJQUFBLENBSHpDLENBQUE7O0FBQUEsSUFNQSxlQUFDLENBQUEsZ0NBQUQsR0FBbUMsU0FBQyxjQUFELEdBQUE7QUFDakMsVUFBQSxtQkFBQTtBQUFBLE1BQUEsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLHNDQUFELENBQXdDLGNBQXhDLENBQXRCLENBQUE7YUFFSSxJQUFBLGVBQUEsQ0FDRjtBQUFBLFFBQUEsSUFBQSxFQUFNLG9CQUFOO0FBQUEsUUFDQSxZQUFBLEVBQWMsbUJBRGQ7QUFBQSxRQUVBLE1BQUEsRUFBUSxDQUFDLEdBQUQsQ0FGUjtBQUFBLFFBR0EsUUFBQSxFQUFVLENBSFY7QUFBQSxRQUlBLE1BQUEsRUFBUSxTQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW9CLE9BQXBCLEdBQUE7QUFDTixjQUFBLGtCQUFBO0FBQUEsVUFBQyxZQUFELEVBQUcsZUFBSCxDQUFBO0FB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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/color-expression.coffee
