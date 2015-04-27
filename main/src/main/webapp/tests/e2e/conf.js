exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'project.e2e.js'
    ],
    capabilities: {
        'browserName' : 'firefox'
    }
};