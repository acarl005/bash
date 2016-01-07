(function() {
  var $, CompositeDisposable, Emitter, InputDialog, Pty, Task, Terminal, TerminalPlusView, View, lastActiveElement, lastOpenedView, os, path, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Task = _ref.Task, CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, View = _ref1.View;

  Pty = require.resolve('./process');

  Terminal = require('term.js');

  InputDialog = null;

  path = require('path');

  os = require('os');

  lastOpenedView = null;

  lastActiveElement = null;

  module.exports = TerminalPlusView = (function(_super) {
    __extends(TerminalPlusView, _super);

    function TerminalPlusView() {
      this.blurTerminal = __bind(this.blurTerminal, this);
      this.focusTerminal = __bind(this.focusTerminal, this);
      this.blur = __bind(this.blur, this);
      this.focus = __bind(this.focus, this);
      this.resizePanel = __bind(this.resizePanel, this);
      this.resizeStopped = __bind(this.resizeStopped, this);
      this.resizeStarted = __bind(this.resizeStarted, this);
      this.onWindowResize = __bind(this.onWindowResize, this);
      this.hide = __bind(this.hide, this);
      this.open = __bind(this.open, this);
      this.recieveItemOrFile = __bind(this.recieveItemOrFile, this);
      this.setAnimationSpeed = __bind(this.setAnimationSpeed, this);
      return TerminalPlusView.__super__.constructor.apply(this, arguments);
    }

    TerminalPlusView.prototype.animating = false;

    TerminalPlusView.prototype.id = '';

    TerminalPlusView.prototype.maximized = false;

    TerminalPlusView.prototype.opened = false;

    TerminalPlusView.prototype.pwd = '';

    TerminalPlusView.prototype.windowHeight = $(window).height();

    TerminalPlusView.prototype.rowHeight = 20;

    TerminalPlusView.prototype.shell = '';

    TerminalPlusView.prototype.tabView = false;

    TerminalPlusView.content = function() {
      return this.div({
        "class": 'terminal-plus terminal-view',
        outlet: 'terminalPlusView'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'panel-divider',
            outlet: 'panelDivider'
          });
          _this.div({
            "class": 'btn-toolbar',
            outlet: 'toolbar'
          }, function() {
            _this.button({
              outlet: 'closeBtn',
              "class": 'btn inline-block-tight right',
              click: 'destroy'
            }, function() {
              return _this.span({
                "class": 'icon icon-x'
              });
            });
            _this.button({
              outlet: 'hideBtn',
              "class": 'btn inline-block-tight right',
              click: 'hide'
            }, function() {
              return _this.span({
                "class": 'icon icon-chevron-down'
              });
            });
            _this.button({
              outlet: 'maximizeBtn',
              "class": 'btn inline-block-tight right',
              click: 'maximize'
            }, function() {
              return _this.span({
                "class": 'icon icon-screen-full'
              });
            });
            return _this.button({
              outlet: 'inputBtn',
              "class": 'btn inline-block-tight left',
              click: 'inputDialog'
            }, function() {
              return _this.span({
                "class": 'icon icon-keyboard'
              });
            });
          });
          return _this.div({
            "class": 'xterm',
            outlet: 'xterm'
          });
        };
      })(this));
    };

    TerminalPlusView.getFocusedTerminal = function() {
      return Terminal.Terminal.focus;
    };

    TerminalPlusView.prototype.initialize = function(id, pwd, statusIcon, statusBar, shell, args) {
      var bottomHeight, override, percent;
      this.id = id;
      this.pwd = pwd;
      this.statusIcon = statusIcon;
      this.statusBar = statusBar;
      this.shell = shell;
      this.args = args != null ? args : [];
      this.subscriptions = new CompositeDisposable;
      this.emitter = new Emitter;
      this.subscriptions.add(atom.tooltips.add(this.closeBtn, {
        title: 'Close'
      }));
      this.subscriptions.add(atom.tooltips.add(this.hideBtn, {
        title: 'Hide'
      }));
      this.subscriptions.add(this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
        title: 'Fullscreen'
      }));
      this.inputBtn.tooltip = atom.tooltips.add(this.inputBtn, {
        title: 'Insert Text'
      });
      this.prevHeight = atom.config.get('terminal-plus.style.defaultPanelHeight');
      if (this.prevHeight.indexOf('%') > 0) {
        percent = Math.abs(Math.min(parseFloat(this.prevHeight) / 100.0, 1));
        bottomHeight = $('atom-panel.bottom').children(".terminal-view").height() || 0;
        this.prevHeight = percent * ($('.item-views').height() + bottomHeight);
      }
      this.xterm.height(0);
      this.setAnimationSpeed();
      this.subscriptions.add(atom.config.onDidChange('terminal-plus.style.animationSpeed', this.setAnimationSpeed));
      override = function(event) {
        if (event.originalEvent.dataTransfer.getData('terminal-plus') === 'true') {
          return;
        }
        event.preventDefault();
        return event.stopPropagation();
      };
      this.xterm.on('mouseup', (function(_this) {
        return function(event) {
          var text;
          if (event.which !== 3) {
            text = window.getSelection().toString();
            if (!text) {
              return _this.focus();
            }
          }
        };
      })(this));
      this.xterm.on('dragenter', override);
      this.xterm.on('dragover', override);
      this.xterm.on('drop', this.recieveItemOrFile);
      this.on('focus', this.focus);
      return this.subscriptions.add({
        dispose: (function(_this) {
          return function() {
            return _this.off('focus', _this.focus);
          };
        })(this)
      });
    };

    TerminalPlusView.prototype.attach = function() {
      if (this.panel != null) {
        return;
      }
      return this.panel = atom.workspace.addBottomPanel({
        item: this,
        visible: false
      });
    };

    TerminalPlusView.prototype.setAnimationSpeed = function() {
      this.animationSpeed = atom.config.get('terminal-plus.style.animationSpeed');
      if (this.animationSpeed === 0) {
        this.animationSpeed = 100;
      }
      return this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
    };

    TerminalPlusView.prototype.recieveItemOrFile = function(event) {
      var dataTransfer, file, filePath, _i, _len, _ref2, _results;
      event.preventDefault();
      event.stopPropagation();
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('atom-event') === 'true') {
        filePath = dataTransfer.getData('text/plain');
        if (filePath) {
          return this.input("" + filePath + " ");
        }
      } else if (filePath = dataTransfer.getData('initialPath')) {
        return this.input("" + filePath + " ");
      } else if (dataTransfer.files.length > 0) {
        _ref2 = dataTransfer.files;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          file = _ref2[_i];
          _results.push(this.input("" + file.path + " "));
        }
        return _results;
      }
    };

    TerminalPlusView.prototype.forkPtyProcess = function() {
      return Task.once(Pty, path.resolve(this.pwd), this.shell, this.args, (function(_this) {
        return function() {
          _this.input = function() {};
          return _this.resize = function() {};
        };
      })(this));
    };

    TerminalPlusView.prototype.getId = function() {
      return this.id;
    };

    TerminalPlusView.prototype.displayTerminal = function() {
      var cols, rows, _ref2;
      _ref2 = this.getDimensions(), cols = _ref2.cols, rows = _ref2.rows;
      this.ptyProcess = this.forkPtyProcess();
      this.terminal = new Terminal({
        cursorBlink: false,
        scrollback: atom.config.get('terminal-plus.core.scrollback'),
        cols: cols,
        rows: rows
      });
      this.attachListeners();
      this.attachResizeEvents();
      this.attachWindowEvents();
      return this.terminal.open(this.xterm.get(0));
    };

    TerminalPlusView.prototype.attachListeners = function() {
      this.ptyProcess.on("terminal-plus:data", (function(_this) {
        return function(data) {
          return _this.terminal.write(data);
        };
      })(this));
      this.ptyProcess.on("terminal-plus:exit", (function(_this) {
        return function() {
          if (atom.config.get('terminal-plus.toggles.autoClose')) {
            return _this.destroy();
          }
        };
      })(this));
      this.terminal.end = (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this);
      this.terminal.on("data", (function(_this) {
        return function(data) {
          return _this.input(data);
        };
      })(this));
      this.ptyProcess.on("terminal-plus:title", (function(_this) {
        return function(title) {
          return _this.process = title;
        };
      })(this));
      this.terminal.on("title", (function(_this) {
        return function(title) {
          return _this.title = title;
        };
      })(this));
      return this.terminal.once("open", (function(_this) {
        return function() {
          var autoRunCommand;
          _this.applyStyle();
          _this.resizeTerminalToView();
          if (_this.ptyProcess.childProcess == null) {
            return;
          }
          autoRunCommand = atom.config.get('terminal-plus.core.autoRunCommand');
          if (autoRunCommand) {
            return _this.input("" + autoRunCommand + os.EOL);
          }
        };
      })(this));
    };

    TerminalPlusView.prototype.destroy = function() {
      var _ref2, _ref3;
      this.subscriptions.dispose();
      this.statusIcon.destroy();
      this.statusBar.removeTerminalView(this);
      this.detachResizeEvents();
      this.detachWindowEvents();
      if (this.panel.isVisible()) {
        this.hide();
        this.onTransitionEnd((function(_this) {
          return function() {
            return _this.panel.destroy();
          };
        })(this));
      } else {
        this.panel.destroy();
      }
      if (this.statusIcon && this.statusIcon.parentNode) {
        this.statusIcon.parentNode.removeChild(this.statusIcon);
      }
      if ((_ref2 = this.ptyProcess) != null) {
        _ref2.terminate();
      }
      return (_ref3 = this.terminal) != null ? _ref3.destroy() : void 0;
    };

    TerminalPlusView.prototype.maximize = function() {
      var btn;
      this.subscriptions.remove(this.maximizeBtn.tooltip);
      this.maximizeBtn.tooltip.dispose();
      this.maxHeight = this.prevHeight + $('.item-views').height();
      btn = this.maximizeBtn.children('span');
      this.onTransitionEnd((function(_this) {
        return function() {
          return _this.focus();
        };
      })(this));
      if (this.maximized) {
        this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
          title: 'Fullscreen'
        });
        this.subscriptions.add(this.maximizeBtn.tooltip);
        this.adjustHeight(this.prevHeight);
        btn.removeClass('icon-screen-normal').addClass('icon-screen-full');
        return this.maximized = false;
      } else {
        this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
          title: 'Normal'
        });
        this.subscriptions.add(this.maximizeBtn.tooltip);
        this.adjustHeight(this.maxHeight);
        btn.removeClass('icon-screen-full').addClass('icon-screen-normal');
        return this.maximized = true;
      }
    };

    TerminalPlusView.prototype.open = function() {
      var icon;
      if (lastActiveElement == null) {
        lastActiveElement = $(document.activeElement);
      }
      if (lastOpenedView && lastOpenedView !== this) {
        if (lastOpenedView.maximized) {
          this.subscriptions.remove(this.maximizeBtn.tooltip);
          this.maximizeBtn.tooltip.dispose();
          icon = this.maximizeBtn.children('span');
          this.maxHeight = lastOpenedView.maxHeight;
          this.maximizeBtn.tooltip = atom.tooltips.add(this.maximizeBtn, {
            title: 'Normal'
          });
          this.subscriptions.add(this.maximizeBtn.tooltip);
          icon.removeClass('icon-screen-full').addClass('icon-screen-normal');
          this.maximized = true;
        }
        lastOpenedView.hide();
      }
      lastOpenedView = this;
      this.statusBar.setActiveTerminalView(this);
      this.statusIcon.activate();
      this.onTransitionEnd((function(_this) {
        return function() {
          if (!_this.opened) {
            _this.opened = true;
            _this.displayTerminal();
            _this.prevHeight = _this.nearestRow(_this.xterm.height());
            return _this.xterm.height(_this.prevHeight);
          } else {
            return _this.focus();
          }
        };
      })(this));
      this.panel.show();
      this.xterm.height(0);
      this.animating = true;
      return this.xterm.height(this.maximized ? this.maxHeight : this.prevHeight);
    };

    TerminalPlusView.prototype.hide = function() {
      var _ref2;
      if ((_ref2 = this.terminal) != null) {
        _ref2.blur();
      }
      lastOpenedView = null;
      this.statusIcon.deactivate();
      this.onTransitionEnd((function(_this) {
        return function() {
          _this.panel.hide();
          if (lastOpenedView == null) {
            if (lastActiveElement != null) {
              lastActiveElement.focus();
              return lastActiveElement = null;
            }
          }
        };
      })(this));
      this.xterm.height(this.maximized ? this.maxHeight : this.prevHeight);
      this.animating = true;
      return this.xterm.height(0);
    };

    TerminalPlusView.prototype.toggle = function() {
      if (this.animating) {
        return;
      }
      if (this.panel.isVisible()) {
        return this.hide();
      } else {
        return this.open();
      }
    };

    TerminalPlusView.prototype.input = function(data) {
      if (this.ptyProcess.childProcess == null) {
        return;
      }
      this.terminal.stopScrolling();
      return this.ptyProcess.send({
        event: 'input',
        text: data
      });
    };

    TerminalPlusView.prototype.resize = function(cols, rows) {
      if (this.ptyProcess.childProcess == null) {
        return;
      }
      return this.ptyProcess.send({
        event: 'resize',
        rows: rows,
        cols: cols
      });
    };

    TerminalPlusView.prototype.applyStyle = function() {
      var config, defaultFont, editorFont, editorFontSize, overrideFont, overrideFontSize, _ref2, _ref3;
      config = atom.config.get('terminal-plus');
      this.xterm.addClass(config.style.theme);
      if (config.toggles.cursorBlink) {
        this.xterm.addClass('cursor-blink');
      }
      editorFont = atom.config.get('editor.fontFamily');
      defaultFont = "Menlo, Consolas, 'DejaVu Sans Mono', monospace";
      overrideFont = config.style.fontFamily;
      this.terminal.element.style.fontFamily = overrideFont || editorFont || defaultFont;
      this.subscriptions.add(atom.config.onDidChange('editor.fontFamily', (function(_this) {
        return function(event) {
          editorFont = event.newValue;
          return _this.terminal.element.style.fontFamily = overrideFont || editorFont || defaultFont;
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('terminal-plus.style.fontFamily', (function(_this) {
        return function(event) {
          overrideFont = event.newValue;
          return _this.terminal.element.style.fontFamily = overrideFont || editorFont || defaultFont;
        };
      })(this)));
      editorFontSize = atom.config.get('editor.fontSize');
      overrideFontSize = config.style.fontSize;
      this.terminal.element.style.fontSize = "" + (overrideFontSize || editorFontSize) + "px";
      this.subscriptions.add(atom.config.onDidChange('editor.fontSize', (function(_this) {
        return function(event) {
          editorFontSize = event.newValue;
          _this.terminal.element.style.fontSize = "" + (overrideFontSize || editorFontSize) + "px";
          return _this.resizeTerminalToView();
        };
      })(this)));
      this.subscriptions.add(atom.config.onDidChange('terminal-plus.style.fontSize', (function(_this) {
        return function(event) {
          overrideFontSize = event.newValue;
          _this.terminal.element.style.fontSize = "" + (overrideFontSize || editorFontSize) + "px";
          return _this.resizeTerminalToView();
        };
      })(this)));
      [].splice.apply(this.terminal.colors, [0, 8].concat(_ref2 = [config.ansiColors.normal.black.toHexString(), config.ansiColors.normal.red.toHexString(), config.ansiColors.normal.green.toHexString(), config.ansiColors.normal.yellow.toHexString(), config.ansiColors.normal.blue.toHexString(), config.ansiColors.normal.magenta.toHexString(), config.ansiColors.normal.cyan.toHexString(), config.ansiColors.normal.white.toHexString()])), _ref2;
      return ([].splice.apply(this.terminal.colors, [8, 8].concat(_ref3 = [config.ansiColors.zBright.brightBlack.toHexString(), config.ansiColors.zBright.brightRed.toHexString(), config.ansiColors.zBright.brightGreen.toHexString(), config.ansiColors.zBright.brightYellow.toHexString(), config.ansiColors.zBright.brightBlue.toHexString(), config.ansiColors.zBright.brightMagenta.toHexString(), config.ansiColors.zBright.brightCyan.toHexString(), config.ansiColors.zBright.brightWhite.toHexString()])), _ref3);
    };

    TerminalPlusView.prototype.attachWindowEvents = function() {
      return $(window).on('resize', this.onWindowResize);
    };

    TerminalPlusView.prototype.detachWindowEvents = function() {
      return $(window).off('resize', this.onWindowResize);
    };

    TerminalPlusView.prototype.attachResizeEvents = function() {
      return this.panelDivider.on('mousedown', this.resizeStarted);
    };

    TerminalPlusView.prototype.detachResizeEvents = function() {
      return this.panelDivider.off('mousedown');
    };

    TerminalPlusView.prototype.onWindowResize = function() {
      var bottomPanel, clamped, delta, newHeight, overflow;
      if (!this.tabView) {
        this.xterm.css('transition', '');
        newHeight = $(window).height();
        bottomPanel = $('atom-panel-container.bottom').first().get(0);
        overflow = bottomPanel.scrollHeight - bottomPanel.offsetHeight;
        delta = newHeight - this.windowHeight;
        this.windowHeight = newHeight;
        if (this.maximized) {
          clamped = Math.max(this.maxHeight + delta, this.rowHeight);
          if (this.panel.isVisible()) {
            this.adjustHeight(clamped);
          }
          this.maxHeight = clamped;
          this.prevHeight = Math.min(this.prevHeight, this.maxHeight);
        } else if (overflow > 0) {
          clamped = Math.max(this.nearestRow(this.prevHeight + delta), this.rowHeight);
          if (this.panel.isVisible()) {
            this.adjustHeight(clamped);
          }
          this.prevHeight = clamped;
        }
        this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
      }
      return this.resizeTerminalToView();
    };

    TerminalPlusView.prototype.resizeStarted = function() {
      if (this.maximized) {
        return;
      }
      this.maxHeight = this.prevHeight + $('.item-views').height();
      $(document).on('mousemove', this.resizePanel);
      $(document).on('mouseup', this.resizeStopped);
      return this.xterm.css('transition', '');
    };

    TerminalPlusView.prototype.resizeStopped = function() {
      $(document).off('mousemove', this.resizePanel);
      $(document).off('mouseup', this.resizeStopped);
      return this.xterm.css('transition', "height " + (0.25 / this.animationSpeed) + "s linear");
    };

    TerminalPlusView.prototype.nearestRow = function(value) {
      var rows;
      rows = Math.floor(value / this.rowHeight);
      return rows * this.rowHeight;
    };

    TerminalPlusView.prototype.resizePanel = function(event) {
      var clamped, delta, mouseY;
      if (event.which !== 1) {
        return this.resizeStopped();
      }
      mouseY = $(window).height() - event.pageY;
      delta = mouseY - $('atom-panel-container.bottom').height();
      if (!(Math.abs(delta) > (this.rowHeight * 5 / 6))) {
        return;
      }
      clamped = Math.max(this.nearestRow(this.prevHeight + delta), this.rowHeight);
      if (clamped > this.maxHeight) {
        return;
      }
      this.xterm.height(clamped);
      $(this.terminal.element).height(clamped);
      this.prevHeight = clamped;
      return this.resizeTerminalToView();
    };

    TerminalPlusView.prototype.adjustHeight = function(height) {
      this.xterm.height(height);
      return $(this.terminal.element).height(height);
    };

    TerminalPlusView.prototype.copy = function() {
      var lines, rawLines, rawText, text, textarea;
      if (this.terminal._selected) {
        textarea = this.terminal.getCopyTextarea();
        text = this.terminal.grabText(this.terminal._selected.x1, this.terminal._selected.x2, this.terminal._selected.y1, this.terminal._selected.y2);
      } else {
        rawText = this.terminal.context.getSelection().toString();
        rawLines = rawText.split(/\r?\n/g);
        lines = rawLines.map(function(line) {
          return line.replace(/\s/g, " ").trimRight();
        });
        text = lines.join("\n");
      }
      return atom.clipboard.write(text);
    };

    TerminalPlusView.prototype.paste = function() {
      return this.input(atom.clipboard.read());
    };

    TerminalPlusView.prototype.insertSelection = function() {
      var cursor, editor, line, runCommand, selection;
      if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
      }
      runCommand = atom.config.get('terminal-plus.toggles.runInsertedText');
      if (selection = editor.getSelectedText()) {
        this.terminal.stopScrolling();
        return this.input("" + selection + (runCommand ? os.EOL : ''));
      } else if (cursor = editor.getCursorBufferPosition()) {
        line = editor.lineTextForBufferRow(cursor.row);
        this.terminal.stopScrolling();
        this.input("" + line + (runCommand ? os.EOL : ''));
        return editor.moveDown(1);
      }
    };

    TerminalPlusView.prototype.focus = function() {
      this.resizeTerminalToView();
      this.focusTerminal();
      this.statusBar.setActiveTerminalView(this);
      return TerminalPlusView.__super__.focus.call(this);
    };

    TerminalPlusView.prototype.blur = function() {
      this.blurTerminal();
      return TerminalPlusView.__super__.blur.call(this);
    };

    TerminalPlusView.prototype.focusTerminal = function() {
      if (!this.terminal) {
        return;
      }
      this.terminal.focus();
      if (this.terminal._textarea) {
        return this.terminal._textarea.focus();
      } else {
        return this.terminal.element.focus();
      }
    };

    TerminalPlusView.prototype.blurTerminal = function() {
      if (!this.terminal) {
        return;
      }
      this.terminal.blur();
      return this.terminal.element.blur();
    };

    TerminalPlusView.prototype.resizeTerminalToView = function() {
      var cols, rows, _ref2;
      if (!(this.panel.isVisible() || this.tabView)) {
        return;
      }
      _ref2 = this.getDimensions(), cols = _ref2.cols, rows = _ref2.rows;
      if (!(cols > 0 && rows > 0)) {
        return;
      }
      if (!this.terminal) {
        return;
      }
      if (this.terminal.rows === rows && this.terminal.cols === cols) {
        return;
      }
      this.resize(cols, rows);
      return this.terminal.resize(cols, rows);
    };

    TerminalPlusView.prototype.getDimensions = function() {
      var cols, fakeCol, fakeRow, rows;
      fakeRow = $("<div><span>&nbsp;</span></div>");
      if (this.terminal) {
        this.find('.terminal').append(fakeRow);
        fakeCol = fakeRow.children().first()[0].getBoundingClientRect();
        cols = Math.floor(this.xterm.width() / (fakeCol.width || 9));
        rows = Math.floor(this.xterm.height() / (fakeCol.height || 20));
        this.rowHeight = fakeCol.height;
        fakeRow.remove();
      } else {
        cols = Math.floor(this.xterm.width() / 9);
        rows = Math.floor(this.xterm.height() / 20);
      }
      return {
        cols: cols,
        rows: rows
      };
    };

    TerminalPlusView.prototype.onTransitionEnd = function(callback) {
      return this.xterm.one('webkitTransitionEnd', (function(_this) {
        return function() {
          callback();
          return _this.animating = false;
        };
      })(this));
    };

    TerminalPlusView.prototype.inputDialog = function() {
      var dialog;
      if (InputDialog == null) {
        InputDialog = require('./input-dialog');
      }
      dialog = new InputDialog(this);
      return dialog.attach();
    };

    TerminalPlusView.prototype.rename = function() {
      return this.statusIcon.rename();
    };

    TerminalPlusView.prototype.toggleTabView = function() {
      if (this.tabView) {
        this.panel = atom.workspace.addBottomPanel({
          item: this,
          visible: false
        });
        this.attachResizeEvents();
        this.closeBtn.show();
        this.hideBtn.show();
        this.maximizeBtn.show();
        return this.tabView = false;
      } else {
        this.panel.destroy();
        this.detachResizeEvents();
        this.closeBtn.hide();
        this.hideBtn.hide();
        this.maximizeBtn.hide();
        this.xterm.css("height", "");
        this.tabView = true;
        if (lastOpenedView === this) {
          return lastOpenedView = null;
        }
      }
    };

    TerminalPlusView.prototype.getTitle = function() {
      return this.statusIcon.getName() || "Terminal-Plus";
    };

    TerminalPlusView.prototype.getIconName = function() {
      return "terminal";
    };

    TerminalPlusView.prototype.getShell = function() {
      return path.basename(this.shell);
    };

    TerminalPlusView.prototype.getShellPath = function() {
      return this.shell;
    };

    TerminalPlusView.prototype.emit = function(event, data) {
      return this.emitter.emit(event, data);
    };

    TerminalPlusView.prototype.onDidChangeTitle = function(callback) {
      return this.emitter.on('did-change-title', callback);
    };

    TerminalPlusView.prototype.getPath = function() {
      return this.getTerminalTitle();
    };

    TerminalPlusView.prototype.getTerminalTitle = function() {
      return this.title || this.process;
    };

    TerminalPlusView.prototype.getTerminal = function() {
      return this.terminal;
    };

    TerminalPlusView.prototype.isAnimating = function() {
      return this.animating;
    };

    return TerminalPlusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC1wbHVzL2xpYi92aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxtSkFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQXVDLE9BQUEsQ0FBUSxNQUFSLENBQXZDLEVBQUMsWUFBQSxJQUFELEVBQU8sMkJBQUEsbUJBQVAsRUFBNEIsZUFBQSxPQUE1QixDQUFBOztBQUFBLEVBQ0EsUUFBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFVBQUEsQ0FBRCxFQUFJLGFBQUEsSUFESixDQUFBOztBQUFBLEVBR0EsR0FBQSxHQUFNLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFdBQWhCLENBSE4sQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsU0FBUixDQUpYLENBQUE7O0FBQUEsRUFLQSxXQUFBLEdBQWMsSUFMZCxDQUFBOztBQUFBLEVBT0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBUFAsQ0FBQTs7QUFBQSxFQVFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQVJMLENBQUE7O0FBQUEsRUFVQSxjQUFBLEdBQWlCLElBVmpCLENBQUE7O0FBQUEsRUFXQSxpQkFBQSxHQUFvQixJQVhwQixDQUFBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVDQUFBLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSwrQkFBQSxTQUFBLEdBQVcsS0FBWCxDQUFBOztBQUFBLCtCQUNBLEVBQUEsR0FBSSxFQURKLENBQUE7O0FBQUEsK0JBRUEsU0FBQSxHQUFXLEtBRlgsQ0FBQTs7QUFBQSwrQkFHQSxNQUFBLEdBQVEsS0FIUixDQUFBOztBQUFBLCtCQUlBLEdBQUEsR0FBSyxFQUpMLENBQUE7O0FBQUEsK0JBS0EsWUFBQSxH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

//# sourceURL=/home/andy/.atom/packages/terminal-plus/lib/view.coffee
