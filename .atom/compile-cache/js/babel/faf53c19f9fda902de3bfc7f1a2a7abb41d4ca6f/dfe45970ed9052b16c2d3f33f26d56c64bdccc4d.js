Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

'use babel';

var GoogleAnalytics = (function () {
  function GoogleAnalytics() {
    _classCallCheck(this, GoogleAnalytics);
  }

  _createClass(GoogleAnalytics, null, [{
    key: 'getCid',
    value: function getCid(cb) {
      var _this = this;

      if (this.cid) {
        return cb(this.cid);
      }

      require('getmac').getMac(function (error, macAddress) {
        return error ? cb(_this.cid = require('node-uuid').v4()) : cb(_this.cid = require('crypto').createHash('sha1').update(macAddress, 'utf8').digest('hex'));
      });
    }
  }, {
    key: 'sendEvent',
    value: function sendEvent(category, action, label, value) {
      var params = {
        t: 'event',
        ec: category,
        ea: action
      };
      if (label) {
        params.el = label;
      }
      if (value) {
        params.ev = value;
      }

      this.send(params);
    }
  }, {
    key: 'send',
    value: function send(params) {
      var _this2 = this;

      if (!atom.packages.getActivePackage('metrics')) {
        // If the metrics package is disabled, then user has opted out.
        return;
      }

      GoogleAnalytics.getCid(function (cid) {
        _lodash2['default'].extend(params, { cid: cid }, GoogleAnalytics.defaultParams());
        _this2.request('https://www.google-analytics.com/collect?' + _querystring2['default'].stringify(params));
      });
    }
  }, {
    key: 'request',
    value: function request(url) {
      if (!navigator.onLine) {
        return;
      }
      this.post(url);
    }
  }, {
    key: 'post',
    value: function post(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.send(null);
    }
  }, {
    key: 'defaultParams',
    value: function defaultParams() {
      // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
      return {
        v: 1,
        tid: 'UA-47615700-5'
      };
    }
  }]);

  return GoogleAnalytics;
})();

exports['default'] = GoogleAnalytics;

