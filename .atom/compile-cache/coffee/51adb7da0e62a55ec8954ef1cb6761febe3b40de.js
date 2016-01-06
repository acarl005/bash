(function() {
  var ExpressionsRegistry;

  ExpressionsRegistry = require('../lib/expressions-registry');

  describe('ExpressionsRegistry', function() {
    var Dummy, registry, _ref;
    _ref = [], registry = _ref[0], Dummy = _ref[1];
    beforeEach(function() {
      Dummy = (function() {
        function Dummy(_arg) {
          this.name = _arg.name, this.regexpString = _arg.regexpString, this.priority = _arg.priority, this.scopes = _arg.scopes, this.handle = _arg.handle;
        }

        return Dummy;

      })();
      return registry = new ExpressionsRegistry(Dummy);
    });
    describe('::createExpression', function() {
      return describe('called with enough data', function() {
        return it('creates a new expression of this registry expressions type', function() {
          var expression;
          expression = registry.createExpression('dummy', 'foo');
          expect(expression.constructor).toBe(Dummy);
          return expect(registry.getExpressions()).toEqual([expression]);
        });
      });
    });
    describe('::addExpression', function() {
      return it('adds a previously created expression in the registry', function() {
        var expression;
        expression = new Dummy({
          name: 'bar'
        });
        registry.addExpression(expression);
        expect(registry.getExpression('bar')).toBe(expression);
        return expect(registry.getExpressions()).toEqual([expression]);
      });
    });
    describe('::getExpressions', function() {
      return it('returns the expression based on their priority', function() {
        var expression1, expression2, expression3;
        expression1 = registry.createExpression('dummy1', '', 2);
        expression2 = registry.createExpression('dummy2', '', 0);
        expression3 = registry.createExpression('dummy3', '', 1);
        return expect(registry.getExpressions()).toEqual([expression1, expression3, expression2]);
      });
    });
    describe('::removeExpression', function() {
      return it('removes an expression with its name', function() {
        registry.createExpression('dummy', 'foo');
        registry.removeExpression('dummy');
        return expect(registry.getExpressions()).toEqual([]);
      });
    });
    describe('::serialize', function() {
      return it('serializes the registry with the function content', function() {
        var serialized;
        registry.createExpression('dummy', 'foo');
        registry.createExpression('dummy2', 'bar', function(a, b, c) {
          return a + b - c;
        });
        serialized = registry.serialize();
        expect(serialized.regexpString).toEqual('(foo)|(bar)');
        expect(serialized.expressions.dummy).toEqual({
          name: 'dummy',
          regexpString: 'foo',
          handle: void 0,
          priority: 0,
          scopes: ['*']
        });
        return expect(serialized.expressions.dummy2).toEqual({
          name: 'dummy2',
          regexpString: 'bar',
          handle: registry.getExpression('dummy2').handle.toString(),
          priority: 0,
          scopes: ['*']
        });
      });
    });
    return describe('.deserialize', function() {
      return it('deserializes the provided expressions using the specified model', function() {
        var deserialized, serialized;
        serialized = {
          regexpString: 'foo|bar',
          expressions: {
            dummy: {
              name: 'dummy',
              regexpString: 'foo',
              handle: 'function (a,b,c) { return a + b - c; }',
              priority: 0,
              scopes: ['*']
            }
          }
        };
        deserialized = ExpressionsRegistry.deserialize(serialized, Dummy);
        expect(deserialized.getRegExp()).toEqual('foo|bar');
        expect(deserialized.getExpression('dummy').name).toEqual('dummy');
        expect(deserialized.getExpression('dummy').regexpString).toEqual('foo');
        return expect(deserialized.getExpression('dummy').handle(1, 2, 3)).toEqual(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2V4cHJlc3Npb25zLXJlZ2lzdHJ5LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLDZCQUFSLENBQXRCLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFFBQUEscUJBQUE7QUFBQSxJQUFBLE9BQW9CLEVBQXBCLEVBQUMsa0JBQUQsRUFBVyxlQUFYLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFNO0FBQ1MsUUFBQSxlQUFDLElBQUQsR0FBQTtBQUF1RCxVQUFyRCxJQUFDLENBQUEsWUFBQSxNQUFNLElBQUMsQ0FBQSxvQkFBQSxjQUFjLElBQUMsQ0FBQSxnQkFBQSxVQUFVLElBQUMsQ0FBQSxjQUFBLFFBQVEsSUFBQyxDQUFBLGNBQUEsTUFBVSxDQUF2RDtRQUFBLENBQWI7O3FCQUFBOztVQURGLENBQUE7YUFHQSxRQUFBLEdBQWUsSUFBQSxtQkFBQSxDQUFvQixLQUFwQixFQUpOO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVFBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7YUFDN0IsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUEsR0FBQTtlQUNsQyxFQUFBLENBQUcsNERBQUgsRUFBaUUsU0FBQSxHQUFBO0FBQy9ELGNBQUEsVUFBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxLQUFuQyxDQUFiLENBQUE7QUFBQSxVQUVBLE1BQUEsQ0FBTyxVQUFVLENBQUMsV0FBbEIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxL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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/expressions-registry-spec.coffee
