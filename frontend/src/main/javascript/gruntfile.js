module.exports = function (grunt) {

    const libraries = [
        'node_modules/ace-builds/src/ace.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-ui-ace/src/ui-ace.js',
        'node_modules/n3-charts/build/LineChart.js'
    ];

    const browserifyOptionsDist = {
        files: {
            '<%= buildLocation %>/js/alex.bundle.js': ['src/js/index.ts']
        },
        options: {
            plugin: [
                ['tsify']
            ],
            transform: [
                ['babelify', {
                    sourceMap: false,
                    presets: ['es2015'],
                    compact: false
                }],
                ['stringify', { // load component templates
                    appliesTo: { includeExtensions: ['.html']}
                }],
                ['browserify-ngannotate'],
                ['html2js-browserify', {
                    minify: true
                }]
            ]
        }
    };

    const browserifyOptionsDev = JSON.parse(JSON.stringify(browserifyOptionsDist));
    browserifyOptionsDev.options = Object.assign({
        watch: true,
        keepAlive: true,
        watchifyOptions: {
            entries: ['src/js/index.ts'],
            ignoreWatch: ['**/node_modules/**'],
            cache: {},
            packageCache: {},
            poll: true,
            delay: 500
        },
    }, browserifyOptionsDev.options);

    grunt
        .initConfig({
            buildLocation: '../../../target/classes',

            pkg: grunt.file.readJSON('package.json'),

            uglify: {
                app: {
                    files: {
                        '<%= buildLocation %>/js/alex.bundle.js': ['<%= buildLocation %>/js/alex.bundle.js']
                    }
                },
                libs: {
                    files: {
                        '<%= buildLocation %>/js/libs.bundle.js': ['<%= buildLocation %>/js/libs.bundle.js']
                    }
                }
            },

            concat: {
                options: {
                    separator: ';\n'
                },
                libs: {
                    src: libraries,
                    dest: '<%= buildLocation %>/js/libs.bundle.js'
                }
            },

            watch: {
                sass: {
                    files: ['src/scss/**/*.scss'],
                    tasks: ['bundle-css'],
                    options: {
                        spawn: false
                    }
                }
            },

            cssmin: {
                target: {
                    files: {
                        '<%= buildLocation %>/css/style.css': [
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
                dev: browserifyOptionsDev,
                dist: browserifyOptionsDist
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

            exec: {
                'build_css': 'node-sass src/scss/style.scss -o <%= buildLocation %>/css'
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
            },

            concurrent: {
                dev: {
                    tasks: ['build:dev', 'watch:sass'],
                    options: {
                        logConcurrentOutput: true
                    }
                }
            }
        });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-concurrent');

    const build = ['concat:libs', 'uglify:libs', 'copy:fonts', 'bundle-css', 'copy:images', 'copy:index'];

    grunt.registerTask('bundle-js:dist', ['browserify:dist', 'uglify:app']);
    grunt.registerTask('bundle-js:dev', ['browserify:dev']);
    grunt.registerTask('bundle-css', ['exec:build_css', 'postcss', 'cssmin']);
    grunt.registerTask('build:dev', build.concat(['bundle-js:dev']));
    grunt.registerTask('build:dist', build.concat(['bundle-js:dist']));
    grunt.registerTask('dev', 'concurrent:dev');
    grunt.registerTask('build', 'build:dist');
    grunt.registerTask('lint', 'jshint');
    grunt.registerTask('test', ['karma:unit']);
};
