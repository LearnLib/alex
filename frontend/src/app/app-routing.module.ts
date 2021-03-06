import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutViewComponent } from './views/logout-view/logout-view.component';
import { RootViewComponent } from './views/root-view/root-view.component';
import { ProjectsViewComponent } from './views/projects-view/projects-view.component';
import { ProjectViewComponent } from './views/project-view/project-view.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';
import { AdminSettingsViewComponent } from './views/admin-settings-view/admin-settings-view.component';
import { AdminUsersViewComponent } from './views/admin-users-view/admin-users-view.component';
import { WebhooksViewComponent } from './views/webhooks-view/webhooks-view.component';
import { CountersViewComponent } from './views/counters-view/counters-view.component';
import { FilesViewComponent } from './views/files-view/files-view.component';
import { ProjectEnvironmentsViewComponent } from './views/project-environments-view/project-environments-view.component';
import { SymbolsViewComponent } from './views/symbols-view/symbols-view.component';
import { SymbolsArchiveViewComponent } from './views/symbols-archive-view/symbols-archive-view.component';
import { AuthGuard } from './guards/AuthGuard';
import { ProjectGuard } from './guards/ProjectGuard';
import { LtsFormulaSuitesViewComponent } from './views/lts-formula-suites-view/lts-formula-suites-view.component';
import { LearnerResultsViewComponent } from './views/learner-results-view/learner-results-view.component';
import { LearnerSetupsViewComponent } from './views/learner-setups-view/learner-setups-view.component';
import { SymbolViewComponent } from './views/symbol-view/symbol-view.component';
import { TestsViewComponent } from './views/tests-view/tests-view.component';
import { TestReportsViewComponent } from './views/test-reports-view/test-reports-view.component';
import { AppViewComponent } from './views/app-view/app-view.component';
import { LearnerResultsCompareViewComponent } from './views/learner-results-compare-view/learner-results-compare-view.component';
import { TestReportViewComponent } from './views/test-report-view/test-report-view.component';
import { TestCaseResultsViewComponent } from './views/test-case-results-view/test-case-results-view.component';
import { LearnerViewComponent } from './views/learner-view/learner-view.component';
import { ErrorViewComponent } from './views/error-view/error-view.component';
import { StatisticsCompareViewComponent } from './views/statistics-compare-view/statistics-compare-view.component';
import { ProjectUsersViewComponent } from './views/project-users-view/project-users-view.component';
import { ProjectOwnerGuard } from './guards/ProjectOwnerGuard';
import { LearnerSetupsCreateViewComponent } from './views/learner-setups-create-view/learner-setups-create-view.component';
import { LearnerSetupsEditViewComponent } from './views/learner-setups-edit-view/learner-setups-edit-view.component';
import { LtsFormulaSuiteViewComponent } from './views/lts-formula-suite-view/lts-formula-suite-view.component';
import { TestGuard } from './guards/TestGuard';
import { SymbolGuard } from './guards/SymbolGuard';
import { TestReportScreenshotsViewComponent } from './views/test-report-screenshots-view/test-report-screenshots-view.component';
import { ModelCheckingResultsViewComponent } from './views/model-checking-results-view/model-checking-results-view.component';
import { TestConfigsViewComponent } from './views/test-configs-view/test-configs-view.component';
import { TestConfigsCreateViewComponent } from './views/test-configs-create-view/test-configs-create-view.component';
import { TestConfigsEditViewComponent } from './views/test-configs-edit-view/test-configs-edit-view.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: RootViewComponent
  },
  {
    path: 'logout',
    component: LogoutViewComponent
  },
  {
    path: 'error',
    component: ErrorViewComponent
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: AppViewComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'projects'
      },
      {
        path: 'profile',
        component: ProfileViewComponent
      },
      {
        path: 'admin',
        children: [
          {
            path: 'settings',
            component: AdminSettingsViewComponent
          },
          {
            path: 'users',
            component: AdminUsersViewComponent
          }
        ]
      },
      {
        path: 'integrations',
        children: [
          {
            path: 'webhooks',
            component: WebhooksViewComponent
          }
        ]
      },
      {
        path: 'projects',
        children: [
          {
            path: '',
            component: ProjectsViewComponent
          },
          {
            path: ':projectId',
            canActivate: [ProjectGuard],
            canActivateChild: [ProjectGuard],
            children: [
              {
                path: '',
                component: ProjectViewComponent,
                pathMatch: 'full'
              },
              {
                path: 'counters',
                component: CountersViewComponent
              },
              {
                path: 'files',
                component: FilesViewComponent
              },
              {
                path: 'environments',
                canActivate: [ProjectOwnerGuard],
                component: ProjectEnvironmentsViewComponent
              },
              {
                path: 'lts-formula-suites',
                children: [
                  {
                    path: '',
                    component: LtsFormulaSuitesViewComponent,
                    pathMatch: 'full'
                  },
                  {
                    path: ':suiteId',
                    component: LtsFormulaSuiteViewComponent
                  }
                ]
              },
              {
                path: 'learner',
                children: [
                  {
                    path: '',
                    component: LearnerViewComponent,
                    pathMatch: 'full'
                  },
                  {
                    path: 'setups',
                    children: [
                      {
                        path: '',
                        component: LearnerSetupsViewComponent,
                        pathMatch: 'full'
                      },
                      {
                        path: 'new',
                        component: LearnerSetupsCreateViewComponent
                      },
                      {
                        path: ':setupId',
                        component: LearnerSetupsEditViewComponent
                      }
                    ]
                  },
                  {
                    path: 'results',
                    children: [
                      {
                        path: '',
                        component: LearnerResultsViewComponent
                      },
                      {
                        path: ':resultIds',
                        children: [
                          {
                            path: '',
                            component: LearnerResultsCompareViewComponent,
                            pathMatch: 'full'
                          },
                          {
                            path: 'model-checking-results',
                            component: ModelCheckingResultsViewComponent
                          }
                        ]
                      }
                    ]
                  },
                  {
                    path: 'statistics/:testNos',
                    component: StatisticsCompareViewComponent
                  }
                ]
              },
              {
                path: 'symbols',
                children: [
                  {
                    path: '',
                    component: SymbolsViewComponent,
                    pathMatch: 'full'
                  },
                  {
                    path: 'archive',
                    component: SymbolsArchiveViewComponent,
                    pathMatch: 'full'
                  },
                  {
                    path: ':symbolId',
                    canActivate: [SymbolGuard],
                    component: SymbolViewComponent
                  }
                ]
              },
              {
                path: 'tests',
                children: [
                  {
                    path: '',
                    component: TestsViewComponent
                  },
                  {
                    path: 'configs',
                    children: [
                      {
                        path: '',
                        component: TestConfigsViewComponent,
                        pathMatch: 'full'
                      },
                      {
                        path: 'new',
                        component: TestConfigsCreateViewComponent
                      },
                      {
                        path: ':configId',
                        component: TestConfigsEditViewComponent
                      }
                    ]
                  },
                  {
                    path: 'reports',
                    children: [
                      {
                        path: '',
                        component: TestReportsViewComponent,
                        pathMatch: 'full'
                      },
                      {
                        path: ':reportId',
                        children: [
                          {
                            path: '',
                            component: TestReportViewComponent,
                            pathMatch: 'full'
                          },
                          {
                            path: 'results',
                            children: [
                              {
                                path: ':resultId',
                                component: TestReportScreenshotsViewComponent
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    path: ':testId',
                    canActivate: [TestGuard],
                    canActivateChild: [TestGuard],
                    children: [
                      {
                        path: '',
                        component: TestsViewComponent,
                        pathMatch: 'full'
                      },
                      {
                        path: 'results',
                        component: TestCaseResultsViewComponent
                      }
                    ]
                  }
                ]
              },
              {
                path: 'users',
                canActivate: [ProjectOwnerGuard],
                component: ProjectUsersViewComponent
              }

            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
