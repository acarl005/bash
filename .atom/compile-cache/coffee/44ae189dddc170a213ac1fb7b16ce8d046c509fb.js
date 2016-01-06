(function() {
  var CodeContext;

  CodeContext = require('../lib/code-context');

  describe('CodeContext', function() {
    beforeEach(function() {
      this.codeContext = new CodeContext('test.txt', '/tmp/test.txt', null);
      this.dummyTextSource = {};
      return this.dummyTextSource.getText = function() {
        return "print 'hello world!'";
      };
    });
    describe('fileColonLine when lineNumber is not set', function() {
      it('returns the full filepath when fullPath is truthy', function() {
        expect(this.codeContext.fileColonLine()).toMatch("/tmp/test.txt");
        return expect(this.codeContext.fileColonLine(true)).toMatch("/tmp/test.txt");
      });
      return it('returns only the filename and line number when fullPath is falsy', function() {
        return expect(this.codeContext.fileColonLine(false)).toMatch("test.txt");
      });
    });
    describe('fileColonLine when lineNumber is set', function() {
      it('returns the full filepath when fullPath is truthy', function() {
        this.codeContext.lineNumber = 42;
        expect(this.codeContext.fileColonLine()).toMatch("/tmp/test.txt");
        return expect(this.codeContext.fileColonLine(true)).toMatch("/tmp/test.txt");
      });
      return it('returns only the filename and line number when fullPath is falsy', function() {
        this.codeContext.lineNumber = 42;
        return expect(this.codeContext.fileColonLine(false)).toMatch("test.txt");
      });
    });
    describe('getCode', function() {
      it('returns undefined if no textSource is available', function() {
        return expect(this.codeContext.getCode()).toBe(void 0);
      });
      it('returns a string prepended with newlines when prependNewlines is truthy', function() {
        var code;
        this.codeContext.textSource = this.dummyTextSource;
        this.codeContext.lineNumber = 3;
        code = this.codeContext.getCode(true);
        expect(typeof code).toEqual('string');
        return expect(code).toMatch("\n\nprint 'hello world!'");
      });
      return it('returns the text from the textSource when available', function() {
        var code;
        this.codeContext.textSource = this.dummyTextSource;
        code = this.codeContext.getCode();
        expect(typeof code).toEqual('string');
        return expect(code).toMatch("print 'hello world!'");
      });
    });
    describe('shebangCommand when no shebang was found', function() {
      return it('returns undefined when no shebang is found', function() {
        var firstLine, lines;
        lines = this.dummyTextSource.getText();
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommand()).toBe(void 0);
      });
    });
    describe('shebangCommand when a shebang was found', function() {
      it('returns the command from the shebang', function() {
        var firstLine, lines;
        lines = "#!/bin/bash\necho 'hello from bash!'";
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommand()).toMatch('bash');
      });
      it('returns /usr/bin/env as the command if applicable', function() {
        var firstLine, lines;
        lines = "#!/usr/bin/env ruby -w\nputs 'hello from ruby!'";
        firstLine = lines.split("\n")[0];
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommand()).toMatch('env');
      });
      return it('returns a command with non-alphabet characters', function() {
        var firstLine, lines;
        lines = "#!/usr/bin/python2.7\nprint 'hello from python!'";
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommand()).toMatch('python2.7');
      });
    });
    describe('shebangCommandArgs when no shebang was found', function() {
      return it('returns [] when no shebang is found', function() {
        var firstLine, lines;
        lines = this.dummyTextSource.getText();
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommandArgs()).toMatch([]);
      });
    });
    return describe('shebangCommandArgs when a shebang was found', function() {
      it('returns the command from the shebang', function() {
        var firstLine, lines;
        lines = "#!/bin/bash\necho 'hello from bash!'";
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommandArgs()).toMatch([]);
      });
      it('returns the true command as the first argument when /usr/bin/env is used', function() {
        var args, firstLine, lines;
        lines = "#!/usr/bin/env ruby -w\nputs 'hello from ruby!'";
        firstLine = lines.split("\n")[0];
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        args = this.codeContext.shebangCommandArgs();
        expect(args[0]).toMatch('ruby');
        return expect(args).toMatch(['ruby', '-w']);
      });
      return it('returns the command args when the command had non-alphabet characters', function() {
        var firstLine, lines;
        lines = "#!/usr/bin/python2.7\nprint 'hello from python!'";
        firstLine = lines.split("\n")[0];
        if (firstLine.match(/^#!/)) {
          this.codeContext.shebang = firstLine;
        }
        return expect(this.codeContext.shebangCommandArgs()).toMatch([]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvc3BlYy9jb2RlLWNvbnRleHQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FBZCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksVUFBWixFQUF3QixlQUF4QixFQUF5QyxJQUF6QyxDQUFuQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsZUFBRCxHQUFtQixFQUZuQixDQUFBO2FBR0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxPQUFqQixHQUEyQixTQUFBLEdBQUE7ZUFDekIsdUJBRHlCO01BQUEsRUFKbEI7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBT0EsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtBQUNuRCxNQUFBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBLEdBQUE7QUFDdEQsUUFBQSxNQUFBLENBQU8sSUFBQyxDQUFBLFdBQVcsQ0FBQyxhQUFiLENBQUEsQ0FBUCxDQUFvQyxDQUFDLE9BQXJDLENBQTZDLGVBQTdDLENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxJQUFDLENBQUEsV0FBVyxDQUFDLGFBQWIsQ0FBMkIsSUFBM0IsQ0FBUCxDQUF3QyxDQUFDLE9BQXpDLENBQWlELGVBQWpELEVBRnNEO01BQUEsQ0FBeEQsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLGtFQUFILEVBQXVFLFNBQUEsR0FBQTtlQUNyRSxNQUFBLENBQU8sSUFBQyxDQUFBLFdBQVcsQ0FBQyxhQUFi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

//# sourceURL=/home/andy/.atom/packages/script/spec/code-context-spec.coffee
