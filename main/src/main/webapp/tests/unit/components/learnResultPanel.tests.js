import {LearnResult} from '../../../app/modules/entities/LearnResult';
import {events} from '../../../app/modules/constants';

SVGElement.prototype.getTransformToElement =
    SVGElement.prototype.getTransformToElement || function (toElement) {
        return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
    };

describe('learnResultPanel', () => {
    let $rootScope, $q, $compile, EventBus, PromptService, DownloadService;
    let controller;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');
        $compile = $injector.get('$compile');
        EventBus = $injector.get('EventBus');
        PromptService = $injector.get('PromptService');
        DownloadService = $injector.get('DownloadService');

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
    });

    it('should download a hypothesis as json', () => {
        const d1 = $q.defer();
        spyOn(PromptService, 'prompt').and.returnValue(d1.promise);
        d1.resolve('filename');
        spyOn(DownloadService, 'downloadObject').and.returnValue(null);

        const hypothesis = controller.result.steps[controller.pointer].hypothesis;
        controller.exportHypothesisAsJson();
        $rootScope.$digest();

        expect(PromptService.prompt).toHaveBeenCalled();
        expect(DownloadService.downloadObject).toHaveBeenCalledWith(hypothesis, 'filename');
    });

    it('should set the mode to hypothesis', () => {
        controller.showHypothesis();
        expect(controller.mode).toEqual(controller.modes.HYPOTHESIS);
    });

    it('should download the hypothesis as svg', () => {
        const d1 = $q.defer();
        spyOn(PromptService, 'prompt').and.returnValue(d1.promise);
        d1.resolve('filename');
        spyOn(DownloadService, 'downloadSvg').and.returnValue(null);

        controller.downloadSvg('#hypothesis');
        $rootScope.$digest();

        expect(PromptService.prompt).toHaveBeenCalled();
        expect(DownloadService.downloadSvg).toHaveBeenCalledWith('#hypothesis', true, 'filename')
    });

    it('should download the observation table as csv', () => {
        const d1 = $q.defer();
        spyOn(PromptService, 'prompt').and.returnValue(d1.promise);
        d1.resolve('filename');
        spyOn(DownloadService, 'downloadTable').and.returnValue(null);

        controller.downloadObservationTable('#table');
        $rootScope.$digest();

        expect(PromptService.prompt).toHaveBeenCalled();
        expect(DownloadService.downloadTable).toHaveBeenCalledWith('#table', 'filename')
    });
});