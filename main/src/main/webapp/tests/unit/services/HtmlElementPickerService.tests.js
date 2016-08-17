import {HtmlElementPickerService} from '../../../src/js/services/HtmlElementPickerService';

describe('HtmlElementPickerService', () => {
    let $q;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject($injector => {
        $q = $injector.get('$q');
    }));

    it('should act like a singleton', () => {
        const service = new HtmlElementPickerService();
        service.deferred = $q.defer();
        service.lastUrl = "http://localhost";

        const service2 = new HtmlElementPickerService();
        expect(service2.deferred).toEqual(service.deferred);
        expect(service2.lastUrl).toEqual(service.lastUrl);
    });
});