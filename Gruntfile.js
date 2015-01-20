"use strict";

module.exports = function(grunt) {
  // Project configuration
  grunt.initConfig({

    // Linting
    eslint: {
      files: [
        "*.js",
        "test/*.js"
      ]
    },

    // Unit tests
    nodeunit: {
      files: ["test/*.js"]
    },

    // Watcher
    watch: {
      files: ["**/*.js"],
      tasks: ["default"]
    }
  });

  // Load required plugins
  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-eslint");

  // Default: Test and lint
  grunt.registerTask("default", ["nodeunit", "eslint"]);
};
