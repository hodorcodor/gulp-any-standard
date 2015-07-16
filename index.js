var PLUGIN_NAME = require('./package.json').name
var defaultReporter = require('./reporters/stylish')
var gutil = require('gulp-util')
var through2 = require('through2')

function gulpStandard (standard, opts) {
  opts = opts || {}

  function processFile (file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file)
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported!'))
      return cb()
    }

    standard.lintText(String(file.contents), opts, function (err, data) {
      if (err) {
        return cb(err)
      }
      file.standard = data
      cb(null, file)
    })
  }

  return through2.obj(processFile)
}

gulpStandard.reporter = function (reporter, opts) {
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

module.exports = gulpStandard
