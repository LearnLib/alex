import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ToastService } from './services/toast.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionBarComponent } from './common/action-bar/action-bar.component';
import { DragulaModule } from 'ng2-dragula';
import { SelectableCheckboxComponent } from './common/selectable-checkbox/selectable-checkbox.component';
import { SelectableCheckboxMultipleComponent } from './common/selectable-checkbox-multiple/selectable-checkbox-multiple.component';
import { AppStoreService } from './services/app-store.service';
import { SettingsApiService } from './services/api/settings-api.service';
import { TestCaseTableComponent } from './views/test-case-view/test-case-table/test-case-table.component';
import { SymbolInputValuesComponent } from './common/symbol-input-values/symbol-input-values.component';
import { OutputErrorTraceComponent } from './common/output-error-trace/output-error-trace.component';
import { TestCaseTablePrePostStepsComponent } from './views/test-case-view/test-case-table/test-case-table-pre-post-steps/test-case-table-pre-post-steps.component';
import { TestCaseTableSymbolColumnComponent } from './views/test-case-view/test-case-table/test-case-table-symbol-column/test-case-table-symbol-column.component';
import { SymbolGroupApiService } from './services/api/symbol-group-api.service';
import { SymbolParameterApiService } from './services/api/symbol-parameter-api.service';
import { TestConfigApiService } from './services/api/test-config-api.service';
import { WebhookApiService } from './services/api/webhook-api.service';
import { TestReportApiService } from './services/api/test-report-api.service';
import { CounterApiService } from './services/api/counter-api.service';
import { ProjectApiService } from './services/api/project-api.service';
import { CountersViewComponent } from './views/counters-view/counters-view.component';
import { CreateCounterModalComponent } from './views/counters-view/create-counter-modal/create-counter-modal.component';
import { ProjectEnvironmentApiService } from './services/api/project-environment-api.service';
import { LtsFormulaApiService } from './services/api/lts-formula-api.service';
import { LtsFormulaSuitesViewComponent } from './views/lts-formula-suites-view/lts-formula-suites-view.component';
import { CreateLtsFormulaModalComponent } from './views/lts-formula-suite-view/create-lts-formula-modal/create-lts-formula-modal.component';
import { EditLtsFormulaModalComponent } from './views/lts-formula-suite-view/edit-lts-formula-modal/edit-lts-formula-modal.component';
import { LtsFormulaFormGroupsComponent } from './views/lts-formula-suite-view/lts-formula-form-groups/lts-formula-form-groups.component';
import { WebhooksViewComponent } from './views/webhooks-view/webhooks-view.component';
import { CreateWebhookModalComponent } from './views/webhooks-view/create-webhook-modal/create-webhook-modal.component';
import { EditWebhookModalComponent } from './views/webhooks-view/edit-webhook-modal/edit-webhook-modal.component';
import { WebhookFormGroupsComponent } from './views/webhooks-view/webhook-form-groups/webhook-form-groups.component';
import { NormalizeUpperCasePipe } from './pipes/normalize-upper-case.pipe';
import { SymbolApiService } from './services/api/symbol-api.service';
import { SymbolParametersPanelComponent } from './views/symbol-view/symbol-parameters-panel/symbol-parameters-panel.component';
import { CreateSymbolParameterModalComponent } from './views/symbol-view/symbol-parameters-panel/create-symbol-parameter-modal/create-symbol-parameter-modal.component';
import { EditSymbolParameterModalComponent } from './views/symbol-view/symbol-parameters-panel/edit-symbol-parameter-modal/edit-symbol-parameter-modal.component';
import { SymbolParameterFormGroupsComponent } from './views/symbol-view/symbol-parameters-panel/symbol-parameter-form-groups/symbol-parameter-form-groups.component';
import { ClipboardService } from './services/clipboard.service';
import { UserApiService } from './services/api/user-api.service';
import { LearnerResultApiService } from './services/api/learner-result-api.service';
import { LearnerApiService } from './services/api/learner-api.service';
import { TestApiService } from './services/api/test-api.service';
import { FileApiService } from './services/api/file-api.service';
import { PromptModalComponent } from './common/modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from './common/modals/confirm-modal/confirm-modal.component';
import { PromptService } from './services/prompt.service';
import { TestConfigListComponent } from './views/test-suite-view/test-config-list/test-config-list.component';
import { ProjectDetailsWidgetComponent } from './views/project-view/project-details-widget/project-details-widget.component';
import { LatestTestReportWidgetComponent } from './views/project-view/latest-test-report-widget/latest-test-report-widget.component';
import { LatestLearnerResultWidgetComponent } from './views/project-view/latest-learner-result-widget/latest-learner-result-widget.component';
import { LearnerStatusWidgetComponent } from './views/project-view/learner-status-widget/learner-status-widget.component';
import { FormatLearningAlgorithmPipe } from './pipes/format-learning-algorithm.pipe';
import { FormatMillisecondsPipe } from './pipes/format-milliseconds.pipe';
import { ProjectViewComponent } from './views/project-view/project-view.component';
import { ProjectsViewComponent } from './views/projects-view/projects-view.component';
import { CreateProjectModalComponent } from './views/projects-view/create-project-modal/create-project-modal.component';
import { EditProjectModalComponent } from './views/projects-view/edit-project-modal/edit-project-modal.component';
import { ImportProjectModalComponent } from './views/projects-view/import-project-modal/import-project-modal.component';
import { DownloadService } from './services/download.service';
import { ProjectFormGroupsComponent } from './views/projects-view/project-form-groups/project-form-groups.component';
import { FileDropzoneComponent } from './common/file-dropzone/file-dropzone.component';
import { LogoutViewComponent } from './views/logout-view/logout-view.component';
import { TestReportService } from './services/test-report.service';
import { NotificationService } from './services/notification.service';
import { ActionService } from './services/action.service';
import { EqOracleService } from './services/eq-oracle.service';
import { LearningAlgorithmService } from './services/learning-algorithm.service';
import { LearnerResultChartService } from './services/learner-result-chart.service';
import { PaginationComponent } from './common/pagination/pagination.component';
import { FilesViewComponent } from './views/files-view/files-view.component';
import { ProjectEnvironmentsViewComponent } from './views/project-environments-view/project-environments-view.component';
import { CreateEnvironmentVariableModalComponent } from './views/project-environments-view/create-environment-variable-modal/create-environment-variable-modal.component';
import { EditEnvironmentVariableModalComponent } from './views/project-environments-view/edit-environment-variable-modal/edit-environment-variable-modal.component';
import { CreateProjectUrlModalComponent } from './views/project-environments-view/create-project-url-modal/create-project-url-modal.component';
import { EditProjectUrlModalComponent } from './views/project-environments-view/edit-project-url-modal/edit-project-url-modal.component';
import { ProjectUrlFormGroupsComponent } from './views/project-environments-view/project-url-form-groups/project-url-form-groups.component';
import { HypothesisComponent } from './common/hypothesis/hypothesis.component';
import { DiscriminationTreeComponent } from './common/discrimination-tree/discrimination-tree.component';
import { ObservationTableComponent } from './common/observation-table/observation-table.component';
import { LearnerResultDownloadService } from './services/learner-result-download.service';
import { AdminUsersViewComponent } from './views/admin-users-view/admin-users-view.component';
import { CreateUserModalComponent } from './views/admin-users-view/create-user-modal/create-user-modal.component';
import { EditUserModalComponent } from './views/admin-users-view/edit-user-modal/edit-user-modal.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { TestTreeComponent } from './views/test-suite-view/test-tree/test-tree.component';
import { TestCaseNodeComponent } from './views/test-suite-view/test-tree/test-case-node/test-case-node.component';
import { TestSuiteNodeComponent } from './views/test-suite-view/test-tree/test-suite-node/test-suite-node.component';
import { AdminSettingsViewComponent } from './views/admin-settings-view/admin-settings-view.component';
import { ErrorViewComponent } from './views/error-view/error-view.component';
import { ErrorViewStoreService } from './views/error-view/error-view-store.service';
import { SimpleSymbolGroupTreeComponent } from './common/simple-symbol-group-tree/simple-symbol-group-tree.component';
import { SimpleSymbolGroupTreeItemComponent } from './common/simple-symbol-group-tree/simple-symbol-group-tree-item/simple-symbol-group-tree-item.component';
import { CreateSymbolGroupModalComponent } from './views/symbols-view/create-symbol-group-modal/create-symbol-group-modal.component';
import { EditSymbolGroupModalComponent } from './views/symbols-view/edit-symbol-group-modal/edit-symbol-group-modal.component';
import { MoveSymbolGroupModalComponent } from './views/symbols-view/move-symbol-group-modal/move-symbol-group-modal.component';
import { SymbolFormGroupsComponent } from './views/symbols-view/symbol-form-groups/symbol-form-groups.component';
import { CreateSymbolModalComponent } from './views/symbols-view/create-symbol-modal/create-symbol-modal.component';
import { EditSymbolModalComponent } from './views/symbols-view/edit-symbol-modal/edit-symbol-modal.component';
import { MoveSymbolsModalComponent } from './views/symbols-view/move-symbols-modal/move-symbols-modal.component';
import { SelectSymbolModalComponent } from './common/modals/select-symbol-modal/select-symbol-modal.component';
import { SymbolUsagesModalComponent } from './common/modals/symbol-usages-modal/symbol-usages-modal.component';
import { SymbolsArchiveViewComponent } from './views/symbols-archive-view/symbols-archive-view.component';
import { SearchFormComponent } from './common/search-form/search-form.component';
import { SymbolSearchFormComponent } from './common/search-form/symbol-search-form/symbol-search-form.component';
import { ExportSymbolsModalComponent } from './views/symbols-view/export-symbols-modal/export-symbols-modal.component';
import { ImportSymbolsModalComponent } from './views/symbols-view/import-symbols-modal/import-symbols-modal.component';
import { ExecutionResultModalComponent } from './common/modals/execution-result-modal/execution-result-modal.component';
import { ReportChartsComponent } from './views/test-report-view/report-donut-chart/report-charts.component';
import { ReportOutputsColumnComponent } from './views/test-report-view/report-output-column/report-outputs-column.component';
import { TestReportViewComponent } from './views/test-report-view/test-report-view.component';
import { TestReportsViewComponent } from './views/test-reports-view/test-reports-view.component';
import { TestCaseResultsViewComponent } from './views/test-case-results-view/test-case-results-view.component';
import { FormatEqOraclePipe } from './pipes/format-eq-oracle.pipe';
import { LearnerResultsViewComponent } from './views/learner-results-view/learner-results-view.component';
import { LearnerResultDetailsModalComponent } from './common/modals/learner-result-details-modal/learner-result-details-modal.component';
import { LearnerResultListItemComponent } from './views/learner-results-view/learner-result-list-item/learner-result-list-item.component';
import { TestsViewComponent } from './views/tests-view/tests-view.component';
import { TestCaseViewComponent } from './views/test-case-view/test-case-view.component';
import { TestSuiteViewComponent } from './views/test-suite-view/test-suite-view.component';
import { TestConfigModalComponent } from './views/tests-view/test-config-modal/test-config-modal.component';
import { TestsImportModalComponent } from './views/test-suite-view/tests-import-modal/tests-import-modal.component';
import { TestSuiteTreeComponent } from './views/test-suite-view/tests-move-modal/test-suite-tree-component/test-suite-tree.component';
import { TestsMoveModalComponent } from './views/test-suite-view/tests-move-modal/tests-move-modal.component';
import { DriverConfigFormComponent } from './common/web-driver-config-form/driver-config-form.component';
import { LearnerResultListModalComponent } from './views/learner-results-compare-view/learner-result-list-modal/learner-result-list-modal.component';
import { SeparatingWordModalComponent } from './common/modals/separating-word-modal/separating-word-modal.component';
import { SymbolsViewComponent } from './views/symbols-view/symbols-view.component';
import { SymbolGroupHeaderComponent } from './views/symbols-view/symbols-symbol-group-tree/symbol-group-header/symbol-group-header.component';
import { SymbolsSymbolGroupTreeComponent } from './views/symbols-view/symbols-symbol-group-tree/symbols-symbol-group-tree.component';
import { SymbolItemComponent } from './views/symbols-view/symbols-symbol-group-tree/symbol-item/symbol-item.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { UserLoginFormComponent } from './common/user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from './common/user-registration-form/user-registration-form.component';
import { RootViewComponent } from './views/root-view/root-view.component';
import { NodeFormGroupComponent } from './common/node-form-group/node-form-group.component';
import { LearnerSetupsViewComponent } from './views/learner-setups-view/learner-setups-view.component';
import { SymbolViewComponent } from './views/symbol-view/symbol-view.component';
import { CreateActionModalComponent } from './views/symbol-view/create-action-modal/create-action-modal.component';
import { EditActionModalComponent } from './views/symbol-view/edit-action-modal/edit-action-modal.component';
import { LearnerResultsCompareViewComponent } from './views/learner-results-compare-view/learner-results-compare-view.component';
import { StatisticsCompareViewComponent } from './views/statistics-compare-view/statistics-compare-view.component';
import { LearnerResultPanelComponent } from './common/learner-result-panel/learner-result-panel.component';
import { LearnerViewComponent } from './views/learner-view/learner-view.component';
import { LearnerResultPanelCheckingViewComponent } from './common/learner-result-panel/learner-result-panel-checking-view/learner-result-panel-checking-view.component';
import { LearnerResultPanelDefaultViewComponent } from './common/learner-result-panel/learner-result-panel-default-view/learner-result-panel-default-view.component';
import { LearnerResultPanelTestingViewComponent } from './common/learner-result-panel/learner-result-panel-testing-view/learner-result-panel-testing-view.component';
import { TestSuiteGenerationWidgetComponent } from './common/learner-result-panel/learner-result-panel-testing-view/test-suite-generation-widget/test-suite-generation-widget.component';
import { TestCaseGenerationWidgetComponent } from './common/learner-result-panel/learner-result-panel-testing-view/test-case-generation-widget/test-case-generation-widget.component';
import { LearnerResumeSettingsWidgetComponent } from './views/learner-view/learner-resume-widget/learner-resume-settings-widget.component';
import { CounterexamplesWidgetComponent } from './views/learner-view/learner-resume-widget/counterexamples-widget/counterexamples-widget.component';
import { EqOracleFormComponent } from './common/eq-oracles/eq-oracle-form.component';
import { WpMethodEqOracleFormComponent } from './common/eq-oracles/wp-method-eq-oracle-form/wp-method-eq-oracle-form.component';
import { RandomEqOracleFormComponent } from './common/eq-oracles/random-eq-oracle-form/random-eq-oracle-form.component';
import { CompleteEqOracleFormComponent } from './common/eq-oracles/complete-eq-oracle-form/complete-eq-oracle-form.component';
import { TestSuiteEqOracleFormComponent } from './common/eq-oracles/test-suite-eq-oracle-form/test-suite-eq-oracle-form.component';
import { HypothesisEqOracleFormComponent } from './common/eq-oracles/hypothesis-eq-oracle-form/hypothesis-eq-oracle-form.component';
import { WMethodEqOracleFormComponent } from './common/eq-oracles/w-method-eq-oracle-form/w-method-eq-oracle-form.component';
import { ActionFormComponent } from './common/actions/action-form/action-form.component';
import { AssertCounterActionFormComponent } from './common/actions/misc/assert-counter-action-form/assert-counter-action-form.component';
import { AssertVariableActionFormComponent } from './common/actions/misc/assert-variable-action-form/assert-variable-action-form.component';
import { IncrementCounterActionFormComponent } from './common/actions/misc/increment-counter-action-form/increment-counter-action-form.component';
import { SetCounterActionFormComponent } from './common/actions/misc/set-counter-action-form/set-counter-action-form.component';
import { SetVariableActionFormComponent } from './common/actions/misc/set-variable-action-form/set-variable-action-form.component';
import { SetVariableByCookieActionFormComponent } from './common/actions/misc/set-variable-by-cookie-action-form/set-variable-by-cookie-action-form.component';
import { SetVariableByHtmlActionFormComponent } from './common/actions/misc/set-variable-by-html-action-form/set-variable-by-html-action-form.component';
import { SetVariableByHttpResponseActionFormComponent } from './common/actions/misc/set-variable-by-http-response-action-form/set-variable-by-http-response-action-form.component';
import { SetVariableByHttpStatusActionFormComponent } from './common/actions/misc/set-variable-by-http-status-action-form/set-variable-by-http-status-action-form.component';
import { SetVariableByJsonActionFormComponent } from './common/actions/misc/set-variable-by-json-action-form/set-variable-by-json-action-form.component';
import { SetVariableByNodeAttributeActionFormComponent } from './common/actions/misc/set-variable-by-node-attribute-action-form/set-variable-by-node-attribute-action-form.component';
import { SetVariableByNodeCountActionFormComponent } from './common/actions/misc/set-variable-by-node-count-action-form/set-variable-by-node-count-action-form.component';
import { SetVariableByRegexGroupActionFormComponent } from './common/actions/misc/set-variable-by-regex-group-action-form/set-variable-by-regex-group-action-form.component';
import { CheckAttributeExistsActionFormComponent } from './common/actions/rest/check-attribute-exists-action-form/check-attribute-exists-action-form.component';
import { CheckAttributeTypeActionFormComponent } from './common/actions/rest/check-attribute-type-action-form/check-attribute-type-action-form.component';
import { CheckAttributeValueActionFormComponent } from './common/actions/rest/check-attribute-value-action-form/check-attribute-value-action-form.component';
import { CheckHeaderFieldActionFormComponent } from './common/actions/rest/check-header-field-action-form/check-header-field-action-form.component';
import { CheckHttpBodyActionFormComponent } from './common/actions/rest/check-http-body-action-form/check-http-body-action-form.component';
import { CheckStatusActionFormComponent } from './common/actions/rest/check-status-action-form/check-status-action-form.component';
import { RequestActionFormComponent } from './common/actions/rest/request-action-form/request-action-form.component';
import { ValidateJsonActionFormComponent } from './common/actions/rest/validate-json-action-form/validate-json-action-form.component';
import { AlertAcceptDismissActionFormComponent } from './common/actions/web/alert-accept-dismiss-action-form/alert-accept-dismiss-action-form.component';
import { AlertGetTextActionFormComponent } from './common/actions/web/alert-get-text-action-form/alert-get-text-action-form.component';
import { AlertSendKeysActionFormComponent } from './common/actions/web/alert-send-keys-action-form/alert-send-keys-action-form.component';
import { BrowserActionFormComponent } from './common/actions/web/browser-action-form/browser-action-form.component';
import { CheckForNodeActionFormComponent } from './common/actions/web/check-for-node-action-form/check-for-node-action-form.component';
import { CheckForTextActionFormComponent } from './common/actions/web/check-for-text-action-form/check-for-text-action-form.component';
import { CheckNodeAttributeValueActionFormComponent } from './common/actions/web/check-node-attribute-value-action-form/check-node-attribute-value-action-form.component';
import { CheckNodeSelectedActionFormComponent } from './common/actions/web/check-node-selected-action-form/check-node-selected-action-form.component';
import { CheckPageTitleActionFormComponent } from './common/actions/web/check-page-title-action-form/check-page-title-action-form.component';
import { ClearInputActionFormComponent } from './common/actions/web/clear-input-action-form/clear-input-action-form.component';
import { ClickActionFormComponent } from './common/actions/web/click-action-form/click-action-form.component';
import { ClickElementByTextActionFormComponent } from './common/actions/web/click-element-by-text-action-form/click-element-by-text-action-form.component';
import { ClickLinkByTextActionFormComponent } from './common/actions/web/click-link-by-text-action-form/click-link-by-text-action-form.component';
import { DragAndDropActionFormComponent } from './common/actions/web/drag-and-drop-action-form/drag-and-drop-action-form.component';
import { DragAndDropByActionFormComponent } from './common/actions/web/drag-and-drop-by-action-form/drag-and-drop-by-action-form.component';
import { ExecuteScriptActionFormComponent } from './common/actions/web/execute-script-action-form/execute-script-action-form.component';
import { MoveMouseActionFormComponent } from './common/actions/web/move-mouse-action-form/move-mouse-action-form.component';
import { OpenUrlActionFormComponent } from './common/actions/web/open-url-action-form/open-url-action-form.component';
import { PressKeyActionFormComponent } from './common/actions/web/press-key-action-form/press-key-action-form.component';
import { SelectActionFormComponent } from './common/actions/web/select-action-form/select-action-form.component';
import { SendKeysActionFormComponent } from './common/actions/web/send-keys-action-form/send-keys-action-form.component';
import { SubmitActionFormComponent } from './common/actions/web/submit-action-form/submit-action-form.component';
import { SwitchToActionFormComponent } from './common/actions/web/switch-to-action-form/switch-to-action-form.component';
import { SwitchToFrameActionFormComponent } from './common/actions/web/switch-to-frame-action-form/switch-to-frame-action-form.component';
import { UploadFileActionFormComponent } from './common/actions/web/upload-file-action-form/upload-file-action-form.component';
import { WaitForNodeActionFormComponent } from './common/actions/web/wait-for-node-action-form/wait-for-node-action-form.component';
import { WaitForNodeAttributeActionFormComponent } from './common/actions/web/wait-for-node-attribute-action-form/wait-for-node-attribute-action-form.component';
import { WaitForScriptActionFormComponent } from './common/actions/web/wait-for-script-action-form/wait-for-script-action-form.component';
import { WaitForTextActionFormComponent } from './common/actions/web/wait-for-text-action-form/wait-for-text-action-form.component';
import { WaitForTitleActionFormComponent } from './common/actions/web/wait-for-title-action-form/wait-for-title-action-form.component';
import { WaitActionFormComponent } from './common/actions/misc/wait-action-form/wait-action-form.component';
import { ActionSearchFormComponent } from './views/symbol-view/create-action-modal/action-search-form/action-search-form.component';
import { AppViewComponent } from './views/app-view/app-view.component';
import { UnauthorizedHttpInterceptor } from './interceptors/unauthorized-http-interceptor';
import { AceEditorModule } from 'ng2-ace-editor';
import { AboutModalComponent } from './views/root-view/about-modal/about-modal.component';
import { FormUtilsService } from './services/form-utils.service';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { JumpToLabelActionFormComponent } from './common/actions/misc/jump-to-label-action-form/jump-to-label-action-form.component';
import { CreateLabelActionFormComponent } from './common/actions/misc/create-label-action-form/create-label-action-form.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TestStatusComponent } from './common/test-status/test-status.component';
import { TestReportProgressComponent } from './common/test-report-progress/test-report-progress.component';
import { ProjectUsersViewComponent } from './views/project-users-view/project-users-view.component';
import { AddUserModalComponent } from './views/project-users-view/add-user-modal/add-user-modal.component';
import { SymbolsDataContextComponent } from './common/symbols-data-context/symbols-data-context.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ToggleButtonComponent } from './common/toggle-button/toggle-button.component';
import { LearnerSetupApiService } from './services/api/learner-setup-api.service';
import { LearnerSetupTableComponent } from './common/learner-setup-table/learner-setup-table.component';
import { LearnerSetupsCreateViewComponent } from './views/learner-setups-create-view/learner-setups-create-view.component';
import { LearnerSetupsEditViewComponent } from './views/learner-setups-edit-view/learner-setups-edit-view.component';
import { LearnerSetupFormComponent } from './common/learner-setup-form/learner-setup-form.component';
import { ProjectListComponent } from './views/projects-view/project-list/project-list.component';
import { LtsFormulaSuiteApiService } from './services/api/lts-formula-suite-api.service';
import { LtsFormulaSuiteViewComponent } from './views/lts-formula-suite-view/lts-formula-suite-view.component';
import { TreeViewComponent } from './common/tree-view/tree-view.component';
import { MoveLtsFormulaModalComponent } from './views/lts-formula-suite-view/move-lts-formula-modal/move-lts-formula-modal.component';
import { ModelCheckerApiService } from './services/api/model-checker-api.service';
import { WebSocketAPIService } from "./services/api/websocket-api.service";
import { WebSocketService } from "./services/websocket.service";
import { ProjectPresenceService } from "./services/project-presence.service";
import { TestPresenceService } from "./services/test-presence.service";
import { SymbolPresenceService } from "./services/symbol-presence.service";
import { LockInfoBadgeComponent } from './common/lock-info-badge/lock-info-badge.component';
import { LockInfoListComponent } from './common/lock-info-list/lock-info-list.component';
import { ImgCacheService } from "./services/img-cache.service";
import { TestReportScreenshotsViewComponent } from "./views/test-report-screenshots-view/test-report-screenshots-view.component";
import { TestResultApiService } from "./services/api/test-result-api.service";
import { ViewScreenshotModalComponent } from "./views/test-report-screenshots-view/view-screenshot-modal/view-screenshot-modal.component";
import { FetchImgSecurePipe } from "./pipes/fetch-img-secure.pipe";
import { EnvironmentProvider, initEnv } from "../environments/environment.provider";
import { FormatWebBrowserPipe } from './pipes/format-web-browser.pipe';

