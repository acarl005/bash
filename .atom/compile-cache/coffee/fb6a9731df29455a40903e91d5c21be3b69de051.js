(function() {
  module.exports = {
    isDarwin: function() {
      return this.platform() === 'darwin';
    },
    isWindows: function() {
      return this.platform() === 'win32';
    },
    isLinux: function() {
      return this.platform() === 'linux';
    },
    platform: function() {
      return process.platform;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvb3BlcmF0aW5nLXN5c3RlbS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBQSxLQUFlLFNBRFA7SUFBQSxDQUFWO0FBQUEsSUFHQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLFFBQUQsQ0FBQSxDQUFBLEtBQWUsUUFETjtJQUFBLENBSFg7QUFBQSxJQU1BLE9BQUEsRUFBUyxTQUFBLEdBQUE7YUFDUCxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsS0FBZSxRQURSO0lBQUEsQ0FOVDtBQUFBLElBU0EsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLE9BQU8sQ0FBQyxTQURBO0lBQUEsQ0FUVjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/script/lib/grammar-utils/operating-system.coffee
