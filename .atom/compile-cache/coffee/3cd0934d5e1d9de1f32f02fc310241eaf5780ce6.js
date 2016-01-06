(function() {
  var DotRenderer, SquareDotRenderer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  DotRenderer = require('./dot');

  module.exports = SquareDotRenderer = (function(_super) {
    __extends(SquareDotRenderer, _super);

    function SquareDotRenderer() {
      return SquareDotRenderer.__super__.constructor.apply(this, arguments);
    }

    SquareDotRenderer.prototype.render = function(colorMarker) {
      var properties;
      properties = SquareDotRenderer.__super__.render.apply(this, arguments);
      properties["class"] += ' square';
      return properties;
    };

    return SquareDotRenderer;

  })(DotRenderer);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcmVuZGVyZXJzL3NxdWFyZS1kb3QuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLE9BQVIsQ0FBZCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxnQ0FBQSxNQUFBLEdBQVEsU0FBQyxXQUFELEdBQUE7QUFDTixVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSwrQ0FBQSxTQUFBLENBQWIsQ0FBQTtBQUFBLE1BQ0EsVUFBVSxDQUFDLE9BQUQsQ0FBVixJQUFvQixTQURwQixDQUFBO2FBRUEsV0FITTtJQUFBLENBQVIsQ0FBQTs7NkJBQUE7O0tBRDhCLFlBSGhDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/pigments/lib/renderers/square-dot.coffee
