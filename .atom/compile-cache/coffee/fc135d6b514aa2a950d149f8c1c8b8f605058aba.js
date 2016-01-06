(function() {
  var Task;

  Task = require('atom').Task;

  module.exports = {
    startTask: function(config, callback) {
      var dirtied, removed, task, taskPath;
      dirtied = [];
      removed = [];
      taskPath = require.resolve('./tasks/load-paths-handler');
      task = Task.once(taskPath, config, function() {
        return callback({
          dirtied: dirtied,
          removed: removed
        });
      });
      task.on('load-paths:paths-found', function(paths) {
        return dirtied.push.apply(dirtied, paths);
      });
      task.on('load-paths:paths-lost', function(paths) {
        return removed.push.apply(removed, paths);
      });
      return task;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGF0aHMtbG9hZGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxJQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7QUFDVCxVQUFBLGdDQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQVUsRUFEVixDQUFBO0FBQUEsTUFFQSxRQUFBLEdBQVcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsNEJBQWhCLENBRlgsQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLENBQ0wsUUFESyxFQUVMLE1BRkssRUFHTCxTQUFBLEdBQUE7ZUFBRyxRQUFBLENBQVM7QUFBQSxVQUFDLFNBQUEsT0FBRDtBQUFBLFVBQVUsU0FBQSxPQUFWO1NBQVQsRUFBSDtNQUFBLENBSEssQ0FKUCxDQUFBO0FBQUEsTUFVQSxJQUFJLENBQUMsRUFBTCxDQUFRLHdCQUFSLEVBQWtDLFNBQUMsS0FBRCxHQUFBO2VBQVcsT0FBTyxDQUFDLElBQVIsZ0JBQWEsS0FBYixFQUFYO01BQUEsQ0FBbEMsQ0FWQSxDQUFBO0FBQUEsTUFXQSxJQUFJLENBQUMsRUFBTCxDQUFRLHVCQUFSLEVBQWlDLFNBQUMsS0FBRCxHQUFBO2VBQVcsT0FBTyxDQUFDLElBQVIsZ0JBQWEsS0FBYixFQUFYO01BQUEsQ0FBakMsQ0FYQSxDQUFBO2FBYUEsS0FkUztJQUFBLENBQVg7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/pigments/lib/paths-loader.coffee
