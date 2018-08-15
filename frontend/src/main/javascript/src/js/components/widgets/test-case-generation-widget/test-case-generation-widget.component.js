import {events} from '../../../constants';
import {TestCaseStep} from '../../../entities/test-case-step';

export const testCaseGenerationWidgetComponent = {
    template: require('./test-case-generation-widget.component.html'),
    bindings: {
        onCancel: '&',
        onCreated: '&',
        result: '<',
    },
    controllerAs: 'vm',
    controller: class TestCaseGenerationWidgetComponent {

        /**
         * Constructor.
         *
         * @param $scope
         * @param {EventBus} EventBus
         * @param {ProjectService} ProjectService
         * @param {TestResource} TestResource
         * @param {ToastService} ToastService
         */
        // @ngInject
        constructor($scope, EventBus, ProjectService, TestResource, ToastService) {
            this.eventBus = EventBus;
            this.projectService = ProjectService;
            this.testResource = TestResource;
            this.toastService = ToastService;

            /**
             * Map computed name -> parameterized symbol.
             * @type {Object}
             */
            this.symbolMap = {};

            /**
             * The test case to create.
             * @type {Object}
             */
            this.testCase = {
                type: 'case',
                name: 'Test case',
                parent: null,
                steps: [],
            };

            this.eventBus.on(events.HYPOTHESIS_LABEL_SELECTED, (evt, data) => {
                const step = TestCaseStep.fromSymbol(this.symbolMap[data.input].symbol);
                step.shouldFail = !data.output.startsWith('Ok');
                step.pSymbol.parameterValues = this.symbolMap[data.input].parameterValues;
                this.testCase.steps.push(step);
            }, $scope);
        }

        $onInit() {
            this.result.symbols.forEach(s => this.symbolMap[s.getComputedName()] = s);
        }

        generateTestCase() {
            const test = JSON.parse(JSON.stringify(this.testCase));
            test.project = this.project.id;
            test.steps.forEach(step => {
                step.pSymbol.symbol = step.pSymbol.symbol.id;
                step.pSymbol.parameterValues.forEach(v => delete v.id);
            });

            this.testResource.create(test)
                .then(createdTestCase => {
                    this.toastService.success('The test has been generated.');
                    this.onCreated({testCase: createdTestCase});
                })
                .catch(err => this.toastService.danger(`The test could not be generated. ${err.data.message}`));
        }

        cancel() {
            this.testCase.steps = [];
        }

        get project() {
            return this.projectService.store.currentProject;
        }
    }
};
