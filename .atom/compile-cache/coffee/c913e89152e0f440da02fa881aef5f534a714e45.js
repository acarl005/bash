(function() {
  var Apathy, ApathyConfig, ApathyView, Color, CompositeDisposable, fs, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Color = _ref.Color;

  ApathyView = require('./apathy-view');

  ApathyConfig = require('./config');

  Apathy = (function() {
    function Apathy() {
      this.generateConfig = __bind(this.generateConfig, this);
    }

    Apathy.prototype.config = ApathyConfig;

    Apathy.prototype.activate = function(state) {
      var cbLessVarChanged, customStylePath, lessVariables, theKey, variable, _i, _len, _results;
      this.apathyView = new ApathyView(state.apathyViewState);
      this.disposables = new CompositeDisposable;
      this.packageName = require('../package.json').name;
      this.customStylePath = "" + __dirname + "/../styles/custom.less";
      this.disposables.add(atom.config.observe("" + this.packageName + ".enableTreeViewStyles", (function(_this) {
        return function() {
          return _this.setTreeViewBackground();
        };
      })(this)));
      this.disposables.add(atom.config.observe("" + this.packageName + ".enableTreeViewBorder", (function(_this) {
        return function() {
          return _this.setTreeViewBorder();
        };
      })(this)));
      this.disposables.add(atom.config.observe("" + this.packageName + ".altStyle", (function(_this) {
        return function() {
          return _this.doAltStyle();
        };
      })(this)));
      this.disposables.add(atom.config.observe("" + this.packageName + ".altFont", (function(_this) {
        return function() {
          return _this.doAltFont();
        };
      })(this)));
      customStylePath = "" + __dirname + "/../styles/custom.less";
      this.writeConfig(customStylePath);
      lessVariables = ["customSyntaxBgColor", "customUnderlayerBgColor", "customInactivePaneBgColor", "customInactiveOverlayColor", "syntaxBrightness", "syntaxSaturation", "syntaxContrast"];
      _results = [];
      for (_i = 0, _len = lessVariables.length; _i < _len; _i++) {
        variable = lessVariables[_i];
        theKey = "" + this.packageName + "." + variable;
        cbLessVarChanged = (function(_this) {
          return function() {
            return _this.writeConfig(customStylePath);
          };
        })(this);
        _results.push(this.disposables.add(atom.config.onDidChange(theKey, cbLessVarChanged)));
      }
      return _results;
    };

    Apathy.prototype.generateConfig = function() {
      var getColorConfig, getConfig, inactiveOverlayColor, inactivePaneBgColor, syntaxBgColor, syntaxBrightness, syntaxContrast, syntaxSaturation, theConfig, underlayerBgColor;
      getConfig = (function(_this) {
        return function(theConfig) {
          return atom.config.get("" + _this.packageName + "." + theConfig);
        };
      })(this);
      getColorConfig = (function(_this) {
        return function(theConfig) {
          return atom.config.get("" + _this.packageName + "." + theConfig).toRGBAString();
        };
      })(this);
      syntaxBgColor = getColorConfig("customSyntaxBgColor");
      underlayerBgColor = getColorConfig("customUnderlayerBgColor");
      inactivePaneBgColor = getColorConfig("customInactivePaneBgColor");
      inactiveOverlayColor = getColorConfig("customInactiveOverlayColor");
      syntaxBrightness = getConfig("syntaxBrightness");
      syntaxSaturation = getConfig("syntaxSaturation");
      syntaxContrast = getConfig("syntaxContrast");
      theConfig = "@apathy-background-color: " + syntaxBgColor + " !important;\n@apathy-underlayer-bg-color: " + underlayerBgColor + " !important;\n@apathy-inactive-bg-color: " + inactivePaneBgColor + " !important;\n@apathy-inactive-overlay-color: " + inactiveOverlayColor + " !important;\n@config-syntax-brightness : " + syntaxBrightness + ";\n@config-syntax-saturation : " + syntaxSaturation + ";\n@config-syntax-contrast : " + syntaxContrast + ";";
      return theConfig;
    };

    Apathy.prototype.writeConfig = function(path) {
      return fs.writeFileSync(path, this.generateConfig());
    };

    Apathy.prototype.setTreeViewBackground = function() {
      var isEnabled, treeViewStylePath, _ref1;
      isEnabled = atom.config.get("" + this.packageName + ".enableTreeViewStyles");
      treeViewStylePath = "" + __dirname + "/../styles/tree-view.less";
      if (isEnabled) {
        return this.activeTreeStyle = this.applyStylesheet(treeViewStylePath);
      } else {
        return (_ref1 = this.activeTreeStyle) != null ? _ref1.dispose() : void 0;
      }
    };

    Apathy.prototype.setTreeViewBorder = function() {
      var isEnabled, treeViewBorderPath, _ref1;
      isEnabled = atom.config.get("" + this.packageName + ".enableTreeViewBorder");
      treeViewBorderPath = "" + __dirname + "/../styles/tree-view-border.less";
      if (isEnabled) {
        return this.activeTreeBorder = this.applyStylesheet(treeViewBorderPath);
      } else {
        return (_ref1 = this.activeTreeBorder) != null ? _ref1.dispose() : void 0;
      }
    };

    Apathy.prototype.deactivate = function() {
      var _ref1, _ref2, _ref3, _ref4;
      if ((_ref1 = this.disposables) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.activeTreeStyle) != null) {
        _ref2.dispose();
      }
      if ((_ref3 = this.activeTreeBorder) != null) {
        _ref3.dispose();
      }
      return (_ref4 = this.apathyView) != null ? _ref4.destroy() : void 0;
    };

    Apathy.prototype.doAltStyle = function() {
      var _ref1;
      if ((_ref1 = this.activeStyleSheet) != null) {
        _ref1.dispose();
      }
      if (this.noAltSyleSelected()) {
        return;
      }
      try {
        this.activeStyleSheet = this.applyStylesheet(this.getStylePath(this.selectedAltStyle()));
        return this.activeAltStyle = this.selectedAltStyle;
      } catch (_error) {
        return console.debug('setting default altStyle');
      }
    };

    Apathy.prototype.doAltFont = function() {
      var altFontStylePath, selectedFont, _ref1;
      if ((_ref1 = this.renderedFontStyle) != null) {
        _ref1.dispose();
      }
      selectedFont = atom.config.get("" + this.packageName + ".altFont");
      if (selectedFont !== atom.config.get("" + this.packageName + ".altFont", {
        excludeSources: [atom.config.getUserConfigPath()]
      })) {
        altFontStylePath = "" + __dirname + "/../styles/" + (this.getNormalizedName(selectedFont)) + ".less";
        return this.renderedFontStyle = this.applyStylesheet(altFontStylePath);
      }
    };

    Apathy.prototype.getStylePath = function(altStyle) {
      return path.join(__dirname, "..", "themes", "" + (this.getNormalizedName(altStyle)) + ".less");
    };

    Apathy.prototype.isActiveStyle = function(altStyle) {
      return altStyle === this.activeAltStyle;
    };

    Apathy.prototype.applyStylesheet = function(sourcePath, preliminaryContent) {
      var source, stylesheetContent;
      if (preliminaryContent == null) {
        preliminaryContent = "";
      }
      stylesheetContent = fs.readFileSync(sourcePath, 'utf8');
      source = atom.themes.lessCache.cssForFile(sourcePath, [preliminaryContent, stylesheetContent].join('\n'));
      return atom.styles.addStyleSheet(source, {
        sourcePath: sourcePath,
        priority: 2,
        context: 'atom-text-editor'
      });
    };

    Apathy.prototype.noAltSyleSelected = function() {
      return this.selectedAltStyle() === atom.config.get("" + this.packageName + ".altStyle", {
        excludeSources: [atom.config.getUserConfigPath()]
      });
    };

    Apathy.prototype.selectedAltStyle = function() {
      return atom.config.get("" + this.packageName + ".altStyle");
    };

    Apathy.prototype.getNormalizedName = function(name) {
      return ("" + name).replace(' ', '-').replace(/\./g, '').replace(/\b\w/g, function(character) {
        return character.toLowerCase();
      });
    };

    Apathy.prototype.setThemeConfig = function(altStyle) {
      return atom.config.set("" + this.packageName + ".altStyle", altStyle);
    };

    Apathy.prototype.isSelectedStyle = function(altStyle) {
      var selectedAltStyle;
      selectedAltStyle = atom.config.get("" + this.packageName + ".altStyle");
      return altStyle === selectedAltStyle;
    };

    Apathy.prototype.requireStylesheet = function(stylesheetPath) {
      var content, fullPath;
      if (fullPath = this.resolveStylesheet(stylesheetPath)) {
        content = this.loadStylesheet(fullPath);
        return this.applyStylesheet(fullPath, content);
      } else {
        throw new Error("Could not find a file at path '" + stylesheetPath + "'");
      }
    };

    return Apathy;

  })();

  module.exports = new Apathy;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9hcGF0aHktdGhlbWUvbGliL2FwYXRoeS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEVBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsT0FBK0IsT0FBQSxDQUFRLE1BQVIsQ0FBL0IsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixhQUFBLEtBRnRCLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FIYixDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxVQUFSLENBSmYsQ0FBQTs7QUFBQSxFQU1NOzs7S0FFSjs7QUFBQSxxQkFBQSxNQUFBLEdBQVEsWUFBUixDQUFBOztBQUFBLHFCQUlBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtBQUVSLFVBQUEsc0ZBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFXLEtBQUssQ0FBQyxlQUFqQixDQUFsQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFEZixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUEwQixDQUFDLElBRjFDLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxlQUFELEdBQW1CLEVBQUEsR0FBRyxTQUFILEdBQWEsd0JBSGhDLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsRUFBQSxHQUN2QyxJ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

//# sourceURL=/home/andy/.atom/packages/apathy-theme/lib/apathy.coffee
