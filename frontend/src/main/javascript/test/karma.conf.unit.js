// Karma configuration
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            './resources/**/*.js',
            '../../../../target/classes/js/libs.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            '../src/js/**/*.js',
            './unit/**/*.js'
        ],

        // list of files to exclude
        exclude: [],

        // pre-process matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './unit/**/*.js': ['browserify'],
            '../src/js/**/*.js': ['browserify']
        },

        // es6 module bundler and es6 to es5 preprocessor
        browserify: {
            debug: true,
            transform: [
                ['babelify', {
                    sourceMap: false,
                    presets: ['es2015'],
                    compact: false
                }],
                ['browserify-ngannotate'],
                ['html2js-browserify', {
                    minify: false
                }],
                ['browserify-istanbul', {
                    instrumenterConfig: { embedSource: true }
                }],
            ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // create coverage for tested files
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
};
