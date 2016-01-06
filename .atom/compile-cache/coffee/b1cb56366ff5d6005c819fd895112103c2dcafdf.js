(function() {
  atom.commands.add('atom-text-editor', 'custom:console-log', function() {
    var editor;
    editor = atom.workspace.getActiveTextEditor();
    return editor.insertText('console.log(' + editor.getSelectedText() + ');');
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9pbml0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLG9CQUF0QyxFQUE0RCxTQUFBLEdBQUE7QUFDMUQsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtXQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGNBQUEsR0FBaUIsTUFBTSxDQUFDLGVBQVAsQ0FBQSxDQUFqQixHQUE0QyxJQUE5RCxFQUYwRDtFQUFBLENBQTVELENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/init.coffee
