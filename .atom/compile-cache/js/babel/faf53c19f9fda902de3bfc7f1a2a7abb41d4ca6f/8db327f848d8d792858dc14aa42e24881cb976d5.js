Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _xregexp = require('xregexp');

var _events = require('events');

var _googleAnalytics = require('./google-analytics');

var _googleAnalytics2 = _interopRequireDefault(_googleAnalytics);

'use babel';

var ErrorMatcher = (function (_EventEmitter) {
  _inherits(ErrorMatcher, _EventEmitter);

  function ErrorMatcher() {
    _classCallCheck(this, ErrorMatcher);

    _get(Object.getPrototypeOf(ErrorMatcher.prototype), 'constructor', this).call(this);
    this.regex = null;
    this.cwd = null;
    this.stdout = null;
    this.stderr = null;
    this.currentMatch = [];
    this.firstMatchId = null;

    atom.commands.add('atom-workspace', 'build:error-match', this.match.bind(this));
    atom.commands.add('atom-workspace', 'build:error-match-first', this.matchFirst.bind(this));
  }

  _createClass(ErrorMatcher, [{
    key: '_gotoNext',
    value: function _gotoNext() {
      if (0 === this.currentMatch.length) {
        return;
      }

      this.goto(this.currentMatch[0].id);
    }
  }, {
    key: 'goto',
    value: function goto(id) {
      var _this = this;

      var match = this.currentMatch.find(function (m) {
        return m.id === id;
      });
      if (!match) {
        return this.emit('error', 'Can\'t find match with id ' + id);
      }

      // rotate to next match
      while (this.currentMatch[0] !== match) {
        this.currentMatch.push(this.currentMatch.shift());
      }
      this.currentMatch.push(this.currentMatch.shift());

      var file = match.file;
      if (!file) {
        return this.emit('error', 'Did not match any file. Don\'t know what to open.');
      }

      if (!_path2['default'].isAbsolute(file)) {
        file = this.cwd + _path2['default'].sep + file;
      }

      var row = match.line ? match.line - 1 : 0; /* Because atom is zero-based */
      var col = match.col ? match.col - 1 : 0; /* Because atom is zero-based */

      _fs2['default'].exists(file, function (exists) {
        if (!exists) {
          return _this.emit('error', 'Matched file does not exist: ' + file);
        }
        atom.workspace.open(file, {
          initialLine: row,
          initialColumn: col,
          searchAllPanes: true
        });
        _this.emit('matched', match.id);
      });
    }
  }, {
    key: '_parse',
    value: function _parse() {
      var _this2 = this;

      this.currentMatch = [];
      var self = this;
      var matchFunction = function matchFunction(match, i, string, regex) {
        match.id = 'error-match-' + self.regex.indexOf(regex) + '-' + i;
        this.push(match);
      };
      this.regex.forEach(function (regex) {
        _xregexp.XRegExp.forEach(_this2.output, regex, matchFunction, _this2.currentMatch);
      });

      this.currentMatch.sort(function (a, b) {
        return a.index - b.index;
      });

      this.firstMatchId = this.currentMatch.length > 0 ? this.currentMatch[0].id : null;

      this.currentMatch.forEach(function (match) {
        return _this2.emit('match', match[0], match.id);
      });
    }
  }, {
    key: 'set',
    value: function set(regex, cwd, output) {
      var _this3 = this;

      regex = regex || [];
      regex = regex instanceof Array ? regex : [regex];

      this.regex = regex.map(function (r) {
        try {
          return (0, _xregexp.XRegExp)(r);
        } catch (err) {
          _this3.emit('error', 'Error parsing regex. ' + err.message);
          return null;
        }
      }).filter(Boolean);

      this.cwd = cwd;
      this.output = output;
      this.currentMatch = [];

      this._parse();
    }
  }, {
    key: 'match',
    value: function match() {
      _googleAnalytics2['default'].sendEvent('errorMatch', 'match');

      this._gotoNext();
    }
  }, {
    key: 'matchFirst',
    value: function matchFirst() {
      _googleAnalytics2['default'].sendEvent('errorMatch', 'first');

      if (this.firstMatchId) {
        this.goto(this.firstMatchId);
      }
    }
  }, {
    key: 'hasMatch',
    value: function hasMatch() {
      return 0 !== this.currentMatch.length;
    }
  }]);

  return ErrorMatcher;
})(_events.EventEmitter);

