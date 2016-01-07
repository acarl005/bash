(function() {
  var TerminalPlus;

  TerminalPlus = require('../lib/terminal-plus');

  describe("TerminalPlus", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('terminal-plus');
    });
    return describe("when the terminal-plus:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.terminal-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var statusBar, terminalPlusElement;
          expect(workspaceElement.querySelector('.terminal-plus')).toExist();
          terminalPlusElement = workspaceElement.querySelector('.terminal-plus');
          expect(terminalPlusElement).toExist();
          statusBar = atom.workspace.panelForItem(terminalPlusElement);
          expect(statusBar.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
          return expect(statusBar.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.terminal-plus')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var terminalPlusElement;
          terminalPlusElement = workspaceElement.querySelector('.terminal-plus');
          expect(terminalPlusElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'terminal-plus:toggle');
          return expect(terminalPlusElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC1wbHVzL3NwZWMvdGVybWluYWwtcGx1cy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxZQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQUFmLENBQUE7O0FBQUEsRUFPQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsUUFBQSx5Q0FBQTtBQUFBLElBQUEsT0FBd0MsRUFBeEMsRUFBQywwQkFBRCxFQUFtQiwyQkFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO2FBQ0EsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCLEVBRlg7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLFFBQUEsQ0FBUyxrREFBVCxFQUE2RCxTQUFBLEdBQUE7QUFDM0QsTUFBQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBR3BDLFFBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGdCQUEvQixDQUFQLENBQXdELENBQUMsR0FBRyxDQUFDLE9BQTdELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHNCQUF6QyxDQUpBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FOQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsOEJBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixnQkFBL0IsQ0FBUCxDQUF3RCxDQUFDLE9BQXpELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSxtQkFBQSxHQUFzQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixnQkFBL0IsQ0FGdEIsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLG1CQUFQLENBQTJCLENBQUMsT0FBNUIsQ0FBQSxDQUhBLENBQUE7QUFBQSxVQUtBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBNEIsbUJBQTVCLENBTFosQ0FBQTtBQUFBLFVBTUEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxTQUFWLENBQUEsQ0FBUCxDQUE2QixDQUFDLElBQTlCLENBQW1DLElBQW5DLENBTkEsQ0FBQTtBQUFBLFVBT0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxzQkFBekMsQ0FQQSxDQUFBO2lCQVFBLE1BQUEsQ0FBTyxTQUFTLENBQUMsU0FBVixDQUFBLENBQVAsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxLQUFuQyxFQVRHO1FBQUEsQ0FBTCxFQVpvQztNQUFBLENBQXRDLENBQUEsQ0FBQTthQXVCQSxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQSxHQUFBO0FBTzdCLFFBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBQUEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGdCQUEvQixDQUFQLENBQXdELENBQUMsR0FBRyxDQUFDLE9BQTdELENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFNQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHNCQUF6QyxDQU5BLENBQUE7QUFBQSxRQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FSQSxDQUFBO2VBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUVILGNBQUEsbUJBQUE7QUFBQSxVQUFBLG1CQUFBLEdBQXNCLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGdCQUEvQixDQUF0QixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sbUJBQVAsQ0FBMkIsQ0FBQyxXQUE1QixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxzQkFBekMsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyxtQkFBUCxDQUEyQixDQUFDLEdBQUcsQ0FBQyxXQUFoQyxDQUFBLEVBTEc7UUFBQSxDQUFMLEVBbEI2QjtNQUFBLENBQS9CLEVBeEIyRDtJQUFBLENBQTdELEVBUHVCO0VBQUEsQ0FBekIsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/terminal-plus/spec/terminal-plus-spec.coffee
