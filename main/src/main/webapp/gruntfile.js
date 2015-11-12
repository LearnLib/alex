module.exports = function (grunt) {

    var libraries = [
        'bower_components/angular/angular.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/lodash/lodash.min.js',
        'bower_components/selection-model/dist/selection-model.min.js',
        'bower_components/angular-ui-ace/ui-ace.min.js',
        'bower_components/ace-builds/src-min/ace.js',
        'bower_components/ace-builds/src-min/theme-eclipse.js',
        'bower_components/ace-builds/src-min/mode-json.js',
        'bower_components/ngToast/dist/ngToast.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/d3/d3.min.js',
        'bower_components/graphlib/dist/graphlib.core.min.js',
        'bower_components/dagre/dist/dagre.core.min.js',
        'bower_components/dagre-d3/dist/dagre-d3.core.min.js',
        'bower_components/n3-line-chart/build/line-chart.min.js',
        'bower_components/Sortable/Sortable.min.js',
        'bower_components/Sortable/ng-sortable.js',
        'bower_components/ng-file-upload/ng-file-upload.min.js',
        'bower_components/angular-jwt/dist/angular-jwt.min.js'
    ];

    grunt
        .initConfig({
            pkg: grunt.file.readJSON('bower.json'),

            uglify: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                app: {
                    files: {
                        './app/alex.min.js': ['./app/alex.js']
                    }
                }
            },

            concat: {
                options: {
                    separator: ';\n'
                },
                libs: {
                    src: libraries,
                    dest: 'app/libs.min.js'
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
                            'bower_components/ngToast/dist/ngToast.min.css',
                            'app/stylesheets/style.css'
                        ]
                    }
                }
            },

            bower: {
                install: {
                    options: {
                        targetDir: './bower_components/',
                        verbose: true,
                        copy: false
                    }
                }
            },

            copy: {
                fonts: {
                    files: [
                        {
                            expand: true,
                            flatten: true,
                            src: ['bower_components/font-awesome/fonts/**'],
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
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('build-js', ['browserify', 'ngAnnotate', 'uglify']);
    grunt.registerTask('build-css', ['sass', 'postcss', 'cssmin', 'copy:fonts']);
    grunt.registerTask('build-html', ['html2js']);
    grunt.registerTask('default', ['build-html', 'concat:libs', 'build-js', 'build-css']);
    grunt.registerTask('test-unit', ['karma']);
};
