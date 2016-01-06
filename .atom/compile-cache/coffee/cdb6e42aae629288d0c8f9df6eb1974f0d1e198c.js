(function() {
  var CompositeDisposable, EventsDelegation, Palette, PaletteElement, SpacePenDSL, StickyTitle, THEME_VARIABLES, pigments, registerOrUpdateElement, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-utils'), SpacePenDSL = _ref.SpacePenDSL, EventsDelegation = _ref.EventsDelegation, registerOrUpdateElement = _ref.registerOrUpdateElement;

  THEME_VARIABLES = require('./uris').THEME_VARIABLES;

  pigments = require('./pigments');

  Palette = require('./palette');

  StickyTitle = require('./sticky-title');

  PaletteElement = (function(_super) {
    __extends(PaletteElement, _super);

    function PaletteElement() {
      return PaletteElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(PaletteElement);

    EventsDelegation.includeInto(PaletteElement);

    PaletteElement.content = function() {
      var group, merge, optAttrs, sort;
      sort = atom.config.get('pigments.sortPaletteColors');
      group = atom.config.get('pigments.groupPaletteColors');
      merge = atom.config.get('pigments.mergeColorDuplicates');
      optAttrs = function(bool, name, attrs) {
        if (bool) {
          attrs[name] = name;
        }
        return attrs;
      };
      return this.div({
        "class": 'pigments-palette-panel'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'pigments-palette-controls settings-view pane-item'
          }, function() {
            return _this.div({
              "class": 'pigments-palette-controls-wrapper'
            }, function() {
              _this.span({
                "class": 'input-group-inline'
              }, function() {
                _this.label({
                  "for": 'sort-palette-colors'
                }, 'Sort Colors');
                return _this.select({
                  outlet: 'sort',
                  id: 'sort-palette-colors'
                }, function() {
                  _this.option(optAttrs(sort === 'none', 'selected', {
                    value: 'none'
                  }), 'None');
                  _this.option(optAttrs(sort === 'by name', 'selected', {
                    value: 'by name'
                  }), 'By Name');
                  return _this.option(optAttrs(sort === 'by file', 'selected', {
                    value: 'by color'
                  }), 'By Color');
                });
              });
              _this.span({
                "class": 'input-group-inline'
              }, function() {
                _this.label({
                  "for": 'sort-palette-colors'
                }, 'Group Colors');
                return _this.select({
                  outlet: 'group',
                  id: 'group-palette-colors'
                }, function() {
                  _this.option(optAttrs(group === 'none', 'selected', {
                    value: 'none'
                  }), 'None');
                  return _this.option(optAttrs(group === 'by file', 'selected', {
                    value: 'by file'
                  }), 'By File');
                });
              });
              return _this.span({
                "class": 'input-group-inline'
              }, function() {
                _this.input(optAttrs(merge, 'checked', {
                  type: 'checkbox',
                  id: 'merge-duplicates',
                  outlet: 'merge'
                }));
                return _this.label({
                  "for": 'merge-duplicates'
                }, 'Merge Duplicates');
              });
            });
          });
          return _this.div({
            "class": 'pigments-palette-list native-key-bindings',
            tabindex: -1
          }, function() {
            return _this.ol({
              outlet: 'list'
            });
          });
        };
      })(this));
    };

    PaletteElement.prototype.createdCallback = function() {
      this.project = pigments.getProject();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('pigments.sortPaletteColors', (function(_this) {
        return function(sortPaletteColors) {
          _this.sortPaletteColors = sortPaletteColors;
          if ((_this.palette != null) && _this.attached) {
            return _this.renderList();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.groupPaletteColors', (function(_this) {
        return function(groupPaletteColors) {
          _this.groupPaletteColors = groupPaletteColors;
          if ((_this.palette != null) && _this.attached) {
            return _this.renderList();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.mergeColorDuplicates', (function(_this) {
        return function(mergeColorDuplicates) {
          _this.mergeColorDuplicates = mergeColorDuplicates;
          if ((_this.palette != null) && _this.attached) {
            return _this.renderList();
          }
        };
      })(this)));
      this.subscriptions.add(this.subscribeTo(this.sort, {
        'change': function(e) {
          return atom.config.set('pigments.sortPaletteColors', e.target.value);
        }
      }));
      this.subscriptions.add(this.subscribeTo(this.group, {
        'change': function(e) {
          return atom.config.set('pigments.groupPaletteColors', e.target.value);
        }
      }));
      this.subscriptions.add(this.subscribeTo(this.merge, {
        'change': function(e) {
          return atom.config.set('pigments.mergeColorDuplicates', e.target.checked);
        }
      }));
      return this.subscriptions.add(this.subscribeTo(this.list, '[data-variable-id]', {
        'click': (function(_this) {
          return function(e) {
            var variable, variableId;
            variableId = Number(e.target.dataset.variableId);
            variable = _this.project.getVariableById(variableId);
            return _this.project.showVariableInFile(variable);
          };
        })(this)
      }));
    };

    PaletteElement.prototype.attachedCallback = function() {
      if (this.palette != null) {
        this.renderList();
      }
      return this.attached = true;
    };

    PaletteElement.prototype.getTitle = function() {
      return 'Palette';
    };

    PaletteElement.prototype.getURI = function() {
      return 'pigments://palette';
    };

    PaletteElement.prototype.getIconName = function() {
      return "pigments";
    };

    PaletteElement.prototype.getModel = function() {
      return this.palette;
    };

    PaletteElement.prototype.setModel = function(palette) {
      this.palette = palette;
      if (this.attached) {
        return this.renderList();
      }
    };

    PaletteElement.prototype.getColorsList = function(palette) {
      switch (this.sortPaletteColors) {
        case 'by color':
          return palette.sortedByColor();
        case 'by name':
          return palette.sortedByName();
        default:
          return palette.variables.slice();
      }
    };

    PaletteElement.prototype.renderList = function() {
      var file, li, ol, palette, palettes, _ref1;
      if ((_ref1 = this.stickyTitle) != null) {
        _ref1.dispose();
      }
      this.list.innerHTML = '';
      if (this.groupPaletteColors === 'by file') {
        palettes = this.getFilesPalettes();
        for (file in palettes) {
          palette = palettes[file];
          li = document.createElement('li');
          li.className = 'pigments-color-group';
          ol = document.createElement('ol');
          li.appendChild(this.getGroupHeader(atom.project.relativize(file)));
          li.appendChild(ol);
          this.buildList(ol, this.getColorsList(palette));
          this.list.appendChild(li);
        }
        return this.stickyTitle = new StickyTitle(this.list.querySelectorAll('.pigments-color-group-header-content'), this.querySelector('.pigments-palette-list'));
      } else {
        return this.buildList(this.list, this.getColorsList(this.palette));
      }
    };

    PaletteElement.prototype.getGroupHeader = function(label) {
      var content, header;
      header = document.createElement('div');
      header.className = 'pigments-color-group-header';
      content = document.createElement('div');
      content.className = 'pigments-color-group-header-content';
      if (label === THEME_VARIABLES) {
        content.textContent = 'Atom Themes';
      } else {
        content.textContent = label;
      }
      header.appendChild(content);
      return header;
    };

    PaletteElement.prototype.getFilesPalettes = function() {
      var palettes;
      palettes = {};
      this.palette.eachColor((function(_this) {
        return function(variable) {
          var path;
          path = variable.path;
          if (palettes[path] == null) {
            palettes[path] = new Palette([]);
          }
          return palettes[path].variables.push(variable);
        };
      })(this));
      return palettes;
    };

    PaletteElement.prototype.buildList = function(container, paletteColors) {
      var color, html, id, li, line, name, path, variables, _i, _j, _len, _len1, _ref1, _results;
      paletteColors = this.checkForDuplicates(paletteColors);
      _results = [];
      for (_i = 0, _len = paletteColors.length; _i < _len; _i++) {
        variables = paletteColors[_i];
        li = document.createElement('li');
        li.className = 'pigments-color-item';
        color = variables[0].color;
        html = "<div class=\"pigments-color\">\n  <span class=\"pigments-color-preview\"\n        style=\"background-color: " + (color.toCSS()) + "\">\n  </span>\n  <span class=\"pigments-color-properties\">\n    <span class=\"pigments-color-component\"><strong>R:</strong> " + (Math.round(color.red)) + "</span>\n    <span class=\"pigments-color-component\"><strong>G:</strong> " + (Math.round(color.green)) + "</span>\n    <span class=\"pigments-color-component\"><strong>B:</strong> " + (Math.round(color.blue)) + "</span>\n    <span class=\"pigments-color-component\"><strong>A:</strong> " + (Math.round(color.alpha * 1000) / 1000) + "</span>\n  </span>\n</div>\n<div class=\"pigments-color-details\">";
        for (_j = 0, _len1 = variables.length; _j < _len1; _j++) {
          _ref1 = variables[_j], name = _ref1.name, path = _ref1.path, line = _ref1.line, id = _ref1.id;
          html += "<span class=\"pigments-color-occurence\">\n    <span class=\"name\">" + name + "</span>";
          if (path !== THEME_VARIABLES) {
            html += "<span data-variable-id=\"" + id + "\">\n  <span class=\"path\">" + (atom.project.relativize(path)) + "</span>\n  <span class=\"line\">at line " + (line + 1) + "</span>\n</span>";
          }
          html += '</span>';
        }
        html += '</div>';
        li.innerHTML = html;
        _results.push(container.appendChild(li));
      }
      return _results;
    };

    PaletteElement.prototype.checkForDuplicates = function(paletteColors) {
      var colors, findColor, key, map, results, v, _i, _len;
      results = [];
      if (this.mergeColorDuplicates) {
        map = new Map();
        colors = [];
        findColor = function(color) {
          var col, _i, _len;
          for (_i = 0, _len = colors.length; _i < _len; _i++) {
            col = colors[_i];
            if (col.isEqual(color)) {
              return col;
            }
          }
        };
        for (_i = 0, _len = paletteColors.length; _i < _len; _i++) {
          v = paletteColors[_i];
          if (key = findColor(v.color)) {
            map.get(key).push(v);
          } else {
            map.set(v.color, [v]);
            colors.push(v.color);
          }
        }
        map.forEach(function(vars, color) {
          return results.push(vars);
        });
        return results;
      } else {
        return (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = paletteColors.length; _j < _len1; _j++) {
            v = paletteColors[_j];
            _results.push([v]);
          }
          return _results;
        })();
      }
    };

    return PaletteElement;

  })(HTMLElement);

  module.exports = PaletteElement = registerOrUpdateElement('pigments-palette', PaletteElement.prototype);

  PaletteElement.registerViewProvider = function(modelClass) {
    return atom.views.addViewProvider(modelClass, function(model) {
      var element;
      element = new PaletteElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGFsZXR0ZS1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrSkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxPQUEyRCxPQUFBLENBQVEsWUFBUixDQUEzRCxFQUFDLG1CQUFBLFdBQUQsRUFBYyx3QkFBQSxnQkFBZCxFQUFnQywrQkFBQSx1QkFEaEMsQ0FBQTs7QUFBQSxFQUVDLGtCQUFtQixPQUFBLENBQVEsUUFBUixFQUFuQixlQUZELENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FIWCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSlYsQ0FBQTs7QUFBQSxFQUtBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FMZCxDQUFBOztBQUFBLEVBT007QUFDSixxQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxXQUFXLENBQUMsV0FBWixDQUF3QixjQUF4QixDQUFBLENBQUE7O0FBQUEsSUFDQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixjQUE3QixDQURBLENBQUE7O0FBQUEsSUFHQSxjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsNEJBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQVAsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FEUixDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FB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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/palette-element.coffee
