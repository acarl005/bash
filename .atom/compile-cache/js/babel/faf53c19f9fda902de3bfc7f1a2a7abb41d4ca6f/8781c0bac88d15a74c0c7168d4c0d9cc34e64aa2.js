Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _csonParser = require('cson-parser');

var _csonParser2 = _interopRequireDefault(_csonParser);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

'use babel';

function getConfig(file) {
  var realFile = _fs2['default'].realpathSync(file);
  delete require.cache[realFile];
  switch (_path2['default'].extname(file)) {
    case '.json':
      return require(realFile);

    case '.cson':
      return _csonParser2['default'].parse(_fs2['default'].readFileSync(realFile));

    case '.yml':
      return _jsYaml2['default'].safeLoad(_fs2['default'].readFileSync(realFile));
  }
}

function createBuildConfig(build, name) {
  return {
    name: 'Custom: ' + name,
    exec: build.cmd,
    env: build.env,
    args: build.args,
    cwd: build.cwd,
    sh: build.sh,
    errorMatch: build.errorMatch,
    keymap: build.keymap
  };
}

var CustomFile = (function (_EventEmitter) {
  _inherits(CustomFile, _EventEmitter);

  function CustomFile(cwd) {
    _classCallCheck(this, CustomFile);

    _get(Object.getPrototypeOf(CustomFile.prototype), 'constructor', this).call(this);
    this.cwd = cwd;
    this.fileWatchers = [];
  }

  _createClass(CustomFile, [{
    key: 'destructor',
    value: function destructor() {
      this.fileWatchers.forEach(function (fw) {
        return fw.close();
      });
    }
  }, {
    key: 'getNiceName',
    value: function getNiceName() {
      return 'Custom file';
    }
  }, {
    key: 'isEligible',
    value: function isEligible() {
      var _this = this;

      this.files = ['.atom-build.json', '.atom-build.cson', '.atom-build.yml'].map(function (file) {
        return _path2['default'].join(_this.cwd, file);
      }).filter(_fs2['default'].existsSync);
      return 0 < this.files.length;
    }
  }, {
    key: 'settings',
    value: function settings() {
      var _this2 = this;

      this.fileWatchers.forEach(function (fw) {
        return fw.close();
      });
      this.fileWatchers = this.files.map(function (file) {
        return _fs2['default'].watch(file, function () {
          return _this2.emit('refresh');
        });
      });

      var config = [];
      this.files.map(getConfig).forEach(function (build) {
        config.push.apply(config, [createBuildConfig(build, build.name || 'default')].concat(_toConsumableArray(_lodash2['default'].map(build.targets, function (target, name) {
          return createBuildConfig(target, name);
        }))));
      });

      return config;
    }
  }]);

  return CustomFile;
})(_events2['default']);