@NgModule({
    declarations: [
        AppComponent,
        ActionBarComponent,
        SelectableCheckboxComponent,
        SelectableCheckboxMultipleComponent,
        TestCaseTableComponent,
        SymbolInputValuesComponent,
        OutputErrorTraceComponent,
        TestCaseTablePrePostStepsComponent,
        TestCaseTableSymbolColumnComponent,
        CountersViewComponent,
        CreateCounterModalComponent,
        LtsFormulaSuitesViewComponent,
        CreateLtsFormulaModalComponent,
        EditLtsFormulaModalComponent,
        LtsFormulaFormGroupsComponent,
        WebhooksViewComponent,
        CreateWebhookModalComponent,
        EditWebhookModalComponent,
        WebhookFormGroupsComponent,
        NormalizeUpperCasePipe,
        SymbolParametersPanelComponent,
        CreateSymbolParameterModalComponent,
        EditSymbolParameterModalComponent,
        SymbolParameterFormGroupsComponent,
        PromptModalComponent,
        ConfirmModalComponent,
        TestConfigListComponent,
        ProjectDetailsWidgetComponent,
        LatestTestReportWidgetComponent,
        LatestLearnerResultWidgetComponent,
        LearnerStatusWidgetComponent,
        FormatLearningAlgorithmPipe,
        FormatMillisecondsPipe,
        ProjectViewComponent,
        ProjectsViewComponent,
        CreateProjectModalComponent,
        EditProjectModalComponent,
        ImportProjectModalComponent,
        ProjectFormGroupsComponent,
        FileDropzoneComponent,
        LogoutViewComponent,
        PaginationComponent,
        FilesViewComponent,
        ProjectEnvironmentsViewComponent,
        CreateEnvironmentVariableModalComponent,
        EditEnvironmentVariableModalComponent,
        CreateProjectUrlModalComponent,
        EditProjectUrlModalComponent,
        ProjectUrlFormGroupsComponent,
        HypothesisComponent,
        DiscriminationTreeComponent,
        ObservationTableComponent,
        AdminUsersViewComponent,
        CreateUserModalComponent,
        EditUserModalComponent,
        ProfileViewComponent,
        TestTreeComponent,
        TestCaseNodeComponent,
        TestSuiteNodeComponent,
        AdminSettingsViewComponent,
        ErrorViewComponent,
        SimpleSymbolGroupTreeComponent,
        SimpleSymbolGroupTreeItemComponent,
        CreateSymbolGroupModalComponent,
        EditSymbolGroupModalComponent,
        MoveSymbolGroupModalComponent,
        SymbolFormGroupsComponent,
        CreateSymbolModalComponent,
        EditSymbolModalComponent,
        MoveSymbolsModalComponent,
        SelectSymbolModalComponent,
        SymbolUsagesModalComponent,
        SymbolsArchiveViewComponent,
        SearchFormComponent,
        SymbolSearchFormComponent,
        ExportSymbolsModalComponent,
        ImportSymbolsModalComponent,
        ReportChartsComponent,
        ReportOutputsColumnComponent,
        ExecutionResultModalComponent,
        TestReportViewComponent,
        TestReportsViewComponent,
        TestCaseResultsViewComponent,
        FormatEqOraclePipe,
        LearnerResultsViewComponent,
        LearnerResultDetailsModalComponent,
        LearnerResultListItemComponent,
        TestsViewComponent,
        TestCaseViewComponent,
        TestSuiteViewComponent,
        TestSuiteTreeComponent,
        TestConfigModalComponent,
        TestsMoveModalComponent,
        TestsImportModalComponent,
        DriverConfigFormComponent,
        LearnerResultListModalComponent,
        SeparatingWordModalComponent,
        SymbolsViewComponent,
        SymbolGroupHeaderComponent,
        SymbolsSymbolGroupTreeComponent,
        SymbolItemComponent,
        SidebarComponent,
        UserLoginFormComponent,
        UserRegistrationFormComponent,
        RootViewComponent,
        NodeFormGroupComponent,
        LearnerSetupsViewComponent,
        SymbolViewComponent,
        CreateActionModalComponent,
        EditActionModalComponent,
        LearnerResultsCompareViewComponent,
        StatisticsCompareViewComponent,
        LearnerResultPanelComponent,
        LearnerViewComponent,
        LearnerResultPanelCheckingViewComponent,
        LearnerResultPanelDefaultViewComponent,
        LearnerResultPanelTestingViewComponent,
        TestSuiteGenerationWidgetComponent,
        TestCaseGenerationWidgetComponent,
        LearnerResumeSettingsWidgetComponent,
        CounterexamplesWidgetComponent,
        EqOracleFormComponent,
        WpMethodEqOracleFormComponent,
        WMethodEqOracleFormComponent,
        RandomEqOracleFormComponent,
        CompleteEqOracleFormComponent,
        TestSuiteEqOracleFormComponent,
        HypothesisEqOracleFormComponent,
        ActionFormComponent,
        AssertCounterActionFormComponent,
        AssertVariableActionFormComponent,
        IncrementCounterActionFormComponent,
        SetCounterActionFormComponent,
        SetVariableActionFormComponent,
        SetVariableByCookieActionFormComponent,
        SetVariableByHtmlActionFormComponent,
        SetVariableByHttpResponseActionFormComponent,
        SetVariableByHttpStatusActionFormComponent,
        SetVariableByJsonActionFormComponent,
        SetVariableByNodeAttributeActionFormComponent,
        SetVariableByNodeCountActionFormComponent,
        SetVariableByRegexGroupActionFormComponent,
        CheckAttributeExistsActionFormComponent,
        CheckAttributeTypeActionFormComponent,
        CheckAttributeValueActionFormComponent,
        CheckHeaderFieldActionFormComponent,
        CheckHttpBodyActionFormComponent,
        CheckStatusActionFormComponent,
        RequestActionFormComponent,
        ValidateJsonActionFormComponent,
        AlertAcceptDismissActionFormComponent,
        AlertGetTextActionFormComponent,
        AlertSendKeysActionFormComponent,
        BrowserActionFormComponent,
        CheckForNodeActionFormComponent,
        CheckForTextActionFormComponent,
        CheckNodeAttributeValueActionFormComponent,
        CheckNodeSelectedActionFormComponent,
        CheckPageTitleActionFormComponent,
        ClearInputActionFormComponent,
        ClickActionFormComponent,
        ClickElementByTextActionFormComponent,
        ClickLinkByTextActionFormComponent,
        DragAndDropActionFormComponent,
        DragAndDropByActionFormComponent,
        ExecuteScriptActionFormComponent,
        MoveMouseActionFormComponent,
        OpenUrlActionFormComponent,
        PressKeyActionFormComponent,
        SelectActionFormComponent,
        SendKeysActionFormComponent,
        SubmitActionFormComponent,
        SwitchToActionFormComponent,
        SwitchToFrameActionFormComponent,
        UploadFileActionFormComponent,
        WaitForNodeActionFormComponent,
        WaitForNodeAttributeActionFormComponent,
        WaitForScriptActionFormComponent,
        WaitForTextActionFormComponent,
        WaitForTitleActionFormComponent,
        WaitActionFormComponent,
        ActionFormComponent,
        ActionSearchFormComponent,
        AppViewComponent,
        AboutModalComponent,
        JumpToLabelActionFormComponent,
        CreateLabelActionFormComponent,
        TestStatusComponent,
        TestReportProgressComponent,
        ProjectUsersViewComponent,
        AddUserModalComponent,
        SymbolsDataContextComponent,
        ToggleButtonComponent,
        LearnerSetupTableComponent,
        LearnerSetupsCreateViewComponent,
        LearnerSetupsEditViewComponent,
        LearnerSetupFormComponent,
        ProjectListComponent,
        LtsFormulaSuiteViewComponent,
        TreeViewComponent,
        MoveLtsFormulaModalComponent,
        LockInfoBadgeComponent,
        LockInfoListComponent,
        FetchImgSecurePipe,
        TestReportScreenshotsViewComponent,
        ViewScreenshotModalComponent,
        FormatWebBrowserPipe
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      enableHtml: true,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true
    }),
    NgbModule,
    DragulaModule.forRoot(),
    AceEditorModule,
    NgxGraphModule,
    NgxChartsModule,
    ClipboardModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedHttpInterceptor,
      multi: true
    },
    ToastService,
    AppStoreService,
    SettingsApiService,
    SymbolGroupApiService,
    SymbolParameterApiService,
    TestConfigApiService,
    TestReportApiService,
    WebhookApiService,
    CounterApiService,
    ProjectApiService,
    ProjectEnvironmentApiService,
    LearnerSetupApiService,
    LtsFormulaApiService,
    SymbolApiService,
    ClipboardService,
    UserApiService,
    LearnerResultApiService,
    LearnerApiService,
    TestApiService,
    FileApiService,
    PromptService,
    DownloadService,
    TestReportService,
    NotificationService,
    ActionService,
    EqOracleService,
    LearningAlgorithmService,
    LearnerResultChartService,
    LearnerResultDownloadService,
    ErrorViewStoreService,
    FormUtilsService,
    LtsFormulaSuiteApiService,
    ModelCheckerApiService,
    WebSocketAPIService,
    WebSocketService,
    ProjectPresenceService,
    TestPresenceService,
    SymbolPresenceService,
    ImgCacheService,
    TestResultApiService,
    EnvironmentProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: initEnv,
      deps: [EnvironmentProvider],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
