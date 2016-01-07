(function() {
  var $, ApathyView, CompositeDisposable,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  $ = require('atom-space-pen-views').$;

  module.exports = ApathyView = (function() {
    function ApathyView(serializedState) {
      this.getDebugLog = __bind(this.getDebugLog, this);
      this.debug = __bind(this.debug, this);
      this.removeLeftWrapGuides = __bind(this.removeLeftWrapGuides, this);
      this.addLeftWrapGuides = __bind(this.addLeftWrapGuides, this);
      this.updateWrapGuides = __bind(this.updateWrapGuides, this);
      this.decorateEditorView = __bind(this.decorateEditorView, this);
      this.getSetting = __bind(this.getSetting, this);
      var highlightConfigObserver, self, semHighlightPath, softWrapConfigObserver, wrapGuideConfigObserver, wrapKeyPath;
      this.packageName = require('../package.json').name;
      this.viewDisposables = new CompositeDisposable();
      self = this;
      $((function(_this) {
        return function() {
          _this.debug('Got event - jQuery.ready');

          /**
           * Initialize & decorate newly-created TextEditor instances.
           * @param {TextEditor} editor - Text editor to decorate using config.
           * @return {Disposable}
           */
          return _this.viewDisposables.add(atom.workspace.observeTextEditors(function(editor) {
            var editorView;
            editorView = atom.views.getView(editor);
            _this.decorateEditorView(editorView);
            _this.debug('event triggered - observeTextEditor');
            return setTimeout(function() {
              var wrapWith;
              wrapWith = '<span class="apathy-span"/>';
              _this.wrapTextNodes(editorView, '.line > .source', wrapWith);
              return _this.debug('Wrapped text nodes.');
            }, 500);
          }));
        };
      })(this));
      wrapKeyPath = "" + this.packageName + ".enableLeftWrapGuide";
      if (this.viewDisposables == null) {
        this.viewDisposables = new CompositeDisposable();
      }
      wrapGuideConfigObserver = atom.config.onDidChange(wrapKeyPath, (function(_this) {
        return function(isEnabled) {
          _this.debug('got event - config.enableLeftWrapGuide changed.');
          if (isEnabled) {
            return _this.forAllEditorViews(function(editorView) {
              var editorScope, theEditor;
              theEditor = editorView.model;
              editorScope = theEditor.getLastCursor().getScopeDescriptor();
              return _this.updateWrapGuides(editorView, editorScope);
            });
          } else {
            return _this.destroyLeftWrapGuides();
          }
        };
      })(this));
      this.viewDisposables.add(wrapGuideConfigObserver);
      semHighlightPath = "" + this.packageName + ".semanticHighlighting";
      highlightConfigObserver = atom.config.onDidChange(semHighlightPath, (function(_this) {
        return function(isEnabled) {
          return _this.forAllEditorViews(function(editorView) {
            var wrapWith;
            if (isEnabled) {
              wrapWith = '<span class="apathy-span"/>';
              return _this.wrapTextNodes(editorView, '.line > .source', wrapWith);
            } else {
              return _this.removeSemanticHighlights(editorView);
            }
          });
        };
      })(this));
      this.viewDisposables.add(highlightConfigObserver);
      softWrapConfigObserver = atom.config.onDidChange("editor.softWrap", (function(_this) {
        return function(isEnabled) {
          _this.debug('got event - editor.softwrap config changed');
          return _this.forAllEditorViews(function(editorView) {
            var editorModel, editorScope;
            editorModel = editorView.model;
            editorScope = editorModel.getLastCursor().getScopeDescriptor();
            return _this.updateWrapGuides(editorView, editorScope);
          });
        };
      })(this));
      this.viewDisposables.add(softWrapConfigObserver);
      this.editorDisposables = new CompositeDisposable();
      this.viewDisposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var editorScope, editorView, semanticDisposable, softWrapDisposable;
          editorView = atom.views.getView(editor);
          editorScope = editor.getLastCursor().getScopeDescriptor();
          softWrapDisposable = editor.onDidChangeSoftWrapped(function() {
            return _this.updateWrapGuides(editorView, editorScope);
          });
          semanticDisposable = editor.onDidStopChanging(function() {
            var wrapWith;
            wrapWith = '<span class="apathy-span"/>';
            return _this.wrapTextNodes(editorView, '.line > .source', wrapWith);
          });
          _this.editorDisposables.add(softWrapDisposable);
          return editor.onDidDestroy(function() {
            return softWrapDisposable != null ? softWrapDisposable.dispose() : void 0;
          });
        };
      })(this)));
    }

    ApathyView.prototype.serialize = function() {
      var editors, state;
      state = {
        characterWidths: {}
      };
      editors = atom.workspace.getTextEditors();
      $.each(editors, function(editor) {
        var characterWidths, ev, _ref, _ref1;
        ev = atom.views.getView(editor);
        characterWidths = (_ref = ev.component.linesComponent) != null ? (_ref1 = _ref.presenter) != null ? _ref1.characterWidthsByScope : void 0 : void 0;
        return $.extend(state.characterWidths, characterWidths);
      });
      return state;
    };

    ApathyView.prototype.destroy = function() {
      var _ref, _ref1;
      if ((_ref = this.viewDisposables) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.tmpDisposables) != null) {
        _ref1.dispose();
      }
      this.destroyLeftWrapGuides();
      return this.unwrapTextNodes();
    };


    /*===========================================================================
    = Apathy Methods =
    ===========================================================================
     */

    ApathyView.prototype.forAllEditors = function(callback) {
      var editor, _i, _len, _ref, _results;
      _ref = atom.workspace.getTextEditors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        _results.push(callback(editor));
      }
      return _results;
    };

    ApathyView.prototype.forAllEditorViews = function(callback) {
      return this.forAllEditors(function(editor) {
        return callback(atom.views.getView(editor));
      });
    };

    ApathyView.prototype.getSetting = function(configPath, external) {
      var fullConfigPath;
      if (external == null) {
        external = false;
      }
      fullConfigPath = external ? configPath : "" + this.packageName + "." + configPath;
      return atom.config.get(fullConfigPath);
    };

    ApathyView.prototype.decorateEditorView = function(editorView) {
      this.updateWrapGuides(editorView);
      return this.debug('method called: decorateEditorView');
    };


    /**
     * Perform all actions relevant to the wrap guides for the passed-in view.
     * Should be called after any event occurs that should affect the state of
     * the wrap guides, such as disabling soft wrap or left wrap guide padding.
     * @param {obj} editorView The view of any {TextEditor} instance.
     * @return {null}
     */

    ApathyView.prototype.updateWrapGuides = function(editorView, editorScope) {
      var cfgOptions, editor, leftWrapGuideEnabled, softWrapEnabled;
      if (editorView == null) {
        throw new Error('updateWrapGuides: editorView undefined');
        this.debug('ERROR: editorView undefined in updateWrapGuides!');
        return;
      }
      this.debug('method called: updateWrapGuides');
      editor = editorView.model;
      cfgOptions = {
        scope: editorScope
      };
      leftWrapGuideEnabled = atom.config.get("" + this.packageName + ".enableLeftWrapGuide", cfgOptions);
      softWrapEnabled = editor.isSoftWrapped();
      this.debug("softWrapEnabled: " + softWrapEnabled);
      this.debug("leftWrapGuideEnabled: " + leftWrapGuideEnabled);
      if (leftWrapGuideEnabled && softWrapEnabled) {
        this.debug("Should add left wrap guides: true");
        return this.addLeftWrapGuides(editorView);
      } else {
        this.debug("Should add left wrap guides: false");
        return this.removeLeftWrapGuides(editorView);
      }
    };


    /**
     * Adds a wrap guide to the left side of the text.
     * @method addLeftWrapGuides
     */

    ApathyView.prototype.addLeftWrapGuides = function(editorView) {
      var $existing, $lines, wrapGuideElement, wrapGuideLeft;
      if (this.leftWrapGuides == null) {
        this.leftWrapGuides = [];
      }
      this.debug('called: addLeftWrapGuides');
      $existing = $('.scroll-view .apathy-wrap-guide', editorView.shadowRoot);
      if ($existing.length) {
        return;
      }
      wrapGuideLeft = "<div class=\"wrap-guide apathy-wrap-guide\" style=\"left: -5px; display: block;\"></div>";
      $lines = $('.scroll-view .lines', editorView.shadowRoot);
      wrapGuideElement = $(wrapGuideLeft).prependTo($lines);
      return this.leftWrapGuides.push(wrapGuideElement);
    };


    /**
     * Removes all previously injected left wrap guides from the view, unless
     * no guides exist, in which case it does nothing.
     * @param {View} editorView The view object for the editor.
     * @return {null}
     */

    ApathyView.prototype.removeLeftWrapGuides = function(editorView) {
      var $root;
      $root = $(editorView.shadowRoot);
      return $root.find('.apathy-wrap-guide').remove();
    };


    /**
     * Destroy left wrap guides. Must be called on deactivate, otherwise if users
     *  switch themes from apathy to something else, the guides will stay.
     * @method destroyLeftWrapGuides
     */

    ApathyView.prototype.destroyLeftWrapGuides = function() {
      var wrapGuide, _i, _len, _ref, _ref1, _results;
      this.debug('destroying wrap guides');
      if ((_ref = this.leftWrapGuides) != null ? _ref.length : void 0) {
        _ref1 = this.leftWrapGuides;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          wrapGuide = _ref1[_i];
          _results.push($(wrapGuide).remove());
        }
        return _results;
      }
    };

    ApathyView.prototype.excludedWords = ['function', 'var', 'each', 'extend', '_', 'return', 'unless', 'if', 'else', 'not', 'for', 'while'];


    /**
     * Looks for text nodes and wraps them with a tag. Assuming we have the
     *  following HTML:
     *   <span>
     *     <span>lorem</span>
     *     hello // wraps this since we can't select just this via CSS otherwise.
     *   </span>
     *  There's no way to select just 'hello' with a CSS selector. Therefore, this
     *  method looks for these and wraps them with a `<span>` to make them
     *  selectable, and adds the first word in the tag into data-word attribute.
     * @method wrapTextNodes
     * @param  {string}      selector - Selector to .source.grammar nodes.
     * @param  {string}      wrapWith - String that will be used to generate a
     *                                  jQuery object to wrap matched text nodes
     *                                  with. example: '<span class="js"></span>'.
     */

    ApathyView.prototype.wrapTextNodes = function(editorView, selector, wrapWith) {
      var $root, self;
      if (this.customWrappedTextNodes == null) {
        this.customWrappedTextNodes = [];
      }
      if (this.apathyWordTracker == null) {
        this.apathyWordTracker = [];
      }
      this.debug('called: wrapTextNodes');
      self = this;
      $root = $(editorView.shadowRoot);
      $root.find('[data-apathy-selected]').attr('data-apathy-selected', 'false');
      return $root.find(selector).each(function() {
        return $(this).contents().filter(function(i, val) {
          return val.nodeType === 3;
        }).each(function(i, val) {
          var $wrapped, firstWord, match, theText;
          theText = $(this).text().trim();
          if (theText == null) {
            return;
          }
          match = theText.match(/\b[\w]+\b/g);
          firstWord = match != null ? match[0] : void 0;
          $wrapped = $(this).wrap(wrapWith);
          self.customWrappedTextNodes.push($wrapped);
          return self.decorateSemantic($root, $wrapped, firstWord);
        });
      });
    };


    /**
     *  Given a bunch of text nodes as input, determines the importance of each
     *  by counting occurences and whether the word is selected, and semantically
     *  highlights all occurences of those words.
     *
     *  @param   {Object} $rootNode - jQuery element used as a starting point of
     *                                which all children will be processed.
     *  @param   {Object} $textNode - jQuery element containing the text node to
     *                                possibly semantically highlight.
     *  @param   {String} firstWord - First word inside $textNode.
     */

    ApathyView.prototype.decorateSemantic = function($rootNode, $textNode, firstWord) {
      var isSelectedWord, numMatches, re, self;
      if (!this.validateSemantic(firstWord)) {
        return;
      }
      if (!($.inArray(firstWord, this.apathyWordTracker) > -1)) {
        this.apathyWordTracker.push(firstWord);
      }
      numMatches = $rootNode.find("[data-apathy-word=" + firstWord + "]").length || 1;
      re = new RegExp(firstWord);
      isSelectedWord = re.test(this.getWordUnderCursor());
      $textNode.parent().attr('data-apathy-word', firstWord);
      self = this;
      return $rootNode.find("[data-apathy-word=" + firstWord + "]").each(function() {
        var semanticIndex;
        $(this).attr('data-apathy-count', numMatches);
        semanticIndex = $.inArray(firstWord, self.apathyWordTracker) % 6;
        if (semanticIndex > 0 && numMatches >= 2) {
          $(this).attr('data-apathy-index', semanticIndex);
        }
        if (isSelectedWord) {
          return $(this).attr('data-apathy-selected', 'true');
        }
      });
    };

    ApathyView.prototype.validateSemantic = function(theWord) {
      if (atom.workspace.getActiveTextEditor() == null) {
        return false;
      }
      if (!atom.config.get("" + this.packageName + ".semanticHighlighting")) {
        return false;
      }
      if (typeof theWord !== 'string') {
        return false;
      }
      if (!((theWord != null ? theWord.length : void 0) > 3)) {
        return false;
      }
      if ($.inArray(theWord, this.excludedWords) > -1) {
        return false;
      }
      return true;
    };


    /**
     *  Get the word under the 1st cursor in the active text editor. Note that it
     *  won't return anything if you're in whitespace, or between punctuation or
     *  something.
     *  @return  {String} - Word under cursor.
     */

    ApathyView.prototype.getWordUnderCursor = function() {
      var cursorWordBufferRange, editor, editorCursors, wordUnderCursor;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return "";
      }
      editorCursors = editor.cursors;
      if (!((editorCursors != null ? editorCursors.length : void 0) > 0)) {
        return "";
      }
      cursorWordBufferRange = editorCursors[0].getCurrentWordBufferRange();
      wordUnderCursor = editor.buffer.getTextInRange(cursorWordBufferRange);
      return wordUnderCursor;
    };

    ApathyView.prototype.removeSemanticHighlights = function(editorView) {
      var attrs;
      attrs = 'data-apathy-index data-apathy-count';
      return $(editorView.shadowRoot).find('[data-apathy-index]').removeAttr(attrs);
    };


    /**
     * Unwrap nodes wrapped by @wrapTextNodes().
     * @method unwrapTextNodes
     */

    ApathyView.prototype.unwrapTextNodes = function() {
      var node, _i, _len, _ref, _results;
      _ref = this.customWrappedTextNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push($(node).unwrap());
      }
      return _results;
    };

    ApathyView.prototype.debug = function(message) {
      if (this.debugLog.length > 100) {
        this.debugLog.shift();
      }
      this.debugLog.push("Apathy Theme: " + message);
      if (this.getSetting('debug')) {
        return atom.notifications.addInfo("Apathy Theme: " + message);
      }
    };

    ApathyView.prototype.debugLog = [];

    ApathyView.prototype.getDebugLog = function() {
      return console.log(this.debugLog.join("\n"));
    };

    return ApathyView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9hcGF0aHktdGhlbWUvbGliL2FwYXRoeS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG9CQUFDLGVBQUQsR0FBQTtBQUNYLHVEQUFBLENBQUE7QUFBQSwyQ0FBQSxDQUFBO0FBQUEseUVBQUEsQ0FBQTtBQUFBLG1FQUFBLENBQUE7QUFBQSxpRUFBQSxDQUFBO0FBQUEscUVBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSxVQUFBLDZHQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUEwQixDQUFDLElBQTFDLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFELEdBQXVCLElBQUEsbUJBQUEsQ0FBQSxDQUR2QixDQUFBO0FBQUEsTUFFQSxJQUFBLEdBQU8sSUFGUCxDQUFBO0FBQUEsTUFJQSxDQUFBLENBQUUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNBLFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTywwQkFBUCxDQUFBLENBQUE7QUFDQTtBQUFBOzs7O2FBREE7aUJBTUEsS0FBQyxDQUFBLGVBQWUsQ0FBQyxHQUFqQixDQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRCxHQUFBO0FBQ3JELGdCQUFBLFVBQUE7QUFBQSxZQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFD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

//# sourceURL=/home/andy/.atom/packages/apathy-theme/lib/apathy-view.coffee
