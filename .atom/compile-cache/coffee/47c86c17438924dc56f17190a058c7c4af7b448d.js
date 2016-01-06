(function() {
  var ColorBufferElement, ColorMarkerElement, path, sleep;

  path = require('path');

  require('./helpers/spec-helper');

  ColorBufferElement = require('../lib/color-buffer-element');

  ColorMarkerElement = require('../lib/color-marker-element');

  sleep = function(duration) {
    var t;
    t = new Date();
    return waitsFor(function() {
      return new Date() - t > duration;
    });
  };

  describe('ColorBufferElement', function() {
    var colorBuffer, colorBufferElement, editBuffer, editor, editorElement, isVisible, jasmineContent, jsonFixture, pigments, project, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], colorBuffer = _ref[2], pigments = _ref[3], project = _ref[4], colorBufferElement = _ref[5], jasmineContent = _ref[6];
    isVisible = function(node) {
      return !node.classList.contains('hidden');
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
    jsonFixture = function(fixture, data) {
      var json, jsonPath;
      jsonPath = path.resolve(__dirname, 'fixtures', fixture);
      json = fs.readFileSync(jsonPath).toString();
      json = json.replace(/#\{(\w+)\}/g, function(m, w) {
        return data[w];
      });
      return JSON.parse(json);
    };
    beforeEach(function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmineContent = document.body.querySelector('#jasmine-content');
      jasmineContent.appendChild(workspaceElement);
      atom.config.set('editor.softWrap', true);
      atom.config.set('editor.softWrapAtPreferredLineLength', true);
      atom.config.set('editor.preferredLineLength', 40);
      atom.config.set('pigments.delayBeforeScan', 0);
      atom.config.set('pigments.sourceNames', ['*.styl', '*.less']);
      waitsForPromise(function() {
        return atom.workspace.open('four-variables.styl').then(function(o) {
          editor = o;
          return editorElement = atom.views.getView(editor);
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
      if (colorBuffer != null) {
        return waitsForPromise(function() {
          return colorBuffer.variablesAvailable();
        });
      }
    });
    return describe('when an editor is opened', function() {
      beforeEach(function() {
        colorBuffer = project.colorBufferForEditor(editor);
        colorBufferElement = atom.views.getView(colorBuffer);
        return colorBufferElement.attach();
      });
      it('is associated to the ColorBuffer model', function() {
        expect(colorBufferElement).toBeDefined();
        return expect(colorBufferElement.getModel()).toBe(colorBuffer);
      });
      it('attaches itself in the target text editor element', function() {
        expect(colorBufferElement.parentNode).toExist();
        return expect(editorElement.shadowRoot.querySelector('.lines pigments-markers')).toExist();
      });
      describe('when the editor shadow dom setting is not enabled', function() {
        beforeEach(function() {
          editor.destroy();
          atom.config.set('editor.useShadowDOM', false);
          waitsForPromise(function() {
            return atom.workspace.open('four-variables.styl').then(function(o) {
              return editor = o;
            });
          });
          return runs(function() {
            editorElement = atom.views.getView(editor);
            colorBuffer = project.colorBufferForEditor(editor);
            colorBufferElement = atom.views.getView(colorBuffer);
            return colorBufferElement.attach();
          });
        });
        return it('attaches itself in the target text editor element', function() {
          expect(colorBufferElement.parentNode).toExist();
          return expect(editorElement.querySelector('.lines pigments-markers')).toExist();
        });
      });
      describe('when the color buffer is initialized', function() {
        beforeEach(function() {
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        it('creates markers views for every visible buffer marker', function() {
          var marker, markersElements, _i, _len, _results;
          markersElements = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
          expect(markersElements.length).toEqual(3);
          _results = [];
          for (_i = 0, _len = markersElements.length; _i < _len; _i++) {
            marker = markersElements[_i];
            _results.push(expect(marker.getModel()).toBeDefined());
          }
          return _results;
        });
        describe('when the project variables are initialized', function() {
          return it('creates markers for the new valid colors', function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(4);
            });
          });
        });
        describe('when a selection intersects a marker range', function() {
          beforeEach(function() {
            return spyOn(colorBufferElement, 'updateSelections').andCallThrough();
          });
          describe('after the markers views was created', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              runs(function() {
                return editor.setSelectedBufferRange([[2, 12], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            return it('hides the intersected marker', function() {
              var markers;
              markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
              expect(isVisible(markers[0])).toBeTruthy();
              expect(isVisible(markers[1])).toBeTruthy();
              expect(isVisible(markers[2])).toBeTruthy();
              return expect(isVisible(markers[3])).toBeFalsy();
            });
          });
          return describe('before all the markers views was created', function() {
            beforeEach(function() {
              runs(function() {
                return editor.setSelectedBufferRange([[0, 0], [2, 14]]);
              });
              return waitsFor(function() {
                return colorBufferElement.updateSelections.callCount > 0;
              });
            });
            it('hides the existing markers', function() {
              var markers;
              markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
              expect(isVisible(markers[0])).toBeFalsy();
              expect(isVisible(markers[1])).toBeTruthy();
              return expect(isVisible(markers[2])).toBeTruthy();
            });
            return describe('and the markers are updated', function() {
              beforeEach(function() {
                waitsForPromise(function() {
                  return colorBuffer.variablesAvailable();
                });
                return sleep(100);
              });
              return it('hides the created markers', function() {
                var markers;
                markers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker');
                expect(isVisible(markers[0])).toBeFalsy();
                expect(isVisible(markers[1])).toBeTruthy();
                expect(isVisible(markers[2])).toBeTruthy();
                return expect(isVisible(markers[3])).toBeFalsy();
              });
            });
          });
        });
        describe('when a line is edited and gets wrapped', function() {
          var marker;
          marker = null;
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.variablesAvailable();
            });
            runs(function() {
              marker = colorBufferElement.usedMarkers[colorBufferElement.usedMarkers.length - 1];
              spyOn(marker, 'render').andCallThrough();
              return editBuffer(new Array(20).join("foo "), {
                start: [1, 0],
                end: [1, 0]
              });
            });
            return waitsFor(function() {
              return marker.render.callCount > 0;
            });
          });
          return it('updates the markers whose screen range have changed', function() {
            return expect(marker.render).toHaveBeenCalled();
          });
        });
        describe('when some markers are destroyed', function() {
          var spy;
          spy = [][0];
          beforeEach(function() {
            var el, _i, _len, _ref1;
            _ref1 = colorBufferElement.usedMarkers;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              el = _ref1[_i];
              spyOn(el, 'release').andCallThrough();
            }
            spy = jasmine.createSpy('did-update');
            colorBufferElement.onDidUpdate(spy);
            editBuffer('', {
              start: [4, 0],
              end: [8, 0]
            });
            return waitsFor(function() {
              return spy.callCount > 0;
            });
          });
          it('releases the unused markers', function() {
            var marker, _i, _len, _ref1, _results;
            expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
            expect(colorBufferElement.usedMarkers.length).toEqual(2);
            expect(colorBufferElement.unusedMarkers.length).toEqual(1);
            _ref1 = colorBufferElement.unusedMarkers;
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              marker = _ref1[_i];
              _results.push(expect(marker.release).toHaveBeenCalled());
            }
            return _results;
          });
          return describe('and then a new marker is created', function() {
            beforeEach(function() {
              editor.moveToBottom();
              editBuffer('\nfoo = #123456\n');
              return waitsFor(function() {
                return colorBufferElement.unusedMarkers.length === 0;
              });
            });
            return it('reuses the previously released marker element', function() {
              expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
              expect(colorBufferElement.usedMarkers.length).toEqual(3);
              return expect(colorBufferElement.unusedMarkers.length).toEqual(0);
            });
          });
        });
        describe('when the current pane is splitted to the right', function() {
          beforeEach(function() {
            atom.commands.dispatch(editorElement, 'pane:split-right');
            editor = atom.workspace.getTextEditors()[1];
            colorBufferElement = atom.views.getView(project.colorBufferForEditor(editor));
            return waitsFor(function() {
              return colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length;
            });
          });
          return it('should keep all the buffer elements attached', function() {
            var editors;
            editors = atom.workspace.getTextEditors();
            return editors.forEach(function(editor) {
              editorElement = atom.views.getView(editor);
              colorBufferElement = editorElement.shadowRoot.querySelector('pigments-markers');
              expect(colorBufferElement).toExist();
              expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:empty').length).toEqual(0);
            });
          });
        });
        return describe('when the marker type is set to gutter', function() {
          var gutter;
          gutter = [][0];
          beforeEach(function() {
            waitsForPromise(function() {
              return colorBuffer.initialize();
            });
            return runs(function() {
              atom.config.set('pigments.markerType', 'gutter');
              return gutter = editorElement.shadowRoot.querySelector('[gutter-name="pigments"]');
            });
          });
          it('removes the markers', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(0);
          });
          it('adds a custom gutter to the text editor', function() {
            return expect(gutter).toExist();
          });
          it('sets the size of the gutter based on the number of markers in the same row', function() {
            return expect(gutter.style.minWidth).toEqual('14px');
          });
          it('adds a gutter decoration for each color marker', function() {
            var decorations;
            decorations = editor.getDecorations().filter(function(d) {
              return d.properties.type === 'gutter';
            });
            return expect(decorations.length).toEqual(3);
          });
          describe('when the variables become available', function() {
            beforeEach(function() {
              return waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
            });
            it('creates decorations for the new valid colors', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(4);
            });
            return describe('when many markers are added on the same line', function() {
              beforeEach(function() {
                var updateSpy;
                updateSpy = jasmine.createSpy('did-update');
                colorBufferElement.onDidUpdate(updateSpy);
                editor.moveToBottom();
                editBuffer('\nlist = #123456, #987654, #abcdef\n');
                return waitsFor(function() {
                  return updateSpy.callCount > 0;
                });
              });
              it('adds the new decorations to the gutter', function() {
                var decorations;
                decorations = editor.getDecorations().filter(function(d) {
                  return d.properties.type === 'gutter';
                });
                return expect(decorations.length).toEqual(7);
              });
              return it('sets the size of the gutter based on the number of markers in the same row', function() {
                return expect(gutter.style.minWidth).toEqual('42px');
              });
            });
          });
          describe('when the marker is changed again', function() {
            beforeEach(function() {
              return atom.config.set('pigments.markerType', 'background');
            });
            it('removes the gutter', function() {
              return expect(editorElement.shadowRoot.querySelector('[gutter-name="pigments"]')).not.toExist();
            });
            return it('recreates the markers', function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
            });
          });
          return describe('when a new buffer is opened', function() {
            beforeEach(function() {
              waitsForPromise(function() {
                return atom.workspace.open('project/styles/variables.styl').then(function(e) {
                  editor = e;
                  editorElement = atom.views.getView(editor);
                  colorBuffer = project.colorBufferForEditor(editor);
                  return colorBufferElement = atom.views.getView(colorBuffer);
                });
              });
              waitsForPromise(function() {
                return colorBuffer.initialize();
              });
              waitsForPromise(function() {
                return colorBuffer.variablesAvailable();
              });
              return runs(function() {
                return gutter = editorElement.shadowRoot.querySelector('[gutter-name="pigments"]');
              });
            });
            return it('creates the decorations in the new buffer gutter', function() {
              var decorations;
              decorations = editor.getDecorations().filter(function(d) {
                return d.properties.type === 'gutter';
              });
              return expect(decorations.length).toEqual(10);
            });
          });
        });
      });
      describe('when the editor is moved to another pane', function() {
        var newPane, pane, _ref1;
        _ref1 = [], pane = _ref1[0], newPane = _ref1[1];
        beforeEach(function() {
          pane = atom.workspace.getActivePane();
          newPane = pane.splitDown({
            copyActiveItem: false
          });
          colorBuffer = project.colorBufferForEditor(editor);
          colorBufferElement = atom.views.getView(colorBuffer);
          expect(atom.workspace.getPanes().length).toEqual(2);
          pane.moveItemToPane(editor, newPane, 0);
          return waitsFor(function() {
            return colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length;
          });
        });
        return it('moves the editor with the buffer to the new pane', function() {
          expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker').length).toEqual(3);
          return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:empty').length).toEqual(0);
        });
      });
      describe('when pigments.supportedFiletypes settings is defined', function() {
        var loadBuffer;
        loadBuffer = function(filePath) {
          waitsForPromise(function() {
            return atom.workspace.open(filePath).then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          waitsForPromise(function() {
            return colorBuffer.initialize();
          });
          return waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
        };
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          return waitsForPromise(function() {
            return atom.packages.activatePackage('language-less');
          });
        });
        describe('with the default wildcard', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['*']);
          });
          return it('supports every filetype', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
            });
          });
        });
        describe('with a filetype', function() {
          beforeEach(function() {
            return atom.config.set('pigments.supportedFiletypes', ['coffee']);
          });
          return it('supports the specified file type', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
            });
          });
        });
        return describe('with many filetypes', function() {
          beforeEach(function() {
            atom.config.set('pigments.supportedFiletypes', ['coffee']);
            return project.setSupportedFiletypes(['less']);
          });
          it('supports the specified file types', function() {
            loadBuffer('scope-filter.coffee');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
            });
            loadBuffer('project/vendor/css/variables.less');
            runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
            });
            loadBuffer('four-variables.styl');
            return runs(function() {
              return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
            });
          });
          return describe('with global file types ignored', function() {
            beforeEach(function() {
              atom.config.set('pigments.supportedFiletypes', ['coffee']);
              project.setIgnoreGlobalSupportedFiletypes(true);
              return project.setSupportedFiletypes(['less']);
            });
            return it('supports the specified file types', function() {
              loadBuffer('scope-filter.coffee');
              runs(function() {
                return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
              });
              loadBuffer('project/vendor/css/variables.less');
              runs(function() {
                return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(20);
              });
              loadBuffer('four-variables.styl');
              return runs(function() {
                return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
              });
            });
          });
        });
      });
      describe('when pigments.ignoredScopes settings is defined', function() {
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-coffee-script');
          });
          waitsForPromise(function() {
            return atom.workspace.open('scope-filter.coffee').then(function(o) {
              editor = o;
              editorElement = atom.views.getView(editor);
              colorBuffer = project.colorBufferForEditor(editor);
              colorBufferElement = atom.views.getView(colorBuffer);
              return colorBufferElement.attach();
            });
          });
          return waitsForPromise(function() {
            return colorBuffer.initialize();
          });
        });
        describe('with one filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(1);
          });
        });
        describe('with two filters', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\.string', '\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
          });
        });
        describe('with an invalid filter', function() {
          beforeEach(function() {
            return atom.config.set('pigments.ignoredScopes', ['\\']);
          });
          return it('ignores the filter', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(2);
          });
        });
        return describe('when the project ignoredScopes is defined', function() {
          beforeEach(function() {
            atom.config.set('pigments.ignoredScopes', ['\\.string']);
            return project.setIgnoredScopes(['\\.comment']);
          });
          return it('ignores the colors that matches the defined scopes', function() {
            return expect(colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)').length).toEqual(0);
          });
        });
      });
      return describe('when a text editor settings is modified', function() {
        var originalMarkers;
        originalMarkers = [][0];
        beforeEach(function() {
          waitsForPromise(function() {
            return colorBuffer.variablesAvailable();
          });
          return runs(function() {
            originalMarkers = colorBufferElement.shadowRoot.querySelectorAll('pigments-color-marker:not(:empty)');
            spyOn(colorBufferElement, 'updateMarkers').andCallThrough();
            return spyOn(ColorMarkerElement.prototype, 'render').andCallThrough();
          });
        });
        describe('editor.fontSize', function() {
          beforeEach(function() {
            return atom.config.set('editor.fontSize', 20);
          });
          return it('forces an update and a re-render of existing markers', function() {
            var marker, _i, _len, _results;
            expect(colorBufferElement.updateMarkers).toHaveBeenCalled();
            _results = [];
            for (_i = 0, _len = originalMarkers.length; _i < _len; _i++) {
              marker = originalMarkers[_i];
              _results.push(expect(marker.render).toHaveBeenCalled());
            }
            return _results;
          });
        });
        return describe('editor.lineHeight', function() {
          beforeEach(function() {
            return atom.config.set('editor.lineHeight', 20);
          });
          return it('forces an update and a re-render of existing markers', function() {
            var marker, _i, _len, _results;
            expect(colorBufferElement.updateMarkers).toHaveBeenCalled();
            _results = [];
            for (_i = 0, _len = originalMarkers.length; _i < _len; _i++) {
              marker = originalMarkers[_i];
              _results.push(expect(marker.render).toHaveBeenCalled());
            }
            return _results;
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLWJ1ZmZlci1lbGVtZW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsQ0FBUSx1QkFBUixDQURBLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsNkJBQVIsQ0FIckIsQ0FBQTs7QUFBQSxFQUlBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSw2QkFBUixDQUpyQixDQUFBOztBQUFBLEVBTUEsS0FBQSxHQUFRLFNBQUMsUUFBRCxHQUFBO0FBQ04sUUFBQSxDQUFBO0FBQUEsSUFBQSxDQUFBLEdBQVEsSUFBQSxJQUFBLENBQUEsQ0FBUixDQUFBO1dBQ0EsUUFBQSxDQUFTLFNBQUEsR0FBQTthQUFPLElBQUEsSUFBQSxDQUFBLENBQUosR0FBYSxDQUFiLEdBQWlCLFNBQXBCO0lBQUEsQ0FBVCxFQUZNO0VBQUEsQ0FOUixDQUFBOztBQUFBLEVBVUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixRQUFBLG1JQUFBO0FBQUEsSUFBQSxPQUE4RixFQUE5RixFQUFDLGdCQUFELEVBQVMsdUJBQVQsRUFBd0IscUJBQXhCLEVBQXFDLGtCQUFyQyxFQUErQyxpQkFBL0MsRUFBd0QsNEJBQXhELEVBQTRFLHdCQUE1RSxDQUFBO0FBQUEsSUFFQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7YUFBVSxDQUFBLElBQVEsQ0FBQyxTQUFTLENBQUMsUUFBZixDQUF3QixRQUF4QixFQUFkO0lBQUEsQ0FGWixDQUFBO0FBQUEsSUFJQSxVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sT0FBUCxH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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/color-buffer-element-spec.coffee
