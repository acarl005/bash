(function() {
  module.exports = function(colorPicker) {
    return {
      element: null,
      activate: function() {
        var _halfArrowWidth;
        _halfArrowWidth = null;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-arrow");
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
          hasClass: function(className) {
            return this.el.classList.contains(className);
          },
          width: function() {
            return this.el.offsetWidth;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          setPosition: function(x) {
            this.el.style.left = "" + x + "px";
            return this;
          },
          previousColor: null,
          setColor: function(smartColor) {
            var _color;
            _color = (typeof smartColor.toRGBA === "function" ? smartColor.toRGBA() : void 0) || 'none';
            if (this.previousColor && this.previousColor === _color) {
              return;
            }
            this.el.style.borderTopColor = _color;
            this.el.style.borderBottomColor = _color;
            return this.previousColor = _color;
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            return _halfArrowWidth = (_this.element.width() / 2) << 0;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _newHeight;
            _newHeight = colorPicker.element.height() + _this.element.height();
            return colorPicker.element.setHeight(_newHeight);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            Alpha.onColorChanged(function(smartColor) {
              if (smartColor) {
                return _this.element.setColor(smartColor);
              } else {
                return colorPicker.SmartColor.HEX('#f00');
              }
            });
          };
        })(this));
        colorPicker.onInputVariable((function(_this) {
          return function() {
            return _this.element.setColor(colorPicker.SmartColor.RGBAArray([0, 0, 0, 0]));
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
        colorPicker.onPositionChange((function(_this) {
          return function(position, colorPickerPosition) {
            return _this.element.setPosition(position.x - colorPickerPosition.x);
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvQXJyb3cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0k7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsV0FBRCxHQUFBO1dBQ2I7QUFBQSxNQUFBLE9BQUEsRUFBUyxJQUFUO0FBQUEsTUFLQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sWUFBQSxlQUFBO0FBQUEsUUFBQSxlQUFBLEdBQWtCLElBQWxCLENBQUE7QUFBQSxRQUlBLElBQUMsQ0FBQSxPQUFELEdBQ0k7QUFBQSxVQUFBLEVBQUEsRUFBTyxDQUFBLFNBQUEsR0FBQTtBQUNILGdCQUFBLGlCQUFBO0FBQUEsWUFBQSxZQUFBLEdBQWUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBdEMsQ0FBQTtBQUFBLFlBQ0EsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRE4sQ0FBQTtBQUFBLFlBRUEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLEVBQUEsR0FBckMsWUFBcUMsR0FBa0IsUUFBcEMsQ0FGQSxDQUFBO0FBSUEsbUJBQU8sR0FBUCxDQUxHO1VBQUEsQ0FBQSxDQUFILENBQUEsQ0FBSjtBQUFBLFVBT0EsUUFBQSxFQUFVLFNBQUMsU0FBRCxHQUFBO0FBQWUsWUFBQSxJQUFDLENBQUEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLFNBQWxCLENBQUEsQ0FBQTtBQUE2QixtQkFBTyxJQUFQLENBQTVDO1VBQUEsQ0FQVjtBQUFBLFVBUUEsV0FBQSxFQUFhLFNBQUMsU0FBRCxHQUFBO0FBQWUsWUFBQSxJQUFDLENBQUEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFkLENBQXFCLFNBQXJCLENBQUEsQ0FBQTtBQUFn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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/extensions/Arrow.coffee
