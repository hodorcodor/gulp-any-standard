var PLUGIN_NAME = require('../package.json').name
var appRoot = require('app-root-path')
var chalk = require('chalk')
var gutil = require('gulp-util')
var path = require('path')
var through2 = require('through2')

function Stylish (options) {
  var totalErrorCount = 0
  var totalWarningCount = 0

  // File specific reporter
  function reportFile (filepath, data) {
    var lines = [
      chalk.magenta.underline(path.relative(appRoot.path, filepath))
    ]

    // Loop file specific error/warning messages
    data.results.forEach(function (file) {
      file.messages.forEach(function (msg) {
        lines.push(
          chalk.yellow('line ' + msg.line + ':' + msg.column) + '\t' + chalk.cyan(msg.message)
        )
      })
    })

    // Error/Warning count
    lines.push(chalk.red(data.errorCount + ' error' + (data.errorCount === 1 ? 's' : '')) + '\t' + chalk.yellow(data.warningCount + ' warning' + (data.errorCount === 1 ? 's' : '')))

    return lines.join('\n') + '\n'
  }

  gutil.log(chalk.green('Standard linter results'))
  gutil.log('======================================\n')

  var stream = through2.obj(function (file, enc, callback) {
    if (file.isNull()) return callback(null, file)
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streams are not supported!'))

      return callback()
    }

    // Report file specific stuff only when there are some errors/warnings
    if (file.standard && (file.standard.errorCount || file.standard.warningCount)) {
      totalErrorCount += file.standard.errorCount
      totalWarningCount += file.standard.warningCount

      gutil.log(reportFile(file.path, file.standard))
    }

    callback()
  })

  stream.on('end', function () {
    if (!totalErrorCount && !totalWarningCount) {
      gutil.log(chalk.green('Success'))
      return
    }

    if (totalErrorCount) {
      if (options.breakOnError) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Linter errors occurred!'))
      }

      gutil.log(chalk.red('Errors: ' + totalErrorCount))
    }

    if (totalWarningCount) {
      if (options.breakOnWarning) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Linter warnings occurred!'))
      }

      gutil.log(chalk.yellow('Warnings: ' + totalWarningCount))
    }
  })

  return stream
}

module.exports = Stylish
