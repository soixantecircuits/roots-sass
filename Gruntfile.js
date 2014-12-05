'use strict';
module.exports = function(grunt) {
  // Load all tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time
  require('time-grunt')(grunt);

  var appConfig = {
    app: 'assets/src',
    dev: 'assets/build/dev',
    prod: 'assets/build/prod'
  };

  // List of vendors/lib
  var vendorList = [
    'assets/vendor/modernizr/modernizr.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/alert.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/button.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/carousel.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/modal.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/popover.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/tab.js',
    'assets/vendor/bootstrap-sass-official/assets/javascripts/bootstrap/affix.js',
    'assets/vendor/gsap/src/minified/TweenMax.min.js',
    'assets/vendor/gsap/src/minified/TimelineMax.min.js',
    'assets/vendor/jquery-backstretch/jquery.backstretch.min.js',
    'assets/vendor/ScrollMagic/js/jquery.scrollmagic.min.js',
    'assets/vendor/ScrollMagic/js/jquery.scrollmagic.debug.js',
    'assets/vendor/slick.js/slick/slick.min.js',
    appConfig.app+'/js/lib/*.js',
    appConfig.app+'/js/_*.js'
  ];
  // What we coded
  var jsAppList = [
    appConfig.app+'/js/partials/helpers.js',
    appConfig.app+'/js/partials/buttons.js',
    appConfig.app+'/js/partials/scroll.js',
    appConfig.app+'/js/partials/*.js',
    '!'+appConfig.app+'/js/partials/main.js',
    appConfig.app+'/js/partials/main.js'
  ];

  grunt.initConfig({
    config: appConfig,

    clean: {
      dev: ['<%= config.dev %>'],
      prod: ['<%= config.prod%>']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/js/partials/*.js',
      ]
    },
    sass: {
      dev: {
        options: {
          style: 'expanded',
          compass: true,
        },
        files: {
          '<%= config.dev %>/css/main.css': [
            '<%= config.app %>/sass/main.scss'
          ]
        }
      },
      prod: {
        options: {
          style: 'compressed',
          compass: true,
        },
        files: {
          '<%= config.prod %>/css/main.min.css': [
            '<%= config.app %>/sass/main.scss'
          ]
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dev: {
        files: {
          '<%= config.dev %>/js/app.js': [jsAppList],
          '<%= config.dev %>/js/scripts.js': [vendorList]
        }
      },
    },
    uglify: {
      prod: {
        files: {
          '<%= config.prod %>/js/scripts.min.js': [
            vendorList,
            jsAppList
          ]
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
      },
      dev: {
        options: {
          map: {
            prev: '<%= config.dev %>/css/'
          }
        },
        src: '<%= config.dev %>/css/main.css'
      },
      prod: {
        src: '<%= config.prod %>/css/main.min.css'
      }
    },
    version: {
      default: {
        options: {
          format: true,
          length: 32,
          manifest: 'assets/manifest.json',
          querystring: {
            style: 'roots_css',
            script: 'roots_js'
          }
        },
        files: {
          'lib/scripts.php': '<%= config.prod %>/{css,js}/{main,scripts,app}.min.{css,js}'
        }
      }
    },
    watch: {
      sass: {
        files: [
          '<%= config.app %>/sass/*.scss',
          '<%= config.app %>/sass/**/*.scss'
        ],
        tasks: ['sass:dev', 'autoprefixer:dev']
      },
      js: {
        files: [
          vendorList,
          jsAppList
        ],
        tasks: ['jshint', 'concat']
      },
      livereload: {
        // Browser live reloading
        // https://github.com/gruntjs/grunt-contrib-watch#live-reloading
        options: {
          livereload: false
        },
        files: [
          '<%= config.dev %>/css/main.css',
          '<%= config.dev %>/js/scripts.js',
          'templates/*.php',
          '*.php'
        ]
      }
    }
  });

  // Register tasks
  grunt.registerTask('default', [
    'dev'
  ]);
  grunt.registerTask('dev', [
    'clean:dev', // Delete old dev folder to prevent errors
    'jshint', // Check code quality
    'sass:dev', // Compile Sass without minify || Dest: 'assets/dev/css/main.css'
    'autoprefixer:dev', // Parse CSS and add vendor-prefixed CSS properties || same dest as sass:dev
    'concat:dev', // Concat fils from jsFileList array
  ]);
  grunt.registerTask('prod', [
    'clean:prod', // Delete old build folder to prevent errors
    'jshint', // Check code quality
    'sass:prod', // Compile and minify Sass || Dest: 'assets/build/css/main.min.css'
    'autoprefixer:prod', // Parse CSS and add vendor-prefixed CSS properties || same dest as sass:build
    'uglify:prod', // Minify and concat vendorList array
    'version'
  ]);
  grunt.registerTask('build', [
    'dev',
    'prod'
  ]);
  grunt.registerTask('serve', [
    'dev',
    'watch'
  ]);
};
