Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var SaveConfirmView = (function (_View) {
  _inherits(SaveConfirmView, _View);

  function SaveConfirmView() {
    _classCallCheck(this, SaveConfirmView);

    _get(Object.getPrototypeOf(SaveConfirmView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SaveConfirmView, [{
    key: 'destroy',
    value: function destroy() {
      this.confirmcb = undefined;
      this.cancelcb = undefined;
      if (this.panel) {
        this.panel.destroy();
        this.panel = null;
      }
    }
  }, {
    key: 'show',
    value: function show(confirmcb, cancelcb) {
      this.confirmcb = confirmcb;
      this.cancelcb = cancelcb;

      this.panel = atom.workspace.addTopPanel({
        item: this
      });
      this.saveBuildButton.focus();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.destroy();
      if (this.cancelcb) {
        this.cancelcb();
      }
    }
  }, {
    key: 'saveAndConfirm',
    value: function saveAndConfirm() {
      if (this.confirmcb) {
        this.confirmcb(true);
      }
      this.destroy();
    }
  }, {
    key: 'confirmWithoutSave',
    value: function confirmWithoutSave() {
      if (this.confirmcb) {
        this.confirmcb(false);
      }
      this.destroy();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ 'class': 'build-confirm overlay from-top' }, function () {
        _this.h3('You have unsaved changes');
        _this.div({ 'class': 'btn-container pull-right' }, function () {
          _this.button({ 'class': 'btn btn-success', outlet: 'saveBuildButton', title: 'Save and Build', click: 'saveAndConfirm' }, 'Save and build');
          _this.button({ 'class': 'btn btn-info', title: 'Build Without Saving', click: 'confirmWithoutSave' }, 'Build Without Saving');
        });
        _this.div({ 'class': 'btn-container pull-left' }, function () {
          _this.button({ 'class': 'btn btn-info', title: 'Cancel', click: 'cancel' }, 'Cancel');
        });
      });
    }
  }]);

  return SaveConfirmView;
})(_atomSpacePenViews.View);

exports['default'] = SaveConfirmView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL3NhdmUtY29uZmlybS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztpQ0FFcUIsc0JBQXNCOztBQUYzQyxXQUFXLENBQUM7O0lBSVMsZUFBZTtZQUFmLGVBQWU7O1dBQWYsZUFBZTswQkFBZixlQUFlOzsrQkFBZixlQUFlOzs7ZUFBZixlQUFlOztXQWMzQixtQkFBRztBQUNSLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0FBQzFCLFVBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckIsWUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7T0FDbkI7S0FDRjs7O1dBRUcsY0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFO0FBQ3hCLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUV6QixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO0FBQ3RDLFlBQUksRUFBRSxJQUFJO09BQ1gsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM5Qjs7O1dBRUssa0JBQUc7QUFDUCxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZixVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDakIsWUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO09BQ2pCO0tBQ0Y7OztXQUVhLDBCQUFHO0FBQ2YsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEI7QUFDRCxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEI7OztXQUVpQiw4QkFBRztBQUNuQixVQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUN2QjtBQUNELFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNoQjs7O1dBbkRhLG1CQUFHOzs7QUFDZixVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBTyxnQ0FBZ0MsRUFBRSxFQUFFLFlBQU07QUFDMUQsY0FBSyxFQUFFLENBQUMsMEJBQTBCLENBQUMsQ0FBQztBQUNwQyxjQUFLLEdBQUcsQ0FBQyxFQUFFLFNBQU8sMEJBQTBCLEVBQUUsRUFBRSxZQUFNO0FBQ3BELGdCQUFLLE1BQU0sQ0FBQyxFQUFFLFNBQU8saUJBQWlCLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3pJLGdCQUFLLE1BQU0sQ0FBQyxFQUFFLFNBQU8sY0FBYyxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1NBQzVILENBQUMsQ0FBQztBQUNILGNBQUssR0FBRyxDQUFDLEVBQUUsU0FBTyx5QkFBeUIsRUFBRSxFQUFFLFlBQU07QUFDbkQsZ0JBQUssTUFBTSxDQUFDLEVBQUUsU0FBTyxjQUFjLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDcEYsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztTQVprQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvaG9tZS9hbmR5Ly5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9zYXZlLWNvbmZpcm0tdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTYXZlQ29uZmlybVZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgdGhpcy5kaXYoeyBjbGFzczogJ2J1aWxkLWNvbmZpcm0gb3ZlcmxheSBmcm9tLXRvcCcgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5oMygnWW91IGhhdmUgdW5zYXZlZCBjaGFuZ2VzJyk7XG4gICAgICB0aGlzLmRpdih7IGNsYXNzOiAnYnRuLWNvbnRhaW5lciBwdWxsLXJpZ2h0JyB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6ICdidG4gYnRuLXN1Y2Nlc3MnLCBvdXRsZXQ6ICdzYXZlQnVpbGRCdXR0b24nLCB0aXRsZTogJ1NhdmUgYW5kIEJ1aWxkJywgY2xpY2s6ICdzYXZlQW5kQ29uZmlybScgfSwgJ1NhdmUgYW5kIGJ1aWxkJyk7XG4gICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6ICdidG4gYnRuLWluZm8nLCB0aXRsZTogJ0J1aWxkIFdpdGhvdXQgU2F2aW5nJywgY2xpY2s6ICdjb25maXJtV2l0aG91dFNhdmUnIH0sICdCdWlsZCBXaXRob3V0IFNhdmluZycpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmRpdih7IGNsYXNzOiAnYnRuLWNvbnRhaW5lciBwdWxsLWxlZnQnIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogJ2J0biBidG4taW5mbycsIHRpdGxlOiAnQ2FuY2VsJywgY2xpY2s6ICdjYW5jZWwnIH0sICdDYW5jZWwnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmNvbmZpcm1jYiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNhbmNlbGNiID0gdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHNob3coY29uZmlybWNiLCBjYW5jZWxjYikge1xuICAgIHRoaXMuY29uZmlybWNiID0gY29uZmlybWNiO1xuICAgIHRoaXMuY2FuY2VsY2IgPSBjYW5jZWxjYjtcblxuICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRUb3BQYW5lbCh7XG4gICAgICBpdGVtOiB0aGlzXG4gICAgfSk7XG4gICAgdGhpcy5zYXZlQnVpbGRCdXR0b24uZm9jdXMoKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5jYW5jZWxjYikge1xuICAgICAgdGhpcy5jYW5jZWxjYigpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmVBbmRDb25maXJtKCkge1xuICAgIGlmICh0aGlzLmNvbmZpcm1jYikge1xuICAgICAgdGhpcy5jb25maXJtY2IodHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG5cbiAgY29uZmlybVdpdGhvdXRTYXZlKCkge1xuICAgIGlmICh0aGlzLmNvbmZpcm1jYikge1xuICAgICAgdGhpcy5jb25maXJtY2IoZmFsc2UpO1xuICAgIH1cbiAgICB0aGlzLmRlc3Ryb3koKTtcbiAgfVxufVxuIl19
//# sourceURL=/home/andy/.atom/packages/build/lib/save-confirm-view.js
