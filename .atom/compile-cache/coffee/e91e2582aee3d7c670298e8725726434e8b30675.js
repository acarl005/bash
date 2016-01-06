(function() {
  var ColorSearch;

  require('./helpers/matchers');

  ColorSearch = require('../lib/color-search');

  describe('ColorSearch', function() {
    var pigments, project, search, _ref;
    _ref = [], search = _ref[0], pigments = _ref[1], project = _ref[2];
    beforeEach(function() {
      atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
      atom.config.set('pigments.extendedSearchNames', ['**/*.css']);
      atom.config.set('pigments.ignoredNames', ['project/vendor/**']);
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
      return waitsForPromise(function() {
        return project.initialize();
      });
    });
    return describe('when created with basic options', function() {
      beforeEach(function() {
        return search = project.findAllColors();
      });
      it('dispatches a did-complete-search when finalizing its search', function() {
        var spy;
        spy = jasmine.createSpy('did-complete-search');
        search.onDidCompleteSearch(spy);
        search.search();
        waitsFor(function() {
          return spy.callCount > 0;
        });
        return runs(function() {
          return expect(spy.argsForCall[0][0].length).toEqual(24);
        });
      });
      return it('dispatches a did-find-matches event for every file', function() {
        var completeSpy, findSpy;
        completeSpy = jasmine.createSpy('did-complete-search');
        findSpy = jasmine.createSpy('did-find-matches');
        search.onDidCompleteSearch(completeSpy);
        search.onDidFindMatches(findSpy);
        search.search();
        waitsFor(function() {
          return completeSpy.callCount > 0;
        });
        return runs(function() {
          expect(findSpy.callCount).toEqual(6);
          return expect(findSpy.argsForCall[0][0].matches.length).toEqual(3);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXNlYXJjaC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsT0FBQSxDQUFRLG9CQUFSLENBQUEsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsK0JBQUE7QUFBQSxJQUFBLE9BQThCLEVBQTlCLEVBQUMsZ0JBQUQsRUFBUyxrQkFBVCxFQUFtQixpQkFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxDQUN0QyxXQURzQyxFQUV0QyxXQUZzQyxDQUF4QyxDQUFBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw4QkFBaEIsRUFBZ0QsQ0FDOUMsVUFEOEMsQ0FBaEQsQ0FKQSxDQUFBO0FBQUEsTUFPQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLENBQ3ZDLG1CQUR1QyxDQUF6QyxDQVBBLENBQUE7QUFBQSxNQVdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQyxHQUFELEdBQUE7QUFDaEUsVUFBQSxRQUFBLEdBQVcsR0FBRyxDQUFDLFVBQWYsQ0FBQTtpQkFDQSxPQUFBLEdBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBQSxFQUZzRDtRQUFBLENBQS9DLEVBQUg7TUFBQSxDQUFoQixDQVhBLENBQUE7YUFlQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLE9BQU8sQ0FBQyxVQUFSLENBQUEsRUFBSDtNQUFBLENBQWhCLEVBaEJTO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FvQkEsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxNQUFBLEdBQVMsT0FBTyxDQUFDLGFBQVIsQ0FBQSxFQURBO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUdBLEVBQUEsQ0FBRyw2REFBSCxFQUFrRSxTQUFBLEdBQUE7QUFDaEUsWUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFNBQVIsQ0FBa0IscUJBQWxCLENBQU4sQ0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLG1CQUFQLENBQTJCLEdBQTNCLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBTSxDQUFDLE1BQVAsQ0FBQSxDQUZBLENBQUE7QUFBQSxRQUdBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7aUJBQUcsR0FBRyxDQUFDLFNBQUosR0FBZ0IsRUFBbkI7UUFBQSxDQUFULENBSEEsQ0FBQTtlQUlBLElBQUEsQ0FBSyxTQUFBLEdBQUE7aUJBQUcsTUFBQSxDQUFPLEdBQUcsQ0FBQyxXQUFZLENBQUEsQ0FBQSxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBN0IsQ0FBb0MsQ0FBQyxPQUFyQyxDQUE2QyxFQUE3QyxFQUFIO1FBQUEsQ0FBTCxFQUxnRTtNQUFBLENBQWxFLENBSEEsQ0FBQTthQVVBLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBLEdBQUE7QUFDdkQsWUFBQSxvQkFBQTtBQUFBLFFBQUEsV0FBQSxHQUFjLE9BQU8sQ0FBQyxTQUFSLENBQWtCLHFCQUFsQixDQUFkLENBQUE7QUFBQSxRQUNBLE9BQUEsR0FBVSxPQUFPLENBQUMsU0FBUixDQUFrQixrQkFBbEIsQ0FEVixDQUFBO0FBQUEsUUFFQSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsV0FBM0IsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsT0FBeEIsQ0FIQSxDQUFBO0FBQUEsUUFJQSxNQUFNLENBQUMsTUFBUCxDQUFBLENBSkEsQ0FBQTtBQUFBLFFBS0EsUUFBQSxDQUFTLFNBQUEsR0FBQTtpQkFBRyxXQUFXLENBQUMsU0FBWixHQUF3QixFQUEzQjtRQUFBLENBQVQsQ0FMQSxDQUFBO2VBTUEsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsT0FBMUIsQ0FBa0MsQ0FBbEMsQ0FBQSxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsV0FBWSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxNQUF6QyxDQUFnRCxDQUFDLE9BQWpELENBQXlELENBQXpELEVBRkc7UUFBQSxDQUFMLEVBUHVEO01BQUEsQ0FBekQsRUFYMEM7SUFBQSxDQUE1QyxFQXJCc0I7RUFBQSxDQUF4QixDQUhBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/pigments/spec/color-search-spec.coffee
