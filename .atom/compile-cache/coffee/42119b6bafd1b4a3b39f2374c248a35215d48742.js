(function() {
  var ColorProjectElement, CompositeDisposable, EventsDelegation, SpacePenDSL, capitalize, registerOrUpdateElement, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-utils'), SpacePenDSL = _ref.SpacePenDSL, EventsDelegation = _ref.EventsDelegation, registerOrUpdateElement = _ref.registerOrUpdateElement;

  capitalize = function(s) {
    return s.replace(/^./, function(m) {
      return m.toUpperCase();
    });
  };

  ColorProjectElement = (function(_super) {
    __extends(ColorProjectElement, _super);

    function ColorProjectElement() {
      return ColorProjectElement.__super__.constructor.apply(this, arguments);
    }

    SpacePenDSL.includeInto(ColorProjectElement);

    EventsDelegation.includeInto(ColorProjectElement);

    ColorProjectElement.content = function() {
      var arrayField, booleanField;
      arrayField = (function(_this) {
        return function(name, label, setting, description) {
          var settingName;
          settingName = "pigments." + name;
          return _this.div({
            "class": 'control-group array'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.label({
                "class": 'control-label'
              }, function() {
                return _this.span({
                  "class": 'setting-title'
                }, label);
              });
              return _this.div({
                "class": 'control-wrapper'
              }, function() {
                _this.tag('atom-text-editor', {
                  mini: true,
                  outlet: name,
                  type: 'array',
                  property: name
                });
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  _this.div(function() {
                    _this.raw("Global config: <code>" + (atom.config.get(setting != null ? setting : settingName).join(', ')) + "</code>");
                    if (description != null) {
                      return _this.p(function() {
                        return _this.raw(description);
                      });
                    }
                  });
                  return booleanField("ignoreGlobal" + (capitalize(name)), 'Ignore Global', null, true);
                });
              });
            });
          });
        };
      })(this);
      booleanField = (function(_this) {
        return function(name, label, description, nested) {
          return _this.div({
            "class": 'control-group boolean'
          }, function() {
            return _this.div({
              "class": 'controls'
            }, function() {
              _this.input({
                type: 'checkbox',
                id: "pigments-" + name,
                outlet: name
              });
              _this.label({
                "class": 'control-label',
                "for": "pigments-" + name
              }, function() {
                return _this.span({
                  "class": (nested ? 'setting-description' : 'setting-title')
                }, label);
              });
              if (description != null) {
                return _this.div({
                  "class": 'setting-description'
                }, function() {
                  return _this.raw(description);
                });
              }
            });
          });
        };
      })(this);
      return this.section({
        "class": 'settings-view pane-item'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'settings-wrapper'
          }, function() {
            _this.div({
              "class": 'header'
            }, function() {
              _this.div({
                "class": 'logo'
              }, function() {
                return _this.img({
                  src: 'atom://pigments/resources/logo.svg',
                  width: 140,
                  height: 35
                });
              });
              return _this.p({
                "class": 'setting-description'
              }, "These settings apply on the current project only and are complementary\nto the package settings.");
            });
            return _this.div({
              "class": 'fields'
            }, function() {
              var themes;
              themes = atom.themes.getActiveThemeNames();
              arrayField('sourceNames', 'Source Names');
              arrayField('ignoredNames', 'Ignored Names');
              arrayField('supportedFiletypes', 'Supported Filetypes');
              arrayField('ignoredScopes', 'Ignored Scopes');
              arrayField('searchNames', 'Extended Search Names', 'pigments.extendedSearchNames');
              return booleanField('includeThemes', 'Include Atom Themes Stylesheets', "The variables from <code>" + themes[0] + "</code> and\n<code>" + themes[1] + "</code> themes will be automatically added to the\nproject palette.");
            });
          });
        };
      })(this));
    };

    ColorProjectElement.prototype.createdCallback = function() {
      return this.subscriptions = new CompositeDisposable;
    };

    ColorProjectElement.prototype.setModel = function(project) {
      this.project = project;
      return this.initializeBindings();
    };

    ColorProjectElement.prototype.initializeBindings = function() {
      var grammar;
      grammar = atom.grammars.grammarForScopeName('source.js.regexp');
      this.ignoredScopes.getModel().setGrammar(grammar);
      this.initializeTextEditor('sourceNames');
      this.initializeTextEditor('searchNames');
      this.initializeTextEditor('ignoredNames');
      this.initializeTextEditor('ignoredScopes');
      this.initializeTextEditor('supportedFiletypes');
      this.initializeCheckbox('includeThemes');
      this.initializeCheckbox('ignoreGlobalSourceNames');
      this.initializeCheckbox('ignoreGlobalIgnoredNames');
      this.initializeCheckbox('ignoreGlobalIgnoredScopes');
      this.initializeCheckbox('ignoreGlobalSearchNames');
      return this.initializeCheckbox('ignoreGlobalSupportedFiletypes');
    };

    ColorProjectElement.prototype.initializeTextEditor = function(name) {
      var capitalizedName, editor, _ref1;
      capitalizedName = capitalize(name);
      editor = this[name].getModel();
      editor.setText(((_ref1 = this.project[name]) != null ? _ref1 : []).join(', '));
      return this.subscriptions.add(editor.onDidStopChanging((function(_this) {
        return function() {
          var array;
          array = editor.getText().split(/\s*,\s*/g).filter(function(s) {
            return s.length > 0;
          });
          return _this.project["set" + capitalizedName](array);
        };
      })(this)));
    };

    ColorProjectElement.prototype.initializeCheckbox = function(name) {
      var capitalizedName, checkbox;
      capitalizedName = capitalize(name);
      checkbox = this[name];
      checkbox.checked = this.project[name];
      return this.subscriptions.add(this.subscribeTo(checkbox, {
        change: (function(_this) {
          return function() {
            return _this.project["set" + capitalizedName](checkbox.checked);
          };
        })(this)
      }));
    };

    ColorProjectElement.prototype.getTitle = function() {
      return 'Project Settings';
    };

    ColorProjectElement.prototype.getURI = function() {
      return 'pigments://settings';
    };

    ColorProjectElement.prototype.getIconName = function() {
      return "pigments";
    };

    return ColorProjectElement;

  })(HTMLElement);

  module.exports = ColorProjectElement = registerOrUpdateElement('pigments-color-project', ColorProjectElement.prototype);

  ColorProjectElement.registerViewProvider = function(modelClass) {
    return atom.views.addViewProvider(modelClass, function(model) {
      var element;
      element = new ColorProjectElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvY29sb3ItcHJvamVjdC1lbGVtZW50LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrSEFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxPQUEyRCxPQUFBLENBQVEsWUFBUixDQUEzRCxFQUFDLG1CQUFBLFdBQUQsRUFBYyx3QkFBQSxnQkFBZCxFQUFnQywrQkFBQSx1QkFEaEMsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxTQUFDLENBQUQsR0FBQTtXQUFPLENBQUMsQ0FBQyxPQUFGLENBQVUsSUFBVixFQUFnQixTQUFDLENBQUQsR0FBQTthQUFPLENBQUMsQ0FBQyxXQUFGLENBQUEsRUFBUDtJQUFBLENBQWhCLEVBQVA7RUFBQSxDQUhiLENBQUE7O0FBQUEsRUFLTTtBQUNKLDBDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQVcsQ0FBQyxXQUFaLENBQXdCLG1CQUF4QixDQUFBLENBQUE7O0FBQUEsSUFDQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixtQkFBN0IsQ0FEQSxDQUFBOztBQUFBLElBR0EsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSx3QkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsRUFBTyxLQUFQLEVBQWMsT0FBZCxFQUF1QixXQUF2QixHQUFBO0FBQ1gsY0FBQSxXQUFBO0FBQUEsVUFBQSxXQUFBLEdBQWUsV0FBQSxHQUFXLElBQTFCLENBQUE7aUJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLHFCQUFQO1dBQUws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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/color-project-element.coffee
