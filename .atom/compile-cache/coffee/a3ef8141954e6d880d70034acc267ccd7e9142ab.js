(function() {
  var GrammarUtils;

  GrammarUtils = require('../../lib/grammar-utils');

  describe('GrammarUtils', function() {
    return describe('Lisp', function() {
      var toStatements;
      toStatements = GrammarUtils.Lisp.splitStatements;
      it('returns empty array for empty code', function() {
        var code;
        code = '';
        return expect(toStatements(code)).toEqual([]);
      });
      it('does not split single statement', function() {
        var code;
        code = '(print "dummy")';
        return expect(toStatements(code)).toEqual([code]);
      });
      it('splits two simple statements', function() {
        var code;
        code = '(print "dummy")(print "statement")';
        return expect(toStatements(code)).toEqual(['(print "dummy")', '(print "statement")']);
      });
      it('splits two simple statements in many lines', function() {
        var code;
        code = '(print "dummy")  \n\n  (print "statement")';
        return expect(toStatements(code)).toEqual(['(print "dummy")', '(print "statement")']);
      });
      it('does not split single line complex statement', function() {
        var code;
        code = '(when t(setq a 2)(+ i 1))';
        return expect(toStatements(code)).toEqual(['(when t(setq a 2)(+ i 1))']);
      });
      it('does not split multi line complex statement', function() {
        var code;
        code = '(when t(setq a 2)  \n \t (+ i 1))';
        return expect(toStatements(code)).toEqual(['(when t(setq a 2)  \n \t (+ i 1))']);
      });
      it('splits single line complex statements', function() {
        var code;
        code = '(when t(setq a 2)(+ i 1))(when t(setq a 5)(+ i 3))';
        return expect(toStatements(code)).toEqual(['(when t(setq a 2)(+ i 1))', '(when t(setq a 5)(+ i 3))']);
      });
      return it('splits multi line complex statements', function() {
        var code;
        code = '(when t(\nsetq a 2)(+ i 1))   \n\t (when t(\n\t  setq a 5)(+ i 3))';
        return expect(toStatements(code)).toEqual(['(when t(\nsetq a 2)(+ i 1))', '(when t(\n\t  setq a 5)(+ i 3))']);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvc3BlYy9ncmFtbWFyLXV0aWxzL2xpc3Atc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEseUJBQVIsQ0FBZixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQSxHQUFBO1dBQ3ZCLFFBQUEsQ0FBUyxNQUFULEVBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsWUFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLFlBQVksQ0FBQyxJQUFJLENBQUMsZUFBakMsQ0FBQTtBQUFBLE1BRUEsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxFQUFQLENBQUE7ZUFDQSxNQUFBLENBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUEwQixDQUFDLE9BQTNCLENBQW1DLEVBQW5DLEVBRnVDO01BQUEsQ0FBekMsQ0FGQSxDQUFBO0FBQUEsTUFNQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQSxHQUFBO0FBQ3BDLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLGlCQUFQLENBQUE7ZUFDQSxNQUFBLENBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUEwQixDQUFDLE9BQTNCLENBQW1DLENBQUMsSUFBRCxDQUFuQyxFQUZvQztNQUFBLENBQXRDLENBTkEsQ0FBQTtBQUFBLE1BVUEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxvQ0FBUCxDQUFBO2VBQ0EsTUFBQSxDQUFPLFlBQUEsQ0FBYSxJQUFiLENBQVAsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxDQUFDLGlCQUFELEVBQW9CLHFCQUFwQixDQUFuQyxFQUZpQztNQUFBLENBQW5DLENBVkEsQ0FBQTtBQUFBLE1BY0EsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyw0Q0FBUCxDQUFBO2VBQ0EsTUFBQSxDQUFPLFlBQUEsQ0FBYSxJQUFiLENBQVAsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxDQUFDLGlCQUFELEVBQW9CLHFCQUFwQixDQUFuQyxFQUYrQztNQUFBLENBQWpELENBZEEsQ0FBQTtBQUFBLE1Ba0JBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sMkJBQVAsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxZQUFBLENBQWEsSUFBYixDQUFQLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsQ0FBQywyQkFBRCxDQUFuQyxFQUZpRDtNQUFBLENBQW5ELENBbEJBLENBQUE7QUFBQSxNQXNCQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQSxHQUFBO0FBQ2hELFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLG1DQUFQLENBQUE7ZUFDQSxNQUFBLENBQU8sWUFBQSxDQUFhLElBQWIsQ0FBUCxDQUEwQixDQUFDLE9BQTNCLENBQW1DLENBQUMsbUNBQUQsQ0FBbkMsRUFGZ0Q7TUFBQSxDQUFsRCxDQXRCQSxDQUFBO0FBQUEsTUEwQkEsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxvREFBUCxDQUFBO2VBQ0EsTUFBQSxDQUFPLFlBQUEsQ0FBYSxJQUFiLENBQVAsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxDQUFDLDJCQUFELEVBQThCLDJCQUE5QixDQUFuQyxFQUYwQztNQUFBLENBQTVDLENBMUJBLENBQUE7YUE4QkEsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUEsR0FBQTtBQUN6QyxZQUFBLElBQUE7QUFBQSxRQUFBLElBQUEsR0FBTyxvRUFBUCxDQUFBO2VBQ0EsTUFBQSxDQUFPLFlBQUEsQ0FBYSxJQUFiLENBQVAsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxDQUFDLDZCQUFELEVBQWdDLGlDQUFoQyxDQUFuQyxFQUZ5QztNQUFBLENBQTNDLEVBL0JlO0lBQUEsQ0FBakIsRUFEdUI7RUFBQSxDQUF6QixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/script/spec/grammar-utils/lisp-spec.coffee
