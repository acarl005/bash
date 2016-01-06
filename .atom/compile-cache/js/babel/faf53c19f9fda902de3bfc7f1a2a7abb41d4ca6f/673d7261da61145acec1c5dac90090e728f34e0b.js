'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

exports['default'] = function (legacyObject) {
  return (function () {
    function LegacyProvider(path) {
      _classCallCheck(this, LegacyProvider);

      this.path = path;
      this.ctx = {};
    }

    _createClass(LegacyProvider, [{
      key: 'getNiceName',
      value: function getNiceName() {
        return legacyObject.niceName;
      }
    }, {
      key: 'isEligible',
      value: function isEligible() {
        return legacyObject.isEligable.apply(this.ctx, [this.path]);
      }
    }, {
      key: 'settings',
      value: function settings() {
        return legacyObject.settings.apply(this.ctx, [this.path]);
      }
    }, {
      key: 'on',
      value: function on(event, cb) {
        if (!legacyObject.on) return null;
        return legacyObject.on.apply(this.ctx, [event, cb]);
      }
    }, {
      key: 'removeAllListeners',
      value: function removeAllListeners(event) {
        if (!legacyObject.off) return null;
        return legacyObject.off.apply(this.ctx, [event]);
      }
    }]);

    return LegacyProvider;
  })();
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL3Byb3ZpZGVyLWxlZ2FjeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7cUJBRUcsVUFBVSxZQUFZLEVBQUU7QUFDckM7QUFDYSxhQURBLGNBQWMsQ0FDYixJQUFJLEVBQUU7NEJBRFAsY0FBYzs7QUFFdkIsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7S0FDZjs7aUJBSlUsY0FBYzs7YUFNZCx1QkFBRztBQUNaLGVBQU8sWUFBWSxDQUFDLFFBQVEsQ0FBQztPQUM5Qjs7O2FBRVMsc0JBQUc7QUFDWCxlQUFPLFlBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQztPQUMvRDs7O2FBRU8sb0JBQUc7QUFDVCxlQUFPLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQztPQUM3RDs7O2FBRUMsWUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO0FBQ1osWUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDbEMsZUFBTyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBRSxDQUFDLENBQUM7T0FDdkQ7OzthQUVpQiw0QkFBQyxLQUFLLEVBQUU7QUFDeEIsWUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDbkMsZUFBTyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUUsS0FBSyxDQUFFLENBQUMsQ0FBQztPQUNwRDs7O1dBMUJVLGNBQWM7T0EyQnpCO0NBQ0giLCJmaWxlIjoiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvcHJvdmlkZXItbGVnYWN5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChsZWdhY3lPYmplY3QpIHtcbiAgcmV0dXJuIGNsYXNzIExlZ2FjeVByb3ZpZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihwYXRoKSB7XG4gICAgICB0aGlzLnBhdGggPSBwYXRoO1xuICAgICAgdGhpcy5jdHggPSB7fTtcbiAgICB9XG5cbiAgICBnZXROaWNlTmFtZSgpIHtcbiAgICAgIHJldHVybiBsZWdhY3lPYmplY3QubmljZU5hbWU7XG4gICAgfVxuXG4gICAgaXNFbGlnaWJsZSgpIHtcbiAgICAgIHJldHVybiBsZWdhY3lPYmplY3QuaXNFbGlnYWJsZS5hcHBseSh0aGlzLmN0eCwgWyB0aGlzLnBhdGggXSk7XG4gICAgfVxuXG4gICAgc2V0dGluZ3MoKSB7XG4gICAgICByZXR1cm4gbGVnYWN5T2JqZWN0LnNldHRpbmdzLmFwcGx5KHRoaXMuY3R4LCBbIHRoaXMucGF0aCBdKTtcbiAgICB9XG5cbiAgICBvbihldmVudCwgY2IpIHtcbiAgICAgIGlmICghbGVnYWN5T2JqZWN0Lm9uKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiBsZWdhY3lPYmplY3Qub24uYXBwbHkodGhpcy5jdHgsIFsgZXZlbnQsIGNiIF0pO1xuICAgIH1cblxuICAgIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICAgICAgaWYgKCFsZWdhY3lPYmplY3Qub2ZmKSByZXR1cm4gbnVsbDtcbiAgICAgIHJldHVybiBsZWdhY3lPYmplY3Qub2ZmLmFwcGx5KHRoaXMuY3R4LCBbIGV2ZW50IF0pO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==
//# sourceURL=/home/andy/.atom/packages/build/lib/provider-legacy.js
