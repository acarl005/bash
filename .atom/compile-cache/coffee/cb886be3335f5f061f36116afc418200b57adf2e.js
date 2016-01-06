(function() {
  var BackgroundRenderer, RegionRenderer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RegionRenderer = require('./region-renderer');

  module.exports = BackgroundRenderer = (function(_super) {
    __extends(BackgroundRenderer, _super);

    function BackgroundRenderer() {
      return BackgroundRenderer.__super__.constructor.apply(this, arguments);
    }

    BackgroundRenderer.prototype.includeTextInRegion = true;

    BackgroundRenderer.prototype.render = function(colorMarker) {
      var color, colorText, l, region, regions, _i, _len;
      color = colorMarker.color.toCSS();
      regions = this.renderRegions(colorMarker);
      l = colorMarker.color.luma;
      colorText = l > 0.43 ? 'black' : 'white';
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        region = regions[_i];
        this.styleRegion(region, color, colorText);
      }
      return {
        regions: regions
      };
    };

    BackgroundRenderer.prototype.styleRegion = function(region, color, textColor) {
      region.classList.add('background');
      region.style.backgroundColor = color;
      return region.style.color = textColor;
    };

    return BackgroundRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcmVuZGVyZXJzL2JhY2tncm91bmQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxtQkFBUixDQUFqQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxtQkFBQSxHQUFxQixJQUFyQixDQUFBOztBQUFBLGlDQUNBLE1BQUEsR0FBUSxTQUFDLFdBQUQsR0FBQTtBQUVOLFVBQUEsOENBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQWxCLENBQUEsQ0FBUixDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsSUFBQyxDQUFBLGFBQUQsQ0FBZSxXQUFmLENBRlYsQ0FBQTtBQUFBLE1BSUEsQ0FBQSxHQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFKdEIsQ0FBQTtBQUFBLE1BTUEsU0FBQSxHQUFlLENBQUEsR0FBSSxJQUFQLEdBQWlCLE9BQWpCLEdBQThCLE9BTjFDLENBQUE7QUFPQSxXQUFBLDhDQUFBOzZCQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsV0FBRCxDQUFhLE1BQWIsRUFBcUIsS0FBckIsRUFBNEIsU0FBNUIsQ0FBQSxDQUFBO0FBQUEsT0FQQTthQVFBO0FBQUEsUUFBQyxTQUFBLE9BQUQ7UUFWTTtJQUFBLENBRFIsQ0FBQTs7QUFBQSxpQ0FhQSxXQUFBLEdBQWEsU0FBQyxNQUFELEVBQVMsS0FBVCxFQUFnQixTQUFoQixHQUFBO0FBQ1gsTUFBQSxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQWpCLENBQXFCLFlBQXJCLENBQUEsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFiLEdBQStCLEtBRi9CLENBQUE7YUFHQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWIsR0FBcUIsVUFKVjtJQUFBLENBYmIsQ0FBQTs7OEJBQUE7O0tBRCtCLGVBSGpDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/pigments/lib/renderers/background.coffee
