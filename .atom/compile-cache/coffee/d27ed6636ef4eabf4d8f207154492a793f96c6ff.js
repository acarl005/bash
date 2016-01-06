(function() {
  module.exports = function(colorPicker) {
    return {
      element: null,
      pointer: null,
      activate: function() {
        var hasChild, _isClicking;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-definition");
            return _el;
          })(),
          height: function() {
            return this.el.offsetHeight;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          },
          setColor: function(smartColor) {
            return this.el.style.backgroundColor = smartColor.toRGBA();
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var $colorPicker, Arrow;
            Arrow = colorPicker.getExtension('Arrow');
            $colorPicker = colorPicker.element;
            colorPicker.onInputVariable(function() {
              var onClose, _newHeight, _oldHeight;
              _oldHeight = $colorPicker.height();
              $colorPicker.addClass('view--definition');
              _newHeight = _this.element.height() + Arrow.element.height();
              $colorPicker.setHeight(_newHeight);
              _this.element.setColor(colorPicker.SmartColor.RGBAArray([0, 0, 0, 0]));
              onClose = function() {
                colorPicker.canOpen = true;
                $colorPicker.setHeight(_oldHeight);
                $colorPicker.removeClass('view--definition');
                return colorPicker.Emitter.off('close', onClose);
              };
              return colorPicker.onClose(onClose);
            });
            colorPicker.onInputColor(function() {
              return $colorPicker.removeClass('view--definition');
            });
          };
        })(this));
        colorPicker.onInputVariableColor((function(_this) {
          return function(smartColor) {
            if (!smartColor) {
              return;
            }
            return _this.element.setColor(smartColor);
          };
        })(this));
        colorPicker.onInputVariableColor((function(_this) {
          return function() {
            var pointer;
            pointer = arguments[arguments.length - 1];
            return _this.pointer = pointer;
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
            if (!(_isClicking && _this.pointer)) {
              return;
            }
            atom.workspace.open(_this.pointer.filePath).then(function() {
              var Editor;
              Editor = atom.workspace.getActiveTextEditor();
              Editor.clearSelections();
              Editor.setSelectedBufferRange(_this.pointer.range);
              Editor.scrollToCursorPosition();
              return colorPicker.close();
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _definition;
            _definition = document.createElement('p');
            _definition.classList.add("" + _this.element.el.className + "-definition");
            colorPicker.onInputVariable(function() {
              return _definition.innerText = '';
            });
            colorPicker.onInputVariableColor(function(color) {
              if (color) {
                return _definition.innerText = color.value;
              } else {
                return _definition.innerText = 'No color found.';
              }
            });
            return _this.element.add(_definition);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _variable;
            _variable = document.createElement('p');
            _variable.classList.add("" + _this.element.el.className + "-variable");
            colorPicker.onInputVariable(function(match) {
              return _variable.innerText = match.match;
            });
            return _this.element.add(_variable);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvRGVmaW5pdGlvbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFLSTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxXQUFELEdBQUE7V0FDYjtBQUFBLE1BQUEsT0FBQSxFQUFTLElBQVQ7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0FBQUEsTUFNQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sWUFBQSxxQkFBQTtBQUFBLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FDSTtBQUFBLFVBQUEsRUFBQSxFQUFPLENBQUEsU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsaUJBQUE7QUFBQSxZQUFBLFlBQUEsR0FBZSxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUF0QyxDQUFBO0FBQUEsWUFDQSxHQUFBLEdBQU0sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FETixDQUFBO0FBQUEsWUFFQSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQWQsQ0FBa0IsRUFBQSxHQUFyQyxZQUFxQyxHQUFrQixhQUFwQyxDQUZBLENBQUE7QUFJQSxtQkFBTyxHQUFQLENBTEc7VUFBQSxDQUFBLENBQUgsQ0FBQSxDQUFKO0FBQUEsVUFPQSxNQUFBLEVBQVEsU0FBQSxHQUFBO21CQUFHLElBQUMsQ0FBQSxFQUFFLENBQUMsYUFBUDtVQUFBLENBUFI7QUFBQSxVQVVBLEdBQUEsRUFBSyxTQUFDLE9BQUQsR0FBQTtBQUNELFlBQUEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxXQUFKLENBQWdCLE9BQWhCLENBQUEsQ0FBQTtBQUNBLG1CQUFPLElBQVAsQ0FGQztVQUFBLENBVkw7QUFBQSxVQWVBLFFBQUEsRUFBVSxTQUFDLFVBQUQsR0FBQTttQkFDTixJQUFDLENB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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/extensions/Definition.coffee
