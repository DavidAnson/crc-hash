"use strict";

module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({

    // Linting
    eslint: {
      files: [
        "*.js"
      ]
    },

    // Unit tests
    nodeunit: {
      files: ["crc-hash-test.js"]
    },

    // Watcher
    watch: {
      files: ["*.js"],
      tasks: ["default"]
    }
  });

  // Load required plugins
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-eslint");

  // Custom task measures code coverage of unit tests via Istanbul (assumed to be installed globally)
  grunt.registerTask("cover", "Code coverage via Istanbul", function() {
    var done = this.async();
    // Invoke CLI for simplicity
    grunt.util.spawn({
      cmd: "istanbul",
      args: [
        "cover",
        "node_modules/grunt-contrib-nodeunit/node_modules/nodeunit/bin/nodeunit",
        grunt.file.expand("crc-hash-test.js")]
    }, function(error, result) {
      grunt.log.write(result.stdout);
      if (error) {
        grunt.log.error(result.stderr);
      }
      done();
    });
  });

  // Default: Test and lint
  grunt.registerTask("default", ["nodeunit", "eslint"]);
};
