module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			app: {
				files : {
					'./app/app.min.js': ['./app/app.js']
				}
			}
		},
		concat : {
			options: {
				separator: ';'
			},
			app: {
				src: [
					'app/js/init.js', 'app/js/routes.js', 'app/js/constants.js', 'app/js/enums.js',
					'app/js/controller/**/*.js',
					'app/js/directives/*.js',
					'app/js/resources/*.js',
					'app/js/services/*.js',
					'app/js/filters/*.js'
				],
				dest: './app/app.js'
			},
			libs : {
				src: [
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
					'bower_components/chartjs/Chart.min.js'
				],
				dest: 'app/libs.js'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['concat', 'uglify']);
}

