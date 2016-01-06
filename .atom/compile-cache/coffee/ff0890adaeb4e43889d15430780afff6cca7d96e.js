(function() {
  var __slice = [].slice;

  module.exports = function() {
    return {
      bindings: {},
      emit: function() {
        var args, event, _bindings, _callback, _i, _len;
        event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (!(_bindings = this.bindings[event])) {
          return;
        }
        for (_i = 0, _len = _bindings.length; _i < _len; _i++) {
          _callback = _bindings[_i];
          _callback.apply(null, args);
        }
      },
      on: function(event, callback) {
        if (!this.bindings[event]) {
          this.bindings[event] = [];
        }
        this.bindings[event].push(callback);
        return callback;
      },
      off: function(event, callback) {
        var _binding, _bindings, _i;
        if (!(_bindings = this.bindings[event])) {
          return;
        }
        _i = _bindings.length;
        while (_i-- && (_binding = _bindings[_i])) {
          if (_binding === callback) {
            _bindings.splice(_i, 1);
          }
        }
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL21vZHVsZXMvRW1pdHRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFLSTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQUE7V0FDYjtBQUFBLE1BQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxNQUVBLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFDRixZQUFBLDJDQUFBO0FBQUEsUUFERyxzQkFBTyw4REFDVixDQUFBO0FBQUEsUUFBQSxJQUFBLENBQUEsQ0FBYyxTQUFBLEdBQVksSUFBQyxDQUFBLFFBQVMsQ0FBQSxLQUFBLENBQXRCLENBQWQ7QUFBQSxnQkFBQSxDQUFBO1NBQUE7QUFDQSxhQUFBLGdEQUFBO29DQUFBO0FBQUEsVUFBQSxTQUFTLENBQUMsS0FBVixDQUFnQixJQUFoQixFQUFzQixJQUF0QixDQUFBLENBQUE7QUFBQSxTQUZFO01BQUEsQ0FGTjtBQUFBLE1BT0EsRUFBQSxFQUFJLFNBQUMsS0FBRCxFQUFRLFFBQVIsR0FBQTtBQUNBLFFBQUEsSUFBQSxDQUFBLElBQThCLENBQUEsUUFBUyxDQUFBLEtBQUEsQ0FBdkM7QUFBQSxVQUFBLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQSxDQUFWLEdBQW1CLEVBQW5CLENBQUE7U0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFFBQVMsQ0FBQSxLQUFBLENBQU0sQ0FBQyxJQUFqQixDQUFzQixRQUF0QixDQURBLENBQUE7QUFFQSxlQUFPLFFBQVAsQ0FIQTtNQUFBLENBUEo7QUFBQSxNQVlBLEdBQUEsRUFBSyxTQUFDLEtBQUQsRUFBUSxRQUFSLEdBQUE7QUFDRCxZQUFBLHVCQUFBO0FBQUEsUUFBQSxJQUFBLENBQUEsQ0FBYyxTQUFBLEdBQVksSUFBQyxDQUFBLFFBQVMsQ0FBQSxLQUFBLENBQXRCLENBQWQ7QUFBQSxnQkFBQSxDQUFBO1NBQUE7QUFBQSxRQUVBLEVBQUEsR0FBSyxTQUFTLENBQUMsTUFGZixDQUFBO0FBRXVCLGVBQU0sRUFBQSxFQUFBLElBQVMsQ0FBQSxRQUFBLEdBQVcsU0FBVSxDQUFBLEVBQUEsQ0FBckIsQ0FBZixHQUFBO0FBQ25CLFVBQUEsSUFBRyxRQUFBLEtBQVksUUFBZjtBQUE2QixZQUFBLFNBQVMsQ0FBQyxNQUFWLENBQWlCLEVBQWpCLEVBQXFCLENBQXJCLENBQUEsQ0FBN0I7V0FEbUI7UUFBQSxDQUh0QjtNQUFBLENBWkw7TUFEYTtFQUFBLENBQWpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/modules/Emitter.coffee
