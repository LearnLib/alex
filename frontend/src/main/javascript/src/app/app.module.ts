import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpgradeModule } from '@angular/upgrade/static';

import ALEX from './app.module.ajs';
import { HttpClientModule } from '@angular/common/http';
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
    NormalizeUpperCasePipe
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
    LtsFormulaApiService
  ],
  entryComponents: [
    CreateCounterModalComponent,
    CreateLtsFormulaModalComponent,
    EditLtsFormulaModalComponent,
    CreateWebhookModalComponent,
    EditWebhookModalComponent,
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
    WebhooksViewComponent
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
