(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = function() {
    var DEFINITIONS, VARIABLE_PATTERN, VARIABLE_TYPES, path;
    path = require('path');
    VARIABLE_PATTERN = '\\{{ VARIABLE }}[\\s]*\\:[\\s]*([^\\;\\n]+)[\\;|\\n]';
    VARIABLE_TYPES = [
      {
        type: 'sass',
        extensions: ['.scss', '.sass'],
        regExp: /([\$])([\w0-9-_]+)/i
      }, {
        type: 'less',
        extensions: ['.less'],
        regExp: /([\@])([\w0-9-_]+)/i
      }, {
        type: 'stylus',
        extensions: ['.stylus', '.styl'],
        regExp: /([\$])([\w0-9-_]+)/i
      }
    ];
    DEFINITIONS = {};
    return {
      find: function(string, pathName) {
        var SmartVariable, extensions, regExp, type, _fn, _i, _j, _len, _len1, _match, _matches, _ref, _ref1, _variables;
        SmartVariable = this;
        _variables = [];
        for (_i = 0, _len = VARIABLE_TYPES.length; _i < _len; _i++) {
          _ref = VARIABLE_TYPES[_i], type = _ref.type, extensions = _ref.extensions, regExp = _ref.regExp;
          _matches = string.match(new RegExp(regExp.source, 'ig'));
          if (!_matches) {
            continue;
          }
          if (pathName) {
            if (_ref1 = path.extname(pathName), __indexOf.call(extensions, _ref1) < 0) {
              continue;
            }
          }
          _fn = function(type, extensions, _match) {
            var _index;
            if ((_index = string.indexOf(_match)) === -1) {
              return;
            }
            _variables.push({
              match: _match,
              type: type,
              extensions: extensions,
              start: _index,
              end: _index + _match.length,
              getDefinition: function() {
                return SmartVariable.getDefinition(this);
              },
              isVariable: true
            });
            return string = string.replace(_match, (new Array(_match.length + 1)).join(' '));
          };
          for (_j = 0, _len1 = _matches.length; _j < _len1; _j++) {
            _match = _matches[_j];
            _fn(type, extensions, _match);
          }
        }
        return _variables;
      },
      getDefinition: function(variable, initial) {
        var extensions, match, type, _definition, _options, _pointer, _regExp, _results;
        match = variable.match, type = variable.type, extensions = variable.extensions;
        _regExp = new RegExp(VARIABLE_PATTERN.replace('{{ VARIABLE }}', match));
        if (_definition = DEFINITIONS[match]) {
          if (initial == null) {
            initial = _definition;
          }
          _pointer = _definition.pointer;
          return atom.project.bufferForPath(_pointer.filePath).then((function(_this) {
            return function(buffer) {
              var _found, _match, _text;
              _text = buffer.getTextInRange(_pointer.range);
              _match = _text.match(_regExp);
              if (!_match) {
                DEFINITIONS[match] = null;
                return _this.getDefinition(variable, initial);
              }
              _definition.value = _match[1];
              _found = (_this.find(_match[1], _pointer.filePath))[0];
              if (_found && _found.isVariable) {
                return _this.getDefinition(_found, initial);
              }
              return {
                value: _definition.value,
                variable: _definition.variable,
                type: _definition.type,
                pointer: initial.pointer
              };
            };
          })(this))["catch"]((function(_this) {
            return function(error) {
              return console.error(error);
            };
          })(this));
        }
        _options = {
          paths: (function() {
            var _extension, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = extensions.length; _i < _len; _i++) {
              _extension = extensions[_i];
              _results.push("**/*" + _extension);
            }
            return _results;
          })()
        };
        _results = [];
        return atom.workspace.scan(_regExp, _options, function(result) {
          return _results.push(result);
        }).then((function(_this) {
          return function() {
            var i, pathFragment, result, _bestMatch, _bestMatchHits, _i, _j, _len, _len1, _match, _pathFragments, _targetFragments, _targetPath, _thisMatchHits;
            _targetPath = atom.workspace.getActivePaneItem().getPath();
            _targetFragments = _targetPath.split(path.sep);
            _bestMatch = null;
            _bestMatchHits = 0;
            for (_i = 0, _len = _results.length; _i < _len; _i++) {
              result = _results[_i];
              _thisMatchHits = 0;
              _pathFragments = result.filePath.split(path.sep);
              for (i = _j = 0, _len1 = _pathFragments.length; _j < _len1; i = ++_j) {
                pathFragment = _pathFragments[i];
                if (pathFragment === _targetFragments[i]) {
                  _thisMatchHits++;
                }
              }
              if (_thisMatchHits > _bestMatchHits) {
                _bestMatch = result;
                _bestMatchHits = _thisMatchHits;
              }
            }
            if (!(_bestMatch && (_match = _bestMatch.matches[0]))) {
              return;
            }
            DEFINITIONS[match] = {
              value: null,
              variable: match,
              type: type,
              pointer: {
                filePath: _bestMatch.filePath,
                range: _match.range
              }
            };
            if (initial == null) {
              initial = DEFINITIONS[match];
            }
            return _this.getDefinition(variable, initial);
          };
        })(this))["catch"]((function(_this) {
          return function(error) {
            return console.error(error);
          };
        })(this));
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL21vZHVsZXMvU21hcnRWYXJpYWJsZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFJSTtBQUFBLE1BQUEscUpBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQUE7QUFDYixRQUFBLG1EQUFBO0FBQUEsSUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBO0FBQUEsSUFLQSxnQkFBQSxHQUFtQixzREFMbkIsQ0FBQTtBQUFBLElBT0EsY0FBQSxHQUFpQjtNQUdiO0FBQUEsUUFDSSxJQUFBLEVBQU0sTUFEVjtBQUFBLFFBRUksVUFBQSxFQUFZLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FGaEI7QUFBQSxRQUdJLE1BQUEsRUFBUSxxQkFIWjtPQUhhLEVBV2I7QUFBQSxRQUNJLElBQUEsRUFBTSxNQURWO0FBQUEsUUFFSSxVQUFBLEVBQVksQ0FBQyxPQUFELENBRmhCO0FBQUEsUUFHSSxNQUFBLEVBQVEscUJBSFo7T0FYYSxFQW1CYjtBQUFBLFFBQ0ksSUFBQSxFQUFNLFFBRFY7QUFBQSxRQUVJLFVBQUEsRUFBWSxDQUFDLFNBQUQsRUFBWSxPQUFaLENBRmhCO0FBQUEsUUFHSSxNQUFBLEVBQVEscUJBSFo7T0FuQmE7S0FQakIsQ0FBQTtBQUFBLElBb0NBLFdBQUEsR0FBYyxFQXBDZCxDQUFBO0FBeUNBLFdBQU87QUFBQSxNQU9ILElBQUEsRUFBTSxTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7QUFDRixZQUFBLDRHQUFBO0FBQUEsUUFBQSxhQUFBLEdBQWdCLElBQWhCLENBQUE7QUFBQSxRQUNBLFVBQUEsR0FBYSxFQURiLENBQUE7QUFHQSxhQUFBLHFEQUFBLEdBQUE7QUFDSSxxQ0FEQyxZQUFBLE1BQU0sa0JBQUEsWUFB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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/modules/SmartVariable.coffee
