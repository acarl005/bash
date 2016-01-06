(function() {
  var Task;

  Task = require('atom').Task;

  module.exports = {
    startTask: function(paths, registry, callback) {
      var results, taskPath;
      results = [];
      taskPath = require.resolve('./tasks/scan-paths-handler');
      this.task = Task.once(taskPath, [paths, registry.serialize()], (function(_this) {
        return function() {
          _this.task = null;
          return callback(results);
        };
      })(this));
      this.task.on('scan-paths:path-scanned', function(result) {
        return results = results.concat(result);
      });
      return this.task;
    },
    terminateRunningTask: function() {
      var _ref;
      return (_ref = this.task) != null ? _ref.terminate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGF0aHMtc2Nhbm5lci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLE1BQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxTQUFBLEVBQVcsU0FBQyxLQUFELEVBQVEsUUFBUixFQUFrQixRQUFsQixHQUFBO0FBQ1QsVUFBQSxpQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLE9BQU8sQ0FBQyxPQUFSLENBQWdCLDRCQUFoQixDQURYLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FDTixRQURNLEVBRU4sQ0FBQyxLQUFELEVBQVEsUUFBUSxDQUFDLFNBQVQsQ0FBQSxDQUFSLENBRk0sRUFHTixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ0UsVUFBQSxLQUFDLENBQUEsSUFBRCxHQUFRLElBQVIsQ0FBQTtpQkFDQSxRQUFBLENBQVMsT0FBVCxFQUZGO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FITSxDQUhSLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxJQUFJLENBQUMsRUFBTixDQUFTLHlCQUFULEVBQW9DLFNBQUMsTUFBRCxHQUFBO2VBQ2xDLE9BQUEsR0FBVSxPQUFPLENBQUMsTUFBUixDQUFlLE1BQWYsRUFEd0I7TUFBQSxDQUFwQyxDQVhBLENBQUE7YUFjQSxJQUFDLENBQUEsS0FmUTtJQUFBLENBQVg7QUFBQSxJQWlCQSxvQkFBQSxFQUFzQixTQUFBLEdBQUE7QUFDcEIsVUFBQSxJQUFBOzhDQUFLLENBQUUsU0FBUCxDQUFBLFdBRG9CO0lBQUEsQ0FqQnRCO0dBSEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/pigments/lib/paths-scanner.coffee
