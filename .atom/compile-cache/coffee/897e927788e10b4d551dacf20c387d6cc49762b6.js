(function() {
  var CompositeDisposable, RenameDialog, StatusIcon,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  RenameDialog = null;

  module.exports = StatusIcon = (function(_super) {
    __extends(StatusIcon, _super);

    function StatusIcon() {
      return StatusIcon.__super__.constructor.apply(this, arguments);
    }

    StatusIcon.prototype.active = false;

    StatusIcon.prototype.initialize = function(terminalView) {
      var _ref;
      this.terminalView = terminalView;
      this.classList.add('status-icon');
      this.icon = document.createElement('i');
      this.icon.classList.add('icon', 'icon-terminal');
      this.appendChild(this.icon);
      this.name = document.createElement('span');
      this.name.classList.add('name');
      this.appendChild(this.name);
      this.dataset.type = (_ref = this.terminalView.constructor) != null ? _ref.name : void 0;
      this.addEventListener('click', (function(_this) {
        return function(_arg) {
          var ctrlKey, which;
          which = _arg.which, ctrlKey = _arg.ctrlKey;
          if (which === 1) {
            _this.terminalView.toggle();
            return true;
          } else if (which === 2) {
            _this.terminalView.destroy();
            return false;
          }
        };
      })(this));
      return this.setupTooltip();
    };

    StatusIcon.prototype.setupTooltip = function() {
      var onMouseEnter;
      onMouseEnter = (function(_this) {
        return function(event) {
          if (event.detail === 'terminal-plus') {
            return;
          }
          return _this.updateTooltip();
        };
      })(this);
      this.mouseEnterSubscription = {
        dispose: (function(_this) {
          return function() {
            _this.removeEventListener('mouseenter', onMouseEnter);
            return _this.mouseEnterSubscription = null;
          };
        })(this)
      };
      return this.addEventListener('mouseenter', onMouseEnter);
    };

    StatusIcon.prototype.updateTooltip = function() {
      var process;
      this.removeTooltip();
      if (process = this.terminalView.getTerminalTitle()) {
        this.tooltip = atom.tooltips.add(this, {
          title: process,
          html: false,
          delay: {
            show: 1000,
            hide: 100
          }
        });
      }
      return this.dispatchEvent(new CustomEvent('mouseenter', {
        bubbles: true,
        detail: 'terminal-plus'
      }));
    };

    StatusIcon.prototype.removeTooltip = function() {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      return this.tooltip = null;
    };

    StatusIcon.prototype.destroy = function() {
      this.removeTooltip();
      if (this.mouseEnterSubscription) {
        this.mouseEnterSubscription.dispose();
      }
      return this.remove();
    };

    StatusIcon.prototype.activate = function() {
      this.classList.add('active');
      return this.active = true;
    };

    StatusIcon.prototype.isActive = function() {
      return this.classList.contains('active');
    };

    StatusIcon.prototype.deactivate = function() {
      this.classList.remove('active');
      return this.active = false;
    };

    StatusIcon.prototype.toggle = function() {
      if (this.active) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }
      return this.active = !this.active;
    };

    StatusIcon.prototype.isActive = function() {
      return this.active;
    };

    StatusIcon.prototype.rename = function() {
      var dialog;
      if (RenameDialog == null) {
        RenameDialog = require('./rename-dialog');
      }
      dialog = new RenameDialog(this);
      return dialog.attach();
    };

    StatusIcon.prototype.getName = function() {
      return this.name.textContent.substring(1);
    };

    StatusIcon.prototype.updateName = function(name) {
      if (name !== this.getName()) {
        if (name) {
          name = "&nbsp;" + name;
        }
        this.name.innerHTML = name;
        return this.terminalView.emit('did-change-title');
      }
    };

    return StatusIcon;

  })(HTMLElement);

  module.exports = document.registerElement('status-icon', {
    prototype: StatusIcon.prototype,
    "extends": 'li'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC1wbHVzL2xpYi9zdGF0dXMtaWNvbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNkNBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLElBRmYsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsTUFBQSxHQUFRLEtBQVIsQ0FBQTs7QUFBQSx5QkFFQSxVQUFBLEdBQVksU0FBRSxZQUFGLEdBQUE7QUFDVixVQUFBLElBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxlQUFBLFlBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsYUFBZixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FGUixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixNQUFwQixFQUE0QixlQUE1QixDQUhBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLElBQWQsQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBTlIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsTUFBcEIsQ0FQQSxDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxJQUFkLENBUkEs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

//# sourceURL=/home/andy/.atom/packages/terminal-plus/lib/status-icon.coffee
