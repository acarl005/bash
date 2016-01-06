(function() {
  module.exports = {
    activate: function(state) {
      return atom.commands.add("atom-workspace", {
        "atom-erb:erb": (function(_this) {
          return function() {
            return _this.erb();
          };
        })(this)
      });
    },
    erb: function() {
      var curr_c, curr_r, editor, _ref;
      editor = atom.workspace.getActiveTextEditor();
      editor.insertText("<%=  %>");
      _ref = editor.getCursorBufferPosition().toArray(), curr_r = _ref[0], curr_c = _ref[1];
      return editor.setCursorBufferPosition([curr_r, curr_c - 3]);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9hdG9tLWVyYi9saWIvYXRvbS1lcmIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsR0FBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtPQURGLEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFJQSxHQUFBLEVBQUssU0FBQSxHQUFBO0FBQ0gsVUFBQSw0QkFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFNBQWxCLENBREEsQ0FBQTtBQUFBLE1BRUEsT0FBbUIsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBZ0MsQ0FBQyxPQUFqQyxDQUFBLENBQW5CLEVBQUMsZ0JBQUQsRUFBUyxnQkFGVCxDQUFBO2FBR0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsTUFBRCxFQUFTLE1BQUEsR0FBUyxDQUFsQixDQUEvQixFQUpHO0lBQUEsQ0FKTDtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/atom-erb/lib/atom-erb.coffee
