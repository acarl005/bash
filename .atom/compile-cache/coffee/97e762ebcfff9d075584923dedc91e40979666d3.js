(function() {
  module.exports = {
    config: {
      coloured: {
        type: 'boolean',
        "default": true,
        description: 'Untick this for colourless icons'
      },
      forceShow: {
        type: 'boolean',
        "default": false,
        description: 'Force show icons - for themes that hide icons'
      },
      onChanges: {
        type: 'boolean',
        "default": false,
        description: 'Only colour icons when file is modified'
      },
      tabPaneIcon: {
        type: 'boolean',
        "default": true,
        description: 'Show file icons on tab pane'
      }
    },
    activate: function(state) {
      atom.config.onDidChange('file-icons.coloured', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.colour(newValue);
        };
      })(this));
      this.colour(atom.config.get('file-icons.coloured'));
      atom.config.onDidChange('file-icons.forceShow', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.forceShow(newValue);
        };
      })(this));
      this.forceShow(atom.config.get('file-icons.forceShow'));
      atom.config.onDidChange('file-icons.onChanges', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.onChanges(newValue);
        };
      })(this));
      this.onChanges(atom.config.get('file-icons.onChanges'));
      atom.config.onDidChange('file-icons.tabPaneIcon', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.tabPaneIcon(newValue);
        };
      })(this));
      return this.tabPaneIcon(atom.config.get('file-icons.tabPaneIcon'));
    },
    deactivate: function() {},
    serialize: function() {},
    colour: function(enable) {
      var body;
      body = document.querySelector('body');
      if (enable) {
        return body.className = body.className.replace(/\sfile-icons-colourless/, '');
      } else {
        return body.className = "" + body.className + " file-icons-colourless";
      }
    },
    forceShow: function(enable) {
      var body, className;
      body = document.querySelector('body');
      className = body.className;
      if (enable) {
        return body.className = "" + className + " file-icons-force-show-icons";
      } else {
        return body.className = className.replace(/\sfile-icons-force-show-icons/, '');
      }
    },
    onChanges: function(enable) {
      var body, className;
      body = document.querySelector('body');
      className = body.className;
      if (enable) {
        return body.className = "" + className + " file-icons-on-changes";
      } else {
        return body.className = className.replace(/\sfile-icons-on-changes/, '');
      }
    },
    tabPaneIcon: function(enable) {
      var body, className;
      body = document.querySelector('body');
      className = body.className;
      if (enable) {
        return body.className = "" + className + " file-icons-tab-pane-icon";
      } else {
        return body.className = className.replace(/\sfile-icons-tab-pane-icon/, '');
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9maWxlLWljb25zL2luZGV4LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsa0NBRmI7T0FERjtBQUFBLE1BSUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwrQ0FGYjtPQUxGO0FBQUEsTUFRQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHlDQUZiO09BVEY7QUFBQSxNQVlBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsNkJBRmI7T0FiRjtLQURGO0FBQUEsSUFrQkEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IscUJBQXhCLEVBQStDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUM3QyxjQUFBLGtCQUFBO0FBQUEsVUFEK0MsZ0JBQUEsVUFBVSxnQkFBQSxRQUN6RCxDQUFBO2lCQUFBLEtBQUMsQ0FBQSxNQUFELENBQVEsUUFBUixFQUQ2QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9DLENBQUEsQ0FBQTtBQUFB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

//# sourceURL=/home/andy/.atom/packages/file-icons/index.coffee
