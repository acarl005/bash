(function() {
  var VariablesCollection;

  VariablesCollection = require('../lib/variables-collection');

  describe('VariablesCollection', function() {
    var changeSpy, collection, createVar, _ref;
    _ref = [], collection = _ref[0], changeSpy = _ref[1];
    createVar = function(name, value, range, path, line) {
      return {
        name: name,
        value: value,
        range: range,
        path: path,
        line: line
      };
    };
    return describe('with an empty collection', function() {
      beforeEach(function() {
        collection = new VariablesCollection;
        changeSpy = jasmine.createSpy('did-change');
        return collection.onDidChange(changeSpy);
      });
      describe('::addMany', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        it('stores them in the collection', function() {
          return expect(collection.length).toEqual(5);
        });
        it('detects that two of the variables are color variables', function() {
          return expect(collection.getColorVariables().length).toEqual(2);
        });
        it('dispatches a change event', function() {
          var arg;
          expect(changeSpy).toHaveBeenCalled();
          arg = changeSpy.mostRecentCall.args[0];
          expect(arg.created.length).toEqual(5);
          expect(arg.destroyed).toBeUndefined();
          return expect(arg.updated).toBeUndefined();
        });
        it('stores the names of the variables', function() {
          return expect(collection.variableNames.sort()).toEqual(['foo', 'bar', 'baz', 'bat', 'bab'].sort());
        });
        it('builds a dependencies map', function() {
          return expect(collection.dependencyGraph).toEqual({
            foo: ['baz'],
            bar: ['bat'],
            bat: ['bab']
          });
        });
        describe('appending an already existing variable', function() {
          beforeEach(function() {
            return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1)]);
          });
          it('leaves the collection untouched', function() {
            expect(collection.length).toEqual(5);
            return expect(collection.getColorVariables().length).toEqual(2);
          });
          return it('does not trigger an update event', function() {
            return expect(changeSpy.callCount).toEqual(1);
          });
        });
        return describe('appending an already existing variable with a different value', function() {
          describe('that has a different range', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#aabbcc', [0, 14], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#aabbcc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#aabbcc');
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that has a different range and a different line', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#abc', [52, 64], '/path/to/foo.styl', 6)]);
            });
            it('appends the new variables', function() {
              expect(collection.length).toEqual(6);
              return expect(collection.getColorVariables().length).toEqual(3);
            });
            it('stores the two variables', function() {
              var variables;
              variables = collection.findAll({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              return expect(variables.length).toEqual(2);
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created.length).toEqual(1);
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(1);
            });
          });
          describe('that is still a color', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '#abc', [0, 10], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#abc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#abc');
            });
            return it('emits a change event', function() {
              var arg;
              expect(changeSpy.callCount).toEqual(2);
              arg = changeSpy.mostRecentCall.args[0];
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that is no longer a color', function() {
            beforeEach(function() {
              return collection.addMany([createVar('foo', '20px', [0, 10], '/path/to/foo.styl', 1)]);
            });
            it('leaves the collection variables untouched', function() {
              return expect(collection.length).toEqual(5);
            });
            it('affects the colors variables within the collection', function() {
              return expect(collection.getColorVariables().length).toEqual(0);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'foo',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('20px');
              return expect(variable.isColor).toBeFalsy();
            });
            it('updates the variables depending on the changed variable', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              return expect(variable.isColor).toBeFalsy();
            });
            return it('emits a change event', function() {
              var arg;
              arg = changeSpy.mostRecentCall.args[0];
              expect(changeSpy.callCount).toEqual(2);
              expect(arg.created).toBeUndefined();
              expect(arg.destroyed).toBeUndefined();
              return expect(arg.updated.length).toEqual(2);
            });
          });
          describe('that breaks a dependency', function() {
            beforeEach(function() {
              return collection.addMany([createVar('baz', '#abc', [22, 30], '/path/to/foo.styl', 3)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('#abc');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor('#abc');
            });
            return it('updates the dependencies graph', function() {
              return expect(collection.dependencyGraph).toEqual({
                bar: ['bat'],
                bat: ['bab']
              });
            });
          });
          return describe('that adds a dependency', function() {
            beforeEach(function() {
              return collection.addMany([createVar('baz', 'transparentize(foo, bar)', [22, 30], '/path/to/foo.styl', 3)]);
            });
            it('leaves the collection untouched', function() {
              expect(collection.length).toEqual(5);
              return expect(collection.getColorVariables().length).toEqual(2);
            });
            it('updates the existing variable value', function() {
              var variable;
              variable = collection.find({
                name: 'baz',
                path: '/path/to/foo.styl'
              });
              expect(variable.value).toEqual('transparentize(foo, bar)');
              expect(variable.isColor).toBeTruthy();
              return expect(variable.color).toBeColor(255, 255, 255, 0.5);
            });
            return it('updates the dependencies graph', function() {
              return expect(collection.dependencyGraph).toEqual({
                foo: ['baz'],
                bar: ['bat', 'baz'],
                bat: ['bab']
              });
            });
          });
        });
      });
      describe('::removeMany', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        describe('with variables that were not colors', function() {
          beforeEach(function() {
            return collection.removeMany([createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
          });
          it('removes the variables from the collection', function() {
            return expect(collection.length).toEqual(3);
          });
          it('dispatches a change event', function() {
            var arg;
            expect(changeSpy).toHaveBeenCalled();
            arg = changeSpy.mostRecentCall.args[0];
            expect(arg.created).toBeUndefined();
            expect(arg.destroyed.length).toEqual(2);
            return expect(arg.updated).toBeUndefined();
          });
          it('stores the names of the variables', function() {
            return expect(collection.variableNames.sort()).toEqual(['foo', 'bar', 'baz'].sort());
          });
          it('updates the variables per path map', function() {
            return expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(3);
          });
          return it('updates the dependencies map', function() {
            return expect(collection.dependencyGraph).toEqual({
              foo: ['baz']
            });
          });
        });
        return describe('with variables that were referenced by a color variable', function() {
          beforeEach(function() {
            return collection.removeMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1)]);
          });
          it('removes the variables from the collection', function() {
            expect(collection.length).toEqual(4);
            return expect(collection.getColorVariables().length).toEqual(0);
          });
          it('dispatches a change event', function() {
            var arg;
            expect(changeSpy).toHaveBeenCalled();
            arg = changeSpy.mostRecentCall.args[0];
            expect(arg.created).toBeUndefined();
            expect(arg.destroyed.length).toEqual(1);
            return expect(arg.updated.length).toEqual(1);
          });
          it('stores the names of the variables', function() {
            return expect(collection.variableNames.sort()).toEqual(['bar', 'baz', 'bat', 'bab'].sort());
          });
          it('updates the variables per path map', function() {
            return expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(4);
          });
          return it('updates the dependencies map', function() {
            return expect(collection.dependencyGraph).toEqual({
              bar: ['bat'],
              bat: ['bab']
            });
          });
        });
      });
      describe('::updatePathCollection', function() {
        beforeEach(function() {
          return collection.addMany([createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
        });
        describe('when a new variable is added', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5), createVar('baa', '#f00', [52, 60], '/path/to/foo.styl', 6)]);
          });
          return it('detects the addition and leave the rest of the collection unchanged', function() {
            expect(collection.length).toEqual(6);
            expect(collection.getColorVariables().length).toEqual(3);
            expect(changeSpy.mostRecentCall.args[0].created.length).toEqual(1);
            expect(changeSpy.mostRecentCall.args[0].destroyed).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].updated).toBeUndefined();
          });
        });
        describe('when a variable is removed', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', 'bar', [32, 40], '/path/to/foo.styl', 4)]);
          });
          return it('removes the variable that is not present in the new array', function() {
            expect(collection.length).toEqual(4);
            expect(collection.getColorVariables().length).toEqual(2);
            expect(changeSpy.mostRecentCall.args[0].destroyed.length).toEqual(1);
            expect(changeSpy.mostRecentCall.args[0].created).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].updated).toBeUndefined();
          });
        });
        return describe('when a new variable is changed', function() {
          beforeEach(function() {
            return collection.updatePathCollection('/path/to/foo.styl', [createVar('foo', '#fff', [0, 10], '/path/to/foo.styl', 1), createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2), createVar('baz', 'foo', [22, 30], '/path/to/foo.styl', 3), createVar('bat', '#abc', [32, 40], '/path/to/foo.styl', 4), createVar('bab', 'bat', [42, 50], '/path/to/foo.styl', 5)]);
          });
          return it('detects the update', function() {
            expect(collection.length).toEqual(5);
            expect(collection.getColorVariables().length).toEqual(4);
            expect(changeSpy.mostRecentCall.args[0].updated.length).toEqual(2);
            expect(changeSpy.mostRecentCall.args[0].destroyed).toBeUndefined();
            return expect(changeSpy.mostRecentCall.args[0].created).toBeUndefined();
          });
        });
      });
      describe('::serialize', function() {
        describe('with an empty collection', function() {
          return it('returns an empty serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: []
            });
          });
        });
        describe('with a collection that contains a non-color variable', function() {
          beforeEach(function() {
            return collection.add(createVar('bar', '0.5', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'bar',
                  value: '0.5',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2
                }
              ]
            });
          });
        });
        describe('with a collection that contains a color variable', function() {
          beforeEach(function() {
            return collection.add(createVar('bar', '#abc', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'bar',
                  value: '#abc',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: []
                }
              ]
            });
          });
        });
        return describe('with a collection that contains color variables with references', function() {
          beforeEach(function() {
            collection.add(createVar('foo', '#abc', [0, 10], '/path/to/foo.styl', 1));
            return collection.add(createVar('bar', 'foo', [12, 20], '/path/to/foo.styl', 2));
          });
          return it('returns the serialized collection', function() {
            return expect(collection.serialize()).toEqual({
              deserializer: 'VariablesCollection',
              content: [
                {
                  name: 'foo',
                  value: '#abc',
                  range: [0, 10],
                  path: '/path/to/foo.styl',
                  line: 1,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: []
                }, {
                  name: 'bar',
                  value: 'foo',
                  range: [12, 20],
                  path: '/path/to/foo.styl',
                  line: 2,
                  isColor: true,
                  color: [170, 187, 204, 1],
                  variables: ['foo']
                }
              ]
            });
          });
        });
      });
      return describe('.deserialize', function() {
        beforeEach(function() {
          return collection = atom.deserializers.deserialize({
            deserializer: 'VariablesCollection',
            content: [
              {
                name: 'foo',
                value: '#abc',
                range: [0, 10],
                path: '/path/to/foo.styl',
                line: 1,
                isColor: true,
                color: [170, 187, 204, 1],
                variables: []
              }, {
                name: 'bar',
                value: 'foo',
                range: [12, 20],
                path: '/path/to/foo.styl',
                line: 2,
                isColor: true,
                color: [170, 187, 204, 1],
                variables: ['foo']
              }, {
                name: 'baz',
                value: '0.5',
                range: [22, 30],
                path: '/path/to/foo.styl',
                line: 3
              }
            ]
          });
        });
        it('restores the variables', function() {
          expect(collection.length).toEqual(3);
          return expect(collection.getColorVariables().length).toEqual(2);
        });
        return it('restores all the denormalized data in the collection', function() {
          expect(collection.variableNames).toEqual(['foo', 'bar', 'baz']);
          expect(Object.keys(collection.variablesByPath)).toEqual(['/path/to/foo.styl']);
          expect(collection.variablesByPath['/path/to/foo.styl'].length).toEqual(3);
          return expect(collection.dependencyGraph).toEqual({
            foo: ['bar']
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL3ZhcmlhYmxlcy1jb2xsZWN0aW9uLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLDZCQUFSLENBQXRCLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMscUJBQVQsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFFBQUEsc0NBQUE7QUFBQSxJQUFBLE9BQTBCLEVBQTFCLEVBQUMsb0JBQUQsRUFBYSxtQkFBYixDQUFBO0FBQUEsSUFFQSxTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sS0FBUCxFQUFjLEtBQWQsRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsR0FBQTthQUNWO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLE9BQUEsS0FBUDtBQUFBLFFBQWMsT0FBQSxLQUFkO0FBQUEsUUFBcUIsTUFBQSxJQUFyQjtBQUFBLFFBQTJCLE1BQUEsSUFBM0I7UUFEVTtJQUFBLENBRlosQ0FBQTtXQUtBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsTUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsUUFBQSxVQUFBLEdBQWEsR0FBQSxDQUFBLG1CQUFiLENBQUE7QUFBQSxRQUNBLFNBQUEsR0FBWSxPQUFPLENBQUMsU0FBUixDQUFrQixZQUFsQixDQURaLENBQUE7ZUFFQSxVQUFVLENBQUMsV0FBWCxDQUF1QixTQUF2QixFQUhTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQWFBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsVUFBVSxDQUFDLE9BQVgsQ0FBbUIsQ0FDakIsU0FB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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/variables-collection-spec.coffee
