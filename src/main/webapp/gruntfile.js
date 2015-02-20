module.exports = function(grunt) {

	grunt
		.initConfig({
			pkg : grunt.file.readJSON('bower.json'),
			uglify : {
				options : {
					banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				app : {
					files : {
						'./app/app.min.js' : [ './app/app.js' ]
					}
				}
			},
			concat : {
				options : {
					separator : ';'
				},
				app : {
					src : [ 'app/js/init.js', 'app/templates.js', 'app/js/routes.js', 'app/js/constants.js',
							'app/js/controller/**/*.js',
							'app/js/directives/*.js',
							'app/js/resources/*.js',
							'app/js/services/*.js', 'app/js/filters/*.js'],
					dest : './app/app.js'
				},
				libs : {
					src : [
							'bower_components/angular/angular.min.js',
							'bower_components/angular-ui-router/release/angular-ui-router.min.js',
							'bower_components/angular-animate/angular-animate.min.js',
							'bower_components/lodash/lodash.min.js',
							'bower_components/ng-sortable/dist/ng-sortable.min.js',
							'bower_components/angular-ui-ace/ui-ace.min.js',
							'bower_components/ace-builds/src-min/ace.js',
							'bower_components/ngtoast/dist/ngToast.min.js',
							'bower_components/angular-sanitize/angular-sanitize.min.js',
							'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
							'bower_components/d3/d3.min.js',
							'bower_components/graphlib/dist/graphlib.core.min.js',
							'bower_components/dagre/dist/dagre.core.min.js',
							'bower_components/dagre-d3/dist/dagre-d3.core.min.js',
							'bower_components/chartjs/Chart.min.js' ],
					dest : 'app/libs.js'
				}
			},
			
			html2js: {
				options: {
					useStrict: true,
					base: '../webapp'
				},
				all: {
					src: ['app/partials/**/*.html'],
					dest: 'app/templates.js'
				}
			},
			
			watch : {
				scripts : {
					files : [ 'app/js/**/*.js' ],
					tasks : [ 'build-js' ],
					options : {
						spawn : false
					}
				},
				sass : {
					files : [ 'app/styles/**/*.scss' ],
					tasks : [ 'build-css' ],
					options : {
						spawn : false
					}
				},
				html : {
					files: ['app/partials/**/*.html'],
					tasks: ['build-js'],
					options: {
						spawn : false
					}
				}
			},
			
			sass : {
                options : {
                    sourceMap: false,
                    outputStyle: 'compressed'
                },
				dist : {
					files : {
						'app/styles/style.css' : 'app/styles/style.scss'
					}
				}
			},
			
			jasmine : {
				
			}
		});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.registerTask('build-js', [ 'html2js', 'concat', 'uglify' ]);
	grunt.registerTask('build-css', [ 'sass' ]);
	grunt.registerTask('build-html', ['html2js']);
	grunt.registerTask('default', [ 'build-js' ]);

};
