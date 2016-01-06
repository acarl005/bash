(function() {
  var event, mouseEvent, objectCenterCoordinates;

  event = function(type, properties) {
    if (properties == null) {
      properties = {};
    }
    return new Event(type, properties);
  };

  mouseEvent = function(type, properties) {
    var defaults, k, v;
    defaults = {
      bubbles: true,
      cancelable: type !== "mousemove",
      view: window,
      detail: 0,
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: void 0
    };
    for (k in defaults) {
      v = defaults[k];
      if (properties[k] == null) {
        properties[k] = v;
      }
    }
    return new MouseEvent(type, properties);
  };

  objectCenterCoordinates = function(target) {
    var height, left, top, width, _ref;
    _ref = target.getBoundingClientRect(), top = _ref.top, left = _ref.left, width = _ref.width, height = _ref.height;
    return {
      x: left + width / 2,
      y: top + height / 2
    };
  };

  module.exports = {
    objectCenterCoordinates: objectCenterCoordinates,
    mouseEvent: mouseEvent,
    event: event
  };

  ['mousedown', 'mousemove', 'mouseup', 'click'].forEach(function(key) {
    return module.exports[key] = function(target, x, y, cx, cy, btn) {
      var _ref;
      if (!((x != null) && (y != null))) {
        _ref = objectCenterCoordinates(target), x = _ref.x, y = _ref.y;
      }
      if (!((cx != null) && (cy != null))) {
        cx = x;
        cy = y;
      }
      return target.dispatchEvent(mouseEvent(key, {
        target: target,
        pageX: x,
        pageY: y,
        clientX: cx,
        clientY: cy,
        button: btn
      }));
    };
  });

  module.exports.mousewheel = function(target, deltaX, deltaY) {
    if (deltaX == null) {
      deltaX = 0;
    }
    if (deltaY == null) {
      deltaY = 0;
    }
    return target.dispatchEvent(mouseEvent('mousewheel', {
      target: target,
      deltaX: deltaX,
      deltaY: deltaY
    }));
  };

  module.exports.change = function(target) {
    return target.dispatchEvent(event('change', {
      target: target
    }));
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2hlbHBlcnMvZXZlbnRzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQ0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxVQUFQLEdBQUE7O01BQU8sYUFBVztLQUFPO1dBQUksSUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLFVBQVosRUFBN0I7RUFBQSxDQUFSLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sVUFBUCxHQUFBO0FBQ1gsUUFBQSxjQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVc7QUFBQSxNQUNULE9BQUEsRUFBUyxJQURBO0FBQUEsTUFFVCxVQUFBLEVBQWEsSUFBQSxLQUFVLFdBRmQ7QUFBQSxNQUdULElBQUEsRUFBTSxNQUhHO0FBQUEsTUFJVCxNQUFBLEVBQVEsQ0FKQztBQUFBLE1BS1QsS0FBQSxFQUFPLENBTEU7QUFBQSxNQU1ULEtBQUEsRUFBTyxDQU5FO0FBQUEsTUFPVCxPQUFBLEVBQVMsQ0FQQTtBQUFBLE1BUVQsT0FBQSxFQUFTLENBUkE7QUFBQSxNQVNULE9BQUEsRUFBUyxLQVRBO0FBQUEsTUFVVCxNQUFBLEVBQVEsS0FWQztBQUFBLE1BV1QsUUFBQSxFQUFVLEtBWEQ7QUFBQSxNQVlULE9BQUEsRUFBUyxLQVpBO0FBQUEsTUFhVCxNQUFBLEVBQVEsQ0FiQztBQUFBLE1BY1QsYUFBQSxFQUFlLE1BZE47S0FBWCxDQUFBO0FBaUJBLFNBQUEsYUFBQTtzQkFBQTtVQUErQztBQUEvQyxRQUFBLFVBQVcsQ0FBQSxDQUFBLENBQVgsR0FBZ0IsQ0FBaEI7T0FBQTtBQUFBLEtBakJBO1dBbUJJLElBQUEsVUFBQSxDQUFXLElBQVgsRUFBaUIsVUFBakIsRUFwQk87RUFBQSxDQUZi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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/helpers/events.coffee
