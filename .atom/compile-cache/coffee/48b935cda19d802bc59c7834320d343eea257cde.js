(function() {
  var CodeContextBuilder;

  CodeContextBuilder = require('../lib/code-context-builder');

  describe('CodeContextBuilder', function() {
    beforeEach(function() {
      this.editorMock = {
        getTitle: function() {},
        getPath: function() {},
        getText: function() {},
        getLastSelection: function() {
          return {
            isEmpty: function() {
              return false;
            }
          };
        },
        getGrammar: function() {
          return {
            name: 'JavaScript'
          };
        },
        getLastCursor: function() {},
        save: function() {}
      };
      spyOn(this.editorMock, 'getTitle').andReturn('file.js');
      spyOn(this.editorMock, 'getPath').andReturn('path/to/file.js');
      spyOn(this.editorMock, 'getText').andReturn('console.log("hello")\n');
      return this.codeContextBuilder = new CodeContextBuilder;
    });
    describe('initCodeContext', function() {
      it('sets correct text source for empty selection', function() {
        var codeContext, selection;
        selection = {
          isEmpty: function() {
            return true;
          }
        };
        spyOn(this.editorMock, 'getLastSelection').andReturn(selection);
        codeContext = this.codeContextBuilder.initCodeContext(this.editorMock);
        expect(codeContext.textSource).toEqual(this.editorMock);
        expect(codeContext.filename).toEqual('file.js');
        return expect(codeContext.filepath).toEqual('path/to/file.js');
      });
      it('sets correct text source for non-empty selection', function() {
        var codeContext, selection;
        selection = {
          isEmpty: function() {
            return false;
          }
        };
        spyOn(this.editorMock, 'getLastSelection').andReturn(selection);
        codeContext = this.codeContextBuilder.initCodeContext(this.editorMock);
        expect(codeContext.textSource).toEqual(selection);
        return expect(codeContext.selection).toEqual(selection);
      });
      return it('sets correct lang', function() {
        var codeContext;
        codeContext = this.codeContextBuilder.initCodeContext(this.editorMock);
        return expect(codeContext.lang).toEqual('JavaScript');
      });
    });
    return describe('buildCodeContext', function() {
      var argType, _i, _len, _ref, _results;
      _ref = ['Selection Based', 'Line Number Based'];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        argType = _ref[_i];
        _results.push(it("sets lineNumber with screenRow + 1 when " + argType, function() {
          var codeContext, cursor;
          cursor = {
            getScreenRow: function() {
              return 1;
            }
          };
          spyOn(this.editorMock, 'getLastCursor').andReturn(cursor);
          codeContext = this.codeContextBuilder.buildCodeContext(this.editorMock, argType);
          expect(codeContext.argType).toEqual(argType);
          return expect(codeContext.lineNumber).toEqual(2);
        }));
      }
      return _results;
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvc3BlYy9jb2RlLWNvbnRleHQtYnVpbGRlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSw2QkFBUixDQUFyQixDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtBQUM3QixJQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxVQUFELEdBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUEsQ0FBVjtBQUFBLFFBQ0EsT0FBQSxFQUFTLFNBQUEsR0FBQSxDQURUO0FBQUEsUUFFQSxPQUFBLEVBQVMsU0FBQSxHQUFBLENBRlQ7QUFBQSxRQUdBLGdCQUFBLEVBQWtCLFNBQUEsR0FBQTtpQkFDaEI7QUFBQSxZQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUE7cUJBQ1AsTUFETztZQUFBLENBQVQ7WUFEZ0I7UUFBQSxDQUhsQjtBQUFBLFFBTUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtpQkFDVjtBQUFBLFlBQUEsSUFBQSxFQUFNLFlBQU47WUFEVTtRQUFBLENBTlo7QUFBQSxRQVFBLGFBQUEsRUFBZSxTQUFBLEdBQUEsQ0FSZjtBQUFBLFFBU0EsSUFBQSxFQUFNLFNBQUEsR0FBQSxDQVROO09BREYsQ0FBQTtBQUFBLE1BWUEsS0FBQSxDQUFNLElBQUMsQ0FBQSxVQUFQLEVBQW1CLFVBQW5CLENBQThCLENBQUMsU0FBL0IsQ0FBeUMsU0FBekMsQ0FaQSxDQUFBO0FBQUEsTUFhQSxLQUFBLENBQU0sSUFBQyxDQUFBLFVBQVAsRUFBbUIsU0FBbkIsQ0FBNkIsQ0FBQyxTQUE5QixDQUF3QyxpQkFBeEMsQ0FiQSxDQUFBO0FBQUEs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

//# sourceURL=/home/andy/.atom/packages/script/spec/code-context-builder-spec.coffee
