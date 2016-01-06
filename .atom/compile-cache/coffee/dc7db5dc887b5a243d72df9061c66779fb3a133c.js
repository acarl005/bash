(function() {
  var change;

  change = require('./helpers/events').change;

  describe('ColorProjectElement', function() {
    var pigments, project, projectElement, _ref;
    _ref = [], pigments = _ref[0], project = _ref[1], projectElement = _ref[2];
    beforeEach(function() {
      var jasmineContent;
      jasmineContent = document.body.querySelector('#jasmine-content');
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          project = pigments.getProject();
          projectElement = atom.views.getView(project);
          return jasmineContent.appendChild(projectElement);
        });
      });
    });
    it('is bound to the ColorProject model', function() {
      return expect(projectElement).toExist();
    });
    describe('typing in the sourceNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setSourceNames');
        projectElement.sourceNames.getModel().setText('foo, bar');
        projectElement.sourceNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSourceNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the supportedFiletypes input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setSupportedFiletypes');
        projectElement.supportedFiletypes.getModel().setText('foo, bar');
        projectElement.supportedFiletypes.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSupportedFiletypes).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the searchNames input', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setSearchNames');
        projectElement.searchNames.getModel().setText('foo, bar');
        projectElement.searchNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setSearchNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredNames input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredNames');
        projectElement.ignoredNames.getModel().setText('foo, bar');
        projectElement.ignoredNames.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredNames).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('typing in the ignoredScopes input', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoredScopes');
        projectElement.ignoredScopes.getModel().setText('foo, bar');
        projectElement.ignoredScopes.getModel().getBuffer().emitter.emit('did-stop-changing');
        return expect(project.setIgnoredScopes).toHaveBeenCalledWith(['foo', 'bar']);
      });
    });
    describe('toggling on the includeThemes checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIncludeThemes');
        projectElement.includeThemes.checked = true;
        change(projectElement.includeThemes);
        expect(project.setIncludeThemes).toHaveBeenCalledWith(true);
        projectElement.includeThemes.checked = false;
        change(projectElement.includeThemes);
        return expect(project.setIncludeThemes).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalSourceNames checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSourceNames');
        projectElement.ignoreGlobalSourceNames.checked = true;
        change(projectElement.ignoreGlobalSourceNames);
        expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSourceNames.checked = false;
        change(projectElement.ignoreGlobalSourceNames);
        return expect(project.setIgnoreGlobalSourceNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalSupportedFiletypes checkbox', function() {
      return it('update the source names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSupportedFiletypes');
        projectElement.ignoreGlobalSupportedFiletypes.checked = true;
        change(projectElement.ignoreGlobalSupportedFiletypes);
        expect(project.setIgnoreGlobalSupportedFiletypes).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSupportedFiletypes.checked = false;
        change(projectElement.ignoreGlobalSupportedFiletypes);
        return expect(project.setIgnoreGlobalSupportedFiletypes).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredNames checkbox', function() {
      return it('update the ignored names in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredNames');
        projectElement.ignoreGlobalIgnoredNames.checked = true;
        change(projectElement.ignoreGlobalIgnoredNames);
        expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredNames.checked = false;
        change(projectElement.ignoreGlobalIgnoredNames);
        return expect(project.setIgnoreGlobalIgnoredNames).toHaveBeenCalledWith(false);
      });
    });
    describe('toggling on the ignoreGlobalIgnoredScopes checkbox', function() {
      return it('update the ignored scopes in the project', function() {
        spyOn(project, 'setIgnoreGlobalIgnoredScopes');
        projectElement.ignoreGlobalIgnoredScopes.checked = true;
        change(projectElement.ignoreGlobalIgnoredScopes);
        expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalIgnoredScopes.checked = false;
        change(projectElement.ignoreGlobalIgnoredScopes);
        return expect(project.setIgnoreGlobalIgnoredScopes).toHaveBeenCalledWith(false);
      });
    });
    return describe('toggling on the ignoreGlobalSearchNames checkbox', function() {
      return it('update the search names in the project', function() {
        spyOn(project, 'setIgnoreGlobalSearchNames');
        projectElement.ignoreGlobalSearchNames.checked = true;
        change(projectElement.ignoreGlobalSearchNames);
        expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(true);
        projectElement.ignoreGlobalSearchNames.checked = false;
        change(projectElement.ignoreGlobalSearchNames);
        return expect(project.setIgnoreGlobalSearchNames).toHaveBeenCalledWith(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXByb2plY3QtZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxNQUFBOztBQUFBLEVBQUMsU0FBVSxPQUFBLENBQVEsa0JBQVIsRUFBVixNQUFELENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFFBQUEsdUNBQUE7QUFBQSxJQUFBLE9BQXNDLEVBQXRDLEVBQUMsa0JBQUQsRUFBVyxpQkFBWCxFQUFvQix3QkFBcEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsY0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWQsQ0FBNEIsa0JBQTVCLENBQWpCLENBQUE7YUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixVQUE5QixDQUF5QyxDQUFDLElBQTFDLENBQStDLFNBQUMsR0FBRCxHQUFBO0FBQ2hFLFVBQUEsUUFBQSxHQUFXLEdBQUcsQ0FBQyxVQUFmLENBQUE7QUFBQSxVQUNBLE9BQUEsR0FBVSxRQUFRLENBQUMsVUFBVCxDQUFBLENBRFYsQ0FBQTtBQUFBLFVBRUEsY0FBQSxHQUFpQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsT0FBbkIsQ0FGakIsQ0FBQTtpQkFHQSxjQUFjLENBQUMsV0FBZixDQUEyQixjQUEzQixFQUpnRTtRQUFBLENBQS9DLEVBQUg7TUFBQSxDQUFoQixFQUhTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVdBLEVBQUEsQ0FBRyxvQ0FBSCxFQUF5QyxTQUFBLEdBQUE7YUFDdkMsTUFBQSxDQUFP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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/color-project-element-spec.coffee
