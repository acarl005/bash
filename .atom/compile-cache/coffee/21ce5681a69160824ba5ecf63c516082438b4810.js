(function() {
  var ApathyConfig;

  ApathyConfig = {
    semanticHighlighting: {
      type: 'boolean',
      title: 'Enable semantic highlighting',
      description: 'Looks for text that has no grammar applied and semantically highlights them.',
      "default": true,
      order: 1
    },
    altFont: {
      type: 'string',
      title: 'Select Font',
      "default": 'Source Code Pro',
      "enum": ['Source Code Pro', 'Inconsolata'],
      order: 2
    },
    enableLeftWrapGuide: {
      type: 'boolean',
      title: 'Enable wrap guide on left side',
      order: 3,
      "default": true
    },
    bgColorDescription: {
      type: 'boolean',
      title: 'Override Core Colors (NOTE: READ THE NOTES BELOW BEFORE TOUCHING THESE!!)',
      description: '(checkbox does nothing) Make sure to reload atom (ctrl+alt+cmd+L) after changing a color!',
      order: 5,
      "default": false
    },
    customSyntaxBgColor: {
      type: 'color',
      title: 'Override syntax background color',
      description: 'Changes the background color your text lays on.',
      "default": 'hsl(260, 25%, 6%)',
      order: 6
    },
    customInactiveOverlayColor: {
      type: 'color',
      title: 'Custom overlay background color',
      description: 'Changes overall color of everything except tabs, tree-view, and the bottom bar.',
      "default": 'hsla(261, 34%, 15%, 0.9)',
      order: 7
    },
    customUnderlayerBgColor: {
      type: 'color',
      title: 'Custom under-layer background color',
      description: 'Dim color for inactive panes, under text.',
      "default": 'hsl(258, 6%, 6%)',
      order: 8
    },
    customInactivePaneBgColor: {
      type: 'color',
      title: 'Custom inactive pane background color',
      description: 'Dim color for inactive panes, above text.',
      "default": 'hsl(260,5%,11%)',
      order: 9
    },
    enableTreeViewStyles: {
      title: 'Enable tree view background image',
      description: 'Adds a background image to your tree view',
      type: 'boolean',
      "default": false,
      order: 10
    },
    enableTreeViewBorder: {
      title: 'Enable tree view border',
      description: 'Makes it really easy to discern nesting',
      type: 'boolean',
      "default": false,
      order: 11
    },
    syntaxSaturation: {
      type: 'string',
      title: 'Syntax Saturation (requires reload)',
      "default": '90%',
      description: 'How colorful do you want your syntax highlights?',
      "enum": ['70%', '80%', '90%', '100%', '110%', '120%', '130%'],
      order: 13
    },
    syntaxBrightness: {
      type: 'string',
      title: 'Syntax Brightness (requires reload)',
      "default": '90%',
      description: 'How bright?',
      "enum": ['70%', '80%', '90%', '100%', '110%', '120%', '130%'],
      order: 14
    },
    syntaxContrast: {
      type: 'string',
      title: 'Syntax Contrast (requires reload)',
      "default": '90%',
      description: 'How much contrast?',
      "enum": ['70%', '80%', '90%', '100%', '110%', '120%', '130%'],
      order: 15
    },
    altStyle: {
      type: 'string',
      title: 'Alternative Themes',
      "default": 'Default',
      "enum": ['Default', 'Color Pop'],
      order: 16
    }
  };

  module.exports = ApathyConfig;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9hcGF0aHktdGhlbWUvbGliL2NvbmZpZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsWUFBQTs7QUFBQSxFQUFBLFlBQUEsR0FDQTtBQUFBLElBQUEsb0JBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLEtBQUEsRUFBTyw4QkFEUDtBQUFBLE1BRUEsV0FBQSxFQUFhLDhFQUZiO0FBQUEsTUFHQSxTQUFBLEVBQVMsSUFIVDtBQUFBLE1BSUEsS0FBQSxFQUFPLENBSlA7S0FERjtBQUFBLElBTUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLE1BQ0EsS0FBQSxFQUFPLGFBRFA7QUFBQSxNQUVBLFNBQUEsRUFBUyxpQkFGVDtBQUFBLE1BR0EsTUFBQSxFQUFNLENBQUMsaUJBQUQsRUFBb0IsYUFBcEIsQ0FITjtBQUFBLE1BSUEsS0FBQSxFQUFPLENBSlA7S0FQRjtBQUFBLElBWUEsbUJBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLEtBQUEsRUFBTyxnQ0FEUDtBQUFBLE1BRUEsS0FBQSxFQUFPLENBRlA7QUFBQSxNQUdBLFNBQUEsRUFBUyxJQUhUO0tBYkY7QUFBQSxJQWlCQSxrQkFBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsS0FBQSxFQUFPLDJFQURQO0FBQUEsTUFFQSxXQUFBLEVBQWEsMkZBRmI7QUFBQSxNQUdBLEtBQUEsRUFBTyxDQUhQO0FBQUEsTUFJQSxTQUFBLEVBQVMsS0FKVDtLQWxCRjtBQUFBLElBdUJBLG1CQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsTUFDQSxLQUFBLEVBQU8sa0NBRFA7QUFBQSxNQUVBLFdB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

//# sourceURL=/home/andy/.atom/packages/apathy-theme/lib/config.coffee
