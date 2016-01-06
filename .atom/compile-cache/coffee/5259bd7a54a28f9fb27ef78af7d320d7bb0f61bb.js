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
            _el.classList.add("" + _classPrefix + "-alpha");
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
        Body.element.add(this.element.el, 1);
        colorPicker.onOpen((function(_this) {
          return function() {
            return _this.element.updateRect();
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha, Saturation, _elementHeight, _elementWidth;
            Alpha = _this;
            Saturation = colorPicker.getExtension('Saturation');
            _elementWidth = _this.element.getWidth();
            _elementHeight = _this.element.getHeight();
            _this.canvas = {
              el: (function() {
                var _el;
                _el = document.createElement('canvas');
                _el.width = _elementWidth;
                _el.height = _elementHeight;
                _el.classList.add("" + Alpha.element.el.className + "-canvas");
                return _el;
              })(),
              context: null,
              getContext: function() {
                return this.context || (this.context = this.el.getContext('2d'));
              },
              previousRender: null,
              render: function(smartColor) {
                var _context, _gradient, _rgb;
                _rgb = ((function() {
                  if (!smartColor) {
                    return colorPicker.SmartColor.HEX('#f00');
                  } else {
                    return smartColor;
                  }
                })()).toRGBArray().join(',');
                if (this.previousRender && this.previousRender === _rgb) {
                  return;
                }
                _context = this.getContext();
                _context.clearRect(0, 0, _elementWidth, _elementHeight);
                _gradient = _context.createLinearGradient(0, 0, 1, _elementHeight);
                _gradient.addColorStop(.01, "rgba(" + _rgb + ",1)");
                _gradient.addColorStop(.99, "rgba(" + _rgb + ",0)");
                _context.fillStyle = _gradient;
                _context.fillRect(0, 0, _elementWidth, _elementHeight);
                return this.previousRender = _rgb;
              }
            };
            Saturation.onColorChanged(function(smartColor) {
              return _this.canvas.render(smartColor);
            });
            _this.canvas.render();
            return _this.element.add(_this.canvas.el);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha, Saturation, hasChild;
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
            Alpha = _this;
            Saturation = colorPicker.getExtension('Saturation');
            _this.control = {
              el: (function() {
                var _el;
                _el = document.createElement('div');
                _el.classList.add("" + Alpha.element.el.className + "-control");
                return _el;
              })(),
              isGrabbing: false,
              previousControlPosition: null,
              updateControlPosition: function(y) {
                var _joined;
                _joined = "," + y;
                if (this.previousControlPosition && this.previousControlPosition === _joined) {
                  return;
                }
                requestAnimationFrame((function(_this) {
                  return function() {
                    return _this.el.style.top = "" + y + "px";
                  };
                })(this));
                return this.previousControlPosition = _joined;
              },
              selection: {
                y: 0,
                color: null,
                alpha: null
              },
              setSelection: function(e, alpha, offset) {
                var _RGBAArray, _alpha, _height, _position, _rect, _smartColor, _width, _y;
                if (alpha == null) {
                  alpha = null;
                }
                if (offset == null) {
                  offset = null;
                }
                _rect = Alpha.element.getRect();
                _width = Alpha.element.getWidth();
                _height = Alpha.element.getHeight();
                if (e) {
                  _y = e.pageY - _rect.top;
                } else if (typeof alpha === 'number') {
                  _y = _height - (alpha * _height);
                } else if (typeof offset === 'number') {
                  _y = this.selection.y + offset;
                } else {
                  _y = this.selection.y;
                }
                _y = this.selection.y = Math.max(0, Math.min(_height, _y));
                _alpha = 1 - (_y / _height);
                this.selection.alpha = (Math.round(_alpha * 100)) / 100;
                if (_smartColor = this.selection.color) {
                  _RGBAArray = _smartColor.toRGBAArray();
                  _RGBAArray[3] = this.selection.alpha;
                  this.selection.color = colorPicker.SmartColor.RGBAArray(_RGBAArray);
                  Alpha.emitColorChanged();
                } else {
                  this.selection.color = colorPicker.SmartColor.RGBAArray([255, 0, 0, this.selection.alpha]);
                }
                _position = {
                  y: Math.max(3, Math.min(_height - 6, _y))
                };
                this.updateControlPosition(_position.y);
                return Alpha.emitSelectionChanged();
              },
              refreshSelection: function() {
                return this.setSelection();
              }
            };
            _this.control.refreshSelection();
            colorPicker.onInputColor(function(smartColor) {
              return _this.control.setSelection(null, smartColor.getAlpha());
            });
            colorPicker.onOpen(function() {
              return _this.control.isGrabbing = false;
            });
            colorPicker.onClose(function() {
              return _this.control.isGrabbing = false;
            });
            Saturation.onColorChanged(function(smartColor) {
              _this.control.selection.color = smartColor;
              return _this.control.refreshSelection();
            });
            colorPicker.onMouseDown(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Alpha.element.el, e.target))) {
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
            colorPicker.onMouseWheel(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Alpha.element.el, e.target))) {
                return;
              }
              e.preventDefault();
              return _this.control.setSelection(null, null, e.wheelDeltaY * .33);
            });
            return _this.element.add(_this.control.el);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvQWxwaGEuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0k7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRCxHQUFBO1dBQ2I7QUFBQSxNQUFBLE9BQUEsRUFBUyxDQUFDLE9BQUEsQ0FBUSxvQkFBUixDQUFELENBQUEsQ0FBQSxDQUFUO0FBQUEsTUFFQSxPQUFBLEVBQVMsSUFGVDtBQUFBLE1BR0EsT0FBQSxFQUFTLElBSFQ7QUFBQSxNQUlBLE1BQUEsRUFBUSxJQUpSO0FBQUEsTUFVQSxvQkFBQSxFQUFzQixTQUFBLEdBQUE7ZUFDbEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsa0JBQWQsRUFBa0MsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUEzQyxFQURrQjtNQUFBLENBVnRCO0FBQUEsTUFZQSxrQkFBQSxFQUFvQixTQUFDLFFBQUQsR0FBQTtlQUNoQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxRQUFoQyxFQURnQjtNQUFBLENBWnBCO0FBQUEsTUFnQkEsZ0JBQUEsRUFBa0IsU0FBQSxHQUFBO2VBQ2QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsY0FBZCxFQUE4QixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFqRCxFQURjO01BQUEsQ0FoQmxCO0FBQUEsTUFrQkEsY0FBQSxFQUFnQixTQUFDLFFBQUQsR0FBQTtlQUNaLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGNBQVosRUFBNEIsUUFBNUIsRUFEWTtNQUFBLENBbEJoQjtBQUFBLE1Bd0JBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FB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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/extensions/Alpha.coffee
