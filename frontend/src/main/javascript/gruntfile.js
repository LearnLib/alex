module.exports = function (grunt) {

    const libraries = [
        'node_modules/ace-builds/src/ace.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-ui-ace/src/ui-ace.js',
        'node_modules/n3-charts/build/LineChart.js',
        'node_modules/selection-model/dist/selection-model.js'
    ];

    grunt
        .initConfig({
            buildLocation: '../../../target/classes',

            pkg: grunt.file.readJSON('package.json'),

            uglify: {
                app: {
                    files: {
                        '<%= buildLocation %>/js/alex.min.js': ['<%= buildLocation %>/js/alex.js']
                    }
                },
                libs: {
                    files: {
                        '<%= buildLocation %>/js/libs.min.js': ['<%= buildLocation %>/js/libs.js']
                    }
                }
            },

            concat: {
                options: {
                    separator: ';\n'
                },
                libs: {
                    src: libraries,
                    dest: '<%= buildLocation %>/js/libs.js'
                }
            },

            watch: {
                scripts: {
                    files: ['src/js/**/*.js', 'src/js/**/*.html', './environments.js'],
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
                }
            },

            sass: {
                options: {
                    sourceMap: false
                },
                dist: {
                    files: {
                        '<%= buildLocation %>/css/style.css': 'src/scss/style.scss'
                    }
                }
            },

            cssmin: {
                target: {
                    files: {
                        '<%= buildLocation %>/css/style.min.css': [
                            'node_modules/n3-charts/build/LineChart.css',
                            'node_modules/angular-dragula/dist/dragula.min.css',
                            'node_modules/angular-toastr/dist/angular-toastr.min.css',
                            '<%= buildLocation %>/css/style.css'
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
                    src: '<%= buildLocation %>/css/style.css'
                }
            },

            browserify: {
                dist: {
                    files: {
                        '<%= buildLocation %>/js/alex.js': ['src/js/index.js']
                    },
                    options: {
                        transform: [
                            ['babelify', {
                                sourceMap: false,
                                presets: ['es2015'],
                                compact: false
                            }],
                            ['browserify-ngannotate'],
                            ['html2js-browserify', {
                                minify: true
                            }]
                        ]
                    }
                }
            },

            karma: {
                unit: {
                    configFile: 'test/karma.conf.unit.js'
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
                    dest: '<%= buildLocation %>/fonts',
                    filter: 'isFile'
                },
                images: {
                    expand: true,
                    cwd: 'assets/images',
                    src: '*',
                    dest: '<%= buildLocation %>/images',
                    filter: 'isFile'
                },
                index: {
                    src: 'index.html',
                    dest: '<%= buildLocation %>/index.html'
                }
            }
        });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build-js', ['browserify', 'uglify:app']);
    grunt.registerTask('build-css', ['sass', 'postcss', 'cssmin']);
    grunt.registerTask('default', ['concat:libs', 'uglify:libs', 'build-js', 'copy:fonts', 'build-css', 'copy:images', 'copy:index']);
    grunt.registerTask('lint', 'jshint');
    grunt.registerTask('test', ['karma:unit']);
};
