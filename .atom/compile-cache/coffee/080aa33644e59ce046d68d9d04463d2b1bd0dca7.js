(function() {
  var CompositeDisposable, PigmentsProvider, Range, variablesRegExp, _, _ref;

  _ = require('underscore-plus');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range;

  variablesRegExp = require('./regexes').variables;

  module.exports = PigmentsProvider = (function() {
    function PigmentsProvider(pigments) {
      this.pigments = pigments;
      this.subscriptions = new CompositeDisposable;
      this.selector = atom.config.get('pigments.autocompleteScopes').join(',');
      this.subscriptions.add(atom.config.observe('pigments.autocompleteScopes', (function(_this) {
        return function(scopes) {
          return _this.selector = scopes.join(',');
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('pigments.extendAutocompleteToVariables', (function(_this) {
        return function(extendAutocompleteToVariables) {
          _this.extendAutocompleteToVariables = extendAutocompleteToVariables;
        };
      })(this)));
    }

    PigmentsProvider.prototype.dispose = function() {
      this.disposed = true;
      this.subscriptions.dispose();
      return this.pigments = null;
    };

    PigmentsProvider.prototype.getProject = function() {
      if (this.disposed) {
        return;
      }
      return this.pigments.getProject();
    };

    PigmentsProvider.prototype.getSuggestions = function(_arg) {
      var bufferPosition, editor, prefix, project, suggestions, variables;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition;
      if (this.disposed) {
        return;
      }
      prefix = this.getPrefix(editor, bufferPosition);
      project = this.getProject();
      if (!(prefix != null ? prefix.length : void 0)) {
        return;
      }
      if (project == null) {
        return;
      }
      if (this.extendAutocompleteToVariables) {
        variables = project.getVariables();
      } else {
        variables = project.getColorVariables();
      }
      suggestions = this.findSuggestionsForPrefix(variables, prefix);
      return suggestions;
    };

    PigmentsProvider.prototype.getPrefix = function(editor, bufferPosition) {
      var line, _ref1;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((_ref1 = line.match(new RegExp(variablesRegExp + '$'))) != null ? _ref1[0] : void 0) || '';
    };

    PigmentsProvider.prototype.findSuggestionsForPrefix = function(variables, prefix) {
      var matchedVariables, suggestions;
      if (variables == null) {
        return [];
      }
      suggestions = [];
      matchedVariables = variables.filter(function(v) {
        return RegExp("^" + (_.escapeRegExp(prefix))).test(v.name);
      });
      matchedVariables.forEach(function(v) {
        if (v.isColor) {
          return suggestions.push({
            text: v.name,
            rightLabelHTML: "<span class='color-suggestion-preview' style='background: " + (v.color.toCSS()) + "'></span>",
            replacementPrefix: prefix,
            className: 'color-suggestion'
          });
        } else {
          return suggestions.push({
            text: v.name,
            rightLabel: v.value,
            replacementPrefix: prefix,
            className: 'pigments-suggestion'
          });
        }
      });
      return suggestions;
    };

    return PigmentsProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcGlnbWVudHMtcHJvdmlkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNFQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxPQUFnQyxPQUFBLENBQVEsTUFBUixDQUFoQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGFBQUEsS0FEdEIsQ0FBQTs7QUFBQSxFQUVZLGtCQUFtQixPQUFBLENBQVEsV0FBUixFQUE5QixTQUZELENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSwwQkFBRSxRQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxHQUFwRCxDQURaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNkJBQXBCLEVBQW1ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFDcEUsS0FBQyxDQUFBLFFBQUQsR0FBWSxNQUFNLENBQUMsSUFBUCxDQUFZLEdBQVosRUFEd0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuRCxDQUFuQixDQUhBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isd0NBQXBCLEVBQThELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLDZCQUFGLEdBQUE7QUFBa0MsVUFBakMsS0FBQyxDQUFBLGdDQUFBLDZCQUFnQyxDQUFsQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlELENBQW5CLENBTEEsQ0FEVztJQUFBLENBQWI7O0FBQUEsK0JBUUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FITDtJQUFBLENBUlQsQ0FBQTs7QUFBQSwrQkFhQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFVLElBQUMsQ0FBQSxRQUFYO0FBQUEsY0FBQSxDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLFVBQVYsQ0FBQSxFQUZVO0lBQUEsQ0FiWixDQUFBOztBQUFBLCtCQWlCQSxjQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBO0FBQ2QsVUFBQSwrREFBQTtBQUFBLE1BRGdCLGNBQUEsUUFBUSxzQkFBQSxjQUN4QixDQUFBO0FBQUEsTUFBQSxJQUFVLElBQUMsQ0FBQSxRQUFYO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBbUIsY0FBbkIsQ0FEVCxDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQVUsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUZWLENBQUE7QUFHQSxNQUFBLElBQUEsQ0FBQSxrQkFBYyxNQUFNLENBQUUsZ0JBQXRCO0FBQUEsY0FBQSxDQUFBO09BSEE7QUFJQSxNQUFBLElBQWMsZUFBZDtBQUFBLGNBQUEsQ0FBQTtPQUpBO0FBTUEsTUFBQSxJQUFHLElBQUMsQ0FBQSw2QkFBSjtBQUNFLFFBQUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxZQUFSLENBQUEsQ0FBWixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsU0FBQSxHQUFZLE9BQU8sQ0FBQyxpQkFBUixDQUFBLENBQVosQ0FIRjtPQU5BO0FBQUEsTUFXQSxXQUFBLEdBQWMsSUFBQyxDQUFBLHdCQUFELENBQTBCLFNBQTFCLEVBQXFDLE1BQXJDLENBWGQsQ0FBQTthQVlBLFlBYmM7SUFBQSxDQWpCaEIsQ0FBQTs7QUFBQSwrQkFnQ0EsU0FBQSxHQUFXLFNBQUMsTUFBRCxFQUFTLGNBQVQsR0FBQTtBQUNULFVBQUEsV0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBRCxFQUEwQixjQUExQixDQUF0QixDQUFQLENBQUE7cUZBRStDLENBQUEsQ0FBQSxXQUEvQyxJQUFxRCxHQUg1QztJQUFBLENBaENYLENBQUE7O0FBQUEsK0JBcUNBLHdCQUFBLEdBQTBCLFNBQUMsU0FBRCxFQUFZLE1BQVosR0FBQTtBQUN4QixVQUFBLDZCQUFBO0FBQUEsTUFBQSxJQUFpQixpQkFBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUFBO0FBQUEsTUFFQSxXQUFBLEdBQWMsRUFGZCxDQUFBO0FBQUEsTUFJQSxnQkFBQSxHQUFtQixTQUFTLENBQUMsTUFBVixDQUFpQixTQUFDLENBQUQsR0FBQTtlQUFPLE1BQUEsQ0FBRyxHQUFBLEdBQUUsQ0FBQyxDQUFDLENBQUMsWUFBRixDQUFlLE1BQWYsQ0FBRCxDQUFMLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBQyxDQUFDLElBQXZDLEVBQVA7TUFBQSxDQUFqQixDQUpuQixDQUFBO0FBQUEsTUFNQSxnQkFBZ0IsQ0FBQyxPQUFqQixDQUF5QixTQUFDLENBQUQsR0FBQTtBQUN2QixRQUFBLElBQUcsQ0FBQyxDQUFDLE9BQUw7aUJBQ0UsV0FBVyxDQUFDLElBQVosQ0FBaUI7QUFBQSxZQUNmLElBQUEsRUFBTSxDQUFDLENBQUMsSUFETztBQUFBLFlBRWYsY0FBQSxFQUFpQiw0REFBQSxHQUEyRCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBUixDQUFBLENBQUQsQ0FBM0QsR0FBNEUsV0FGOUU7QUFBQSxZQUdmLGlCQUFBLEVBQW1CLE1BSEo7QUFBQSxZQUlmLFNBQUEsRUFBVyxrQkFKSTtXQUFqQixFQURGO1NBQUEsTUFBQTtpQkFRRSxXQUFXLENBQUMsSUFBWixDQUFpQjtBQUFBLFlBQ2YsSUFBQSxFQUFNLENBQUMsQ0FBQyxJQURPO0FBQUEsWUFFZixVQUFBLEVBQVksQ0FBQyxDQUFDLEtBRkM7QUFBQSxZQUdmLGlCQUFBLEVBQW1CLE1BSEo7QUFBQSxZQUlmLFNBQUEsRUFBVyxxQkFKSTtXQUFqQixFQVJGO1NBRHVCO01BQUEsQ0FBekIsQ0FOQSxDQUFBO2FBc0JBLFlBdkJ3QjtJQUFBLENBckMxQixDQUFBOzs0QkFBQTs7TUFORixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/pigments/lib/pigments-provider.coffee
