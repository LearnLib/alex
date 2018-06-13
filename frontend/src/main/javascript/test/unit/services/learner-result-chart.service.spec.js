import {LearnResult} from '../../../src/js/entities/learner-result';

describe('LearnerResultChartService', () => {
    let service, results;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        service = $injector.get('LearnerResultChartService');
        results = ENTITIES.learnResults.map(r => new LearnResult(r));
    }));

    it('should create the right dataset for a single final result', () => {

    });

    it('should create the right dataset for a single complete result', () => {

    });

    it('should create the right dataset for multiple final results', () => {

    });

    it('should create the right dataset for a multiple complete results', () => {

    });
});
