(function() {
  var CompositeDisposable, ViewRuntimeObserver;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = ViewRuntimeObserver = (function() {
    function ViewRuntimeObserver(view, subscriptions) {
      this.view = view;
      this.subscriptions = subscriptions != null ? subscriptions : new CompositeDisposable;
    }

    ViewRuntimeObserver.prototype.observe = function(runtime) {
      this.subscriptions.add(runtime.onStart((function(_this) {
        return function() {
          return _this.view.resetView();
        };
      })(this)));
      this.subscriptions.add(runtime.onStopped((function(_this) {
        return function() {
          return _this.view.stop();
        };
      })(this)));
      this.subscriptions.add(runtime.onDidWriteToStderr((function(_this) {
        return function(ev) {
          return _this.view.display('stderr', ev.message);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidWriteToStdout((function(_this) {
        return function(ev) {
          return _this.view.display('stdout', ev.message);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidExit((function(_this) {
        return function(ev) {
          return _this.view.setHeaderAndShowExecutionTime(ev.returnCode, ev.executionTime);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotRun((function(_this) {
        return function(ev) {
          return _this.view.showUnableToRunError(ev.command);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidContextCreate((function(_this) {
        return function(ev) {
          var title;
          title = "" + ev.lang + " - " + (ev.filename + (ev.lineNumber != null ? ":" + ev.lineNumber : void 0));
          return _this.view.setHeaderTitle(title);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSpecifyLanguage((function(_this) {
        return function() {
          return _this.view.showNoLanguageSpecified();
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSupportLanguage((function(_this) {
        return function(ev) {
          return _this.view.showLanguageNotSupported(ev.lang);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSupportMode((function(_this) {
        return function(ev) {
          return _this.view.createGitHubIssueLink(ev.argType, ev.lang);
        };
      })(this)));
      return this.subscriptions.add(runtime.onDidNotBuildArgs((function(_this) {
        return function(ev) {
          return _this.view.handleError(ev.error);
        };
      })(this)));
    };

    ViewRuntimeObserver.prototype.destroy = function() {
      var _ref;
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    return ViewRuntimeObserver;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL3ZpZXctcnVudGltZS1vYnNlcnZlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLDZCQUFFLElBQUYsRUFBUyxhQUFULEdBQUE7QUFBbUQsTUFBbEQsSUFBQyxDQUFBLE9BQUEsSUFBaUQsQ0FBQTtBQUFBLE1BQTNDLElBQUMsQ0FBQSx3Q0FBQSxnQkFBZ0IsR0FBQSxDQUFBLG1CQUEwQixDQUFuRDtJQUFBLENBQWI7O0FBQUEsa0NBRUEsT0FBQSxHQUFTLFNBQUMsT0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDakMsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUEsRUFEaUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQixDQUFuQixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsU0FBUixDQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNuQyxLQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBQSxFQURtQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCLENBQW5CLENBRkEsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE9BQU8sQ0FBQyxrQkFBUixDQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxFQUFELEdBQUE7aUJBQzVDLEtBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFjLFFBQWQsRUFBd0IsRUFBRSxDQUFDLE9BQTNCLEVBRDRDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsQ0FBbkIsQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLGtCQUFSLENBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtpQkFDNUMsS0FBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsUUFBZCxFQUF3QixFQUFFLENBQUMsT0FBM0IsRUFENEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixDQUFuQixDQU5BLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsU0FBUixDQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxFQUFELEdBQUE7aUJBQ25DLEtBQUMsQ0FBQSxJQUFJLENBQUMsNkJBQU4sQ0FBb0MsRUFBRSxDQUFDLFVBQXZDLEVBQW1ELEVBQUUsQ0FBQyxhQUF0RCxFQURtQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCLENBQW5CLENBUkEsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE9BQU8sQ0FBQyxXQUFSLENBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtpQkFDckMsS0FBQyxDQUFBLElBQUksQ0FBQyxvQkFBTixDQUEyQixFQUFFLENBQUMsT0FBOUIsRUFEcUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixDQUFuQixDQVZBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsa0JBQVIsQ0FBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsRUFBRCxHQUFBO0FBQzVDLGNBQUEsS0FBQTtBQUFBLFVBQUEsS0FBQSxHQUFRLEVBQUEsR0FBRyxFQUFFLENBQUMsSUFBTixHQUFXLEtBQVgsR0FBZSxDQUFDLEVBQUUsQ0FBQyxRQUFILEdBQWMsQ0FBd0IscUJBQXZCLEdBQUMsR0FBQSxHQUFHLEVBQUUsQ0FBQyxVQUFQLEdBQUEsTUFBRCxDQUFmLENBQXZCLENBQUE7aUJBQ0EsS0FBQyxDQUFBLElBQUksQ0FBQyxjQUFOLENBQXFCLEtBQXJCLEVBRjRDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsQ0FBbkIsQ0FaQSxDQUFBO0FBQUEsTUFlQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLHVCQUFSLENBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2pELEtBQUMsQ0FBQSxJQUFJLENBQUMsdUJBQU4sQ0FBQSxFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBQW5CLENBZkEsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsdUJBQVIsQ0FBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsRUFBRCxHQUFBO2lCQUNqRCxLQUFDLENBQUEsSUFBSSxDQUFDLHdCQUFOLENBQStCLEVBQUUsQ0FBQyxJQUFsQyxFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBQW5CLENBakJBLENBQUE7QUFBQSxNQW1CQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLG1CQUFSLENBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtpQkFDN0MsS0FBQyxDQUFBLElBQUksQ0FBQyxxQkFBTixDQUE0QixFQUFFLENBQUMsT0FBL0IsRUFBd0MsRUFBRSxDQUFDLElBQTNDLEVBRDZDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUIsQ0FBbkIsQ0FuQkEsQ0FBQTthQXFCQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsT0FBTyxDQUFDLGlCQUFSLENBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEVBQUQsR0FBQTtpQkFDM0MsS0FBQyxDQUFBLElBQUksQ0FBQyxXQUFOLENBQWtCLEVBQUUsQ0FBQyxLQUFyQixFQUQyQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFCLENBQW5CLEVBdEJPO0lBQUEsQ0FGVCxDQUFBOztBQUFBLGtDQTJCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxJQUFBO3VEQUFjLENBQUUsT0FBaEIsQ0FBQSxXQURPO0lBQUEsQ0EzQlQsQ0FBQTs7K0JBQUE7O01BSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/script/lib/view-runtime-observer.coffee
