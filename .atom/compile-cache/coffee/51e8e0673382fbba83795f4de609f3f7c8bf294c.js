(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitOutputFormat: function(format) {
        return this.Emitter.emit('outputFormat', format);
      },
      onOutputFormat: function(callback) {
        return this.Emitter.on('outputFormat', callback);
      },
      activate: function() {
        var hasChild, _isClicking;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-color");
            return _el;
          })(),
          addClass: function(className) {
            this.el.classList.add(className);
            return this;
          },
          removeClass: function(className) {
            this.el.classList.remove(className);
            return this;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          },
          previousColor: null,
          setColor: function(smartColor) {
            var _color;
            _color = smartColor.toRGBA();
            if (this.previousColor && this.previousColor === _color) {
              return;
            }
            this.el.style.backgroundColor = _color;
            return this.previousColor = _color;
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var _newHeight;
            _newHeight = colorPicker.element.height() + _this.element.height();
            return colorPicker.element.setHeight(_newHeight);
          };
        })(this));
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
        _isClicking = false;
        colorPicker.onMouseDown((function(_this) {
          return function(e, isOnPicker) {
            if (!(isOnPicker && hasChild(_this.element.el, e.target))) {
              return;
            }
            e.preventDefault();
            return _isClicking = true;
          };
        })(this));
        colorPicker.onMouseMove(function(e) {
          return _isClicking = false;
        });
        colorPicker.onMouseUp((function(_this) {
          return function(e) {
            if (!_isClicking) {
              return;
            }
            colorPicker.replace(_this.color);
            return colorPicker.element.close();
          };
        })(this));
        colorPicker.onKeyDown((function(_this) {
          return function(e) {
            if (e.which !== 13) {
              return;
            }
            e.stopPropagation();
            return colorPicker.replace(_this.color);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            Alpha.onColorChanged(function(smartColor) {
              _this.element.setColor((function() {
                if (smartColor) {
                  return smartColor;
                } else {
                  return colorPicker.SmartColor.HEX('#f00');
                }
              })());
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha, Format, Return, setColor, _currentColor, _formatFormat, _inputColor, _text;
            Alpha = colorPicker.getExtension('Alpha');
            Return = colorPicker.getExtension('Return');
            Format = colorPicker.getExtension('Format');
            _text = document.createElement('p');
            _text.classList.add("" + _this.element.el.className + "-text");
            colorPicker.onBeforeOpen(function() {
              return _this.color = null;
            });
            _inputColor = null;
            colorPicker.onInputColor(function(smartColor, wasFound) {
              return _inputColor = wasFound ? smartColor : null;
            });
            _formatFormat = null;
            Format.onFormatChanged(function(format) {
              return _formatFormat = format;
            });
            colorPicker.onInputColor(function() {
              return _formatFormat = null;
            });
            setColor = function(smartColor) {
              var _format, _function, _outputColor, _preferredFormat;
              _preferredFormat = atom.config.get('color-picker.preferredFormat');
              _format = _formatFormat || (_inputColor != null ? _inputColor.format : void 0) || _preferredFormat || 'RGB';
              _function = smartColor.getAlpha() < 1 ? smartColor["to" + _format + "A"] || smartColor["to" + _format] : smartColor["to" + _format];
              _outputColor = (function() {
                if (_inputColor && (_inputColor.format === _format || _inputColor.format === ("" + _format + "A"))) {
                  if (smartColor.equals(_inputColor)) {
                    return _inputColor.value;
                  }
                }
                return _function.call(smartColor);
              })();
              if (_outputColor === _this.color) {
                return;
              }
              if (_inputColor && atom.config.get('color-picker.automaticReplace')) {
                colorPicker.replace(_outputColor);
              }
              _this.color = _outputColor;
              _text.innerText = _outputColor;
              return _this.emitOutputFormat(_format);
            };
            _currentColor = null;
            Alpha.onColorChanged(function(smartColor) {
              setColor(_currentColor = (function() {
                if (smartColor) {
                  return smartColor;
                } else {
                  return colorPicker.SmartColor.HEX('#f00');
                }
              })());
            });
            Format.onFormatChanged(function() {
              return setColor(_currentColor);
            });
            Return.onVisibility(function(visibility) {
              if (visibility) {
                return _this.element.addClass('is--returnVisible');
              } else {
                return _this.element.removeClass('is--returnVisible');
              }
            });
            return _this.element.add(_text);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvQ29sb3IuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0k7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRCxHQUFBO1dBQ2I7QUFBQSxNQUFBLE9BQUEsRUFBUyxDQUFDLE9BQUEsQ0FBUSxvQkFBUixDQUFELENBQUEsQ0FBQSxDQUFUO0FBQUEsTUFFQSxPQUFBLEVBQVMsSUFGVDtBQUFBLE1BR0EsS0FBQSxFQUFPLElBSFA7QUFBQSxNQVNBLGdCQUFBLEVBQWtCLFNBQUMsTUFBRCxHQUFBO2VBQ2QsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsY0FBZCxFQUE4QixNQUE5QixFQURjO01BQUEsQ0FUbEI7QUFBQSxNQVdBLGNBQUEsRUFBZ0IsU0FBQyxRQUFELEdBQUE7ZUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLFFBQTVCLEVBRFk7TUFBQSxDQVhoQjtBQUFBLE1BaUJBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixZQUFBLHFCQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUNJO0FBQUEsVUFBQSxFQUFBLEVBQU8sQ0FBQSxTQUFBLEdBQUE7QUFDSCxnQkFBQSxpQkFBQTtBQUFBLFlBQUEsWUFBQSxHQUFlLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQXRDLENBQUE7QUFBQSxZQUNBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUROLENBQUE7QUFBQSxZQUVBLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixFQUFBLEdBQXJDLFlBQXFDLEdBQWtCLFFBQXBDLENBRkEsQ0FBQTtBQUlBLG1CQUFPLEdBQVAsQ0FMRztV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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/extensions/Color.coffee
