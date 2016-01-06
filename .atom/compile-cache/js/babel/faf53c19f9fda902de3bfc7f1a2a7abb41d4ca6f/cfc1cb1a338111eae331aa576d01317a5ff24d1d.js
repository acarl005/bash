Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var StatusBarView = (function (_View) {
  _inherits(StatusBarView, _View);

  function StatusBarView(statusBar) {
    var _this = this;

    _classCallCheck(this, StatusBarView);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    _get(Object.getPrototypeOf(StatusBarView.prototype), 'constructor', this).apply(this, args);
    this.statusBar = statusBar;
    atom.config.observe('build.statusBar', function () {
      return _this.attach();
    });
    atom.config.observe('build.statusBarPriority', function () {
      return _this.attach();
    });
  }

  _createClass(StatusBarView, [{
    key: 'attach',
    value: function attach() {
      var _this2 = this;

      this.destroy();

      var orientation = atom.config.get('build.statusBar');
      if ('Disable' === orientation) {
        return;
      }

      this.statusBarTile = this.statusBar['add' + orientation + 'Tile']({ item: this, priority: atom.config.get('build.statusBarPriority') });

      this.tooltip = atom.tooltips.add(this, {
        title: function title() {
          return _this2.tooltipMessage();
        }
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.statusBarTile) {
        this.statusBarTile.destroy();
        this.statusBarTile = null;
      }

      if (this.tooltip) {
        this.tooltip.dispose();
        this.tooltip = null;
      }
    }
  }, {
    key: 'tooltipMessage',
    value: function tooltipMessage() {
      var statusMessage = undefined === this.success ? '' : 'Last build ' + (this.success ? 'succeeded' : 'failed') + '!';
      return 'Current build target is \'' + this.element.textContent + '\'<br />' + statusMessage;
    }
  }, {
    key: 'setTarget',
    value: function setTarget(t) {
      this.target = t;
      this.message.text(t);
      this.targetView.removeClass('status-unknown status-success status-error icon-check icon-flame');
    }
  }, {
    key: 'setBuildSuccess',
    value: function setBuildSuccess(success) {
      this.success = success;
      this.targetView.removeClass('status-unknown status-success status-error icon-check icon-flame');
      this.targetView.addClass(success ? 'status-success icon-check' : 'status-error icon-flame');
    }
  }, {
    key: 'onClick',
    value: function onClick(cb) {
      this.onClick = cb;
    }
  }, {
    key: 'clicked',
    value: function clicked() {
      this.onClick && this.onClick();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this3 = this;

      this.div({ id: 'build-status-bar', 'class': 'inline-block' }, function () {
        _this3.span({ outlet: 'targetView' });
        _this3.a({ click: 'clicked', outlet: 'message' });
      });
    }
  }]);

  return StatusBarView;
})(_atomSpacePenViews.View);

exports['default'] = StatusBarView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL3N0YXR1cy1iYXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7aUNBRXFCLHNCQUFzQjs7QUFGM0MsV0FBVyxDQUFDOztJQUlTLGFBQWE7WUFBYixhQUFhOztBQUNyQixXQURRLGFBQWEsQ0FDcEIsU0FBUyxFQUFXOzs7MEJBRGIsYUFBYTs7c0NBQ04sSUFBSTtBQUFKLFVBQUk7OztBQUM1QiwrQkFGaUIsYUFBYSw4Q0FFckIsSUFBSSxFQUFFO0FBQ2YsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDM0IsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUU7YUFBTSxNQUFLLE1BQU0sRUFBRTtLQUFBLENBQUMsQ0FBQztBQUM1RCxRQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsRUFBRTthQUFNLE1BQUssTUFBTSxFQUFFO0tBQUEsQ0FBQyxDQUFDO0dBQ3JFOztlQU5rQixhQUFhOztXQVExQixrQkFBRzs7O0FBQ1AsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVmLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkQsVUFBSSxTQUFTLEtBQUssV0FBVyxFQUFFO0FBQzdCLGVBQU87T0FDUjs7QUFFRCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLFNBQU8sV0FBVyxVQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFbkksVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7QUFDckMsYUFBSyxFQUFFO2lCQUFNLE9BQUssY0FBYyxFQUFFO1NBQUE7T0FDbkMsQ0FBQyxDQUFDO0tBQ0o7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsWUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7T0FDM0I7O0FBRUQsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdkIsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7T0FDckI7S0FDRjs7O1dBU2EsMEJBQUc7QUFDZixVQUFNLGFBQWEsR0FBRyxTQUFTLEtBQUssSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLG9CQUFpQixJQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsR0FBRyxRQUFRLENBQUEsTUFBRyxDQUFDO0FBQy9HLDRDQUFtQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsZ0JBQVUsYUFBYSxDQUFHO0tBQ3RGOzs7V0FFUSxtQkFBQyxDQUFDLEVBQUU7QUFDWCxVQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixVQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO0tBQ2pHOzs7V0FFYyx5QkFBQyxPQUFPLEVBQUU7QUFDdkIsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsa0VBQWtFLENBQUMsQ0FBQztBQUNoRyxVQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsMkJBQTJCLEdBQUcseUJBQXlCLENBQUMsQ0FBQztLQUM3Rjs7O1dBRU0saUJBQUMsRUFBRSxFQUFFO0FBQ1YsVUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7S0FDbkI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEM7OztXQTlCYSxtQkFBRzs7O0FBQ2YsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxTQUFPLGNBQWMsRUFBRSxFQUFFLFlBQU07QUFDaEUsZUFBSyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUNwQyxlQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7T0FDaEQsQ0FBQyxDQUFDO0tBQ0o7OztTQXhDa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvc3RhdHVzLWJhci12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IFZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXR1c0JhclZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3Ioc3RhdHVzQmFyLCAuLi5hcmdzKSB7XG4gICAgc3VwZXIoLi4uYXJncyk7XG4gICAgdGhpcy5zdGF0dXNCYXIgPSBzdGF0dXNCYXI7XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQuc3RhdHVzQmFyJywgKCkgPT4gdGhpcy5hdHRhY2goKSk7XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQuc3RhdHVzQmFyUHJpb3JpdHknLCAoKSA9PiB0aGlzLmF0dGFjaCgpKTtcbiAgfVxuXG4gIGF0dGFjaCgpIHtcbiAgICB0aGlzLmRlc3Ryb3koKTtcblxuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdidWlsZC5zdGF0dXNCYXInKTtcbiAgICBpZiAoJ0Rpc2FibGUnID09PSBvcmllbnRhdGlvbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RhdHVzQmFyVGlsZSA9IHRoaXMuc3RhdHVzQmFyW2BhZGQke29yaWVudGF0aW9ufVRpbGVgXSh7IGl0ZW06IHRoaXMsIHByaW9yaXR5OiBhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnN0YXR1c0JhclByaW9yaXR5JykgfSk7XG5cbiAgICB0aGlzLnRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLCB7XG4gICAgICB0aXRsZTogKCkgPT4gdGhpcy50b29sdGlwTWVzc2FnZSgpXG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnN0YXR1c0JhclRpbGUpIHtcbiAgICAgIHRoaXMuc3RhdHVzQmFyVGlsZS5kZXN0cm95KCk7XG4gICAgICB0aGlzLnN0YXR1c0JhclRpbGUgPSBudWxsO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5kaXNwb3NlKCk7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBjb250ZW50KCkge1xuICAgIHRoaXMuZGl2KHsgaWQ6ICdidWlsZC1zdGF0dXMtYmFyJywgY2xhc3M6ICdpbmxpbmUtYmxvY2snIH0sICgpID0+IHtcbiAgICAgIHRoaXMuc3Bhbih7IG91dGxldDogJ3RhcmdldFZpZXcnIH0pO1xuICAgICAgdGhpcy5hKHsgY2xpY2s6ICdjbGlja2VkJywgb3V0bGV0OiAnbWVzc2FnZSd9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvb2x0aXBNZXNzYWdlKCkge1xuICAgIGNvbnN0IHN0YXR1c01lc3NhZ2UgPSB1bmRlZmluZWQgPT09IHRoaXMuc3VjY2VzcyA/ICcnIDogYExhc3QgYnVpbGQgJHt0aGlzLnN1Y2Nlc3MgPyAnc3VjY2VlZGVkJyA6ICdmYWlsZWQnfSFgO1xuICAgIHJldHVybiBgQ3VycmVudCBidWlsZCB0YXJnZXQgaXMgJyR7dGhpcy5lbGVtZW50LnRleHRDb250ZW50fSc8YnIgLz4ke3N0YXR1c01lc3NhZ2V9YDtcbiAgfVxuXG4gIHNldFRhcmdldCh0KSB7XG4gICAgdGhpcy50YXJnZXQgPSB0O1xuICAgIHRoaXMubWVzc2FnZS50ZXh0KHQpO1xuICAgIHRoaXMudGFyZ2V0Vmlldy5yZW1vdmVDbGFzcygnc3RhdHVzLXVua25vd24gc3RhdHVzLXN1Y2Nlc3Mgc3RhdHVzLWVycm9yIGljb24tY2hlY2sgaWNvbi1mbGFtZScpO1xuICB9XG5cbiAgc2V0QnVpbGRTdWNjZXNzKHN1Y2Nlc3MpIHtcbiAgICB0aGlzLnN1Y2Nlc3MgPSBzdWNjZXNzO1xuICAgIHRoaXMudGFyZ2V0Vmlldy5yZW1vdmVDbGFzcygnc3RhdHVzLXVua25vd24gc3RhdHVzLXN1Y2Nlc3Mgc3RhdHVzLWVycm9yIGljb24tY2hlY2sgaWNvbi1mbGFtZScpO1xuICAgIHRoaXMudGFyZ2V0Vmlldy5hZGRDbGFzcyhzdWNjZXNzID8gJ3N0YXR1cy1zdWNjZXNzIGljb24tY2hlY2snIDogJ3N0YXR1cy1lcnJvciBpY29uLWZsYW1lJyk7XG4gIH1cblxuICBvbkNsaWNrKGNiKSB7XG4gICAgdGhpcy5vbkNsaWNrID0gY2I7XG4gIH1cblxuICBjbGlja2VkKCkge1xuICAgIHRoaXMub25DbGljayAmJiB0aGlzLm9uQ2xpY2soKTtcbiAgfVxufVxuIl19
//# sourceURL=/home/andy/.atom/packages/build/lib/status-bar-view.js
