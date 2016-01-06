(function() {
  var RegionRenderer, UnderlineRenderer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  RegionRenderer = require('./region-renderer');

  module.exports = UnderlineRenderer = (function(_super) {
    __extends(UnderlineRenderer, _super);

    function UnderlineRenderer() {
      return UnderlineRenderer.__super__.constructor.apply(this, arguments);
    }

    UnderlineRenderer.prototype.render = function(colorMarker) {
      var color, region, regions, _i, _len;
      color = colorMarker.color.toCSS();
      regions = this.renderRegions(colorMarker);
      for (_i = 0, _len = regions.length; _i < _len; _i++) {
        region = regions[_i];
        this.styleRegion(region, color);
      }
      return {
        regions: regions
      };
    };

    UnderlineRenderer.prototype.styleRegion = function(region, color) {
      region.classList.add('underline');
      return region.style.backgroundColor = color;
    };

    return UnderlineRenderer;

  })(RegionRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcmVuZGVyZXJzL3VuZGVybGluZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBQWpCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osd0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGdDQUFBLE1BQUEsR0FBUSxTQUFDLFdBQUQsR0FBQTtBQUNOLFVBQUEsZ0NBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQWxCLENBQUEsQ0FBUixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsSUFBQyxDQUFBLGFBQUQsQ0FBZSxXQUFmLENBRFYsQ0FBQTtBQUdBLFdBQUEsOENBQUE7NkJBQUE7QUFBQSxRQUFBLElBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQUFxQixLQUFyQixDQUFBLENBQUE7QUFBQSxPQUhBO2FBSUE7QUFBQSxRQUFDLFNBQUEsT0FBRDtRQUxNO0lBQUEsQ0FBUixDQUFBOztBQUFBLGdDQU9BLFdBQUEsR0FBYSxTQUFDLE1BQUQsRUFBUyxLQUFULEdBQUE7QUFDWCxNQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsV0FBckIsQ0FBQSxDQUFBO2FBRUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxlQUFiLEdBQStCLE1BSHBCO0lBQUEsQ0FQYixDQUFBOzs2QkFBQTs7S0FEOEIsZUFIaEMsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/pigments/lib/renderers/underline.coffee
