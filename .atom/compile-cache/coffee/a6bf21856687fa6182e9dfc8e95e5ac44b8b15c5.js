(function() {
  var MarkdownPreviewView, fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  MarkdownPreviewView = require('../lib/markdown-preview-view');

  describe("MarkdownPreviewView", function() {
    var file, preview, workspaceElement, _ref;
    _ref = [], file = _ref[0], preview = _ref[1], workspaceElement = _ref[2];
    beforeEach(function() {
      var filePath;
      filePath = atom.project.getDirectories()[0].resolve('subdir/file.markdown');
      preview = new MarkdownPreviewView({
        filePath: filePath
      });
      jasmine.attachToDOM(preview.element);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-ruby');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('markdown-preview');
      });
    });
    afterEach(function() {
      return preview.destroy();
    });
    describe("::constructor", function() {
      it("shows a loading spinner and renders the markdown", function() {
        preview.showLoading();
        expect(preview.find('.markdown-spinner')).toExist();
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        return runs(function() {
          return expect(preview.find(".emoji")).toExist();
        });
      });
      return it("shows an error message when there is an error", function() {
        preview.showError("Not a real file");
        return expect(preview.text()).toContain("Failed");
      });
    });
    describe("serialization", function() {
      var newPreview;
      newPreview = null;
      afterEach(function() {
        return newPreview != null ? newPreview.destroy() : void 0;
      });
      it("recreates the preview when serialized/deserialized", function() {
        newPreview = atom.deserializers.deserialize(preview.serialize());
        jasmine.attachToDOM(newPreview.element);
        return expect(newPreview.getPath()).toBe(preview.getPath());
      });
      it("does not recreate a preview when the file no longer exists", function() {
        var filePath, serialized;
        filePath = path.join(temp.mkdirSync('markdown-preview-'), 'foo.md');
        fs.writeFileSync(filePath, '# Hi');
        preview.destroy();
        preview = new MarkdownPreviewView({
          filePath: filePath
        });
        serialized = preview.serialize();
        fs.removeSync(filePath);
        newPreview = atom.deserializers.deserialize(serialized);
        return expect(newPreview).toBeUndefined();
      });
      return it("serializes the editor id when opened for an editor", function() {
        preview.destroy();
        waitsForPromise(function() {
          return atom.workspace.open('new.markdown');
        });
        return runs(function() {
          preview = new MarkdownPreviewView({
            editorId: atom.workspace.getActiveTextEditor().id
          });
          jasmine.attachToDOM(preview.element);
          expect(preview.getPath()).toBe(atom.workspace.getActiveTextEditor().getPath());
          newPreview = atom.deserializers.deserialize(preview.serialize());
          jasmine.attachToDOM(newPreview.element);
          return expect(newPreview.getPath()).toBe(preview.getPath());
        });
      });
    });
    describe("code block conversion to atom-text-editor tags", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return preview.renderMarkdown();
        });
      });
      it("removes line decorations on rendered code blocks", function() {
        var decorations, editor;
        editor = preview.find("atom-text-editor[data-grammar='text plain null-grammar']");
        decorations = editor[0].getModel().getDecorations({
          "class": 'cursor-line',
          type: 'line'
        });
        return expect(decorations.length).toBe(0);
      });
      describe("when the code block's fence name has a matching grammar", function() {
        return it("assigns the grammar on the atom-text-editor", function() {
          var jsEditor, rubyEditor;
          rubyEditor = preview.find("atom-text-editor[data-grammar='source ruby']");
          expect(rubyEditor).toExist();
          expect(rubyEditor[0].getModel().getText()).toBe("def func\n  x = 1\nend");
          jsEditor = preview.find("atom-text-editor[data-grammar='source js']");
          expect(jsEditor).toExist();
          return expect(jsEditor[0].getModel().getText()).toBe("if a === 3 {\nb = 5\n}");
        });
      });
      return describe("when the code block's fence name doesn't have a matching grammar", function() {
        return it("does not assign a specific grammar", function() {
          var plainEditor;
          plainEditor = preview.find("atom-text-editor[data-grammar='text plain null-grammar']");
          expect(plainEditor).toExist();
          return expect(plainEditor[0].getModel().getText()).toBe("function f(x) {\n  return x++;\n}");
        });
      });
    });
    describe("image resolving", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return preview.renderMarkdown();
        });
      });
      describe("when the image uses a relative path", function() {
        return it("resolves to a path relative to the file", function() {
          var image;
          image = preview.find("img[alt=Image1]");
          return expect(image.attr('src')).toBe(atom.project.getDirectories()[0].resolve('subdir/image1.png'));
        });
      });
      describe("when the image uses an absolute path that does not exist", function() {
        return it("resolves to a path relative to the project root", function() {
          var image;
          image = preview.find("img[alt=Image2]");
          return expect(image.attr('src')).toBe(atom.project.getDirectories()[0].resolve('tmp/image2.png'));
        });
      });
      describe("when the image uses an absolute path that exists", function() {
        return it("doesn't change the URL", function() {
          var filePath;
          preview.destroy();
          filePath = path.join(temp.mkdirSync('atom'), 'foo.md');
          fs.writeFileSync(filePath, "![absolute](" + filePath + ")");
          preview = new MarkdownPreviewView({
            filePath: filePath
          });
          jasmine.attachToDOM(preview.element);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("img[alt=absolute]").attr('src')).toBe(filePath);
          });
        });
      });
      return describe("when the image uses a web URL", function() {
        return it("doesn't change the URL", function() {
          var image;
          image = preview.find("img[alt=Image3]");
          return expect(image.attr('src')).toBe('http://github.com/image3.png');
        });
      });
    });
    describe("gfm newlines", function() {
      describe("when gfm newlines are not enabled", function() {
        return it("creates a single paragraph with <br>", function() {
          atom.config.set('markdown-preview.breakOnSingleNewline', false);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("p:last-child br").length).toBe(0);
          });
        });
      });
      return describe("when gfm newlines are enabled", function() {
        return it("creates a single paragraph with no <br>", function() {
          atom.config.set('markdown-preview.breakOnSingleNewline', true);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("p:last-child br").length).toBe(1);
          });
        });
      });
    });
    describe("when core:save-as is triggered", function() {
      beforeEach(function() {
        var filePath;
        preview.destroy();
        filePath = atom.project.getDirectories()[0].resolve('subdir/code-block.md');
        preview = new MarkdownPreviewView({
          filePath: filePath
        });
        return jasmine.attachToDOM(preview.element);
      });
      it("saves the rendered HTML and opens it", function() {
        var atomTextEditorStyles, createRule, expectedFilePath, expectedOutput, markdownPreviewStyles, outputPath;
        outputPath = temp.path({
          suffix: '.html'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('saved-html.html');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        createRule = function(selector, css) {
          return {
            selectorText: selector,
            cssText: "" + selector + " " + css
          };
        };
        markdownPreviewStyles = [
          {
            rules: [createRule(".markdown-preview", "{ color: orange; }")]
          }, {
            rules: [createRule(".not-included", "{ color: green; }"), createRule(".markdown-preview :host", "{ color: purple; }")]
          }
        ];
        atomTextEditorStyles = ["atom-text-editor .line { color: brown; }\natom-text-editor .number { color: cyan; }", "atom-text-editor :host .something { color: black; }", "atom-text-editor .hr { background: url(atom://markdown-preview/assets/hr.png); }"];
        expect(fs.isFileSync(outputPath)).toBe(false);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        runs(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          spyOn(preview, 'getDocumentStyleSheets').andReturn(markdownPreviewStyles);
          spyOn(preview, 'getTextEditorStyles').andReturn(atomTextEditorStyles);
          return atom.commands.dispatch(preview.element, 'core:save-as');
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe(expectedOutput);
        });
      });
      return describe("text editor style extraction", function() {
        var extractedStyles, textEditorStyle, unrelatedStyle;
        extractedStyles = [][0];
        textEditorStyle = ".editor-style .extraction-test { color: blue; }";
        unrelatedStyle = ".something else { color: red; }";
        beforeEach(function() {
          atom.styles.addStyleSheet(textEditorStyle, {
            context: 'atom-text-editor'
          });
          atom.styles.addStyleSheet(unrelatedStyle, {
            context: 'unrelated-context'
          });
          return extractedStyles = preview.getTextEditorStyles();
        });
        it("returns an array containing atom-text-editor css style strings", function() {
          return expect(extractedStyles.indexOf(textEditorStyle)).toBeGreaterThan(-1);
        });
        return it("does not return other styles", function() {
          return expect(extractedStyles.indexOf(unrelatedStyle)).toBe(-1);
        });
      });
    });
    return describe("when core:copy is triggered", function() {
      return it("writes the rendered HTML to the clipboard", function() {
        var filePath;
        preview.destroy();
        preview.element.remove();
        filePath = atom.project.getDirectories()[0].resolve('subdir/code-block.md');
        preview = new MarkdownPreviewView({
          filePath: filePath
        });
        jasmine.attachToDOM(preview.element);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        runs(function() {
          return atom.commands.dispatch(preview.element, 'core:copy');
        });
        waitsFor(function() {
          return atom.clipboard.read() !== "initial clipboard content";
        });
        return runs(function() {
          return expect(atom.clipboard.read()).toBe("<h1 id=\"code-block\">Code Block</h1>\n<pre class=\"editor-colors lang-javascript\"><div class=\"line\"><span class=\"source js\"><span class=\"keyword control js\"><span>if</span></span><span>&nbsp;a&nbsp;</span><span class=\"keyword operator comparison js\"><span>===</span></span><span>&nbsp;</span><span class=\"constant numeric js\"><span>3</span></span><span>&nbsp;</span><span class=\"meta brace curly js\"><span>{</span></span></span></div><div class=\"line\"><span class=\"source js\"><span>&nbsp;&nbsp;b&nbsp;</span><span class=\"keyword operator assignment js\"><span>=</span></span><span>&nbsp;</span><span class=\"constant numeric js\"><span>5</span></span></span></div><div class=\"line\"><span class=\"source js\"><span class=\"meta brace curly js\"><span>}</span></span></span></div></pre>\n<p>encoding \u2192 issue</p>");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3L3NwZWMvbWFya2Rvd24tcHJldmlldy12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLDhCQUFSLENBSHRCLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFFBQUEscUNBQUE7QUFBQSxJQUFBLE9BQW9DLEVBQXBDLEVBQUMsY0FBRCxFQUFPLGlCQUFQLEVBQWdCLDBCQUFoQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxRQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUEsQ0FBOEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFqQyxDQUF5QyxzQkFBekMsQ0FBWCxDQUFBO0FBQUEsTUFDQSxPQUFBLEdBQWMsSUFBQSxtQkFBQSxDQUFvQjtBQUFBLFFBQUMsVUFBQSxRQUFEO09BQXBCLENBRGQsQ0FBQTtBQUFBLE1BRUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsT0FBTyxDQUFDLE9BQTVCLENBRkEsQ0FBQTtBQUFBLE1BSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUIsRUFEYztNQUFBLENBQWhCLENBSkEsQ0FBQTtB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

//# sourceURL=/home/andy/.atom/packages/markdown-preview/spec/markdown-preview-view-spec.coffee
