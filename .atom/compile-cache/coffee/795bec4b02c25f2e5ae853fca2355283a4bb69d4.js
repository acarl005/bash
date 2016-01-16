(function() {
  atom.commands.add('atom-text-editor', 'custom:console-log', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    editor.insertText('console.log(' + editor.getSelectedText() + ');');
    return editor.cursors.forEach(function(cursor) {
      return cursor.moveLeft(2);
    });
  });

  atom.commands.add('atom-text-editor', 'custom:semicolon-end', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    editor.cursors.forEach(function(cursor) {
      return cursor.moveToEndOfLine();
    });
    return editor.insertText(';');
  });

  atom.commands.add('atom-text-editor', 'custom:semicolon-inside', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    editor.cursors.forEach(function(cursor) {
      return cursor.moveToEndOfLine();
    });
    editor.insertText(';');
    return editor.cursors.forEach(function(cursor) {
      return cursor.moveLeft(2);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLG9CQUF0QyxFQUE0RCxTQUFBLEdBQUE7QUFDMUQsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLElBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsY0FBQSxHQUFpQixNQUFNLENBQUMsZUFBUCxDQUFBLENBQWpCLEdBQTRDLElBQTlELENBREEsQ0FBQTtXQUVBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixDQUF1QixTQUFDLE1BQUQsR0FBQTthQUNyQixNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixFQURxQjtJQUFBLENBQXZCLEVBSDBEO0VBQUEsQ0FBNUQsQ0FBQSxDQUFBOztBQUFBLEVBTUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxzQkFBdEMsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFFBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxJQUNBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixDQUF1QixTQUFDLE1BQUQsR0FBQTthQUNyQixNQUFNLENBQUMsZUFBUCxDQUFBLEVBRHFCO0lBQUEsQ0FBdkIsQ0FEQSxDQUFBO1dBR0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsR0FBbEIsRUFKNEQ7RUFBQSxDQUE5RCxDQU5BLENBQUE7O0FBQUEsRUFZQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLHlCQUF0QyxFQUFpRSxTQUFBLEdBQUE7QUFDL0QsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLElBQ0EsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFmLENBQXVCLFNBQUMsTUFBRCxHQUFBO2FBQ3JCLE1BQU0sQ0FBQyxlQUFQLENBQUEsRUFEcUI7SUFBQSxDQUF2QixDQURBLENBQUE7QUFBQSxJQUdBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCLENBSEEsQ0FBQTtXQUlBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZixDQUF1QixTQUFDLE1BQUQsR0FBQTthQUNyQixNQUFNLENBQUMsUUFBUCxDQUFnQixDQUFoQixFQURxQjtJQUFBLENBQXZCLEVBTCtEO0VBQUEsQ0FBakUsQ0FaQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/init.coffee
