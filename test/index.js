/* globals it, describe */

var assert = require('assert')
var fs = require('fs')
var gutil = require('gulp-util')
var gulpStandard = require('../')
var standard = require('standard')

var testFile1 = fs.readFileSync('test/fixtures/testFile1.js')

describe('gulp-standard', function () {
  it('should lint files', function (done) {
    var stream = gulpStandard(standard)
    var fakeFile = new gutil.File({
      base: 'test/fixtures',
      cwd: 'test/',
      path: 'test/fixtures/testFile1.js',
      contents: testFile1
    })

    stream.once('data', function (newFile) {
      assert(newFile && newFile.standard)
      assert.equal(newFile.standard.results[0].messages[0].message, "Expected '===' and instead saw '=='.")

      done()
    })

    stream.write(fakeFile)
    stream.end()
  })
})