exports['default'] = CustomFile;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2F0b20tYnVpbGQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFaUIsTUFBTTs7OztrQkFDUixJQUFJOzs7O3NCQUNMLFFBQVE7Ozs7MEJBQ0wsYUFBYTs7OztzQkFDYixTQUFTOzs7O3NCQUNELFFBQVE7Ozs7QUFQakMsV0FBVyxDQUFDOztBQVNaLFNBQVMsU0FBUyxDQUFDLElBQUksRUFBRTtBQUN2QixNQUFNLFFBQVEsR0FBRyxnQkFBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsU0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLFVBQVEsa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQztBQUN4QixTQUFLLE9BQU87QUFDVixhQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFBQSxBQUUzQixTQUFLLE9BQU87QUFDVixhQUFPLHdCQUFLLEtBQUssQ0FBQyxnQkFBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7QUFBQSxBQUUvQyxTQUFLLE1BQU07QUFDVCxhQUFPLG9CQUFLLFFBQVEsQ0FBQyxnQkFBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUFBLEdBQ25EO0NBQ0Y7O0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3RDLFNBQU87QUFDTCxRQUFJLEVBQUUsVUFBVSxHQUFHLElBQUk7QUFDdkIsUUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHO0FBQ2YsT0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO0FBQ2QsUUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO0FBQ2hCLE9BQUcsRUFBRSxLQUFLLENBQUMsR0FBRztBQUNkLE1BQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNaLGNBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtBQUM1QixVQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07R0FDckIsQ0FBQztDQUNIOztJQUVvQixVQUFVO1lBQVYsVUFBVTs7QUFDbEIsV0FEUSxVQUFVLENBQ2pCLEdBQUcsRUFBRTswQkFERSxVQUFVOztBQUUzQiwrQkFGaUIsVUFBVSw2Q0FFbkI7QUFDUixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0dBQ3hCOztlQUxrQixVQUFVOztXQU9uQixzQkFBRztBQUNYLFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtlQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUU7T0FBQSxDQUFDLENBQUM7S0FDN0M7OztXQUVVLHVCQUFHO0FBQ1osYUFBTyxhQUFhLENBQUM7S0FDdEI7OztXQUVTLHNCQUFHOzs7QUFDWCxVQUFJLENBQUMsS0FBSyxHQUFHLENBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLENBQUUsQ0FDdkUsR0FBRyxDQUFDLFVBQUEsSUFBSTtlQUFJLGtCQUFLLElBQUksQ0FBQyxNQUFLLEdBQUcsRUFBRSxJQUFJLENBQUM7T0FBQSxDQUFDLENBQ3RDLE1BQU0sQ0FBQyxnQkFBRyxVQUFVLENBQUMsQ0FBQztBQUN6QixhQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztLQUM5Qjs7O1dBRU8sb0JBQUc7OztBQUNULFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtlQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUU7T0FBQSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7ZUFBSSxnQkFBRyxLQUFLLENBQUMsSUFBSSxFQUFFO2lCQUFNLE9BQUssSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUFBLENBQUM7T0FBQSxDQUFDLENBQUM7O0FBRXZGLFVBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDekMsY0FBTSxDQUFDLElBQUksTUFBQSxDQUFYLE1BQU0sR0FDSixpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsNEJBQzlDLG9CQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFVBQUMsTUFBTSxFQUFFLElBQUk7aUJBQUssaUJBQWlCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztTQUFBLENBQUMsR0FDM0UsQ0FBQztPQUNILENBQUMsQ0FBQzs7QUFFSCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7U0FuQ2tCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2F0b20tYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBDU09OIGZyb20gJ2Nzb24tcGFyc2VyJztcbmltcG9ydCB5YW1sIGZyb20gJ2pzLXlhbWwnO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnO1xuXG5mdW5jdGlvbiBnZXRDb25maWcoZmlsZSkge1xuICBjb25zdCByZWFsRmlsZSA9IGZzLnJlYWxwYXRoU3luYyhmaWxlKTtcbiAgZGVsZXRlIHJlcXVpcmUuY2FjaGVbcmVhbEZpbGVdO1xuICBzd2l0Y2ggKHBhdGguZXh0bmFtZShmaWxlKSkge1xuICAgIGNhc2UgJy5qc29uJzpcbiAgICAgIHJldHVybiByZXF1aXJlKHJlYWxGaWxlKTtcblxuICAgIGNhc2UgJy5jc29uJzpcbiAgICAgIHJldHVybiBDU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhyZWFsRmlsZSkpO1xuXG4gICAgY2FzZSAnLnltbCc6XG4gICAgICByZXR1cm4geWFtbC5zYWZlTG9hZChmcy5yZWFkRmlsZVN5bmMocmVhbEZpbGUpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVCdWlsZENvbmZpZyhidWlsZCwgbmFtZSkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdDdXN0b206ICcgKyBuYW1lLFxuICAgIGV4ZWM6IGJ1aWxkLmNtZCxcbiAgICBlbnY6IGJ1aWxkLmVudixcbiAgICBhcmdzOiBidWlsZC5hcmdzLFxuICAgIGN3ZDogYnVpbGQuY3dkLFxuICAgIHNoOiBidWlsZC5zaCxcbiAgICBlcnJvck1hdGNoOiBidWlsZC5lcnJvck1hdGNoLFxuICAgIGtleW1hcDogYnVpbGQua2V5bWFwXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1c3RvbUZpbGUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3Rvcihjd2QpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY3dkID0gY3dkO1xuICAgIHRoaXMuZmlsZVdhdGNoZXJzID0gW107XG4gIH1cblxuICBkZXN0cnVjdG9yKCkge1xuICAgIHRoaXMuZmlsZVdhdGNoZXJzLmZvckVhY2goZncgPT4gZncuY2xvc2UoKSk7XG4gIH1cblxuICBnZXROaWNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ0N1c3RvbSBmaWxlJztcbiAgfVxuXG4gIGlzRWxpZ2libGUoKSB7XG4gICAgdGhpcy5maWxlcyA9IFsgJy5hdG9tLWJ1aWxkLmpzb24nLCAnLmF0b20tYnVpbGQuY3NvbicsICcuYXRvbS1idWlsZC55bWwnIF1cbiAgICAgIC5tYXAoZmlsZSA9PiBwYXRoLmpvaW4odGhpcy5jd2QsIGZpbGUpKVxuICAgICAgLmZpbHRlcihmcy5leGlzdHNTeW5jKTtcbiAgICByZXR1cm4gMCA8IHRoaXMuZmlsZXMubGVuZ3RoO1xuICB9XG5cbiAgc2V0dGluZ3MoKSB7XG4gICAgdGhpcy5maWxlV2F0Y2hlcnMuZm9yRWFjaChmdyA9PiBmdy5jbG9zZSgpKTtcbiAgICB0aGlzLmZpbGVXYXRjaGVycyA9IHRoaXMuZmlsZXMubWFwKGZpbGUgPT4gZnMud2F0Y2goZmlsZSwgKCkgPT4gdGhpcy5lbWl0KCdyZWZyZXNoJykpKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IFtdO1xuICAgIHRoaXMuZmlsZXMubWFwKGdldENvbmZpZykuZm9yRWFjaChidWlsZCA9PiB7XG4gICAgICBjb25maWcucHVzaChcbiAgICAgICAgY3JlYXRlQnVpbGRDb25maWcoYnVpbGQsIGJ1aWxkLm5hbWUgfHwgJ2RlZmF1bHQnKSxcbiAgICAgICAgLi4uXy5tYXAoYnVpbGQudGFyZ2V0cywgKHRhcmdldCwgbmFtZSkgPT4gY3JlYXRlQnVpbGRDb25maWcodGFyZ2V0LCBuYW1lKSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29uZmlnO1xuICB9XG59XG4iXX0=
//# sourceURL=/home/andy/.atom/packages/build/lib/atom-build.js
