function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _libAtomBuildJs = require('../lib/atom-build.js');

var _libAtomBuildJs2 = _interopRequireDefault(_libAtomBuildJs);

'use babel';

describe('custom provider', function () {
  var builder = undefined;
  var directory = null;

  _temp2['default'].track();

  beforeEach(function () {
    directory = _fsExtra2['default'].realpathSync(_temp2['default'].mkdirSync({ prefix: 'atom-build-spec-' })) + '/';
    atom.project.setPaths([directory]);
    builder = new _libAtomBuildJs2['default'](directory);
  });

  afterEach(function () {
    _fsExtra2['default'].removeSync(directory);
  });

  describe('when .atom-build.cson exists', function () {
    it('it should be eligible targets', function () {
      _fsExtra2['default'].writeFileSync(directory + '.atom-build.cson', _fsExtra2['default'].readFileSync(__dirname + '/fixture/.atom-build.cson'));
      expect(builder.isEligible()).toEqual(true);
    });

    it('it should provide targets', function () {
      _fsExtra2['default'].writeFileSync(directory + '.atom-build.cson', _fsExtra2['default'].readFileSync(__dirname + '/fixture/.atom-build.cson'));
      expect(builder.isEligible()).toEqual(true);

      waitsForPromise(function () {
        return Promise.resolve(builder.settings()).then(function (settings) {
          var s = settings[0];
          expect(s.exec).toEqual('echo');
          expect(s.args).toEqual(['arg1', 'arg2']);
          expect(s.name).toEqual('Custom: Compose masterpiece');
          expect(s.sh).toEqual(false);
          expect(s.cwd).toEqual('/some/directory');
          expect(s.errorMatch).toEqual('(?<file>\\w+.js):(?<row>\\d+)');
        });
      });
    });
  });

  describe('when .atom-build.json exists', function () {
    it('it should be eligible targets', function () {
      _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', _fsExtra2['default'].readFileSync(__dirname + '/fixture/.atom-build.json'));
      expect(builder.isEligible()).toEqual(true);
    });

    it('it should provide targets', function () {
      _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', _fsExtra2['default'].readFileSync(__dirname + '/fixture/.atom-build.json'));
      expect(builder.isEligible()).toEqual(true);

      waitsForPromise(function () {
        return Promise.resolve(builder.settings()).then(function (settings) {
          var s = settings[0];
          expect(s.exec).toEqual('dd');
          expect(s.args).toEqual(['if=.atom-build.json']);
          expect(s.name).toEqual('Custom: Fly to moon');
        });
      });
    });
  });

  describe('when .atom-build.yml exists', function () {
    it('it should be eligible targets', function () {
      _fsExtra2['default'].writeFileSync(directory + '.atom-build.yml', _fsExtra2['default'].readFileSync(__dirname + '/fixture/.atom-build.yml'));
      expect(builder.isEligible()).toEqual(true);
    });

    it('it should provide targets', function () {
      _fsExtra2['default'].writeFileSync(directory + '.atom-build.yml', _fsExtra2['default'].readFileSync(__dirname + '/fixture/.atom-build.yml'));
      expect(builder.isEligible()).toEqual(true);

      waitsForPromise(function () {
        return Promise.resolve(builder.settings()).then(function (settings) {
          var s = settings[0];
          expect(s.exec).toEqual('echo');
          expect(s.args).toEqual(['hello', 'world', 'from', 'yaml']);
          expect(s.name).toEqual('Custom: yaml conf');
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvc3BlYy9jdXN0b20tcHJvdmlkZXItc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzt1QkFFZSxVQUFVOzs7O29CQUNSLE1BQU07Ozs7OEJBQ0Esc0JBQXNCOzs7O0FBSjdDLFdBQVcsQ0FBQzs7QUFNWixRQUFRLENBQUMsaUJBQWlCLEVBQUUsWUFBTTtBQUNoQyxNQUFJLE9BQU8sWUFBQSxDQUFDO0FBQ1osTUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDOztBQUVyQixvQkFBSyxLQUFLLEVBQUUsQ0FBQzs7QUFFYixZQUFVLENBQUMsWUFBTTtBQUNmLGFBQVMsR0FBRyxxQkFBRyxZQUFZLENBQUMsa0JBQUssU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUNsRixRQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFFLFNBQVMsQ0FBRSxDQUFDLENBQUM7QUFDckMsV0FBTyxHQUFHLGdDQUFlLFNBQVMsQ0FBQyxDQUFDO0dBQ3JDLENBQUMsQ0FBQzs7QUFFSCxXQUFTLENBQUMsWUFBTTtBQUNkLHlCQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUMxQixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLDhCQUE4QixFQUFFLFlBQU07QUFDN0MsTUFBRSxDQUFDLCtCQUErQixFQUFFLFlBQU07QUFDeEMsMkJBQUcsYUFBYSxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsRUFBRSxxQkFBRyxZQUFZLENBQUMsU0FBUyxHQUFHLDJCQUEyQixDQUFDLENBQUMsQ0FBQztBQUMzRyxZQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzVDLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsMkJBQTJCLEVBQUUsWUFBTTtBQUNwQywyQkFBRyxhQUFhLENBQUMsU0FB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QU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM1QyxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLDJCQUEyQixFQUFFLFlBQU07QUFDcEMsMkJBQUcsYUFBYSxDQUFJLFNBQVMsc0JBQW1CLHFCQUFHLFlBQVksQ0FBSSxTQUFTLDhCQUEyQixDQUFDLENBQUM7QUFDekcsWUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0MscUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGVBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDMUQsY0FBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLGdCQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMvQixnQkFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUUsQ0FBQyxDQUFDO0FBQzdELGdCQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQzdDLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9hbmR5Ly5hdG9tL3BhY2thZ2VzL2J1aWxkL3NwZWMvY3VzdG9tLXByb3ZpZGVyLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnO1xuaW1wb3J0IEN1c3RvbUZpbGUgZnJvbSAnLi4vbGliL2F0b20tYnVpbGQuanMnO1xuXG5kZXNjcmliZSgnY3VzdG9tIHByb3ZpZGVyJywgKCkgPT4ge1xuICBsZXQgYnVpbGRlcjtcbiAgbGV0IGRpcmVjdG9yeSA9IG51bGw7XG5cbiAgdGVtcC50cmFjaygpO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGRpcmVjdG9yeSA9IGZzLnJlYWxwYXRoU3luYyh0ZW1wLm1rZGlyU3luYyh7IHByZWZpeDogJ2F0b20tYnVpbGQtc3BlYy0nIH0pKSArICcvJztcbiAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoWyBkaXJlY3RvcnkgXSk7XG4gICAgYnVpbGRlciA9IG5ldyBDdXN0b21GaWxlKGRpcmVjdG9yeSk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgZnMucmVtb3ZlU3luYyhkaXJlY3RvcnkpO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2hlbiAuYXRvbS1idWlsZC5jc29uIGV4aXN0cycsICgpID0+IHtcbiAgICBpdCgnaXQgc2hvdWxkIGJlIGVsaWdpYmxlIHRhcmdldHMnLCAoKSA9PiB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5jc29uJywgZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC5jc29uJykpO1xuICAgICAgZXhwZWN0KGJ1aWxkZXIuaXNFbGlnaWJsZSgpKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2l0IHNob3VsZCBwcm92aWRlIHRhcmdldHMnLCAoKSA9PiB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5jc29uJywgZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvZml4dHVyZS8uYXRvbS1idWlsZC5jc29uJykpO1xuICAgICAgZXhwZWN0KGJ1aWxkZXIuaXNFbGlnaWJsZSgpKS50b0VxdWFsKHRydWUpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGJ1aWxkZXIuc2V0dGluZ3MoKSkudGhlbihzZXR0aW5ncyA9PiB7XG4gICAgICAgICAgY29uc3QgcyA9IHNldHRpbmdzWzBdO1xuICAgICAgICAgIGV4cGVjdChzLmV4ZWMpLnRvRXF1YWwoJ2VjaG8nKTtcbiAgICAgICAgICBleHBlY3Qocy5hcmdzKS50b0VxdWFsKFsgJ2FyZzEnLCAnYXJnMicgXSk7XG4gICAgICAgICAgZXhwZWN0KHMubmFtZSkudG9FcXVhbCgnQ3VzdG9tOiBDb21wb3NlIG1hc3RlcnBpZWNlJyk7XG4gICAgICAgICAgZXhwZWN0KHMuc2gpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICAgIGV4cGVjdChzLmN3ZCkudG9FcXVhbCgnL3NvbWUvZGlyZWN0b3J5Jyk7XG4gICAgICAgICAgZXhwZWN0KHMuZXJyb3JNYXRjaCkudG9FcXVhbCgnKD88ZmlsZT5cXFxcdysuanMpOig/PHJvdz5cXFxcZCspJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIC5hdG9tLWJ1aWxkLmpzb24gZXhpc3RzJywgKCkgPT4ge1xuICAgIGl0KCdpdCBzaG91bGQgYmUgZWxpZ2libGUgdGFyZ2V0cycsICgpID0+IHtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoYCR7ZGlyZWN0b3J5fS5hdG9tLWJ1aWxkLmpzb25gLCBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9maXh0dXJlLy5hdG9tLWJ1aWxkLmpzb25gKSk7XG4gICAgICBleHBlY3QoYnVpbGRlci5pc0VsaWdpYmxlKCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXQgc2hvdWxkIHByb3ZpZGUgdGFyZ2V0cycsICgpID0+IHtcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoYCR7ZGlyZWN0b3J5fS5hdG9tLWJ1aWxkLmpzb25gLCBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9maXh0dXJlLy5hdG9tLWJ1aWxkLmpzb25gKSk7XG4gICAgICBleHBlY3QoYnVpbGRlci5pc0VsaWdpYmxlKCkpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYnVpbGRlci5zZXR0aW5ncygpKS50aGVuKHNldHRpbmdzID0+IHtcbiAgICAgICAgICBjb25zdCBzID0gc2V0dGluZ3NbMF07XG4gICAgICAgICAgZXhwZWN0KHMuZXhlYykudG9FcXVhbCgnZGQnKTtcbiAgICAgICAgICBleHBlY3Qocy5hcmdzKS50b0VxdWFsKFsgJ2lmPS5hdG9tLWJ1aWxkLmpzb24nIF0pO1xuICAgICAgICAgIGV4cGVjdChzLm5hbWUpLnRvRXF1YWwoJ0N1c3RvbTogRmx5IHRvIG1vb24nKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gLmF0b20tYnVpbGQueW1sIGV4aXN0cycsICgpID0+IHtcbiAgICBpdCgnaXQgc2hvdWxkIGJlIGVsaWdpYmxlIHRhcmdldHMnLCAoKSA9PiB7XG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGAke2RpcmVjdG9yeX0uYXRvbS1idWlsZC55bWxgLCBmcy5yZWFkRmlsZVN5bmMoYCR7X19kaXJuYW1lfS9maXh0dXJlLy5hdG9tLWJ1aWxkLnltbGApKTtcbiAgICAgIGV4cGVjdChidWlsZGVyLmlzRWxpZ2libGUoKSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KCdpdCBzaG91bGQgcHJvdmlkZSB0YXJnZXRzJywgKCkgPT4ge1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhgJHtkaXJlY3Rvcnl9LmF0b20tYnVpbGQueW1sYCwgZnMucmVhZEZpbGVTeW5jKGAke19fZGlybmFtZX0vZml4dHVyZS8uYXRvbS1idWlsZC55bWxgKSk7XG4gICAgICBleHBlY3QoYnVpbGRlci5pc0VsaWdpYmxlKCkpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoYnVpbGRlci5zZXR0aW5ncygpKS50aGVuKHNldHRpbmdzID0+IHtcbiAgICAgICAgICBjb25zdCBzID0gc2V0dGluZ3NbMF07XG4gICAgICAgICAgZXhwZWN0KHMuZXhlYykudG9FcXVhbCgnZWNobycpO1xuICAgICAgICAgIGV4cGVjdChzLmFyZ3MpLnRvRXF1YWwoWyAnaGVsbG8nLCAnd29ybGQnLCAnZnJvbScsICd5YW1sJyBdKTtcbiAgICAgICAgICBleHBlY3Qocy5uYW1lKS50b0VxdWFsKCdDdXN0b206IHlhbWwgY29uZicpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/home/andy/.atom/packages/build/spec/custom-provider-spec.js
