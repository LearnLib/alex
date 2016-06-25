describe('CountersController', () => {
    let $controller, $q, $rootScope, SettingsResource, ToastService, $compile;
    let controller;

    beforeEach(angular.mock.module('ALEX'));

    beforeEach(angular.mock.inject(($injector) => {
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        $compile = $injector.get('$compile');
        $q = $injector.get('$q');

        SettingsResource = $injector.get('SettingsResource');
        ToastService = $injector.get('ToastService');
    }));

    function createController() {
        const element = angular.element("<settings-view></settings-view>");
        const renderedElement = $compile(element)($rootScope);
        $rootScope.$digest();
        controller = element.controller('settingsView');
    }

    function init() {
        const deferred = $q.defer();
        spyOn(SettingsResource, 'get').and.returnValue(deferred.promise);
        createController();
        deferred.resolve(ENTITIES.settings);
        $rootScope.$digest();
    }

    it('should initialize the controller correctly and load the settings', () => {
        const deferred = $q.defer();
        spyOn(SettingsResource, 'get').and.returnValue(deferred.promise);
        createController();

        expect(controller.settings).toBeNull();

        deferred.resolve(ENTITIES.settings);
        $rootScope.$digest();

        expect(controller.settings).toEqual(ENTITIES.settings);
    });

    it('should update the settings', () => {
        const deferred = $q.defer();
        spyOn(SettingsResource, 'update').and.returnValue(deferred.promise);
        init();

        const settings = ENTITIES.settings;
        settings.driver.firefox = "/updated/path";
        settings.driver.chrome = "7updated/path";
        controller.settings = settings;

        controller.updateSettings();
        deferred.resolve(settings);
        $rootScope.$digest();

        expect(SettingsResource.update).toHaveBeenCalledWith(settings);
        expect(controller.settings).toEqual(settings);
    });

    it('should fail to update the settings', () => {
        const deferred = $q.defer();
        spyOn(SettingsResource, 'update').and.returnValue(deferred.promise);
        init();

        const settings = ENTITIES.settings;
        settings.driver.firefox = "/updated/path";
        settings.driver.chrome = "7updated/path";
        controller.settings = settings;

        controller.updateSettings();
        deferred.reject({data: {message: null}});
        $rootScope.$digest();

        expect(SettingsResource.update).toHaveBeenCalledWith(settings);
        expect(controller.settings).toEqual(settings);
    });
});