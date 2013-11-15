module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-type');
  grunt.loadNpmTasks('grunt-contrib-copy');

  /*
   grunt.loadNpmTasks('grunt-typescript');
   */

  // Project configuration.
  var port = grunt.option('webapp_port');
  var webapp_outdir = grunt.option('webapp_outdir');

  if (!port) {
    port = 8181;
  }

  grunt.task.registerTask('clean-appjs', 'Clean up generated app.js file', function() {
    var file = webapp_outdir + "/app/app.js";
    grunt.log.writeln("Cleaning up " + file);
    grunt.file.delete(file, { force: true });
  });

  var appFiles = ['src/main/webapp/d.ts/*.ts', 'src/main/webapp/app/**/*.ts'];

  grunt.initConfig({
    test:{
      files:['src/test/js/**/*.js']
    },
    type:{
      compile:{
        files: [
          {
            src: appFiles,
            dest:'src/main/webapp/app/'
          }
        ],
        options:{
          sourcemap: true,
          target: 'es5',
          //module:'amd',
          style:'eqeqeq;bitwise'
        }
      }
    },
    copy:{
      dist: {
        files: [
          {
            expand: true,
            cwd: "src/main/webapp/",
            src: ["./**"],
            dest: "<%= grunt.option('webapp_outdir') %>/"
          }
        ]
      },
      docs: {
        files: [
          {
            expand: true,
            cwd: "..",
            src: ["./*.md"],
            dest: "<%= grunt.option('webapp_outdir') %>/app/core/doc/"
          }
        ]
      },
      test: {
        files: [
          {
            expand: true,
            cwd: "<%= grunt.option('webapp_outdir') %>/",
            src: ["./**"],
            dest: "src/test/unit/"
          }]
      }
    },
    concat: {
      main: {
        src: ["target/schema/js/*.js", "src/main/webapp/app/**/*.js"],
        dest: "<%= grunt.option('webapp_outdir') %>/app/app.js"
      }
    },
    watch: {
      app: {
        files: ["src/main/webapp/lib/**",
                "src/main/webapp/app/**/*.js",
                "src/main/webapp/img/**",
                "src/main/webapp/css/**",
                "target/schema/js/*.js"],

        //tasks: ['clean-appjs', 'concat', 'copy:dist'],

        tasks: [],
        options: {
          livereload: true
        }
      }
    }
  });


  // Default task.
  grunt.registerTask('default', ['clean-appjs', 'type', 'concat', 'copy']);

  // watch source for changes
  //grunt.registerTask('watchSrc', ['concat', 'copy', 'watch']);
  grunt.registerTask('watchSrc', ['watch']);

};
