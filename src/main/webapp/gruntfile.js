module.exports = function (grunt) {

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
                    src: ['app/scripts/init.js', 'app/templates.js', 'app/scripts/routes.js', 'app/scripts/constants.js',
                        'app/scripts/controllers/**/*.js',
                        'app/scripts/directives/*.js',
                        'app/scripts/models/*.js',
                        'app/scripts/resources/*.js',
                        'app/scripts/services/*.js', 'app/scripts/filters/*.js'],
                    dest: './app/app.js'
                },
                libs: {
                    src: [
                        'bower_components/angular/angular.min.js',
                        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                        'bower_components/angular-animate/angular-animate.min.js',
                        'bower_components/lodash/lodash.min.js',
                        'bower_components/ng-sortable/dist/ng-sortable.min.js',
                        'bower_components/angular-selection-model/dist/selection-model.min.js',
                        //'bower_components/ace-builds/src-min/theme-eclipse.js',
                        //'bower_components/ace-builds/src-min/mode-json.js',
                        'bower_components/angular-ui-ace/ui-ace.min.js',
                        'bower_components/ace-builds/src-min/ace.js',
                        'bower_components/ngtoast/dist/ngToast.min.js',
                        'bower_components/angular-sanitize/angular-sanitize.min.js',
                        'bower_components/angular-bootstrap/ui-bootstrap.min.js',
                        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                        'bower_components/d3/d3.min.js',
                        'bower_components/graphlib/dist/graphlib.core.min.js',
                        'bower_components/dagre/dist/dagre.core.min.js',
                        'bower_components/dagre-d3/dist/dagre-d3.core.min.js',
                        'bower_components/n3-line-chart/build/line-chart.min.js'],
                    dest: 'app/libs.min.js'
                }
            },

            html2js: {
                options: {
                    useStrict: true,
                    base: '../webapp'
                },
                all: {
                    src: ['app/views/**/*.html'],
                    dest: 'app/templates.js'
                }
            },

            watch: {
                scripts: {
                    files: ['app/scripts/**/*.js'],
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

            jasmine: {}
        });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('build-js', ['html2js', 'concat', 'uglify']);
    grunt.registerTask('build-css', ['sass']);
    grunt.registerTask('build-html', ['html2js']);
    grunt.registerTask('default', ['build-js']);

};
