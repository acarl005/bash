(function() {
  module.exports = function(colorPicker) {
    return {
      element: null,
      activate: function() {
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add("" + _classPrefix + "-body");
            return _el;
          })(),
          height: function() {
            return this.el.offsetHeight;
          },
          add: function(element, weight) {
            if (weight) {
              if (weight > this.el.children.length) {
                this.el.appendChild(element);
              } else {
                this.el.insertBefore(element, this.el.children[weight]);
              }
            } else {
              this.el.appendChild(element);
            }
            return this;
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
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL2V4dGVuc2lvbnMvQm9keS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFLSTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxXQUFELEdBQUE7V0FDYjtBQUFBLE1BQUEsT0FBQSxFQUFTLElBQVQ7QUFBQSxNQUtBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDTixRQUFBLElBQUMsQ0FBQSxPQUFELEdBQ0k7QUFBQSxVQUFBLEVBQUEsRUFBTyxDQUFBLFNBQUEsR0FBQTtBQUNILGdCQUFBLGlCQUFBO0FBQUEsWUFBQSxZQUFBLEdBQWUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBdEMsQ0FBQTtBQUFBLFlBQ0EsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRE4sQ0FBQTtBQUFBLFlBRUEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLEVBQUEsR0FBckMsWUFBcUMsR0FBa0IsT0FBcEMsQ0FGQSxDQUFBO0FBSUEsbUJBQU8sR0FBUCxDQUxHO1VBQUEsQ0FBQSxDQUFILENBQUEsQ0FBSjtBQUFBLFVBT0EsTUFBQSxFQUFRLFNBQUEsR0FBQTttQkFBRyxJQUFDLENBQUEsRUFBRSxDQUFDLGFBQVA7VUFBQSxDQVBSO0FBQUEsVUFVQSxHQUFBLEVBQUssU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ0QsWUFBQSxJQUFHLE1BQUg7QUFDSSxjQUFBLElBQUcsTUFBQSxHQUFTLElBQUMsQ0FBQSxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQXpCO0FBQ0ksZ0JBQUEsSUFBQyxDQUFBLEVBQUUsQ0FBQyxXQUFKLENBQWdCLE9BQWhCLENBQUEsQ0FESjtlQUFBLE1BQUE7QUFFSyxnQkFBQSxJQUFDLENBQUEsRUFBRSxDQUFDLFlBQUosQ0FBaUIsT0FBakIsRUFBMEIsSUFBQyxDQUFBLEVBQUUsQ0FBQyxRQUFTLENBQUEsTUFBQSxDQUF2QyxDQUFBLENBRkw7ZUFESjthQUFBLE1BQUE7QUFJSyxjQUFBLElBQUMsQ0FBQSxFQUFFLENBQUMsV0FBSixDQUFnQixPQUFoQixDQUFBLENBSkw7YUFBQTtBQU1BLG1CQUFPLElBQVAsQ0FQQztVQUFBLENBVkw7U0FESixDQUFBO0FBQUEsUUFtQkEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFwQixDQUF3QixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQWpDLENBbkJBLENBQUE7QUFBQSxRQXVCQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDUCxnQkFBQSxVQUFBO0FBQUEsWUFBQSxVQUFBLEdBQWEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFwQixDQUFBLENBQUEsR0FBK0IsS0FBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQUEsQ0FBNUMsQ0FBQTttQkFDQSxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQXBCLENBQThCLFVBQTlCLEVBRk87VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLENBdkJBLENBQUE7QUEyQkEsZUFBTyxJQUFQLENBNUJNO01BQUEsQ0FMVjtNQURhO0VBQUEsQ0FBakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/extensions/Body.coffee
