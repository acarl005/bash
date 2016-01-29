(function() {
  module.exports = {
    activate: function() {
      var _TriggerKey, _command, _commands, _keymap, _linuxSelector, _macSelector, _triggerKey, _windowsSelector;
      _command = 'color-picker:open';
      _triggerKey = (atom.config.get('color-picker.triggerKey')).toLowerCase();
      _TriggerKey = _triggerKey.toUpperCase();
      _macSelector = '.platform-darwin atom-workspace';
      _windowsSelector = '.platform-win32 atom-workspace';
      _linuxSelector = '.platform-linux atom-workspace';
      _keymap = {};
      _keymap["" + _macSelector] = {};
      _keymap["" + _macSelector]["cmd-" + _TriggerKey] = _command;
      _keymap["" + _windowsSelector] = {};
      _keymap["" + _windowsSelector]["ctrl-alt-" + _triggerKey] = _command;
      _keymap["" + _linuxSelector] = {};
      _keymap["" + _linuxSelector]["ctrl-alt-" + _triggerKey] = _command;
      atom.keymaps.add('color-picker:trigger', _keymap);
      atom.contextMenu.add({
        'atom-text-editor': [
          {
            label: 'Color Picker',
            command: _command
          }
        ]
      });
      _commands = {};
      _commands["" + _command] = (function(_this) {
        return function() {
          var _ref;
          return (_ref = _this.view) != null ? _ref.open() : void 0;
        };
      })(this);
      atom.commands.add('atom-text-editor', _commands);
      return this.view.activate();
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.view) != null ? _ref.destroy() : void 0;
    },
    provideColorPicker: function() {
      return {
        open: (function(_this) {
          return function(Editor, Cursor) {
            if (!_this.view) {
              return;
            }
            return _this.view.open(Editor, Cursor);
          };
        })(this)
      };
    },
    config: {
      randomColor: {
        title: 'Serve a random color on open',
        description: 'If the Color Picker doesn\'t get an input color, it serves a completely random color.',
        type: 'boolean',
        "default": true
      },
      automaticReplace: {
        title: 'Automatically Replace Color',
        description: 'Replace selected color automatically on change. Works well with as-you-type CSS reloaders.',
        type: 'boolean',
        "default": false
      },
      abbreviateValues: {
        title: 'Abbreviate Color Values',
        description: 'If possible, abbreviate color values, like for example “0.3” to “.3”,  “#ffffff” to “#fff” and “rgb(0, 0, 0)” to “rgb(0,0,0)”.',
        type: 'boolean',
        "default": false
      },
      uppercaseColorValues: {
        title: 'Uppercase Color Values',
        description: 'If sensible, uppercase the color value. For example, “#aaa” becomes “#AAA”.',
        type: 'boolean',
        "default": false
      },
      preferredFormat: {
        title: 'Preferred Color Format',
        description: 'On open, the Color Picker will show a color in this format.',
        type: 'string',
        "enum": ['RGB', 'HEX', 'HSL', 'HSV', 'VEC'],
        "default": 'RGB'
      },
      triggerKey: {
        title: 'Trigger key',
        description: 'Decide what trigger key should open the Color Picker. `CMD-SHIFT-{TRIGGER_KEY}` and `CTRL-ALT-{TRIGGER_KEY}`. Requires a restart.',
        type: 'string',
        "enum": ['C', 'E', 'H', 'K'],
        "default": 'C'
      }
    },
    view: (require('./ColorPicker-view'))()
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL0NvbG9yUGlja2VyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUlJO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNJO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sVUFBQSxzR0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLG1CQUFYLENBQUE7QUFBQSxNQUlBLFdBQUEsR0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBRCxDQUEyQyxDQUFDLFdBQTVDLENBQUEsQ0FKZCxDQUFBO0FBQUEsTUFLQSxXQUFBLEdBQWMsV0FBVyxDQUFDLFdBQVosQ0FBQSxDQUxkLENBQUE7QUFBQSxNQVFBLFlBQUEsR0FBZSxpQ0FSZixDQUFBO0FBQUEsTUFTQSxnQkFBQSxHQUFtQixnQ0FUbkIsQ0FBQTtBQUFBLE1BVUEsY0FBQSxHQUFpQixnQ0FWakIsQ0FBQTtBQUFBLE1BWUEsT0FBQSxHQUFVLEVBWlYsQ0FBQTtBQUFBLE1BZUEsT0FBUSxDQUFBLEVBQUEsR0FBbkIsWUFBbUIsQ0FBUixHQUErQixFQWYvQixDQUFBO0FBQUEsTUFnQkEsT0FBUSxDQUFBLEVBQUEsR0FBbkIsWUFBbUIsQ0FBcUIsQ0FBQyxNQUFBLEdBQXpDLFdBQXdDLENBQTdCLEdBQXVELFFBaEJ2RCxDQUFBO0FBQUEsTUFrQkEsT0FBUSxDQUFBLEVBQUEsR0FBbkIsZ0JBQW1CLENBQVIsR0FBbUMsRUFsQm5DLENBQUE7QUFBQSxNQW1CQSxPQUFRLENBQUEsRUFBQSxHQUFuQixnQkFBbUIsQ0FBeUIsQ0FBQyxXQUFBLEdBQTdDLFdBQTRDLENBQWpDLEdBQWdFLFFBbkJoRSxDQUFBO0FBQUEsTUFxQkEsT0FBUSxDQUFBLEVBQUEsR0FBbkIsY0FBbUIs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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/ColorPicker.coffee
