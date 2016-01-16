(function() {
  var Shell, exec;

  exec = require('child_process').exec;

  Shell = require('shell');

  module.exports = {
    activate: function(state) {
      atom.commands.add('atom-text-editor', {
        'open-in-browser:open': (function(_this) {
          return function() {
            return _this.open();
          };
        })(this)
      });
      return atom.commands.add('atom-panel', {
        'open-in-browser:open-tree-view': (function(_this) {
          return function() {
            return _this.openTreeView();
          };
        })(this)
      });
    },
    openPath: function(filePath) {
      var process_architecture;
      process_architecture = process.platform;
      switch (process_architecture) {
        case 'darwin':
          return exec('open "' + filePath + '"');
        case 'linux':
          return exec('xdg-open "' + filePath + '"');
        case 'win32':
          return Shell.openExternal('file:///' + filePath);
      }
    },
    open: function() {
      var editor, file, filePath;
      editor = atom.workspace.getActivePaneItem();
      file = editor != null ? editor.buffer.file : void 0;
      filePath = file != null ? file.path : void 0;
      return this.openPath(filePath);
    },
    openTreeView: function() {
      var packageObj, treeView;
      packageObj = null;
      if (atom.packages.isPackageLoaded('tree-view') === true) {
        treeView = atom.packages.getLoadedPackage('tree-view');
        treeView = require(treeView.mainModulePath);
        packageObj = treeView.serialize();
      }
      if (typeof packageObj !== 'undefined' && packageObj !== null) {
        if (packageObj.selectedPath) {
          return this.openPath(packageObj.selectedPath);
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9vcGVuLWluLWJyb3dzZXIvbGliL29wZW4taW4tYnJvd3Nlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFDLE9BQVEsT0FBQSxDQUFRLGVBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDO0FBQUEsUUFBQSxzQkFBQSxFQUF3QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtPQUF0QyxDQUFBLENBQUE7YUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsWUFBbEIsRUFBZ0M7QUFBQSxRQUFBLGdDQUFBLEVBQW1DLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxZQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DO09BQWhDLEVBRlE7SUFBQSxDQUFWO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQyxRQUFELEdBQUE7QUFDUixVQUFBLG9CQUFBO0FBQUEsTUFBQSxvQkFBQSxHQUF1QixPQUFPLENBQUMsUUFBL0IsQ0FBQTtBQUNBLGNBQU8sb0JBQVA7QUFBQSxhQUNPLFFBRFA7aUJBQ3FCLElBQUEsQ0FBTSxRQUFBLEdBQVMsUUFBVCxHQUFrQixHQUF4QixFQURyQjtBQUFBLGFBRU8sT0FGUDtpQkFFb0IsSUFBQSxDQUFNLFlBQUEsR0FBYSxRQUFiLEdBQXNCLEdBQTVCLEVBRnBCO0FBQUEsYUFHTyxPQUhQO2lCQUdvQixLQUFLLENBQUMsWUFBTixDQUFtQixVQUFBLEdBQVcsUUFBOUIsRUFIcEI7QUFBQSxPQUZRO0lBQUEsQ0FKVjtBQUFBLElBV0EsSUFBQSxFQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsc0JBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFBLG9CQUFPLE1BQU0sQ0FBRSxNQUFNLENBQUMsYUFEdEIsQ0FBQTtBQUFBLE1BRUEsUUFBQSxrQkFBVyxJQUFJLENBQUUsYUFGakIsQ0FBQTthQUdBLElBQUMsQ0FBQSxRQUFELENBQVUsUUFBVixFQUpJO0lBQUEsQ0FYTjtBQUFBLElBaUJBLFlBQUEsRUFBYyxTQUFBLEdBQUE7QUFDWixVQUFBLG9CQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBYixDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixXQUE5QixDQUFBLEtBQThDLElBQWpEO0FBQ0UsUUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixXQUEvQixDQUFYLENBQUE7QUFBQSxRQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsUUFBUSxDQUFDLGNBQWpCLENBRFgsQ0FBQTtBQUFBLFFBRUEsVUFBQSxHQUFhLFFBQVEsQ0FBQyxTQUFULENBQUEsQ0FGYixDQURGO09BREE7QUFLQSxNQUFBLElBQUcsTUFBQSxDQUFBLFVBQUEsS0FBcUIsV0FBckIsSUFBb0MsVUFBQSxLQUFjLElBQXJEO0FBQ0UsUUFBQSxJQUFHLFVBQVUsQ0FBQyxZQUFkO2lCQUNFLElBQUMsQ0FBQSxRQUFELENBQVUsVUFBVSxDQUFDLFlBQXJCLEVBREY7U0FERjtPQU5ZO0lBQUEsQ0FqQmQ7R0FORixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/open-in-browser/lib/open-in-browser.coffee
