(function() {
  var CodeContext;

  module.exports = CodeContext = (function() {
    CodeContext.prototype.filename = null;

    CodeContext.prototype.filepath = null;

    CodeContext.prototype.lineNumber = null;

    CodeContext.prototype.shebang = null;

    CodeContext.prototype.textSource = null;

    function CodeContext(filename, filepath, textSource) {
      this.filename = filename;
      this.filepath = filepath;
      this.textSource = textSource != null ? textSource : null;
    }

    CodeContext.prototype.fileColonLine = function(fullPath) {
      var fileColonLine;
      if (fullPath == null) {
        fullPath = true;
      }
      if (fullPath) {
        fileColonLine = this.filepath;
      } else {
        fileColonLine = this.filename;
      }
      if (!this.lineNumber) {
        return fileColonLine;
      }
      return "" + fileColonLine + ":" + this.lineNumber;
    };

    CodeContext.prototype.getCode = function(prependNewlines) {
      var code, newlineCount, newlines, _ref;
      if (prependNewlines == null) {
        prependNewlines = true;
      }
      code = (_ref = this.textSource) != null ? _ref.getText() : void 0;
      if (!(prependNewlines && this.lineNumber)) {
        return code;
      }
      newlineCount = Number(this.lineNumber);
      newlines = Array(newlineCount).join("\n");
      return "" + newlines + code;
    };

    CodeContext.prototype.shebangCommand = function() {
      var sections;
      sections = this.shebangSections();
      if (!sections) {
        return;
      }
      return sections[0];
    };

    CodeContext.prototype.shebangCommandArgs = function() {
      var sections;
      sections = this.shebangSections();
      if (!sections) {
        return [];
      }
      return sections.slice(1, +(sections.length - 1) + 1 || 9e9);
    };

    CodeContext.prototype.shebangSections = function() {
      var _ref;
      return (_ref = this.shebang) != null ? _ref.split(' ') : void 0;
    };

    return CodeContext;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2NvZGUtY29udGV4dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwwQkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUFBLDBCQUNBLFFBQUEsR0FBVSxJQURWLENBQUE7O0FBQUEsMEJBRUEsVUFBQSxHQUFZLElBRlosQ0FBQTs7QUFBQSwwQkFHQSxPQUFBLEdBQVMsSUFIVCxDQUFBOztBQUFBLDBCQUlBLFVBQUEsR0FBWSxJQUpaLENBQUE7O0FBYWEsSUFBQSxxQkFBRSxRQUFGLEVBQWEsUUFBYixFQUF3QixVQUF4QixHQUFBO0FBQTRDLE1BQTNDLElBQUMsQ0FBQSxXQUFBLFFBQTBDLENBQUE7QUFBQSxNQUFoQyxJQUFDLENBQUEsV0FBQSxRQUErQixDQUFBO0FBQUEsTUFBckIsSUFBQyxDQUFBLGtDQUFBLGFBQWEsSUFBTyxDQUE1QztJQUFBLENBYmI7O0FBQUEsMEJBb0JBLGFBQUEsR0FBZSxTQUFDLFFBQUQsR0FBQTtBQUNiLFVBQUEsYUFBQTs7UUFEYyxXQUFXO09BQ3pCO0FBQUEsTUFBQSxJQUFHLFFBQUg7QUFDRSxRQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLFFBQWpCLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxRQUFqQixDQUhGO09BQUE7QUFLQSxNQUFBLElBQUEsQ0FBQSxJQUE2QixDQUFBLFVBQTdCO0FBQUEsZUFBTyxhQUFQLENBQUE7T0FMQTthQU1BLEVBQUEsR0FBRyxhQUFILEdBQWlCLEdBQWpCLEdBQW9CLElBQUMsQ0FBQSxXQVBSO0lBQUEsQ0FwQmYsQ0FBQTs7QUFBQSwwQkFrQ0EsT0FBQSxHQUFTLFNBQUMsZUFBRCxHQUFBO0FBQ1AsVUFBQSxrQ0FBQTs7UUFEUSxrQkFBa0I7T0FDMUI7QUFBQSxNQUFBLElBQUEsMENBQWtCLENBQUUsT0FBYixDQUFBLFVBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLENBQW1CLGVBQUEsSUFBb0IsSUFBQyxDQUFBLFVBQXhDLENBQUE7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQURBO0FBQUEsTUFHQSxZQUFBLEdBQWUsTUFBQSxDQUFPLElBQUMsQ0FBQSxVQUFSLENBSGYsQ0FBQTtBQUFBLE1BSUEsUUFBQSxHQUFXLEtBQUEsQ0FBTSxZQUFOLENBQW1CLENBQUMsSUFBcEIsQ0FBeUIsSUFBekIsQ0FKWCxDQUFBO2FBS0EsRUFBQSxHQUFHLFFBQUgsR0FBYyxLQU5QO0lBQUEsQ0FsQ1QsQ0FBQTs7QUFBQSwwQkE2Q0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLFFBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsZUFBRCxDQUFBLENBQVgsQ0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLFFBQUE7QUFBQSxjQUFBLENBQUE7T0FEQTthQUdBLFFBQVMsQ0FBQSxDQUFBLEVBSks7SUFBQSxDQTdDaEIsQ0FBQTs7QUFBQSwwQkF1REEsa0JBQUEsR0FBb0IsU0FBQSxHQUFBO0FBQ2xCLFVBQUEsUUFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBWCxDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsUUFBQTtBQUFBLGVBQU8sRUFBUCxDQUFBO09BREE7YUFHQSxRQUFTLDZDQUpTO0lBQUEsQ0F2RHBCLENBQUE7O0FBQUEsMEJBaUVBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSxJQUFBO2lEQUFRLENBQUUsS0FBVixDQUFnQixHQUFoQixXQURlO0lBQUEsQ0FqRWpCLENBQUE7O3VCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/script/lib/code-context.coffee
