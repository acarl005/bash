(function() {
  var utils;

  utils = {
    fill: function(str, length, filler) {
      if (filler == null) {
        filler = '0';
      }
      while (str.length < length) {
        str = filler + str;
      }
      return str;
    },
    strip: function(str) {
      return str.replace(/\s+/g, '');
    },
    clamp: function(n) {
      return Math.min(1, Math.max(0, n));
    },
    clampInt: function(n, max) {
      if (max == null) {
        max = 100;
      }
      return Math.min(max, Math.max(0, n));
    },
    readFloat: function(value, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      res = parseFloat(value);
      if (isNaN(res) && (vars[value] != null)) {
        color.usedVariables.push(value);
        res = parseFloat(vars[value].value);
      }
      return res;
    },
    readInt: function(value, vars, color, base) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (base == null) {
        base = 10;
      }
      res = parseInt(value, base);
      if (isNaN(res) && (vars[value] != null)) {
        color.usedVariables.push(value);
        res = parseInt(vars[value].value, base);
      }
      return res;
    },
    countLines: function(string) {
      return string.split(/\r\n|\r|\n/g).length;
    },
    readIntOrPercent: function(value, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (!/\d+/.test(value) && (vars[value] != null)) {
        color.usedVariables.push(value);
        value = vars[value].value;
      }
      if (value == null) {
        return NaN;
      }
      if (value.indexOf('%') !== -1) {
        res = Math.round(parseFloat(value) * 2.55);
      } else {
        res = parseInt(value);
      }
      return res;
    },
    readFloatOrPercent: function(amount, vars, color) {
      var res;
      if (vars == null) {
        vars = {};
      }
      if (!/\d+/.test(amount) && (vars[amount] != null)) {
        color.usedVariables.push(amount);
        amount = vars[amount].value;
      }
      if (amount == null) {
        return NaN;
      }
      if (amount.indexOf('%') !== -1) {
        res = parseFloat(amount) / 100;
      } else {
        res = parseFloat(amount);
      }
      return res;
    },
    findClosingIndex: function(s, startIndex, openingChar, closingChar) {
      var curStr, index, nests;
      if (startIndex == null) {
        startIndex = 0;
      }
      if (openingChar == null) {
        openingChar = "[";
      }
      if (closingChar == null) {
        closingChar = "]";
      }
      index = startIndex;
      nests = 1;
      while (nests && index < s.length) {
        curStr = s.substr(index++, 1);
        if (curStr === closingChar) {
          nests--;
        } else if (curStr === openingChar) {
          nests++;
        }
      }
      if (nests === 0) {
        return index - 1;
      } else {
        return -1;
      }
    },
    split: function(s, sep) {
      var a, c, i, l, previousStart, start;
      if (sep == null) {
        sep = ",";
      }
      a = [];
      l = s.length;
      i = 0;
      start = 0;
      previousStart = start;
      whileLoop: //;
      while (i < l) {
        c = s.substr(i, 1);
        switch (c) {
          case "(":
            i = utils.findClosingIndex(s, i + 1, c, ")");
            break;
          case ")":
            break whileLoop;
            break;
          case "[":
            i = utils.findClosingIndex(s, i + 1, c, "]");
            break;
          case "":
            i = utils.findClosingIndex(s, i + 1, c, "");
            break;
          case sep:
            a.push(utils.strip(s.substr(start, i - start)));
            start = i + 1;
            if (previousStart === start) {
              break whileLoop;
            }
            previousStart = start;
        }
        i++;
      }
      a.push(utils.strip(s.substr(start, i - start)));
      return a;
    }
  };

  module.exports = utils;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9saWIvdXRpbHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLEtBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsTUFBZCxHQUFBOztRQUFjLFNBQU87T0FDekI7QUFBbUIsYUFBTSxHQUFHLENBQUMsTUFBSixHQUFhLE1BQW5CLEdBQUE7QUFBbkIsUUFBQSxHQUFBLEdBQU0sTUFBQSxHQUFTLEdBQWYsQ0FBbUI7TUFBQSxDQUFuQjthQUNBLElBRkk7SUFBQSxDQUFOO0FBQUEsSUFJQSxLQUFBLEVBQU8sU0FBQyxHQUFELEdBQUE7YUFBUyxHQUFHLENBQUMsT0FBSixDQUFZLE1BQVosRUFBb0IsRUFBcEIsRUFBVDtJQUFBLENBSlA7QUFBQSxJQU1BLEtBQUEsRUFBTyxTQUFDLENBQUQsR0FBQTthQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLENBQVosQ0FBWixFQUFQO0lBQUEsQ0FOUDtBQUFBLElBUUEsUUFBQSxFQUFVLFNBQUMsQ0FBRCxFQUFJLEdBQUosR0FBQTs7UUFBSSxNQUFJO09BQVE7YUFBQSxJQUFJLENBQUMsR0FBTCxDQUFTLEdBQVQsRUFBYyxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxDQUFaLENBQWQsRUFBaEI7SUFBQSxDQVJWO0FBQUEsSUFVQSxTQUFBLEVBQVcsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFpQixLQUFqQixHQUFBO0FBQ1QsVUFBQSxHQUFBOztRQURpQixPQUFLO09BQ3RCO0FBQUEsTUFBQSxHQUFBLEdBQU0sVUFBQSxDQUFXLEtBQVgsQ0FBTixDQUFBO0FBQ0EsTUFB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

//# sourceURL=/home/andy/.atom/packages/pigments/lib/utils.coffee
