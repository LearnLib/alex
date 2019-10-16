import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpgradeModule } from '@angular/upgrade/static';

import ALEX from './app.module.ajs';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ToastService } from './services/toast.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewHeaderComponent } from './common/view-header/view-header.component';
import { ActionBarComponent } from './common/action-bar/action-bar.component';
import { DragulaModule } from 'ng2-dragula';
import { SelectableCheckboxComponent } from './common/selectable-checkbox/selectable-checkbox.component';
import { SelectableCheckboxMultipleComponent } from './common/selectable-checkbox-multiple/selectable-checkbox-multiple.component';
import { AboutViewComponent } from './views/about-view/about-view.component';
import { AppStoreService } from './services/app-store.service';
import { SettingsApiService } from './services/resources/settings-api.service';
import { TestCaseTableComponent } from './views/test-case-view/test-case-table/test-case-table.component';
import { SymbolParametersComponent } from './common/symbol-parameters/symbol-parameters.component';
import { OutputErrorTraceComponent } from './common/output-error-trace/output-error-trace.component';
import { TestCaseTablePrePostStepsComponent } from './views/test-case-view/test-case-table/test-case-table-pre-post-steps/test-case-table-pre-post-steps.component';
import { TestCaseTableSymbolColumnComponent } from './views/test-case-view/test-case-table/test-case-table-symbol-column/test-case-table-symbol-column.component';
import { SymbolGroupApiService } from './services/resources/symbol-group-api.service';
import { SymbolParameterApiService } from './services/resources/symbol-parameter-api.service';
import { TestConfigApiService } from './services/resources/test-config-api.service';
import { WebhookApiService } from './services/resources/webhook-api.service';
import { TestReportApiService } from './services/resources/test-report-api.service';
import { CounterApiService } from './services/resources/counter-api.service';
import { ProjectApiService } from './services/resources/project-api.service';
import { CountersViewComponent } from './views/counters-view/counters-view.component';
import { CreateCounterModalComponent } from './views/counters-view/create-counter-modal/create-counter-modal.component';
import { ProjectEnvironmentApiService } from './services/resources/project-environment-api.service';
import { LtsFormulaApiService } from './services/resources/lts-formula-api.service';
import { LtsFormulasViewComponent } from './views/lts-formulas-view/lts-formulas-view.component';
import { CreateLtsFormulaModalComponent } from './views/lts-formulas-view/create-lts-formula-modal/create-lts-formula-modal.component';
import { EditLtsFormulaModalComponent } from './views/lts-formulas-view/edit-lts-formula-modal/edit-lts-formula-modal.component';
import { LtsFormulaFormGroupsComponent } from './views/lts-formulas-view/lts-formula-form-groups/lts-formula-form-groups.component';
import { WebhooksViewComponent } from './views/webhooks-view/webhooks-view.component';
import { CreateWebhookModalComponent } from './views/webhooks-view/create-webhook-modal/create-webhook-modal.component';
import { EditWebhookModalComponent } from './views/webhooks-view/edit-webhook-modal/edit-webhook-modal.component';
import { WebhookFormGroupsComponent } from './views/webhooks-view/webhook-form-groups/webhook-form-groups.component';
import { NormalizeUpperCasePipe } from './pipes/normalize-upper-case.pipe';
import { SymbolApiService } from './services/resources/symbol-api.service';
import { SymbolParametersPanelComponent } from './views/symbol-view/symbol-parameters-panel/symbol-parameters-panel.component';
import { CreateSymbolParameterModalComponent } from './views/symbol-view/symbol-parameters-panel/create-symbol-parameter-modal/create-symbol-parameter-modal.component';
import { EditSymbolParameterModalComponent } from './views/symbol-view/symbol-parameters-panel/edit-symbol-parameter-modal/edit-symbol-parameter-modal.component';
import { SymbolParameterFormGroupsComponent } from './views/symbol-view/symbol-parameters-panel/symbol-parameter-form-groups/symbol-parameter-form-groups.component';
import { ClipboardService } from './services/clipboard.service';
import { UserApiService } from './services/resources/user-api.service';
import { LearnerResultApiService } from './services/resources/learner-result-api.service';
import { LearnerApiService } from './services/resources/learner-api.service';
import { TestApiService } from './services/resources/test-api.service';
import { FileApiService } from './services/resources/file-api.service';
import { PromptModalComponent } from './common/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from './common/confirm-modal/confirm-modal.component';
import { PromptService } from './services/prompt.service';
import { TestConfigListComponent } from './views/test-suite-view/test-config-list/test-config-list.component';
import { FormatWebBrowserPipe } from './pipes/format-web-browser.pipe';
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
import { AngularjsJsonInterceptor } from './angularjs-json-interceptor';
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
import { EventBus } from './services/eventbus.service';
import { LearnerResultDownloadService } from './services/learner-result-download.service';
import { TestResultReportComponent } from './views/test-suite-view/test-result-report/test-result-report.component';
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

