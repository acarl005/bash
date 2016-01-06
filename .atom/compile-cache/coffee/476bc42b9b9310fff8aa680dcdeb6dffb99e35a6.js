(function() {
  var Pigments, registry;

  registry = require('../../lib/color-expressions');

  Pigments = require('../../lib/pigments');

  beforeEach(function() {
    Pigments.loadDeserializersAndRegisterViews();
    return registry.removeExpression('pigments:variables');
  });

  afterEach(function() {
    return registry.removeExpression('pigments:variables');
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9waWdtZW50cy9zcGVjL2hlbHBlcnMvc3BlYy1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSw2QkFBUixDQUFYLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG9CQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxJQUFBLFFBQVEsQ0FBQyxpQ0FBVCxDQUFBLENBQUEsQ0FBQTtXQUNBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixvQkFBMUIsRUFGUztFQUFBLENBQVgsQ0FIQSxDQUFBOztBQUFBLEVBT0EsU0FBQSxDQUFVLFNBQUEsR0FBQTtXQUNSLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixvQkFBMUIsRUFEUTtFQUFBLENBQVYsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/home/andy/.atom/packages/pigments/spec/helpers/spec-helper.coffee
