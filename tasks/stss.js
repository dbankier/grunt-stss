/*
 * grunt-stss
 * https://github.com/dbankier/grunt-stss
 *
 * Copyright (c) 2014 David Bankier
 * Licensed under the MIT license.
 */

'use strict';

var stss = require("stss");
var path = require("path");

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('stss', 'grunt plugin for stss', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '',
      separator: ', '
    });

    // Iterate over all specified file groups.

    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;
      stss.renderSync({
        data: src,
        file: f.src[0],
        includePaths: [path.join(process.cwd(), path.dirname(f.src))],
        success: function(tss) {
          grunt.file.write(f.dest, tss);
          grunt.log.writeln('File "' + f.dest + '" created.');
        },
        error: function(err) {
          grunt.fail.fatal(err);
        }
      });
    });
  });
};

