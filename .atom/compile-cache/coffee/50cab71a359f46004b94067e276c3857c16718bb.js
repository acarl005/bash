(function() {
  var _;

  _ = require('underscore');

  module.exports = {
    splitStatements: function(code) {
      var iterator, statements;
      iterator = function(statements, currentCharacter, _memo, _context) {
        if (this.parenDepth == null) {
          this.parenDepth = 0;
        }
        if (currentCharacter === '(') {
          this.parenDepth += 1;
          this.inStatement = true;
        } else if (currentCharacter === ')') {
          this.parenDepth -= 1;
        }
        if (this.statement == null) {
          this.statement = '';
        }
        this.statement += currentCharacter;
        if (this.parenDepth === 0 && this.inStatement) {
          this.inStatement = false;
          statements.push(this.statement.trim());
          this.statement = '';
        }
        return statements;
      };
      statements = _.reduce(code.trim(), iterator, [], {});
      return statements;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvbGlzcC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsQ0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUFKLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUlFO0FBQUEsSUFBQSxlQUFBLEVBQWlCLFNBQUMsSUFBRCxHQUFBO0FBQ2YsVUFBQSxvQkFBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLFNBQUMsVUFBRCxFQUFhLGdCQUFiLEVBQStCLEtBQS9CLEVBQXNDLFFBQXRDLEdBQUE7O1VBQ1QsSUFBQyxDQUFBLGFBQWM7U0FBZjtBQUNBLFFBQUEsSUFBRyxnQkFBQSxLQUFvQixHQUF2QjtBQUNFLFVBQUEsSUFBQyxDQUFBLFVBQUQsSUFBZSxDQUFmLENBQUE7QUFBQSxVQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFEZixDQURGO1NBQUEsTUFHSyxJQUFHLGdCQUFBLEtBQW9CLEdBQXZCO0FBQ0gsVUFBQSxJQUFDLENBQUEsVUFBRCxJQUFlLENBQWYsQ0FERztTQUpMOztVQU9BLElBQUMsQ0FBQSxZQUFhO1NBUGQ7QUFBQSxRQVFBLElBQUMsQ0FBQSxTQUFELElBQWMsZ0JBUmQsQ0FBQTtBQVVBLFFBQUEsSUFBRyxJQUFDLENBQUEsVUFBRCxLQUFlLENBQWYsSUFBcUIsSUFBQyxDQUFBLFdBQXpCO0FBQ0UsVUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEtBQWYsQ0FBQTtBQUFBLFVBQ0EsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQUEsQ0FBaEIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBRmIsQ0FERjtTQVZBO0FBZUEsZUFBTyxVQUFQLENBaEJTO01BQUEsQ0FBWCxDQUFBO0FBQUEsTUFrQkEsVUFBQSxHQUFhLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFULEVBQXNCLFFBQXRCLEVBQWdDLEVBQWhDLEVBQW9DLEVBQXBDLENBbEJiLENBQUE7QUFvQkEsYUFBTyxVQUFQLENBckJlO0lBQUEsQ0FBakI7R0FSRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/script/lib/grammar-utils/lisp.coffee
