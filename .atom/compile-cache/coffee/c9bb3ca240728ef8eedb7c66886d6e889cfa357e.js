(function() {
  var decimal, float, int, namePrefixes, percent, variables;

  int = '\\d+';

  decimal = "\\." + int;

  float = "(?:" + int + decimal + "|" + int + "|" + decimal + ")";

  percent = "" + float + "%";

  variables = '(?:@[a-zA-Z0-9\\-_]+|\\$[a-zA-Z0-9\\-_]+|[a-zA-Z_][a-zA-Z0-9\\-_]*)';

  namePrefixes = '^| |\\t|:|=|,|\\n|\'|"|\\(|\\[|\\{';

  module.exports = {
    int: int,
    float: float,
    percent: percent,
    optionalPercent: "" + float + "%?",
    intOrPercent: "(?:" + percent + "|" + int + ")",
    floatOrPercent: "(?:" + percent + "|" + float + ")",
    comma: '\\s*,\\s*',
    notQuote: "[^\"'\\n]+",
    hexadecimal: '[\\da-fA-F]',
    ps: '\\(\\s*',
    pe: '\\s*\\)',
    variables: variables,
    namePrefixes: namePrefixes,
    createVariableRegExpString: function(variables) {
      var v, variableNames, _i, _len;
      variableNames = [];
      for (_i = 0, _len = variables.length; _i < _len; _i++) {
        v = variables[_i];
        variableNames.push(v.name.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
      }
      variableNames = variableNames.join('|');
      return "(?:" + namePrefixes + ")(" + variableNames + ")(?!_|-|\\w|\\d|[ \\t]*[\\.:=])";
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcmVnZXhlcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscURBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sTUFBTixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFXLEtBQUEsR0FBSyxHQURoQixDQUFBOztBQUFBLEVBRUEsS0FBQSxHQUFTLEtBQUEsR0FBSyxHQUFMLEdBQVcsT0FBWCxHQUFtQixHQUFuQixHQUFzQixHQUF0QixHQUEwQixHQUExQixHQUE2QixPQUE3QixHQUFxQyxHQUY5QyxDQUFBOztBQUFBLEVBR0EsT0FBQSxHQUFVLEVBQUEsR0FBRyxLQUFILEdBQVMsR0FIbkIsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxxRUFKWixDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLG9DQUxmLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxHQUFBLEVBQUssR0FBTDtBQUFBLElBQ0EsS0FBQSxFQUFPLEtBRFA7QUFBQSxJQUVBLE9BQUEsRUFBUyxPQUZUO0FBQUEsSUFHQSxlQUFBLEVBQWlCLEVBQUEsR0FBRyxLQUFILEdBQVMsSUFIMUI7QUFBQSxJQUlBLFlBQUEsRUFBZSxLQUFBLEdBQUssT0FBTCxHQUFhLEdBQWIsR0FBZ0IsR0FBaEIsR0FBb0IsR0FKbkM7QUFBQSxJQUtBLGNBQUEsRUFBaUIsS0FBQSxHQUFLLE9BQUwsR0FBYSxHQUFiLEdBQWdCLEtBQWhCLEdBQXNCLEdBTHZDO0FBQUEsSUFNQSxLQUFBLEVBQU8sV0FOUDtBQUFBLElBT0EsUUFBQSxFQUFVLFlBUFY7QUFBQSxJQVFBLFdBQUEsRUFBYSxhQVJiO0FBQUEsSUFTQSxFQUFBLEVBQUksU0FUSjtBQUFBLElBVUEsRUFBQSxFQUFJLFNBVko7QUFBQSxJQVdBLFNBQUEsRUFBVyxTQVhYO0FBQUEsSUFZQSxZQUFBLEVBQWMsWUFaZDtBQUFBLElBYUEsMEJBQUEsRUFBNEIsU0FBQyxTQUFELEdBQUE7QUFDMUIsVUFBQSwwQkFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixFQUFoQixDQUFBO0FBQ0EsV0FBQSxnREFBQTswQkFBQTtBQUNFLFFBQUEsYUFBYSxDQUFDLElBQWQsQ0FBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFQLENBQWUsb0NBQWYsRUFBcUQsTUFBckQsQ0FBbkIsQ0FBQSxDQURGO0FBQUEsT0FEQTtBQUFBLE1BR0EsYUFBQSxHQUFnQixhQUFhLENBQUMsSUFBZCxDQUFtQixHQUFuQixDQUhoQixDQUFBO2FBS0MsS0FBQSxHQUFLLFlBQUwsR0FBa0IsSUFBbEIsR0FBc0IsYUFBdEIsR0FBb0Msa0NBTlg7SUFBQSxDQWI1QjtHQVJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/pigments/lib/regexes.coffee
