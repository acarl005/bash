(function() {
  var ColorMarkerElement, CompositeDisposable, Emitter, RENDERERS, SPEC_MODE, registerOrUpdateElement, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  registerOrUpdateElement = require('atom-utils').registerOrUpdateElement;

  SPEC_MODE = atom.inSpecMode();

  RENDERERS = {
    'background': require('./renderers/background'),
    'outline': require('./renderers/outline'),
    'underline': require('./renderers/underline'),
    'dot': require('./renderers/dot'),
    'square-dot': require('./renderers/square-dot')
  };

  ColorMarkerElement = (function(_super) {
    __extends(ColorMarkerElement, _super);

    function ColorMarkerElement() {
      return ColorMarkerElement.__super__.constructor.apply(this, arguments);
    }

    ColorMarkerElement.prototype.renderer = new RENDERERS.background;

    ColorMarkerElement.prototype.createdCallback = function() {
      this.emitter = new Emitter;
      return this.released = true;
    };

    ColorMarkerElement.prototype.attachedCallback = function() {};

    ColorMarkerElement.prototype.detachedCallback = function() {};

    ColorMarkerElement.prototype.onDidRelease = function(callback) {
      return this.emitter.on('did-release', callback);
    };

    ColorMarkerElement.prototype.setContainer = function(bufferElement) {
      this.bufferElement = bufferElement;
    };

    ColorMarkerElement.prototype.getModel = function() {
      return this.colorMarker;
    };

    ColorMarkerElement.prototype.setModel = function(colorMarker) {
      this.colorMarker = colorMarker;
      if (!this.released) {
        return;
      }
      this.released = false;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.colorMarker.marker.onDidDestroy((function(_this) {
        return function() {
          return _this.release();
        };
      })(this)));
      this.subscriptions.add(this.colorMarker.marker.onDidChange((function(_this) {
        return function(data) {
          var isValid;
          isValid = data.isValid;
          if (isValid) {
            return _this.bufferElement.requestMarkerUpdate([_this]);
          } else {
            return _this.release();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.markerType', (function(_this) {
        return function(type) {
          if (type !== 'gutter') {
            return _this.bufferElement.requestMarkerUpdate([_this]);
          }
        };
      })(this)));
      return this.render();
    };

    ColorMarkerElement.prototype.destroy = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.parentNode) != null) {
        _ref1.removeChild(this);
      }
      if ((_ref2 = this.subscriptions) != null) {
        _ref2.dispose();
      }
      return this.clear();
    };

    ColorMarkerElement.prototype.render = function() {
      var cls, k, region, regions, style, v, _i, _len, _ref1;
      if (this.colorMarker == null) {
        return;
      }
      if (this.colorMarker.marker.displayBuffer.isDestroyed()) {
        return;
      }
      this.innerHTML = '';
      _ref1 = this.renderer.render(this.colorMarker), style = _ref1.style, regions = _ref1.regions, cls = _ref1["class"];
      if ((regions != null ? regions.some(function(r) {
        return r.invalid;
      }) : void 0) && !SPEC_MODE) {
        return this.bufferElement.requestMarkerUpdate([this]);
      }
      if (regions != null) {
        for (_i = 0, _len = regions.length; _i < _len; _i++) {
          region = regions[_i];
          this.appendChild(region);
        }
      }
      if (cls != null) {
        this.className = cls;
      } else {
        this.className = '';
      }
      if (style != null) {
        for (k in style) {
          v = style[k];
          this.style[k] = v;
        }
      } else {
        this.style.cssText = '';
      }
      return this.lastMarkerScreenRange = this.colorMarker.getScreenRange();
    };

    ColorMarkerElement.prototype.checkScreenRange = function() {
      if (!((this.colorMarker != null) && (this.lastMarkerScreenRange != null))) {
        return;
      }
      if (!this.lastMarkerScreenRange.isEqual(this.colorMarker.getScreenRange())) {
        return this.render();
      }
    };

    ColorMarkerElement.prototype.isReleased = function() {
      return this.released;
    };

    ColorMarkerElement.prototype.release = function(dispatchEvent) {
      var marker;
      if (dispatchEvent == null) {
        dispatchEvent = true;
      }
      if (this.released) {
        return;
      }
      this.subscriptions.dispose();
      marker = this.colorMarker;
      this.clear();
      if (dispatchEvent) {
        return this.emitter.emit('did-release', {
          marker: marker,
          view: this
        });
      }
    };

    ColorMarkerElement.prototype.clear = function() {
      this.subscriptions = null;
      this.colorMarker = null;
      this.released = true;
      this.innerHTML = '';
      this.className = '';
      return this.style.cssText = '';
    };

    return ColorMarkerElement;

  })(HTMLElement);

  module.exports = ColorMarkerElement = registerOrUpdateElement('pigments-color-marker', ColorMarkerElement.prototype);

  ColorMarkerElement.setMarkerType = function(markerType) {
    if (markerType === 'gutter') {
      return;
    }
    return this.prototype.renderer = new RENDERERS[markerType];
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItbWFya2VyLWVsZW1lbnQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FBdEIsQ0FBQTs7QUFBQSxFQUNDLDBCQUEyQixPQUFBLENBQVEsWUFBUixFQUEzQix1QkFERCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FIWixDQUFBOztBQUFBLEVBSUEsU0FBQSxHQUNFO0FBQUEsSUFBQSxZQUFBLEVBQWMsT0FBQSxDQUFRLHdCQUFSLENBQWQ7QUFBQSxJQUNBLFNBQUEsRUFBVyxPQUFBLENBQVEscUJBQVIsQ0FEWDtBQUFBLElBRUEsV0FBQSxFQUFhLE9BQUEsQ0FBUSx1QkFBUixDQUZiO0FBQUEsSUFHQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGlCQUFSLENBSFA7QUFBQSxJQUlBLFlBQUEsRUFBYyxPQUFBLENBQVEsd0JBQVIsQ0FKZDtHQUxGLENBQUE7O0FBQUEsRUFXTTtBQUNKLHlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxpQ0FBQSxRQUFBLEdBQVUsR0FBQSxDQUFBLFNBQWEsQ0FBQyxVQUF4QixDQUFBOztBQUFBLGlDQUVBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBRkc7SUFBQSxDQUZqQixDQUFBOztBQUFBLGlDQU1BLGdCQUFBLEdBQWtCLFNBQUEsR0FBQSxDQU5sQixDQUFBOztBQUFBLGlDQVFBLGdCQUFB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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/color-marker-element.coffee
