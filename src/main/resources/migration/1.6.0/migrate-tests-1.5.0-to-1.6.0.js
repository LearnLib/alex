const utils = require('../migration-utils');

const config = utils.readInput();
config.data.tests.forEach(test => migrate(test));

function migrate(test) {
    if (test.type === 'case') {
        migrateTestCase(test);
    } else if (test.type === 'suite') {
        migrateTestSuite(test);
    }
}

function migrateTestSuite(testSuite) {
    testSuite.tests.forEach(test => migrate(test));
}

function migrateTestCase(testCase) {
    migrateSteps(testCase.preSteps);
    migrateSteps(testCase.steps);
    migrateSteps(testCase.postSteps);

    function migrateSteps(steps) {
        steps.forEach(step => {
            step.pSymbol = {
                symbolFromName: step.symbol,
                parameterValues: step.parameterValues
            };
            delete step.symbol;
            delete step.parameterValues;
        });
    }
}

utils.writeOutput(config, '1.6.0');
