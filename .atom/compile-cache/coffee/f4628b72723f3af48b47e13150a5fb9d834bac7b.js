(function() {
  var $, CompositeDisposable, StatusBar, StatusIcon, TerminalPlusView, View, path, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  TerminalPlusView = require('./view');

  StatusIcon = require('./status-icon');

  path = require('path');

  module.exports = StatusBar = (function(_super) {
    __extends(StatusBar, _super);

    function StatusBar() {
      this.moveTerminalView = __bind(this.moveTerminalView, this);
      this.onDropTabBar = __bind(this.onDropTabBar, this);
      this.onDrop = __bind(this.onDrop, this);
      this.onDragOver = __bind(this.onDragOver, this);
      this.onDragEnd = __bind(this.onDragEnd, this);
      this.onDragLeave = __bind(this.onDragLeave, this);
      this.onDragStart = __bind(this.onDragStart, this);
      this.closeAll = __bind(this.closeAll, this);
      return StatusBar.__super__.constructor.apply(this, arguments);
    }

    StatusBar.prototype.terminalViews = [];

    StatusBar.prototype.activeTerminal = null;

    StatusBar.prototype.returnFocus = null;

    StatusBar.content = function() {
      return this.div({
        "class": 'terminal-plus status-bar',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.i({
            "class": "icon icon-plus",
            click: 'newTerminalView',
            outlet: 'plusBtn'
          });
          _this.ul({
            "class": "list-inline status-container",
            tabindex: '-1',
            outlet: 'statusContainer',
            is: 'space-pen-ul'
          });
          return _this.i({
            "class": "icon icon-x",
            click: 'closeAll',
            outlet: 'closeBtn'
          });
        };
      })(this));
    };

    StatusBar.prototype.initialize = function() {
      var handleBlur, handleFocus;
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'terminal-plus:new': (function(_this) {
          return function() {
            return _this.newTerminalView();
          };
        })(this),
        'terminal-plus:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'terminal-plus:next': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activeNextTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'terminal-plus:prev': (function(_this) {
          return function() {
            if (!_this.activeTerminal) {
              return;
            }
            if (_this.activeTerminal.isAnimating()) {
              return;
            }
            if (_this.activePrevTerminalView()) {
              return _this.activeTerminal.open();
            }
          };
        })(this),
        'terminal-plus:close': (function(_this) {
          return function() {
            return _this.destroyActiveTerm();
          };
        })(this),
        'terminal-plus:close-all': (function(_this) {
          return function() {
            return _this.closeAll();
          };
        })(this),
        'terminal-plus:rename': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.rename();
            });
          };
        })(this),
        'terminal-plus:insert-selected-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.insertSelection();
            });
          };
        })(this),
        'terminal-plus:insert-text': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.inputDialog();
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('.xterm', {
        'terminal-plus:paste': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.paste();
            });
          };
        })(this),
        'terminal-plus:copy': (function(_this) {
          return function() {
            return _this.runInActiveView(function(i) {
              return i.copy();
            });
          };
        })(this)
      }));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          var mapping, nextTerminal, prevTerminal;
          if (item == null) {
            return;
          }
          if (item.constructor.name === "TerminalPlusView") {
            return setTimeout(item.focus, 100);
          } else if (item.constructor.name === "TextEditor") {
            mapping = atom.config.get('terminal-plus.core.mapTerminalsTo');
            if (mapping === 'None') {
              return;
            }
            switch (mapping) {
              case 'File':
                nextTerminal = _this.getTerminalById(item.getPath(), function(view) {
                  return view.getId().filePath;
                });
                break;
              case 'Folder':
                nextTerminal = _this.getTerminalById(path.dirname(item.getPath()), function(view) {
                  return view.getId().folderPath;
                });
            }
            prevTerminal = _this.getActiveTerminalView();
            if (prevTerminal !== nextTerminal) {
              if (nextTerminal == null) {
                if (item.getTitle() !== 'untitled') {
                  if (atom.config.get('terminal-plus.core.mapTerminalsToAutoOpen')) {
                    return nextTerminal = _this.createTerminalView();
                  }
                }
              } else {
                _this.setActiveTerminalView(nextTerminal);
                if (prevTerminal != null ? prevTerminal.panel.isVisible() : void 0) {
                  return nextTerminal.toggle();
                }
              }
            }
          }
        };
      })(this)));
      this.registerContextMenu();
      this.subscriptions.add(atom.tooltips.add(this.plusBtn, {
        title: 'New Terminal'
      }));
      this.subscriptions.add(atom.tooltips.add(this.closeBtn, {
        title: 'Close All'
      }));
      this.statusContainer.on('dblclick', (function(_this) {
        return function(event) {
          if (event.target === event.delegateTarget) {
            return _this.newTerminalView();
          }
        };
      })(this));
      this.statusContainer.on('dragstart', '.status-icon', this.onDragStart);
      this.statusContainer.on('dragend', '.status-icon', this.onDragEnd);
      this.statusContainer.on('dragleave', this.onDragLeave);
      this.statusContainer.on('dragover', this.onDragOver);
      this.statusContainer.on('drop', this.onDrop);
      handleBlur = (function(_this) {
        return function() {
          var terminal;
          if (terminal = TerminalPlusView.getFocusedTerminal()) {
            _this.returnFocus = _this.terminalViewForTerminal(terminal);
            return terminal.blur();
          }
        };
      })(this);
      handleFocus = (function(_this) {
        return function() {
          if (_this.returnFocus) {
            return setTimeout(function() {
              _this.returnFocus.focus();
              return _this.returnFocus = null;
            }, 100);
          }
        };
      })(this);
      window.addEventListener('blur', handleBlur);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('blur', handleBlur);
        }
      });
      window.addEventListener('focus', handleFocus);
      this.subscriptions.add({
        dispose: function() {
          return window.removeEventListener('focus', handleFocus);
        }
      });
      return this.attach();
    };

    StatusBar.prototype.registerContextMenu = function() {
      return this.subscriptions.add(atom.commands.add('.terminal-plus.status-bar', {
        'terminal-plus:status-red': this.setStatusColor,
        'terminal-plus:status-orange': this.setStatusColor,
        'terminal-plus:status-yellow': this.setStatusColor,
        'terminal-plus:status-green': this.setStatusColor,
        'terminal-plus:status-blue': this.setStatusColor,
        'terminal-plus:status-purple': this.setStatusColor,
        'terminal-plus:status-pink': this.setStatusColor,
        'terminal-plus:status-cyan': this.setStatusColor,
        'terminal-plus:status-magenta': this.setStatusColor,
        'terminal-plus:status-default': this.clearStatusColor,
        'terminal-plus:context-close': function(event) {
          return $(event.target).closest('.status-icon')[0].terminalView.destroy();
        },
        'terminal-plus:context-hide': function(event) {
          var statusIcon;
          statusIcon = $(event.target).closest('.status-icon')[0];
          if (statusIcon.isActive()) {
            return statusIcon.terminalView.hide();
          }
        },
        'terminal-plus:context-rename': function(event) {
          return $(event.target).closest('.status-icon')[0].rename();
        }
      }));
    };

    StatusBar.prototype.registerPaneSubscription = function() {
      return this.subscriptions.add(this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneElement, tabBar;
          paneElement = $(atom.views.getView(pane));
          tabBar = paneElement.find('ul');
          tabBar.on('drop', function(event) {
            return _this.onDropTabBar(event, pane);
          });
          tabBar.on('dragstart', function(event) {
            var _ref1;
            if (((_ref1 = event.target.item) != null ? _ref1.constructor.name : void 0) !== 'TerminalPlusView') {
              return;
            }
            return event.originalEvent.dataTransfer.setData('terminal-plus-tab', 'true');
          });
          return pane.onDidDestroy(function() {
            return tabBar.off('drop', this.onDropTabBar);
          });
        };
      })(this)));
    };

    StatusBar.prototype.createTerminalView = function() {
      var args, directory, editorFolder, editorPath, home, id, projectFolder, pwd, shell, shellArguments, statusIcon, terminalPlusView, _i, _len, _ref1, _ref2;
      if (this.paneSubscription == null) {
        this.registerPaneSubscription();
      }
      projectFolder = atom.project.getPaths()[0];
      editorPath = (_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0;
      if (editorPath != null) {
        editorFolder = path.dirname(editorPath);
        _ref2 = atom.project.getPaths();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          directory = _ref2[_i];
          if (editorPath.indexOf(directory) >= 0) {
            projectFolder = directory;
          }
        }
      }
      if ((projectFolder != null ? projectFolder.indexOf('atom://') : void 0) >= 0) {
        projectFolder = void 0;
      }
      home = process.platform === 'win32' ? process.env.HOMEPATH : process.env.HOME;
      switch (atom.config.get('terminal-plus.core.workingDirectory')) {
        case 'Project':
          pwd = projectFolder || editorFolder || home;
          break;
        case 'Active File':
          pwd = editorFolder || projectFolder || home;
          break;
        default:
          pwd = home;
      }
      id = editorPath || projectFolder || home;
      id = {
        filePath: id,
        folderPath: path.dirname(id)
      };
      shell = atom.config.get('terminal-plus.core.shell');
      shellArguments = atom.config.get('terminal-plus.core.shellArguments');
      args = shellArguments.split(/\s+/g).filter(function(arg) {
        return arg;
      });
      statusIcon = new StatusIcon();
      terminalPlusView = new TerminalPlusView(id, pwd, statusIcon, this, shell, args);
      statusIcon.initialize(terminalPlusView);
      terminalPlusView.attach();
      this.terminalViews.push(terminalPlusView);
      this.statusContainer.append(statusIcon);
      return terminalPlusView;
    };

    StatusBar.prototype.activeNextTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index + 1);
    };

    StatusBar.prototype.activePrevTerminalView = function() {
      var index;
      index = this.indexOf(this.activeTerminal);
      if (index < 0) {
        return false;
      }
      return this.activeTerminalView(index - 1);
    };

    StatusBar.prototype.indexOf = function(view) {
      return this.terminalViews.indexOf(view);
    };

    StatusBar.prototype.activeTerminalView = function(index) {
      if (this.terminalViews.length < 2) {
        return false;
      }
      if (index >= this.terminalViews.length) {
        index = 0;
      }
      if (index < 0) {
        index = this.terminalViews.length - 1;
      }
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.getActiveTerminalView = function() {
      return this.activeTerminal;
    };

    StatusBar.prototype.getTerminalById = function(target, selector) {
      var index, terminal, _i, _ref1;
      if (selector == null) {
        selector = function(terminal) {
          return terminal.id;
        };
      }
      for (index = _i = 0, _ref1 = this.terminalViews.length; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; index = 0 <= _ref1 ? ++_i : --_i) {
        terminal = this.terminalViews[index];
        if (terminal != null) {
          if (selector(terminal) === target) {
            return terminal;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.terminalViewForTerminal = function(terminal) {
      var index, terminalView, _i, _ref1;
      for (index = _i = 0, _ref1 = this.terminalViews.length; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; index = 0 <= _ref1 ? ++_i : --_i) {
        terminalView = this.terminalViews[index];
        if (terminalView != null) {
          if (terminalView.getTerminal() === terminal) {
            return terminalView;
          }
        }
      }
      return null;
    };

    StatusBar.prototype.runInActiveView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if (view != null) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.runInOpenView = function(callback) {
      var view;
      view = this.getActiveTerminalView();
      if ((view != null) && view.panel.isVisible()) {
        return callback(view);
      }
      return null;
    };

    StatusBar.prototype.setActiveTerminalView = function(view) {
      return this.activeTerminal = view;
    };

    StatusBar.prototype.removeTerminalView = function(view) {
      var index;
      index = this.indexOf(view);
      if (index < 0) {
        return;
      }
      this.terminalViews.splice(index, 1);
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.activateAdjacentTerminal = function(index) {
      if (index == null) {
        index = 0;
      }
      if (!(this.terminalViews.length > 0)) {
        return false;
      }
      index = Math.max(0, index - 1);
      this.activeTerminal = this.terminalViews[index];
      return true;
    };

    StatusBar.prototype.newTerminalView = function() {
      var _ref1;
      if ((_ref1 = this.activeTerminal) != null ? _ref1.animating : void 0) {
        return;
      }
      this.activeTerminal = this.createTerminalView();
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.attach = function() {
      return atom.workspace.addBottomPanel({
        item: this,
        priority: 100
      });
    };

    StatusBar.prototype.destroyActiveTerm = function() {
      var index;
      if (this.activeTerminal == null) {
        return;
      }
      index = this.indexOf(this.activeTerminal);
      this.activeTerminal.destroy();
      this.activeTerminal = null;
      return this.activateAdjacentTerminal(index);
    };

    StatusBar.prototype.closeAll = function() {
      var index, view, _i, _ref1;
      for (index = _i = _ref1 = this.terminalViews.length; _ref1 <= 0 ? _i <= 0 : _i >= 0; index = _ref1 <= 0 ? ++_i : --_i) {
        view = this.terminalViews[index];
        if (view != null) {
          view.destroy();
        }
      }
      return this.activeTerminal = null;
    };

    StatusBar.prototype.destroy = function() {
      var view, _i, _len, _ref1;
      this.subscriptions.dispose();
      _ref1 = this.terminalViews;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        view = _ref1[_i];
        view.ptyProcess.terminate();
        view.terminal.destroy();
      }
      return this.detach();
    };

    StatusBar.prototype.toggle = function() {
      if (this.terminalViews.length === 0) {
        this.activeTerminal = this.createTerminalView();
      } else if (this.activeTerminal === null) {
        this.activeTerminal = this.terminalViews[0];
      }
      return this.activeTerminal.toggle();
    };

    StatusBar.prototype.setStatusColor = function(event) {
      var color;
      color = event.type.match(/\w+$/)[0];
      color = atom.config.get("terminal-plus.iconColors." + color).toRGBAString();
      return $(event.target).closest('.status-icon').css('color', color);
    };

    StatusBar.prototype.clearStatusColor = function(event) {
      return $(event.target).closest('.status-icon').css('color', '');
    };

    StatusBar.prototype.onDragStart = function(event) {
      var element;
      event.originalEvent.dataTransfer.setData('terminal-plus-panel', 'true');
      element = $(event.target).closest('.status-icon');
      element.addClass('is-dragging');
      return event.originalEvent.dataTransfer.setData('from-index', element.index());
    };

    StatusBar.prototype.onDragLeave = function(event) {
      return this.removePlaceholder();
    };

    StatusBar.prototype.onDragEnd = function(event) {
      return this.clearDropTarget();
    };

    StatusBar.prototype.onDragOver = function(event) {
      var element, newDropTargetIndex, statusIcons;
      event.preventDefault();
      event.stopPropagation();
      if (event.originalEvent.dataTransfer.getData('terminal-plus') !== 'true') {
        return;
      }
      newDropTargetIndex = this.getDropTargetIndex(event);
      if (newDropTargetIndex == null) {
        return;
      }
      this.removeDropTargetClasses();
      statusIcons = this.statusContainer.children('.status-icon');
      if (newDropTargetIndex < statusIcons.length) {
        element = statusIcons.eq(newDropTargetIndex).addClass('is-drop-target');
        return this.getPlaceholder().insertBefore(element);
      } else {
        element = statusIcons.eq(newDropTargetIndex - 1).addClass('drop-target-is-after');
        return this.getPlaceholder().insertAfter(element);
      }
    };

    StatusBar.prototype.onDrop = function(event) {
      var dataTransfer, fromIndex, pane, paneIndex, panelEvent, tabEvent, toIndex, view;
      dataTransfer = event.originalEvent.dataTransfer;
      panelEvent = dataTransfer.getData('terminal-plus-panel') === 'true';
      tabEvent = dataTransfer.getData('terminal-plus-tab') === 'true';
      if (!(panelEvent || tabEvent)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      toIndex = this.getDropTargetIndex(event);
      this.clearDropTarget();
      if (tabEvent) {
        fromIndex = parseInt(dataTransfer.getData('sortable-index'));
        paneIndex = parseInt(dataTransfer.getData('from-pane-index'));
        pane = atom.workspace.getPanes()[paneIndex];
        view = pane.itemAtIndex(fromIndex);
        pane.removeItem(view, false);
        view.show();
        view.toggleTabView();
        this.terminalViews.push(view);
        if (view.statusIcon.isActive()) {
          view.open();
        }
        this.statusContainer.append(view.statusIcon);
        fromIndex = this.terminalViews.length - 1;
      } else {
        fromIndex = parseInt(dataTransfer.getData('from-index'));
      }
      return this.updateOrder(fromIndex, toIndex);
    };

    StatusBar.prototype.onDropTabBar = function(event, pane) {
      var dataTransfer, fromIndex, tabBar, view;
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('terminal-plus-panel') !== 'true') {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.clearDropTarget();
      fromIndex = parseInt(dataTransfer.getData('from-index'));
      view = this.terminalViews[fromIndex];
      view.css("height", "");
      view.terminal.element.style.height = "";
      tabBar = $(event.target).closest('.tab-bar');
      view.toggleTabView();
      this.removeTerminalView(view);
      this.statusContainer.children().eq(fromIndex).detach();
      view.statusIcon.removeTooltip();
      pane.addItem(view, pane.getItems().length);
      pane.activateItem(view);
      return view.focus();
    };

    StatusBar.prototype.clearDropTarget = function() {
      var element;
      element = this.find('.is-dragging');
      element.removeClass('is-dragging');
      this.removeDropTargetClasses();
      return this.removePlaceholder();
    };

    StatusBar.prototype.removeDropTargetClasses = function() {
      this.statusContainer.find('.is-drop-target').removeClass('is-drop-target');
      return this.statusContainer.find('.drop-target-is-after').removeClass('drop-target-is-after');
    };

    StatusBar.prototype.getDropTargetIndex = function(event) {
      var element, elementCenter, statusIcons, target;
      target = $(event.target);
      if (this.isPlaceholder(target)) {
        return;
      }
      statusIcons = this.statusContainer.children('.status-icon');
      element = target.closest('.status-icon');
      if (element.length === 0) {
        element = statusIcons.last();
      }
      if (!element.length) {
        return 0;
      }
      elementCenter = element.offset().left + element.width() / 2;
      if (event.originalEvent.pageX < elementCenter) {
        return statusIcons.index(element);
      } else if (element.next('.status-icon').length > 0) {
        return statusIcons.index(element.next('.status-icon'));
      } else {
        return statusIcons.index(element) + 1;
      }
    };

    StatusBar.prototype.getPlaceholder = function() {
      return this.placeholderEl != null ? this.placeholderEl : this.placeholderEl = $('<li class="placeholder"></li>');
    };

    StatusBar.prototype.removePlaceholder = function() {
      var _ref1;
      if ((_ref1 = this.placeholderEl) != null) {
        _ref1.remove();
      }
      return this.placeholderEl = null;
    };

    StatusBar.prototype.isPlaceholder = function(element) {
      return element.is('.placeholder');
    };

    StatusBar.prototype.iconAtIndex = function(index) {
      return this.getStatusIcons().eq(index);
    };

    StatusBar.prototype.getStatusIcons = function() {
      return this.statusContainer.children('.status-icon');
    };

    StatusBar.prototype.moveIconToIndex = function(icon, toIndex) {
      var container, followingIcon;
      followingIcon = this.getStatusIcons()[toIndex];
      container = this.statusContainer[0];
      if (followingIcon != null) {
        return container.insertBefore(icon, followingIcon);
      } else {
        return container.appendChild(icon);
      }
    };

    StatusBar.prototype.moveTerminalView = function(fromIndex, toIndex) {
      var activeTerminal, view;
      activeTerminal = this.getActiveTerminalView();
      view = this.terminalViews.splice(fromIndex, 1)[0];
      this.terminalViews.splice(toIndex, 0, view);
      return this.setActiveTerminalView(activeTerminal);
    };

    StatusBar.prototype.updateOrder = function(fromIndex, toIndex) {
      var icon;
      if (fromIndex === toIndex) {
        return;
      }
      if (fromIndex < toIndex) {
        toIndex--;
      }
      icon = this.getStatusIcons().eq(fromIndex).detach();
      this.moveIconToIndex(icon.get(0), toIndex);
      this.moveTerminalView(fromIndex, toIndex);
      icon.addClass('inserted');
      return icon.one('webkitAnimationEnd', function() {
        return icon.removeClass('inserted');
      });
    };

    return StatusBar;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC1wbHVzL2xpYi9zdGF0dXMtYmFyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpRkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFESixDQUFBOztBQUFBLEVBR0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLFFBQVIsQ0FIbkIsQ0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUpiLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FOUCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGdDQUFBLENBQUE7Ozs7Ozs7Ozs7OztLQUFBOztBQUFBLHdCQUFBLGFBQUEsR0FBZSxFQUFmLENBQUE7O0FBQUEsd0JBQ0EsY0FBQSxHQUFnQixJQURoQixDQUFBOztBQUFBLHdCQUVBLFdBQUEsR0FBYSxJQUZiLENBQUE7O0FBQUEsSUFJQSxTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTywwQkFBUDtBQUFBLFFBQW1DLFFBQUEsRUFBVSxDQUFBLENBQTdDO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwRCxVQUFBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxZQUFBLE9BQUEsRUFBTyxnQkFBUDtBQUFBLFlBQXlCLEtBQUEsRUFBTyxpQkFBaEM7QUFBQSxZQUFtRCxNQUFBLEVB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

//# sourceURL=/home/andy/.atom/packages/terminal-plus/lib/status-bar.coffee
