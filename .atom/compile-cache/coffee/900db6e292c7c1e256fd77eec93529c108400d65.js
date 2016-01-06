(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      control: null,
      canvas: null,
      emitSelectionChanged: function() {
        return this.Emitter.emit('selectionChanged', this.control.selection);
      },
      onSelectionChanged: function(callback) {
        return this.Emitter.on('selectionChanged', callback);
      },
      emitColorChanged: function() {
        return this.Emitter.emit('colorChanged', this.control.selection.color);
      },
      onColorChanged: function(callback) {
        return this.Emitter.on('colorChanged', callback);
      },
      activate: function() {
        var Body;
        Body = colorPicker.getExtension('Body');
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = Body.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-saturation");
            return _el;
          })(),
          width: 0,
          height: 0,
          getWidth: function() {
            return this.width || this.el.offsetWidth;
          },
          getHeight: function() {
            return this.height || this.el.offsetHeight;
          },
          rect: null,
          getRect: function() {
            return this.rect || this.updateRect();
          },
          updateRect: function() {
            return this.rect = this.el.getClientRects()[0];
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        Body.element.add(this.element.el, 0);
        colorPicker.onOpen((function(_this) {
          return function() {
            var _rect;
            if (!(_this.element.updateRect() && (_rect = _this.element.getRect()))) {
              return;
            }
            _this.width = _rect.width;
            return _this.height = _rect.height;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, Saturation, _elementHeight, _elementWidth;
            Saturation = _this;
            Hue = colorPicker.getExtension('Hue');
            _elementWidth = _this.element.getWidth();
            _elementHeight = _this.element.getHeight();
            _this.canvas = {
              el: (function() {
                var _el;
                _el = document.createElement('canvas');
                _el.width = _elementWidth;
                _el.height = _elementHeight;
                _el.classList.add("" + Saturation.element.el.className + "-canvas");
                return _el;
              })(),
              context: null,
              getContext: function() {
                return this.context || (this.context = this.el.getContext('2d'));
              },
              getColorAtPosition: function(x, y) {
                return colorPicker.SmartColor.HSVArray([Hue.getHue(), x / Saturation.element.getWidth() * 100, 100 - (y / Saturation.element.getHeight() * 100)]);
              },
              previousRender: null,
              render: function(smartColor) {
                var _context, _gradient, _hslArray, _joined;
                _hslArray = ((function() {
                  if (!smartColor) {
                    return colorPicker.SmartColor.HEX('#f00');
                  } else {
                    return smartColor;
                  }
                })()).toHSLArray();
                _joined = _hslArray.join(',');
                if (this.previousRender && this.previousRender === _joined) {
                  return;
                }
                _context = this.getContext();
                _context.clearRect(0, 0, _elementWidth, _elementHeight);
                _gradient = _context.createLinearGradient(0, 0, _elementWidth, 1);
                _gradient.addColorStop(.01, 'hsl(0,100%,100%)');
                _gradient.addColorStop(.99, "hsl(" + _hslArray[0] + ",100%,50%)");
                _context.fillStyle = _gradient;
                _context.fillRect(0, 0, _elementWidth, _elementHeight);
                _gradient = _context.createLinearGradient(0, 0, 1, _elementHeight);
                _gradient.addColorStop(.01, 'rgba(0,0,0,0)');
                _gradient.addColorStop(.99, 'rgba(0,0,0,1)');
                _context.fillStyle = _gradient;
                _context.fillRect(0, 0, _elementWidth, _elementHeight);
                return this.previousRender = _joined;
              }
            };
            Hue.onColorChanged(function(smartColor) {
              return _this.canvas.render(smartColor);
            });
            _this.canvas.render();
            return _this.element.add(_this.canvas.el);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, Saturation, hasChild;
            hasChild = function(element, child) {
              var _parent;
              if (child && (_parent = child.parentNode)) {
                if (child === element) {
                  return true;
                } else {
                  return hasChild(element, _parent);
                }
              }
              return false;
            };
            Saturation = _this;
            Hue = colorPicker.getExtension('Hue');
            _this.control = {
              el: (function() {
                var _el;
                _el = document.createElement('div');
                _el.classList.add("" + Saturation.element.el.className + "-control");
                return _el;
              })(),
              isGrabbing: false,
              previousControlPosition: null,
              updateControlPosition: function(x, y) {
                var _joined;
                _joined = "" + x + "," + y;
                if (this.previousControlPosition && this.previousControlPosition === _joined) {
                  return;
                }
                requestAnimationFrame((function(_this) {
                  return function() {
                    _this.el.style.left = "" + x + "px";
                    return _this.el.style.top = "" + y + "px";
                  };
                })(this));
                return this.previousControlPosition = _joined;
              },
              selection: {
                x: null,
                y: 0,
                color: null
              },
              setSelection: function(e, saturation, key) {
                var _height, _position, _rect, _width, _x, _y;
                if (saturation == null) {
                  saturation = null;
                }
                if (key == null) {
                  key = null;
                }
                if (!(Saturation.canvas && (_rect = Saturation.element.getRect()))) {
                  return;
                }
                _width = Saturation.element.getWidth();
                _height = Saturation.element.getHeight();
                if (e) {
                  _x = e.pageX - _rect.left;
                  _y = e.pageY - _rect.top;
                } else if ((typeof saturation === 'number') && (typeof key === 'number')) {
                  _x = _width * saturation;
                  _y = _height * key;
                } else {
                  if (typeof this.selection.x !== 'number') {
                    this.selection.x = _width;
                  }
                  _x = this.selection.x;
                  _y = this.selection.y;
                }
                _x = this.selection.x = Math.max(0, Math.min(_width, Math.round(_x)));
                _y = this.selection.y = Math.max(0, Math.min(_height, Math.round(_y)));
                _position = {
                  x: Math.max(6, Math.min(_width - 7, _x)),
                  y: Math.max(6, Math.min(_height - 7, _y))
                };
                this.selection.color = Saturation.canvas.getColorAtPosition(_x, _y);
                this.updateControlPosition(_position.x, _position.y);
                return Saturation.emitSelectionChanged();
              },
              refreshSelection: function() {
                return this.setSelection();
              }
            };
            _this.control.refreshSelection();
            colorPicker.onInputColor(function(smartColor) {
              var h, s, v, _ref;
              _ref = smartColor.toHSVArray(), h = _ref[0], s = _ref[1], v = _ref[2];
              return _this.control.setSelection(null, s, 1 - v);
            });
            Saturation.onSelectionChanged(function() {
              return Saturation.emitColorChanged();
            });
            colorPicker.onOpen(function() {
              return _this.control.refreshSelection();
            });
            colorPicker.onOpen(function() {
              return _this.control.isGrabbing = false;
            });
            colorPicker.onClose(function() {
              return _this.control.isGrabbing = false;
            });
            Hue.onColorChanged(function() {
              return _this.control.refreshSelection();
            });
            colorPicker.onMouseDown(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Saturation.element.el, e.target))) {
                return;
              }
              e.preventDefault();
              _this.control.isGrabbing = true;
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseMove(function(e) {
              if (!_this.control.isGrabbing) {
                return;
              }
              return _this.control.setSelection(e);
            });
            colorPicker.onMouseUp(function(e) {
              if (!_this.control.isGrabbing) {
                return;
              }
              _this.control.isGrabbing = false;
              return _this.control.setSelection(e);
            });
            return _this.element.add(_this.control.el);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvU2F0dXJhdGlvbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFLSTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxXQUFELEdBQUE7V0FDYjtBQUFBLE1BQUEsT0FBQSxFQUFTLENBQUMsT0FBQSxDQUFRLG9CQUFSLENBQUQsQ0FBQSxDQUFBLENBQVQ7QUFBQSxNQUVBLE9BQUEsRUFBUyxJQUZUO0FBQUEsTUFHQSxPQUFBLEVBQVMsSUFIVDtBQUFBLE1BSUEsTUFBQSxFQUFRLElBSlI7QUFBQSxNQVVBLG9CQUFBLEVBQXNCLFNBQUEsR0FBQTtlQUNsQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxrQkFBZCxFQUFrQyxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQTNDLEVBRGtCO01BQUEsQ0FWdEI7QUFBQSxNQVlBLGtCQUFBLEVBQW9CLFNBQUMsUUFBRCxHQUFBO2VBQ2hCLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGtCQUFaLEVBQWdDLFFBQWhDLEVBRGdCO01BQUEsQ0FacEI7QUFBQSxNQWdCQSxnQkFBQSxFQUFrQixTQUFBLEdBQUE7ZUFDZCxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxjQUFkLEVBQThCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQWpELEVBRGM7TUFBQSxDQWhCbEI7QUFBQSxNQWtCQSxjQUFBLEVBQWdCLFNBQUMsUUFBRCxHQUFBO2VBQ1osSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksY0FBWixFQUE0QixRQUE1QixFQURZO01BQUEsQ0FsQmhCO0FBQUEsTUF3QkEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNOLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFB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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/extensions/Saturation.coffee
