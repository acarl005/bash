(function() {
  describe("AtomErb", function() {
    var editor, editorElement, workspaceElement, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], workspaceElement = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open('test.erb');
      });
      runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorElement = atom.views.getView(editor);
        return editor.setCursorBufferPosition([0, 0]);
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('atom-erb');
      });
    });
    return describe("atom-erb", function() {
      describe("activation", function() {
        return it("should be in the packages list", function() {
          return expect(atom.packages.loadedPackages["atom-erb"]).toBeDefined();
        });
      });
      return describe("atom-erb:erb", function() {
        beforeEach(function() {
          return atom.commands.dispatch(workspaceElement, "atom-erb:erb");
        });
        it("inserts the ERB tag", function() {
          return expect(editor.getText()).toEqual("<%=  %>");
        });
        return it("moves the cursor inside the ERB tag", function() {
          return expect(editor.getCursorBufferPosition().toArray()).toEqual([0, 4]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9hdG9tLWVyYi9zcGVjL2F0b20tZXJiLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0E7QUFBQSxFQUFBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixRQUFBLDZDQUFBO0FBQUEsSUFBQSxPQUE0QyxFQUE1QyxFQUFDLGdCQUFELEVBQVMsdUJBQVQsRUFBd0IsMEJBQXhCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtBQUFBLE1BRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsRUFEYztNQUFBLENBQWhCLENBRkEsQ0FBQTtBQUFBLE1BS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxRQUNBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBRGhCLENBQUE7ZUFFQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUEvQixFQUhHO01BQUEsQ0FBTCxDQUxBLENBQUE7YUFVQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixVQUE5QixFQURjO01BQUEsQ0FBaEIsRUFYUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBZ0JBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtlQUNyQixFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO2lCQUNuQyxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFlLENBQUEsVUFBQSxDQUFwQyxDQUFnRCxDQUFDLFdBQWpELENBQUEsRUFEbUM7UUFBQSxDQUFyQyxFQURxQjtNQUFBLENBQXZCLENBQUEsQ0FBQTthQUlBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxjQUF6QyxFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUdBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7aUJBQ3hCLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxTQUFqQyxFQUR3QjtRQUFBLENBQTFCLENBSEEsQ0FBQTtlQU1BLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7aUJBQ3hDLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQVAsQ0FBQSxDQUFnQyxDQUFDLE9BQWpDLENBQUEsQ0FBUCxDQUFrRCxDQUFDLE9BQW5ELENBQTJELENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBM0QsRUFEd0M7UUFBQSxDQUExQyxFQVB1QjtNQUFBLENBQXpCLEVBTG1CO0lBQUEsQ0FBckIsRUFqQmtCO0VBQUEsQ0FBcEIsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/atom-erb/spec/atom-erb-spec.coffee
