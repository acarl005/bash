(function() {
  var ScriptOptions, _;

  _ = require('underscore');

  module.exports = ScriptOptions = (function() {
    function ScriptOptions() {}

    ScriptOptions.prototype.workingDirectory = null;

    ScriptOptions.prototype.cmd = null;

    ScriptOptions.prototype.cmdArgs = [];

    ScriptOptions.prototype.env = null;

    ScriptOptions.prototype.scriptArgs = [];

    ScriptOptions.prototype.getEnv = function() {
      var key, mapping, pair, value, _i, _len, _ref, _ref1;
      if ((this.env == null) || this.env === '') {
        return {};
      }
      mapping = {};
      _ref = this.env.trim().split(';');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pair = _ref[_i];
        _ref1 = pair.split('=', 2), key = _ref1[0], value = _ref1[1];
        mapping[key] = ("" + value).replace(/"((?:[^"\\]|\\"|\\[^"])+)"/, '$1');
        mapping[key] = mapping[key].replace(/'((?:[^'\\]|\\'|\\[^'])+)'/, '$1');
      }
      return mapping;
    };

    ScriptOptions.prototype.mergedEnv = function(otherEnv) {
      var key, mergedEnv, otherCopy, value;
      otherCopy = _.extend({}, otherEnv);
      mergedEnv = _.extend(otherCopy, this.getEnv());
      for (key in mergedEnv) {
        value = mergedEnv[key];
        mergedEnv[key] = ("" + value).replace(/"((?:[^"\\]|\\"|\\[^"])+)"/, '$1');
        mergedEnv[key] = mergedEnv[key].replace(/'((?:[^'\\]|\\'|\\[^'])+)'/, '$1');
      }
      return mergedEnv;
    };

    return ScriptOptions;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3NjcmlwdC1vcHRpb25zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUFKLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNOytCQUNKOztBQUFBLDRCQUFBLGdCQUFBLEdBQWtCLElBQWxCLENBQUE7O0FBQUEsNEJBQ0EsR0FBQSxHQUFLLElBREwsQ0FBQTs7QUFBQSw0QkFFQSxPQUFBLEdBQVMsRUFGVCxDQUFBOztBQUFBLDRCQUdBLEdBQUEsR0FBSyxJQUhMLENBQUE7O0FBQUEsNEJBSUEsVUFBQSxHQUFZLEVBSlosQ0FBQTs7QUFBQSw0QkFVQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxnREFBQTtBQUFBLE1BQUEsSUFBaUIsa0JBQUosSUFBYSxJQUFDLENBQUEsR0FBRCxLQUFRLEVBQWxDO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FBQTtBQUFBLE1BRUEsT0FBQSxHQUFVLEVBRlYsQ0FBQTtBQUlBO0FBQUEsV0FBQSwyQ0FBQTt3QkFBQTtBQUNFLFFBQUEsUUFBZSxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsRUFBZ0IsQ0FBaEIsQ0FBZixFQUFDLGNBQUQsRUFBTSxnQkFBTixDQUFBO0FBQUEsUUFDQSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWUsQ0FBQSxFQUFBLEdBQUcsS0FBSCxDQUFVLENBQUMsT0FBWCxDQUFtQiw0QkFBbkIsRUFBaUQsSUFBakQsQ0FEZixDQUFBO0FBQUEsUUFFQSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWUsT0FBUSxDQUFBLEdBQUEsQ0FBSSxDQUFDLE9BQWIsQ0FBcUIsNEJBQXJCLEVBQW1ELElBQW5ELENBRmYsQ0FERjtBQUFBLE9BSkE7YUFVQSxRQVhNO0lBQUEsQ0FWUixDQUFBOztBQUFBLDRCQTRCQSxTQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDVCxVQUFBLGdDQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFULEVBQWEsUUFBYixDQUFaLENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLFNBQVQsRUFBb0IsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFwQixDQURaLENBQUE7QUFHQSxXQUFBLGdCQUFBOytCQUFBO0FBQ0UsUUFBQSxTQUFVLENBQUEsR0FBQSxDQUFWLEdBQWlCLENBQUEsRUFBQSxHQUFHLEtBQUgsQ0FBVSxDQUFDLE9BQVgsQ0FBbUIsNEJBQW5CLEVBQWlELElBQWpELENBQWpCLENBQUE7QUFBQSxRQUNBLFNBQVUsQ0FBQSxHQUFBLENBQVYsR0FBaUIsU0FBVSxDQUFBLEdBQUEsQ0FBSSxDQUFDLE9BQWYsQ0FBdUIsNEJBQXZCLEVBQXFELElBQXJELENBRGpCLENBREY7QUFBQSxPQUhBO2FBT0EsVUFSUztJQUFBLENBNUJYLENBQUE7O3lCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/script/lib/script-options.coffee
