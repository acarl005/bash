(function() {
  var $, Highlights, cheerio, convertCodeBlocksToAtomEditors, fs, highlighter, packagePath, path, render, resolveImagePaths, resourcePath, roaster, sanitize, scopeForFenceName, tokenizeCodeBlocks, _;

  path = require('path');

  _ = require('underscore-plus');

  cheerio = require('cheerio');

  fs = require('fs-plus');

  Highlights = require('highlights');

  $ = require('atom-space-pen-views').$;

  roaster = null;

  scopeForFenceName = require('./extension-helper').scopeForFenceName;

  highlighter = null;

  resourcePath = atom.getLoadSettings().resourcePath;

  packagePath = path.dirname(__dirname);

  exports.toDOMFragment = function(text, filePath, grammar, callback) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath, function(error, html) {
      var defaultCodeLanguage, domFragment, template;
      if (error != null) {
        return callback(error);
      }
      template = document.createElement('template');
      template.innerHTML = html;
      domFragment = template.content.cloneNode(true);
      if ((grammar != null ? grammar.scopeName : void 0) === 'source.litcoffee') {
        defaultCodeLanguage = 'coffee';
      }
      convertCodeBlocksToAtomEditors(domFragment, defaultCodeLanguage);
      return callback(null, domFragment);
    });
  };

  exports.toHTML = function(text, filePath, grammar, callback) {
    if (text == null) {
      text = '';
    }
    return render(text, filePath, function(error, html) {
      var defaultCodeLanguage;
      if (error != null) {
        return callback(error);
      }
      if ((grammar != null ? grammar.scopeName : void 0) === 'source.litcoffee') {
        defaultCodeLanguage = 'coffee';
      }
      html = tokenizeCodeBlocks(html, defaultCodeLanguage);
      return callback(null, html);
    });
  };

  render = function(text, filePath, callback) {
    var options;
    if (roaster == null) {
      roaster = require('roaster');
    }
    options = {
      sanitize: false,
      breaks: atom.config.get('markdown-preview.breakOnSingleNewline')
    };
    text = text.replace(/^\s*<!doctype(\s+.*)?>\s*/i, '');
    return roaster(text, options, function(error, html) {
      if (error != null) {
        return callback(error);
      }
      html = sanitize(html);
      html = resolveImagePaths(html, filePath);
      return callback(null, html.trim());
    });
  };

  sanitize = function(html) {
    var attribute, attributesToRemove, o, _i, _len;
    o = cheerio.load(html);
    o('script').remove();
    attributesToRemove = ['onabort', 'onblur', 'onchange', 'onclick', 'ondbclick', 'onerror', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onmousedown', 'onmousemove', 'onmouseover', 'onmouseout', 'onmouseup', 'onreset', 'onresize', 'onscroll', 'onselect', 'onsubmit', 'onunload'];
    for (_i = 0, _len = attributesToRemove.length; _i < _len; _i++) {
      attribute = attributesToRemove[_i];
      o('*').removeAttr(attribute);
    }
    return o.html();
  };

  resolveImagePaths = function(html, filePath) {
    var img, imgElement, o, rootDirectory, src, _i, _len, _ref;
    rootDirectory = atom.project.relativizePath(filePath)[0];
    o = cheerio.load(html);
    _ref = o('img');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      imgElement = _ref[_i];
      img = o(imgElement);
      if (src = img.attr('src')) {
        if (src.match(/^(https?|atom):\/\//)) {
          continue;
        }
        if (src.startsWith(process.resourcesPath)) {
          continue;
        }
        if (src.startsWith(resourcePath)) {
          continue;
        }
        if (src.startsWith(packagePath)) {
          continue;
        }
        if (src[0] === '/') {
          if (!fs.isFileSync(src)) {
            if (rootDirectory) {
              img.attr('src', path.join(rootDirectory, src.substring(1)));
            }
          }
        } else {
          img.attr('src', path.resolve(path.dirname(filePath), src));
        }
      }
    }
    return o.html();
  };

  convertCodeBlocksToAtomEditors = function(domFragment, defaultLanguage) {
    var codeBlock, codeElement, editor, editorElement, fenceName, fontFamily, grammar, preElement, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4;
    if (defaultLanguage == null) {
      defaultLanguage = 'text';
    }
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      _ref = domFragment.querySelectorAll('code');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        codeElement = _ref[_i];
        codeElement.style.fontFamily = fontFamily;
      }
    }
    _ref1 = domFragment.querySelectorAll('pre');
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      preElement = _ref1[_j];
      codeBlock = (_ref2 = preElement.firstElementChild) != null ? _ref2 : preElement;
      fenceName = (_ref3 = (_ref4 = codeBlock.getAttribute('class')) != null ? _ref4.replace(/^lang-/, '') : void 0) != null ? _ref3 : defaultLanguage;
      editorElement = document.createElement('atom-text-editor');
      editorElement.setAttributeNode(document.createAttribute('gutter-hidden'));
      editorElement.removeAttribute('tabindex');
      preElement.parentNode.insertBefore(editorElement, preElement);
      preElement.remove();
      editor = editorElement.getModel();
      editor.getDecorations({
        "class": 'cursor-line',
        type: 'line'
      })[0].destroy();
      editor.setText(codeBlock.textContent.trim());
      if (grammar = atom.grammars.grammarForScopeName(scopeForFenceName(fenceName))) {
        editor.setGrammar(grammar);
      }
    }
    return domFragment;
  };

  tokenizeCodeBlocks = function(html, defaultLanguage) {
    var codeBlock, fenceName, fontFamily, highlightedBlock, highlightedHtml, o, preElement, _i, _len, _ref, _ref1, _ref2;
    if (defaultLanguage == null) {
      defaultLanguage = 'text';
    }
    o = cheerio.load(html);
    if (fontFamily = atom.config.get('editor.fontFamily')) {
      o('code').css('font-family', fontFamily);
    }
    _ref = o("pre");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      preElement = _ref[_i];
      codeBlock = o(preElement).children().first();
      fenceName = (_ref1 = (_ref2 = codeBlock.attr('class')) != null ? _ref2.replace(/^lang-/, '') : void 0) != null ? _ref1 : defaultLanguage;
      if (highlighter == null) {
        highlighter = new Highlights({
          registry: atom.grammars
        });
      }
      highlightedHtml = highlighter.highlightSync({
        fileContents: codeBlock.text(),
        scopeName: scopeForFenceName(fenceName)
      });
      highlightedBlock = o(highlightedHtml);
      highlightedBlock.removeClass('editor').addClass("lang-" + fenceName);
      o(preElement).replaceWith(highlightedBlock);
    }
    return o.html();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3L2xpYi9yZW5kZXJlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsZ01BQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVIsQ0FGVixDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQUpiLENBQUE7O0FBQUEsRUFLQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBTEQsQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxJQU5WLENBQUE7O0FBQUEsRUFPQyxvQkFBcUIsT0FBQSxDQUFRLG9CQUFSLEVBQXJCLGlCQVBELENBQUE7O0FBQUEsRUFTQSxXQUFBLEdBQWMsSUFUZCxDQUFBOztBQUFBLEVBVUMsZUFBZ0IsSUFBSSxDQUFDLGVBQUwsQ0FBQSxFQUFoQixZQVZELENBQUE7O0FBQUEsRUFXQSxXQUFBLEdBQWMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLENBWGQsQ0FBQTs7QUFBQSxFQWFBLE9BQU8sQ0FBQyxhQUFSLEdBQXdCLFNBQUMsSUFBRCxFQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsUUFBN0IsR0FBQTs7TUFBQyxPQUFLO0tBQzVCO1dBQUEsTUFBQSxDQUFPLElBQVAsRUFBYSxRQUFiLEVBQXVCLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNyQixVQUFBLDBDQUFBO0FBQUEsTUFBQSxJQUEwQixhQUExQjtBQUFBLGVBQU8s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

//# sourceURL=/home/andy/.atom/packages/markdown-preview/lib/renderer.coffee