atom.packages.onDidActivatePackage(function (pkg) {
  if ('metrics' === pkg.name) {
    var buildPackage = atom.packages.getLoadedPackage('build');
    GoogleAnalytics.sendEvent('core', 'activated', buildPackage.metadata.version);
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2dvb2dsZS1hbmFseXRpY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFYyxRQUFROzs7OzJCQUNFLGFBQWE7Ozs7QUFIckMsV0FBVyxDQUFDOztJQUtTLGVBQWU7V0FBZixlQUFlOzBCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBQ3JCLGdCQUFDLEVBQUUsRUFBRTs7O0FBQ2hCLFVBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNaLGVBQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNyQjs7QUFFRCxhQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBSztBQUM5QyxlQUFPLEtBQUssR0FDVixFQUFFLENBQUMsTUFBSyxHQUFHLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQ3hDLEVBQUUsQ0FBQyxNQUFLLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7T0FDaEcsQ0FBQyxDQUFDO0tBQ0o7OztXQUVlLG1CQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUMvQyxVQUFNLE1BQU0sR0FBRztBQUNiLFNBQUMsRUFBRSxPQUFPO0FBQ1YsVUFBRSxFQUFFLFFBQVE7QUFDWixVQUFFLEVBQUUsTUFBTTtPQUNYLENBQUM7QUFDRixVQUFJLEtBQUssRUFBRTtBQUNULGNBQU0sQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO09BQ25CO0FBQ0QsVUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFNLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztPQUNuQjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ25COzs7V0FFVSxjQUFDLE1BQU0sRUFBRTs7O0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFOztBQUU5QyxlQUFPO09BQ1I7O0FBRUQscUJBQWUsQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDOUIsNEJBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztBQUNoRSxlQUFLLE9BQU8sQ0FBQywyQ0FBMkMsR0FBRyx5QkFBWSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztPQUMzRixDQUFDLENBQUM7S0FDSjs7O1dBRWEsaUJBQUMsR0FBRyxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3JCLGVBQU87T0FDUjtBQUNELFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEI7OztXQUVVLGNBQUMsR0FBRyxFQUFFO0FBQ2YsVUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztBQUNqQyxTQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0QixTQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2hCOzs7V0FFbUIseUJBQUc7O0FBRXJCLGFBQU87QUFDTCxTQUFDLEVBQUUsQ0FBQztBQUNKLFdBQUcsRUFBRSxlQUFlO09BQ3JCLENBQUM7S0FDSDs7O1NBNURrQixlQUFlOzs7cUJBQWYsZUFBZTs7QUErRHBDLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDMUMsTUFBSSxTQUFTLEtBQUssR0FBRyxDQUFDLElBQUksRUFBRTtBQUMxQixRQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdELG1CQUFlLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUMvRTtDQUNGLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9hbmR5Ly5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9nb29nbGUtYW5hbHl0aWNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgcXVlcnlzdHJpbmcgZnJvbSAncXVlcnlzdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHb29nbGVBbmFseXRpY3Mge1xuICBzdGF0aWMgZ2V0Q2lkKGNiKSB7XG4gICAgaWYgKHRoaXMuY2lkKSB7XG4gICAgICByZXR1cm4gY2IodGhpcy5jaWQpO1xuICAgIH1cblxuICAgIHJlcXVpcmUoJ2dldG1hYycpLmdldE1hYygoZXJyb3IsIG1hY0FkZHJlc3MpID0+IHtcbiAgICAgIHJldHVybiBlcnJvciA/XG4gICAgICAgIGNiKHRoaXMuY2lkID0gcmVxdWlyZSgnbm9kZS11dWlkJykudjQoKSkgOlxuICAgICAgICBjYih0aGlzLmNpZCA9IHJlcXVpcmUoJ2NyeXB0bycpLmNyZWF0ZUhhc2goJ3NoYTEnKS51cGRhdGUobWFjQWRkcmVzcywgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBzZW5kRXZlbnQoY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlKSB7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgdDogJ2V2ZW50JyxcbiAgICAgIGVjOiBjYXRlZ29yeSxcbiAgICAgIGVhOiBhY3Rpb25cbiAgICB9O1xuICAgIGlmIChsYWJlbCkge1xuICAgICAgcGFyYW1zLmVsID0gbGFiZWw7XG4gICAgfVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgcGFyYW1zLmV2ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5zZW5kKHBhcmFtcyk7XG4gIH1cblxuICBzdGF0aWMgc2VuZChwYXJhbXMpIHtcbiAgICBpZiAoIWF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgnbWV0cmljcycpKSB7XG4gICAgICAvLyBJZiB0aGUgbWV0cmljcyBwYWNrYWdlIGlzIGRpc2FibGVkLCB0aGVuIHVzZXIgaGFzIG9wdGVkIG91dC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBHb29nbGVBbmFseXRpY3MuZ2V0Q2lkKChjaWQpID0+IHtcbiAgICAgIF8uZXh0ZW5kKHBhcmFtcywgeyBjaWQ6IGNpZCB9LCBHb29nbGVBbmFseXRpY3MuZGVmYXVsdFBhcmFtcygpKTtcbiAgICAgIHRoaXMucmVxdWVzdCgnaHR0cHM6Ly93d3cuZ29vZ2xlLWFuYWx5dGljcy5jb20vY29sbGVjdD8nICsgcXVlcnlzdHJpbmcuc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHJlcXVlc3QodXJsKSB7XG4gICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucG9zdCh1cmwpO1xuICB9XG5cbiAgc3RhdGljIHBvc3QodXJsKSB7XG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwpO1xuICAgIHhoci5zZW5kKG51bGwpO1xuICB9XG5cbiAgc3RhdGljIGRlZmF1bHRQYXJhbXMoKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vYW5hbHl0aWNzL2Rldmd1aWRlcy9jb2xsZWN0aW9uL3Byb3RvY29sL3YxL3BhcmFtZXRlcnNcbiAgICByZXR1cm4ge1xuICAgICAgdjogMSxcbiAgICAgIHRpZDogJ1VBLTQ3NjE1NzAwLTUnXG4gICAgfTtcbiAgfVxufVxuXG5hdG9tLnBhY2thZ2VzLm9uRGlkQWN0aXZhdGVQYWNrYWdlKChwa2cpID0+IHtcbiAgaWYgKCdtZXRyaWNzJyA9PT0gcGtnLm5hbWUpIHtcbiAgICBjb25zdCBidWlsZFBhY2thZ2UgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ2J1aWxkJyk7XG4gICAgR29vZ2xlQW5hbHl0aWNzLnNlbmRFdmVudCgnY29yZScsICdhY3RpdmF0ZWQnLCBidWlsZFBhY2thZ2UubWV0YWRhdGEudmVyc2lvbik7XG4gIH1cbn0pO1xuIl19
//# sourceURL=/home/andy/.atom/packages/build/lib/google-analytics.js
