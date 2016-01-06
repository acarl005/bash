(function() {
  var AncestorsMethods, ColorResultsElement, CompositeDisposable, EventsDelegation, Range, SpacePenDSL, fs, path, removeLeadingWhitespace, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  fs = require('fs-plus');

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-utils'), SpacePenDSL = _ref1.SpacePenDSL, EventsDelegation = _ref1.EventsDelegation, AncestorsMethods = _ref1.AncestorsMethods;

  removeLeadingWhitespace = function(string) {
    return string.replace(/^\s+/, '');
  };

  ColorResultsElement = (function(_super) {
    __extends(ColorResultsElement, _super);

    function ColorResultsElement() {
      return ColorResultsElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(ColorResultsElement);

    EventsDelegation.includeInto(ColorResultsElement);

    ColorResultsElement.content = function() {
      return this.tag('atom-panel', {
        outlet: 'pane',
        "class": 'preview-pane pane-item'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-heading'
          }, function() {
            _this.span({
              outlet: 'previewCount',
              "class": 'preview-count inline-block'
            });
            return _this.div({
              outlet: 'loadingMessage',
              "class": 'inline-block'
            }, function() {
              _this.div({
                "class": 'loading loading-spinner-tiny inline-block'
              });
              return _this.div({
                outlet: 'searchedCountBlock',
                "class": 'inline-block'
              }, function() {
                _this.span({
                  outlet: 'searchedCount',
                  "class": 'searched-count'
                });
                return _this.span(' paths searched');
              });
            });
          });
          return _this.ol({
            outlet: 'resultsList',
            "class": 'search-colors-results results-view list-tree focusable-panel has-collapsable-children native-key-bindings',
            tabindex: -1
          });
        };
      })(this));
    };

    ColorResultsElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.pathMapping = {};
      this.files = 0;
      this.colors = 0;
      this.loadingMessage.style.display = 'none';
      this.subscriptions.add(this.subscribeTo(this, '.list-nested-item > .list-item', {
        click: function(e) {
          var fileItem;
          e.stopPropagation();
          fileItem = AncestorsMethods.parents(e.target, '.list-nested-item')[0];
          return fileItem.classList.toggle('collapsed');
        }
      }));
      return this.subscriptions.add(this.subscribeTo(this, '.search-result', {
        click: (function(_this) {
          return function(e) {
            var fileItem, matchItem, pathAttribute, range;
            e.stopPropagation();
            matchItem = e.target.matches('.search-result') ? e.target : AncestorsMethods.parents(e.target, '.search-result')[0];
            fileItem = AncestorsMethods.parents(matchItem, '.list-nested-item')[0];
            range = Range.fromObject([matchItem.dataset.start.split(',').map(Number), matchItem.dataset.end.split(',').map(Number)]);
            pathAttribute = fileItem.dataset.path;
            return atom.workspace.open(_this.pathMapping[pathAttribute]).then(function(editor) {
              return editor.setSelectedBufferRange(range, {
                autoscroll: true
              });
            });
          };
        })(this)
      }));
    };

    ColorResultsElement.prototype.setModel = function(colorSearch) {
      this.colorSearch = colorSearch;
      this.subscriptions.add(this.colorSearch.onDidFindMatches((function(_this) {
        return function(result) {
          return _this.addFileResult(result);
        };
      })(this)));
      this.subscriptions.add(this.colorSearch.onDidCompleteSearch((function(_this) {
        return function() {
          return _this.searchComplete();
        };
      })(this)));
      return this.colorSearch.search();
    };

    ColorResultsElement.prototype.getTitle = function() {
      return 'Pigments Find Results';
    };

    ColorResultsElement.prototype.getURI = function() {
      return 'pigments://search';
    };

    ColorResultsElement.prototype.getIconName = function() {
      return "pigments";
    };

    ColorResultsElement.prototype.addFileResult = function(result) {
      this.files += 1;
      this.colors += result.matches.length;
      this.resultsList.innerHTML += this.createFileResult(result);
      return this.updateMessage();
    };

    ColorResultsElement.prototype.searchComplete = function() {
      this.updateMessage();
      if (this.colors === 0) {
        this.pane.classList.add('no-results');
        return this.pane.appendChild("<ul class='centered background-message no-results-overlay'>\n  <li>No Results</li>\n</ul>");
      }
    };

    ColorResultsElement.prototype.updateMessage = function() {
      var filesString;
      filesString = this.files === 1 ? 'file' : 'files';
      return this.previewCount.innerHTML = this.colors > 0 ? "<span class='text-info'>\n  " + this.colors + " colors\n</span>\nfound in\n<span class='text-info'>\n  " + this.files + " " + filesString + "\n</span>" : "No colors found in " + this.files + " " + filesString;
    };

    ColorResultsElement.prototype.createFileResult = function(fileResult) {
      var fileBasename, filePath, matches, pathAttribute, pathName;
      filePath = fileResult.filePath, matches = fileResult.matches;
      fileBasename = path.basename(filePath);
      pathAttribute = _.escapeAttribute(filePath);
      this.pathMapping[pathAttribute] = filePath;
      pathName = atom.project.relativize(filePath);
      return "<li class=\"path list-nested-item\" data-path=\"" + pathAttribute + "\">\n  <div class=\"path-details list-item\">\n    <span class=\"disclosure-arrow\"></span>\n    <span class=\"icon icon-file-text\" data-name=\"" + fileBasename + "\"></span>\n    <span class=\"path-name bright\">" + pathName + "</span>\n    <span class=\"path-match-number\">(" + matches.length + ")</span></div>\n  </div>\n  <ul class=\"matches list-tree\">\n    " + (matches.map((function(_this) {
        return function(match) {
          return _this.createMatchResult(match);
        };
      })(this)).join('')) + "\n  </ul>\n</li>";
    };

    ColorResultsElement.prototype.createMatchResult = function(match) {
      var filePath, lineNumber, matchEnd, matchStart, prefix, range, style, suffix, textColor;
      textColor = match.color.luma > 0.43 ? 'black' : 'white';
      filePath = match.filePath, range = match.range;
      range = Range.fromObject(range);
      matchStart = range.start.column - match.lineTextOffset;
      matchEnd = range.end.column - match.lineTextOffset;
      prefix = removeLeadingWhitespace(match.lineText.slice(0, matchStart));
      suffix = match.lineText.slice(matchEnd);
      lineNumber = range.start.row + 1;
      style = '';
      style += "background: " + (match.color.toCSS()) + ";";
      style += "color: " + textColor + ";";
      return "<li class=\"search-result list-item\" data-start=\"" + range.start.row + "," + range.start.column + "\" data-end=\"" + range.end.row + "," + range.end.column + "\">\n  <span class=\"line-number text-subtle\">" + lineNumber + "</span>\n  <span class=\"preview\">\n    " + prefix + "\n    <span class='match color-match' style='" + style + "'>" + match.matchText + "</span>\n    " + suffix + "\n  </span>\n</li>";
    };

    return ColorResultsElement;

  })(HTMLElement);

  module.exports = ColorResultsElement = document.registerElement('pigments-color-results', {
    prototype: ColorResultsElement.prototype
  });

  ColorResultsElement.registerViewProvider = function(modelClass) {
    return atom.views.addViewProvider(modelClass, function(model) {
      var element;
      element = new ColorResultsElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItcmVzdWx0cy1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtSkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLE9BQStCLE9BQUEsQ0FBUSxNQUFSLENBQS9CLEVBQUMsYUFBQSxLQUFELEVBQVEsMkJBQUEsbUJBSFIsQ0FBQTs7QUFBQSxFQUlBLFFBQW9ELE9BQUEsQ0FBUSxZQUFSLENBQXBELEVBQUMsb0JBQUEsV0FBRCxFQUFjLHlCQUFBLGdCQUFkLEVBQWdDLHlCQUFBLGdCQUpoQyxDQUFBOztBQUFBLEVBTUEsdUJBQUEsR0FBMEIsU0FBQyxNQUFELEdBQUE7V0FBWSxNQUFNLENBQUMsT0FBUCxDQUFlLE1BQWYsRUFBdUIsRUFBdkIsRUFBWjtFQUFBLENBTjFCLENBQUE7O0FBQUEsRUFRTTtBQUNKLDBDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQVcsQ0FBQyxXQUFaLENBQXdCLG1CQUF4QixDQUFBLENBQUE7O0FBQUEsSUFDQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixtQkFBN0IsQ0FEQSxDQUFBOztBQUFBLElBR0EsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxZQUFMLEVBQW1CO0FBQUEsUUFBQSxNQUFBLEVBQVEsTUFBUjtBQUFBLFFBQWdCLE9BQUEsRUFBTyx3QkFBdkI7T0FBbkIsRUFBb0UsQ0FB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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/color-results-element.coffee
