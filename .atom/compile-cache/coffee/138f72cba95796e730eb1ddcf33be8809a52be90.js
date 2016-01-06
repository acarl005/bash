(function() {
  var ColorBuffer, jsonFixture, path, registry,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  ColorBuffer = require('../lib/color-buffer');

  registry = require('../lib/color-expressions');

  jsonFixture = require('./helpers/fixtures').jsonFixture(__dirname, 'fixtures');

  describe('ColorBuffer', function() {
    var colorBuffer, editBuffer, editor, pigments, project, sleep, _ref;
    _ref = [], editor = _ref[0], colorBuffer = _ref[1], pigments = _ref[2], project = _ref[3];
    sleep = function(ms) {
      var start;
      start = new Date;
      return function() {
        return new Date - start >= ms;
      };
    };
    editBuffer = function(text, options) {
      var range;
      if (options == null) {
        options = {};
      }
      if (options.start != null) {
        if (options.end != null) {
          range = [options.start, options.end];
        } else {
          range = [options.start, options.start];
        }
        editor.setSelectedBufferRange(range);
      }
      editor.insertText(text);
      if (!options.noEvent) {
        return advanceClock(500);
      }
    };
    beforeEach(function() {
      atom.config.set('pigments.delayBeforeScan', 0);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      atom.config.set('pigments.ignoredNames', ['project/vendor/**']);
      waitsForPromise(function() {
        return atom.workspace.open('four-variables.styl').then(function(o) {
          return editor = o;
        });
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pigments').then(function(pkg) {
          pigments = pkg.mainModule;
          return project = pigments.getProject();
        });
      });
    });
    afterEach(function() {
      return colorBuffer != null ? colorBuffer.destroy() : void 0;
    });
    it('creates a color buffer for each editor in the workspace', function() {
      return expect(project.colorBuffersByEditorId[editor.id]).toBeDefined();
    });
    describe('when an editor without path is opened', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open().then(function(o) {
            editor = o;
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('does not fails when updating the colorBuffer', function() {
        return expect(function() {
          return colorBuffer.update();
        }).not.toThrow();
      });
      return describe('when the file is saved and aquires a path', function() {
        describe('that is legible', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('new-path.styl');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('adds the path to the project paths', function() {
            return expect(__indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeTruthy();
          });
        });
        describe('that is not legible', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('new-path.sass');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('does not add the path to the project paths', function() {
            return expect(__indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeFalsy();
          });
        });
        return describe('that is ignored', function() {
          beforeEach(function() {
            spyOn(colorBuffer, 'update').andCallThrough();
            spyOn(editor, 'getPath').andReturn('project/vendor/new-path.styl');
            editor.emitter.emit('did-change-path', editor.getPath());
            return waitsFor(function() {
              return colorBuffer.update.callCount > 0;
            });
          });
          return it('does not add the path to the project paths', function() {
            return expect(__indexOf.call(project.getPaths(), 'new-path.styl') >= 0).toBeFalsy();
          });
        });
      });
    });
    describe('with rapid changes that triggers a rescan', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        waitsFor(function() {
          return colorBuffer.initialized && colorBuffer.variableInitialized;
        });
        runs(function() {
          spyOn(colorBuffer, 'terminateRunningTask').andCallThrough();
          spyOn(colorBuffer, 'updateColorMarkers').andCallThrough();
          spyOn(colorBuffer, 'scanBufferForVariables').andCallThrough();
          editor.moveToBottom();
          editor.insertText('#fff\n');
          return editor.getBuffer().emitter.emit('did-stop-changing');
        });
        waitsFor(function() {
          return colorBuffer.scanBufferForVariables.callCount > 0;
        });
        return runs(function() {
          editor.insertText(' ');
          editor.emitter.emit('did-change');
          return editor.getBuffer().emitter.emit('did-stop-changing');
        });
      });
      return it('terminates the currently running task', function() {
        return expect(colorBuffer.terminateRunningTask).toHaveBeenCalled();
      });
    });
    describe('when created without a previous state', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        return waitsForPromise(function() {
          return colorBuffer.initialize();
        });
      });
      it('scans the buffer for colors without waiting for the project variables', function() {
        expect(colorBuffer.getColorMarkers().length).toEqual(4);
        return expect(colorBuffer.getValidColorMarkers().length).toEqual(3);
      });
      it('creates the corresponding markers in the text editor', function() {
        return expect(editor.findMarkers({
          type: 'pigments-color'
        }).length).toEqual(4);
      });
      it('knows that it is legible as a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      describe('when the editor is destroyed', function() {
        return it('destroys the color buffer at the same time', function() {
          editor.destroy();
          return expect(project.colorBuffersByEditorId[editor.id]).toBeUndefined();
        });
      });
      describe('::getColorMarkerAtBufferPosition', function() {
        describe('when the buffer position is contained in a marker range', function() {
          return it('returns the corresponding color marker', function() {
            var colorMarker;
            colorMarker = colorBuffer.getColorMarkerAtBufferPosition([2, 15]);
            return expect(colorMarker).toEqual(colorBuffer.colorMarkers[1]);
          });
        });
        return describe('when the buffer position is not contained in a marker range', function() {
          return it('returns undefined', function() {
            return expect(colorBuffer.getColorMarkerAtBufferPosition([1, 15])).toBeUndefined();
          });
        });
      });
      describe('when the project variables becomes available', function() {
        var updateSpy;
        updateSpy = [][0];
        beforeEach(function() {
          updateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(updateSpy);
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        it('replaces the invalid markers that are now valid', function() {
          expect(colorBuffer.getValidColorMarkers().length).toEqual(4);
          expect(updateSpy.argsForCall[0][0].created.length).toEqual(1);
          return expect(updateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
        });
        it('destroys the text editor markers', function() {
          return expect(editor.findMarkers({
            type: 'pigments-color'
          }).length).toEqual(4);
        });
        describe('when a variable is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
            return editBuffer('#336699', {
              start: [0, 13],
              end: [0, 17]
            });
          });
          return it('updates the modified colors', function() {
            waitsFor(function() {
              return colorsUpdateSpy.callCount > 0;
            });
            return runs(function() {
              expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(2);
              return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(2);
            });
          });
        });
        describe('when a new variable is added', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              updateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(updateSpy);
              editor.moveToBottom();
              editBuffer('\nfoo = base-color');
              return waitsFor(function() {
                return updateSpy.callCount > 0;
              });
            });
          });
          return it('dispatches the new marker in a did-update-color-markers event', function() {
            expect(updateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(updateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when a variable is removed', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
            colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
            editBuffer('', {
              start: [0, 0],
              end: [0, 17]
            });
            return waitsFor(function() {
              return colorsUpdateSpy.callCount > 0;
            });
          });
          return it('invalidates colors that were relying on the deleted variables', function() {
            expect(colorBuffer.getColorMarkers().length).toEqual(3);
            return expect(colorBuffer.getValidColorMarkers().length).toEqual(2);
          });
        });
        return describe('::serialize', function() {
          beforeEach(function() {
            return waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
          });
          return it('returns the whole buffer data', function() {
            var expected;
            expected = jsonFixture("four-variables-buffer.json", {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: colorBuffer.getColorMarkers().map(function(m) {
                return m.marker.id;
              })
            });
            return expect(colorBuffer.serialize()).toEqual(expected);
          });
        });
      });
      describe('with a buffer with only colors', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('buttons.styl').then(function(o) {
              return editor = o;
            });
          });
          return runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
        });
        it('creates the color markers for the variables used in the buffer', function() {
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(0);
          });
        });
        it('creates the color markers for the variables used in the buffer', function() {
          waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
          return runs(function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(3);
          });
        });
        describe('when a color marker is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('#336699', {
                start: [1, 13],
                end: [1, 23]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('updates the modified color marker', function() {
            var marker, markers;
            markers = colorBuffer.getColorMarkers();
            marker = markers[markers.length - 1];
            return expect(marker.color).toBeColor('#336699');
          });
          it('updates only the affected marker', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
          return it('removes the previous editor markers', function() {
            return expect(editor.findMarkers({
              type: 'pigments-color'
            }).length).toEqual(3);
          });
        });
        describe('when new lines changes the markers range', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('#fff\n\n', {
                start: [0, 0],
                end: [0, 0]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          return it('does not destroys the previous markers', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        describe('when a new color is added', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editor.moveToBottom();
              editBuffer('\n#336699');
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('adds a marker for the new color', function() {
            var marker, markers;
            markers = colorBuffer.getColorMarkers();
            marker = markers[markers.length - 1];
            expect(markers.length).toEqual(4);
            expect(marker.color).toBeColor('#336699');
            return expect(editor.findMarkers({
              type: 'pigments-color'
            }).length).toEqual(4);
          });
          return it('dispatches the new marker in a did-update-color-markers event', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(0);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(1);
          });
        });
        return describe('when a color marker is edited', function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
              colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
              editBuffer('', {
                start: [1, 2],
                end: [1, 23]
              });
              return waitsFor(function() {
                return colorsUpdateSpy.callCount > 0;
              });
            });
          });
          it('updates the modified color marker', function() {
            return expect(colorBuffer.getColorMarkers().length).toEqual(2);
          });
          it('updates only the affected marker', function() {
            expect(colorsUpdateSpy.argsForCall[0][0].destroyed.length).toEqual(1);
            return expect(colorsUpdateSpy.argsForCall[0][0].created.length).toEqual(0);
          });
          return it('removes the previous editor markers', function() {
            return expect(editor.findMarkers({
              type: 'pigments-color'
            }).length).toEqual(2);
          });
        });
      });
      return describe('with a buffer whose scope is not one of source files', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('project/lib/main.coffee').then(function(o) {
              return editor = o;
            });
          });
          runs(function() {
            return colorBuffer = project.colorBufferForEditor(editor);
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        });
        return it('does not renders colors from variables', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(4);
        });
      });
    });
    describe('with a buffer part of the global ignored files', function() {
      beforeEach(function() {
        project.setIgnoredNames([]);
        atom.config.set('pigments.ignoredNames', ['project/vendor/*']);
        waitsForPromise(function() {
          return atom.workspace.open('project/vendor/css/variables.less').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeTruthy();
      });
      it('knows that it is a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      return it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(20);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(20);
      });
    });
    describe('with a buffer part of the project ignored files', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('project/vendor/css/variables.less').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeTruthy();
      });
      it('knows that it is a variables source file', function() {
        return expect(colorBuffer.isVariablesSource()).toBeTruthy();
      });
      it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(20);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(20);
      });
      return describe('when the buffer is edited', function() {
        beforeEach(function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
          colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
          editor.moveToBottom();
          editBuffer('\n\n@new-color: @base0;\n');
          return waitsFor(function() {
            return colorsUpdateSpy.callCount > 0;
          });
        });
        return it('finds the newly added color', function() {
          var validMarkers;
          expect(colorBuffer.getColorMarkers().length).toEqual(21);
          validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
            return m.color.isValid();
          });
          return expect(validMarkers.length).toEqual(21);
        });
      });
    });
    describe('with a buffer not being a variable source', function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('project/lib/main.coffee').then(function(o) {
            return editor = o;
          });
        });
        runs(function() {
          return colorBuffer = project.colorBufferForEditor(editor);
        });
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      });
      it('knows that it is not part of the source files', function() {
        return expect(colorBuffer.isVariablesSource()).toBeFalsy();
      });
      it('knows that it is not part of the ignored files', function() {
        return expect(colorBuffer.isIgnored()).toBeFalsy();
      });
      it('scans the buffer for variables for in-buffer use only', function() {
        var validMarkers;
        expect(colorBuffer.getColorMarkers().length).toEqual(4);
        validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
          return m.color.isValid();
        });
        return expect(validMarkers.length).toEqual(4);
      });
      return describe('when the buffer is edited', function() {
        beforeEach(function() {
          var colorsUpdateSpy;
          colorsUpdateSpy = jasmine.createSpy('did-update-color-markers');
          spyOn(project, 'reloadVariablesForPath').andCallThrough();
          colorBuffer.onDidUpdateColorMarkers(colorsUpdateSpy);
          editor.moveToBottom();
          editBuffer('\n\n@new-color = red;\n');
          return waitsFor(function() {
            return colorsUpdateSpy.callCount > 0;
          });
        });
        it('finds the newly added color', function() {
          var validMarkers;
          expect(colorBuffer.getColorMarkers().length).toEqual(5);
          validMarkers = colorBuffer.getColorMarkers().filter(function(m) {
            return m.color.isValid();
          });
          return expect(validMarkers.length).toEqual(5);
        });
        return it('does not ask the project to reload the variables', function() {
          return expect(project.reloadVariablesForPath.mostRecentCall.args[0]).not.toEqual(colorBuffer.editor.getPath());
        });
      });
    });
    return describe('when created with a previous state', function() {
      describe('with variables and colors', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            var state;
            project.colorBufferForEditor(editor).destroy();
            state = jsonFixture('four-variables-buffer.json', {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: [-1, -2, -3, -4]
            });
            state.editor = editor;
            state.project = project;
            return colorBuffer = new ColorBuffer(state);
          });
        });
        it('creates markers from the state object', function() {
          return expect(colorBuffer.getColorMarkers().length).toEqual(4);
        });
        it('restores the markers properties', function() {
          var colorMarker;
          colorMarker = colorBuffer.getColorMarkers()[3];
          expect(colorMarker.color).toBeColor(255, 255, 255, 0.5);
          return expect(colorMarker.color.variables).toEqual(['base-color']);
        });
        it('restores the editor markers', function() {
          return expect(editor.findMarkers({
            type: 'pigments-color'
          }).length).toEqual(4);
        });
        return it('restores the ability to fetch markers', function() {
          var marker, _i, _len, _ref1, _results;
          expect(colorBuffer.findColorMarkers().length).toEqual(4);
          _ref1 = colorBuffer.findColorMarkers();
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            marker = _ref1[_i];
            _results.push(expect(marker).toBeDefined());
          }
          return _results;
        });
      });
      return describe('with an invalid color', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('invalid-color.styl').then(function(o) {
              return editor = o;
            });
          });
          waitsForPromise(function() {
            return project.initialize();
          });
          return runs(function() {
            var state;
            state = jsonFixture('invalid-color-buffer.json', {
              id: editor.id,
              root: atom.project.getPaths()[0],
              colorMarkers: [-1]
            });
            state.editor = editor;
            state.project = project;
            return colorBuffer = new ColorBuffer(state);
          });
        });
        return it('creates markers from the state object', function() {
          expect(colorBuffer.getColorMarkers().length).toEqual(1);
          return expect(colorBuffer.getValidColorMarkers().length).toEqual(0);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLWJ1ZmZlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSwwQkFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsT0FBQSxDQUFRLG9CQUFSLENBQTZCLENBQUMsV0FBOUIsQ0FBMEMsU0FBMUMsRUFBcUQsVUFBckQsQ0FIZCxDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsK0RBQUE7QUFBQSxJQUFBLE9BQTJDLEVBQTNDLEVBQUMsZ0JBQUQsRUFBUyxxQkFBVCxFQUFzQixrQkFBdEIsRUFBZ0MsaUJBQWhDLENBQUE7QUFBQSxJQUVBLEtBQUEsR0FBUSxTQUFDLEVBQUQsR0FBQTtBQUNOLFVBQUEsS0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUEsQ0FBQSxJQUFSLENBQUE7YUFDQSxTQUFBLEdBQUE7ZUFBRyxHQUFBLENBQUEsSUFBQSxHQUFXLEtBQVgsSUFBb0IsR0FBdkI7TUFBQSxFQUZNO0lBQUEsQ0FGUixDQUFBO0FBQUEsSUFNQSxVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sT0FBUCxHQUFBO0FBQ1gsVUFBQSxLQUFBOztRQURrQixVQUFRO09BQzFCO0FBQUEsTUFBQSxJQUFHLHFCQUFIO0FBQ0UsUUFBQSxJQUFHLG1CQUFIO0FBQ0UsVUFBQSxLQUFBLEdBQVEsQ0FBQyxPQUFPLENBQUMsS0FBVCxF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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/color-buffer-spec.coffee
