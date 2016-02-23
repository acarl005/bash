atom.commands.add 'atom-text-editor', 'custom:console-log', ->
  editor = atom.workspace.getActiveTextEditor()
  editor.getSelections().forEach (selection) ->
    selection.insertText 'console.log(' + selection.getText() + ');'
  editor.cursors.forEach (cursor) ->
    cursor.moveLeft 2

atom.commands.add 'atom-text-editor', 'custom:semicolon-end', ->
  editor = atom.workspace.getActiveTextEditor()
  editor.cursors.forEach (cursor) ->
    cursor.moveToEndOfLine()
  editor.insertText ';'

atom.commands.add 'atom-text-editor', 'custom:semicolon-inside', ->
  editor = atom.workspace.getActiveTextEditor()
  editor.cursors.forEach (cursor) ->
    cursor.moveToEndOfLine()
  editor.insertText ';'
  editor.cursors.forEach (cursor) ->
    cursor.moveLeft 2
