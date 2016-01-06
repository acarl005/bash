(function() {
  module.exports = {
    projectDir: function(editorfile) {
      var path;
      path = require('path');
      return path.dirname(editorfile);
    },
    findNimProjectFile: function(editorfile) {
      var error, file, filepath, files, fs, name, path, stats, tfile, _i, _len;
      path = require('path');
      fs = require('fs');
      if (path.extname(editorfile) === '.nims') {
        try {
          tfile = editorfile.slice(0, -1);
          stats = fs.statSync(tfile);
          return path.basename(tfile);
        } catch (_error) {
          error = _error;
          return path.basename(editorfile);
        }
      }
      try {
        stats = fs.statSync(editorfile + "s");
        return path.basename(editorfile);
      } catch (_error) {}
      try {
        stats = fs.statSync(editorfile + ".cfg");
        return path.basename(editorfile);
      } catch (_error) {}
      try {
        stats = fs.statSync(editorfile + "cfg");
        return path.basename(editorfile);
      } catch (_error) {}
      filepath = path.dirname(editorfile);
      files = fs.readdirSync(filepath);
      files.sort();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        name = filepath + '/' + file;
        if (fs.statSync(name).isFile()) {
          if (path.extname(name) === '.nims' || path.extname(name) === '.nimcgf' || path.extname(name) === '.cfg') {
            try {
              tfile = name.slice(0, -1);
              stats = fs.statSync(tfile);
              return path.basename(tfile);
            } catch (_error) {
              error = _error;
              console.log("File does not exist.");
            }
          }
        }
      }
      return path.basename(editorfile);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvbmltLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQU9FO0FBQUEsSUFBQSxVQUFBLEVBQVksU0FBQyxVQUFELEdBQUE7QUFDVixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7QUFDQSxhQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixDQUFQLENBRlU7SUFBQSxDQUFaO0FBQUEsSUFJQSxrQkFBQSxFQUFvQixTQUFDLFVBQUQsR0FBQTtBQUNsQixVQUFBLG9FQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBO0FBQUEsTUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBO0FBR0EsTUFBQSxJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsVUFBYixDQUFBLEtBQTBCLE9BQTdCO0FBRUU7QUFDRSxVQUFBLEtBQUEsR0FBUSxVQUFVLENBQUMsS0FBWCxDQUFpQixDQUFqQixFQUFvQixDQUFBLENBQXBCLENBQVIsQ0FBQTtBQUFBLFVBQ0EsS0FBQSxHQUFRLEVBQUUsQ0FBQyxRQUFILENBQVksS0FBWixDQURSLENBQUE7QUFJQSxpQkFBTyxJQUFJLENBQUMsUUFBTCxDQUFjLEtBQWQsQ0FBUCxDQUxGO1NBQUEsY0FBQTtBQVFFLFVBRkksY0FFSixDQUFBO0FBQUEsaUJBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkLENBQVAsQ0FSRjtTQUZGO09BSEE7QUFnQkE7QUFDRSxRQUFBLEtBQUEsR0FBUSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQUEsR0FBYSxHQUF6QixDQUFSLENBQUE7QUFDQSxlQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsVUFBZCxDQUFQLENBRkY7T0FBQSxrQkFoQkE7QUFvQkE7QUFDRSxRQUFBLEtBQUEsR0FBUSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQUEsR0FBYSxNQUF6QixDQUFSLENBQUE7QUFDQSxlQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsVUFBZCxDQUFQLENBRkY7T0FBQSxrQkFwQkE7QUF3QkE7QUFDRSxRQUFBLEtBQUEsR0FBUSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQUEsR0FBYSxLQUF6QixDQUFSLENBQUE7QUFDQSxlQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsVUFBZCxDQUFQLENBRkY7T0FBQSxrQkF4QkE7QUFBQSxNQWlDQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFiLENBakNYLENBQUE7QUFBQSxNQWtDQSxLQUFBLEdBQVEsRUFBRSxDQUFDLFdBQUgsQ0FBZSxRQUFmLENBbENSLENBQUE7QUFBQSxNQW1DQSxLQUFLLENBQUMsSUFBTixDQUFBLENBbkNBLENBQUE7QUFvQ0EsV0FBQSw0Q0FBQTt5QkFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPLFFBQUEsR0FBVyxHQUFYLEdBQWlCLElBQXhCLENBQUE7QUFDQSxRQUFBLElBQUksRUFBRSxDQUFDLFFBQUgsQ0FBWSxJQUFaLENBQWlCLENBQUMsTUFBbEIsQ0FBQSxDQUFKO0FBQ0ksVUFBQSxJQUFHLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixDQUFBLEtBQW9CLE9BQXBCLElBQ0QsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFiLENBQUEsS0FBb0IsU0FEbkIsSUFFRCxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsQ0FBQSxLQUFvQixNQUZ0QjtBQUdJO0FBQ0UsY0FBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBQSxDQUFkLENBQVIsQ0FBQTtBQUFBLGNBQ0EsS0FBQSxHQUFRLEVBQUUsQ0FBQyxRQUFILENBQVksS0FBWixDQURSLENBQUE7QUFFQSxxQkFBTyxJQUFJLENBQUMsUUFBTCxDQUFjLEtBQWQsQ0FBUCxDQUhGO2FBQUEsY0FBQTtBQUtFLGNBREksY0FDSixDQUFBO0FBQUEsY0FBQSxPQUFPLENBQUMsR0FBUixDQUFZLHNCQUFaLENBQUEsQ0FMRjthQUhKO1dBREo7U0FGRjtBQUFBLE9BcENBO0FBa0RBLGFBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxVQUFkLENBQVAsQ0FuRGtCO0lBQUEsQ0FKcEI7R0FQRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/script/lib/grammar-utils/nim.coffee
