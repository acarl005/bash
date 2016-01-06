(function() {
  var ColorContext, ColorExpression, ColorParser, registry;

  require('./helpers/matchers');

  ColorParser = require('../lib/color-parser');

  ColorContext = require('../lib/color-context');

  ColorExpression = require('../lib/color-expression');

  registry = require('../lib/color-expressions');

  describe('ColorParser', function() {
    var asColor, getParser, itParses, parser;
    parser = [][0];
    asColor = function(value) {
      return "color:" + value;
    };
    getParser = function(context) {
      context = new ColorContext(context != null ? context : {
        registry: registry
      });
      return context.parser;
    };
    itParses = function(expression) {
      return {
        description: '',
        asColor: function(r, g, b, a) {
          var context;
          if (a == null) {
            a = 1;
          }
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("parses '" + expression + "' as a color", function() {
              var _ref, _ref1;
              if (context != null) {
                return expect(parser.parse(expression, (_ref = this.scope) != null ? _ref : 'less')).toBeColor(r, g, b, a, Object.keys(context).sort());
              } else {
                return expect(parser.parse(expression, (_ref1 = this.scope) != null ? _ref1 : 'less')).toBeColor(r, g, b, a);
              }
            });
          });
        },
        asUndefined: function() {
          var context;
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("does not parse '" + expression + "' and return undefined", function() {
              var _ref;
              return expect(parser.parse(expression, (_ref = this.scope) != null ? _ref : 'less')).toBeUndefined();
            });
          });
        },
        asInvalid: function() {
          var context;
          context = this.context;
          return describe(this.description, function() {
            beforeEach(function() {
              return parser = getParser(context);
            });
            return it("parses '" + expression + "' as an invalid color", function() {
              var _ref;
              return expect(parser.parse(expression, (_ref = this.scope) != null ? _ref : 'less')).not.toBeValid();
            });
          });
        },
        withContext: function(variables) {
          var colorVars, name, path, value, vars;
          vars = [];
          colorVars = [];
          path = "/path/to/file.styl";
          for (name in variables) {
            value = variables[name];
            if (value.indexOf('color:') !== -1) {
              value = value.replace('color:', '');
              vars.push({
                name: name,
                value: value,
                path: path
              });
              colorVars.push({
                name: name,
                value: value,
                path: path
              });
            } else {
              vars.push({
                name: name,
                value: value,
                path: path
              });
            }
          }
          this.context = {
            variables: vars,
            colorVariables: colorVars,
            registry: registry
          };
          this.description = "with variables context " + (jasmine.pp(variables)) + " ";
          return this;
        }
      };
    };
    itParses('@list-item-height').withContext({
      '@text-height': '@scale-b-xxl * 1rem',
      '@component-line-height': '@text-height',
      '@list-item-height': '@component-line-height'
    }).asUndefined();
    itParses('c').withContext({
      'c': 'c'
    }).asUndefined();
    itParses('c').withContext({
      'c': 'd',
      'd': 'e',
      'e': 'c'
    }).asUndefined();
    itParses('#ff7f00').asColor(255, 127, 0);
    itParses('#f70').asColor(255, 119, 0);
    itParses('#ff7f00cc').asColor(255, 127, 0, 0.8);
    itParses('#f70c').asColor(255, 119, 0, 0.8);
    itParses('0xff7f00').asColor(255, 127, 0);
    itParses('0x00ff7f00').asColor(255, 127, 0, 0);
    describe('in context other than css and pre-processors', function() {
      beforeEach(function() {
        return this.scope = 'xaml';
      });
      return itParses('#ccff7f00').asColor(255, 127, 0, 0.8);
    });
    itParses('rgb(255,127,0)').asColor(255, 127, 0);
    itParses('rgb(255,127,0)').asColor(255, 127, 0);
    itParses('rgb($r,$g,$b)').asInvalid();
    itParses('rgb($r,0,0)').asInvalid();
    itParses('rgb(0,$g,0)').asInvalid();
    itParses('rgb(0,0,$b)').asInvalid();
    itParses('rgb($r,$g,$b)').withContext({
      '$r': '255',
      '$g': '127',
      '$b': '0'
    }).asColor(255, 127, 0);
    itParses('rgba(255,127,0,0.5)').asColor(255, 127, 0, 0.5);
    itParses('rgba(255,127,0,.5)').asColor(255, 127, 0, 0.5);
    itParses('rgba(255,127,0,)').asUndefined();
    itParses('rgba($r,$g,$b,$a)').asInvalid();
    itParses('rgba($r,0,0,0)').asInvalid();
    itParses('rgba(0,$g,0,0)').asInvalid();
    itParses('rgba(0,0,$b,0)').asInvalid();
    itParses('rgba(0,0,0,$a)').asInvalid();
    itParses('rgba($r,$g,$b,$a)').withContext({
      '$r': '255',
      '$g': '127',
      '$b': '0',
      '$a': '0.5'
    }).asColor(255, 127, 0, 0.5);
    itParses('rgba(green, 0.5)').asColor(0, 128, 0, 0.5);
    itParses('rgba($c,$a,)').asUndefined();
    itParses('rgba($c,$a)').asInvalid();
    itParses('rgba($c,1)').asInvalid();
    itParses('rgba($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('rgba($c,$a)').withContext({
      '$c': asColor('green'),
      '$a': '0.5'
    }).asColor(0, 128, 0, 0.5);
    itParses('hsl(200,50%,50%)').asColor(64, 149, 191);
    itParses('hsl(200,50,50)').asColor(64, 149, 191);
    itParses('hsl(200.5,50.5,50.5)').asColor(65, 150, 193);
    itParses('hsl($h,$s,$l,)').asUndefined();
    itParses('hsl($h,$s,$l)').asInvalid();
    itParses('hsl($h,0%,0%)').asInvalid();
    itParses('hsl(0,$s,0%)').asInvalid();
    itParses('hsl(0,0%,$l)').asInvalid();
    itParses('hsl($h,$s,$l)').withContext({
      '$h': '200',
      '$s': '50%',
      '$l': '50%'
    }).asColor(64, 149, 191);
    itParses('hsla(200,50%,50%,0.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200,50%,50%,.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200,50,50,.5)').asColor(64, 149, 191, 0.5);
    itParses('hsla(200.5,50.5,50.5,.5)').asColor(65, 150, 193, 0.5);
    itParses('hsla(200,50%,50%,)').asUndefined();
    itParses('hsla($h,$s,$l,$a)').asInvalid();
    itParses('hsla($h,0%,0%,0)').asInvalid();
    itParses('hsla(0,$s,0%,0)').asInvalid();
    itParses('hsla(0,0%,$l,0)').asInvalid();
    itParses('hsla(0,0%,0%,$a)').asInvalid();
    itParses('hsla($h,$s,$l,$a)').withContext({
      '$h': '200',
      '$s': '50%',
      '$l': '50%',
      '$a': '0.5'
    }).asColor(64, 149, 191, 0.5);
    itParses('hsv(200,50%,50%)').asColor(64, 106, 128);
    itParses('hsb(200,50%,50%)').asColor(64, 106, 128);
    itParses('hsb(200,50,50)').asColor(64, 106, 128);
    itParses('hsb(200.5,50.5,50.5)').asColor(64, 107, 129);
    itParses('hsv($h,$s,$v,)').asUndefined();
    itParses('hsv($h,$s,$v)').asInvalid();
    itParses('hsv($h,0%,0%)').asInvalid();
    itParses('hsv(0,$s,0%)').asInvalid();
    itParses('hsv(0,0%,$v)').asInvalid();
    itParses('hsv($h,$s,$v)').withContext({
      '$h': '200',
      '$s': '50%',
      '$v': '50%'
    }).asColor(64, 106, 128);
    itParses('hsva(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200,50,50,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsba(200,50%,50%,0.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200,50%,50%,.5)').asColor(64, 106, 128, 0.5);
    itParses('hsva(200.5,50.5,50.5,.5)').asColor(64, 107, 129, 0.5);
    itParses('hsva(200,50%,50%,)').asUndefined();
    itParses('hsva($h,$s,$v,$a)').asInvalid();
    itParses('hsva($h,0%,0%,0)').asInvalid();
    itParses('hsva(0,$s,0%,0)').asInvalid();
    itParses('hsva(0,0%,$v,0)').asInvalid();
    itParses('hsva($h,$s,$v,$a)').withContext({
      '$h': '200',
      '$s': '50%',
      '$v': '50%',
      '$a': '0.5'
    }).asColor(64, 106, 128, 0.5);
    itParses('hwb(210,40%,40%)').asColor(102, 128, 153);
    itParses('hwb(210,40,40)').asColor(102, 128, 153);
    itParses('hwb(210,40%,40%, 0.5)').asColor(102, 128, 153, 0.5);
    itParses('hwb(210.5,40.5,40.5)').asColor(103, 128, 152);
    itParses('hwb(210.5,40.5%,40.5%, 0.5)').asColor(103, 128, 152, 0.5);
    itParses('hwb($h,$w,$b,)').asUndefined();
    itParses('hwb($h,$w,$b)').asInvalid();
    itParses('hwb($h,0%,0%)').asInvalid();
    itParses('hwb(0,$w,0%)').asInvalid();
    itParses('hwb(0,0%,$b)').asInvalid();
    itParses('hwb($h,0%,0%,0)').asInvalid();
    itParses('hwb(0,$w,0%,0)').asInvalid();
    itParses('hwb(0,0%,$b,0)').asInvalid();
    itParses('hwb(0,0%,0%,$a)').asInvalid();
    itParses('hwb($h,$w,$b)').withContext({
      '$h': '210',
      '$w': '40%',
      '$b': '40%'
    }).asColor(102, 128, 153);
    itParses('hwb($h,$w,$b,$a)').withContext({
      '$h': '210',
      '$w': '40%',
      '$b': '40%',
      '$a': '0.5'
    }).asColor(102, 128, 153, 0.5);
    itParses('gray(100%)').asColor(255, 255, 255);
    itParses('gray(100)').asColor(255, 255, 255);
    itParses('gray(100%, 0.5)').asColor(255, 255, 255, 0.5);
    itParses('gray($c, $a,)').asUndefined();
    itParses('gray($c, $a)').asInvalid();
    itParses('gray(0%, $a)').asInvalid();
    itParses('gray($c, 0)').asInvalid();
    itParses('gray($c, $a)').withContext({
      '$c': '100%',
      '$a': '0.5'
    }).asColor(255, 255, 255, 0.5);
    itParses('yellowgreen').asColor('#9acd32');
    itParses('YELLOWGREEN').asColor('#9acd32');
    itParses('yellowGreen').asColor('#9acd32');
    itParses('YellowGreen').asColor('#9acd32');
    itParses('yellow_green').asColor('#9acd32');
    itParses('YELLOW_GREEN').asColor('#9acd32');
    itParses('darken(cyan, 20%)').asColor(0, 153, 153);
    itParses('darken(cyan, 20)').asColor(0, 153, 153);
    itParses('darken(#fff, 100%)').asColor(0, 0, 0);
    itParses('darken(cyan, $r)').asInvalid();
    itParses('darken($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('darken($c, $r)').withContext({
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(0, 153, 153);
    itParses('darken($a, $r)').withContext({
      '$a': asColor('rgba($c, 1)'),
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(0, 153, 153);
    itParses('lighten(cyan, 20%)').asColor(102, 255, 255);
    itParses('lighten(cyan, 20)').asColor(102, 255, 255);
    itParses('lighten(#000, 100%)').asColor(255, 255, 255);
    itParses('lighten(cyan, $r)').asInvalid();
    itParses('lighten($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('lighten($c, $r)').withContext({
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(102, 255, 255);
    itParses('lighten($a, $r)').withContext({
      '$a': asColor('rgba($c, 1)'),
      '$c': asColor('cyan'),
      '$r': '20%'
    }).asColor(102, 255, 255);
    itParses('transparentize(cyan, 50%)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, 50)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('transparentize(cyan, .5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fade-out(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fade_out(cyan, 0.5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, .5)').asColor(0, 255, 255, 0.5);
    itParses('fadeout(cyan, @r)').asInvalid();
    itParses('fadeout($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('fadeout(@c, @r)').withContext({
      '@c': asColor('cyan'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 0.5);
    itParses('fadeout(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('cyan'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 0.5);
    itParses('opacify(0x7800FFFF, 50%)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, 50)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('opacify(0x7800FFFF, .5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fade-in(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fade_in(0x7800FFFF, 0.5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, .5)').asColor(0, 255, 255, 1);
    itParses('fadein(0x7800FFFF, @r)').asInvalid();
    itParses('fadein($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('fadein(@c, @r)').withContext({
      '@c': asColor('0x7800FFFF'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 1);
    itParses('fadein(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('0x7800FFFF'),
      '@r': '0.5'
    }).asColor(0, 255, 255, 1);
    itParses('saturate(#855, 20%)').asColor(158, 63, 63);
    itParses('saturate(#855, 20)').asColor(158, 63, 63);
    itParses('saturate(#855, 0.2)').asColor(158, 63, 63);
    itParses('saturate(#855, @r)').asInvalid();
    itParses('saturate($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('saturate(@c, @r)').withContext({
      '@c': asColor('#855'),
      '@r': '0.2'
    }).asColor(158, 63, 63);
    itParses('saturate(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#855'),
      '@r': '0.2'
    }).asColor(158, 63, 63);
    itParses('desaturate(#9e3f3f, 20%)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, 20)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, 0.2)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, .2)').asColor(136, 85, 85);
    itParses('desaturate(#9e3f3f, @r)').asInvalid();
    itParses('desaturate($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('desaturate(@c, @r)').withContext({
      '@c': asColor('#9e3f3f'),
      '@r': '0.2'
    }).asColor(136, 85, 85);
    itParses('desaturate(@a, @r)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f'),
      '@r': '0.2'
    }).asColor(136, 85, 85);
    itParses('grayscale(#9e3f3f)').asColor(111, 111, 111);
    itParses('greyscale(#9e3f3f)').asColor(111, 111, 111);
    itParses('grayscale(@c)').asInvalid();
    itParses('grayscale($c)').withContext({
      '$c': asColor('hsv($h, $s, $v)')
    }).asInvalid();
    itParses('grayscale(@c)').withContext({
      '@c': asColor('#9e3f3f')
    }).asColor(111, 111, 111);
    itParses('grayscale(@a)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f')
    }).asColor(111, 111, 111);
    itParses('invert(#9e3f3f)').asColor(97, 192, 192);
    itParses('invert(@c)').asInvalid();
    itParses('invert($c)').withContext({
      '$c': asColor('hsv($h, $s, $v)')
    }).asInvalid();
    itParses('invert(@c)').withContext({
      '@c': asColor('#9e3f3f')
    }).asColor(97, 192, 192);
    itParses('invert(@a)').withContext({
      '@a': asColor('rgba(@c, 1)'),
      '@c': asColor('#9e3f3f')
    }).asColor(97, 192, 192);
    itParses('adjust-hue(#811, 45deg)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45deg)').asColor(136, 17, 106);
    itParses('adjust-hue(#811, 45%)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45%)').asColor(136, 17, 106);
    itParses('adjust-hue(#811, 45)').asColor(136, 106, 17);
    itParses('adjust-hue(#811, -45)').asColor(136, 17, 106);
    itParses('adjust-hue($c, $r)').asInvalid();
    itParses('adjust-hue($c, $r)').withContext({
      '$c': asColor('hsv($h, $s, $v)'),
      '$r': '1'
    }).asInvalid();
    itParses('adjust-hue($c, $r)').withContext({
      '$c': asColor('#811'),
      '$r': '-45deg'
    }).asColor(136, 17, 106);
    itParses('adjust-hue($a, $r)').withContext({
      '$a': asColor('rgba($c, 0.5)'),
      '$c': asColor('#811'),
      '$r': '-45deg'
    }).asColor(136, 17, 106, 0.5);
    itParses('mix(rgb(255,0,0), blue)').asColor(127, 0, 127);
    itParses('mix(red, rgb(0,0,255), 25%)').asColor(63, 0, 191);
    itParses('mix(#ff0000, 0x0000ff)').asColor('#7f007f');
    itParses('mix(#ff0000, 0x0000ff, 25%)').asColor('#3f00bf');
    itParses('mix(red, rgb(0,0,255), 25)').asColor(63, 0, 191);
    itParses('mix($a, $b, $r)').asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('hsv($h, $s, $v)'),
      '$b': asColor('blue'),
      '$r': '25%'
    }).asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('blue'),
      '$b': asColor('hsv($h, $s, $v)'),
      '$r': '25%'
    }).asInvalid();
    itParses('mix($a, $b, $r)').withContext({
      '$a': asColor('red'),
      '$b': asColor('blue'),
      '$r': '25%'
    }).asColor(63, 0, 191);
    itParses('mix($c, $d, $r)').withContext({
      '$a': asColor('red'),
      '$b': asColor('blue'),
      '$c': asColor('rgba($a, 1)'),
      '$d': asColor('rgba($b, 1)'),
      '$r': '25%'
    }).asColor(63, 0, 191);
    describe('stylus and less', function() {
      beforeEach(function() {
        return this.scope = 'styl';
      });
      itParses('tint(#fd0cc7,66%)').asColor(254, 172, 235);
      itParses('tint(#fd0cc7,66)').asColor(254, 172, 235);
      itParses('tint($c,$r)').asInvalid();
      itParses('tint($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('tint($c,$r)').withContext({
        '$c': asColor('#fd0cc7'),
        '$r': '66%'
      }).asColor(254, 172, 235);
      itParses('tint($c,$r)').withContext({
        '$a': asColor('#fd0cc7'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '66%'
      }).asColor(254, 172, 235, 0.966);
      itParses('shade(#fd0cc7,66%)').asColor(86, 4, 67);
      itParses('shade(#fd0cc7,66)').asColor(86, 4, 67);
      itParses('shade($c,$r)').asInvalid();
      itParses('shade($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('shade($c,$r)').withContext({
        '$c': asColor('#fd0cc7'),
        '$r': '66%'
      }).asColor(86, 4, 67);
      return itParses('shade($c,$r)').withContext({
        '$a': asColor('#fd0cc7'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '66%'
      }).asColor(86, 4, 67, 0.966);
    });
    describe('scss and sass', function() {
      beforeEach(function() {
        return this.scope = 'sass';
      });
      itParses('tint(#BADA55, 42%)').asColor('#e2efb7');
      itParses('tint(#BADA55, 42)').asColor('#e2efb7');
      itParses('tint($c,$r)').asInvalid();
      itParses('tint($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('tint($c,$r)').withContext({
        '$c': asColor('#BADA55'),
        '$r': '42%'
      }).asColor('#e2efb7');
      itParses('tint($c,$r)').withContext({
        '$a': asColor('#BADA55'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '42%'
      }).asColor(226, 239, 183, 0.942);
      itParses('shade(#663399, 42%)').asColor('#2a1540');
      itParses('shade(#663399, 42)').asColor('#2a1540');
      itParses('shade($c,$r)').asInvalid();
      itParses('shade($c, $r)').withContext({
        '$c': asColor('hsv($h, $s, $v)'),
        '$r': '1'
      }).asInvalid();
      itParses('shade($c,$r)').withContext({
        '$c': asColor('#663399'),
        '$r': '42%'
      }).asColor('#2a1540');
      return itParses('shade($c,$r)').withContext({
        '$a': asColor('#663399'),
        '$c': asColor('rgba($a, 0.9)'),
        '$r': '42%'
      }).asColor(0x2a, 0x15, 0x40, 0.942);
    });
    itParses('color(#fd0cc7 tint(66%))').asColor(254, 172, 236);
    itParses('adjust-color(#102030, $red: -5, $blue: 5)', 11, 32, 53);
    itParses('adjust-color(hsl(25, 100%, 80%), $lightness: -30%, $alpha: -0.4)', 255, 106, 0, 0.6);
    itParses('adjust-color($c, $red: $a, $blue: $b)').asInvalid();
    itParses('adjust-color($d, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$d': asColor('rgba($c, 1)')
    }).asInvalid();
    itParses('adjust-color($c, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$c': asColor('#102030')
    }).asColor(11, 32, 53);
    itParses('adjust-color($d, $red: $a, $blue: $b)').withContext({
      '$a': '-5',
      '$b': '5',
      '$c': asColor('#102030'),
      '$d': asColor('rgba($c, 1)')
    }).asColor(11, 32, 53);
    itParses('scale-color(rgb(200, 150, 170), $green: -40%, $blue: 70%)').asColor(200, 90, 230);
    itParses('change-color(rgb(200, 150, 170), $green: 40, $blue: 70)').asColor(200, 40, 70);
    itParses('scale-color($c, $green: $a, $blue: $b)').asInvalid();
    itParses('scale-color($d, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$d': asColor('rgba($c, 1)')
    }).asInvalid();
    itParses('scale-color($c, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$c': asColor('rgb(200, 150, 170)')
    }).asColor(200, 90, 230);
    itParses('scale-color($d, $green: $a, $blue: $b)').withContext({
      '$a': '-40%',
      '$b': '70%',
      '$c': asColor('rgb(200, 150, 170)'),
      '$d': asColor('rgba($c, 1)')
    }).asColor(200, 90, 230);
    itParses('spin(#F00, 120)').asColor(0, 255, 0);
    itParses('spin(#F00, 120)').asColor(0, 255, 0);
    itParses('spin(#F00, 120deg)').asColor(0, 255, 0);
    itParses('spin(#F00, -120)').asColor(0, 0, 255);
    itParses('spin(#F00, -120deg)').asColor(0, 0, 255);
    itParses('spin(@c, @a)').withContext({
      '@c': asColor('#F00'),
      '@a': '120'
    }).asColor(0, 255, 0);
    itParses('spin(@c, @a)').withContext({
      '@a': '120'
    }).asInvalid();
    itParses('spin(@c, @a)').withContext({
      '@a': '120'
    }).asInvalid();
    itParses('spin(@c, @a,)').asUndefined();
    itParses('fade(#F00, 0.5)').asColor(255, 0, 0, 0.5);
    itParses('fade(#F00, 50%)').asColor(255, 0, 0, 0.5);
    itParses('fade(#F00, 50)').asColor(255, 0, 0, 0.5);
    itParses('fade(@c, @a)').withContext({
      '@c': asColor('#F00'),
      '@a': '0.5'
    }).asColor(255, 0, 0, 0.5);
    itParses('fade(@c, @a)').withContext({
      '@a': '0.5'
    }).asInvalid();
    itParses('fade(@c, @a)').withContext({
      '@a': '0.5'
    }).asInvalid();
    itParses('fade(@c, @a,)').asUndefined();
    itParses('contrast(#bbbbbb)').asColor(0, 0, 0);
    itParses('contrast(#333333)').asColor(255, 255, 255);
    itParses('contrast(#bbbbbb, rgb(20,20,20))').asColor(20, 20, 20);
    itParses('contrast(#333333, rgb(20,20,20), rgb(140,140,140))').asColor(140, 140, 140);
    itParses('contrast(#666666, rgb(20,20,20), rgb(140,140,140), 13%)').asColor(140, 140, 140);
    itParses('contrast(@base)').withContext({
      '@base': asColor('#bbbbbb')
    }).asColor(0, 0, 0);
    itParses('contrast(@base)').withContext({
      '@base': asColor('#333333')
    }).asColor(255, 255, 255);
    itParses('contrast(@base, @dark)').withContext({
      '@base': asColor('#bbbbbb'),
      '@dark': asColor('rgb(20,20,20)')
    }).asColor(20, 20, 20);
    itParses('contrast(@base, @dark, @light)').withContext({
      '@base': asColor('#333333'),
      '@dark': asColor('rgb(20,20,20)'),
      '@light': asColor('rgb(140,140,140)')
    }).asColor(140, 140, 140);
    itParses('contrast(@base, @dark, @light, @threshold)').withContext({
      '@base': asColor('#666666'),
      '@dark': asColor('rgb(20,20,20)'),
      '@light': asColor('rgb(140,140,140)'),
      '@threshold': '13%'
    }).asColor(140, 140, 140);
    itParses('contrast(@base)').asInvalid();
    itParses('contrast(@base)').asInvalid();
    itParses('contrast(@base, @dark)').asInvalid();
    itParses('contrast(@base, @dark, @light)').asInvalid();
    itParses('contrast(@base, @dark, @light, @threshold)').asInvalid();
    itParses('multiply(#ff6600, 0x666666)').asColor('#662900');
    itParses('multiply(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#662900');
    itParses('multiply(@base, @modifier)').asInvalid();
    itParses('screen(#ff6600, 0x666666)').asColor('#ffa366');
    itParses('screen(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ffa366');
    itParses('screen(@base, @modifier)').asInvalid();
    itParses('overlay(#ff6600, 0x666666)').asColor('#ff5200');
    itParses('overlay(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ff5200');
    itParses('overlay(@base, @modifier)').asInvalid();
    itParses('softlight(#ff6600, 0x666666)').asColor('#ff5a00');
    itParses('softlight(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#ff5a00');
    itParses('softlight(@base, @modifier)').asInvalid();
    itParses('hardlight(#ff6600, 0x666666)').asColor('#cc5200');
    itParses('hardlight(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#cc5200');
    itParses('hardlight(@base, @modifier)').asInvalid();
    itParses('difference(#ff6600, 0x666666)').asColor('#990066');
    itParses('difference(#ff6600,)()').asInvalid();
    itParses('difference(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#990066');
    itParses('difference(@base, @modifier)').asInvalid();
    itParses('exclusion(#ff6600, 0x666666)').asColor('#997a66');
    itParses('exclusion(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#997a66');
    itParses('exclusion(@base, @modifier)').asInvalid();
    itParses('average(#ff6600, 0x666666)').asColor('#b36633');
    itParses('average(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#b36633');
    itParses('average(@base, @modifier)').asInvalid();
    itParses('negation(#ff6600, 0x666666)').asColor('#99cc66');
    itParses('negation(@base, @modifier)').withContext({
      '@base': asColor('#ff6600'),
      '@modifier': asColor('#666666')
    }).asColor('#99cc66');
    itParses('negation(@base, @modifier)').asInvalid();
    itParses('blend(rgba(#FFDE00,.42), 0x19C261)').asColor('#7ace38');
    itParses('blend(@top, @bottom)').withContext({
      '@top': asColor('rgba(#FFDE00,.42)'),
      '@bottom': asColor('0x19C261')
    }).asColor('#7ace38');
    itParses('blend(@top, @bottom)').asInvalid();
    itParses('complement(red)').asColor('#00ffff');
    itParses('complement(@base)').withContext({
      '@base': asColor('red')
    }).asColor('#00ffff');
    itParses('complement(@base)').asInvalid();
    itParses('transparentify(#808080)').asColor(0, 0, 0, 0.5);
    itParses('transparentify(#414141, black)').asColor(255, 255, 255, 0.25);
    itParses('transparentify(#91974C, 0xF34949, 0.5)').asColor(47, 229, 79, 0.5);
    itParses('transparentify(a)').withContext({
      'a': asColor('#808080')
    }).asColor(0, 0, 0, 0.5);
    itParses('transparentify(a, b, 0.5)').withContext({
      'a': asColor('#91974C'),
      'b': asColor('#F34949')
    }).asColor(47, 229, 79, 0.5);
    itParses('transparentify(a)').asInvalid();
    itParses('red(#000, 255)').asColor(255, 0, 0);
    itParses('red(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(255, 0, 0);
    itParses('red(a, b)').asInvalid();
    itParses('green(#000, 255)').asColor(0, 255, 0);
    itParses('green(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(0, 255, 0);
    itParses('green(a, b)').asInvalid();
    itParses('blue(#000, 255)').asColor(0, 0, 255);
    itParses('blue(a, b)').withContext({
      'a': asColor('#000'),
      'b': '255'
    }).asColor(0, 0, 255);
    itParses('blue(a, b)').asInvalid();
    itParses('alpha(#000, 0.5)').asColor(0, 0, 0, 0.5);
    itParses('alpha(a, b)').withContext({
      'a': asColor('#000'),
      'b': '0.5'
    }).asColor(0, 0, 0, 0.5);
    itParses('alpha(a, b)').asInvalid();
    itParses('hue(#00c, 90deg)').asColor(0x66, 0xCC, 0);
    itParses('hue(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '90deg'
    }).asColor(0x66, 0xCC, 0);
    itParses('hue(a, b)').asInvalid();
    itParses('saturation(#00c, 50%)').asColor(0x33, 0x33, 0x99);
    itParses('saturation(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '50%'
    }).asColor(0x33, 0x33, 0x99);
    itParses('saturation(a, b)').asInvalid();
    itParses('lightness(#00c, 80%)').asColor(0x99, 0x99, 0xff);
    itParses('lightness(a, b)').withContext({
      'a': asColor('#00c'),
      'b': '80%'
    }).asColor(0x99, 0x99, 0xff);
    itParses('lightness(a, b)').asInvalid();
    describe('lua color', function() {
      beforeEach(function() {
        return this.scope = 'lua';
      });
      itParses('Color(255, 0, 0, 255)').asColor(255, 0, 0);
      itParses('Color(r, g, b, a)').withContext({
        'r': '255',
        'g': '0',
        'b': '0',
        'a': '255'
      }).asColor(255, 0, 0);
      return itParses('Color(r, g, b, a)').asInvalid();
    });
    return describe('elm-lang support', function() {
      beforeEach(function() {
        return this.scope = 'elm';
      });
      itParses('rgba 255 0 0 1').asColor(255, 0, 0);
      itParses('rgba r g b a').withContext({
        'r': '255',
        'g': '0',
        'b': '0',
        'a': '1'
      }).asColor(255, 0, 0);
      itParses('rgba r g b a').asInvalid();
      itParses('rgb 255 0 0').asColor(255, 0, 0);
      itParses('rgb r g b').withContext({
        'r': '255',
        'g': '0',
        'b': '0'
      }).asColor(255, 0, 0);
      itParses('rgb r g b').asInvalid();
      itParses('hsla (degrees 200) 50 50 0.5').asColor(64, 149, 191, 0.5);
      itParses('hsla (degrees h) s l a').withContext({
        'h': '200',
        's': '50',
        'l': '50',
        'a': '0.5'
      }).asColor(64, 149, 191, 0.5);
      itParses('hsla (degrees h) s l a').asInvalid();
      itParses('hsla 3.49 50 50 0.5').asColor(64, 149, 191, 0.5);
      itParses('hsla h s l a').withContext({
        'h': '3.49',
        's': '50',
        'l': '50',
        'a': '0.5'
      }).asColor(64, 149, 191, 0.5);
      itParses('hsla h s l a').asInvalid();
      itParses('hsl (degrees 200) 50 50').asColor(64, 149, 191);
      itParses('hsl (degrees h) s l').withContext({
        'h': '200',
        's': '50',
        'l': '50'
      }).asColor(64, 149, 191);
      itParses('hsl (degrees h) s l').asInvalid();
      itParses('hsl 3.49 50 50').asColor(64, 149, 191);
      itParses('hsl h s l').withContext({
        'h': '3.49',
        's': '50',
        'l': '50'
      }).asColor(64, 149, 191);
      itParses('hsl h s l').asInvalid();
      itParses('grayscale 1').asColor(0, 0, 0);
      itParses('greyscale 0.5').asColor(127, 127, 127);
      itParses('grayscale 0').asColor(255, 255, 255);
      itParses('grayscale g').withContext({
        'g': '0.5'
      }).asColor(127, 127, 127);
      itParses('grayscale g').asInvalid();
      itParses('complement rgb 255 0 0').asColor('#00ffff');
      itParses('complement base').withContext({
        'base': asColor('red')
      }).asColor('#00ffff');
      return itParses('complement base').asInvalid();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2NvbG9yLXBhcnNlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvREFBQTs7QUFBQSxFQUFBLE9BQUEsQ0FBUSxvQkFBUixDQUFBLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLHFCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FIZixDQUFBOztBQUFBLEVBSUEsZUFBQSxHQUFrQixPQUFBLENBQVEseUJBQVIsQ0FKbEIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsMEJBQVIsQ0FMWCxDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsb0NBQUE7QUFBQSxJQUFDLFNBQVUsS0FBWCxDQUFBO0FBQUEsSUFFQSxPQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7YUFBWSxRQUFBLEdBQVEsTUFBcEI7SUFBQSxDQUZWLENBQUE7QUFBQSxJQUlBLFNBQUEsR0FBWSxTQUFDLE9BQUQsR0FBQTtBQUNWLE1BQUEsT0FBQSxHQUFjLElBQUEsWUFBQSxtQkFBYSxVQUFVO0FBQUEsUUFBQyxVQUFBLFFBQUQ7T0FBdkIsQ0FBZCxDQUFBO2FBQ0EsT0FBTyxDQUFDLE9BRkU7SUFBQSxDQUpaLENBQUE7QUFBQSxJQVFBLFFBQUEsR0FBVyxTQUFDLFVBQUQsR0FBQTthQUNUO0FBQUEsUUFBQSxXQUFBLEVBQWEsRUFBYjtBQUFBLFFBQ0EsT0FBQSxFQUFTLFNBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxHQUFBO0FBQ1AsY0FBQSxPQUFBOztZQURjLElBQUU7V0FDaEI7QUFBQSxVQUFBLE9BQUEs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

//# sourceURL=/home/andy/.atom/packages/pigments/spec/color-parser-spec.coffee
