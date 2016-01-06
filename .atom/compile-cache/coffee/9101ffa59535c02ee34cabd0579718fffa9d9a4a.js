(function() {
  var DotRenderer;

  module.exports = DotRenderer = (function() {
    function DotRenderer() {}

    DotRenderer.prototype.render = function(colorMarker) {
      var charWidth, column, displayBuffer, index, lineHeight, markers, pixelPosition, range, screenLine, textEditor, textEditorElement;
      range = colorMarker.getScreenRange();
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      displayBuffer = colorMarker.marker.displayBuffer;
      charWidth = displayBuffer.getDefaultCharWidth();
      markers = displayBuffer.findMarkers({
        type: 'pigments-color',
        intersectsScreenRowRange: [range.end.row, range.end.row]
      });
      index = markers.indexOf(colorMarker.marker);
      screenLine = displayBuffer.screenLines[range.end.row];
      if (screenLine == null) {
        return {};
      }
      lineHeight = textEditor.getLineHeightInPixels();
      column = (screenLine.getMaxScreenColumn() + 1) * charWidth;
      pixelPosition = textEditorElement.pixelPositionForScreenPosition(range.end);
      return {
        "class": 'dot',
        style: {
          backgroundColor: colorMarker.color.toCSS(),
          top: (pixelPosition.top + lineHeight / 2) + 'px',
          left: (column + index * 18) + 'px'
        }
      };
    };

    return DotRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcmVuZGVyZXJzL2RvdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007NkJBQ0o7O0FBQUEsMEJBQUEsTUFBQSxHQUFRLFNBQUMsV0FBRCxHQUFBO0FBQ04sVUFBQSw2SEFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLFdBQVcsQ0FBQyxjQUFaLENBQUEsQ0FBUixDQUFBO0FBQUEsTUFFQSxVQUFBLEdBQWEsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUZyQyxDQUFBO0FBQUEsTUFHQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsVUFBbkIsQ0FIcEIsQ0FBQTtBQUFBLE1BSUEsYUFBQSxHQUFnQixXQUFXLENBQUMsTUFBTSxDQUFDLGFBSm5DLENBQUE7QUFBQSxNQUtBLFNBQUEsR0FBWSxhQUFhLENBQUMsbUJBQWQsQ0FBQSxDQUxaLENBQUE7QUFBQSxNQU9BLE9BQUEsR0FBVSxhQUFhLENBQUMsV0FBZCxDQUEwQjtBQUFBLFFBQ2xDLElBQUEsRUFBTSxnQkFENEI7QUFBQSxRQUVsQyx3QkFBQSxFQUEwQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBWCxFQUFnQixLQUFLLENBQUMsR0FBRyxDQUFDLEdBQTFCLENBRlE7T0FBMUIsQ0FQVixDQUFBO0FBQUEsTUFZQSxLQUFBLEdBQVEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsV0FBVyxDQUFDLE1BQTVCLENBWlIsQ0FBQTtBQUFBLE1BYUEsVUFBQSxHQUFhLGFBQWEsQ0FBQyxXQUFZLENBQUEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFWLENBYnZDLENBQUE7QUFlQSxNQUFBLElBQWlCLGtCQUFqQjtBQUFBLGVBQU8sRUFBUCxDQUFBO09BZkE7QUFBQSxNQWlCQSxVQUFBLEdBQWEsVUFBVSxDQUFDLHFCQUFYLENBQUEsQ0FqQmIsQ0FBQTtBQUFBLE1Ba0JBLE1BQUEsR0FBUyxDQUFDLFVBQVUsQ0FBQyxrQkFBWCxDQUFBLENBQUEsR0FBa0MsQ0FBbkMsQ0FBQSxHQUF3QyxTQWxCakQsQ0FBQTtBQUFBLE1BbUJBLGFBQUEsR0FBZ0IsaUJBQWlCLENBQUMsOEJBQWxCLENBQWlELEtBQUssQ0FBQyxHQUF2RCxDQW5CaEIsQ0FBQTthQXFCQTtBQUFBLFFBQUEsT0FBQSxFQUFPLEtBQVA7QUFBQSxRQUNBLEtBQUEsRUFDRTtBQUFBLFVBQUEsZUFBQSxFQUFpQixXQUFXLENBQUMsS0FBSyxDQUFDLEtBQWxCLENBQUEsQ0FBakI7QUFBQSxVQUNBLEdBQUEsRUFBSyxDQUFDLGFBQWEsQ0FBQyxHQUFkLEdBQW9CLFVBQUEsR0FBYSxDQUFsQyxDQUFBLEdBQXVDLElBRDVDO0FBQUEsVUFFQSxJQUFBLEVBQU0sQ0FBQyxNQUFBLEdBQVMsS0FBQSxHQUFRLEVBQWxCLENBQUEsR0FBd0IsSUFGOUI7U0FGRjtRQXRCTTtJQUFBLENBQVIsQ0FBQTs7dUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/pigments/lib/renderers/dot.coffee
