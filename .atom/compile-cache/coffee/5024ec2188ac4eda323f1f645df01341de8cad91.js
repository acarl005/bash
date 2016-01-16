(function() {
  var $, $$$, CompositeDisposable, Disposable, Emitter, File, Grim, MarkdownPreviewView, ScrollView, fs, path, renderer, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  _ref = require('atom'), Emitter = _ref.Emitter, Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable, File = _ref.File;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, $$$ = _ref1.$$$, ScrollView = _ref1.ScrollView;

  Grim = require('grim');

  _ = require('underscore-plus');

  fs = require('fs-plus');

  renderer = require('./renderer');

  module.exports = MarkdownPreviewView = (function(_super) {
    __extends(MarkdownPreviewView, _super);

    MarkdownPreviewView.content = function() {
      return this.div({
        "class": 'markdown-preview native-key-bindings',
        tabindex: -1
      });
    };

    function MarkdownPreviewView(_arg) {
      this.editorId = _arg.editorId, this.filePath = _arg.filePath;
      MarkdownPreviewView.__super__.constructor.apply(this, arguments);
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
      this.loaded = false;
    }

    MarkdownPreviewView.prototype.attached = function() {
      if (this.isAttached) {
        return;
      }
      this.isAttached = true;
      if (this.editorId != null) {
        return this.resolveEditor(this.editorId);
      } else {
        if (atom.workspace != null) {
          return this.subscribeToFilePath(this.filePath);
        } else {
          return this.disposables.add(atom.packages.onDidActivateInitialPackages((function(_this) {
            return function() {
              return _this.subscribeToFilePath(_this.filePath);
            };
          })(this)));
        }
      }
    };

    MarkdownPreviewView.prototype.serialize = function() {
      var _ref2;
      return {
        deserializer: 'MarkdownPreviewView',
        filePath: (_ref2 = this.getPath()) != null ? _ref2 : this.filePath,
        editorId: this.editorId
      };
    };

    MarkdownPreviewView.prototype.destroy = function() {
      return this.disposables.dispose();
    };

    MarkdownPreviewView.prototype.onDidChangeTitle = function(callback) {
      return this.emitter.on('did-change-title', callback);
    };

    MarkdownPreviewView.prototype.onDidChangeModified = function(callback) {
      return new Disposable;
    };

    MarkdownPreviewView.prototype.onDidChangeMarkdown = function(callback) {
      return this.emitter.on('did-change-markdown', callback);
    };

    MarkdownPreviewView.prototype.subscribeToFilePath = function(filePath) {
      this.file = new File(filePath);
      this.emitter.emit('did-change-title');
      this.handleEvents();
      return this.renderMarkdown();
    };

    MarkdownPreviewView.prototype.resolveEditor = function(editorId) {
      var resolve;
      resolve = (function(_this) {
        return function() {
          var _ref2, _ref3;
          _this.editor = _this.editorForId(editorId);
          if (_this.editor != null) {
            if (_this.editor != null) {
              _this.emitter.emit('did-change-title');
            }
            _this.handleEvents();
            return _this.renderMarkdown();
          } else {
            return (_ref2 = atom.workspace) != null ? (_ref3 = _ref2.paneForItem(_this)) != null ? _ref3.destroyItem(_this) : void 0 : void 0;
          }
        };
      })(this);
      if (atom.workspace != null) {
        return resolve();
      } else {
        return this.disposables.add(atom.packages.onDidActivateInitialPackages(resolve));
      }
    };

    MarkdownPreviewView.prototype.editorForId = function(editorId) {
      var editor, _i, _len, _ref2, _ref3;
      _ref2 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        editor = _ref2[_i];
        if (((_ref3 = editor.id) != null ? _ref3.toString() : void 0) === editorId.toString()) {
          return editor;
        }
      }
      return null;
    };

    MarkdownPreviewView.prototype.handleEvents = function() {
      var changeHandler;
      this.disposables.add(atom.grammars.onDidAddGrammar((function(_this) {
        return function() {
          return _.debounce((function() {
            return _this.renderMarkdown();
          }), 250);
        };
      })(this)));
      this.disposables.add(atom.grammars.onDidUpdateGrammar(_.debounce(((function(_this) {
        return function() {
          return _this.renderMarkdown();
        };
      })(this)), 250)));
      atom.commands.add(this.element, {
        'core:move-up': (function(_this) {
          return function() {
            return _this.scrollUp();
          };
        })(this),
        'core:move-down': (function(_this) {
          return function() {
            return _this.scrollDown();
          };
        })(this),
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:copy': (function(_this) {
          return function(event) {
            if (_this.copyToClipboard()) {
              return event.stopPropagation();
            }
          };
        })(this),
        'markdown-preview:zoom-in': (function(_this) {
          return function() {
            var zoomLevel;
            zoomLevel = parseFloat(_this.css('zoom')) || 1;
            return _this.css('zoom', zoomLevel + .1);
          };
        })(this),
        'markdown-preview:zoom-out': (function(_this) {
          return function() {
            var zoomLevel;
            zoomLevel = parseFloat(_this.css('zoom')) || 1;
            return _this.css('zoom', zoomLevel - .1);
          };
        })(this),
        'markdown-preview:reset-zoom': (function(_this) {
          return function() {
            return _this.css('zoom', 1);
          };
        })(this)
      });
      changeHandler = (function(_this) {
        return function() {
          var pane, _base, _ref2;
          _this.renderMarkdown();
          pane = (_ref2 = typeof (_base = atom.workspace).paneForItem === "function" ? _base.paneForItem(_this) : void 0) != null ? _ref2 : atom.workspace.paneForURI(_this.getURI());
          if ((pane != null) && pane !== atom.workspace.getActivePane()) {
            return pane.activateItem(_this);
          }
        };
      })(this);
      if (this.file != null) {
        this.disposables.add(this.file.onDidChange(changeHandler));
      } else if (this.editor != null) {
        this.disposables.add(this.editor.getBuffer().onDidStopChanging(function() {
          if (atom.config.get('markdown-preview.liveUpdate')) {
            return changeHandler();
          }
        }));
        this.disposables.add(this.editor.onDidChangePath((function(_this) {
          return function() {
            return _this.emitter.emit('did-change-title');
          };
        })(this)));
        this.disposables.add(this.editor.getBuffer().onDidSave(function() {
          if (!atom.config.get('markdown-preview.liveUpdate')) {
            return changeHandler();
          }
        }));
        this.disposables.add(this.editor.getBuffer().onDidReload(function() {
          if (!atom.config.get('markdown-preview.liveUpdate')) {
            return changeHandler();
          }
        }));
      }
      this.disposables.add(atom.config.onDidChange('markdown-preview.breakOnSingleNewline', changeHandler));
      return this.disposables.add(atom.config.observe('markdown-preview.useGitHubStyle', (function(_this) {
        return function(useGitHubStyle) {
          if (useGitHubStyle) {
            return _this.element.setAttribute('data-use-github-style', '');
          } else {
            return _this.element.removeAttribute('data-use-github-style');
          }
        };
      })(this)));
    };

    MarkdownPreviewView.prototype.renderMarkdown = function() {
      if (!this.loaded) {
        this.showLoading();
      }
      return this.getMarkdownSource().then((function(_this) {
        return function(source) {
          if (source != null) {
            return _this.renderMarkdownText(source);
          }
        };
      })(this));
    };

    MarkdownPreviewView.prototype.getMarkdownSource = function() {
      var _ref2;
      if ((_ref2 = this.file) != null ? _ref2.getPath() : void 0) {
        return this.file.read();
      } else if (this.editor != null) {
        return Promise.resolve(this.editor.getText());
      } else {
        return Promise.resolve(null);
      }
    };

    MarkdownPreviewView.prototype.getHTML = function(callback) {
      return this.getMarkdownSource().then((function(_this) {
        return function(source) {
          if (source == null) {
            return;
          }
          return renderer.toHTML(source, _this.getPath(), _this.getGrammar(), callback);
        };
      })(this));
    };

    MarkdownPreviewView.prototype.renderMarkdownText = function(text) {
      return renderer.toDOMFragment(text, this.getPath(), this.getGrammar(), (function(_this) {
        return function(error, domFragment) {
          if (error) {
            return _this.showError(error);
          } else {
            _this.loading = false;
            _this.loaded = true;
            _this.html(domFragment);
            _this.emitter.emit('did-change-markdown');
            return _this.originalTrigger('markdown-preview:markdown-changed');
          }
        };
      })(this));
    };

    MarkdownPreviewView.prototype.getTitle = function() {
      if (this.file != null) {
        return "" + (path.basename(this.getPath())) + " Preview";
      } else if (this.editor != null) {
        return "" + (this.editor.getTitle()) + " Preview";
      } else {
        return "Markdown Preview";
      }
    };

    MarkdownPreviewView.prototype.getIconName = function() {
      return "markdown";
    };

    MarkdownPreviewView.prototype.getURI = function() {
      if (this.file != null) {
        return "markdown-preview://" + (this.getPath());
      } else {
        return "markdown-preview://editor/" + this.editorId;
      }
    };

    MarkdownPreviewView.prototype.getPath = function() {
      if (this.file != null) {
        return this.file.getPath();
      } else if (this.editor != null) {
        return this.editor.getPath();
      }
    };

    MarkdownPreviewView.prototype.getGrammar = function() {
      var _ref2;
      return (_ref2 = this.editor) != null ? _ref2.getGrammar() : void 0;
    };

    MarkdownPreviewView.prototype.getDocumentStyleSheets = function() {
      return document.styleSheets;
    };

    MarkdownPreviewView.prototype.getTextEditorStyles = function() {
      var textEditorStyles;
      textEditorStyles = document.createElement("atom-styles");
      textEditorStyles.initialize(atom.styles);
      textEditorStyles.setAttribute("context", "atom-text-editor");
      document.body.appendChild(textEditorStyles);
      return Array.prototype.slice.apply(textEditorStyles.childNodes).map(function(styleElement) {
        return styleElement.innerText;
      });
    };

    MarkdownPreviewView.prototype.getMarkdownPreviewCSS = function() {
      var cssUrlRefExp, markdowPreviewRules, rule, ruleRegExp, stylesheet, _i, _j, _len, _len1, _ref2, _ref3, _ref4;
      markdowPreviewRules = [];
      ruleRegExp = /\.markdown-preview/;
      cssUrlRefExp = /url\(atom:\/\/markdown-preview\/assets\/(.*)\)/;
      _ref2 = this.getDocumentStyleSheets();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        stylesheet = _ref2[_i];
        if (stylesheet.rules != null) {
          _ref3 = stylesheet.rules;
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            rule = _ref3[_j];
            if (((_ref4 = rule.selectorText) != null ? _ref4.match(ruleRegExp) : void 0) != null) {
              markdowPreviewRules.push(rule.cssText);
            }
          }
        }
      }
      return markdowPreviewRules.concat(this.getTextEditorStyles()).join('\n').replace(/atom-text-editor/g, 'pre.editor-colors').replace(/:host/g, '.host').replace(cssUrlRefExp, function(match, assetsName, offset, string) {
        var assetPath, base64Data, originalData;
        assetPath = path.join(__dirname, '../assets', assetsName);
        originalData = fs.readFileSync(assetPath, 'binary');
        base64Data = new Buffer(originalData, 'binary').toString('base64');
        return "url('data:image/jpeg;base64," + base64Data + "')";
      });
    };

    MarkdownPreviewView.prototype.showError = function(result) {
      var failureMessage;
      failureMessage = result != null ? result.message : void 0;
      return this.html($$$(function() {
        this.h2('Previewing Markdown Failed');
        if (failureMessage != null) {
          return this.h3(failureMessage);
        }
      }));
    };

    MarkdownPreviewView.prototype.showLoading = function() {
      this.loading = true;
      return this.html($$$(function() {
        return this.div({
          "class": 'markdown-spinner'
        }, 'Loading Markdown\u2026');
      }));
    };

    MarkdownPreviewView.prototype.copyToClipboard = function() {
      var selectedNode, selectedText, selection;
      if (this.loading) {
        return false;
      }
      selection = window.getSelection();
      selectedText = selection.toString();
      selectedNode = selection.baseNode;
      if (selectedText && (selectedNode != null) && (this[0] === selectedNode || $.contains(this[0], selectedNode))) {
        return false;
      }
      this.getHTML(function(error, html) {
        if (error != null) {
          return console.warn('Copying Markdown as HTML failed', error);
        } else {
          return atom.clipboard.write(html);
        }
      });
      return true;
    };

    MarkdownPreviewView.prototype.saveAs = function() {
      var filePath, htmlFilePath, projectPath, title;
      if (this.loading) {
        return;
      }
      filePath = this.getPath();
      title = 'Markdown to HTML';
      if (filePath) {
        title = path.parse(filePath).name;
        filePath += '.html';
      } else {
        filePath = 'untitled.md.html';
        if (projectPath = atom.project.getPaths()[0]) {
          filePath = path.join(projectPath, filePath);
        }
      }
      if (htmlFilePath = atom.showSaveDialogSync(filePath)) {
        return this.getHTML((function(_this) {
          return function(error, htmlBody) {
            var html;
            if (error != null) {
              return console.warn('Saving Markdown as HTML failed', error);
            } else {
              html = ("<!DOCTYPE html>\n<html>\n  <head>\n      <meta charset=\"utf-8\" />\n      <title>" + title + "</title>\n      <style>" + (_this.getMarkdownPreviewCSS()) + "</style>\n  </head>\n  <body class='markdown-preview'>" + htmlBody + "</body>\n</html>") + "\n";
              fs.writeFileSync(htmlFilePath, html);
              return atom.workspace.open(htmlFilePath);
            }
          };
        })(this));
      }
    };

    MarkdownPreviewView.prototype.isEqual = function(other) {
      return this[0] === (other != null ? other[0] : void 0);
    };

    return MarkdownPreviewView;

  })(ScrollView);

  if (Grim.includeDeprecatedAPIs) {
    MarkdownPreviewView.prototype.on = function(eventName) {
      if (eventName === 'markdown-preview:markdown-changed') {
        Grim.deprecate("Use MarkdownPreviewView::onDidChangeMarkdown instead of the 'markdown-preview:markdown-changed' jQuery event");
      }
      return MarkdownPreviewView.__super__.on.apply(this, arguments);
    };
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3L2xpYi9tYXJrZG93bi1wcmV2aWV3LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsT0FBbUQsT0FBQSxDQUFRLE1BQVIsQ0FBbkQsRUFBQyxlQUFBLE9BQUQsRUFBVSxrQkFBQSxVQUFWLEVBQXNCLDJCQUFBLG1CQUF0QixFQUEyQyxZQUFBLElBRjNDLENBQUE7O0FBQUEsRUFHQSxRQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxVQUFBLENBQUQsRUFBSSxZQUFBLEdBQUosRUFBUyxtQkFBQSxVQUhULENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FKUCxDQUFBOztBQUFBLEVBS0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUxKLENBQUE7O0FBQUEsRUFNQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FOTCxDQUFBOztBQUFBLEVBUUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBUlgsQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwwQ0FBQSxDQUFBOztBQUFBLElBQUEsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHNDQUFQO0FBQUEsUUFBK0MsUUFBQSxFQUFVLENBQUEsQ0FBekQ7T0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUdhLElBQUEsNkJBQUMsSUFBRCxHQUFBO0FBQ1gsTUFEYSxJQUFDLENBQUEsZ0JBQUEsVUFB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

//# sourceURL=/home/andy/.atom/packages/markdown-preview/lib/markdown-preview-view.coffee
