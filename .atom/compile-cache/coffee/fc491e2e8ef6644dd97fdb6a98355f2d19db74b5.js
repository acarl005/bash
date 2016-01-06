(function() {
  var linkPaths, regex, template;

  regex = /((?:\w:)?\/?(?:[-\w.]+\/)*[-\w.]+):(\d+)(?::(\d+))?/g;

  template = '<a class="-linked-path" data-path="$1" data-line="$2" data-column="$3">$&</a>';

  module.exports = linkPaths = function(lines) {
    return lines.replace(regex, template);
  };

  linkPaths.listen = function(parentView) {
    return parentView.on('click', '.-linked-path', function(event) {
      var column, el, line, path, _ref;
      el = this;
      _ref = el.dataset, path = _ref.path, line = _ref.line, column = _ref.column;
      line = Number(line) - 1;
      column = column ? Number(column) - 1 : 0;
      return atom.workspace.open(path, {
        initialLine: line,
        initialColumn: column
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2xpbmstcGF0aHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLHNEQUFSLENBQUE7O0FBQUEsRUFNQSxRQUFBLEdBQVcsK0VBTlgsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUEsR0FBWSxTQUFDLEtBQUQsR0FBQTtXQUMzQixLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQsRUFBcUIsUUFBckIsRUFEMkI7RUFBQSxDQVI3QixDQUFBOztBQUFBLEVBV0EsU0FBUyxDQUFDLE1BQVYsR0FBbUIsU0FBQyxVQUFELEdBQUE7V0FDakIsVUFBVSxDQUFDLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLGVBQXZCLEVBQXdDLFNBQUMsS0FBRCxHQUFBO0FBQ3RDLFVBQUEsNEJBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxJQUFMLENBQUE7QUFBQSxNQUNBLE9BQXVCLEVBQUUsQ0FBQyxPQUExQixFQUFDLFlBQUEsSUFBRCxFQUFPLFlBQUEsSUFBUCxFQUFhLGNBQUEsTUFEYixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sTUFBQSxDQUFPLElBQVAsQ0FBQSxHQUFlLENBRnRCLENBQUE7QUFBQSxNQUlBLE1BQUEsR0FBWSxNQUFILEdBQWUsTUFBQSxDQUFPLE1BQVAsQ0FBQSxHQUFpQixDQUFoQyxHQUF1QyxDQUpoRCxDQUFBO2FBTUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQXBCLEVBQTBCO0FBQUEsUUFDeEIsV0FBQSxFQUFhLElBRFc7QUFBQSxRQUV4QixhQUFBLEVBQWUsTUFGUztPQUExQixFQVBzQztJQUFBLENBQXhDLEVBRGlCO0VBQUEsQ0FYbkIsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/script/lib/link-paths.coffee
