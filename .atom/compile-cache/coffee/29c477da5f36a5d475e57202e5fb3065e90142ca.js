(function() {
  var fs, path,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  module.exports = {
    jsonFixture: function() {
      var paths;
      paths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return function(fixture, data) {
        var json, jsonPath;
        jsonPath = path.resolve.apply(path, __slice.call(paths).concat([fixture]));
        json = fs.readFileSync(jsonPath).toString();
        json = json.replace(/#\{([\w\[\]]+)\}/g, function(m, w) {
          var match, _;
          if (match = /^\[(\w+)\]$/.exec(w)) {
            _ = match[0], w = match[1];
            return data[w].shift();
          } else {
            return data[w];
          }
        });
        return JSON.parse(json);
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2hlbHBlcnMvZml4dHVyZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsV0FBQSxFQUFhLFNBQUEsR0FBQTtBQUFjLFVBQUEsS0FBQTtBQUFBLE1BQWIsK0RBQWEsQ0FBQTthQUFBLFNBQUMsT0FBRCxFQUFVLElBQVYsR0FBQTtBQUN6QixZQUFBLGNBQUE7QUFBQSxRQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTCxhQUFhLGFBQUEsS0FBQSxDQUFBLFFBQVUsQ0FBQSxPQUFBLENBQVYsQ0FBYixDQUFYLENBQUE7QUFBQSxRQUNBLElBQUEsR0FBTyxFQUFFLENBQUMsWUFBSCxDQUFnQixRQUFoQixDQUF5QixDQUFDLFFBQTFCLENBQUEsQ0FEUCxDQUFBO0FBQUEsUUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxtQkFBYixFQUFrQyxTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7QUFDdkMsY0FBQSxRQUFBO0FBQUEsVUFBQSxJQUFHLEtBQUEsR0FBUSxhQUFhLENBQUMsSUFBZCxDQUFtQixDQUFuQixDQUFYO0FBQ0UsWUFBQyxZQUFELEVBQUcsWUFBSCxDQUFBO21CQUNBLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFSLENBQUEsRUFGRjtXQUFBLE1BQUE7bUJBSUUsSUFBSyxDQUFBLENBQUEsRUFKUDtXQUR1QztRQUFBLENBQWxDLENBRlAsQ0FBQTtlQVNBLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxFQVZ5QjtNQUFBLEVBQWQ7SUFBQSxDQUFiO0dBSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/pigments/spec/helpers/fixtures.coffee
