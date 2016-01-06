(function() {
  var fs, os, path, uuid;

  os = require('os');

  fs = require('fs');

  path = require('path');

  uuid = require('node-uuid');

  module.exports = {
    tempFilesDir: path.join(os.tmpdir(), 'atom_script_tempfiles'),
    createTempFileWithCode: function(code, extension) {
      var error, file, tempFilePath;
      if (extension == null) {
        extension = "";
      }
      try {
        if (!fs.existsSync(this.tempFilesDir)) {
          fs.mkdirSync(this.tempFilesDir);
        }
        tempFilePath = this.tempFilesDir + path.sep + uuid.v1() + extension;
        file = fs.openSync(tempFilePath, 'w');
        fs.writeSync(file, code);
        fs.closeSync(file);
        return tempFilePath;
      } catch (_error) {
        error = _error;
        throw "Error while creating temporary file (" + error + ")";
      }
    },
    deleteTempFiles: function() {
      var error, files;
      try {
        if (fs.existsSync(this.tempFilesDir)) {
          files = fs.readdirSync(this.tempFilesDir);
          if (files.length) {
            files.forEach((function(_this) {
              return function(file, index) {
                return fs.unlinkSync(_this.tempFilesDir + path.sep + file);
              };
            })(this));
          }
          return fs.rmdirSync(this.tempFilesDir);
        }
      } catch (_error) {
        error = _error;
        throw "Error while deleting temporary files (" + error + ")";
      }
    },
    Lisp: require('./grammar-utils/lisp'),
    OperatingSystem: require('./grammar-utils/operating-system'),
    R: require('./grammar-utils/R'),
    PHP: require('./grammar-utils/php'),
    Nim: require('./grammar-utils/nim'),
    CScompiler: require('./grammar-utils/coffee-script-compiler')
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxXQUFSLENBSFAsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFlBQUEsRUFBYyxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUF1Qix1QkFBdkIsQ0FBZDtBQUFBLElBT0Esc0JBQUEsRUFBd0IsU0FBQyxJQUFELEVBQU8sU0FBUCxHQUFBO0FBQ3RCLFVBQUEseUJBQUE7O1FBRDZCLFlBQVk7T0FDekM7QUFBQTtBQUNFLFFBQUEsSUFBQSxDQUFBLEVBQXFDLENBQUMsVUFBSCxDQUFjLElBQUMsQ0FBQSxZQUFmLENBQW5DO0FBQUEsVUFBQSxFQUFFLENBQUMsU0FBSCxDQUFhLElBQUMsQ0FBQSxZQUFkLENBQUEsQ0FBQTtTQUFBO0FBQUEsUUFFQSxZQUFBLEdBQWUsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBSSxDQUFDLEdBQXJCLEdBQTJCLElBQUksQ0FBQyxFQUFMLENBQUEsQ0FBM0IsR0FBdUMsU0FGdEQsQ0FBQTtBQUFBLFFBSUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxRQUFILENBQVksWUFBWixFQUEwQixHQUExQixDQUpQLENBQUE7QUFBQSxRQUtBLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBYixFQUFtQixJQUFuQixDQUxBLENBQUE7QUFBQSxRQU1BLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBYixDQU5BLENBQUE7ZUFRQSxhQVRGO09BQUEsY0FBQTtBQVdFLFFBREksY0FDSixDQUFBO0FBQUEsY0FBTyx1Q0FBQSxHQUF1QyxLQUF2QyxHQUE2QyxHQUFwRCxDQVhGO09BRHNCO0lBQUEsQ0FQeEI7QUFBQSxJQXNCQSxlQUFBLEVBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsWUFBQTtBQUFBO0FBQ0UsUUFBQSxJQUFJLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBQyxDQUFBLFlBQWYsQ0FBSjtBQUNFLFVBQUEsS0FBQSxHQUFRLEVBQUUsQ0FBQyxXQUFILENBQWUsSUFBQyxDQUFBLFlBQWhCLENBQVIsQ0FBQTtBQUNBLFVBQUEsSUFBSSxLQUFLLENBQUMsTUFBVjtBQUNFLFlBQUEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFBLFNBQUEsS0FBQSxHQUFBO3FCQUFBLFNBQUMsSUFBRCxFQUFPLEtBQVAsR0FBQTt1QkFBaUIsRUFBRSxDQUFDLFVBQUgsQ0FBYyxLQUFDLENBQUEsWUFBRCxHQUFnQixJQUFJLENBQUMsR0FBckIsR0FBMkIsSUFBekMsRUFBakI7Y0FBQSxFQUFBO1lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLENBQUEsQ0FERjtXQURBO2lCQUdBLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLFlBQWQsRUFKRjtTQURGO09BQUEsY0FBQTtBQU9FLFFBREksY0FDSixDQUFBO0FBQUEsY0FBTyx3Q0FBQSxHQUF3QyxLQUF4QyxHQUE4QyxHQUFyRCxDQVBGO09BRGU7SUFBQSxDQXRCakI7QUFBQSxJQW1DQSxJQUFBLEVBQU0sT0FBQSxDQUFRLHNCQUFSLENBbkNOO0FBQUEsSUF3Q0EsZUFBQSxFQUFpQixPQUFBLENBQVEsa0NBQVIsQ0F4Q2pCO0FBQUEsSUE2Q0EsQ0FBQSxFQUFHLE9BQUEsQ0FBUSxtQkFBUixDQTdDSDtBQUFBLElBa0RBLEdBQUEsRUFBSyxPQUFBLENBQVEscUJBQVIsQ0FsREw7QUFBQSxJQXVEQSxHQUFBLEVBQUssT0FBQSxDQUFRLHFCQUFSLENBdkRMO0FBQUEsSUE0REEsVUFBQSxFQUFZLE9BQUEsQ0FBUSx3Q0FBUixDQTVEWjtHQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/script/lib/grammar-utils.coffee
