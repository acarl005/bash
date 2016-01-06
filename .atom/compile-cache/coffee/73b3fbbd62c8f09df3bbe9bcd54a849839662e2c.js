(function() {
  module.exports = function() {
    return {
      Parent: null,
      SmartColor: (require('./modules/SmartColor'))(),
      SmartVariable: (require('./modules/SmartVariable'))(),
      Emitter: (require('./modules/Emitter'))(),
      extensions: {},
      getExtension: function(extensionName) {
        return this.extensions[extensionName];
      },
      isFirstOpen: true,
      canOpen: true,
      element: null,
      selection: null,
      listeners: [],
      activate: function() {
        var onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onResize, _workspace, _workspaceView;
        _workspace = atom.workspace;
        _workspaceView = atom.views.getView(_workspace);
        this.element = {
          el: (function() {
            var _el;
            _el = document.createElement('div');
            _el.classList.add('ColorPicker');
            return _el;
          })(),
          remove: function() {
            return this.el.parentNode.removeChild(this.el);
          },
          addClass: function(className) {
            this.el.classList.add(className);
            return this;
          },
          removeClass: function(className) {
            this.el.classList.remove(className);
            return this;
          },
          hasClass: function(className) {
            return this.el.classList.contains(className);
          },
          width: function() {
            return this.el.offsetWidth;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          setHeight: function(height) {
            return this.el.style.height = "" + height + "px";
          },
          hasChild: function(child) {
            var _parent;
            if (child && (_parent = child.parentNode)) {
              if (child === this.el) {
                return true;
              } else {
                return this.hasChild(_parent);
              }
            }
            return false;
          },
          isOpen: function() {
            return this.hasClass('is--open');
          },
          open: function() {
            return this.addClass('is--open');
          },
          close: function() {
            return this.removeClass('is--open');
          },
          isFlipped: function() {
            return this.hasClass('is--flipped');
          },
          flip: function() {
            return this.addClass('is--flipped');
          },
          unflip: function() {
            return this.removeClass('is--flipped');
          },
          setPosition: function(x, y) {
            this.el.style.left = "" + x + "px";
            this.el.style.top = "" + y + "px";
            return this;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        this.loadExtensions();
        this.listeners.push([
          'mousedown', onMouseDown = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              _this.emitMouseDown(e, _isPickerEvent);
              if (!_isPickerEvent) {
                return _this.close();
              }
            };
          })(this)
        ]);
        window.addEventListener('mousedown', onMouseDown, true);
        this.listeners.push([
          'mousemove', onMouseMove = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseMove(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousemove', onMouseMove, true);
        this.listeners.push([
          'mouseup', onMouseUp = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseUp(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mouseup', onMouseUp, true);
        this.listeners.push([
          'mousewheel', onMouseWheel = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseWheel(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousewheel', onMouseWheel);
        _workspaceView.addEventListener('keydown', (function(_this) {
          return function(e) {
            var _isPickerEvent;
            if (!_this.element.isOpen()) {
              return;
            }
            _isPickerEvent = _this.element.hasChild(e.target);
            _this.emitKeyDown(e, _isPickerEvent);
            return _this.close();
          };
        })(this));
        atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            var _editorView, _subscriptionLeft, _subscriptionTop;
            _editorView = atom.views.getView(editor);
            _subscriptionTop = _editorView.onDidChangeScrollTop(function() {
              return _this.close();
            });
            _subscriptionLeft = _editorView.onDidChangeScrollLeft(function() {
              return _this.close();
            });
            editor.onDidDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
            _this.onBeforeDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
          };
        })(this));
        this.listeners.push([
          'resize', onResize = (function(_this) {
            return function() {
              return _this.close();
            };
          })(this)
        ]);
        window.addEventListener('resize', onResize);
        _workspace.getActivePane().onDidChangeActiveItem((function(_this) {
          return function() {
            return _this.close();
          };
        })(this));
        this.close();
        (this.Parent = (atom.views.getView(atom.workspace)).querySelector('.vertical')).appendChild(this.element.el);
        return this;
      },
      destroy: function() {
        var _event, _i, _len, _listener, _ref, _ref1;
        this.emitBeforeDestroy();
        _ref = this.listeners;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _ref1 = _ref[_i], _event = _ref1[0], _listener = _ref1[1];
          window.removeEventListener(_event, _listener);
        }
        return this.element.remove();
      },
      loadExtensions: function() {
        var _extension, _i, _len, _ref, _requiredExtension;
        _ref = ['Arrow', 'Color', 'Body', 'Saturation', 'Alpha', 'Hue', 'Definition', 'Return', 'Format'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          _extension = _ref[_i];
          _requiredExtension = (require("./extensions/" + _extension))(this);
          this.extensions[_extension] = _requiredExtension;
          if (typeof _requiredExtension.activate === "function") {
            _requiredExtension.activate();
          }
        }
      },
      emitMouseDown: function(e, isOnPicker) {
        return this.Emitter.emit('mouseDown', e, isOnPicker);
      },
      onMouseDown: function(callback) {
        return this.Emitter.on('mouseDown', callback);
      },
      emitMouseMove: function(e, isOnPicker) {
        return this.Emitter.emit('mouseMove', e, isOnPicker);
      },
      onMouseMove: function(callback) {
        return this.Emitter.on('mouseMove', callback);
      },
      emitMouseUp: function(e, isOnPicker) {
        return this.Emitter.emit('mouseUp', e, isOnPicker);
      },
      onMouseUp: function(callback) {
        return this.Emitter.on('mouseUp', callback);
      },
      emitMouseWheel: function(e, isOnPicker) {
        return this.Emitter.emit('mouseWheel', e, isOnPicker);
      },
      onMouseWheel: function(callback) {
        return this.Emitter.on('mouseWheel', callback);
      },
      emitKeyDown: function(e, isOnPicker) {
        return this.Emitter.emit('keyDown', e, isOnPicker);
      },
      onKeyDown: function(callback) {
        return this.Emitter.on('keyDown', callback);
      },
      emitPositionChange: function(position, colorPickerPosition) {
        return this.Emitter.emit('positionChange', position, colorPickerPosition);
      },
      onPositionChange: function(callback) {
        return this.Emitter.on('positionChange', callback);
      },
      emitOpen: function() {
        return this.Emitter.emit('open');
      },
      onOpen: function(callback) {
        return this.Emitter.on('open', callback);
      },
      emitBeforeOpen: function() {
        return this.Emitter.emit('beforeOpen');
      },
      onBeforeOpen: function(callback) {
        return this.Emitter.on('beforeOpen', callback);
      },
      emitClose: function() {
        return this.Emitter.emit('close');
      },
      onClose: function(callback) {
        return this.Emitter.on('close', callback);
      },
      emitBeforeDestroy: function() {
        return this.Emitter.emit('beforeDestroy');
      },
      onBeforeDestroy: function(callback) {
        return this.Emitter.on('beforeDestroy', callback);
      },
      emitInputColor: function(smartColor, wasFound) {
        if (wasFound == null) {
          wasFound = true;
        }
        return this.Emitter.emit('inputColor', smartColor, wasFound);
      },
      onInputColor: function(callback) {
        return this.Emitter.on('inputColor', callback);
      },
      emitInputVariable: function(match) {
        return this.Emitter.emit('inputVariable', match);
      },
      onInputVariable: function(callback) {
        return this.Emitter.on('inputVariable', callback);
      },
      emitInputVariableColor: function(smartColor, pointer) {
        return this.Emitter.emit('inputVariableColor', smartColor, pointer);
      },
      onInputVariableColor: function(callback) {
        return this.Emitter.on('inputVariableColor', callback);
      },
      open: function() {
        var Cursor, Editor, EditorRoot, EditorView, PaneView, _colorMatches, _colorPickerPosition, _convertedColor, _cursorBufferRow, _cursorColumn, _cursorPosition, _cursorScreenRow, _editorOffsetLeft, _editorOffsetTop, _editorScrollTop, _lineContent, _lineHeight, _lineOffsetLeft, _match, _matches, _paneOffsetLeft, _paneOffsetTop, _position, _preferredFormat, _randomColor, _rect, _redColor, _right, _selection, _totalOffsetLeft, _totalOffsetTop, _variableMatches, _visibleRowRange;
        if (!this.canOpen) {
          return;
        }
        this.emitBeforeOpen();
        Editor = atom.workspace.getActiveTextEditor();
        EditorView = atom.views.getView(Editor);
        if (!EditorView) {
          return;
        }
        EditorRoot = EditorView.shadowRoot || EditorView;
        this.selection = null;
        Cursor = Editor.getLastCursor();
        _visibleRowRange = EditorView.getVisibleRowRange();
        _cursorScreenRow = Cursor.getScreenRow();
        _cursorBufferRow = Cursor.getBufferRow();
        if ((_cursorScreenRow < _visibleRowRange[0]) || (_cursorScreenRow > _visibleRowRange[1])) {
          return;
        }
        _lineContent = Cursor.getCurrentBufferLine();
        _colorMatches = this.SmartColor.find(_lineContent);
        _variableMatches = this.SmartVariable.find(_lineContent, Editor.getPath());
        _matches = _colorMatches.concat(_variableMatches);
        _cursorColumn = Cursor.getBufferColumn();
        _match = (function() {
          var _i, _len;
          for (_i = 0, _len = _matches.length; _i < _len; _i++) {
            _match = _matches[_i];
            if (_match.start <= _cursorColumn && _match.end >= _cursorColumn) {
              return _match;
            }
          }
        })();
        if (_match) {
          Editor.clearSelections();
          _selection = Editor.addSelectionForBufferRange([[_cursorBufferRow, _match.start], [_cursorBufferRow, _match.end]]);
          this.selection = {
            match: _match,
            row: _cursorBufferRow
          };
        } else {
          _cursorPosition = Cursor.getPixelRect();
          this.selection = {
            column: Cursor.getBufferColumn(),
            row: _cursorBufferRow
          };
        }
        if (_match) {
          if (_match.isVariable != null) {
            _match.getDefinition().then((function(_this) {
              return function(definition) {
                var _smartColor;
                _smartColor = (_this.SmartColor.find(definition.value))[0].getSmartColor();
                return _this.emitInputVariableColor(_smartColor, definition.pointer);
              };
            })(this))["catch"]((function(_this) {
              return function(error) {
                return _this.emitInputVariableColor(false);
              };
            })(this));
            this.emitInputVariable(_match);
          } else {
            this.emitInputColor(_match.getSmartColor());
          }
        } else if (atom.config.get('color-picker.randomColor')) {
          _randomColor = this.SmartColor.RGBArray([((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0]);
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          _convertedColor = _randomColor["to" + _preferredFormat]();
          _randomColor = this.SmartColor[_preferredFormat](_convertedColor);
          this.emitInputColor(_randomColor, false);
        } else if (this.isFirstOpen) {
          _redColor = this.SmartColor.HEX('#f00');
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          if (_redColor.format !== _preferredFormat) {
            _convertedColor = _redColor["to" + _preferredFormat]();
            _redColor = this.SmartColor[_preferredFormat](_convertedColor);
          }
          this.isFirstOpen = false;
          this.emitInputColor(_redColor, false);
        }
        PaneView = atom.views.getView(atom.workspace.getActivePane());
        _paneOffsetTop = PaneView.offsetTop;
        _paneOffsetLeft = PaneView.offsetLeft;
        _editorOffsetTop = EditorView.parentNode.offsetTop;
        _editorOffsetLeft = EditorRoot.querySelector('.scroll-view').offsetLeft;
        _editorScrollTop = EditorView.getScrollTop();
        _lineHeight = Editor.getLineHeightInPixels();
        _lineOffsetLeft = EditorRoot.querySelector('.line').offsetLeft;
        if (_match) {
          _rect = EditorView.pixelRectForScreenRange(_selection.getScreenRange());
          _right = _rect.left + _rect.width;
          _cursorPosition = Cursor.getPixelRect();
          _cursorPosition.left = _right - (_rect.width / 2);
        }
        _totalOffsetTop = _paneOffsetTop + _cursorPosition.height - _editorScrollTop + _editorOffsetTop;
        _totalOffsetLeft = _paneOffsetLeft + _editorOffsetLeft + _lineOffsetLeft;
        _position = {
          x: _cursorPosition.left + _totalOffsetLeft,
          y: _cursorPosition.top + _totalOffsetTop
        };
        _colorPickerPosition = {
          x: (function(_this) {
            return function() {
              var _colorPickerWidth, _halfColorPickerWidth, _x;
              _colorPickerWidth = _this.element.width();
              _halfColorPickerWidth = (_colorPickerWidth / 2) << 0;
              _x = Math.max(10, _position.x - _halfColorPickerWidth);
              _x = Math.min(_this.Parent.offsetWidth - _colorPickerWidth - 10, _x);
              return _x;
            };
          })(this)(),
          y: (function(_this) {
            return function() {
              _this.element.unflip();
              if (_this.element.height() + _position.y > _this.Parent.offsetHeight - 32) {
                _this.element.flip();
                return _position.y - _lineHeight - _this.element.height();
              } else {
                return _position.y;
              }
            };
          })(this)()
        };
        this.element.setPosition(_colorPickerPosition.x, _colorPickerPosition.y);
        this.emitPositionChange(_position, _colorPickerPosition);
        requestAnimationFrame((function(_this) {
          return function() {
            _this.element.open();
            return _this.emitOpen();
          };
        })(this));
      },
      canReplace: true,
      replace: function(color) {
        var Editor, _cursorEnd, _cursorStart;
        if (!this.canReplace) {
          return;
        }
        this.canReplace = false;
        Editor = atom.workspace.getActiveTextEditor();
        Editor.clearSelections();
        if (this.selection.match) {
          _cursorStart = this.selection.match.start;
          _cursorEnd = this.selection.match.end;
        } else {
          _cursorStart = _cursorEnd = this.selection.column;
        }
        Editor.addSelectionForBufferRange([[this.selection.row, _cursorStart], [this.selection.row, _cursorEnd]]);
        Editor.replaceSelectedText(null, (function(_this) {
          return function() {
            return color;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var _ref;
            Editor.setCursorBufferPosition([_this.selection.row, _cursorStart]);
            Editor.clearSelections();
            if ((_ref = _this.selection.match) != null) {
              _ref.end = _cursorStart + color.length;
            }
            Editor.addSelectionForBufferRange([[_this.selection.row, _cursorStart], [_this.selection.row, _cursorStart + color.length]]);
            return setTimeout((function() {
              return _this.canReplace = true;
            }), 100);
          };
        })(this));
      },
      close: function() {
        this.element.close();
        return this.emitClose();
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9jb2xvci1waWNrZXIvbGliL0NvbG9yUGlja2VyLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSUk7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUEsR0FBQTtXQUNiO0FBQUEsTUFBQSxNQUFBLEVBQVEsSUFBUjtBQUFBLE1BRUEsVUFBQSxFQUFZLENBQUMsT0FBQSxDQUFRLHNCQUFSLENBQUQsQ0FBQSxDQUFBLENBRlo7QUFBQSxNQUdBLGFBQUEsRUFBZSxDQUFDLE9BQUEsQ0FBUSx5QkFBUixDQUFELENBQUEsQ0FBQSxDQUhmO0FBQUEsTUFJQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsbUJBQVIsQ0FBRCxDQUFBLENBQUEsQ0FKVDtBQUFBLE1BTUEsVUFBQSxFQUFZLEVBTlo7QUFBQSxNQU9BLFlBQUEsRUFBYyxTQUFDLGFBQUQsR0FBQTtlQUFtQixJQUFDLENBQUEsVUFBVyxDQUFBLGFBQUEsRUFBL0I7TUFBQSxDQVBkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtBQUFBLE1BVUEsT0FBQSxFQUFTLElBVlQ7QUFBQSxNQVdBLE9BQUEsRUFBUyxJQVhUO0FBQUEsTUFZQSxTQUFBLEVBQVcsSUFaWDtBQUFBLE1BY0EsU0FBQSxFQUFXLEVBZFg7QUFBQSxNQW1CQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sWUFBQSx1RkFBQTtBQUFBLFFBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxTQUFsQixDQUFBO0FBQUEsUUFDQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixVQUFuQixDQURqQixDQUFBO0FBQUEsUUFLQSxJQUFDLENBQUEsT0FBRCxHQUNJO0FBQUEsVUFBQSxFQUFBLEVBQU8sQ0FBQSxTQUFBLEdBQUE7QUFDSCxnQkFBQSxH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

//# sourceURL=/home/andy/.atom/packages/color-picker/lib/ColorPicker-view.coffee
