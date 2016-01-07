(function() {
  module.exports = {
    statusBar: null,
    activate: function() {
      return this.statusBar = new (require('./status-bar'))();
    },
    deactivate: function() {
      return this.statusBar.destroy();
    },
    config: {
      toggles: {
        type: 'object',
        order: 1,
        properties: {
          autoClose: {
            title: 'Close Terminal on Exit',
            description: 'Should the terminal close if the shell exits?',
            type: 'boolean',
            "default": false
          },
          cursorBlink: {
            title: 'Cursor Blink',
            description: 'Should the cursor blink when the terminal is active?',
            type: 'boolean',
            "default": true
          },
          runInsertedText: {
            title: 'Run Inserted Text',
            description: 'Run text inserted via `terminal-plus:insert-text` as a command? **This will append an end-of-line character to input.**',
            type: 'boolean',
            "default": true
          }
        }
      },
      core: {
        type: 'object',
        order: 2,
        properties: {
          autoRunCommand: {
            title: 'Auto Run Command',
            description: 'Command to run on terminal initialization.',
            type: 'string',
            "default": ''
          },
          mapTerminalsTo: {
            title: 'Map Terminals To',
            description: 'Map terminals to each file or folder. Default is no action or mapping at all. **Restart required.**',
            type: 'string',
            "default": 'None',
            "enum": ['None', 'File', 'Folder']
          },
          mapTerminalsToAutoOpen: {
            title: 'Auto Open a New Terminal (For Terminal Mapping)',
            description: 'Should a new terminal be opened for new items? **Note:** This works in conjunction with `Map Terminals To` above.',
            type: 'boolean',
            "default": false
          },
          scrollback: {
            title: 'Scroll Back',
            description: 'How many lines of history should be kept?',
            type: 'integer',
            "default": 1000
          },
          shell: {
            title: 'Shell Override',
            description: 'Override the default shell instance to launch.',
            type: 'string',
            "default": (function() {
              var path;
              if (process.platform === 'win32') {
                path = require('path');
                return path.resolve(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe');
              } else {
                return process.env.SHELL;
              }
            })()
          },
          shellArguments: {
            title: 'Shell Arguments',
            description: 'Specify some arguments to use when launching the shell.',
            type: 'string',
            "default": ''
          },
          workingDirectory: {
            title: 'Working Directory',
            description: 'Which directory should be the present working directory when a new terminal is made?',
            type: 'string',
            "default": 'Project',
            "enum": ['Home', 'Project', 'Active File']
          }
        }
      },
      style: {
        type: 'object',
        order: 3,
        properties: {
          animationSpeed: {
            title: 'Animation Speed',
            description: 'How fast should the window animate?',
            type: 'number',
            "default": '1',
            minimum: '0',
            maximum: '100'
          },
          fontFamily: {
            title: 'Font Family',
            description: 'Override the terminal\'s default font family. **You must use a [monospaced font](https://en.wikipedia.org/wiki/List_of_typefaces#Monospace)!**',
            type: 'string',
            "default": ''
          },
          fontSize: {
            title: 'Font Size',
            description: 'Override the terminal\'s default font size.',
            type: 'string',
            "default": ''
          },
          defaultPanelHeight: {
            title: 'Default Panel Height',
            description: 'Default height of a terminal panel. **You may enter a value in px, em, or %.**',
            type: 'string',
            "default": '300px'
          },
          theme: {
            title: 'Theme',
            description: 'Select a theme for the terminal.',
            type: 'string',
            "default": 'standard',
            "enum": ['standard', 'inverse', 'grass', 'homebrew', 'man-page', 'novel', 'ocean', 'pro', 'red', 'red-sands', 'silver-aerogel', 'solid-colors', 'dracula']
          }
        }
      },
      ansiColors: {
        type: 'object',
        order: 4,
        properties: {
          normal: {
            type: 'object',
            order: 1,
            properties: {
              black: {
                title: 'Black',
                description: 'Black color used for terminal ANSI color set.',
                type: 'color',
                "default": '#000000'
              },
              red: {
                title: 'Red',
                description: 'Red color used for terminal ANSI color set.',
                type: 'color',
                "default": '#CD0000'
              },
              green: {
                title: 'Green',
                description: 'Green color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00CD00'
              },
              yellow: {
                title: 'Yellow',
                description: 'Yellow color used for terminal ANSI color set.',
                type: 'color',
                "default": '#CDCD00'
              },
              blue: {
                title: 'Blue',
                description: 'Blue color used for terminal ANSI color set.',
                type: 'color',
                "default": '#0000CD'
              },
              magenta: {
                title: 'Magenta',
                description: 'Magenta color used for terminal ANSI color set.',
                type: 'color',
                "default": '#CD00CD'
              },
              cyan: {
                title: 'Cyan',
                description: 'Cyan color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00CDCD'
              },
              white: {
                title: 'White',
                description: 'White color used for terminal ANSI color set.',
                type: 'color',
                "default": '#E5E5E5'
              }
            }
          },
          zBright: {
            type: 'object',
            order: 2,
            properties: {
              brightBlack: {
                title: 'Bright Black',
                description: 'Bright black color used for terminal ANSI color set.',
                type: 'color',
                "default": '#7F7F7F'
              },
              brightRed: {
                title: 'Bright Red',
                description: 'Bright red color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FF0000'
              },
              brightGreen: {
                title: 'Bright Green',
                description: 'Bright green color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00FF00'
              },
              brightYellow: {
                title: 'Bright Yellow',
                description: 'Bright yellow color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FFFF00'
              },
              brightBlue: {
                title: 'Bright Blue',
                description: 'Bright blue color used for terminal ANSI color set.',
                type: 'color',
                "default": '#0000FF'
              },
              brightMagenta: {
                title: 'Bright Magenta',
                description: 'Bright magenta color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FF00FF'
              },
              brightCyan: {
                title: 'Bright Cyan',
                description: 'Bright cyan color used for terminal ANSI color set.',
                type: 'color',
                "default": '#00FFFF'
              },
              brightWhite: {
                title: 'Bright White',
                description: 'Bright white color used for terminal ANSI color set.',
                type: 'color',
                "default": '#FFFFFF'
              }
            }
          }
        }
      },
      iconColors: {
        type: 'object',
        order: 5,
        properties: {
          red: {
            title: 'Status Icon Red',
            description: 'Red color used for status icon.',
            type: 'color',
            "default": 'red'
          },
          orange: {
            title: 'Status Icon Orange',
            description: 'Orange color used for status icon.',
            type: 'color',
            "default": 'orange'
          },
          yellow: {
            title: 'Status Icon Yellow',
            description: 'Yellow color used for status icon.',
            type: 'color',
            "default": 'yellow'
          },
          green: {
            title: 'Status Icon Green',
            description: 'Green color used for status icon.',
            type: 'color',
            "default": 'green'
          },
          blue: {
            title: 'Status Icon Blue',
            description: 'Blue color used for status icon.',
            type: 'color',
            "default": 'blue'
          },
          purple: {
            title: 'Status Icon Purple',
            description: 'Purple color used for status icon.',
            type: 'color',
            "default": 'purple'
          },
          pink: {
            title: 'Status Icon Pink',
            description: 'Pink color used for status icon.',
            type: 'color',
            "default": 'hotpink'
          },
          cyan: {
            title: 'Status Icon Cyan',
            description: 'Cyan color used for status icon.',
            type: 'color',
            "default": 'cyan'
          },
          magenta: {
            title: 'Status Icon Magenta',
            description: 'Magenta color used for status icon.',
            type: 'color',
            "default": 'magenta'
          }
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy90ZXJtaW5hbC1wbHVzL2xpYi90ZXJtaW5hbC1wbHVzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxTQUFBLEVBQVcsSUFBWDtBQUFBLElBRUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsQ0FBQyxPQUFBLENBQVEsY0FBUixDQUFELENBQUEsQ0FBQSxFQURUO0lBQUEsQ0FGVjtBQUFBLElBS0EsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBWCxDQUFBLEVBRFU7SUFBQSxDQUxaO0FBQUEsSUFRQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLEtBQUEsRUFBTyxDQURQO0FBQUEsUUFFQSxVQUFBLEVBQ0U7QUFBQSxVQUFBLFNBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLHdCQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsK0NBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsS0FIVDtXQURGO0FBQUEsVUFLQSxXQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxjQUFQO0FBQUEsWUFDQSxXQUFBLEVBQWEsc0RBRGI7QUFBQSxZQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsWUFHQSxTQUFBLEVBQVMsSUFIVDtXQU5GO0FBQUEsVUFVQSxlQUFBLEVBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxtQkFBUDtBQUFBLFlBQ0EsV0FBQSxFQUFhLHlIQURiO0FBQUEsWUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFlBR0EsU0FBQSxF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

//# sourceURL=/home/andy/.atom/packages/terminal-plus/lib/terminal-plus.coffee
