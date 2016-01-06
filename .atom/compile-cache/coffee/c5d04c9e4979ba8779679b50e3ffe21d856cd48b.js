(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitFormatChanged: function(format) {
        return this.Emitter.emit('formatChanged', format);
      },
      onFormatChanged: function(callback) {
        return this.Emitter.on('formatChanged', callback);
      },
      activate: function() {
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-format");
            return _el;
          })(),
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var Color, _activeButton, _buttons, _format, _i, _len, _ref, _results;
            Color = colorPicker.getExtension('Color');
            _buttons = [];
            _activeButton = null;
            colorPicker.onBeforeOpen(function() {
              var _button, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = _buttons.length; _i < _len; _i++) {
                _button = _buttons[_i];
                _results.push(_button.deactivate());
              }
              return _results;
            });
            Color.onOutputFormat(function(format) {
              var _button, _i, _len, _results;
              _results = [];
              for (_i = 0, _len = _buttons.length; _i < _len; _i++) {
                _button = _buttons[_i];
                if (format === _button.format || format === ("" + _button.format + "A")) {
                  _button.activate();
                  _results.push(_activeButton = _button);
                } else {
                  _results.push(_button.deactivate());
                }
              }
              return _results;
            });
            _ref = ['RGB', 'HEX', 'HSL', 'HSV', 'VEC'];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              _format = _ref[_i];
              _results.push((function(_format) {
                var Format, hasChild, _button, _isClicking;
                Format = _this;
                _button = {
                  el: (function() {
                    var _el;
                    _el = document.createElement('button');
                    _el.classList.add("" + Format.element.el.className + "-button");
                    _el.innerHTML = _format;
                    return _el;
                  })(),
                  format: _format,
                  addClass: function(className) {
                    this.el.classList.add(className);
                    return this;
                  },
                  removeClass: function(className) {
                    this.el.classList.remove(className);
                    return this;
                  },
                  activate: function() {
                    return this.addClass('is--active');
                  },
                  deactivate: function() {
                    return this.removeClass('is--active');
                  }
                };
                _buttons.push(_button);
                if (!_activeButton) {
                  if (_format === atom.config.get('color-picker.preferredFormat')) {
                    _activeButton = _button;
                    _button.activate();
                  }
                }
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
                colorPicker.onMouseDown(function(e, isOnPicker) {
                  if (!(isOnPicker && hasChild(_button.el, e.target))) {
                    return;
                  }
                  e.preventDefault();
                  return _isClicking = true;
                });
                colorPicker.onMouseMove(function(e) {
                  return _isClicking = false;
                });
                colorPicker.onMouseUp(function(e) {
                  if (!_isClicking) {
                    return;
                  }
                  if (_activeButton) {
                    _activeButton.deactivate();
                  }
                  _button.activate();
                  _activeButton = _button;
                  return _this.emitFormatChanged(_format);
                });
                return _this.element.add(_button.el);
              })(_format));
            }
            return _results;
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvRm9ybWF0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUtJO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFdBQUQsR0FBQTtXQUNiO0FBQUEsTUFBQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsb0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0FBVDtBQUFBLE1BRUEsT0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxJQUhQO0FBQUEsTUFTQSxpQkFBQSxFQUFtQixTQUFDLE1BQUQsR0FBQTtlQUNmLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGVBQWQsRUFBK0IsTUFBL0IsRUFEZTtNQUFBLENBVG5CO0FBQUEsTUFXQSxlQUFBLEVBQWlCLFNBQUMsUUFBRCxHQUFBO2VBQ2IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksZUFBWixFQUE2QixRQUE3QixFQURhO01BQUEsQ0FYakI7QUFBQSxNQWlCQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sUUFBQSxJQUFDLENBQUEsT0FBRCxHQUNJO0FBQUEsVUFBQSxFQUFBLEVBQU8sQ0FBQSxTQUFBLEdBQUE7QUFDSCxnQkFBQSxpQkFBQTtBQUFBLFlBQUEsWUFBQSxHQUFlLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQXRDLENBQUE7QUFBQSxZQUNBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUROLENBQUE7QUFBQSxZQUVBLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixFQUFBLEdBQXJDLFlBQXFDLEdBQWtCLFNBQXBDLENBRkEsQ0FBQTtBQUlBLG1CQUFPLEdBQVAsQ0FMRztVQUFBLENBQUEsQ0FBSCxD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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/extensions/Format.coffee
