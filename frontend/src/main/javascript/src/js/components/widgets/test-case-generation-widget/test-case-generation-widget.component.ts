import {events} from '../../../constants';
import {TestCaseStep} from '../../../entities/test-case-step';
import {LearnResult} from '../../../entities/learner-result';
import {IScope} from 'angular';
import {EventBus} from '../../../services/eventbus.service';
import {ProjectService} from '../../../services/project.service';
import {TestResource} from '../../../services/resources/test-resource.service';
import {ToastService} from '../../../services/toast.service';
import {Project} from '../../../entities/project';

export const testCaseGenerationWidgetComponent = {
  template: require('./test-case-generation-widget.component.html'),
  bindings: {
    onCancel: '&',
    onCreated: '&',
    result: '<',
  },
  controllerAs: 'vm',
  controller: class TestCaseGenerationWidgetComponent {

    public onCancel: (any?) => void;

    public onCreated: (any) => void;

    public result: LearnResult;

    /** Map computed name -> parameterized symbol. */
    public symbolMap: any;

    /** The test case to create. */
    public testCase: any;


    /**
     * Constructor.
     *
     * @param $scope
     * @param eventBus
     * @param projectService
     * @param testResource
     * @param toastService
     */
    /* @ngInject */
    constructor(private $scope: IScope,
                private eventBus: EventBus,
                private projectService: ProjectService,
                private testResource: TestResource,
                private toastService: ToastService) {

      this.symbolMap = {};
      this.testCase = {
        type: 'case',
        name: 'Test case',
        parent: null,
        steps: [],
      };

      this.eventBus.on(events.HYPOTHESIS_LABEL_SELECTED, (evt, data) => {
        const step: any = TestCaseStep.fromSymbol(this.symbolMap[data.input].symbol);
        step.shouldFail = !data.output.startsWith('Ok');
        step.pSymbol.parameterValues = this.symbolMap[data.input].parameterValues;
        this.testCase.steps.push(step);
      }, $scope);
    }

    $onInit(): void {
      this.result.symbols.forEach(s => this.symbolMap[s.getComputedName()] = s);
    }

    generateTestCase(): void {
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

    cancel(): void {
      this.testCase.steps = [];
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
