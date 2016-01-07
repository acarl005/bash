(function() {
  var Dialog, InputDialog, os,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require("./dialog");

  os = require("os");

  module.exports = InputDialog = (function(_super) {
    __extends(InputDialog, _super);

    function InputDialog(terminalView) {
      this.terminalView = terminalView;
      InputDialog.__super__.constructor.call(this, {
        prompt: "Insert Text",
        iconClass: "icon-keyboard",
        stayOpen: true
      });
    }

    InputDialog.prototype.onConfirm = function(input) {
      var data, eol;
      if (atom.config.get('terminal-plus.toggles.runInsertedText')) {
        eol = os.EOL;
      } else {
        eol = '';
      }
      data = "" + input + eol;
      this.terminalView.input(data);
      return this.cancel();
    };

    return InputDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC1wbHVzL2xpYi9pbnB1dC1kaWFsb2cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOztBQUFhLElBQUEscUJBQUUsWUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsZUFBQSxZQUNiLENBQUE7QUFBQSxNQUFBLDZDQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsYUFBUjtBQUFBLFFBQ0EsU0FBQSxFQUFXLGVBRFg7QUFBQSxRQUVBLFFBQUEsRUFBVSxJQUZWO09BREYsQ0FBQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSwwQkFNQSxTQUFBLEdBQVcsU0FBQyxLQUFELEdBQUE7QUFDVCxVQUFBLFNBQUE7QUFBQSxNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVDQUFoQixDQUFIO0FBQ0UsUUFBQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEdBQVQsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLEdBQUEsR0FBTSxFQUFOLENBSEY7T0FBQTtBQUFBLE1BS0EsSUFBQSxHQUFPLEVBQUEsR0FBRyxLQUFILEdBQVcsR0FMbEIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLENBQW9CLElBQXBCLENBTkEsQ0FBQTthQU9BLElBQUMsQ0FBQSxNQUFELENBQUEsRUFSUztJQUFBLENBTlgsQ0FBQTs7dUJBQUE7O0tBRHdCLE9BSjFCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/terminal-plus/lib/input-dialog.coffee
