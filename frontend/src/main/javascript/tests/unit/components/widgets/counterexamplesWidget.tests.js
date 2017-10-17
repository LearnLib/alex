import {events} from '../../../../src/js/constants';

describe('counterexamplesWidget', () => {
    let $rootScope, $controller, $q, $compile, LearnerResource, SymbolResource, EventBus;
    let controller, scope;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $q = $injector.get('$q');
        $compile = $injector.get('$compile');
        LearnerResource = $injector.get('LearnerResource');
        SymbolResource = $injector.get('SymbolResource');
        EventBus = $injector.get('EventBus');
    }));

    function createComponent() {
        scope = $rootScope.$new();
        scope.result = ENTITIES.learnResults[0];
        scope.counterexamples = [];
        const element = angular.element(`
            <counterexamples-widget counterexamples="" result=""></counterexamples-widget>
        `);
        $compile(element)(scope);
        controller = element.controller('counterexamplesWidget');
        scope.$digest();
    }

    it('should add a input output pair on event', () => {
        createComponent();

        expect(controller.counterExample).toEqual([]);
        const io = {
            input: 'in',
            output: 'out'
        };
        EventBus.emit(events.HYPOTHESIS_LABEL_SELECTED, io);
        expect(controller.counterExample).toEqual([io]);
    });

    it('should remove a io pair from the counterexample', () => {
        createComponent();
        controller.counterExample = [
            {input: 'in1', output: 'out1'},
            {input: 'in2', output: 'out2'},
            {input: 'in3', output: 'out3'}
        ];
        controller.removeInputOutputAt(1);
        expect(controller.counterExample.findIndex(io => io.input === 'in2')).toBe(-1);
    });

    it('should renew the counterexample', () => {
        createComponent();
        controller.counterexamples = [
            {input: 'in1', output: 'out1'},
            {input: 'in2', output: 'out2'},
            {input: 'in3', output: 'out3'}
        ];
        controller.renewCounterexamples();
        expect(controller.counterexamples).toEqual(controller.tmpCounterExamples);
    });
});