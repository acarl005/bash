function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _atomBuildSpecHelpers = require('atom-build-spec-helpers');

var _atomBuildSpecHelpers2 = _interopRequireDefault(_atomBuildSpecHelpers);

'use babel';

describe('Visible', function () {
  var directory = null;
  var workspaceElement = null;

  _temp2['default'].track();

  beforeEach(function () {
    atom.config.set('build.buildOnSave', false);
    atom.config.set('build.panelVisibility', 'Toggle');
    atom.config.set('build.saveOnBuild', false);
    atom.config.set('build.stealFocus', true);
    atom.notifications.clear();

    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);
    jasmine.unspy(window, 'setTimeout');
    jasmine.unspy(window, 'clearTimeout');

    runs(function () {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
    });

    waitsForPromise(function () {
      return _atomBuildSpecHelpers2['default'].vouch(_temp2['default'].mkdir, { prefix: 'atom-build-spec-' }).then(function (dir) {
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].realpath, dir);
      }).then(function (dir) {
        directory = dir + '/';
        atom.project.setPaths([directory]);
      });
    });
  });

  afterEach(function () {
    _fsExtra2['default'].removeSync(directory);
  });

  describe('when package is activated with panel visibility set to Keep Visible', function () {
    beforeEach(function () {
      atom.config.set('build.panelVisibility', 'Keep Visible');
      waitsForPromise(function () {
        return atom.packages.activatePackage('build');
      });
    });

    it('should not show build window', function () {
      expect(workspaceElement.querySelector('.build')).not.toExist();
    });
  });

  describe('when package is activated with panel visibility set to Toggle', function () {
    beforeEach(function () {
      atom.config.set('build.panelVisibility', 'Toggle');
      waitsForPromise(function () {
        return atom.packages.activatePackage('build');
      });
    });

    describe('when build panel is toggled and it is visible', function () {
      beforeEach(function () {
        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
      });

      it('should hide the build panel', function () {
        expect(workspaceElement.querySelector('.build')).toExist();

        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');

        expect(workspaceElement.querySelector('.build')).not.toExist();
      });
    });

    describe('when panel visibility is set to Show on Error', function () {
      it('should only show the build panel if a build fails', function () {
        atom.config.set('build.panelVisibility', 'Show on Error');

        _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
        }));

        waitsForPromise(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });

        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        /* Give it some reasonable time to show itself if there is a bug */
        waits(200);

        runs(function () {
          expect(workspaceElement.querySelector('.build')).not.toExist();
        });

        runs(function () {
          _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
            cmd: 'echo "Very bad..." && exit 2'
          }));
        });

        // .atom-build.json is updated asynchronously... give it some time
        waits(200);

        runs(function () {
          atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        waitsFor(function () {
          return workspaceElement.querySelector('.build');
        });

        runs(function () {
          expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Very bad\.\.\./);
        });
      });
    });

    describe('when panel visibility is set to Hidden', function () {
      it('should not show the build panel if build succeeeds', function () {
        atom.config.set('build.panelVisibility', 'Hidden');

        _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
        }));

        waitsForPromise(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });

        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        /* Give it some reasonable time to show itself if there is a bug */
        waits(200);

        runs(function () {
          expect(workspaceElement.querySelector('.build')).not.toExist();
        });
      });

      it('should not show the build panel if build fails', function () {
        atom.config.set('build.panelVisibility', 'Hidden');

        _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo "Very bad..." && exit 2'
        }));

        waitsForPromise(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });

        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        /* Give it some reasonable time to show itself if there is a bug */
        waits(200);

        runs(function () {
          expect(workspaceElement.querySelector('.build')).not.toExist();
        });
      });

      it('should show the build panel if it is toggled', function () {
        atom.config.set('build.panelVisibility', 'Hidden');

        _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
        }));

        waitsForPromise(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });

        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        waits(200); // Let build finish. Since UI component is not visible yet, there's nothing to poll.

        runs(function () {
          atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
        });

        waitsFor(function () {
          return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
        });

        runs(function () {
          expect(workspaceElement.querySelector('.build .output').textContent).toMatch(/Surprising is the passing of time but not so, as the time of passing/);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvc3BlYy9idWlsZC12aXNpYmxlLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7dUJBRWUsVUFBVTs7OztvQkFDUixNQUFNOzs7O29DQUNDLHlCQUF5Qjs7OztBQUpqRCxXQUFXLENBQUM7O0FBTVosUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFNO0FBQ3hCLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixNQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7QUFFNUIsb0JBQUssS0FBSyxFQUFFLENBQUM7O0FBRWIsWUFBVSxDQUFDLFlBQU07QUFDZixRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMxQyxRQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUUzQixvQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQsV0FBTyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RDLFdBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFdBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUV0QyxRQUFJLENBQUMsWUFBTTtBQUNULHNCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUks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Q0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvc3BlYy9idWlsZC12aXNpYmxlLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnO1xuaW1wb3J0IHNwZWNIZWxwZXJzIGZyb20gJ2F0b20tYnVpbGQtc3BlYy1oZWxwZXJzJztcblxuZGVzY3JpYmUoJ1Zpc2libGUnLCAoKSA9PiB7XG4gIGxldCBkaXJlY3RvcnkgPSBudWxsO1xuICBsZXQgd29ya3NwYWNlRWxlbWVudCA9IG51bGw7XG5cbiAgdGVtcC50cmFjaygpO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQuYnVpbGRPblNhdmUnLCBmYWxzZSk7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5wYW5lbFZpc2liaWxpdHknLCAnVG9nZ2xlJyk7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5zYXZlT25CdWlsZCcsIGZhbHNlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnN0ZWFsRm9jdXMnLCB0cnVlKTtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuY2xlYXIoKTtcblxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudCk7XG4gICAgamFzbWluZS51bnNweSh3aW5kb3csICdzZXRUaW1lb3V0Jyk7XG4gICAgamFzbWluZS51bnNweSh3aW5kb3csICdjbGVhclRpbWVvdXQnKTtcblxuICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHtcbiAgICAgIHJldHVybiBzcGVjSGVscGVycy52b3VjaCh0ZW1wLm1rZGlyLCB7IHByZWZpeDogJ2F0b20tYnVpbGQtc3BlYy0nIH0pLnRoZW4oIChkaXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHNwZWNIZWxwZXJzLnZvdWNoKGZzLnJlYWxwYXRoLCBkaXIpO1xuICAgICAgfSkudGhlbiggKGRpcikgPT4ge1xuICAgICAgICBkaXJlY3RvcnkgPSBkaXIgKyAnLyc7XG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbIGRpcmVjdG9yeSBdKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGZzLnJlbW92ZVN5bmMoZGlyZWN0b3J5KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWQgd2l0aCBwYW5lbCB2aXNpYmlsaXR5IHNldCB0byBLZWVwIFZpc2libGUnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdLZWVwIFZpc2libGUnKTtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnYnVpbGQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBidWlsZCB3aW5kb3cnLCAoKSA9PiB7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWQgd2l0aCBwYW5lbCB2aXNpYmlsaXR5IHNldCB0byBUb2dnbGUnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdUb2dnbGUnKTtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnYnVpbGQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3doZW4gYnVpbGQgcGFuZWwgaXMgdG9nZ2xlZCBhbmQgaXQgaXMgdmlzaWJsZScsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0b2dnbGUtcGFuZWwnKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhpZGUgdGhlIGJ1aWxkIHBhbmVsJywgKCkgPT4ge1xuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkudG9FeGlzdCgpO1xuXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRvZ2dsZS1wYW5lbCcpO1xuXG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2hlbiBwYW5lbCB2aXNpYmlsaXR5IGlzIHNldCB0byBTaG93IG9uIEVycm9yJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBvbmx5IHNob3cgdGhlIGJ1aWxkIHBhbmVsIGlmIGEgYnVpbGQgZmFpbHMnLCAoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgJ1Nob3cgb24gRXJyb3InKTtcblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNtZDogJ2VjaG8gU3VycHJpc2luZyBpcyB0aGUgcGFzc2luZyBvZiB0aW1lIGJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcuJ1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG5cbiAgICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJykpO1xuXG4gICAgICAgIC8qIEdpdmUgaXQgc29tZSByZWFzb25hYmxlIHRpbWUgdG8gc2hvdyBpdHNlbGYgaWYgdGhlcmUgaXMgYSBidWcgKi9cbiAgICAgICAgd2FpdHMoMjAwKTtcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGNtZDogJ2VjaG8gXCJWZXJ5IGJhZC4uLlwiICYmIGV4aXQgMidcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIC5hdG9tLWJ1aWxkLmpzb24gaXMgdXBkYXRlZCBhc3luY2hyb25vdXNseS4uLiBnaXZlIGl0IHNvbWUgdGltZVxuICAgICAgICB3YWl0cygyMDApO1xuXG4gICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLm91dHB1dCcpLnRleHRDb250ZW50KS50b01hdGNoKC9WZXJ5IGJhZFxcLlxcLlxcLi8pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3doZW4gcGFuZWwgdmlzaWJpbGl0eSBpcyBzZXQgdG8gSGlkZGVuJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB0aGUgYnVpbGQgcGFuZWwgaWYgYnVpbGQgc3VjY2VlZWRzJywgKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdIaWRkZW4nKTtcblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNtZDogJ2VjaG8gU3VycHJpc2luZyBpcyB0aGUgcGFzc2luZyBvZiB0aW1lIGJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcuJ1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG5cbiAgICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJykpO1xuXG4gICAgICAgIC8qIEdpdmUgaXQgc29tZSByZWFzb25hYmxlIHRpbWUgdG8gc2hvdyBpdHNlbGYgaWYgdGhlcmUgaXMgYSBidWcgKi9cbiAgICAgICAgd2FpdHMoMjAwKTtcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB0aGUgYnVpbGQgcGFuZWwgaWYgYnVpbGQgZmFpbHMnLCAoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgJ0hpZGRlbicpO1xuXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY21kOiAnZWNobyBcIlZlcnkgYmFkLi4uXCIgJiYgZXhpdCAyJ1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG5cbiAgICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJykpO1xuXG4gICAgICAgIC8qIEdpdmUgaXQgc29tZSByZWFzb25hYmxlIHRpbWUgdG8gc2hvdyBpdHNlbGYgaWYgdGhlcmUgaXMgYSBidWcgKi9cbiAgICAgICAgd2FpdHMoMjAwKTtcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IHRoZSBidWlsZCBwYW5lbCBpZiBpdCBpcyB0b2dnbGVkJywgKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdIaWRkZW4nKTtcblxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRpcmVjdG9yeSArICcuYXRvbS1idWlsZC5qc29uJywgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNtZDogJ2VjaG8gU3VycHJpc2luZyBpcyB0aGUgcGFzc2luZyBvZiB0aW1lIGJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcuJ1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG5cbiAgICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJykpO1xuXG4gICAgICAgIHdhaXRzKDIwMCk7IC8vIExldCBidWlsZCBmaW5pc2guIFNpbmNlIFVJIGNvbXBvbmVudCBpcyBub3QgdmlzaWJsZSB5ZXQsIHRoZXJlJ3Mgbm90aGluZyB0byBwb2xsLlxuXG4gICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRvZ2dsZS1wYW5lbCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpICYmXG4gICAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC5vdXRwdXQnKS50ZXh0Q29udGVudCkudG9NYXRjaCgvU3VycHJpc2luZyBpcyB0aGUgcGFzc2luZyBvZiB0aW1lIGJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcvKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/home/andy/.atom/packages/build/spec/build-visible-spec.js
