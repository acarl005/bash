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
      markers = colorMarker.colorBuffer.getMarkerLayer().findMarkers({
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcmVuZGVyZXJzL2RvdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsV0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007NkJBQ0o7O0FBQUEsMEJBQUEsTUFBQSxHQUFRLFNBQUMsV0FBRCxHQUFBO0FBQ04sVUFBQSw2SEFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLFdBQVcsQ0FBQyxjQUFaLENBQUEsQ0FBUixDQUFBO0FBQUEsTUFFQSxVQUFBLEdBQWEsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUZyQyxDQUFBO0FBQUEsTUFHQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsVUFBbkIsQ0FIcEIsQ0FBQTtBQUFBLE1BSUEsYUFBQSxHQUFnQixXQUFXLENBQUMsTUFBTSxDQUFDLGFBSm5DLENBQUE7QUFBQSxNQUtBLFNBQUEsR0FBWSxhQUFhLENBQUMsbUJBQWQsQ0FBQSxDQUxaLENBQUE7QUFBQSxNQU9BLE9BQUEsR0FBVSxXQUFXLENBQUMsV0FBVyxDQUFDLGNBQXhCLENBQUEsQ0FBd0MsQ0FBQyxXQUF6QyxDQUFxRDtBQUFBLFFBQzdELElBQUEsRUFBTSxnQkFEdUQ7QUFBQSxRQUU3RCx3QkFBQSxFQUEwQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBWCxFQUFnQixLQUFLLENBQUMsR0FBRyxDQUFDLEdBQTFCLENBRm1DO09BQXJELENBUFYsQ0FBQTtBQUFBLE1BWUEsS0FBQSxHQUFRLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFdBQVcsQ0FBQyxNQUE1QixDQVpSLENBQUE7QUFBQSxNQWFBLFVBQUEsR0FBYSxhQUFhLENBQUMsV0FBWSxDQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVixDQWJ2QyxDQUFBO0FBZUEsTUFBQSxJQUFpQixrQkFBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQWZBO0FBQUEsTUFpQkEsVUFBQSxHQUFhLFVBQVUsQ0FBQyxxQkFBWCxDQUFBLENBakJiLENBQUE7QUFBQSxNQWtCQSxNQUFBLEdBQVMsQ0FBQyxVQUFVLENBQUMsa0JBQVgsQ0FBQSxDQUFBLEdBQWtDLENBQW5DLENBQUEsR0FBd0MsU0FsQmpELENBQUE7QUFBQSxNQW1CQSxhQUFBLEdBQWdCLGlCQUFpQixDQUFDLDhCQUFsQixDQUFpRCxLQUFLLENBQUMsR0FBdkQsQ0FuQmhCLENBQUE7YUFxQkE7QUFBQSxRQUFBLE9BQUEsRUFBTyxLQUFQO0FBQUEsUUFDQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLGVBQUEsRUFBaUIsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFsQixDQUFBLENBQWpCO0FBQUEsVUFDQSxHQUFBLEVBQUssQ0FBQyxhQUFhLENBQUMsR0FBZCxHQUFvQixVQUFBLEdBQWEsQ0FBbEMsQ0FBQSxHQUF1QyxJQUQ1QztBQUFBLFVBRUEsSUFBQSxFQUFNLENBQUMsTUFBQSxHQUFTLEtBQUEsR0FBUSxFQUFsQixDQUFBLEdBQXdCLElBRjlCO1NBRkY7UUF0Qk07SUFBQSxDQUFSLENBQUE7O3VCQUFBOztNQUZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/andy/.atom/packages/pigments/lib/renderers/dot.coffee
