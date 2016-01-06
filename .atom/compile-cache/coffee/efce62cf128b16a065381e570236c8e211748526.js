(function() {
  var BufferVariablesScanner, ColorContext, ExpressionsRegistry, VariableExpression, VariableScanner, VariablesChunkSize;

  VariableScanner = require('../variable-scanner');

  ColorContext = require('../color-context');

  VariableExpression = require('../variable-expression');

  ExpressionsRegistry = require('../expressions-registry');

  VariablesChunkSize = 100;

  BufferVariablesScanner = (function() {
    function BufferVariablesScanner(config) {
      var registry;
      this.buffer = config.buffer, registry = config.registry;
      registry = ExpressionsRegistry.deserialize(registry, VariableExpression);
      this.scanner = new VariableScanner({
        registry: registry
      });
      this.results = [];
    }

    BufferVariablesScanner.prototype.scan = function() {
      var lastIndex, results;
      lastIndex = 0;
      while (results = this.scanner.search(this.buffer, lastIndex)) {
        this.results = this.results.concat(results);
        if (this.results.length >= VariablesChunkSize) {
          this.flushVariables();
        }
        lastIndex = results.lastIndex;
      }
      return this.flushVariables();
    };

    BufferVariablesScanner.prototype.flushVariables = function() {
      emit('scan-buffer:variables-found', this.results);
      return this.results = [];
    };

    return BufferVariablesScanner;

  })();

  module.exports = function(config) {
    return new BufferVariablesScanner(config).scan();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdGFza3Mvc2Nhbi1idWZmZXItdmFyaWFibGVzLWhhbmRsZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtIQUFBOztBQUFBLEVBQUEsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FBbEIsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdCQUFSLENBRnJCLENBQUE7O0FBQUEsRUFHQSxtQkFBQSxHQUFzQixPQUFBLENBQVEseUJBQVIsQ0FIdEIsQ0FBQTs7QUFBQSxFQUtBLGtCQUFBLEdBQXFCLEdBTHJCLENBQUE7O0FBQUEsRUFPTTtBQUNTLElBQUEsZ0NBQUMsTUFBRCxHQUFBO0FBQ1gsVUFBQSxRQUFBO0FBQUEsTUFBQyxJQUFDLENBQUEsZ0JBQUEsTUFBRixFQUFVLGtCQUFBLFFBQVYsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLG1CQUFtQixDQUFDLFdBQXBCLENBQWdDLFFBQWhDLEVBQTBDLGtCQUExQyxDQURYLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxlQUFBLENBQWdCO0FBQUEsUUFBQyxVQUFBLFFBQUQ7T0FBaEIsQ0FGZixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBSFgsQ0FEVztJQUFBLENBQWI7O0FBQUEscUNBTUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsa0JBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxDQUFaLENBQUE7QUFDQSxhQUFNLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLE1BQWpCLEVBQXlCLFNBQXpCLENBQWhCLEdBQUE7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULENBQWdCLE9BQWhCLENBQVgsQ0FBQTtBQUVBLFFBQUEsSUFBcUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULElBQW1CLGtCQUF4QztBQUFBLFVBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFBLENBQUE7U0FGQTtBQUFBLFFBR0MsWUFBYSxRQUFiLFNBSEQsQ0FERjtNQUFBLENBREE7YUFPQSxJQUFDLENBQUEsY0FBRCxDQUFBLEVBUkk7SUFBQSxDQU5OLENBQUE7O0FBQUEscUNBZ0JBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsTUFBQSxJQUFBLENBQUssNkJBQUwsRUFBb0MsSUFBQyxDQUFBLE9BQXJDLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FGRztJQUFBLENBaEJoQixDQUFBOztrQ0FBQTs7TUFSRixDQUFBOztBQUFBLEVBNEJBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsTUFBRCxHQUFBO1dBQ1gsSUFBQSxzQkFBQSxDQUF1QixNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQUEsRUFEVztFQUFBLENBNUJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/pigments/lib/tasks/scan-buffer-variables-handler.coffee
