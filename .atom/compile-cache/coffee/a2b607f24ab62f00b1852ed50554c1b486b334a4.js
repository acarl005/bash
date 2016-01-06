(function() {
  var GitRepository, Minimatch, PathLoader, PathsChunkSize, async, fs, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  async = require('async');

  fs = require('fs');

  path = require('path');

  GitRepository = require('atom').GitRepository;

  Minimatch = require('minimatch').Minimatch;

  PathsChunkSize = 100;

  PathLoader = (function() {
    function PathLoader(rootPath, config) {
      var ignoreVcsIgnores, repo;
      this.rootPath = rootPath;
      this.timestamp = config.timestamp, this.sourceNames = config.sourceNames, ignoreVcsIgnores = config.ignoreVcsIgnores, this.traverseSymlinkDirectories = config.traverseSymlinkDirectories, this.ignoredNames = config.ignoredNames, this.knownPaths = config.knownPaths;
      if (this.knownPaths == null) {
        this.knownPaths = [];
      }
      this.paths = [];
      this.lostPaths = [];
      this.scannedPaths = [];
      this.repo = null;
      if (ignoreVcsIgnores) {
        repo = GitRepository.open(this.rootPath, {
          refreshOnWindowFocus: false
        });
        if ((repo != null ? repo.relativize(path.join(this.rootPath, 'test')) : void 0) === 'test') {
          this.repo = repo;
        }
      }
    }

    PathLoader.prototype.load = function(done) {
      return this.loadPath(this.rootPath, (function(_this) {
        return function() {
          var p, _i, _len, _ref, _ref1;
          _ref = _this.knownPaths;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            if (__indexOf.call(_this.scannedPaths, p) < 0 && p.indexOf(_this.rootPath) === 0) {
              _this.lostPaths.push(p);
            }
          }
          _this.flushPaths();
          if ((_ref1 = _this.repo) != null) {
            _ref1.destroy();
          }
          return done();
        };
      })(this));
    };

    PathLoader.prototype.isSource = function(loadedPath) {
      var relativePath, sourceName, _i, _len, _ref;
      relativePath = path.relative(this.rootPath, loadedPath);
      _ref = this.sourceNames;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sourceName = _ref[_i];
        if (sourceName.match(relativePath)) {
          return true;
        }
      }
    };

    PathLoader.prototype.isIgnored = function(loadedPath, stats) {
      var ignoredName, relativePath, _i, _len, _ref, _ref1;
      relativePath = path.relative(this.rootPath, loadedPath);
      if ((_ref = this.repo) != null ? _ref.isPathIgnored(relativePath) : void 0) {
        return true;
      } else {
        _ref1 = this.ignoredNames;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ignoredName = _ref1[_i];
          if (ignoredName.match(relativePath)) {
            return true;
          }
        }
        return false;
      }
    };

    PathLoader.prototype.isKnown = function(loadedPath) {
      return __indexOf.call(this.knownPaths, loadedPath) >= 0;
    };

    PathLoader.prototype.hasChanged = function(loadedPath, stats) {
      if (stats && (this.timestamp != null)) {
        return stats.ctime >= this.timestamp;
      } else {
        return false;
      }
    };

    PathLoader.prototype.pathLoaded = function(loadedPath, stats, done) {
      this.scannedPaths.push(loadedPath);
      if (this.isSource(loadedPath) && !this.isIgnored(loadedPath, stats)) {
        if (this.isKnown(loadedPath)) {
          if (this.hasChanged(loadedPath, stats)) {
            this.paths.push(loadedPath);
          }
        } else {
          this.paths.push(loadedPath);
        }
      } else {
        if (__indexOf.call(this.knownPaths, loadedPath) >= 0) {
          this.lostPaths.push(loadedPath);
        }
      }
      if (this.paths.length + this.lostPaths.length === PathsChunkSize) {
        this.flushPaths();
      }
      return done();
    };

    PathLoader.prototype.flushPaths = function() {
      if (this.paths.length) {
        emit('load-paths:paths-found', this.paths);
      }
      if (this.lostPaths.length) {
        emit('load-paths:paths-lost', this.lostPaths);
      }
      this.paths = [];
      return this.lostPaths = [];
    };

    PathLoader.prototype.loadPath = function(pathToLoad, done) {
      if (this.isIgnored(pathToLoad)) {
        return done();
      }
      return fs.lstat(pathToLoad, (function(_this) {
        return function(error, stats) {
          if (error != null) {
            return done();
          }
          if (stats.isSymbolicLink()) {
            return fs.stat(pathToLoad, function(error, stats) {
              if (error != null) {
                return done();
              }
              if (stats.isFile()) {
                return _this.pathLoaded(pathToLoad, stats, done);
              } else if (stats.isDirectory()) {
                if (_this.traverseSymlinkDirectories) {
                  return _this.loadFolder(pathToLoad, done);
                } else {
                  return done();
                }
              }
            });
          } else if (stats.isDirectory()) {
            return _this.loadFolder(pathToLoad, done);
          } else if (stats.isFile()) {
            return _this.pathLoaded(pathToLoad, stats, done);
          } else {
            return done();
          }
        };
      })(this));
    };

    PathLoader.prototype.loadFolder = function(folderPath, done) {
      return fs.readdir(folderPath, (function(_this) {
        return function(error, children) {
          if (children == null) {
            children = [];
          }
          return async.each(children, function(childName, next) {
            return _this.loadPath(path.join(folderPath, childName), next);
          }, done);
        };
      })(this));
    };

    return PathLoader;

  })();

  module.exports = function(config) {
    var error, ignore, newConf, source, _i, _j, _len, _len1, _ref, _ref1;
    newConf = {
      ignoreVcsIgnores: config.ignoreVcsIgnores,
      traverseSymlinkDirectories: config.traverseSymlinkDirectories,
      knownPaths: config.knownPaths,
      ignoredNames: [],
      sourceNames: []
    };
    if (config.timestamp != null) {
      newConf.timestamp = new Date(Date.parse(config.timestamp));
    }
    _ref = config.sourceNames;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      source = _ref[_i];
      if (source) {
        try {
          newConf.sourceNames.push(new Minimatch(source, {
            matchBase: true,
            dot: true
          }));
        } catch (_error) {
          error = _error;
          console.warn("Error parsing source pattern (" + source + "): " + error.message);
        }
      }
    }
    _ref1 = config.ignoredNames;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      ignore = _ref1[_j];
      if (ignore) {
        try {
          newConf.ignoredNames.push(new Minimatch(ignore, {
            matchBase: true,
            dot: true
          }));
        } catch (_error) {
          error = _error;
          console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
        }
      }
    }
    return async.each(config.paths, function(rootPath, next) {
      return new PathLoader(rootPath, newConf).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdGFza3MvbG9hZC1wYXRocy1oYW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxRUFBQTtJQUFBLHFKQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0MsZ0JBQWlCLE9BQUEsQ0FBUSxNQUFSLEVBQWpCLGFBSEQsQ0FBQTs7QUFBQSxFQUlDLFlBQWEsT0FBQSxDQUFRLFdBQVIsRUFBYixTQUpELENBQUE7O0FBQUEsRUFNQSxjQUFBLEdBQWlCLEdBTmpCLENBQUE7O0FBQUEsRUFRTTtBQUNVLElBQUEsb0JBQUUsUUFBRixFQUFZLE1BQVosR0FBQTtBQUNaLFVBQUEsc0JBQUE7QUFBQSxNQURhLElBQUMsQ0FBQSxXQUFBLFFBQ2QsQ0FBQTtBQUFBLE1BQUMsSUFBQyxDQUFBLG1CQUFBLFNBQUYsRUFBYSxJQUFDLENBQUEscUJBQUEsV0FBZCxFQUEyQiwwQkFBQSxnQkFBM0IsRUFBNkMsSUFBQyxDQUFBLG9DQUFBLDBCQUE5QyxFQUEwRSxJQUFDLENBQUEsc0JBQUEsWUFBM0UsRUFBeUYsSUFBQyxDQUFBLG9CQUFBLFVBQTFGLENBQUE7O1FBRUEsSUFBQyxDQUFBLGFBQWM7T0FGZjtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUhULENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxTQUFELEdBQWEsRUFKYixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsWUFBRCxHQUFnQixFQUxoQixDQUFBO0FBQUEsTUFPQSxJ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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/tasks/load-paths-handler.coffee
