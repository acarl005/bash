(function() {
  var Dialog, TextEditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), TextEditorView = _ref.TextEditorView, View = _ref.View;

  module.exports = Dialog = (function(_super) {
    __extends(Dialog, _super);

    function Dialog() {
      return Dialog.__super__.constructor.apply(this, arguments);
    }

    Dialog.content = function(_arg) {
      var prompt;
      prompt = (_arg != null ? _arg : {}).prompt;
      return this.div({
        "class": 'terminal-plus-dialog'
      }, (function(_this) {
        return function() {
          _this.label(prompt, {
            "class": 'icon',
            outlet: 'promptText'
          });
          _this.subview('miniEditor', new TextEditorView({
            mini: true
          }));
          _this.label('Escape (Esc) to exit', {
            style: 'float: left;'
          });
          return _this.label('Enter (\u21B5) to confirm', {
            style: 'float: right;'
          });
        };
      })(this));
    };

    Dialog.prototype.initialize = function(_arg) {
      var iconClass, placeholderText, stayOpen, _ref1;
      _ref1 = _arg != null ? _arg : {}, iconClass = _ref1.iconClass, placeholderText = _ref1.placeholderText, stayOpen = _ref1.stayOpen;
      if (iconClass) {
        this.promptText.addClass(iconClass);
      }
      atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.onConfirm(_this.miniEditor.getText());
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.cancel();
          };
        })(this)
      });
      if (!stayOpen) {
        this.miniEditor.on('blur', (function(_this) {
          return function() {
            return _this.close();
          };
        })(this));
      }
      if (placeholderText) {
        this.miniEditor.getModel().setText(placeholderText);
        return this.miniEditor.getModel().selectAll();
      }
    };

    Dialog.prototype.attach = function() {
      this.panel = atom.workspace.addModalPanel({
        item: this.element
      });
      this.miniEditor.focus();
      return this.miniEditor.getModel().scrollToCursorPosition();
    };

    Dialog.prototype.close = function() {
      var panelToDestroy;
      panelToDestroy = this.panel;
      this.panel = null;
      if (panelToDestroy != null) {
        panelToDestroy.destroy();
      }
      return atom.workspace.getActivePane().activate();
    };

    Dialog.prototype.cancel = function() {
      return this.close();
    };

    return Dialog;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC1wbHVzL2xpYi9kaWFsb2cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxzQkFBQSxjQUFELEVBQWlCLFlBQUEsSUFBakIsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxNQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxHQUFBO0FBQ1IsVUFBQSxNQUFBO0FBQUEsTUFEVSx5QkFBRCxPQUFXLElBQVYsTUFDVixDQUFBO2FBQUEsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHNCQUFQO09BQUwsRUFBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNsQyxVQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sTUFBUCxFQUFlO0FBQUEsWUFBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLFlBQWUsTUFBQSxFQUFRLFlBQXZCO1dBQWYsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFBLENBQWU7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO1dBQWYsQ0FBM0IsQ0FEQSxDQUFBO0FBQUEsVUFFQSxLQUFDLENBQUEsS0FBRCxDQUFPLHNCQUFQLEVBQStCO0FBQUEsWUFBQSxLQUFBLEVBQU8sY0FBUDtXQUEvQixDQUZBLENBQUE7aUJBR0EsS0FBQyxDQUFBLEtBQUQsQ0FBTywyQkFBUCxFQUFvQztBQUFBLFlBQUEsS0FBQSxFQUFPLGVBQVA7V0FBcEMsRUFKa0M7UUFBQSxFQUFB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

//# sourceURL=/home/andy/.atom/packages/terminal-plus/lib/dialog.coffee
