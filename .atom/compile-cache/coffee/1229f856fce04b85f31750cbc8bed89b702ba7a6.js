(function() {
  var findClosingIndex, split, _ref;

  _ref = require('../lib/utils'), findClosingIndex = _ref.findClosingIndex, split = _ref.split;

  describe('split', function() {
    return it('does not fail when there is parenthesis after', function() {
      var res, string;
      string = "a,)(";
      res = split(string);
      return expect(res).toEqual(['a', '']);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL3V0aWxzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLGNBQVIsQ0FBNUIsRUFBQyx3QkFBQSxnQkFBRCxFQUFtQixhQUFBLEtBQW5CLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7V0FDaEIsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtBQUNsRCxVQUFBLFdBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxNQUFULENBQUE7QUFBQSxNQUVBLEdBQUEsR0FBTSxLQUFBLENBQU0sTUFBTixDQUZOLENBQUE7YUFJQSxNQUFBLENBQU8sR0FBUCxDQUFXLENBQUMsT0FBWixDQUFvQixDQUFDLEdBQUQsRUFBSyxFQUFMLENBQXBCLEVBTGtEO0lBQUEsQ0FBcEQsRUFEZ0I7RUFBQSxDQUFsQixDQUZBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/pigments/spec/utils-spec.coffee
