(function() {
  var Palette;

  module.exports = Palette = (function() {
    function Palette(variables) {
      this.variables = variables != null ? variables : [];
    }

    Palette.prototype.sortedByColor = function() {
      return this.variables.slice().sort((function(_this) {
        return function(_arg, _arg1) {
          var a, b;
          a = _arg.color;
          b = _arg1.color;
          return _this.compareColors(a, b);
        };
      })(this));
    };

    Palette.prototype.sortedByName = function() {
      var collator;
      collator = new Intl.Collator("en-US", {
        numeric: true
      });
      return this.variables.slice().sort(function(_arg, _arg1) {
        var a, b;
        a = _arg.name;
        b = _arg1.name;
        return collator.compare(a, b);
      });
    };

    Palette.prototype.getColorsNames = function() {
      return this.variables.map(function(v) {
        return v.name;
      });
    };

    Palette.prototype.getColorsCount = function() {
      return this.variables.length;
    };

    Palette.prototype.eachColor = function(iterator) {
      var v, _i, _len, _ref, _results;
      _ref = this.variables;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _results.push(iterator(v));
      }
      return _results;
    };

    Palette.prototype.compareColors = function(a, b) {
      var aHue, aLightness, aSaturation, bHue, bLightness, bSaturation, _ref, _ref1;
      _ref = a.hsl, aHue = _ref[0], aSaturation = _ref[1], aLightness = _ref[2];
      _ref1 = b.hsl, bHue = _ref1[0], bSaturation = _ref1[1], bLightness = _ref1[2];
      if (aHue < bHue) {
        return -1;
      } else if (aHue > bHue) {
        return 1;
      } else if (aSaturation < bSaturation) {
        return -1;
      } else if (aSaturation > bSaturation) {
        return 1;
      } else if (aLightness < bLightness) {
        return -1;
      } else if (aLightness > bLightness) {
        return 1;
      } else {
        return 0;
      }
    };

    return Palette;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGFsZXR0ZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsT0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLGlCQUFFLFNBQUYsR0FBQTtBQUFpQixNQUFoQixJQUFDLENBQUEsZ0NBQUEsWUFBVSxFQUFLLENBQWpCO0lBQUEsQ0FBYjs7QUFBQSxzQkFFQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQ2IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLENBQUEsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEVBQVksS0FBWixHQUFBO0FBQTBCLGNBQUEsSUFBQTtBQUFBLFVBQWxCLElBQVAsS0FBQyxLQUF3QixDQUFBO0FBQUEsVUFBUCxJQUFQLE1BQUMsS0FBYSxDQUFBO2lCQUFBLEtBQUMsQ0FBQSxhQUFELENBQWUsQ0FBZixFQUFpQixDQUFqQixFQUExQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCLEVBRGE7SUFBQSxDQUZmLENBQUE7O0FBQUEsc0JBS0EsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFlLElBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxPQUFkLEVBQXVCO0FBQUEsUUFBQSxPQUFBLEVBQVMsSUFBVDtPQUF2QixDQUFmLENBQUE7YUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLEtBQVgsQ0FBQSxDQUFrQixDQUFDLElBQW5CLENBQXdCLFNBQUMsSUFBRCxFQUFXLEtBQVgsR0FBQTtBQUF3QixZQUFBLElBQUE7QUFBQSxRQUFqQixJQUFOLEtBQUMsSUFBc0IsQ0FBQTtBQUFBLFFBQVAsSUFBTixNQUFDLElBQVksQ0FBQTtlQUFBLFFBQVEsQ0FBQyxPQUFULENBQWlCLENBQWpCLEVBQW1CLENBQW5CLEVBQXhCO01BQUEsQ0FBeEIsRUFGWTtJQUFBLENBTGQsQ0FBQTs7QUFBQSxzQkFTQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFNBQUMsQ0FBRCxHQUFBO2VBQU8sQ0FBQyxDQUFDLEtBQVQ7TUFBQSxDQUFmLEVBQUg7SUFBQSxDQVRoQixDQUFBOztBQUFBLHNCQVdBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFNBQVMsQ0FBQyxPQUFkO0lBQUEsQ0FYaEIsQ0FBQTs7QUFBQSxzQkFhQSxTQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFBYyxVQUFBLDJCQUFBO0FBQUE7QUFBQTtXQUFBLDJDQUFBO3FCQUFBO0FBQUEsc0JBQUEsUUFBQSxDQUFTLENBQVQsRUFBQSxDQUFBO0FBQUE7c0JBQWQ7SUFBQSxDQWJYLENBQUE7O0FBQUEsc0JBZUEsYUFBQSxHQUFlLFNBQUMsQ0FBRCxFQUFHLENBQUgsR0FBQTtBQUNiLFVBQUEseUVBQUE7QUFBQSxNQUFBLE9BQWtDLENBQUMsQ0FBQyxHQUFwQyxFQUFDLGNBQUQsRUFBTyxxQkFBUCxFQUFvQixvQkFBcEIsQ0FBQTtBQUFBLE1BQ0EsUUFBa0MsQ0FBQyxDQUFDLEdBQXBDLEVBQUMsZUFBRCxFQUFPLHNCQUFQLEVBQW9CLHFCQURwQixDQUFBO0FBRUEsTUFBQSxJQUFHLElBQUEsR0FBTyxJQUFWO2VBQ0UsQ0FBQSxFQURGO09BQUEsTUFFSyxJQUFHLElBQUEsR0FBTyxJQUFWO2VBQ0gsRUFERztPQUFBLE1BRUEsSUFBRyxXQUFBLEdBQWMsV0FBakI7ZUFDSCxDQUFBLEVBREc7T0FBQSxNQUVBLElBQUcsV0FBQSxHQUFjLFdBQWpCO2VBQ0gsRUFERztPQUFBLE1BRUEsSUFBRyxVQUFBLEdBQWEsVUFBaEI7ZUFDSCxDQUFBLEVBREc7T0FBQSxNQUVBLElBQUcsVUFBQSxHQUFhLFVBQWhCO2VBQ0gsRUFERztPQUFBLE1BQUE7ZUFHSCxFQUhHO09BYlE7SUFBQSxDQWZmLENBQUE7O21CQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/pigments/lib/palette.coffee
