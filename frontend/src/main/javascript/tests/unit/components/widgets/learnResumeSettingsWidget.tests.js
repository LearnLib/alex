describe('learnResumeSettingsWidget', () => {
    let $rootScope, $controller, $compile, EqOracleService;
    let controller, config, scope;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject(($injector) => {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $compile = $injector.get('$compile');
        EqOracleService = $injector.get('EqOracleService');
    }));

    function createComponent() {
        scope = $rootScope.$new();
        scope.config = ENTITIES.learnConfigurations[0];
        const element = angular.element('<learn-resume-settings-widget configuration="config"> </learn-resume-settings-widget>');
        $compile(element)(scope);
        controller = element.controller('learnResumeSettingsWidget');
        scope.$digest();
    }

    it('should initialize correctly', () => {
        createComponent();
    });

    it('should set the correct eq oracle', () => {
        createComponent();
    });
});