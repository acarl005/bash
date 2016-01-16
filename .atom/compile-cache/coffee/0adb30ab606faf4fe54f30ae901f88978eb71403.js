(function() {
  var scopesByFenceName;

  scopesByFenceName = {
    'sh': 'source.shell',
    'bash': 'source.shell',
    'c': 'source.c',
    'c++': 'source.cpp',
    'cpp': 'source.cpp',
    'coffee': 'source.coffee',
    'coffeescript': 'source.coffee',
    'coffee-script': 'source.coffee',
    'cs': 'source.cs',
    'csharp': 'source.cs',
    'css': 'source.css',
    'scss': 'source.css.scss',
    'sass': 'source.sass',
    'erlang': 'source.erl',
    'go': 'source.go',
    'html': 'text.html.basic',
    'java': 'source.java',
    'js': 'source.js',
    'javascript': 'source.js',
    'json': 'source.json',
    'less': 'source.less',
    'mustache': 'text.html.mustache',
    'objc': 'source.objc',
    'objective-c': 'source.objc',
    'php': 'text.html.php',
    'py': 'source.python',
    'python': 'source.python',
    'rb': 'source.ruby',
    'ruby': 'source.ruby',
    'text': 'text.plain',
    'toml': 'source.toml',
    'xml': 'text.xml',
    'yaml': 'source.yaml',
    'yml': 'source.yaml'
  };

  module.exports = {
    scopeForFenceName: function(fenceName) {
      var _ref;
      return (_ref = scopesByFenceName[fenceName]) != null ? _ref : "source." + fenceName;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9tYXJrZG93bi1wcmV2aWV3L2xpYi9leHRlbnNpb24taGVscGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFBLGlCQUFBLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxjQUFOO0FBQUEsSUFDQSxNQUFBLEVBQVEsY0FEUjtBQUFBLElBRUEsR0FBQSxFQUFLLFVBRkw7QUFBQSxJQUdBLEtBQUEsRUFBTyxZQUhQO0FBQUEsSUFJQSxLQUFBLEVBQU8sWUFKUDtBQUFBLElBS0EsUUFBQSxFQUFVLGVBTFY7QUFBQSxJQU1BLGNBQUEsRUFBZ0IsZUFOaEI7QUFBQSxJQU9BLGVBQUEsRUFBaUIsZUFQakI7QUFBQSxJQVFBLElBQUEsRUFBTSxXQVJOO0FBQUEsSUFTQSxRQUFBLEVBQVUsV0FUVjtBQUFBLElBVUEsS0FBQSxFQUFPLFlBVlA7QUFBQSxJQVdBLE1BQUEsRUFBUSxpQkFYUjtBQUFBLElBWUEsTUFBQSxFQUFRLGFBWlI7QUFBQSxJQWFBLFFBQUEsRUFBVSxZQWJWO0FBQUEsSUFjQSxJQUFBLEVBQU0sV0FkTjtBQUFBLElBZUEsTUFBQSxFQUFRLGlCQWZSO0FBQUEsSUFnQkEsTUFBQSxFQUFRLGFBaEJSO0FBQUEsSUFpQkEsSUFBQSxFQUFNLFdBakJOO0FBQUEsSUFrQkEsWUFBQSxFQUFjLFdBbEJkO0FBQUEsSUFtQkEsTUFBQSxFQUFRLGFBbkJSO0FBQUEsSUFvQkEsTUFBQSxFQUFRLGFBcEJSO0FBQUEsSUFxQkEsVUFBQSxFQUFZLG9CQXJCWjtBQUFBLElBc0JBLE1BQUEsRUFBUSxhQXRCUjtBQUFBLElBdUJBLGFBQUEsRUFBZSxhQXZCZjtBQUFBLElBd0JBLEtBQUEsRUFBTyxlQXhCUDtBQUFBLElBeUJBLElBQUEsRUFBTSxlQXpCTjtBQUFBLElBMEJBLFFBQUEsRUFBVSxlQTFCVjtBQUFBLElBMkJBLElBQUEsRUFBTSxhQTNCTjtBQUFBLElBNEJBLE1BQUEsRUFBUSxhQTVCUjtBQUFBLElBNkJBLE1BQUEsRUFBUSxZQTdCUjtBQUFBLElBOEJBLE1BQUEsRUFBUSxhQTlCUjtBQUFBLElBK0JBLEtBQUEsRUFBTyxVQS9CUDtBQUFBLElBZ0NBLE1BQUEsRUFBUSxhQWhDUjtBQUFBLElBaUNBLEtBQUEsRUFBTyxhQWpDUDtHQURGLENBQUE7O0FBQUEsRUFvQ0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsaUJBQUEsRUFBbUIsU0FBQyxTQUFELEdBQUE7QUFDakIsVUFBQSxJQUFBO29FQUFnQyxTQUFBLEdBQVMsVUFEeEI7SUFBQSxDQUFuQjtHQXJDRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/markdown-preview/lib/extension-helper.coffee
