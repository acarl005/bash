(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitVisibility: function(visible) {
        if (visible == null) {
          visible = true;
        }
        return this.Emitter.emit('visible', visible);
      },
      onVisibility: function(callback) {
        return this.Emitter.on('visible', callback);
      },
      activate: function() {
        var View, hasChild, _isClicking;
        View = this;
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-return");
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
          hide: function() {
            this.removeClass('is--visible');
            return View.emitVisibility(false);
          },
          show: function() {
            this.addClass('is--visible');
            return View.emitVisibility(true);
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
            if (!(_isClicking && _this.color)) {
              return;
            }
            return colorPicker.emitInputColor(_this.color);
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var Alpha;
            Alpha = colorPicker.getExtension('Alpha');
            colorPicker.onBeforeOpen(function() {
              return _this.color = null;
            });
            colorPicker.onInputColor(function(smartColor, wasFound) {
              if (wasFound) {
                return _this.color = smartColor;
              }
            });
            Alpha.onColorChanged(function(smartColor) {
              if (!_this.color) {
                return _this.element.hide();
              }
              if (smartColor.equals(_this.color)) {
                return _this.element.hide();
              } else {
                return _this.element.show();
              }
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            colorPicker.onInputColor(function(smartColor, wasFound) {
              if (wasFound) {
                return _this.element.setColor(smartColor);
              }
            });
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var setColor, _text;
            _text = document.createElement('p');
            _text.classList.add("" + _this.element.el.className + "-text");
            setColor = function(smartColor) {
              return _text.innerText = smartColor.value;
            };
            colorPicker.onInputColor(function(smartColor, wasFound) {
              if (wasFound) {
                return setColor(smartColor);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvUmV0dXJuLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQU1JO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLFdBQUQsR0FBQTtXQUNiO0FBQUEsTUFBQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsb0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0FBVDtBQUFBLE1BRUEsT0FBQSxFQUFTLElBRlQ7QUFBQSxNQUdBLEtBQUEsRUFBTyxJQUhQO0FBQUEsTUFTQSxjQUFBLEVBQWdCLFNBQUMsT0FBRCxHQUFBOztVQUFDLFVBQVE7U0FDckI7ZUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxTQUFkLEVBQXlCLE9BQXpCLEVBRFk7TUFBQSxDQVRoQjtBQUFBLE1BV0EsWUFBQSxFQUFjLFNBQUMsUUFBRCxHQUFBO2VBQ1YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksU0FBWixFQUF1QixRQUF2QixFQURVO01BQUEsQ0FYZDtBQUFBLE1BaUJBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixZQUFBLDJCQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sSUFBUCxDQUFBO0FBQUEsUUFJQSxJQUFDLENBQUEsT0FBRCxHQUNJO0FBQUEsVUFBQSxFQUFBLEVBQU8sQ0FBQSxTQUFBLEdBQUE7QUFDSCxnQkFBQSxpQkFBQTtBQUFBLFlBQUEsWUFBQSxHQUFlLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQXRDLENBQUE7QUFBQSxZQUNBLEdBQUEsR0FBTSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUROLENBQUE7QUFBQSxZQUVBLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBZCxDQUFrQixFQUFBLEdBQXJDLFlBQXFD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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/extensions/Return.coffee
