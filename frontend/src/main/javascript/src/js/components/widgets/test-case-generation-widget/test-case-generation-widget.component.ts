import { events } from '../../../constants';
import { TestCaseStep } from '../../../entities/test-case-step';
import { LearnResult } from '../../../entities/learner-result';
import { IScope } from 'angular';
import { EventBus } from '../../../services/eventbus.service';
import { ProjectService } from '../../../services/project.service';
import { TestResource } from '../../../services/resources/test-resource.service';
import { ToastService } from '../../../services/toast.service';
import { Project } from '../../../entities/project';
import { TestCase } from '../../../entities/test-case';

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
    public testCase: TestCase;


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
      this.testCase = new TestCase();
      this.testCase.name = 'Test Case';

      this.eventBus.on(events.HYPOTHESIS_LABEL_SELECTED, (evt, data) => {
        const step = TestCaseStep.fromSymbol(this.symbolMap[data.input].symbol);
        step.expectedOutputSuccess = data.output.startsWith('Ok');
        step.setExpectedOutputMessageFromOutput(data.output);
        step.pSymbol.parameterValues = this.symbolMap[data.input].parameterValues;
        this.testCase.steps.push(step);
      }, $scope);
    }

    $onInit(): void {
      this.result.symbols.forEach(s => this.symbolMap[s.getComputedName()] = s);

      const preStep = TestCaseStep.fromSymbol(this.result.resetSymbol.symbol);
      preStep.pSymbol.parameterValues = this.result.resetSymbol.parameterValues;
      this.testCase.preSteps = [preStep];

      const postStep = this.result.postSymbol == null ? null : TestCaseStep.fromSymbol(this.result.postSymbol.symbol);
      if (postStep != null) {
        postStep.pSymbol.parameterValues = this.result.postSymbol.parameterValues;
        this.testCase.postSteps = [postStep];
      }
    }

    generateTestCase(): void {
      const test = JSON.parse(JSON.stringify(this.testCase));
      test.project = this.project.id;

      test.steps.forEach(step => {
        step.pSymbol.symbol = {id: step.pSymbol.symbol.id};
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
