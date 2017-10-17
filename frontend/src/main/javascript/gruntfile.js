module.exports = function (grunt) {

    var libraries = [
        'node_modules/ace-builds/src/ace.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-ui-ace/src/ui-ace.js',
        'node_modules/n3-charts/build/LineChart.js',
        'node_modules/selection-model/dist/selection-model.js',
        'node_modules/d3/d3.js'
    ];

    grunt
        .initConfig({
            pkg: grunt.file.readJSON('package.json'),

            uglify: {
                app: {
                    files: {
                        './dist/alex.min.js': ['./dist/alex.js']
                    }
                },
                libs: {
                    files: {
                        './dist/libs.min.js': ['./dist/libs.js']
                    }
                }
            },

            concat: {
                options: {
                    separator: ';\n'
                },
                libs: {
                    src: libraries,
                    dest: 'dist/libs.js'
                }
            },

            html2js: {
                options: {
                    useStrict: true,
                    base: '../webapp/src',
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
                    src: ['src/html/**/*.html'],
                    dest: 'dist/alex.templates.js'
                }
            },

            watch: {
                scripts: {
                    files: ['src/js/**/*.js'],
                    tasks: ['build-js'],
                    options: {
                        spawn: false
                    }
                },
                sass: {
                    files: ['src/scss/**/*.scss'],
                    tasks: ['build-css'],
                    options: {
                        spawn: false
                    }
                },
                html: {
                    files: ['src/html/**/*.html'],
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
                        'dist/style.css': 'src/scss/style.scss'
                    }
                }
            },

            cssmin: {
                target: {
                    files: {
                        'dist/style.min.css': [
                            'node_modules/n3-charts/build/LineChart.css',
                            'node_modules/angular-dragula/dist/dragula.min.css',
                            'node_modules/angular-toastr/dist/angular-toastr.min.css',
                            'dist/style.css'
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
                    src: 'dist/style.css'
                }
            },

            ngAnnotate: {
                options: {
                    singleQuotes: true
                },
                dist: {
                    files: {
                        'dist/alex.js': ['dist/alex.js']
                    }
                }
            },

            browserify: {
                dist: {
                    files: {
                        'dist/alex.js': ['src/js/index.js']
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
                    src: ['src/js/**/*.js']
                },
                options: {
                    'esnext': true,
                    'laxbreak': true,
                    '-W053': true
                }
            },

            copy: {
                fonts: {
                    expand: true,
                    cwd: 'node_modules/font-awesome/fonts',
                    src: '*',
                    dest: 'assets/fonts',
                    filter: 'isFile'
                },
                swagger: {
                    expand: true,
                    cwd: 'node_modules/swagger-ui/dist',
                    src: ['**/*.js', '**/*.css', '**/*.gif', '**/*.png', '**/*.ttf'],
                    dest: 'assets/swagger-ui',
                    filter: 'isFile'
                }
            }
        });

    grunt.loadNpmTasks('grunt-contrib-copy');
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
    grunt.registerTask('default', ['build-html', 'concat:libs', 'build-js', 'uglify:libs', 'copy:fonts', 'build-css', 'copy:swagger']);
    grunt.registerTask('test', ['karma:unit']);
};
