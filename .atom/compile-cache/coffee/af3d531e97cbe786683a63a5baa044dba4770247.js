(function() {
  var VariableParser, VariableScanner, countLines;

  countLines = require('./utils').countLines;

  VariableParser = require('./variable-parser');

  module.exports = VariableScanner = (function() {
    function VariableScanner(params) {
      if (params == null) {
        params = {};
      }
      this.parser = params.parser, this.registry = params.registry;
      if (this.parser == null) {
        this.parser = new VariableParser(this.registry);
      }
    }

    VariableScanner.prototype.getRegExp = function() {
      return this.regexp != null ? this.regexp : this.regexp = new RegExp(this.registry.getRegExp(), 'gm');
    };

    VariableScanner.prototype.search = function(text, start) {
      var index, lastIndex, line, lineCountIndex, match, matchText, regexp, result, v, _i, _len;
      if (start == null) {
        start = 0;
      }
      regexp = this.getRegExp();
      regexp.lastIndex = start;
      while (match = regexp.exec(text)) {
        matchText = match[0];
        index = match.index;
        lastIndex = regexp.lastIndex;
        result = this.parser.parse(matchText);
        if (result != null) {
          result.lastIndex += index;
          if (result.length > 0) {
            result.range[0] += index;
            result.range[1] += index;
            line = -1;
            lineCountIndex = 0;
            for (_i = 0, _len = result.length; _i < _len; _i++) {
              v = result[_i];
              v.range[0] += index;
              v.range[1] += index;
              line = v.line = line + countLines(text.slice(lineCountIndex, +v.range[0] + 1 || 9e9));
              lineCountIndex = v.range[0];
            }
            return result;
          } else {
            regexp.lastIndex = result.lastIndex;
          }
        }
      }
      return void 0;
    };

    return VariableScanner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdmFyaWFibGUtc2Nhbm5lci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxTQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHlCQUFDLE1BQUQsR0FBQTs7UUFBQyxTQUFPO09BQ25CO0FBQUEsTUFBQyxJQUFDLENBQUEsZ0JBQUEsTUFBRixFQUFVLElBQUMsQ0FBQSxrQkFBQSxRQUFYLENBQUE7O1FBQ0EsSUFBQyxDQUFBLFNBQWMsSUFBQSxjQUFBLENBQWUsSUFBQyxDQUFBLFFBQWhCO09BRko7SUFBQSxDQUFiOztBQUFBLDhCQUlBLFNBQUEsR0FBVyxTQUFBLEdBQUE7bUNBQ1QsSUFBQyxDQUFBLFNBQUQsSUFBQyxDQUFBLFNBQWMsSUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLENBQUEsQ0FBUCxFQUE4QixJQUE5QixFQUROO0lBQUEsQ0FKWCxDQUFBOztBQUFBLDhCQU9BLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7QUFDTixVQUFBLHFGQUFBOztRQURhLFFBQU07T0FDbkI7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQVQsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLFNBQVAsR0FBbUIsS0FEbkIsQ0FBQTtBQUdBLGFBQU0sS0FBQSxHQUFRLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixDQUFkLEdBQUE7QUFDRSxRQUFDLFlBQWEsUUFBZCxDQUFBO0FBQUEsUUFDQyxRQUFTLE1BQVQsS0FERCxDQUFBO0FBQUEsUUFFQyxZQUFhLE9BQWIsU0FGRCxDQUFBO0FBQUEsUUFJQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLENBQWMsU0FBZCxDQUpULENBQUE7QUFNQSxRQUFBLElBQUcsY0FBSDtBQUNFLFVBQUEsTUFBTSxDQUFDLFNBQVAsSUFBb0IsS0FBcEIsQ0FBQTtBQUVBLFVBQUEsSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUFuQjtBQUNFLFlBQUEsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQWIsSUFBbUIsS0FBbkIsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQWIsSUFBbUIsS0FEbkIsQ0FBQTtBQUFBLFlBR0EsSUFBQSxHQUFPLENBQUEsQ0FIUCxDQUFBO0FBQUEsWUFJQSxjQUFBLEdBQWlCLENBSmpCLENBQUE7QUFNQSxpQkFBQSw2Q0FBQTs2QkFBQTtBQUNFLGNBQUEsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQVIsSUFBYyxLQUFkLENBQUE7QUFBQSxjQUNBLENBQUMsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFSLElBQWMsS0FEZCxDQUFBO0FBQUEsY0FFQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLElBQUYsR0FBUyxJQUFBLEdBQU8sVUFBQSxDQUFXLElBQUssOENBQWhCLENBRnZCLENBQUE7QUFBQSxjQUdBLGNBQUEsR0FBaUIsQ0FBQyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBSHpCLENBREY7QUFBQSxhQU5BO0FBWUEsbUJBQU8sTUFBUCxDQWJGO1dBQUEsTUFBQTtBQWVFLFlBQUEsTUFBTSxDQUFDLFNBQVAsR0FBbUIsTUFBTSxDQUFDLFNBQTFCLENBZkY7V0FIRjtTQVBGO01BQUEsQ0FIQTtBQThCQSxhQUFPLE1BQVAsQ0EvQk07SUFBQSxDQVBSLENBQUE7OzJCQUFBOztNQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/pigments/lib/variable-scanner.coffee
