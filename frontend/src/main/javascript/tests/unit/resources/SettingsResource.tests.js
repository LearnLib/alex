describe('SettingsResource', () => {
    let $http;
    let $httpBackend;
    let SettingsResource;

    let settings;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject($injector => {
        $http = $injector.get('$http');
        $httpBackend = $injector.get('$httpBackend');
        SettingsResource = $injector.get('SettingsResource');

        settings = ENTITIES.settings;
    }));

    it('should get the settings', () => {
        spyOn(SettingsResource.$http, 'get').and.callThrough();

        $httpBackend.whenGET(`rest/settings`).respond(200, settings);
        const promise = SettingsResource.get();
        $httpBackend.flush();

        expect(SettingsResource.$http.get).toHaveBeenCalledWith(`rest/settings`);
        promise.then(s => expect(s === settings));
    });

    it('should update the settings', () => {
        spyOn(SettingsResource.$http, 'put').and.callThrough();

        $httpBackend.whenPUT(`rest/settings`).respond(200, settings);
        const promise = SettingsResource.update(settings);
        $httpBackend.flush();

        expect(SettingsResource.$http.put).toHaveBeenCalledWith(`rest/settings`, settings);
        promise.then(s => expect(s === settings));
    })
});