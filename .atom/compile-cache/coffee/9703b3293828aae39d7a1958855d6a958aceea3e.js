(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      control: null,
      canvas: null,
      getHue: function() {
        if ((this.control && this.control.selection) && this.element) {
          return this.control.selection.y / this.element.getHeight() * 360;
        } else {
          return 0;
        }
      },
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
            _el.classList.add("" + _classPrefix + "-hue");
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
        Body.element.add(this.element.el, 2);
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
            var Hue, _context, _elementHeight, _elementWidth, _gradient, _hex, _hexes, _i, _j, _len, _step;
            Hue = _this;
            _elementWidth = _this.element.getWidth();
            _elementHeight = _this.element.getHeight();
            _hexes = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00'];
            _this.canvas = {
              el: (function() {
                var _el;
                _el = document.createElement('canvas');
                _el.width = _elementWidth;
                _el.height = _elementHeight;
                _el.classList.add("" + Hue.element.el.className + "-canvas");
                return _el;
              })(),
              context: null,
              getContext: function() {
                return this.context || (this.context = this.el.getContext('2d'));
              },
              getColorAtPosition: function(y) {
                return colorPicker.SmartColor.HSVArray([y / Hue.element.getHeight() * 360, 100, 100]);
              }
            };
            _context = _this.canvas.getContext();
            _step = 1 / (_hexes.length - 1);
            _gradient = _context.createLinearGradient(0, 0, 1, _elementHeight);
            for (_i = _j = 0, _len = _hexes.length; _j < _len; _i = ++_j) {
              _hex = _hexes[_i];
              _gradient.addColorStop(_step * _i, _hex);
            }
            _context.fillStyle = _gradient;
            _context.fillRect(0, 0, _elementWidth, _elementHeight);
            return _this.element.add(_this.canvas.el);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Hue, hasChild;
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
            Hue = _this;
            _this.control = {
              el: (function() {
                var _el;
                _el = document.createElement('div');
                _el.classList.add("" + Hue.element.el.className + "-control");
                return _el;
              })(),
              isGrabbing: false,
              selection: {
                y: 0,
                color: null
              },
              setSelection: function(e, y, offset) {
                var _height, _position, _rect, _width, _y;
                if (y == null) {
                  y = null;
                }
                if (offset == null) {
                  offset = null;
                }
                if (!(Hue.canvas && (_rect = Hue.element.getRect()))) {
                  return;
                }
                _width = Hue.element.getWidth();
                _height = Hue.element.getHeight();
                if (e) {
                  _y = e.pageY - _rect.top;
                } else if (typeof y === 'number') {
                  _y = y;
                } else if (typeof offset === 'number') {
                  _y = this.selection.y + offset;
                } else {
                  _y = this.selection.y;
                }
                _y = this.selection.y = Math.max(0, Math.min(_height, _y));
                this.selection.color = Hue.canvas.getColorAtPosition(_y);
                _position = {
                  y: Math.max(3, Math.min(_height - 6, _y))
                };
                requestAnimationFrame((function(_this) {
                  return function() {
                    return _this.el.style.top = "" + _position.y + "px";
                  };
                })(this));
                return Hue.emitSelectionChanged();
              },
              refreshSelection: function() {
                return this.setSelection();
              }
            };
            _this.control.refreshSelection();
            colorPicker.onInputColor(function(smartColor) {
              var _hue;
              _hue = smartColor.toHSVArray()[0];
              return _this.control.setSelection(null, (_this.element.getHeight() / 360) * _hue);
            });
            Hue.onSelectionChanged(function() {
              return Hue.emitColorChanged();
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
            colorPicker.onMouseDown(function(e, isOnPicker) {
              if (!(isOnPicker && hasChild(Hue.element.el, e.target))) {
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
              if (!(isOnPicker && hasChild(Hue.element.el, e.target))) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvSHVlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUtJO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFdBQUQsR0FBQTtXQUNiO0FBQUEsTUFBQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsb0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0FBVDtBQUFBLE1BRUEsT0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLE9BQUEsRUFBUyxJQUhUO0FBQUEsTUFJQSxNQUFBLEVBQVEsSUFKUjtBQUFBLE1BU0EsTUFBQSxFQUFRLFNBQUEsR0FBQTtBQUNKLFFBQUEsSUFBRyxDQUFDLElBQUMsQ0FBQSxPQUFELElBQWEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUF2QixDQUFBLElBQXNDLElBQUMsQ0FBQSxPQUExQztBQUNJLGlCQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQW5CLEdBQXVCLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxDQUFBLENBQXZCLEdBQThDLEdBQXJELENBREo7U0FBQSxNQUFBO0FBRUssaUJBQU8sQ0FBUCxDQUZMO1NBREk7TUFBQSxDQVRSO0FBQUEsTUFrQkEsb0JBQUEsRUFBc0IsU0FBQSxHQUFBO2VBQ2xCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGtCQUFkLEVBQWtDLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBM0MsRUFEa0I7TUFBQSxDQWxCdEI7QUFBQSxNQW9CQSxrQkFBQSxFQUFvQixTQUFDLFFBQUQsR0FBQTtlQUNoQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxRQUFoQyxFQURnQjtNQUFBLENBcEJwQjtBQUFBLE1Bd0JBLGdCQUFBLEVBQWtCLFNB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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/extensions/Hue.coffee
