(function() {
  var MarkdownPreviewView, createMarkdownPreviewView, fs, isMarkdownPreviewView, renderer, url,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  fs = require('fs-plus');

  MarkdownPreviewView = null;

  renderer = null;

  createMarkdownPreviewView = function(state) {
    if (MarkdownPreviewView == null) {
      MarkdownPreviewView = require('./markdown-preview-view');
    }
    return new MarkdownPreviewView(state);
  };

  isMarkdownPreviewView = function(object) {
    if (MarkdownPreviewView == null) {
      MarkdownPreviewView = require('./markdown-preview-view');
    }
    return object instanceof MarkdownPreviewView;
  };

  module.exports = {
    config: {
      breakOnSingleNewline: {
        type: 'boolean',
        "default": false,
        description: 'In Markdown, a single newline character doesn\'t cause a line break in the generated HTML. In GitHub Flavored Markdown, that is not true. Enable this config option to insert line breaks in rendered HTML for single newlines in Markdown source.'
      },
      liveUpdate: {
        type: 'boolean',
        "default": true,
        description: 'Re-render the preview as the contents of the source changes, without requiring the source buffer to be saved. If disabled, the preview is re-rendered only when the buffer is saved to disk.'
      },
      openPreviewInSplitPane: {
        type: 'boolean',
        "default": true,
        description: 'Open the preview in a split pane. If disabled, the preview is opened in a new tab in the same pane.'
      },
      grammars: {
        type: 'array',
        "default": ['source.gfm', 'source.litcoffee', 'text.html.basic', 'text.md', 'text.plain', 'text.plain.null-grammar'],
        description: 'List of scopes for languages for which previewing is enabled. See [this README](https://github.com/atom/spell-check#spell-check-package-) for more information on finding the correct scope for a specific language.'
      },
      useGitHubStyle: {
        title: 'Use GitHub.com style',
        type: 'boolean',
        "default": false,
        description: 'Use the same CSS styles for preview as the ones used on GitHub.com.'
      }
    },
    activate: function() {
      var previewFile;
      atom.deserializers.add({
        name: 'MarkdownPreviewView',
        deserialize: function(state) {
          if (state.editorId || fs.isFileSync(state.filePath)) {
            return createMarkdownPreviewView(state);
          }
        }
      });
      atom.commands.add('atom-workspace', {
        'markdown-preview:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'markdown-preview:copy-html': (function(_this) {
          return function() {
            return _this.copyHtml();
          };
        })(this),
        'markdown-preview:toggle-break-on-single-newline': function() {
          var keyPath;
          keyPath = 'markdown-preview.breakOnSingleNewline';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        }
      });
      previewFile = this.previewFile.bind(this);
      atom.commands.add('.tree-view .file .name[data-name$=\\.markdown]', 'markdown-preview:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.md]', 'markdown-preview:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mdown]', 'markdown-preview:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkd]', 'markdown-preview:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkdown]', 'markdown-preview:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.ron]', 'markdown-preview:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.txt]', 'markdown-preview:preview-file', previewFile);
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, pathname, protocol, _ref;
        try {
          _ref = url.parse(uriToOpen), protocol = _ref.protocol, host = _ref.host, pathname = _ref.pathname;
        } catch (_error) {
          error = _error;
          return;
        }
        if (protocol !== 'markdown-preview:') {
          return;
        }
        try {
          if (pathname) {
            pathname = decodeURI(pathname);
          }
        } catch (_error) {
          error = _error;
          return;
        }
        if (host === 'editor') {
          return createMarkdownPreviewView({
            editorId: pathname.substring(1)
          });
        } else {
          return createMarkdownPreviewView({
            filePath: pathname
          });
        }
      });
    },
    toggle: function() {
      var editor, grammars, _ref, _ref1;
      if (isMarkdownPreviewView(atom.workspace.getActivePaneItem())) {
        atom.workspace.destroyActivePaneItem();
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      grammars = (_ref = atom.config.get('markdown-preview.grammars')) != null ? _ref : [];
      if (_ref1 = editor.getGrammar().scopeName, __indexOf.call(grammars, _ref1) < 0) {
        return;
      }
      if (!this.removePreviewForEditor(editor)) {
        return this.addPreviewForEditor(editor);
      }
    },
    uriForEditor: function(editor) {
      return "markdown-preview://editor/" + editor.id;
    },
    removePreviewForEditor: function(editor) {
      var previewPane, uri;
      uri = this.uriForEditor(editor);
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane != null) {
        previewPane.destroyItem(previewPane.itemForURI(uri));
        return true;
      } else {
        return false;
      }
    },
    addPreviewForEditor: function(editor) {
      var options, previousActivePane, uri;
      uri = this.uriForEditor(editor);
      previousActivePane = atom.workspace.getActivePane();
      options = {
        searchAllPanes: true
      };
      if (atom.config.get('markdown-preview.openPreviewInSplitPane')) {
        options.split = 'right';
      }
      return atom.workspace.open(uri, options).then(function(markdownPreviewView) {
        if (isMarkdownPreviewView(markdownPreviewView)) {
          return previousActivePane.activate();
        }
      });
    },
    previewFile: function(_arg) {
      var editor, filePath, target, _i, _len, _ref;
      target = _arg.target;
      filePath = target.dataset.path;
      if (!filePath) {
        return;
      }
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        if (!(editor.getPath() === filePath)) {
          continue;
        }
        this.addPreviewForEditor(editor);
        return;
      }
      return atom.workspace.open("markdown-preview://" + (encodeURI(filePath)), {
        searchAllPanes: true
      });
    },
    copyHtml: function() {
      var editor, text;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      if (renderer == null) {
        renderer = require('./renderer');
      }
      text = editor.getSelectedText() || editor.getText();
      return renderer.toHTML(text, editor.getPath(), editor.getGrammar(), function(error, html) {
        if (error) {
          return console.warn('Copying Markdown as HTML failed', error);
        } else {
          return atom.clipboard.write(html);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3L2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3RkFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFHQSxtQkFBQSxHQUFzQixJQUh0QixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLElBSlgsQ0FBQTs7QUFBQSxFQU1BLHlCQUFBLEdBQTRCLFNBQUMsS0FBRCxHQUFBOztNQUMxQixzQkFBdUIsT0FBQSxDQUFRLHlCQUFSO0tBQXZCO1dBQ0ksSUFBQSxtQkFBQSxDQUFvQixLQUFwQixFQUZzQjtFQUFBLENBTjVCLENBQUE7O0FBQUEsRUFVQSxxQkFBQSxHQUF3QixTQUFDLE1BQUQsR0FBQTs7TUFDdEIsc0JBQXVCLE9BQUEsQ0FBUSx5QkFBUjtLQUF2QjtXQUNBLE1BQUEsWUFBa0Isb0JBRkk7RUFBQSxDQVZ4QixDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxvQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxvUEFGYjtPQURGO0FBQUEsTUFJQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLDhMQUZiO09BTEY7QUFBQSxNQVFBLHNCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFD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

//# sourceURL=/home/andy/.atom/packages/markdown-preview/lib/main.coffee
