(function() {
  var ColorContext, ColorParser, registry,
    __slice = [].slice;

  ColorContext = require('../lib/color-context');

  ColorParser = require('../lib/color-parser');

  registry = require('../lib/color-expressions');

  describe('ColorContext', function() {
    var context, itParses, parser, _ref;
    _ref = [], context = _ref[0], parser = _ref[1];
    itParses = function(expression) {
      return {
        asUndefinedColor: function() {
          return it("parses '" + expression + "' as undefined", function() {
            return expect(context.readColor(expression)).toBeUndefined();
          });
        },
        asInt: function(expected) {
          return it("parses '" + expression + "' as an integer with value of " + expected, function() {
            return expect(context.readInt(expression)).toEqual(expected);
          });
        },
        asFloat: function(expected) {
          return it("parses '" + expression + "' as a float with value of " + expected, function() {
            return expect(context.readFloat(expression)).toEqual(expected);
          });
        },
        asIntOrPercent: function(expected) {
          return it("parses '" + expression + "' as an integer or a percentage with value of " + expected, function() {
            return expect(context.readIntOrPercent(expression)).toEqual(expected);
          });
        },
        asFloatOrPercent: function(expected) {
          return it("parses '" + expression + "' as a float or a percentage with value of " + expected, function() {
            return expect(context.readFloatOrPercent(expression)).toEqual(expected);
          });
        },
        asColorExpression: function(expected) {
          return it("parses '" + expression + "' as a color expression", function() {
            return expect(context.readColorExpression(expression)).toEqual(expected);
          });
        },
        asColor: function() {
          var expected;
          expected = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return it("parses '" + expression + "' as a color with value of " + (jasmine.pp(expected)), function() {
            var _ref1;
            return (_ref1 = expect(context.readColor(expression))).toBeColor.apply(_ref1, expected);
          });
        }
      };
    };
    describe('created without any variables', function() {
      beforeEach(function() {
        return context = new ColorContext({
          registry: registry
        });
      });
      itParses('10').asInt(10);
      itParses('10').asFloat(10);
      itParses('0.5').asFloat(0.5);
      itParses('.5').asFloat(0.5);
      itParses('10').asIntOrPercent(10);
      itParses('10%').asIntOrPercent(26);
      itParses('0.1').asFloatOrPercent(0.1);
      itParses('10%').asFloatOrPercent(0.1);
      itParses('red').asColorExpression('red');
      itParses('red').asColor(255, 0, 0);
      itParses('#ff0000').asColor(255, 0, 0);
      return itParses('rgb(255,127,0)').asColor(255, 127, 0);
    });
    describe('with a variables array', function() {
      var createColorVar, createVar;
      createVar = function(name, value) {
        return {
          value: value,
          name: name,
          path: '/path/to/file.coffee'
        };
      };
      createColorVar = function(name, value) {
        var v;
        v = createVar(name, value);
        v.isColor = true;
        return v;
      };
      beforeEach(function() {
        var colorVariables, variables;
        variables = [createVar('x', '10'), createVar('y', '0.1'), createVar('z', '10%'), createColorVar('c', 'rgb(255,127,0)')];
        colorVariables = variables.filter(function(v) {
          return v.isColor;
        });
        return context = new ColorContext({
          variables: variables,
          colorVariables: colorVariables,
          registry: registry
        });
      });
      itParses('x').asInt(10);
      itParses('y').asFloat(0.1);
      itParses('z').asIntOrPercent(26);
      itParses('z').asFloatOrPercent(0.1);
      itParses('c').asColorExpression('rgb(255,127,0)');
      itParses('c').asColor(255, 127, 0);
      return describe('that contains invalid colors', function() {
        beforeEach(function() {
          var variables;
          variables = [createVar('@text-height', '@scale-b-xxl * 1rem'), createVar('@component-line-height', '@text-height'), createVar('@list-item-height', '@component-line-height')];
          return context = new ColorContext({
            variables: variables,
            registry: registry
          });
        });
        return itParses('@list-item-height').asUndefinedColor();
      });
    });
    describe('with variables from a default file', function() {
      var createColorVar, createVar, projectPath, referenceVariable, _ref1;
      _ref1 = [], projectPath = _ref1[0], referenceVariable = _ref1[1];
      createVar = function(name, value, path) {
        if (path == null) {
          path = "" + projectPath + "/file.styl";
        }
        return {
          value: value,
          name: name,
          path: path
        };
      };
      createColorVar = function(name, value, path) {
        var v;
        v = createVar(name, value, path);
        v.isColor = true;
        return v;
      };
      describe('when there is another valid value', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', "" + projectPath + "/.pigments"), createVar('b', '20', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(20);
      });
      describe('when there is no another valid value', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', "" + projectPath + "/.pigments"), createVar('b', 'c', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(10);
      });
      describe('when there is another valid color', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createColorVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createColorVar('b', '#ff0000', "" + projectPath + "/.pigments"), createColorVar('b', '#0000ff', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asColor(0, 0, 255);
      });
      return describe('when there is no another valid color', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createColorVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createColorVar('b', '#ff0000', "" + projectPath + "/.pigments"), createColorVar('b', 'c', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asColor(255, 0, 0);
      });
    });
    describe('with a reference variable', function() {
      var createColorVar, createVar, projectPath, referenceVariable, _ref1;
      _ref1 = [], projectPath = _ref1[0], referenceVariable = _ref1[1];
      createVar = function(name, value, path) {
        if (path == null) {
          path = "" + projectPath + "/file.styl";
        }
        return {
          value: value,
          name: name,
          path: path
        };
      };
      createColorVar = function(name, value) {
        var v;
        v = createVar(name, value);
        v.isColor = true;
        return v;
      };
      describe('when there is a single root path', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', '10', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('a', '20', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(10);
      });
      return describe('when there are many root paths', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', "" + projectPath + "/b.styl"), createVar('b', '20', "" + projectPath + "2/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referenceVariable: referenceVariable,
            rootPaths: [projectPath, "" + projectPath + "2"]
          });
        });
        return itParses('a').asInt(10);
      });
    });
    return describe('with a reference path', function() {
      var createColorVar, createVar, projectPath, referenceVariable, _ref1;
      _ref1 = [], projectPath = _ref1[0], referenceVariable = _ref1[1];
      createVar = function(name, value, path) {
        if (path == null) {
          path = "" + projectPath + "/file.styl";
        }
        return {
          value: value,
          name: name,
          path: path
        };
      };
      createColorVar = function(name, value) {
        var v;
        v = createVar(name, value);
        v.isColor = true;
        return v;
      };
      describe('when there is a single root path', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', '10', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('a', '20', "" + projectPath + "/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referencePath: "" + projectPath + "/a.styl",
            rootPaths: [projectPath]
          });
        });
        return itParses('a').asInt(10);
      });
      return describe('when there are many root paths', function() {
        beforeEach(function() {
          var colorVariables, variables;
          projectPath = atom.project.getPaths()[0];
          referenceVariable = createVar('a', 'b', "" + projectPath + "/a.styl");
          variables = [referenceVariable, createVar('b', '10', "" + projectPath + "/b.styl"), createVar('b', '20', "" + projectPath + "2/b.styl")];
          colorVariables = variables.filter(function(v) {
            return v.isColor;
          });
          return context = new ColorContext({
            registry: registry,
            variables: variables,
            colorVariables: colorVariables,
            referencePath: "" + projectPath + "/a.styl",
            rootPaths: [projectPath, "" + projectPath + "2"]
          });
        });
        return itParses('a').asInt(10);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLWNvbnRleHQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsbUNBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FBZixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQURkLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLDBCQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLCtCQUFBO0FBQUEsSUFBQSxPQUFvQixFQUFwQixFQUFDLGlCQUFELEVBQVUsZ0JBQVYsQ0FBQTtBQUFBLElBRUEsUUFBQSxHQUFXLFNBQUMsVUFBRCxHQUFBO2FBQ1Q7QUFBQSxRQUFBLGdCQUFBLEVBQWtCLFNBQUEsR0FBQTtpQkFDaEIsRUFBQSxDQUFJLFVBQUEsR0FBVSxVQUFWLEdBQXFCLGdCQUF6QixFQUEwQyxTQUFBLEdBQUE7bUJBQ3hDLE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBUixDQUFrQixVQUFsQixDQUFQLENBQXFDLENBQUMsYUFBdEMsQ0FBQSxFQUR3QztVQUFBLENBQTFDLEVBRGdCO1FBQUEsQ0FBbEI7QUFBQSxRQUlBLEtBQUEsRUFBTyxTQUFDLFFBQUQsR0FBQTtpQkFDTCxFQUFBLENBQUksVUFBQSxHQUFVLFVBQVYsR0FBcUIsZ0NBQXJCLEdBQXFELFFBQXpELEVBQXFFLFNBQUEsR0FBQTttQkFDbkUsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFVBQWhCLENBQVAsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QyxRQUE1QyxFQURtRTtVQUFBLENBQXJFLEVBREs7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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/color-context-spec.coffee
