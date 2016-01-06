(function() {
  var CodeContext, OperatingSystem, grammarMap;

  CodeContext = require('../lib/code-context');

  OperatingSystem = require('../lib/grammar-utils/operating-system');

  grammarMap = require('../lib/grammars');

  describe('grammarMap', function() {
    beforeEach(function() {
      this.codeContext = new CodeContext('test.txt', '/tmp/test.txt', null);
      this.dummyTextSource = {};
      return this.dummyTextSource.getText = function() {
        return "";
      };
    });
    it("has a command and an args function set for each grammar's mode", function() {
      var argList, commandContext, lang, mode, modes, _results;
      this.codeContext.textSource = this.dummyTextSource;
      _results = [];
      for (lang in grammarMap) {
        modes = grammarMap[lang];
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (mode in modes) {
            commandContext = modes[mode];
            expect(commandContext.command).toBeDefined();
            argList = commandContext.args(this.codeContext);
            _results1.push(expect(argList).toBeDefined());
          }
          return _results1;
        }).call(this));
      }
      return _results;
    });
    return describe('Operating system specific runners', function() {
      beforeEach(function() {
        this._originalPlatform = OperatingSystem.platform;
        return this.reloadGrammar = function() {
          delete require.cache[require.resolve('../lib/grammars.coffee')];
          return grammarMap = require('../lib/grammars.coffee');
        };
      });
      afterEach(function() {
        OperatingSystem.platform = this._originalPlatform;
        return this.reloadGrammar();
      });
      describe('C', function() {
        it('returns the appropriate File Based runner on Mac OS X', function() {
          var args, fileBasedRunner, grammar;
          OperatingSystem.platform = function() {
            return 'darwin';
          };
          this.reloadGrammar();
          grammar = grammarMap['C'];
          fileBasedRunner = grammar['File Based'];
          args = fileBasedRunner.args(this.codeContext);
          expect(fileBasedRunner.command).toEqual('bash');
          expect(args[0]).toEqual('-c');
          return expect(args[1]).toMatch(/^xcrun clang/);
        });
        return it('is not defined on other operating systems', function() {
          var grammar;
          OperatingSystem.platform = function() {
            return 'win32';
          };
          this.reloadGrammar();
          grammar = grammarMap['C'];
          return expect(grammar).toBe(void 0);
        });
      });
      describe('C++', function() {
        it('returns the appropriate File Based runner on Mac OS X', function() {
          var args, fileBasedRunner, grammar;
          OperatingSystem.platform = function() {
            return 'darwin';
          };
          this.reloadGrammar();
          grammar = grammarMap['C++'];
          fileBasedRunner = grammar['File Based'];
          args = fileBasedRunner.args(this.codeContext);
          expect(fileBasedRunner.command).toEqual('bash');
          expect(args[0]).toEqual('-c');
          return expect(args[1]).toMatch(/^xcrun clang\+\+/);
        });
        return it('is not defined on other operating systems', function() {
          var grammar;
          OperatingSystem.platform = function() {
            return 'win32';
          };
          this.reloadGrammar();
          grammar = grammarMap['C++'];
          return expect(grammar).toBe(void 0);
        });
      });
      describe('F#', function() {
        it('returns "fsi" as command for File Based runner on Windows', function() {
          var args, fileBasedRunner, grammar;
          OperatingSystem.platform = function() {
            return 'win32';
          };
          this.reloadGrammar();
          grammar = grammarMap['F#'];
          fileBasedRunner = grammar['File Based'];
          args = fileBasedRunner.args(this.codeContext);
          expect(fileBasedRunner.command).toEqual('fsi');
          expect(args[0]).toEqual('--exec');
          return expect(args[1]).toEqual(this.codeContext.filepath);
        });
        return it('returns "fsharpi" as command for File Based runner when platform is not Windows', function() {
          var args, fileBasedRunner, grammar;
          OperatingSystem.platform = function() {
            return 'darwin';
          };
          this.reloadGrammar();
          grammar = grammarMap['F#'];
          fileBasedRunner = grammar['File Based'];
          args = fileBasedRunner.args(this.codeContext);
          expect(fileBasedRunner.command).toEqual('fsharpi');
          expect(args[0]).toEqual('--exec');
          return expect(args[1]).toEqual(this.codeContext.filepath);
        });
      });
      describe('Objective-C', function() {
        it('returns the appropriate File Based runner on Mac OS X', function() {
          var args, fileBasedRunner, grammar;
          OperatingSystem.platform = function() {
            return 'darwin';
          };
          this.reloadGrammar();
          grammar = grammarMap['Objective-C'];
          fileBasedRunner = grammar['File Based'];
          args = fileBasedRunner.args(this.codeContext);
          expect(fileBasedRunner.command).toEqual('bash');
          expect(args[0]).toEqual('-c');
          return expect(args[1]).toMatch(/^xcrun clang/);
        });
        return it('is not defined on other operating systems', function() {
          var grammar;
          OperatingSystem.platform = function() {
            return 'win32';
          };
          this.reloadGrammar();
          grammar = grammarMap['Objective-C'];
          return expect(grammar).toBe(void 0);
        });
      });
      return describe('Objective-C++', function() {
        it('returns the appropriate File Based runner on Mac OS X', function() {
          var args, fileBasedRunner, grammar;
          OperatingSystem.platform = function() {
            return 'darwin';
          };
          this.reloadGrammar();
          grammar = grammarMap['Objective-C++'];
          fileBasedRunner = grammar['File Based'];
          args = fileBasedRunner.args(this.codeContext);
          expect(fileBasedRunner.command).toEqual('bash');
          expect(args[0]).toEqual('-c');
          return expect(args[1]).toMatch(/^xcrun clang\+\+/);
        });
        return it('is not defined on other operating systems', function() {
          var grammar;
          OperatingSystem.platform = function() {
            return 'win32';
          };
          this.reloadGrammar();
          grammar = grammarMap['Objective-C++'];
          return expect(grammar).toBe(void 0);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvc3BlYy9ncmFtbWFycy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVIsQ0FBZCxDQUFBOztBQUFBLEVBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEsdUNBQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsaUJBQVIsQ0FGYixDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksVUFBWixFQUF3QixlQUF4QixFQUF5QyxJQUF6QyxDQUFuQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsZUFBRCxHQUFtQixFQUZuQixDQUFBO2FBR0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxPQUFqQixHQUEyQixTQUFBLEdBQUE7ZUFBRyxHQUFIO01BQUEsRUFKbEI7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBTUEsRUFBQSxDQUFHLGdFQUFILEVBQXFFLFNBQUEsR0FBQTtBQUNuRSxVQUFBLG9EQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLFVBQWIsR0FBMEIsSUFBQyxDQUFBLGVBQTNCLENBQUE7QUFDQTtXQUFBLGtCQUFBO2lDQUFBO0FBQ0U7O0FBQUE7ZUFBQSxhQUFBO3lDQUFBO0FBQ0UsWUFBQSxNQUFBLENBQU8sY0FBYyxDQUFDLE9BQXRCLENBQThCLENBQUMsV0FBL0IsQ0FBQSxDQUFBLENBQUE7QUFBQSxZQUNBLE9BQUEsR0FBVSxjQUFjLENBQUMsSUFBZixDQUFvQixJ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

//# sourceURL=/home/andy/.atom/packages/script/spec/grammars-spec.coffee
