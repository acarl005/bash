(function() {
  var OutlineRenderer, RegionRenderer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RegionRenderer = require('./region-renderer');

  module.exports = OutlineRenderer = (function(_super) {
    __extends(OutlineRenderer, _super);

    function OutlineRenderer() {
      return OutlineRenderer.__super__.constructor.apply(this, arguments);
    }

    OutlineRenderer.prototype.render = function(colorMarker) {
      var color, range, region, regions, rowSpan, _i, _len;
      range = colorMarker.getScreenRange();
      if (range.isEmpty()) {
        return [];
      }
      color = colorMarker.color.toCSS();
      rowSpan = range.end.row - range.start.row;
      regions = this.renderRegions(colorMarker);
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        region = regions[_i];
        this.styleRegion(region, color);
      }
      return {
        regions: regions
      };
    };

    OutlineRenderer.prototype.styleRegion = function(region, color) {
      region.classList.add('outline');
      return region.style.borderColor = color;
    };

    return OutlineRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcmVuZGVyZXJzL291dGxpbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSw4QkFBQSxNQUFBLEdBQVEsU0FBQyxXQUFELEdBQUE7QUFDTixVQUFBLGdEQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLGNBQVosQ0FBQSxDQUFSLENBQUE7QUFDQSxNQUFBLElBQWEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFiO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FEQTtBQUFBLE1BR0EsS0FBQSxHQUFRLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBbEIsQ0FBQSxDQUhSLENBQUE7QUFBQSxNQUtBLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVYsR0FBZ0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUx0QyxDQUFBO0FBQUEsTUFNQSxPQUFBLEdBQVUsSUFBQyxDQUFBLGFBQUQsQ0FBZSxXQUFmLENBTlYsQ0FBQTtBQVFBLFdBQUEsOENBQUE7NkJBQUE7QUFBQSxRQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQUFxQixLQUFyQixDQUFBLENBQUE7QUFBQSxPQVJBO2FBU0E7QUFBQSxRQUFDLFNBQUEsT0FBRDtRQVZNO0lBQUEsQ0FBUixDQUFBOztBQUFBLDhCQVlBLFdBQUEsR0FBYSxTQUFDLE1BQUQsRUFBUyxLQUFULEdBQUE7QUFDWCxNQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsU0FBckIsQ0FBQSxDQUFBO2FBQ0EsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFiLEdBQTJCLE1BRmhCO0lBQUEsQ0FaYixDQUFBOzsyQkFBQTs7S0FENEIsZUFIOUIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/pigments/lib/renderers/outline.coffee
