(function() {
  var findClosingIndex, split, _ref;

  _ref = require('../lib/utils'), findClosingIndex = _ref.findClosingIndex, split = _ref.split;

  describe('split', function() {
    var tests;
    tests = [['a,b,c', ['a', 'b', 'c']], ['a,b(),c', ['a', 'b()', 'c']], ['a,b(c)', ['a', 'b(c)']], ['a,(b, c)', ['a', '(b,c)']], ['a,(b, c())', ['a', '(b,c())']], ['a(b, c())', ['a(b,c())']], ['a,)(', ['a']], ['a(,', []], ['(,', []], ['a,(,', ['a']], ['a,((),', ['a']], ['a,()),', ['a', '()']]];
    return tests.forEach(function(_arg) {
      var expected, source;
      source = _arg[0], expected = _arg[1];
      return it("splits " + (jasmine.pp(source)) + " as " + (jasmine.pp(expected)), function() {
        return expect(split(source)).toEqual(expected);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL3V0aWxzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLGNBQVIsQ0FBNUIsRUFBQyx3QkFBQSxnQkFBRCxFQUFtQixhQUFBLEtBQW5CLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsUUFBQSxLQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsQ0FDTixDQUFDLE9BQUQsRUFBVSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUFWLENBRE0sRUFFTixDQUFDLFNBQUQsRUFBWSxDQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWEsR0FBYixDQUFaLENBRk0sRUFHTixDQUFDLFFBQUQsRUFBVyxDQUFDLEdBQUQsRUFBTSxNQUFOLENBQVgsQ0FITSxFQUlOLENBQUMsVUFBRCxFQUFhLENBQUMsR0FBRCxFQUFNLE9BQU4sQ0FBYixDQUpNLEVBS04sQ0FBQyxZQUFELEVBQWUsQ0FBQyxHQUFELEVBQU0sU0FBTixDQUFmLENBTE0sRUFNTixDQUFDLFdBQUQsRUFBYyxDQUFDLFVBQUQsQ0FBZCxDQU5NLEVBT04sQ0FBQyxNQUFELEVBQVMsQ0FBQyxHQUFELENBQVQsQ0FQTSxFQVFOLENBQUMsS0FBRCxFQUFRLEVBQVIsQ0FSTSxFQVNOLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FUTSxFQVVOLENBQUMsTUFBRCxFQUFTLENBQUMsR0FBRCxDQUFULENBVk0sRUFXTixDQUFDLFFBQUQsRUFBVyxDQUFDLEdBQUQsQ0FBWCxDQVhNLEVBWU4sQ0FBQyxRQUFELEVBQVcsQ0FBQyxHQUFELEVBQU0sSUFBTixDQUFYLENBWk0sQ0FBUixDQUFBO1dBZUEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxTQUFDLElBQUQsR0FBQTtBQUNaLFVBQUEsZ0JBQUE7QUFBQSxNQURjLGtCQUFRLGtCQUN0QixDQUFBO2FBQUEsRUFBQSxDQUFJLFNBQUEsR0FBUSxDQUFDLE9BQU8sQ0FBQyxFQUFSLENBQVcsTUFBWCxDQUFELENBQVIsR0FBMkIsTUFBM0IsR0FBZ0MsQ0FBQyxPQUFPLENBQUMsRUFBUixDQUFXLFFBQVgsQ0FBRCxDQUFwQyxFQUE2RCxTQUFBLEdBQUE7ZUFDM0QsTUFBQSxDQUFPLEtBQUEsQ0FBTSxNQUFOLENBQVAsQ0FBcUIsQ0FBQyxPQUF0QixDQUE4QixRQUE5QixFQUQyRDtNQUFBLENBQTdELEVBRFk7SUFBQSxDQUFkLEVBaEJnQjtFQUFBLENBQWxCLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/pigments/spec/utils-spec.coffee
