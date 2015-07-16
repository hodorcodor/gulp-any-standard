#gulp-any-standard

[![Build Status](https://travis-ci.org/dcousens/gulp-any-standard.png?branch=master)](https://travis-ci.org/dcousens/gulp-any-standard)
[![NPM version](https://badge.fury.io/js/gulp-any-standard.png)](http://badge.fury.io/js/gulp-any-standard)

[Standard](https://github.com/feross/standard/) linter for gulp, using dependency injection to allow use of *any* standard.


## Usage

#### Install

```sh
$ npm install --save-dev gulp-any-standard
```

## Examples

```javascript
// include the required packages.
var gulp = require('gulp')
var gulpStandard = require('gulp-any-standard')
var standard = require('standard')

gulp.task('standard', function () {
  return gulp.src(['./app.js'])
    .pipe(gulpStandard(standard))
    .pipe(gulpStandard.reporter('default', {
      breakOnError: true
    }))
})
```

## Reporters

#### Built-in

You can choose a reporter when you call
````javascript
stuff
  .pipe(gulpStandard(standard))
  .pipe(gulpStandard.reporter('default', opts))
External
````

You can also use some other custom made reporter
````javascript
var reporter = require(<SOME_REPORTER>);

stuff
  .pipe(gulpStandard(standard))
  .pipe(gulpStandard.reporter(reporter, opts))
````
OR -
````javascript
stuff
  .pipe(gulpStandard(standard))
  .pipe(gulpStandard.reporter(<REPORTER NAME>, opts))
````
#### Reporter options

##### breakOnError

Type: `boolean`
Default: `false`

Emit gulp error on reported error


## LICENSE [MIT](LICENSE)
