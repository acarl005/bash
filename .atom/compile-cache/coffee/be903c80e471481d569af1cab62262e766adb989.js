(function() {
  var RegionRenderer;

  module.exports = RegionRenderer = (function() {
    function RegionRenderer() {}

    RegionRenderer.prototype.includeTextInRegion = false;

    RegionRenderer.prototype.renderRegions = function(colorMarker) {
      var displayBuffer, range, regions, row, rowSpan, _i, _ref, _ref1;
      range = colorMarker.getScreenRange();
      if (range.isEmpty()) {
        return [];
      }
      rowSpan = range.end.row - range.start.row;
      regions = [];
      displayBuffer = colorMarker.marker.displayBuffer;
      if (rowSpan === 0) {
        regions.push(this.createRegion(range.start, range.end, colorMarker));
      } else {
        regions.push(this.createRegion(range.start, {
          row: range.start.row,
          column: Infinity
        }, colorMarker, displayBuffer.screenLines[range.start.row]));
        if (rowSpan > 1) {
          for (row = _i = _ref = range.start.row + 1, _ref1 = range.end.row; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
            regions.push(this.createRegion({
              row: row,
              column: 0
            }, {
              row: row,
              column: Infinity
            }, colorMarker, displayBuffer.screenLines[row]));
          }
        }
        regions.push(this.createRegion({
          row: range.end.row,
          column: 0
        }, range.end, colorMarker, displayBuffer.screenLines[range.end.row]));
      }
      return regions;
    };

    RegionRenderer.prototype.createRegion = function(start, end, colorMarker, screenLine) {
      var bufferRange, charWidth, clippedEnd, clippedStart, css, displayBuffer, endPosition, lineHeight, name, needAdjustment, region, startPosition, text, textEditor, textEditorElement, value, _ref, _ref1;
      textEditor = colorMarker.colorBuffer.editor;
      textEditorElement = atom.views.getView(textEditor);
      displayBuffer = colorMarker.marker.displayBuffer;
      lineHeight = textEditor.getLineHeightInPixels();
      charWidth = textEditor.getDefaultCharWidth();
      clippedStart = {
        row: start.row,
        column: (_ref = screenLine != null ? screenLine.clipScreenColumn(start.column) : void 0) != null ? _ref : start.column
      };
      clippedEnd = {
        row: end.row,
        column: (_ref1 = screenLine != null ? screenLine.clipScreenColumn(end.column) : void 0) != null ? _ref1 : end.column
      };
      bufferRange = displayBuffer.bufferRangeForScreenRange({
        start: clippedStart,
        end: clippedEnd
      });
      needAdjustment = (screenLine != null ? screenLine.isSoftWrapped() : void 0) && end.column >= (screenLine != null ? screenLine.text.length : void 0) - (screenLine != null ? screenLine.softWrapIndentationDelta : void 0);
      if (needAdjustment) {
        bufferRange.end.column++;
      }
      startPosition = textEditorElement.pixelPositionForScreenPosition(clippedStart);
      endPosition = textEditorElement.pixelPositionForScreenPosition(clippedEnd);
      text = displayBuffer.buffer.getTextInRange(bufferRange);
      css = {};
      css.left = startPosition.left;
      css.top = startPosition.top;
      css.width = endPosition.left - startPosition.left;
      if (needAdjustment) {
        css.width += charWidth;
      }
      css.height = lineHeight;
      region = document.createElement('div');
      region.className = 'region';
      if (this.includeTextInRegion) {
        region.textContent = text;
      }
      if (startPosition.left === endPosition.left) {
        region.invalid = true;
      }
      for (name in css) {
        value = css[name];
        region.style[name] = value + 'px';
      }
      return region;
    };

    return RegionRenderer;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvcmVuZGVyZXJzL3JlZ2lvbi1yZW5kZXJlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFDQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007Z0NBQ0o7O0FBQUEsNkJBQUEsbUJBQUEsR0FBcUIsS0FBckIsQ0FBQTs7QUFBQSw2QkFFQSxhQUFBLEdBQWUsU0FBQyxXQUFELEdBQUE7QUFDYixVQUFBLDREQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsV0FBVyxDQUFDLGNBQVosQ0FBQSxDQUFSLENBQUE7QUFDQSxNQUFBLElBQWEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFiO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FEQTtBQUFBLE1BR0EsT0FBQSxHQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVixHQUFnQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBSHRDLENBQUE7QUFBQSxNQUlBLE9BQUEsR0FBVSxFQUpWLENBQUE7QUFBQSxNQU1BLGFBQUEsR0FBZ0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxhQU5uQyxDQUFBO0FBUUEsTUFBQSxJQUFHLE9BQUEsS0FBVyxDQUFkO0FBQ0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLElBQUMsQ0FBQSxZQUFELENBQWMsS0FBSyxDQUFDLEtBQXBCLEVBQTJCLEtBQUssQ0FBQyxHQUFqQyxFQUFzQyxXQUF0QyxDQUFiLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBQyxDQUFBLFlBQUQsQ0FDWCxLQUFLLENBQUMsS0FESyxFQUVYO0FBQUEsVUFDRSxHQUFBLEVBQUssS0FBSyxDQUFDLEtBQUssQ0FBQyxHQURuQjtBQUFBLFVBRUUsTUFBQSxFQUFRLFFBRlY7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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/renderers/region-renderer.coffee
