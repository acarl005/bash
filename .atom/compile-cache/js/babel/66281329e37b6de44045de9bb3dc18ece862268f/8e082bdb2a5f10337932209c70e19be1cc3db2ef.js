Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _jshintSrcCli = require('jshint/src/cli');

var _jshintSrcCli2 = _interopRequireDefault(_jshintSrcCli);

var _userHome = require('user-home');

var _userHome2 = _interopRequireDefault(_userHome);

// from JSHint //
// Storage for memoized results from find file
// Should prevent lots of directory traversal &
// lookups when liniting an entire project
'use babel';
var findFileResults = {};

/**
 * Searches for a file with a specified name starting with
 * 'dir' and going all the way up either until it finds the file
 * or hits the root.
 *
 * @param {string} name filename to search for (e.g. .jshintrc)
 * @param {string} dir  directory to start search from
 *
 * @returns {string} normalized filename
 */
var findFile = function findFile(_x, _x2) {
	var _again = true;

	_function: while (_again) {
		var name = _x,
		    dir = _x2;
		_again = false;

		var filename = _path2['default'].normalize(_path2['default'].join(dir, name));
		if (findFileResults[filename] !== undefined) {
			return findFileResults[filename];
		}

		var parent = _path2['default'].resolve(dir, '../');

		if (_shelljs2['default'].test('-e', filename)) {
			findFileResults[filename] = filename;
			return filename;
		}

		if (dir === parent) {
			findFileResults[filename] = null;
			return null;
		}

		_x = name;
		_x2 = parent;
		_again = true;
		filename = parent = undefined;
		continue _function;
	}
};

/**
 * Tries to find a configuration file in either project directory
 * or in the home directory. Configuration files are named
 * '.jshintrc'.
 *
 * @param {string} file path to the file to be linted
 * @returns {string} a path to the config file
 */
var findConfig = function findConfig(file) {
	var dir = _path2['default'].dirname(_path2['default'].resolve(file));
	var home = _path2['default'].normalize(_path2['default'].join(_userHome2['default'], '.jshintrc'));

	var proj = findFile('.jshintrc', dir);
	if (proj) {
		return proj;
	}

	if (_shelljs2['default'].test('-e', home)) {
		return home;
	}

	return null;
};

/**
 * Tries to find JSHint configuration within a package.json file
 * (if any). It search in the current directory and then goes up
 * all the way to the root just like findFile.
 *
 * @param   {string} file path to the file to be linted
 * @returns {object} config object
 */
var loadNpmConfig = function loadNpmConfig(file) {
	var dir = _path2['default'].dirname(_path2['default'].resolve(file));
	var fp = findFile('package.json', dir);

	if (!fp) {
		return null;
	}

	try {
		return require(fp).jshintConfig;
	} catch (e) {
		return null;
	}
};
// / //

var loadConfigIfValid = function loadConfigIfValid(filename) {
	var strip = require('strip-json-comments');
	try {
		JSON.parse(strip(_fs2['default'].readFileSync(filename, 'utf8')));
		return _jshintSrcCli2['default'].loadConfig(filename);
	} catch (e) {}
	return {};
};

var loadConfig = function loadConfig(file) {
	var config = loadNpmConfig(file) || loadConfigIfValid(findConfig(file));
	if (config && config.dirname) {
		delete config.dirname;
	}
	return config;
};

