(function() {
  var ColorMarker, CompositeDisposable, fill;

  CompositeDisposable = require('atom').CompositeDisposable;

  fill = require('./utils').fill;

  module.exports = ColorMarker = (function() {
    function ColorMarker(_arg) {
      this.marker = _arg.marker, this.color = _arg.color, this.text = _arg.text, this.invalid = _arg.invalid, this.colorBuffer = _arg.colorBuffer;
      this.id = this.marker.id;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.markerWasDestroyed();
        };
      })(this)));
      this.subscriptions.add(this.marker.onDidChange((function(_this) {
        return function() {
          if (_this.marker.isValid()) {
            _this.invalidateScreenRangeCache();
            return _this.checkMarkerScope();
          } else {
            return _this.destroy();
          }
        };
      })(this)));
      this.checkMarkerScope();
    }

    ColorMarker.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      return this.marker.destroy();
    };

    ColorMarker.prototype.markerWasDestroyed = function() {
      var _ref;
      if (this.destroyed) {
        return;
      }
      this.subscriptions.dispose();
      _ref = {}, this.marker = _ref.marker, this.color = _ref.color, this.text = _ref.text, this.colorBuffer = _ref.colorBuffer;
      return this.destroyed = true;
    };

    ColorMarker.prototype.match = function(properties) {
      var bool;
      if (this.destroyed) {
        return false;
      }
      bool = true;
      if (properties.bufferRange != null) {
        bool && (bool = this.marker.getBufferRange().isEqual(properties.bufferRange));
      }
      if (properties.color != null) {
        bool && (bool = properties.color.isEqual(this.color));
      }
      if (properties.match != null) {
        bool && (bool = properties.match === this.text);
      }
      if (properties.text != null) {
        bool && (bool = properties.text === this.text);
      }
      return bool;
    };

    ColorMarker.prototype.serialize = function() {
      var out;
      if (this.destroyed) {
        return;
      }
      out = {
        markerId: String(this.marker.id),
        bufferRange: this.marker.getBufferRange().serialize(),
        color: this.color.serialize(),
        text: this.text,
        variables: this.color.variables
      };
      if (!this.color.isValid()) {
        out.invalid = true;
      }
      return out;
    };

    ColorMarker.prototype.checkMarkerScope = function(forceEvaluation) {
      var e, range, scope, scopeChain;
      if (forceEvaluation == null) {
        forceEvaluation = false;
      }
      if (this.destroyed || (this.colorBuffer == null)) {
        return;
      }
      range = this.marker.getBufferRange();
      try {
        scope = this.marker.displayBuffer.scopeDescriptorForBufferPosition(range.start);
        scopeChain = scope.getScopeChain();
        if (!scopeChain || (!forceEvaluation && scopeChain === this.lastScopeChain)) {
          return;
        }
        this.ignored = this.colorBuffer.ignoredScopes.some(function(scopeRegExp) {
          return scopeChain.match(scopeRegExp);
        });
        return this.lastScopeChain = scopeChain;
      } catch (_error) {
        e = _error;
        return console.error(e);
      }
    };

    ColorMarker.prototype.isIgnored = function() {
      return this.ignored;
    };

    ColorMarker.prototype.getBufferRange = function() {
      return this.marker.getBufferRange();
    };

    ColorMarker.prototype.getScreenRange = function() {
      var _ref;
      return this.screenRangeCache != null ? this.screenRangeCache : this.screenRangeCache = (_ref = this.marker) != null ? _ref.getScreenRange() : void 0;
    };

    ColorMarker.prototype.invalidateScreenRangeCache = function() {
      return this.screenRangeCache = null;
    };

    ColorMarker.prototype.convertContentToHex = function() {
      var hex;
      hex = '#' + fill(this.color.hex, 6);
      return this.marker.displayBuffer.buffer.setTextInRange(this.marker.getBufferRange(), hex);
    };

    ColorMarker.prototype.convertContentToRGB = function() {
      var rgba;
      rgba = "rgb(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ")";
      return this.marker.displayBuffer.buffer.setTextInRange(this.marker.getBufferRange(), rgba);
    };

    ColorMarker.prototype.convertContentToRGBA = function() {
      var rgba;
      rgba = "rgba(" + (Math.round(this.color.red)) + ", " + (Math.round(this.color.green)) + ", " + (Math.round(this.color.blue)) + ", " + this.color.alpha + ")";
      return this.marker.displayBuffer.buffer.setTextInRange(this.marker.getBufferRange(), rgba);
    };

    return ColorMarker;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItbWFya2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsU0FBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHFCQUFDLElBQUQsR0FBQTtBQUNYLE1BRGEsSUFBQyxDQUFBLGNBQUEsUUFBUSxJQUFDLENBQUEsYUFBQSxPQUFPLElBQUMsQ0FBQSxZQUFBLE1BQU0sSUFBQyxDQUFBLGVBQUEsU0FBUyxJQUFDLENBQUEsbUJBQUEsV0FDaEQsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEVBQUQsR0FBTSxJQUFDLENBQUEsTUFBTSxDQUFDLEVBQWQsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGtCQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCLENBQW5CLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixDQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3JDLFVBQUEsSUFBRyxLQUFDLENBQUEs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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/color-marker.coffee