@NgModule({
  declarations: [
    AppComponent,
    ViewHeaderComponent,
    ActionBarComponent,
    SelectableCheckboxComponent,
    SelectableCheckboxMultipleComponent,
    AboutViewComponent,
    TestCaseTableComponent,
    SymbolParametersComponent,
    OutputErrorTraceComponent,
    TestCaseTablePrePostStepsComponent,
    TestCaseTableSymbolColumnComponent,
    CountersViewComponent,
    CreateCounterModalComponent,
    LtsFormulasViewComponent,
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
    FormatWebBrowserPipe,
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
    TestResultReportComponent,
    AdminUsersViewComponent,
    CreateUserModalComponent,
    EditUserModalComponent,
    ProfileViewComponent,
    TestTreeComponent,
    TestCaseNodeComponent,
    TestSuiteNodeComponent,
    AdminSettingsViewComponent,
    ErrorViewComponent,
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
    UpgradeModule,
    NgbModule,
    DragulaModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AngularjsJsonInterceptor,
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
    EventBus,
    LearnerResultDownloadService,
    ErrorViewStoreService
  ],
  entryComponents: [
    CreateCounterModalComponent,
    CreateLtsFormulaModalComponent,
    EditLtsFormulaModalComponent,
    CreateWebhookModalComponent,
    EditWebhookModalComponent,
    CreateSymbolParameterModalComponent,
    EditSymbolParameterModalComponent,
    PromptModalComponent,
    ConfirmModalComponent,
    CreateProjectModalComponent,
    EditProjectModalComponent,
    ImportProjectModalComponent,
    CreateProjectUrlModalComponent,
    EditProjectUrlModalComponent,
    CreateEnvironmentVariableModalComponent,
    EditEnvironmentVariableModalComponent,
    CreateUserModalComponent,
    EditUserModalComponent,
    // remove when migration is done
    ViewHeaderComponent,
    ActionBarComponent,
    SelectableCheckboxComponent,
    SelectableCheckboxMultipleComponent,
    AboutViewComponent,
    TestCaseTableComponent,
    SymbolParametersComponent,
    OutputErrorTraceComponent,
    CountersViewComponent,
    LtsFormulasViewComponent,
    WebhooksViewComponent,
    SymbolParametersPanelComponent,
    TestConfigListComponent,
    LatestLearnerResultWidgetComponent,
    LatestTestReportWidgetComponent,
    LearnerStatusWidgetComponent,
    ProjectDetailsWidgetComponent,
    ProjectViewComponent,
    ProjectsViewComponent,
    FileDropzoneComponent,
    LogoutViewComponent,
    PaginationComponent,
    FilesViewComponent,
    ProjectEnvironmentsViewComponent,
    HypothesisComponent,
    DiscriminationTreeComponent,
    ObservationTableComponent,
    AdminUsersViewComponent,
    ProfileViewComponent,
    TestTreeComponent,
    AdminSettingsViewComponent
  ]
  // bootstrap: [AppComponent]
})
export class AppModule implements DoBootstrap {
  constructor(private upgrade: UpgradeModule) {
  }

  ngDoBootstrap(app: ApplicationRef) {
    this.upgrade.bootstrap(document.body, [ALEX], { strictDi: false });
  }
}