exports['default'] = ErrorMatcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2Vycm9yLW1hdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7a0JBRWUsSUFBSTs7OztvQkFDRixNQUFNOzs7O3VCQUNDLFNBQVM7O3NCQUNKLFFBQVE7OytCQUNULG9CQUFvQjs7OztBQU5oRCxXQUFXLENBQUM7O0lBUVMsWUFBWTtZQUFaLFlBQVk7O0FBRXBCLFdBRlEsWUFBWSxHQUVqQjswQkFGSyxZQUFZOztBQUc3QiwrQkFIaUIsWUFBWSw2Q0FHckI7QUFDUixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNoQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzs7QUFFekIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoRixRQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSx5QkFBeUIsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQzVGOztlQWJrQixZQUFZOztXQWV0QixxQkFBRztBQUNWLFVBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO0FBQ2xDLGVBQU87T0FDUjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDcEM7OztX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O0FBQ1gsbUNBQWdCLFNBQVMsQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRWpELFVBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtBQUNyQixZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztPQUM5QjtLQUNGOzs7V0FFTyxvQkFBRztBQUNULGFBQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO0tBQ3ZDOzs7U0FsSGtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2Vycm9yLW1hdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgWFJlZ0V4cCB9IGZyb20gJ3hyZWdleHAnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCBHb29nbGVBbmFseXRpY3MgZnJvbSAnLi9nb29nbGUtYW5hbHl0aWNzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JNYXRjaGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucmVnZXggPSBudWxsO1xuICAgIHRoaXMuY3dkID0gbnVsbDtcbiAgICB0aGlzLnN0ZG91dCA9IG51bGw7XG4gICAgdGhpcy5zdGRlcnIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudE1hdGNoID0gW107XG4gICAgdGhpcy5maXJzdE1hdGNoSWQgPSBudWxsO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOmVycm9yLW1hdGNoJywgdGhpcy5tYXRjaC5iaW5kKHRoaXMpKTtcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6ZXJyb3ItbWF0Y2gtZmlyc3QnLCB0aGlzLm1hdGNoRmlyc3QuYmluZCh0aGlzKSk7XG4gIH1cblxuICBfZ290b05leHQoKSB7XG4gICAgaWYgKDAgPT09IHRoaXMuY3VycmVudE1hdGNoLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZ290byh0aGlzLmN1cnJlbnRNYXRjaFswXS5pZCk7XG4gIH1cblxuICBnb3RvKGlkKSB7XG4gICAgY29uc3QgbWF0Y2ggPSB0aGlzLmN1cnJlbnRNYXRjaC5maW5kKG0gPT4gbS5pZCA9PT0gaWQpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiB0aGlzLmVtaXQoJ2Vycm9yJywgJ0NhblxcJ3QgZmluZCBtYXRjaCB3aXRoIGlkICcgKyBpZCk7XG4gICAgfVxuXG4gICAgLy8gcm90YXRlIHRvIG5leHQgbWF0Y2hcbiAgICB3aGlsZSAodGhpcy5jdXJyZW50TWF0Y2hbMF0gIT09IG1hdGNoKSB7XG4gICAgICB0aGlzLmN1cnJlbnRNYXRjaC5wdXNoKHRoaXMuY3VycmVudE1hdGNoLnNoaWZ0KCkpO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRNYXRjaC5wdXNoKHRoaXMuY3VycmVudE1hdGNoLnNoaWZ0KCkpO1xuXG4gICAgbGV0IGZpbGUgPSBtYXRjaC5maWxlO1xuICAgIGlmICghZmlsZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW1pdCgnZXJyb3InLCAnRGlkIG5vdCBtYXRjaCBhbnkgZmlsZS4gRG9uXFwndCBrbm93IHdoYXQgdG8gb3Blbi4nKTtcbiAgICB9XG5cbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZShmaWxlKSkge1xuICAgICAgZmlsZSA9IHRoaXMuY3dkICsgcGF0aC5zZXAgKyBmaWxlO1xuICAgIH1cblxuICAgIGNvbnN0IHJvdyA9IG1hdGNoLmxpbmUgPyBtYXRjaC5saW5lIC0gMSA6IDA7IC8qIEJlY2F1c2UgYXRvbSBpcyB6ZXJvLWJhc2VkICovXG4gICAgY29uc3QgY29sID0gbWF0Y2guY29sID8gbWF0Y2guY29sIC0gMSA6IDA7IC8qIEJlY2F1c2UgYXRvbSBpcyB6ZXJvLWJhc2VkICovXG5cbiAgICBmcy5leGlzdHMoZmlsZSwgKGV4aXN0cykgPT4ge1xuICAgICAgaWYgKCFleGlzdHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1pdCgnZXJyb3InLCAnTWF0Y2hlZCBmaWxlIGRvZXMgbm90IGV4aXN0OiAnICsgZmlsZSk7XG4gICAgICB9XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUsIHtcbiAgICAgICAgaW5pdGlhbExpbmU6IHJvdyxcbiAgICAgICAgaW5pdGlhbENvbHVtbjogY29sLFxuICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmVtaXQoJ21hdGNoZWQnLCBtYXRjaC5pZCk7XG4gICAgfSk7XG4gIH1cblxuICBfcGFyc2UoKSB7XG4gICAgdGhpcy5jdXJyZW50TWF0Y2ggPSBbXTtcbiAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICBjb25zdCBtYXRjaEZ1bmN0aW9uID0gZnVuY3Rpb24gKG1hdGNoLCBpLCBzdHJpbmcsIHJlZ2V4KSB7XG4gICAgICBtYXRjaC5pZCA9ICdlcnJvci1tYXRjaC0nICsgc2VsZi5yZWdleC5pbmRleE9mKHJlZ2V4KSArICctJyArIGk7XG4gICAgICB0aGlzLnB1c2gobWF0Y2gpO1xuICAgIH07XG4gICAgdGhpcy5yZWdleC5mb3JFYWNoKChyZWdleCkgPT4ge1xuICAgICAgWFJlZ0V4cC5mb3JFYWNoKHRoaXMub3V0cHV0LCByZWdleCwgbWF0Y2hGdW5jdGlvbiwgdGhpcy5jdXJyZW50TWF0Y2gpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jdXJyZW50TWF0Y2guc29ydCgoYSwgYikgPT4gYS5pbmRleCAtIGIuaW5kZXgpO1xuXG4gICAgdGhpcy5maXJzdE1hdGNoSWQgPSAodGhpcy5jdXJyZW50TWF0Y2gubGVuZ3RoID4gMCkgPyB0aGlzLmN1cnJlbnRNYXRjaFswXS5pZCA6IG51bGw7XG5cbiAgICB0aGlzLmN1cnJlbnRNYXRjaC5mb3JFYWNoKG1hdGNoID0+IHRoaXMuZW1pdCgnbWF0Y2gnLCBtYXRjaFswXSwgbWF0Y2guaWQpKTtcbiAgfVxuXG4gIHNldChyZWdleCwgY3dkLCBvdXRwdXQpIHtcbiAgICByZWdleCA9IHJlZ2V4IHx8IFtdO1xuICAgIHJlZ2V4ID0gKHJlZ2V4IGluc3RhbmNlb2YgQXJyYXkpID8gcmVnZXggOiBbIHJlZ2V4IF07XG5cbiAgICB0aGlzLnJlZ2V4ID0gcmVnZXgubWFwKChyKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gWFJlZ0V4cChyKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgJ0Vycm9yIHBhcnNpbmcgcmVnZXguICcgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0pLmZpbHRlcihCb29sZWFuKTtcblxuICAgIHRoaXMuY3dkID0gY3dkO1xuICAgIHRoaXMub3V0cHV0ID0gb3V0cHV0O1xuICAgIHRoaXMuY3VycmVudE1hdGNoID0gW107XG5cbiAgICB0aGlzLl9wYXJzZSgpO1xuICB9XG5cbiAgbWF0Y2goKSB7XG4gICAgR29vZ2xlQW5hbHl0aWNzLnNlbmRFdmVudCgnZXJyb3JNYXRjaCcsICdtYXRjaCcpO1xuXG4gICAgdGhpcy5fZ290b05leHQoKTtcbiAgfVxuXG4gIG1hdGNoRmlyc3QoKSB7XG4gICAgR29vZ2xlQW5hbHl0aWNzLnNlbmRFdmVudCgnZXJyb3JNYXRjaCcsICdmaXJzdCcpO1xuXG4gICAgaWYgKHRoaXMuZmlyc3RNYXRjaElkKSB7XG4gICAgICB0aGlzLmdvdG8odGhpcy5maXJzdE1hdGNoSWQpO1xuICAgIH1cbiAgfVxuXG4gIGhhc01hdGNoKCkge1xuICAgIHJldHVybiAwICE9PSB0aGlzLmN1cnJlbnRNYXRjaC5sZW5ndGg7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/home/andy/.atom/packages/build/lib/error-matcher.js
