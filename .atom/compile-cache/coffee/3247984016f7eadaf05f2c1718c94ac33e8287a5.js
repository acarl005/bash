(function() {
  var crypto, fs, shasum;

  crypto = require('crypto');

  fs = require('fs');

  console.log("Let's hash these bugs out");

  shasum = crypto.createHash('sha1');

  shasum.update('I like it when you sum.');

  console.log(shasum.digest('hex'));

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvZXhhbXBsZXMvaGFzaGllLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQkFBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQUFULENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBR0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSwyQkFBWixDQUhBLENBQUE7O0FBQUEsRUFLQSxNQUFBLEdBQVMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsTUFBbEIsQ0FMVCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyx5QkFBZCxDQU5BLENBQUE7O0FBQUEsRUFPQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQU0sQ0FBQyxNQUFQLENBQWMsS0FBZCxDQUFaLENBUEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/andy/.atom/packages/script/examples/hashie.coffee
