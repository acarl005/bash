(function() {
  beforeEach(function() {
    var compare;
    compare = function(a, b, p) {
      return Math.abs(b - a) < (Math.pow(10, -p) / 2);
    };
    return this.addMatchers({
      toBeComponentArrayCloseTo: function(arr, precision) {
        var notText;
        if (precision == null) {
          precision = 0;
        }
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be an array whose values are close to " + (jasmine.pp(arr)) + " with a precision of " + precision;
          };
        })(this);
        if (this.actual.length !== arr.length) {
          return false;
        }
        return this.actual.every(function(value, i) {
          return compare(value, arr[i], precision);
        });
      },
      toBeValid: function() {
        var notText;
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be a valid color";
          };
        })(this);
        return this.actual.isValid();
      },
      toBeColor: function(colorOrRed, green, blue, alpha) {
        var color, hex, notText, red;
        if (green == null) {
          green = 0;
        }
        if (blue == null) {
          blue = 0;
        }
        if (alpha == null) {
          alpha = 1;
        }
        color = (function() {
          switch (typeof colorOrRed) {
            case 'object':
              return colorOrRed;
            case 'number':
              return {
                red: colorOrRed,
                green: green,
                blue: blue,
                alpha: alpha
              };
            case 'string':
              colorOrRed = colorOrRed.replace(/#|0x/, '');
              hex = parseInt(colorOrRed, 16);
              switch (colorOrRed.length) {
                case 8:
                  alpha = (hex >> 24 & 0xff) / 255;
                  red = hex >> 16 & 0xff;
                  green = hex >> 8 & 0xff;
                  blue = hex & 0xff;
                  break;
                case 6:
                  red = hex >> 16 & 0xff;
                  green = hex >> 8 & 0xff;
                  blue = hex & 0xff;
                  break;
                case 3:
                  red = (hex >> 8 & 0xf) * 17;
                  green = (hex >> 4 & 0xf) * 17;
                  blue = (hex & 0xf) * 17;
                  break;
                default:
                  red = 0;
                  green = 0;
                  blue = 0;
                  alpha = 1;
              }
              return {
                red: red,
                green: green,
                blue: blue,
                alpha: alpha
              };
            default:
              return {
                red: 0,
                green: 0,
                blue: 0,
                alpha: 1
              };
          }
        })();
        notText = this.isNot ? " not" : "";
        this.message = (function(_this) {
          return function() {
            return "Expected " + (jasmine.pp(_this.actual)) + " to" + notText + " be a color equal to " + (jasmine.pp(color));
          };
        })(this);
        return Math.round(this.actual.red) === color.red && Math.round(this.actual.green) === color.green && Math.round(this.actual.blue) === color.blue && compare(this.actual.alpha, color.alpha, 1);
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2hlbHBlcnMvbWF0Y2hlcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxFQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLE9BQUE7QUFBQSxJQUFBLE9BQUEsR0FBVSxTQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxHQUFBO2FBQVcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUksQ0FBYixDQUFBLEdBQWtCLENBQUMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxFQUFULEVBQWEsQ0FBQSxDQUFiLENBQUEsR0FBbUIsQ0FBcEIsRUFBN0I7SUFBQSxDQUFWLENBQUE7V0FFQSxJQUFDLENBQUEsV0FBRCxDQUNFO0FBQUEsTUFBQSx5QkFBQSxFQUEyQixTQUFDLEdBQUQsRUFBTSxTQUFOLEdBQUE7QUFDekIsWUFBQSxPQUFBOztVQUQrQixZQUFVO1NBQ3pDO0FBQUEsUUFBQSxPQUFBLEdBQWEsSUFBQyxDQUFBLEtBQUosR0FBZSxNQUFmLEdBQTJCLEVBQXJDLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxPQUFMLEdBQWUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUksV0FBQSxHQUFVLENBQUMsT0FBTyxDQUFDLEVBQVIsQ0FBVyxLQUFDLENBQUEsTUFBWixDQUFELENBQVYsR0FBK0IsS0FBL0IsR0FBb0MsT0FBcEMsR0FBNEMseUNBQTVDLEdBQW9GLENBQUMsT0FBTyxDQUFDLEVBQVIsQ0FBVyxHQUFYLENBQUQsQ0FBcEYsR0FBcUcsdUJBQXJHLEdBQTRILFVBQWhJO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEZixDQUFBO0FBR0EsUUFBQSxJQUFnQixJQUFDLENBQUEsTUFBTSxDQUFD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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/helpers/matchers.coffee
