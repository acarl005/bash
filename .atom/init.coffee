atom.commands.add 'atom-text-editor', 'custom:console-log', ->
  editor = atom.workspace.getActiveTextEditor()
  editor.insertText('console.log(' + editor.getSelectedText() + ');')
  editor.cursors.forEach (cursor) ->
    cursor.moveLeft 2
