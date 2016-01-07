(function() {
  var Dialog, RenameDialog,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require("./dialog");

  module.exports = RenameDialog = (function(_super) {
    __extends(RenameDialog, _super);

    function RenameDialog(statusIcon) {
      this.statusIcon = statusIcon;
      RenameDialog.__super__.constructor.call(this, {
        prompt: "Rename",
        iconClass: "icon-pencil",
        placeholderText: this.statusIcon.getName()
      });
    }

    RenameDialog.prototype.onConfirm = function(newTitle) {
      this.statusIcon.updateName(newTitle.trim());
      return this.cancel();
    };

    return RenameDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC1wbHVzL2xpYi9yZW5hbWUtZGlhbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixtQ0FBQSxDQUFBOztBQUFhLElBQUEsc0JBQUUsVUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUFBLDhDQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsUUFBUjtBQUFBLFFBQ0EsU0FBQSxFQUFXLGFBRFg7QUFBQSxRQUVBLGVBQUEsRUFBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FGakI7T0FERixDQUFBLENBRFc7SUFBQSxDQUFiOztBQUFBLDJCQU1BLFNBQUEsR0FBVyxTQUFDLFFBQUQsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQXVCLFFBQVEsQ0FBQyxJQUFULENBQUEsQ0FBdkIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUZTO0lBQUEsQ0FOWCxDQUFBOzt3QkFBQTs7S0FEeUIsT0FIM0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/terminal-plus/lib/rename-dialog.coffee
