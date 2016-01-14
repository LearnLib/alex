module.exports = function (grunt) {

    var libraries = [
        'node_modules/ace-builds/src/ace.js',
        'node_modules/ace-builds/src/theme-eclipse.js',
        'node_modules/ace-builds/src/mode-json.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-bootstrap/ui-bootstrap.js',
        'node_modules/angular-bootstrap/ui-bootstrap-tpls.js',
        'node_modules/angular-sanitize/angular-sanitize.js',
        'node_modules/angular-ui-ace/src/ui-ace.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        'node_modules/n3-charts/build/LineChart.js',
        'node_modules/ng-toast/dist/ngToast.js',
        'node_modules/selection-model/dist/selection-model.js'
    ];

    grunt
        .initConfig({
            pkg: grunt.file.readJSON('package.json'),

            uglify: {
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
                        'app/style.css': 'app/stylesheets/style.scss'
                    }
                }
            },

            cssmin: {
                target: {
                    files: {
                        'app/style.min.css': [
                            'node_modules/ng-toast/dist/ngToast.min.css',
                            'node_modules/n3-charts/build/LineChart.css',
                            'node_modules/angular-dragula/dist/dragula.min.css',
                            'app/style.css'
                        ]
                    }
                }
            },

            postcss: {
                options: {
                    map: false,
                    processors: [
                        require('autoprefixer')({
                            browsers: 'last 2 versions'
                        })
                    ]
                },
                dist: {
                    src: 'app/style.css'
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
            },

            karma: {
                unit: {
                    configFile: 'tests/karma.conf.unit.js'
                }
            },

            jshint: {
                dist: {
                    src: ['app/modules/**/*.js']
                },
                options: {
                    'esnext': true,
                    'laxbreak': true,
                    '-W053': true
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
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build-js', ['browserify', 'ngAnnotate', 'uglify:app']);
    grunt.registerTask('build-css', ['sass', 'postcss', 'cssmin']);
    grunt.registerTask('build-html', ['html2js']);
    grunt.registerTask('default', ['build-html', 'concat:libs', 'build-js', 'uglify:libs', 'build-css']);
    grunt.registerTask('test', ['karma:unit']);
};
