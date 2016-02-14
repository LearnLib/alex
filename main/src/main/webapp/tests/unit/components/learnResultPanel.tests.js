import LearnResult from '../../../app/modules/entities/LearnResult';
import {events} from '../../../app/modules/constants';

SVGElement.prototype.getTransformToElement =
    SVGElement.prototype.getTransformToElement || function (toElement) {
        return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
    };

describe('learnResultPanel', () => {
    let $rootScope, $compile, EventBus;
    let controller;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        EventBus = $injector.get('EventBus');

        const scope = $rootScope.$new();
        scope.result = new LearnResult(ENTITIES.learnResults[0]);

        const element = angular.element(`
            <learn-result-panel result="result"
                                index="0">
            </learn-result-panel>
        `);
        $compile(element)(scope);
        $rootScope.$digest();

        controller = element.controller('learnResultPanel');
    }));

    it('should go to the next step', () => {
        controller.pointer = 0;

        controller.nextStep();
        expect(controller.pointer).toBe(1);

        controller.pointer = controller.result.steps.length - 1;
        controller.nextStep();
        expect(controller.pointer).toBe(0);
    });

    it('should go to the previous step', () => {
        const stepLength = controller.result.steps.length;
        controller.pointer = stepLength - 1;

        controller.previousStep();
        expect(controller.pointer).toBe(stepLength - 2);

        controller.pointer = 0;
        controller.previousStep();
        expect(controller.pointer).toBe(stepLength - 1);
    });

    it('should go to the first step', () => {
        const stepLength = controller.result.steps.length;
        controller.pointer = stepLength - 1;

        controller.firstStep();
        expect(controller.pointer).toBe(0);
    });

    it('should go the the last step', () => {
        const stepLength = controller.result.steps.length;
        controller.pointer = 0;

        controller.lastStep();
        expect(controller.pointer).toBe(stepLength - 1);
    });

    it('should update layout options of the hypothesis on event', () => {
        const options = {
            edgeSep: 50
        };
        EventBus.emit(events.HYPOTHESIS_LAYOUT_UPDATED, {settings: options});
        expect(controller.layoutSettings).toEqual(options);
    })
});