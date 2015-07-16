var PLUGIN_NAME = require('./package.json').name
var defaultReporter = require('./reporters/stylish')
var gutil = require('gulp-util')
var through2 = require('through2')

module.exports = function (standard, opts) {
  opts = opts || {}

  return through2.obj(function (file, enc, callback) {
    if (file.isNull()) return callback(null, file)
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported!'))

      return callback()
    }

    standard.lintText(String(file.contents), opts, function (err, data) {
      if (err) return callback(err)

      file.standard = data

      callback(null, file)
    })
  })
}

module.exports.reporter = function (reporter, opts) {
  // Load default reporter
  if (reporter === 'default') return defaultReporter(opts)

  // Load reporter from function
  if (typeof reporter === 'function') return reporter(opts)

  // load built-in reporters
  if (typeof reporter === 'string') {
    try {
      return require('gulp-standard/reporters/' + reporter)(opts)
    } catch (err) {}
  }

  // load full-path or module reporters
  if (typeof reporter === 'string') {
    try {
      return require(reporter)(opts)
    } catch (err) {}
  }
}
