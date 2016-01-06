(function() {
  var ColorSearch, click;

  click = require('./helpers/events').click;

  ColorSearch = require('../lib/color-search');

  describe('ColorResultsElement', function() {
    var completeSpy, findSpy, pigments, project, resultsElement, search, _ref;
    _ref = [], search = _ref[0], resultsElement = _ref[1], pigments = _ref[2], project = _ref[3], completeSpy = _ref[4], findSpy = _ref[5];
    beforeEach(function() {
      atom.config.set('pigments.sourceNames', ['**/*.styl', '**/*.less']);
      waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
      waitsForPromise(function() {
        return project.initialize();
      });
      return runs(function() {
        search = project.findAllColors();
        spyOn(search, 'search').andCallThrough();
        completeSpy = jasmine.createSpy('did-complete-search');
        search.onDidCompleteSearch(completeSpy);
        resultsElement = atom.views.getView(search);
        return jasmine.attachToDOM(resultsElement);
      });
    });
    afterEach(function() {
      return waitsFor(function() {
        return completeSpy.callCount > 0;
      });
    });
    it('is associated with ColorSearch model', function() {
      return expect(resultsElement).toBeDefined();
    });
    it('starts the search', function() {
      return expect(search.search).toHaveBeenCalled();
    });
    return describe('when matches are found', function() {
      beforeEach(function() {
        return waitsFor(function() {
          return completeSpy.callCount > 0;
        });
      });
      it('groups results by files', function() {
        var fileResults;
        fileResults = resultsElement.querySelectorAll('.list-nested-item');
        expect(fileResults.length).toEqual(7);
        return expect(fileResults[0].querySelectorAll('li.list-item').length).toEqual(3);
      });
      describe('when a file item is clicked', function() {
        var fileItem;
        fileItem = [][0];
        beforeEach(function() {
          fileItem = resultsElement.querySelector('.list-nested-item > .list-item');
          return click(fileItem);
        });
        return it('collapses the file matches', function() {
          return expect(resultsElement.querySelector('.list-nested-item.collapsed')).toExist();
        });
      });
      return describe('when a matches item is clicked', function() {
        var matchItem, spy, _ref1;
        _ref1 = [], matchItem = _ref1[0], spy = _ref1[1];
        beforeEach(function() {
          spy = jasmine.createSpy('did-add-text-editor');
          atom.workspace.onDidAddTextEditor(spy);
          matchItem = resultsElement.querySelector('.search-result.list-item');
          click(matchItem);
          return waitsFor(function() {
            return spy.callCount > 0;
          });
        });
        return it('opens the file', function() {
          var textEditor;
          expect(spy).toHaveBeenCalled();
          textEditor = spy.argsForCall[0][0].textEditor;
          return expect(textEditor.getSelectedBufferRange()).toEqual([[1, 13], [1, 23]]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXJlc3VsdHMtZWxlbWVudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFDLFFBQVMsT0FBQSxDQUFRLGtCQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQURkLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFFBQUEscUVBQUE7QUFBQSxJQUFBLE9BQW9FLEVBQXBFLEVBQUMsZ0JBQUQsRUFBUyx3QkFBVCxFQUF5QixrQkFBekIsRUFBbUMsaUJBQW5DLEVBQTRDLHFCQUE1QyxFQUF5RCxpQkFBekQsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxDQUN0QyxXQURzQyxFQUV0QyxXQUZzQyxDQUF4QyxDQUFBLENBQUE7QUFBQSxNQUtBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFVBQTlCLENBQXlDLENBQUMsSUFBMUMsQ0FBK0MsU0FBQyxHQUFELEdBQUE7QUFDaEUsVUFBQSxRQUFBLEdBQVcsR0FBRyxDQUFDLFVBQWYsQ0FBQTtpQkFDQSxPQUFBLEdBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBQSxFQUZzRDtRQUFBLENBQS9DLEVBQUg7TUFBQSxDQUFoQixDQUxBLENBQUE7QUFBQSxNQVNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsT0FBTyxDQUFDLFVBQVIsQ0FBQSxFQUFIO01BQUEsQ0FBaEIsQ0FUQSxDQUFBO2FBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsTUFBQSxHQUFTLE9BQU8sQ0FBQyxhQUFSLENBQUEsQ0FBVCxDQUFBO0FBQUEsUUFDQSxLQUFBLENBQU0sTUFBTixFQUFjLFFBQWQsQ0FBdUIsQ0FBQyxjQUF4QixDQUFBLENBREEsQ0FBQTtBQUFBLFFBRUEsV0FBQSxHQUFjLE9BQU8sQ0FBQyxTQUFSLENBQWtCLHFCQUFsQixDQUZkLENBQUE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixXQUEzQixDQUhBLENBQUE7QUFBQSxRQUtBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBTGpCLENBQUE7ZUFPQSxPQUFPLENBQUMsV0FBUixDQUFvQixjQUFwQixFQVJHO01BQUEsQ0FBTCxFQVpTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQXdCQSxTQUFBLENBQVUsU0FBQSxHQUFBO2FBQUcsUUFBQSxDQUFTLFNBQUEsR0FBQTtlQUFHLFdBQVcsQ0FBQyxTQUFaLEdBQXdCLEVBQTNCO01BQUEsQ0FBVCxFQUFIO0lBQUEsQ0FBVixDQXhCQSxDQUFBO0FBQUEsSUEwQkEsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTthQUN6QyxNQUFBLENBQU8sY0FBUCxDQUFzQixDQUFDLFdBQXZCLENBQUEsRUFEeUM7SUFBQSxDQUEzQyxDQTFCQSxDQUFBO0FBQUEsSUE2QkEsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTthQUN0QixNQUFBLENBQU8sTUFBTSxDQUFDLE1BQWQsQ0FBcUIsQ0FBQyxnQkFBdEIsQ0FBQSxFQURzQjtJQUFBLENBQXhCLENBN0JBLENBQUE7V0FnQ0EsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFBRyxRQUFBLENBQVMsU0FBQSxHQUFBO2lCQUFHLFdBQVcsQ0FBQyxTQUFaLEdBQXdCLEVBQTNCO1FBQUEsQ0FBVCxFQUFIO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUVBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBLEdBQUE7QUFDNUIsWUFBQSxXQUFBO0FBQUEsUUFBQSxXQUFBLEdBQWMsY0FBYyxDQUFDLGdCQUFmLENBQWdDLG1CQUFoQyxDQUFkLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxXQUFXLENBQUMsTUFBbkIsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxDQUFuQyxDQUZBLENBQUE7ZUFJQSxNQUFBLENBQU8sV0FBWSxDQUFBLENBQUEsQ0FBRSxDQUFDLGdCQUFmLENBQWdDLGNBQWhDLENBQStDLENBQUMsTUFBdkQsQ0FBOEQsQ0FBQyxPQUEvRCxDQUF1RSxDQUF2RSxFQUw0QjtNQUFBLENBQTlCLENBRkEsQ0FBQTtBQUFBLE1BU0EsUUFBQSxDQUFTLDZCQUFULEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxZQUFBLFFBQUE7QUFBQSxRQUFDLFdBQVksS0FBYixDQUFBO0FBQUEsUUFDQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxRQUFBLEdBQVcsY0FBYyxDQUFDLGFBQWYsQ0FBNkIsZ0NBQTdCLENBQVgsQ0FBQTtpQkFDQSxLQUFBLENBQU0sUUFBTixFQUZTO1FBQUEsQ0FBWCxDQURBLENBQUE7ZUFLQSxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQSxHQUFBO2lCQUMvQixNQUFBLENBQU8sY0FBYyxDQUFDLGFBQWYsQ0FBNkIsNkJBQTdCLENBQVAsQ0FBbUUsQ0FBQyxPQUFwRSxDQUFBLEVBRCtCO1FBQUEsQ0FBakMsRUFOc0M7TUFBQSxDQUF4QyxDQVRBLENBQUE7YUFrQkEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxZQUFBLHFCQUFBO0FBQUEsUUFBQSxRQUFtQixFQUFuQixFQUFDLG9CQUFELEVBQVksY0FBWixDQUFBO0FBQUEsUUFDQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFNBQVIsQ0FBa0IscUJBQWxCLENBQU4sQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxHQUFsQyxDQUZBLENBQUE7QUFBQSxVQUdBLFNBQUEsR0FBWSxjQUFjLENBQUMsYUFBZixDQUE2QiwwQkFBN0IsQ0FIWixDQUFBO0FBQUEsVUFJQSxLQUFBLENBQU0sU0FBTixDQUpBLENBQUE7aUJBTUEsUUFBQSxDQUFTLFNBQUEsR0FBQTttQkFBRyxHQUFHLENBQUMsU0FBSixHQUFnQixFQUFuQjtVQUFBLENBQVQsRUFQUztRQUFBLENBQVgsQ0FEQSxDQUFBO2VBVUEsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUEsR0FBQTtBQUNuQixjQUFBLFVBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxnQkFBWixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0MsYUFBYyxHQUFHLENBQUMsV0FBWSxDQUFBLENBQUEsQ0FBRyxDQUFBLENBQUEsRUFBakMsVUFERCxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxVQUFVLENBQUMsc0JBQVgsQ0FBQSxDQUFQLENBQTJDLENBQUMsT0FBNUMsQ0FBb0QsQ0FBQyxDQUFDLENBQUQsRUFBRyxFQUFILENBQUQsRUFBUSxDQUFDLENBQUQsRUFBRyxFQUFILENBQVIsQ0FBcEQsRUFIbUI7UUFBQSxDQUFyQixFQVh5QztNQUFBLENBQTNDLEVBbkJpQztJQUFBLENBQW5DLEVBakM4QjtFQUFBLENBQWhDLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/pigments/spec/color-results-element-spec.coffee
