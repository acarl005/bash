Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _atomSpacePenViews = require('atom-space-pen-views');

var _ansi_up = require('ansi_up');

var _ansi_up2 = _interopRequireDefault(_ansi_up);

var _googleAnalytics = require('./google-analytics');

var _googleAnalytics2 = _interopRequireDefault(_googleAnalytics);

'use babel';

var BuildView = (function (_View) {
  _inherits(BuildView, _View);

  function BuildView() {
    _classCallCheck(this, BuildView);

    _get(Object.getPrototypeOf(BuildView.prototype), 'constructor', this).apply(this, arguments);
    this.titleLoop = ['Building', 'Building.', 'Building..', 'Building...'];
    this.titleLoop.rotate = function () {
      /* Throttle as we don't want to update as quick as the timer is */
      this.n = this.n || 0;
      if (++this.n === 3) {
        this.push(this.shift());
        this.n = 0;
      }
    };
    this.monocle = false;
    this.starttime = new Date();
    this.buffer = new Buffer(0);
    this.links = [];

    this._setMonocleIcon();

    atom.config.observe('build.panelVisibility', this.visibleFromConfig.bind(this));
    atom.config.observe('build.panelOrientation', this.orientationFromConfig.bind(this));
    atom.config.observe('build.monocleHeight', this.sizeFromConfig.bind(this));
    atom.config.observe('build.minimizedHeight', this.sizeFromConfig.bind(this));
    atom.config.observe('editor.fontFamily', this.fontFromConfig.bind(this));

    atom.commands.add('atom-workspace', 'build:toggle-panel', this.toggle.bind(this));
  }

  _createClass(BuildView, [{
    key: 'attach',
    value: function attach(force) {
      if (!force) {
        switch (atom.config.get('build.panelVisibility')) {
          case 'Hidden':
          case 'Show on Error':
            return;
        }
      }

      if (this.panel) {
        this.panel.destroy();
      }
      var addfn = {
        Top: atom.workspace.addTopPanel,
        Bottom: atom.workspace.addBottomPanel,
        Left: atom.workspace.addLeftPanel,
        Right: atom.workspace.addRightPanel
      };
      var orientation = atom.config.get('build.panelOrientation') || 'Bottom';
      this.panel = addfn[orientation].call(atom.workspace, { item: this });
      this.sizeFromConfig();
      this.fontFromConfig();
    }
  }, {
    key: 'detach',
    value: function detach(force) {
      force = force || false;
      if (atom.views.getView(atom.workspace)) {
        atom.views.getView(atom.workspace).focus();
      }
      if (this.panel && (force || 'Keep Visible' !== atom.config.get('build.panelVisibility'))) {
        this.panel.destroy();
        this.panel = null;
      }
    }
  }, {
    key: 'isAttached',
    value: function isAttached() {
      return !!this.panel;
    }
  }, {
    key: 'sizeFromConfig',
    value: function sizeFromConfig() {
      this.setSizePercent(atom.config.get(this.monocle ? 'build.monocleHeight' : 'build.minimizedHeight'));
    }
  }, {
    key: 'fontFromConfig',
    value: function fontFromConfig() {
      this.output.css('font-family', atom.config.get('editor.fontFamily'));
    }
  }, {
    key: 'visibleFromConfig',
    value: function visibleFromConfig(val) {
      switch (val) {
        case 'Toggle':
        case 'Show on Error':
          if (!this.title.hasClass('error')) {
            this.detach();
          }
          break;
      }
    }
  }, {
    key: 'orientationFromConfig',
    value: function orientationFromConfig() {
      var isVisible = this.isVisible();
      this.detach(true);
      if (isVisible) {
        this.attach();
        this._setMonocleIcon();
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      clearTimeout(this.titleTimer);
      this.buffer = new Buffer(0);
      this.links = [];
      this.titleTimer = 0;
      this.title.removeClass('success error warning');
      this.output.empty();
      this.titleText.text('Cleared.');
      this.detach();
    }
  }, {
    key: 'updateTitle',
    value: function updateTitle() {
      this.titleText.text(this.titleLoop[0]);
      this.titleLoop.rotate();
      this.buildTimer.text(((new Date() - this.starttime) / 1000).toFixed(1) + ' s');
      this.titleTimer = setTimeout(this.updateTitle.bind(this), 100);
    }
  }, {
    key: 'close',
    value: function close() {
      this.detach(true);
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      _googleAnalytics2['default'].sendEvent('view', 'panel toggled');
      this.isAttached() ? this.detach(true) : this.attach(true);
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.reset();
      this.attach();
    }
  }, {
    key: 'build',
    value: function build() {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'build:trigger');
    }
  }, {
    key: 'setSizePercent',
    value: function setSizePercent(percent) {
      var size = 0;
      var cssKey = 'height';
      switch (atom.config.get('build.panelOrientation')) {
        case 'Top':
        case 'Bottom':
          size = (0, _atomSpacePenViews.$)('atom-workspace-axis.vertical').height();
          cssKey = 'height';
          break;

        case 'Left':
        case 'Right':
          size = (0, _atomSpacePenViews.$)('atom-workspace-axis.vertical').width();
          if ((0, _atomSpacePenViews.$)('.build').length) {
            size += (0, _atomSpacePenViews.$)('.build').get(0).clientWidth;
          }
          cssKey = 'width';
          break;
      }
      this.output.css('width', 'auto');
      this.output.css('height', '100%');
      this.output.css(cssKey, percent * size + 'px');
    }
  }, {
    key: '_setMonocleIcon',
    value: function _setMonocleIcon() {
      var _this = this;

      var iconName = function iconName() {
        switch (atom.config.get('build.panelOrientation')) {
          case 'Top':
            return _this.monocle ? 'icon-chevron-up' : 'icon-chevron-down';
          case 'Bottom':
            return _this.monocle ? 'icon-chevron-down' : 'icon-chevron-up';
          case 'Right':
            return _this.monocle ? 'icon-chevron-right' : 'icon-chevron-left';
          case 'Left':
            return _this.monocle ? 'icon-chevron-left' : 'icon-chevron-right';
        }
      };

      this.monocleButton.removeClass('icon-chevron-down icon-chevron-up icon-chevron-left icon-chevron-right').addClass(iconName());
    }
  }, {
    key: 'toggleMonocle',
    value: function toggleMonocle() {
      _googleAnalytics2['default'].sendEvent('view', 'monocle toggled');
      this.monocle = !this.monocle;
      this.setSizePercent(atom.config.get(this.monocle ? 'build.monocleHeight' : 'build.minimizedHeight'));
      this._setMonocleIcon();
    }
  }, {
    key: 'buildStarted',
    value: function buildStarted() {
      this.starttime = new Date();
      this.reset();
      this.attach();
      if (atom.config.get('build.stealFocus')) {
        this.focus();
      }
      this.updateTitle();
    }
  }, {
    key: 'buildFinished',
    value: function buildFinished(success) {
      if (!success) {
        this.attach(atom.config.get('build.panelVisibility') === 'Show on Error');
      }
      this.titleText.text(success ? 'Build finished.' : 'Build failed.');
      this.title.addClass(success ? 'success' : 'error');
      clearTimeout(this.titleTimer);
    }
  }, {
    key: 'buildAbortInitiated',
    value: function buildAbortInitiated() {
      this.titleText.text('Build process termination imminent...');
      clearTimeout(this.titleTimer);
      this.title.addClass('error');
    }
  }, {
    key: 'buildAborted',
    value: function buildAborted() {
      this.titleText.text('Aborted!');
    }
  }, {
    key: '_render',
    value: function _render() {
      var _this2 = this;

      var string = _lodash2['default'].escape(this.buffer.toString('utf8'));
      this.links.forEach(function (link) {
        var replaceRegex = new RegExp(_lodash2['default'].escapeRegExp(_lodash2['default'].escape(link.text)), 'g');
        string = string.replace(replaceRegex, '<a id="' + link.id + '">' + _lodash2['default'].escape(link.text) + '</a>');
      });
      this.output.html(_ansi_up2['default'].ansi_to_html(string));
      this.output.find('a').on('click', function (event) {
        _this2.links.find(function (l) {
          return l.id === event.currentTarget.id;
        }).onClick();
      });
    }
  }, {
    key: 'append',
    value: function append(data) {
      this.buffer = Buffer.concat([this.buffer, Buffer.isBuffer(data) ? data : new Buffer(data)]);
      this._render();
      this.output.scrollTop(this.output[0].scrollHeight);
    }
  }, {
    key: 'link',
    value: function link(text, id, onClick) {
      if (this.links.find(function (l) {
        return l.text === text;
      })) {
        return;
      }

      this.links.push({
        id: id,
        text: text,
        onClick: onClick
      });
      this._render();
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo(id) {
      var position = this.output.find('#' + id).position();
      if (position) {
        this.output.scrollTop(position.top + this.output.scrollTop());
      }
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this3 = this;

      this.div({ tabIndex: -1, 'class': 'build tool-panel panel-bottom native-key-bindings' }, function () {
        _this3.div({ 'class': 'btn-container pull-right' }, function () {
          _this3.button({ 'class': 'btn btn-default icon icon-x', click: 'close' });
          _this3.button({ 'class': 'btn btn-default icon icon-chevron-up', outlet: 'monocleButton', click: 'toggleMonocle' });
          _this3.button({ 'class': 'btn btn-default icon icon-trashcan new-row', click: 'clear' });
          _this3.button({ 'class': 'btn btn-default icon icon-zap', click: 'build', title: 'Build current project' });
        });

        _this3.div({ 'class': 'output panel-body', outlet: 'output' });

        _this3.div({ 'class': 'status' }, function () {
          _this3.h1({ 'class': 'title panel-heading', outlet: 'title' }, function () {
            _this3.span({ 'class': 'build-timer', outlet: 'buildTimer' }, '0.0 s');
            _this3.span({ 'class': 'title-text', outlet: 'titleText' }, 'Ready');
          });
        });
      });
    }
  }]);

  return BuildView;
})(_atomSpacePenViews.View);

exports['default'] = BuildView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2J1aWxkLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBRWMsUUFBUTs7OztpQ0FDRSxzQkFBc0I7O3VCQUMzQixTQUFTOzs7OytCQUNBLG9CQUFvQjs7OztBQUxoRCxXQUFXLENBQUM7O0lBT1MsU0FBUztZQUFULFNBQVM7O0FBQ2pCLFdBRFEsU0FBUyxHQUNkOzBCQURLLFNBQVM7O0FBRTFCLCtCQUZpQixTQUFTLDhDQUVqQixTQUFTLEVBQUU7QUFDcEIsUUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBRSxDQUFDO0FBQzFFLFFBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVk7O0FBRWxDLFVBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckIsVUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDeEIsWUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDWjtLQUNGLENBQUM7QUFDRixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUNyQixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDNUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUV2QixRQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FB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U0FBTyxhQUFhLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ25FLG1CQUFLLElBQUksQ0FBQyxFQUFFLFNBQU8sWUFBWSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztXQUNsRSxDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBOUNrQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiIvaG9tZS9hbmR5Ly5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9idWlsZC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBWaWV3LCAkIH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuaW1wb3J0IGFuc2lVcCBmcm9tICdhbnNpX3VwJztcbmltcG9ydCBHb29nbGVBbmFseXRpY3MgZnJvbSAnLi9nb29nbGUtYW5hbHl0aWNzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgdGhpcy50aXRsZUxvb3AgPSBbICdCdWlsZGluZycsICdCdWlsZGluZy4nLCAnQnVpbGRpbmcuLicsICdCdWlsZGluZy4uLicgXTtcbiAgICB0aGlzLnRpdGxlTG9vcC5yb3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvKiBUaHJvdHRsZSBhcyB3ZSBkb24ndCB3YW50IHRvIHVwZGF0ZSBhcyBxdWljayBhcyB0aGUgdGltZXIgaXMgKi9cbiAgICAgIHRoaXMubiA9IHRoaXMubiB8fCAwO1xuICAgICAgaWYgKCsrdGhpcy5uID09PSAzKSB7XG4gICAgICAgIHRoaXMucHVzaCh0aGlzLnNoaWZ0KCkpO1xuICAgICAgICB0aGlzLm4gPSAwO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5tb25vY2xlID0gZmFsc2U7XG4gICAgdGhpcy5zdGFydHRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMuYnVmZmVyID0gbmV3IEJ1ZmZlcigwKTtcbiAgICB0aGlzLmxpbmtzID0gW107XG5cbiAgICB0aGlzLl9zZXRNb25vY2xlSWNvbigpO1xuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgdGhpcy52aXNpYmxlRnJvbUNvbmZpZy5iaW5kKHRoaXMpKTtcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdidWlsZC5wYW5lbE9yaWVudGF0aW9uJywgdGhpcy5vcmllbnRhdGlvbkZyb21Db25maWcuYmluZCh0aGlzKSk7XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQubW9ub2NsZUhlaWdodCcsIHRoaXMuc2l6ZUZyb21Db25maWcuYmluZCh0aGlzKSk7XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQubWluaW1pemVkSGVpZ2h0JywgdGhpcy5zaXplRnJvbUNvbmZpZy5iaW5kKHRoaXMpKTtcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdlZGl0b3IuZm9udEZhbWlseScsIHRoaXMuZm9udEZyb21Db25maWcuYmluZCh0aGlzKSk7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6dG9nZ2xlLXBhbmVsJywgdGhpcy50b2dnbGUuYmluZCh0aGlzKSk7XG4gIH1cblxuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICB0aGlzLmRpdih7IHRhYkluZGV4OiAtMSwgY2xhc3M6ICdidWlsZCB0b29sLXBhbmVsIHBhbmVsLWJvdHRvbSBuYXRpdmUta2V5LWJpbmRpbmdzJyB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmRpdih7IGNsYXNzOiAnYnRuLWNvbnRhaW5lciBwdWxsLXJpZ2h0JyB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6ICdidG4gYnRuLWRlZmF1bHQgaWNvbiBpY29uLXgnLCBjbGljazogJ2Nsb3NlJyB9KTtcbiAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogJ2J0biBidG4tZGVmYXVsdCBpY29uIGljb24tY2hldnJvbi11cCcsIG91dGxldDogJ21vbm9jbGVCdXR0b24nLCBjbGljazogJ3RvZ2dsZU1vbm9jbGUnIH0pO1xuICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiAnYnRuIGJ0bi1kZWZhdWx0IGljb24gaWNvbi10cmFzaGNhbiBuZXctcm93JywgY2xpY2s6ICdjbGVhcicgfSk7XG4gICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6ICdidG4gYnRuLWRlZmF1bHQgaWNvbiBpY29uLXphcCcsIGNsaWNrOiAnYnVpbGQnLCB0aXRsZTogJ0J1aWxkIGN1cnJlbnQgcHJvamVjdCcgfSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ291dHB1dCBwYW5lbC1ib2R5Jywgb3V0bGV0OiAnb3V0cHV0JyB9KTtcblxuICAgICAgdGhpcy5kaXYoeyBjbGFzczogJ3N0YXR1cycgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmgxKHsgY2xhc3M6ICd0aXRsZSBwYW5lbC1oZWFkaW5nJywgb3V0bGV0OiAndGl0bGUnIH0sICgpPT4ge1xuICAgICAgICAgIHRoaXMuc3Bhbih7IGNsYXNzOiAnYnVpbGQtdGltZXInLCBvdXRsZXQ6ICdidWlsZFRpbWVyJyB9LCAnMC4wIHMnKTtcbiAgICAgICAgICB0aGlzLnNwYW4oeyBjbGFzczogJ3RpdGxlLXRleHQnLCBvdXRsZXQ6ICd0aXRsZVRleHQnIH0sICdSZWFkeScpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYXR0YWNoKGZvcmNlKSB7XG4gICAgaWYgKCFmb3JjZSkge1xuICAgICAgc3dpdGNoIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScpKSB7XG4gICAgICAgIGNhc2UgJ0hpZGRlbic6XG4gICAgICAgIGNhc2UgJ1Nob3cgb24gRXJyb3InOlxuICAgICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgfVxuICAgIGNvbnN0IGFkZGZuID0ge1xuICAgICAgVG9wOiBhdG9tLndvcmtzcGFjZS5hZGRUb3BQYW5lbCxcbiAgICAgIEJvdHRvbTogYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwsXG4gICAgICBMZWZ0OiBhdG9tLndvcmtzcGFjZS5hZGRMZWZ0UGFuZWwsXG4gICAgICBSaWdodDogYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbFxuICAgIH07XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnBhbmVsT3JpZW50YXRpb24nKSB8fCAnQm90dG9tJztcbiAgICB0aGlzLnBhbmVsID0gYWRkZm5bb3JpZW50YXRpb25dLmNhbGwoYXRvbS53b3Jrc3BhY2UsIHsgaXRlbTogdGhpcyB9KTtcbiAgICB0aGlzLnNpemVGcm9tQ29uZmlnKCk7XG4gICAgdGhpcy5mb250RnJvbUNvbmZpZygpO1xuICB9XG5cbiAgZGV0YWNoKGZvcmNlKSB7XG4gICAgZm9yY2UgPSBmb3JjZSB8fCBmYWxzZTtcbiAgICBpZiAoYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSkge1xuICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKS5mb2N1cygpO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYW5lbCAmJiAoZm9yY2UgfHwgJ0tlZXAgVmlzaWJsZScgIT09IGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JykpKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlzQXR0YWNoZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5wYW5lbDtcbiAgfVxuXG4gIHNpemVGcm9tQ29uZmlnKCkge1xuICAgIHRoaXMuc2V0U2l6ZVBlcmNlbnQoYXRvbS5jb25maWcuZ2V0KHRoaXMubW9ub2NsZSA/ICdidWlsZC5tb25vY2xlSGVpZ2h0JyA6ICdidWlsZC5taW5pbWl6ZWRIZWlnaHQnKSk7XG4gIH1cblxuICBmb250RnJvbUNvbmZpZygpIHtcbiAgICB0aGlzLm91dHB1dC5jc3MoJ2ZvbnQtZmFtaWx5JywgYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IuZm9udEZhbWlseScpKTtcbiAgfVxuXG4gIHZpc2libGVGcm9tQ29uZmlnKHZhbCkge1xuICAgIHN3aXRjaCAodmFsKSB7XG4gICAgICBjYXNlICdUb2dnbGUnOlxuICAgICAgY2FzZSAnU2hvdyBvbiBFcnJvcic6XG4gICAgICAgIGlmICghdGhpcy50aXRsZS5oYXNDbGFzcygnZXJyb3InKSkge1xuICAgICAgICAgIHRoaXMuZGV0YWNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb3JpZW50YXRpb25Gcm9tQ29uZmlnKCkge1xuICAgIGNvbnN0IGlzVmlzaWJsZSA9IHRoaXMuaXNWaXNpYmxlKCk7XG4gICAgdGhpcy5kZXRhY2godHJ1ZSk7XG4gICAgaWYgKGlzVmlzaWJsZSkge1xuICAgICAgdGhpcy5hdHRhY2goKTtcbiAgICAgIHRoaXMuX3NldE1vbm9jbGVJY29uKCk7XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGl0bGVUaW1lcik7XG4gICAgdGhpcy5idWZmZXIgPSBuZXcgQnVmZmVyKDApO1xuICAgIHRoaXMubGlua3MgPSBbXTtcbiAgICB0aGlzLnRpdGxlVGltZXIgPSAwO1xuICAgIHRoaXMudGl0bGUucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MgZXJyb3Igd2FybmluZycpO1xuICAgIHRoaXMub3V0cHV0LmVtcHR5KCk7XG4gICAgdGhpcy50aXRsZVRleHQudGV4dCgnQ2xlYXJlZC4nKTtcbiAgICB0aGlzLmRldGFjaCgpO1xuICB9XG5cbiAgdXBkYXRlVGl0bGUoKSB7XG4gICAgdGhpcy50aXRsZVRleHQudGV4dCh0aGlzLnRpdGxlTG9vcFswXSk7XG4gICAgdGhpcy50aXRsZUxvb3Aucm90YXRlKCk7XG4gICAgdGhpcy5idWlsZFRpbWVyLnRleHQoKChuZXcgRGF0ZSgpIC0gdGhpcy5zdGFydHRpbWUpIC8gMTAwMCkudG9GaXhlZCgxKSArICcgcycpO1xuICAgIHRoaXMudGl0bGVUaW1lciA9IHNldFRpbWVvdXQodGhpcy51cGRhdGVUaXRsZS5iaW5kKHRoaXMpLCAxMDApO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5kZXRhY2godHJ1ZSk7XG4gIH1cblxuICB0b2dnbGUoKSB7XG4gICAgR29vZ2xlQW5hbHl0aWNzLnNlbmRFdmVudCgndmlldycsICdwYW5lbCB0b2dnbGVkJyk7XG4gICAgdGhpcy5pc0F0dGFjaGVkKCkgPyB0aGlzLmRldGFjaCh0cnVlKSA6IHRoaXMuYXR0YWNoKHRydWUpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHRoaXMuYXR0YWNoKCk7XG4gIH1cblxuICBidWlsZCgpIHtcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksICdidWlsZDp0cmlnZ2VyJyk7XG4gIH1cblxuICBzZXRTaXplUGVyY2VudChwZXJjZW50KSB7XG4gICAgbGV0IHNpemUgPSAwO1xuICAgIGxldCBjc3NLZXkgPSAnaGVpZ2h0JztcbiAgICBzd2l0Y2ggKGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxPcmllbnRhdGlvbicpKSB7XG4gICAgICBjYXNlICdUb3AnOlxuICAgICAgY2FzZSAnQm90dG9tJzpcbiAgICAgICAgc2l6ZSA9ICQoJ2F0b20td29ya3NwYWNlLWF4aXMudmVydGljYWwnKS5oZWlnaHQoKTtcbiAgICAgICAgY3NzS2V5ID0gJ2hlaWdodCc7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdMZWZ0JzpcbiAgICAgIGNhc2UgJ1JpZ2h0JzpcbiAgICAgICAgc2l6ZSA9ICQoJ2F0b20td29ya3NwYWNlLWF4aXMudmVydGljYWwnKS53aWR0aCgpO1xuICAgICAgICBpZiAoJCgnLmJ1aWxkJykubGVuZ3RoKSB7XG4gICAgICAgICAgc2l6ZSArPSAkKCcuYnVpbGQnKS5nZXQoMCkuY2xpZW50V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgY3NzS2V5ID0gJ3dpZHRoJztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMub3V0cHV0LmNzcygnd2lkdGgnLCAnYXV0bycpO1xuICAgIHRoaXMub3V0cHV0LmNzcygnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICB0aGlzLm91dHB1dC5jc3MoY3NzS2V5LCBwZXJjZW50ICogc2l6ZSArICdweCcpO1xuICB9XG5cbiAgX3NldE1vbm9jbGVJY29uKCkge1xuICAgIGNvbnN0IGljb25OYW1lID0gKCkgPT4ge1xuICAgICAgc3dpdGNoIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnBhbmVsT3JpZW50YXRpb24nKSkge1xuICAgICAgICBjYXNlICdUb3AnOiByZXR1cm4gdGhpcy5tb25vY2xlID8gJ2ljb24tY2hldnJvbi11cCcgOiAnaWNvbi1jaGV2cm9uLWRvd24nO1xuICAgICAgICBjYXNlICdCb3R0b20nOiByZXR1cm4gdGhpcy5tb25vY2xlID8gJ2ljb24tY2hldnJvbi1kb3duJyA6ICdpY29uLWNoZXZyb24tdXAnO1xuICAgICAgICBjYXNlICdSaWdodCc6IHJldHVybiB0aGlzLm1vbm9jbGUgPyAnaWNvbi1jaGV2cm9uLXJpZ2h0JyA6ICdpY29uLWNoZXZyb24tbGVmdCc7XG4gICAgICAgIGNhc2UgJ0xlZnQnOiByZXR1cm4gdGhpcy5tb25vY2xlID8gJ2ljb24tY2hldnJvbi1sZWZ0JyA6ICdpY29uLWNoZXZyb24tcmlnaHQnO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm1vbm9jbGVCdXR0b25cbiAgICAgIC5yZW1vdmVDbGFzcygnaWNvbi1jaGV2cm9uLWRvd24gaWNvbi1jaGV2cm9uLXVwIGljb24tY2hldnJvbi1sZWZ0IGljb24tY2hldnJvbi1yaWdodCcpXG4gICAgICAuYWRkQ2xhc3MoaWNvbk5hbWUoKSk7XG4gIH1cblxuICB0b2dnbGVNb25vY2xlKCkge1xuICAgIEdvb2dsZUFuYWx5dGljcy5zZW5kRXZlbnQoJ3ZpZXcnLCAnbW9ub2NsZSB0b2dnbGVkJyk7XG4gICAgdGhpcy5tb25vY2xlID0gIXRoaXMubW9ub2NsZTtcbiAgICB0aGlzLnNldFNpemVQZXJjZW50KGF0b20uY29uZmlnLmdldCh0aGlzLm1vbm9jbGUgPyAnYnVpbGQubW9ub2NsZUhlaWdodCcgOiAnYnVpbGQubWluaW1pemVkSGVpZ2h0JykpO1xuICAgIHRoaXMuX3NldE1vbm9jbGVJY29uKCk7XG4gIH1cblxuICBidWlsZFN0YXJ0ZWQoKSB7XG4gICAgdGhpcy5zdGFydHRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgICB0aGlzLmF0dGFjaCgpO1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnN0ZWFsRm9jdXMnKSkge1xuICAgICAgdGhpcy5mb2N1cygpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XG4gIH1cblxuICBidWlsZEZpbmlzaGVkKHN1Y2Nlc3MpIHtcbiAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgIHRoaXMuYXR0YWNoKGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JykgPT09ICdTaG93IG9uIEVycm9yJyk7XG4gICAgfVxuICAgIHRoaXMudGl0bGVUZXh0LnRleHQoc3VjY2VzcyA/ICdCdWlsZCBmaW5pc2hlZC4nIDogJ0J1aWxkIGZhaWxlZC4nKTtcbiAgICB0aGlzLnRpdGxlLmFkZENsYXNzKHN1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZXJyb3InKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aXRsZVRpbWVyKTtcbiAgfVxuXG4gIGJ1aWxkQWJvcnRJbml0aWF0ZWQoKSB7XG4gICAgdGhpcy50aXRsZVRleHQudGV4dCgnQnVpbGQgcHJvY2VzcyB0ZXJtaW5hdGlvbiBpbW1pbmVudC4uLicpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRpdGxlVGltZXIpO1xuICAgIHRoaXMudGl0bGUuYWRkQ2xhc3MoJ2Vycm9yJyk7XG4gIH1cblxuICBidWlsZEFib3J0ZWQoKSB7XG4gICAgdGhpcy50aXRsZVRleHQudGV4dCgnQWJvcnRlZCEnKTtcbiAgfVxuXG4gIF9yZW5kZXIoKSB7XG4gICAgbGV0IHN0cmluZyA9IF8uZXNjYXBlKHRoaXMuYnVmZmVyLnRvU3RyaW5nKCd1dGY4JykpO1xuICAgIHRoaXMubGlua3MuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgY29uc3QgcmVwbGFjZVJlZ2V4ID0gbmV3IFJlZ0V4cChfLmVzY2FwZVJlZ0V4cChfLmVzY2FwZShsaW5rLnRleHQpKSwgJ2cnKTtcbiAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJlcGxhY2VSZWdleCwgJzxhIGlkPVwiJyArIGxpbmsuaWQgKyAnXCI+JyArIF8uZXNjYXBlKGxpbmsudGV4dCkgKyAnPC9hPicpO1xuICAgIH0pO1xuICAgIHRoaXMub3V0cHV0Lmh0bWwoYW5zaVVwLmFuc2lfdG9faHRtbChzdHJpbmcpKTtcbiAgICB0aGlzLm91dHB1dC5maW5kKCdhJykub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLmxpbmtzLmZpbmQobCA9PiBsLmlkID09PSBldmVudC5jdXJyZW50VGFyZ2V0LmlkKS5vbkNsaWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICBhcHBlbmQoZGF0YSkge1xuICAgIHRoaXMuYnVmZmVyID0gQnVmZmVyLmNvbmNhdChbIHRoaXMuYnVmZmVyLCBCdWZmZXIuaXNCdWZmZXIoZGF0YSkgPyBkYXRhIDogbmV3IEJ1ZmZlcihkYXRhKSBdKTtcbiAgICB0aGlzLl9yZW5kZXIoKTtcbiAgICB0aGlzLm91dHB1dC5zY3JvbGxUb3AodGhpcy5vdXRwdXRbMF0uc2Nyb2xsSGVpZ2h0KTtcbiAgfVxuXG4gIGxpbmsodGV4dCwgaWQsIG9uQ2xpY2spIHtcbiAgICBpZiAodGhpcy5saW5rcy5maW5kKGwgPT4gbC50ZXh0ID09PSB0ZXh0KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGlua3MucHVzaCh7XG4gICAgICBpZDogaWQsXG4gICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgb25DbGljazogb25DbGlja1xuICAgIH0pO1xuICAgIHRoaXMuX3JlbmRlcigpO1xuICB9XG5cbiAgc2Nyb2xsVG8oaWQpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMub3V0cHV0LmZpbmQoJyMnICsgaWQpLnBvc2l0aW9uKCk7XG4gICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICB0aGlzLm91dHB1dC5zY3JvbGxUb3AocG9zaXRpb24udG9wICsgdGhpcy5vdXRwdXQuc2Nyb2xsVG9wKCkpO1xuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/home/andy/.atom/packages/build/lib/build-view.js
