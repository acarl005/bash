(function() {
  var args, coffee, e, execSync;

  execSync = require('child_process').execSync;

  args = ['-e'];

  try {
    coffee = execSync('coffee -h');
    if (coffee.toString().match(/--cli/)) {
      args.push('--cli');
    }
  } catch (_error) {
    e = _error;
    console.error('unable to find coffee');
  }

  exports.args = args;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvbGliL2dyYW1tYXItdXRpbHMvY29mZmVlLXNjcmlwdC1jb21waWxlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEseUJBQUE7O0FBQUEsRUFBQyxXQUFZLE9BQUEsQ0FBUSxlQUFSLEVBQVosUUFBRCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLENBQUMsSUFBRCxDQUZQLENBQUE7O0FBR0E7QUFDRSxJQUFBLE1BQUEsR0FBUyxRQUFBLENBQVMsV0FBVCxDQUFULENBQUE7QUFDQSxJQUFBLElBQUcsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUFpQixDQUFDLEtBQWxCLENBQXdCLE9BQXhCLENBQUg7QUFDRSxNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixDQUFBLENBREY7S0FGRjtHQUFBLGNBQUE7QUFLRSxJQURJLFVBQ0osQ0FBQTtBQUFBLElBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyx1QkFBZCxDQUFBLENBTEY7R0FIQTs7QUFBQSxFQVVBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsSUFWZixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/script/lib/grammar-utils/coffee-script-compiler.coffee
