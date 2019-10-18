/*
 * Copyright 2015 - 2019 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import uiRouter from '@uirouter/angularjs';
import * as angular from 'angular';
import * as ngAnimate from 'angular-animate';
import * as ngMessages from 'angular-messages';
import * as angularDragula from 'angular-dragula';
import * as uiBootstrap from 'angular-ui-bootstrap';
import * as ngFileUpload from 'ng-file-upload';
import { alexComponent } from './components/alex/alex.component';
import { actionFormComponent } from './components/forms/actions/action-form/action-form.component';
import { assertCounterActionFormComponent } from './components/forms/actions/misc/assert-counter-action-form/assert-counter-action-form.component';
import { assertVariableActionFormComponent } from './components/forms/actions/misc/assert-variable-action-form/assert-variable-action-form.component';
import { incrementCounterActionFormComponent } from './components/forms/actions/misc/increment-counter-action-form/increment-counter-action-form.component';
import { setCounterActionFormComponent } from './components/forms/actions/misc/set-counter-action-form/set-counter-action-form.component';
import { setVariableActionFormComponent } from './components/forms/actions/misc/set-variable-action-form/set-variable-action-form.component';
import { setVariableByCookieActionFormComponent } from './components/forms/actions/misc/set-variable-by-cookie-action-form/set-variable-by-cookie-action-form.component';
import { setVariableByHtmlActionFormComponent } from './components/forms/actions/misc/set-variable-by-html-action-form/set-variable-by-html-action-form.component';
import { setVariableByHttpResponseActionFormComponent } from './components/forms/actions/misc/set-variable-by-http-response-action-form/set-variable-by-http-response-action-form.component';
import { setVariableByJsonActionFormComponent } from './components/forms/actions/misc/set-variable-by-json-action-form/set-variable-by-json-action-form.component';
import { setVariableByNodeAttributeActionFormComponent } from './components/forms/actions/misc/set-variable-by-node-attribute-action-form/set-variable-by-node-attribute-action-form.component';
import { setVariableByNodeCountActionFormComponent } from './components/forms/actions/misc/set-variable-by-node-count-action-form/set-variable-by-node-count-action-form.component';
import { setVariableByRegexGroupActionFormComponent } from './components/forms/actions/misc/set-variable-by-regex-group-action-form/set-variable-by-regex-group-action-form.component';
import { waitActionFormComponent } from './components/forms/actions/misc/wait-action-form/wait-action-form.component';
import { checkAttributeExistsActionFormComponent } from './components/forms/actions/rest/check-attribute-exists-action-form/check-attribute-exists-action-form.component';
import { checkAttributeTypeActionFormComponent } from './components/forms/actions/rest/check-attribute-type-action-form/check-attribute-type-action-form.component';
import { checkAttributeValueActionFormComponent } from './components/forms/actions/rest/check-attribute-value-action-form/check-attribute-value-action-form.component';
import { checkHeaderFieldActionFormComponent } from './components/forms/actions/rest/check-header-field-action-form/check-header-field-action-form.component';
import { checkHttpBodyActionFormComponent } from './components/forms/actions/rest/check-http-body-action-form/check-http-body-action-form.component';
import { checkStatusActionFormComponent } from './components/forms/actions/rest/check-status-action-form/check-status-action-form.component';
import { requestActionFormComponent } from './components/forms/actions/rest/request-action-form/request-action-form.component';
import { validateJsonActionFormComponent } from './components/forms/actions/rest/validate-json-action-form/validate-json-action-form.component';
import { alertAcceptDismissActionFormComponent } from './components/forms/actions/web/alert-accept-dismiss-action-form/alert-accept-dismiss-action-form.component';
import { alertGetTextActionFormComponent } from './components/forms/actions/web/alert-get-text-action-form/alert-get-text-action-form.component';
import { alertSendKeysActionFormComponent } from './components/forms/actions/web/alert-send-keys-action-form/alert-send-keys-action-form.component';
import { browserActionFormComponent } from './components/forms/actions/web/browser-action-form/browser-action-form.component';
import { checkForNodeActionFormComponent } from './components/forms/actions/web/check-for-node-action-form/check-for-node-action-form.component';
import { checkForTextActionFormComponent } from './components/forms/actions/web/check-for-text-action-form/check-for-text-action-form.component';
import { checkNodeAttributeValueActionFormComponent } from './components/forms/actions/web/check-node-attribute-value-action-form/check-node-attribute-value-action-form.component';
import { checkNodeSelectedActionFormComponent } from './components/forms/actions/web/check-node-selected-action-form/check-node-selected-action-form.component';
import { checkPageTitleActionFormComponent } from './components/forms/actions/web/check-page-title-action-form/check-page-title-action-form.component';
import { clearInputActionFormComponent } from './components/forms/actions/web/clear-action-form/clear-action-form.component';
import { clickActionFormComponent } from './components/forms/actions/web/click-action-form/click-action-form.component';
import { clickElementByTextActionFormComponent } from './components/forms/actions/web/click-element-by-text-action-form/click-element-by-text-action-form.component';
import { clickLinkByTextActionFormComponent } from './components/forms/actions/web/click-link-by-text-action-form/click-link-by-text-action-form.component';
import { executeScriptActionFormComponent } from './components/forms/actions/web/execute-script-action-form/execute-script-action-form.component';
import { moveMouseActionFormComponent } from './components/forms/actions/web/move-mouse-action-form/move-mouse-action-form.component';
import { openActionFormComponent } from './components/forms/actions/web/open-url-action-form/open-url-action-form.component';
import { pressKeyActionFormComponent } from './components/forms/actions/web/press-key-action-form/press-key-action-form.component';
import { selectActionFormComponent } from './components/forms/actions/web/select-action-form/select-action-form.component';
import { sendKeysActionFormComponent } from './components/forms/actions/web/send-keys-action-form/send-keys-action-form.component';
import { submitActionFormComponent } from './components/forms/actions/web/submit-action-form/submit-action-form.component';
import { switchToFrameActionFormComponent } from './components/forms/actions/web/switch-to-frame/switch-to-frame-action-form.component';
import { switchToActionFormComponent } from './components/forms/actions/web/switch-to/switch-to-action-form.component';
import { uploadFileActionFormComponent } from './components/forms/actions/web/upload-file-action-form/upload-file-action-form.component';
import { waitForNodeActionFormComponent } from './components/forms/actions/web/wait-for-node-action-form/wait-for-node-action-form.component';
import { waitForNodeAttributeActionFormComponent } from './components/forms/actions/web/wait-for-node-attribute-action-form/wait-for-node-attribute-action-form.component';
import { waitForScriptActionFormComponent } from './components/forms/actions/web/wait-for-script-action-form/wait-for-script-action-form.component';
import { waitForTextActionFormComponent } from './components/forms/actions/web/wait-for-text-action-form/wait-for-text-action-form.component';
import { waitForTitleActionFormComponent } from './components/forms/actions/web/wait-for-title-action-form/wait-for-title-action-form.component';
import { completeEqOracleFormComponent } from './components/forms/eq-oracles/complete-eq-oracle-form/complete-eq-oracle-form.component';
import { eqOracleFormComponent } from './components/forms/eq-oracles/eq-oracle-form.component';
import { hypothesisEqOracleFormComponent } from './components/forms/eq-oracles/hypothesis-eq-oracle-form/hypothesis-eq-oracle-form.component';
import { randomEqOracleFormComponent } from './components/forms/eq-oracles/random-eq-oracle-form/random-eq-oracle-form.component';
import { testSuiteEqOracleFormComponent } from './components/forms/eq-oracles/test-suite-eq-oracle-form/test-suite-eq-oracle-form.component';
import { wMethodEqOracleFormComponent } from './components/forms/eq-oracles/w-method-eq-oracle-form/w-method-eq-oracle-form.component';
import { wpMethodEqOracleFormComponent } from './components/forms/eq-oracles/wp-method-eq-oracle-form/wp-method-eq-oracle-form.component';
import { nodeFormGroupComponent } from './components/forms/node-form-group/node-form-group.component';
import { userLoginFormComponent } from './components/forms/user-login-form/user-login-form.component';
import { learnerResultPanelCheckingViewComponent } from './components/learner-result-panel/learner-result-panel-checking-view/learner-result-panel-checking-view.component';
import { learnerResultPanelDefaultViewComponent } from './components/learner-result-panel/learner-result-panel-default-view/learner-result-panel-default-view.component';
import { learnerResultPanelTestingViewComponent } from './components/learner-result-panel/learner-result-panel-testing-view/learner-result-panel-testing-view.component';
import { testCaseGenerationWidgetComponent } from './components/widgets/test-case-generation-widget/test-case-generation-widget.component';
import { testSuiteGenerationWidgetComponent } from './components/widgets/test-suite-generation-widget/test-suite-generation-widget.component';
import { learnerResultPanelComponent } from './components/learner-result-panel/learner-result-panel.component';
import { actionCreateModalComponent } from './components/modals/action-create-modal/action-create-modal.component';
import { actionSearchFormComponent } from './components/modals/action-create-modal/action-search-form/action-search-form.component';
import { actionEditModalComponent } from './components/modals/action-edit-modal/action-edit-modal.component';
import { SearchFormComponent } from './common/search-form/search-form.component';
import { sidebarComponent } from './components/sidebar/sidebar.component';
import {
  SimpleSymbolGroupTreeItemComponent,
} from './common/simple-symbol-group-tree/simple-symbol-group-tree-item/simple-symbol-group-tree-item.component';
import {
  SimpleSymbolGroupTreeComponent,
} from './common/simple-symbol-group-tree/simple-symbol-group-tree.component';
import { resultsCompareViewComponent } from './components/views/learner-results-compare-view/learner-results-compare-view.component';
import { learnerSetupViewComponent } from './components/views/learner-setup-view/learner-setup-view.component';
import { learnerViewComponent } from './components/views/learner-view/learner-view.component';
import { redirectViewComponent } from './components/views/redirect-view/redirect-view.component';
import { rootViewComponent } from './components/views/root-view/root-view.component';
import { statisticsCompareViewComponent } from './components/views/statistics-compare-view/statistics-compare-view.component';
import { symbolViewComponent } from './components/views/symbol-view/symbol-view.component';
import { SymbolsViewComponent } from './views/symbols-view/symbols-view.component';
import { TestCaseResultsViewComponent, } from './views/test-case-results-view/test-case-results-view.component';
import { counterexamplesWidgetComponent } from './components/widgets/counterexamples-widget/counterexamples-widget.component';
import { learnerResumeSettingsWidgetComponent } from './components/widgets/learner-resume-widget/learner-resume-settings-widget.component';
import * as config from './config';
import {
  formatAlgorithm,
  formatEqOracle,
  formatMilliseconds,
  formatWebBrowser,
  normalizeUpperCase,
  sortTests
} from './filters';
import * as routes from './routes';
import { ActionService } from './services/action.service';
import { ClipboardService } from './services/clipboard.service';
import { DownloadService } from './services/download.service';
import { EqOracleService } from './services/eq-oracle.service';
import { EventBus } from './services/eventbus.service';
import { LearnerResultChartService } from './services/learner-result-chart.service';
import { LearnerResultDownloadService } from './services/learner-result-download.service';
import { LearningAlgorithmService } from './services/learning-algorithm.service';
import { NotificationService } from './services/notification.service';
import { PromptService } from './services/prompt.service';
import { CounterApiService } from './services/resources/counter-api.service';
import { FileApiService } from './services/resources/file-api.service';
import { LearnerApiService } from './services/resources/learner-api.service';
import { LearnerResultApiService } from './services/resources/learner-result-api.service';
import { ProjectApiService } from './services/resources/project-api.service';
import { SettingsApiService } from './services/resources/settings-api.service';
import { SymbolGroupApiService } from './services/resources/symbol-group-api.service';
import { SymbolParameterApiService } from './services/resources/symbol-parameter-api.service';
import { SymbolApiService } from './services/resources/symbol-api.service';
import { TestConfigApiService } from './services/resources/test-config-api.service';
import { TestReportApiService } from './services/resources/test-report-api.service';
import { TestApiService } from './services/resources/test-api.service';
import { UserApiService } from './services/resources/user-api.service';
import { WebhookApiService } from './services/resources/webhook-api.service';
import { TestReportService } from './services/test-report.service';
import { ToastService } from './services/toast.service';
import { setVariableByHttpStatusActionFormComponent } from './components/forms/actions/misc/set-variable-by-http-status-action-form/set-variable-by-http-status-action-form.component';
import { LtsFormulaApiService } from './services/resources/lts-formula-api.service';
import { unauthorizedHttpInterceptor } from './utils/unauthorized-http-interceptor';
import { dragAndDropActionFormComponent } from './components/forms/actions/web/drag-and-drop-action-form/drag-and-drop-action-form.component';
import { dragAndDropByActionFormComponent } from './components/forms/actions/web/drag-and-drop-by-action-form/drag-and-drop-by-action-form.component';
import { ProjectEnvironmentApiService } from './services/resources/project-environment-api.service';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { ViewHeaderComponent } from './common/view-header/view-header.component';
import { ActionBarComponent } from './common/action-bar/action-bar.component';
import { SelectableCheckboxComponent } from './common/selectable-checkbox/selectable-checkbox.component';
import { SelectableCheckboxMultipleComponent } from './common/selectable-checkbox-multiple/selectable-checkbox-multiple.component';
import { AboutViewComponent } from './views/about-view/about-view.component';
import { AppStoreService } from './services/app-store.service';
import { TestCaseTableComponent } from './views/test-case-view/test-case-table/test-case-table.component';
import { SymbolParametersComponent } from './common/symbol-parameters/symbol-parameters.component';
import { OutputErrorTraceComponent } from './common/output-error-trace/output-error-trace.component';
import { CountersViewComponent } from './views/counters-view/counters-view.component';
import { LtsFormulasViewComponent } from './views/lts-formulas-view/lts-formulas-view.component';
import { WebhooksViewComponent } from './views/webhooks-view/webhooks-view.component';
import { SymbolParametersPanelComponent } from './views/symbol-view/symbol-parameters-panel/symbol-parameters-panel.component';
import { TestConfigListComponent } from './views/test-suite-view/test-config-list/test-config-list.component';
import { ProjectViewComponent } from './views/project-view/project-view.component';
import { ProjectsViewComponent } from './views/projects-view/projects-view.component';
import { FileDropzoneComponent } from './common/file-dropzone/file-dropzone.component';
import { LogoutViewComponent } from './views/logout-view/logout-view.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { FilesViewComponent } from './views/files-view/files-view.component';
import { ProjectEnvironmentsViewComponent } from './views/project-environments-view/project-environments-view.component';
import { ObservationTableComponent } from './common/observation-table/observation-table.component';
import { DiscriminationTreeComponent } from './common/discrimination-tree/discrimination-tree.component';
import { HypothesisComponent } from './common/hypothesis/hypothesis.component';
import { TestResultReportComponent } from './views/test-suite-view/test-result-report/test-result-report.component';
import { AdminUsersViewComponent } from './views/admin-users-view/admin-users-view.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { TestTreeComponent } from './views/test-suite-view/test-tree/test-tree.component';
import { AdminSettingsViewComponent } from './views/admin-settings-view/admin-settings-view.component';
import { ErrorViewComponent } from './views/error-view/error-view.component';
import { ErrorViewStoreService } from './views/error-view/error-view-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SymbolsArchiveViewComponent } from './views/symbols-archive-view/symbols-archive-view.component';
import { SymbolSearchFormComponent } from './common/search-form/symbol-search-form/symbol-search-form.component';
import { ReportOutputsColumnComponent } from './views/test-report-view/report-output-column/report-outputs-column.component';
import { ReportChartsComponent } from './views/test-report-view/report-donut-chart/report-charts.component';
import { TestReportViewComponent } from './views/test-report-view/test-report-view.component';
import { TestReportsViewComponent } from './views/test-reports-view/test-reports-view.component';
import { LearnerResultsViewComponent } from './views/learner-results-view/learner-results-view.component';
import { TestCaseViewComponent } from './views/test-case-view/test-case-view.component';
import { TestsViewComponent } from './views/tests-view/tests-view.component';
import { TestSuiteViewComponent } from './views/test-suite-view/test-suite-view.component';

angular
  .module('ALEX', [

    // modules from external libraries
    ngAnimate,
    ngMessages,
    uiBootstrap,
    uiRouter,
    'ui.ace',
    'n3-line-chart',
    ngFileUpload,
    angularDragula(angular)
  ])

  .config(config.config)
  .config(routes.config)
  .run(routes.run)

  // filters
  .filter('formatEqOracle', formatEqOracle)
  .filter('formatAlgorithm', formatAlgorithm)
  .filter('formatMilliseconds', formatMilliseconds)
  .filter('formatWebBrowser', formatWebBrowser)
  .filter('sortTests', sortTests)
  .filter('normalizeUpperCase', normalizeUpperCase)

  // factories
  .factory('unauthorizedHttpInterceptor', unauthorizedHttpInterceptor)

  // resources
  .service('counterApi', downgradeInjectable(CounterApiService))
  .service('fileApi', downgradeInjectable(FileApiService))
  .service('learnerApi', downgradeInjectable(LearnerApiService))
  .service('learnerResultApi', downgradeInjectable(LearnerResultApiService))
  .service('projectApi', downgradeInjectable(ProjectApiService))
  .service('settingsApi', downgradeInjectable(SettingsApiService))
  .service('symbolGroupApi', downgradeInjectable(SymbolGroupApiService))
  .service('symbolParameterApi', downgradeInjectable(SymbolParameterApiService))
  .service('symbolApi', downgradeInjectable(SymbolApiService))
  .service('userApi', downgradeInjectable(UserApiService))
  .service('testConfigApi', downgradeInjectable(TestConfigApiService))
  .service('testApi', downgradeInjectable(TestApiService))
  .service('testReportApi', downgradeInjectable(TestReportApiService))
  .service('webhookApi', downgradeInjectable(WebhookApiService))
  .service('ltsFormulaApi', downgradeInjectable(LtsFormulaApiService))
  .service('projectEnvironmentApi', downgradeInjectable(ProjectEnvironmentApiService))

  .service('modalService', downgradeInjectable(NgbModal))

  // services
  .service('actionService', downgradeInjectable(ActionService))
  .service('clipboardService', downgradeInjectable(ClipboardService))
  .service('eventBus',  downgradeInjectable(EventBus))
  .service('eqOracleService', downgradeInjectable(EqOracleService))
  .service('learningAlgorithmService', downgradeInjectable(LearningAlgorithmService))
  .service('downloadService', downgradeInjectable(DownloadService))
  .service('learnerResultChartService', downgradeInjectable(LearnerResultChartService))
  .service('promptService', downgradeInjectable(PromptService))
  .service('toastService', downgradeInjectable(ToastService))
  .service('learnerResultDownloadService', downgradeInjectable(LearnerResultDownloadService))
  .service('testReportService', downgradeInjectable(TestReportService))
  .service('notificationService', downgradeInjectable(NotificationService))
  .service('appStore', downgradeInjectable(AppStoreService))
  .service('errorViewStore', downgradeInjectable(ErrorViewStoreService))

  // modals
  .component('actionCreateModal', actionCreateModalComponent)
  .component('actionEditModal', actionEditModalComponent)

  // view components
  .directive('aboutView', downgradeComponent({ component: AboutViewComponent }) as angular.IDirectiveFactory)
  .directive('adminSettingsView', downgradeComponent({ component: AdminSettingsViewComponent }) as angular.IDirectiveFactory)
  .directive('adminUsersView', downgradeComponent({ component: AdminUsersViewComponent }) as angular.IDirectiveFactory)
  .directive('countersView', downgradeComponent({ component: CountersViewComponent }) as angular.IDirectiveFactory)
  .directive('errorView', downgradeComponent({ component: ErrorViewComponent }) as angular.IDirectiveFactory)
  .directive('filesView', downgradeComponent({ component: FilesViewComponent }) as angular.IDirectiveFactory)
  .component('rootView', rootViewComponent)
  .component('learnerSetupView', learnerSetupViewComponent)
  .component('learnerView', learnerViewComponent)
  .directive('projectsView', downgradeComponent({ component: ProjectsViewComponent }) as angular.IDirectiveFactory)
  .directive('projectView', downgradeComponent({ component: ProjectViewComponent }) as angular.IDirectiveFactory)
  .component('resultsCompareView', resultsCompareViewComponent)
  .directive('learnerResultsView', downgradeComponent({ component: LearnerResultsViewComponent }) as angular.IDirectiveFactory)
  .component('statisticsCompareView', statisticsCompareViewComponent)
  .component('symbolView', symbolViewComponent)
  .directive('symbolsView', downgradeComponent({ component: SymbolsViewComponent }) as angular.IDirectiveFactory)
  .directive('testsView', downgradeComponent({ component: TestsViewComponent }) as angular.IDirectiveFactory)
  .directive('testCaseResultsView', downgradeComponent({ component: TestCaseResultsViewComponent }) as angular.IDirectiveFactory)
  .directive('symbolsArchiveView', downgradeComponent({ component: SymbolsArchiveViewComponent }) as angular.IDirectiveFactory)
  .directive('profileView', downgradeComponent({ component: ProfileViewComponent }) as angular.IDirectiveFactory)
  .directive('testCaseView', downgradeComponent({ component: TestCaseViewComponent }) as angular.IDirectiveFactory)
  .directive('testReportsView', downgradeComponent({ component: TestReportsViewComponent }) as angular.IDirectiveFactory)
  .directive('testReportView', downgradeComponent({ component: TestReportViewComponent }) as angular.IDirectiveFactory)
  .directive('testSuiteView', downgradeComponent({ component: TestSuiteViewComponent }) as angular.IDirectiveFactory)
  .directive('webhooksView', downgradeComponent({ component: WebhooksViewComponent }) as angular.IDirectiveFactory)
  .component('redirectView', redirectViewComponent)
  .directive('ltsFormulasView', downgradeComponent({ component: LtsFormulasViewComponent }) as angular.IDirectiveFactory)
  .directive('logoutView', downgradeComponent({ component: LogoutViewComponent }) as angular.IDirectiveFactory)
  .directive('projectEnvironmentsView', downgradeComponent({ component: ProjectEnvironmentsViewComponent }) as angular.IDirectiveFactory)

  // forms components
  .component('actionForm', actionFormComponent)
  .component('userLoginForm', userLoginFormComponent)
  .component('nodeFormGroup', nodeFormGroupComponent)
  .directive('searchForm', downgradeComponent({ component: SearchFormComponent }) as angular.IDirectiveFactory)
  .component('actionSearchForm', actionSearchFormComponent)
  .directive('symbolSearchForm', downgradeComponent({ component: SymbolSearchFormComponent }) as angular.IDirectiveFactory)
  .component('eqOracleForm', eqOracleFormComponent)
  .component('completeEqOracleForm', completeEqOracleFormComponent)
  .component('randomEqOracleForm', randomEqOracleFormComponent)
  .component('wMethodEqOracleForm', wMethodEqOracleFormComponent)
  .component('hypothesisEqOracleForm', hypothesisEqOracleFormComponent)
  .component('testSuiteEqOracleForm', testSuiteEqOracleFormComponent)
  .component('wpMethodEqOracleForm', wpMethodEqOracleFormComponent)

  // widgets components
  .component('counterexamplesWidget', counterexamplesWidgetComponent)
  .component('learnResumeSettingsWidget', learnerResumeSettingsWidgetComponent)
  .component('testCaseGenerationWidget', testCaseGenerationWidgetComponent)
  .component('testSuiteGenerationWidget', testSuiteGenerationWidgetComponent)

  // web action forms
  .component('alertAcceptDismissActionForm', alertAcceptDismissActionFormComponent)
  .component('alertGetTextActionForm', alertGetTextActionFormComponent)
  .component('alertSendKeysActionForm', alertSendKeysActionFormComponent)
  .component('browserActionForm', browserActionFormComponent)
  .component('checkNodeAttributeValueActionForm', checkNodeAttributeValueActionFormComponent)
  .component('checkForNodeActionForm', checkForNodeActionFormComponent)
  .component('checkForTextActionForm', checkForTextActionFormComponent)
  .component('checkPageTitleActionForm', checkPageTitleActionFormComponent)
  .component('checkNodeSelectedActionForm', checkNodeSelectedActionFormComponent)
  .component('clearInputActionForm', clearInputActionFormComponent)
  .component('clickActionForm', clickActionFormComponent)
  .component('clickElementByTextActionForm', clickElementByTextActionFormComponent)
  .component('clickLinkByTextActionForm', clickLinkByTextActionFormComponent)
  .component('executeScriptActionForm', executeScriptActionFormComponent)
  .component('moveMouseActionForm', moveMouseActionFormComponent)
  .component('openActionForm', openActionFormComponent)
  .component('selectActionForm', selectActionFormComponent)
  .component('sendKeysActionForm', sendKeysActionFormComponent)
  .component('submitActionForm', submitActionFormComponent)
  .component('switchToActionForm', switchToActionFormComponent)
  .component('switchToFrameActionForm', switchToFrameActionFormComponent)
  .component('waitForNodeActionForm', waitForNodeActionFormComponent)
  .component('waitForTitleActionForm', waitForTitleActionFormComponent)
  .component('waitForTextActionForm', waitForTextActionFormComponent)
  .component('pressKeyActionForm', pressKeyActionFormComponent)
  .component('waitForNodeAttributeActionForm', waitForNodeAttributeActionFormComponent)
  .component('uploadFileActionForm', uploadFileActionFormComponent)
  .component('dragAndDropActionForm', dragAndDropActionFormComponent)
  .component('dragAndDropByActionForm', dragAndDropByActionFormComponent)
  .component('waitForScriptActionForm', waitForScriptActionFormComponent)

  // rest action forms
  .component('requestActionForm', requestActionFormComponent)
  .component('checkAttributeExistsActionForm', checkAttributeExistsActionFormComponent)
  .component('checkAttributeTypeActionForm', checkAttributeTypeActionFormComponent)
  .component('checkAttributeValueActionForm', checkAttributeValueActionFormComponent)
  .component('checkHeaderFieldActionForm', checkHeaderFieldActionFormComponent)
  .component('checkHttpBodyActionForm', checkHttpBodyActionFormComponent)
  .component('checkStatusActionForm', checkStatusActionFormComponent)
  .component('validateJsonActionForm', validateJsonActionFormComponent)

  // misc action forms
  .component('assertCounterActionForm', assertCounterActionFormComponent)
  .component('assertVariableActionForm', assertVariableActionFormComponent)
  .component('incrementCounterActionForm', incrementCounterActionFormComponent)
  .component('setCounterActionForm', setCounterActionFormComponent)
  .component('setVariableActionForm', setVariableActionFormComponent)
  .component('setVariableByCookieActionForm', setVariableByCookieActionFormComponent)
  .component('setVariableByHttpResponseActionForm', setVariableByHttpResponseActionFormComponent)
  .component('setVariableByHtmlActionForm', setVariableByHtmlActionFormComponent)
  .component('setVariableByJsonActionForm', setVariableByJsonActionFormComponent)
  .component('setVariableByNodeAttributeActionForm', setVariableByNodeAttributeActionFormComponent)
  .component('setVariableByNodeCountActionForm', setVariableByNodeCountActionFormComponent)
  .component('setVariableByRegexGroupActionForm', setVariableByRegexGroupActionFormComponent)
  .component('setVariableByHttpStatusActionForm', setVariableByHttpStatusActionFormComponent)
  .component('waitActionForm', waitActionFormComponent)

  // misc components
  .component('alex', alexComponent)
  .directive('actionBar', downgradeComponent({ component: ActionBarComponent }) as angular.IDirectiveFactory)
  .directive('hypothesis', downgradeComponent({ component: HypothesisComponent }) as angular.IDirectiveFactory)
  .directive('discriminationTree', downgradeComponent({ component: DiscriminationTreeComponent }) as angular.IDirectiveFactory)
  .directive('fileDropzone', downgradeComponent({ component: FileDropzoneComponent }) as angular.IDirectiveFactory)
  .component('sidebar', sidebarComponent)
  .directive('viewHeader', downgradeComponent({ component: ViewHeaderComponent }) as angular.IDirectiveFactory)
  .component('learnerResultPanel', learnerResultPanelComponent)
  .component('learnerResultPanelTestingView', learnerResultPanelTestingViewComponent)
  .component('learnerResultPanelDefaultView', learnerResultPanelDefaultViewComponent)
  .component('learnerResultPanelCheckingView', learnerResultPanelCheckingViewComponent)
  .directive('observationTable', downgradeComponent({ component: ObservationTableComponent }) as angular.IDirectiveFactory)
  .directive('testResultReport', downgradeComponent({ component: TestResultReportComponent }) as angular.IDirectiveFactory)
  .directive('testTree', downgradeComponent({ component: TestTreeComponent }) as angular.IDirectiveFactory)
  .directive('symbolParametersPanel', downgradeComponent({ component: SymbolParametersPanelComponent }) as angular.IDirectiveFactory)
  .directive('simpleSymbolGroupTree', downgradeComponent({ component: SimpleSymbolGroupTreeComponent }) as angular.IDirectiveFactory)
  .directive('simpleSymbolGroupTreeItem', downgradeComponent({ component: SimpleSymbolGroupTreeItemComponent }) as angular.IDirectiveFactory)
  .directive('reportOutputsColumn', downgradeComponent({ component: ReportOutputsColumnComponent }) as angular.IDirectiveFactory)
  .directive('reportCharts', downgradeComponent({ component: ReportChartsComponent }) as angular.IDirectiveFactory)
  .directive('testConfigList', downgradeComponent({ component: TestConfigListComponent }) as angular.IDirectiveFactory)
  .directive('selectableCheckbox', downgradeComponent({ component: SelectableCheckboxComponent }) as angular.IDirectiveFactory)
  .directive('selectableCheckboxMultiple', downgradeComponent({ component: SelectableCheckboxMultipleComponent }) as angular.IDirectiveFactory)
  .directive('symbolParameters', downgradeComponent({ component: SymbolParametersComponent }) as angular.IDirectiveFactory)
  .directive('pagination', downgradeComponent({ component: PaginationComponent }) as angular.IDirectiveFactory)
  .directive('outputErrorTrace', downgradeComponent({ component: OutputErrorTraceComponent }) as angular.IDirectiveFactory)
  .directive('testCaseTable', downgradeComponent({ component: TestCaseTableComponent }) as angular.IDirectiveFactory);

const MODULE_NAME = 'ALEX';
export default MODULE_NAME;
