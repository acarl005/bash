(function() {
  var Disposable, Pigments, PigmentsAPI, SERIALIZE_MARKERS_VERSION, SERIALIZE_VERSION, _ref;

  Disposable = require('atom').Disposable;

  Pigments = require('../lib/pigments');

  PigmentsAPI = require('../lib/pigments-api');

  _ref = require('../lib/versions'), SERIALIZE_VERSION = _ref.SERIALIZE_VERSION, SERIALIZE_MARKERS_VERSION = _ref.SERIALIZE_MARKERS_VERSION;

  describe("Pigments", function() {
    var pigments, project, workspaceElement, _ref1;
    _ref1 = [], workspaceElement = _ref1[0], pigments = _ref1[1], project = _ref1[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      atom.config.set('pigments.sourceNames', ['**/*.sass', '**/*.styl']);
      atom.config.set('pigments.ignoredNames', []);
      atom.config.set('pigments.ignoredScopes', []);
      atom.config.set('pigments.autocompleteScopes', []);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
    });
    it('instanciates a ColorProject instance', function() {
      return expect(pigments.getProject()).toBeDefined();
    });
    it('serializes the project', function() {
      var date;
      date = new Date;
      spyOn(pigments.getProject(), 'getTimestamp').andCallFake(function() {
        return date;
      });
      return expect(pigments.serialize()).toEqual({
        project: {
          deserializer: 'ColorProject',
          timestamp: date,
          version: SERIALIZE_VERSION,
          markersVersion: SERIALIZE_MARKERS_VERSION,
          globalSourceNames: ['**/*.sass', '**/*.styl'],
          globalIgnoredNames: [],
          buffers: {}
        }
      });
    });
    describe('when deactivated', function() {
      var colorBuffer, editor, editorElement, _ref2;
      _ref2 = [], editor = _ref2[0], editorElement = _ref2[1], colorBuffer = _ref2[2];
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        waitsFor(function() {
          return editorElement.shadowRoot.querySelector('pigments-markers');
        });
        return runs(function() {
          spyOn(project, 'destroy').andCallThrough();
          spyOn(colorBuffer, 'destroy').andCallThrough();
          return pigments.deactivate();
        });
      });
      it('destroys the pigments project', function() {
        return expect(project.destroy).toHaveBeenCalled();
      });
      it('destroys all the color buffers that were created', function() {
        expect(project.colorBufferForEditor(editor)).toBeUndefined();
        expect(project.colorBuffersByEditorId).toBeNull();
        return expect(colorBuffer.destroy).toHaveBeenCalled();
      });
      return it('destroys the color buffer element that were added to the DOM', function() {
        return expect(editorElement.shadowRoot.querySelector('pigments-markers')).not.toExist();
      });
    });
    describe('pigments:project-settings', function() {
      var item;
      item = null;
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'pigments:project-settings');
        return waitsFor(function() {
          item = atom.workspace.getActivePaneItem();
          return item != null;
        });
      });
      return it('opens a settings view in the active pane', function() {
        return item.matches('pigments-color-project');
      });
    });
    describe('API provider', function() {
      var buffer, editor, editorElement, service, _ref2;
      _ref2 = [], service = _ref2[0], editor = _ref2[1], editorElement = _ref2[2], buffer = _ref2[3];
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('four-variables.styl').then(function(e) {
            editor = e;
            editorElement = atom.views.getView(e);
            return buffer = project.colorBufferForEditor(editor);
          });
        });
        runs(function() {
          return service = pigments.provideAPI();
        });
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      it('returns an object conforming to the API', function() {
        expect(service instanceof PigmentsAPI).toBeTruthy();
        expect(service.getProject()).toBe(project);
        expect(service.getPalette()).toEqual(project.getPalette());
        expect(service.getPalette()).not.toBe(project.getPalette());
        expect(service.getVariables()).toEqual(project.getVariables());
        return expect(service.getColorVariables()).toEqual(project.getColorVariables());
      });
      return describe('::observeColorBuffers', function() {
        var spy;
        spy = [][0];
        beforeEach(function() {
          spy = jasmine.createSpy('did-create-color-buffer');
          return service.observeColorBuffers(spy);
        });
        it('calls the callback for every existing color buffer', function() {
          expect(spy).toHaveBeenCalled();
          return expect(spy.calls.length).toEqual(1);
        });
        return it('calls the callback on every new buffer creation', function() {
          waitsForPromise(function() {
            return atom.workspace.open('buttons.styl');
          });
          return runs(function() {
            return expect(spy.calls.length).toEqual(2);
          });
        });
      });
    });
    describe('color expression consumer', function() {
      var colorBuffer, colorBufferElement, colorProvider, consumerDisposable, editor, editorElement, otherConsumerDisposable, _ref2;
      _ref2 = [], colorProvider = _ref2[0], consumerDisposable = _ref2[1], editor = _ref2[2], editorElement = _ref2[3], colorBuffer = _ref2[4], colorBufferElement = _ref2[5], otherConsumerDisposable = _ref2[6];
      beforeEach(function() {
        return colorProvider = {
          name: 'todo',
          regexpString: 'TODO',
          scopes: ['*'],
          priority: 0,
          handle: function(match, expression, context) {
            return this.red = 255;
          }
        };
      });
      afterEach(function() {
        if (consumerDisposable != null) {
          consumerDisposable.dispose();
        }
        return otherConsumerDisposable != null ? otherConsumerDisposable.dispose() : void 0;
      });
      describe('when consumed before opening a text editor', function() {
        beforeEach(function() {
          consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          waitsForPromise(function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('parses the new expression and renders a color', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(1);
        });
        it('returns a Disposable instance', function() {
          return expect(consumerDisposable instanceof Disposable).toBeTruthy();
        });
        return describe('the returned disposable', function() {
          it('removes the provided expression from the registry', function() {
            consumerDisposable.dispose();
            return expect(project.getColorExpressionsRegistry().getExpression('todo')).toBeUndefined();
          });
          return it('triggers an update in the opened editors', function() {
            var updateSpy;
            updateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(updateSpy);
            consumerDisposable.dispose();
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 0;
            });
            return runs(function() {
              return expect(colorBuffer.getColorMarkers().length).toEqual(0);
            });
          });
        });
      });
      describe('when consumed after opening a text editor', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('color-consumer-sample.txt').then(function(e) {
              editor = e;
              editorElement = atom.views.getView(e);
              return colorBuffer = project.colorBufferForEditor(editor);
            });
          });
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('triggers an update in the opened editors', function() {
          var updateSpy;
          updateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(updateSpy);
          consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          waitsFor('did-update-color-markers event dispatched', function() {
            return updateSpy.callCount > 0;
          });
          runs(function() {
            expect(colorBuffer.getColorMarkers().length).toEqual(1);
            return consumerDisposable.dispose();
          });
          waitsFor('did-update-color-markers event dispatched', function() {
            return updateSpy.callCount > 1;
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(0);
          });
        });
        return describe('when an array of expressions is passed', function() {
          return it('triggers an update in the opened editors', function() {
            var updateSpy;
            updateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(updateSpy);
            consumerDisposable = pigments.consumeColorExpressions({
              expressions: [colorProvider]
            });
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 0;
            });
            runs(function() {
              expect(colorBuffer.getColorMarkers().length).toEqual(1);
              return consumerDisposable.dispose();
            });
            waitsFor('did-update-color-markers event dispatched', function() {
              return updateSpy.callCount > 1;
            });
            return runs(function() {
              return expect(colorBuffer.getColorMarkers().length).toEqual(0);
            });
          });
        });
      });
      return describe('when the expression matches a variable value', function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return project.initialize();
          });
        });
        it('detects the new variable as a color variable', function() {
          var variableSpy;
          variableSpy = jasmine.createSpy('did-update-variables');
          project.onDidUpdateVariables(variableSpy);
          atom.config.set('pigments.sourceNames', ['**/*.txt']);
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 1;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(4);
            expect(project.getColorVariables().length).toEqual(2);
            return consumerDisposable = pigments.consumeColorExpressions(colorProvider);
          });
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 2;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(4);
            return expect(project.getColorVariables().length).toEqual(3);
          });
        });
        return describe('and there was an expression that could not be resolved before', function() {
          return it('updates the invalid color as a now valid color', function() {
            var variableSpy;
            variableSpy = jasmine.createSpy('did-update-variables');
            project.onDidUpdateVariables(variableSpy);
            atom.config.set('pigments.sourceNames', ['**/*.txt']);
            waitsFor('variables updated', function() {
              return variableSpy.callCount > 1;
            });
            return runs(function() {
              otherConsumerDisposable = pigments.consumeColorExpressions({
                name: 'bar',
                regexpString: 'baz\\s+(\\w+)',
                handle: function(match, expression, context) {
                  var color, expr, _;
                  _ = match[0], expr = match[1];
                  color = context.readColor(expr);
                  if (context.isInvalid(color)) {
                    return this.invalid = true;
                  }
                  return this.rgba = color.rgba;
                }
              });
              consumerDisposable = pigments.consumeColorExpressions(colorProvider);
              waitsFor('variables updated', function() {
                return variableSpy.callCount > 2;
              });
              runs(function() {
                expect(project.getVariables().length).toEqual(4);
                expect(project.getColorVariables().length).toEqual(4);
                expect(project.getVariableByName('bar').color.invalid).toBeFalsy();
                return consumerDisposable.dispose();
              });
              waitsFor('variables updated', function() {
                return variableSpy.callCount > 3;
              });
              return runs(function() {
                expect(project.getVariables().length).toEqual(4);
                expect(project.getColorVariables().length).toEqual(3);
                return expect(project.getVariableByName('bar').color.invalid).toBeTruthy();
              });
            });
          });
        });
      });
    });
    return describe('variable expression consumer', function() {
      var colorBuffer, colorBufferElement, consumerDisposable, editor, editorElement, variableProvider, _ref2;
      _ref2 = [], variableProvider = _ref2[0], consumerDisposable = _ref2[1], editor = _ref2[2], editorElement = _ref2[3], colorBuffer = _ref2[4], colorBufferElement = _ref2[5];
      beforeEach(function() {
        variableProvider = {
          name: 'todo',
          regexpString: '(TODO):\\s*([^;\\n]+)'
        };
        return waitsForPromise(function() {
          return project.initialize();
        });
      });
      afterEach(function() {
        return consumerDisposable != null ? consumerDisposable.dispose() : void 0;
      });
      it('updates the project variables when consumed', function() {
        var variableSpy;
        variableSpy = jasmine.createSpy('did-update-variables');
        project.onDidUpdateVariables(variableSpy);
        atom.config.set('pigments.sourceNames', ['**/*.txt']);
        waitsFor('variables updated', function() {
          return variableSpy.callCount > 1;
        });
        runs(function() {
          expect(project.getVariables().length).toEqual(4);
          expect(project.getColorVariables().length).toEqual(2);
          return consumerDisposable = pigments.consumeVariableExpressions(variableProvider);
        });
        waitsFor('variables updated after service consumed', function() {
          return variableSpy.callCount > 2;
        });
        runs(function() {
          expect(project.getVariables().length).toEqual(5);
          expect(project.getColorVariables().length).toEqual(2);
          return consumerDisposable.dispose();
        });
        waitsFor('variables updated after service disposed', function() {
          return variableSpy.callCount > 3;
        });
        return runs(function() {
          expect(project.getVariables().length).toEqual(4);
          return expect(project.getColorVariables().length).toEqual(2);
        });
      });
      return describe('when an array of expressions is passed', function() {
        return it('updates the project variables when consumed', function() {
          var variableSpy;
          variableSpy = jasmine.createSpy('did-update-variables');
          project.onDidUpdateVariables(variableSpy);
          atom.config.set('pigments.sourceNames', ['**/*.txt']);
          waitsFor('variables updated', function() {
            return variableSpy.callCount > 1;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(4);
            expect(project.getColorVariables().length).toEqual(2);
            return consumerDisposable = pigments.consumeVariableExpressions({
              expressions: [variableProvider]
            });
          });
          waitsFor('variables updated after service consumed', function() {
            return variableSpy.callCount > 2;
          });
          runs(function() {
            expect(project.getVariables().length).toEqual(5);
            expect(project.getColorVariables().length).toEqual(2);
            return consumerDisposable.dispose();
          });
          waitsFor('variables updated after service disposed', function() {
            return variableSpy.callCount > 3;
          });
          return runs(function() {
            expect(project.getVariables().length).toEqual(4);
            return expect(project.getColorVariables().length).toEqual(2);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL3BpZ21lbnRzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQUZkLENBQUE7O0FBQUEsRUFJQSxPQUFpRCxPQUFBLENBQVEsaUJBQVIsQ0FBakQsRUFBQyx5QkFBQSxpQkFBRCxFQUFvQixpQ0FBQSx5QkFKcEIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLDBDQUFBO0FBQUEsSUFBQSxRQUF3QyxFQUF4QyxFQUFDLDJCQUFELEVBQW1CLG1CQUFuQixFQUE2QixrQkFBN0IsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEIsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLENBQUMsV0FBRCxFQUFjLFdBQWQsQ0FBeEMsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLEVBQXpDLENBSkEsQ0FBQTtBQUFBLE1BS0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixF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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/pigments-spec.coffee
