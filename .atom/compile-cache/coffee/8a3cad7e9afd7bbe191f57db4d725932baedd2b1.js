(function() {
  var HeaderView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = HeaderView = (function(_super) {
    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.content = function() {
      return this.div({
        "class": 'header-view'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": 'heading-title',
            outlet: 'title'
          });
          return _this.span({
            "class": 'heading-status',
            outlet: 'status'
          });
        };
      })(this));
    };

    HeaderView.prototype.setStatus = function(status) {
      this.status.removeClass('icon-alert icon-check icon-hourglass icon-stop');
      switch (status) {
        case 'start':
          return this.status.addClass('icon-hourglass');
        case 'stop':
          return this.status.addClass('icon-check');
        case 'kill':
          return this.status.addClass('icon-stop');
        case 'err':
          return this.status.addClass('icon-alert');
      }
    };

    return HeaderView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2hlYWRlci12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sYUFBUDtPQUFMLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDekIsVUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxPQUFBLEVBQU8sZUFBUDtBQUFBLFlBQXdCLE1BQUEsRUFBUSxPQUFoQztXQUFOLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsWUFBQSxPQUFBLEVBQU8sZ0JBQVA7QUFBQSxZQUF5QixNQUFBLEVBQVEsUUFBakM7V0FBTixFQUZ5QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEseUJBS0EsU0FBQSxHQUFXLFNBQUMsTUFBRCxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsZ0RBQXBCLENBQUEsQ0FBQTtBQUNBLGNBQU8sTUFBUDtBQUFBLGFBQ08sT0FEUDtpQkFDb0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLGdCQUFqQixFQURwQjtBQUFBLGFBRU8sTUFGUDtpQkFFbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLFlBQWpCLEVBRm5CO0FBQUEsYUFHTyxNQUhQO2lCQUdtQixJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsQ0FBaUIsV0FBakIsRUFIbkI7QUFBQSxhQUlPLEtBSlA7aUJBSWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixZQUFqQixFQUpsQjtBQUFBLE9BRlM7SUFBQSxDQUxYLENBQUE7O3NCQUFBOztLQUZ1QixLQUh6QixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/script/lib/header-view.coffee
