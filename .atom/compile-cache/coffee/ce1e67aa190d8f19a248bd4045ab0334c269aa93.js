(function() {
  atom.commands.add('atom-text-editor', 'custom:console-log', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    editor.insertText('console.log(' + editor.getSelectedText() + ');');
    return editor.cursors.forEach(function(cursor) {
      return cursor.moveLeft(2);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLG9CQUF0QyxFQUE0RCxTQUFBLEdBQUE7QUFDMUQsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLElBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsY0FBQSxHQUFpQixNQUFNLENBQUMsZUFBUCxDQUFBLENBQWpCLEdBQTRDLElBQTlELENBREEsQ0FBQTtXQUVBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixDQUF1QixTQUFDLE1BQUQsR0FBQTthQUNyQixNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixFQURxQjtJQUFBLENBQXZCLEVBSDBEO0VBQUEsQ0FBNUQsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/init.coffee
