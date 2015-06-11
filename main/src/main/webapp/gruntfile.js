module.exports = function (grunt) {

    var scripts = [
        'app/modules/init.js',

        // core module
        'app/modules/core/init.js',
        'app/modules/core/constants.js',
        'app/modules/core/routes.js',
        'app/modules/core/controllers/*.js',
        'app/modules/core/directives/*.js',
        'app/modules/core/filters/*.js',
        'app/modules/core/models/*.js',
        'app/modules/core/resources/*.js',
        'app/modules/core/services/*.js',

        // actions module
        'app/modules/actions/init.js',
        'app/modules/actions/constants.js',
        'app/modules/actions/directives/**/*.js',
        'app/modules/actions/services/**/*.js',

        // dashboard module
        'app/modules/dashboard/init.js',
        'app/modules/dashboard/directives/*.js',

        // modals module
        'app/modules/modals/init.js',
        'app/modules/modals/controllers/*.js',
        'app/modules/modals/directives/*.js',
        'app/modules/modals/services/*.js'
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
                        './app/app.min.js': ['./app/app.js']
                    }
                }
            },

            concat: {
                options: {
                    separator: ';'
                },
                app: {
                    src: ['app/templates.js', scripts],
                    dest: './app/app.js'
                },
                libs: {
                    src: [
                        'bower_components/angular/angular.min.js',
                        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                        'bower_components/angular-animate/angular-animate.min.js',
                        'bower_components/lodash/lodash.min.js',
                        'bower_components/angular-selection-model/dist/selection-model.min.js',
                        'bower_components/angular-ui-ace/ui-ace.min.js',
                        'bower_components/ace-builds/src-min/ace.js',
                        'bower_components/ace-builds/src-min/theme-eclipse.js',
                        'bower_components/ace-builds/src-min/mode-json.js',
                        'bower_components/ngtoast/dist/ngToast.min.js',
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
                        'bower_components/ng-file-upload/ng-file-upload.min.js'
                    ],
                    dest: 'app/libs.min.js'
                }
            },

            html2js: {
                options: {
                    useStrict: true,
                    base: '../webapp'
                },
                all: {
                    src: [
                        'app/modules/core/views/**/*.html',
                        'app/modules/actions/views/*.html',
                        'app/modules/dashboard/views/*.html',
                        'app/modules/modals/views/*.html'],
                    dest: 'app/templates.js'
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
                    files: ['app/modules/**/*.html'],
                    tasks: ['build-js'],
                    options: {
                        spawn: false
                    }
                }
            },

            sass: {
                options: {
                    sourceMap: false,
                    outputStyle: 'compressed'
                },
                dist: {
                    files: {
                        'app/stylesheets/style.css': 'app/stylesheets/style.scss'
                    }
                }
            },

            jasmine: {
                src: 'app/app.js',
                options: {
                    specs: [
                        'tests/unit/modules/core/controllers/**/*.js'
                    ],
                    vendor: ['app/libs.min.js', 'tests/unit/angular-mocks.js'],
                    display: 'full',
                    summary: true,
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'bin/coverage/coverage.json',
                        report: 'bin/coverage',
                        thresholds: {
                            lines: 0,
                            statements: 0,
                            branches: 0,
                            functions: 0
                        }
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
                            'bower_components/ngtoast/dist/ngToast.min.css',
                            'bower_components/ng-sortable/dist/ng-sortable.min.css',
                            'bower_components/codemirror/lib/codemirror.css',
                            'app/stylesheets/style.css'
                        ]
                    }
                }
            },

            protractor: {
                options: {
                    configFile: "tests/e2e/conf.js",
                    keepAlive: true,
                    noColor: false,
                    args: {}
                },
                all: {}
            },

            protractor_webdriver: {
                options: {
                    command: 'webdriver-manager start',
                    path: './node_modules/protractor/bin/'
                },
                all: {}
            },

            clean: {
                js: ["app/templates.js"]
            }
        });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-protractor-webdriver');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build-js', ['html2js', 'concat', 'uglify', 'clean']);
    grunt.registerTask('build-css', ['sass', 'cssmin']);
    grunt.registerTask('build-html', ['html2js']);
    grunt.registerTask('default', ['build-js']);
    grunt.registerTask('test-unit', ['karma']);
    grunt.registerTask('test-e2e', ['protractor']);
    grunt.registerTask('minify-css', ['cssmin']);

};
