module.exports = function (grunt) {

    var libraries = [
        'node_modules/ace-builds/src/ace.js',
        'node_modules/ace-builds/src/theme-eclipse.js',
        'node_modules/ace-builds/src/mode-json.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-bootstrap/ui-bootstrap.js',
        'node_modules/angular-bootstrap/ui-bootstrap-tpls.js',
        'node_modules/angular-jwt/dist/angular-jwt.js',
        'node_modules/angular-sanitize/angular-sanitize.js',
        'node_modules/angular-ui-ace/src/ui-ace.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        'node_modules/d3/d3.js',
        'node_modules/line-chart/build/line-chart.js',
        'node_modules/ng-file-upload/dist/ng-file-upload.js',
        'node_modules/ng-toast/dist/ngToast.js',
        'node_modules/selection-model/dist/selection-model.js',
        'node_modules/sortablejs/Sortable.js',
        'node_modules/sortablejs/ng-sortable.js'
    ];

    grunt
        .initConfig({
            pkg: grunt.file.readJSON('package.json'),

            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                app: {
                    files: {
                        './app/alex.min.js': ['./app/alex.js']
                    }
                },
                libs: {
                    files: {
                        './app/libs.min.js': ['./app/libs.js']
                    }
                }
            },

            concat: {
                options: {
                    separator: ';\n'
                },
                libs: {
                    src: libraries,
                    dest: 'app/libs.js'
                }
            },

            html2js: {
                options: {
                    useStrict: true,
                    base: '../webapp/app',
                    module: 'ALEX.templates',
                    singleModule: true,
                    htmlmin: {
                        collapseBooleanAttributes: false,
                        collapseWhitespace: true,
                        removeAttributeQuotes: false,
                        removeComments: true,
                        removeEmptyAttributes: false,
                        removeRedundantAttributes: false,
                        removeScriptTypeAttributes: false,
                        removeStyleLinkTypeAttributes: false
                    }
                },
                all: {
                    src: ['app/views/**/*.html'],
                    dest: 'app/alex.templates.js'
                }
            },

            watch: {
                scripts: {
                    files: ['app/modules/**/*.js'],
                    tasks: ['build-js'],
                    options: {
                        spawn: false
                    }
                },
                sass: {
                    files: ['app/stylesheets/**/*.scss'],
                    tasks: ['build-css'],
                    options: {
                        spawn: false
                    }
                },
                html: {
                    files: ['app/views/**/*.html'],
                    tasks: ['build-html'],
                    options: {
                        spawn: false
                    }
                }
            },

            sass: {
                options: {
                    sourceMap: false
                },
                dist: {
                    files: {
                        'app/stylesheets/style.css': 'app/stylesheets/style.scss'
                    }
                }
            },

            karma: {
                unit: {
                    configFile: 'tests/unit/karma.conf.js'
                }
            },

            cssmin: {
                target: {
                    files: {
                        'app/style.min.css': [
                            'node_modules/ng-toast/dist/ngToast.min.css',
                            'app/stylesheets/style.css'
                        ]
                    }
                }
            },

            copy: {
                fonts: {
                    files: [
                        {
                            expand: true,
                            flatten: true,
                            src: ['node_modules/font-awesome/fonts/**'],
                            dest: 'app/fonts',
                            filter: 'isFile'
                        }
                    ]
                }
            },

            postcss: {
                options: {
                    map: false,

                    processors: [
                        require('autoprefixer-core')({
                            browsers: 'last 2 versions'
                        })
                    ]
                },
                dist: {
                    src: 'app/stylesheets/style.css'
                }
            },

            ngAnnotate: {
                options: {
                    singleQuotes: true
                },
                dist: {
                    files: {
                        'app/alex.js': ['app/alex.js']
                    }
                }
            },

            babel: {
                options: {
                    sourceMap: false,
                    presets: ['es2015'],
                    compact: false
                },
                dist: {
                    files: {
                        'app/alex.js': 'app/alex.js'
                    }
                }
            },

            browserify: {
                dist: {
                    files: {
                        'app/alex.js': ['app/modules/index.js']
                    },
                    options: {
                        transform: [['babelify', {
                            sourceMap: false,
                            presets: ['es2015'],
                            compact: false
                        }]]
                    }
                }
            }
        });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('build-js', ['browserify', 'ngAnnotate', 'uglify:app']);
    grunt.registerTask('build-css', ['sass', 'postcss', 'cssmin', 'copy:fonts']);
    grunt.registerTask('build-html', ['html2js']);
    grunt.registerTask('default', ['build-html', 'concat:libs', 'build-js', 'uglify:libs', 'build-css']);
    grunt.registerTask('test-unit', ['karma']);
};
