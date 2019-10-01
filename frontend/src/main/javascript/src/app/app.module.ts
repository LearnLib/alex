import { BrowserModule } from '@angular/platform-browser';
import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpgradeModule } from '@angular/upgrade/static';

import ALEX from './app.module.ajs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
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
    CreateCounterModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
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
    ProjectApiService
  ],
  entryComponents: [
    CreateCounterModalComponent,
    // remove when migration is done
    ViewHeaderComponent,
    ActionBarComponent,
    SelectableCheckboxComponent,
    SelectableCheckboxMultipleComponent,
    AboutViewComponent,
    TestCaseTableComponent,
    SymbolParametersComponent,
    OutputErrorTraceComponent,
    CountersViewComponent
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