exports['default'] = loadConfig;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2FuZHkvLmF0b20vcGFja2FnZXMvanNoaW50L2xvYWQtY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztrQkFDZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7dUJBQ04sU0FBUzs7Ozs0QkFDVixnQkFBZ0I7Ozs7d0JBQ1gsV0FBVzs7Ozs7Ozs7QUFMaEMsV0FBVyxDQUFDO0FBV1osSUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7QUFZM0IsSUFBTSxRQUFRLEdBQUcsU0FBWCxRQUFROzs7MkJBQWtCO01BQWQsSUFBSTtNQUFFLEdBQUc7OztBQUMxQixNQUFNLFFBQVEsR0FBRyxrQkFBSyxTQUFTLENBQUMsa0JBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3RELE1BQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtBQUM1QyxVQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNqQzs7QUFFRCxNQUFNLE1BQU0sR0FBRyxrQkFBSyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUV4QyxNQUFJLHFCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUU7QUFDOUIsa0JBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUM7QUFDckMsVUFBTyxRQUFRLENBQUM7R0FDaEI7O0FBRUQsTUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO0FBQ25CLGtCQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLFVBQU8sSUFBSSxDQUFDO0dBQ1o7O09BRWUsSUFBSTtRQUFFLE1BQU07O0FBakJ0QixVQUFRLEdBS1IsTUFBTTs7RUFhWjtDQUFBLENBQUM7Ozs7Ozs7Ozs7QUFVRixJQUFNLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBRyxJQUFJLEVBQUk7QUFDMUIsS0FBTSxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdDLEtBQU0sSUFBSSxHQUFHLGtCQUFLLFNBQVMsQ0FBQyxrQkFBSyxJQUFJLHdCQUFXLFdBQVcsQ0FBQyxDQUFDLENBQUM7O0FBRTlELEtBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEMsS0FBSSxJQUFJLEVBQUU7QUFDVCxTQUFPLElBQUksQ0FBQztFQUNaOztBQUVELEtBQUkscUJBQUssSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtBQUMxQixTQUFPLElBQUksQ0FBQztFQUNaOztBQUVELFFBQU8sSUFBSSxDQUFDO0NBQ1osQ0FBQzs7Ozs7Ozs7OztBQVVGLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBRyxJQUFJLEVBQUk7QUFDN0IsS0FBTSxHQUFHLEdBQUcsa0JBQUssT0FBTyxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzdDLEtBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXpDLEtBQUksQ0FBQyxFQUFFLEVBQUU7QUFDUixTQUFPLElBQUksQ0FBQztFQUNaOztBQUVELEtBQUk7QUFDSCxTQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUM7RUFDaEMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNYLFNBQU8sSUFBSSxDQUFDO0VBQ1o7Q0FDRCxDQUFDOzs7QUFHRixJQUFNLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFHLFFBQVEsRUFBSTtBQUNyQyxLQUFNLEtBQUssR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM3QyxLQUFJO0FBQ0gsTUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZ0JBQUcsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsU0FBTywwQkFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDaEMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUNYO0FBQ0QsUUFBTyxFQUFFLENBQUM7Q0FDVixDQUFDOztBQUVGLElBQU0sVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFHLElBQUksRUFBSTtBQUMxQixLQUFNLE1BQU0sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDMUUsS0FBSSxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUM3QixTQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUM7RUFDdEI7QUFDRCxRQUFPLE1BQU0sQ0FBQztDQUNkLENBQUM7O3FCQUVhLFVBQVUiLCJmaWxlIjoiL2hvbWUvYW5keS8uYXRvbS9wYWNrYWdlcy9qc2hpbnQvbG9hZC1jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBzaGpzIGZyb20gJ3NoZWxsanMnO1xuaW1wb3J0IGNsaSBmcm9tICdqc2hpbnQvc3JjL2NsaSc7XG5pbXBvcnQgdXNlckhvbWUgZnJvbSAndXNlci1ob21lJztcblxuLy8gZnJvbSBKU0hpbnQgLy9cbi8vIFN0b3JhZ2UgZm9yIG1lbW9pemVkIHJlc3VsdHMgZnJvbSBmaW5kIGZpbGVcbi8vIFNob3VsZCBwcmV2ZW50IGxvdHMgb2YgZGlyZWN0b3J5IHRyYXZlcnNhbCAmXG4vLyBsb29rdXBzIHdoZW4gbGluaXRpbmcgYW4gZW50aXJlIHByb2plY3RcbmNvbnN0IGZpbmRGaWxlUmVzdWx0cyA9IHt9O1xuXG4vKipcbiAqIFNlYXJjaGVzIGZvciBhIGZpbGUgd2l0aCBhIHNwZWNpZmllZCBuYW1lIHN0YXJ0aW5nIHdpdGhcbiAqICdkaXInIGFuZCBnb2luZyBhbGwgdGhlIHdheSB1cCBlaXRoZXIgdW50aWwgaXQgZmluZHMgdGhlIGZpbGVcbiAqIG9yIGhpdHMgdGhlIHJvb3QuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgZmlsZW5hbWUgdG8gc2VhcmNoIGZvciAoZS5nLiAuanNoaW50cmMpXG4gKiBAcGFyYW0ge3N0cmluZ30gZGlyICBkaXJlY3RvcnkgdG8gc3RhcnQgc2VhcmNoIGZyb21cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBub3JtYWxpemVkIGZpbGVuYW1lXG4gKi9cbmNvbnN0IGZpbmRGaWxlID0gKG5hbWUsIGRpcikgPT4ge1xuXHRjb25zdCBmaWxlbmFtZSA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihkaXIsIG5hbWUpKTtcblx0aWYgKGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBmaW5kRmlsZVJlc3VsdHNbZmlsZW5hbWVdO1xuXHR9XG5cblx0Y29uc3QgcGFyZW50ID0gcGF0aC5yZXNvbHZlKGRpciwgJy4uLycpO1xuXG5cdGlmIChzaGpzLnRlc3QoJy1lJywgZmlsZW5hbWUpKSB7XG5cdFx0ZmluZEZpbGVSZXN1bHRzW2ZpbGVuYW1lXSA9IGZpbGVuYW1lO1xuXHRcdHJldHVybiBmaWxlbmFtZTtcblx0fVxuXG5cdGlmIChkaXIgPT09IHBhcmVudCkge1xuXHRcdGZpbmRGaWxlUmVzdWx0c1tmaWxlbmFtZV0gPSBudWxsO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cmV0dXJuIGZpbmRGaWxlKG5hbWUsIHBhcmVudCk7XG59O1xuXG4vKipcbiAqIFRyaWVzIHRvIGZpbmQgYSBjb25maWd1cmF0aW9uIGZpbGUgaW4gZWl0aGVyIHByb2plY3QgZGlyZWN0b3J5XG4gKiBvciBpbiB0aGUgaG9tZSBkaXJlY3RvcnkuIENvbmZpZ3VyYXRpb24gZmlsZXMgYXJlIG5hbWVkXG4gKiAnLmpzaGludHJjJy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZSBwYXRoIHRvIHRoZSBmaWxlIHRvIGJlIGxpbnRlZFxuICogQHJldHVybnMge3N0cmluZ30gYSBwYXRoIHRvIHRoZSBjb25maWcgZmlsZVxuICovXG5jb25zdCBmaW5kQ29uZmlnID0gZmlsZSA9PiB7XG5cdGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShwYXRoLnJlc29sdmUoZmlsZSkpO1xuXHRjb25zdCBob21lID0gcGF0aC5ub3JtYWxpemUocGF0aC5qb2luKHVzZXJIb21lLCAnLmpzaGludHJjJykpO1xuXG5cdGNvbnN0IHByb2ogPSBmaW5kRmlsZSgnLmpzaGludHJjJywgZGlyKTtcblx0aWYgKHByb2opIHtcblx0XHRyZXR1cm4gcHJvajtcblx0fVxuXG5cdGlmIChzaGpzLnRlc3QoJy1lJywgaG9tZSkpIHtcblx0XHRyZXR1cm4gaG9tZTtcblx0fVxuXG5cdHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBUcmllcyB0byBmaW5kIEpTSGludCBjb25maWd1cmF0aW9uIHdpdGhpbiBhIHBhY2thZ2UuanNvbiBmaWxlXG4gKiAoaWYgYW55KS4gSXQgc2VhcmNoIGluIHRoZSBjdXJyZW50IGRpcmVjdG9yeSBhbmQgdGhlbiBnb2VzIHVwXG4gKiBhbGwgdGhlIHdheSB0byB0aGUgcm9vdCBqdXN0IGxpa2UgZmluZEZpbGUuXG4gKlxuICogQHBhcmFtICAge3N0cmluZ30gZmlsZSBwYXRoIHRvIHRoZSBmaWxlIHRvIGJlIGxpbnRlZFxuICogQHJldHVybnMge29iamVjdH0gY29uZmlnIG9iamVjdFxuICovXG5jb25zdCBsb2FkTnBtQ29uZmlnID0gZmlsZSA9PiB7XG5cdGNvbnN0IGRpciA9IHBhdGguZGlybmFtZShwYXRoLnJlc29sdmUoZmlsZSkpO1xuXHRjb25zdCBmcCA9IGZpbmRGaWxlKCdwYWNrYWdlLmpzb24nLCBkaXIpO1xuXG5cdGlmICghZnApIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHRyeSB7XG5cdFx0cmV0dXJuIHJlcXVpcmUoZnApLmpzaGludENvbmZpZztcblx0fSBjYXRjaCAoZSkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG59O1xuLy8gLyAvL1xuXG5jb25zdCBsb2FkQ29uZmlnSWZWYWxpZCA9IGZpbGVuYW1lID0+IHtcblx0Y29uc3Qgc3RyaXAgPSByZXF1aXJlKCdzdHJpcC1qc29uLWNvbW1lbnRzJyk7XG5cdHRyeSB7XG5cdFx0SlNPTi5wYXJzZShzdHJpcChmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JykpKTtcblx0XHRyZXR1cm4gY2xpLmxvYWRDb25maWcoZmlsZW5hbWUpO1xuXHR9IGNhdGNoIChlKSB7XG5cdH1cblx0cmV0dXJuIHt9O1xufTtcblxuY29uc3QgbG9hZENvbmZpZyA9IGZpbGUgPT4ge1xuXHRjb25zdCBjb25maWcgPSBsb2FkTnBtQ29uZmlnKGZpbGUpIHx8IGxvYWRDb25maWdJZlZhbGlkKGZpbmRDb25maWcoZmlsZSkpO1xuXHRpZiAoY29uZmlnICYmIGNvbmZpZy5kaXJuYW1lKSB7XG5cdFx0ZGVsZXRlIGNvbmZpZy5kaXJuYW1lO1xuXHR9XG5cdHJldHVybiBjb25maWc7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBsb2FkQ29uZmlnO1xuIl19
//# sourceURL=/home/andy/.atom/packages/jshint/load-config.js
