/*
 * Copyright 2018 TU Dortmund
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

/**
 * Define application routes.
 */
// @ngInject
export function config($stateProvider, $urlRouterProvider) {

  // redirect to the start page when no other route fits
  $urlRouterProvider.otherwise($injector => {
    const $state = $injector.get('$state');
    $state.go('root');
  });

  $stateProvider
    .state('root', {
      url: '',
      template: '<root-view></root-view>',
      data: {title: 'Automata Learning EXperience'}
    })

    .state('redirect', {
      parent: 'root',
      url: '/redirect?to',
      views: {
        '@': {template: '<redirect-view></redirect-view>'}
      },
      params: {
        to: null
      },
      data: {title: 'Redirect'}
    })

    // user profile
    .state('profile', {
      parent: 'root',
      url: '/profile',
      views: {
        '@': {template: '<profile-view></profile-view>'}
      },
      data: {requiresProject: false, roles: ['REGISTERED', 'ADMIN'], title: 'Profile'}
    })

    // admin related routes
    .state('admin', {
      parent: 'root',
      url: '/admin',
      abstract: true,
      redirectTo: 'adminSettings',
      data: {requiresProject: false, roles: ['ADMIN']}
    })
    .state('adminSettings', {
      parent: 'admin',
      url: '/settings',
      views: {
        '@': {template: '<admin-settings-view></admin-settings-view>'}
      },
      data: {title: 'Application Settings'}
    })
    .state('adminUsers', {
      parent: 'admin',
      url: '/users',
      views: {
        '@': {template: '<admin-users-view></admin-users-view>'}
      },
      data: {title: 'User Management'}
    })

    // project related routes
    .state('projects', {
      parent: 'root',
      url: '/projects',
      views: {
        '@': {template: '<projects-view></projects-view>'}
      },
      data: {requiresProject: false, roles: ['REGISTERED', 'ADMIN'], title: 'Projects'},
    })
    .state('project', {
      parent: 'projects',
      url: '/{projectId:int}',
      views: {
        '@': {template: '<project-view></project-view>'}
      },
      data: {title: 'Project'},

      // @ngInject
      onEnter: function ($state, ProjectService, ProjectResource, $stateParams) {
        const projectId = $stateParams.projectId;
        const project = ProjectService.store.currentProject;

        if (project == null || project.id !== projectId) {
          return ProjectResource.get(projectId)
            .then(project => {
              ProjectService.open(project);
            })
            .catch(() => {
              $state.go('error', {message: `The project with the id ${projectId} could not be found`});
            });
        }
      }
    })

    // symbol related routes
    .state('symbols', {
      parent: 'project',
      url: '/symbols',
      views: {
        '@': {template: '<symbols-view></symbols-view>'}
      },
      data: {title: 'Symbols'}
    })
    .state('symbol', {
      parent: 'symbols',
      url: '/{symbolId:int}',
      views: {
        '@': {template: '<symbol-view></symbol-view>'}
      },
      data: {title: 'Symbols > Symbol'}
    })
    .state('symbolsArchive', {
      parent: 'symbols',
      url: '/archive',
      views: {
        '@': {template: '<symbols-archive-view></symbols-archive-view>'}
      },
      data: {title: 'Symbols > Archive'}
    })

    // files
    .state('files', {
      parent: 'project',
      url: '/files',
      views: {
        '@': {template: '<files-view></files-view>'}
      },
      data: {title: 'Files'}
    })

    // counters
    .state('counters', {
      parent: 'project',
      url: '/counters',
      views: {
        '@': {template: '<counters-view></counters-view>'}
      },
      data: {title: 'Counters'}
    })

    // lts formulas
    .state('ltsFormulas', {
      parent: 'project',
      url: '/lts-formulas',
      views: {
        '@': {template: '<lts-formulas-view></lts-formulas-view>'}
      },
      data: {title: 'Lts Formulas'}
    })

    // testing related routes
    .state('tests', {
      parent: 'project',
      url: '/tests',
      abstract: true,
      redirectTo: 'test'
    })
    .state('test', {
      parent: 'tests',
      url: '/{testId:int}',
      views: {
        '@': {template: '<tests-view></tests-view>'}
      },
      data: {title: 'Tests'},
      params: {
        testId: 0
      }
    })
    .state('testReports', {
      parent: 'tests',
      url: '/reports',
      views: {
        '@': {template: '<test-reports-view></test-reports-view>'}
      },
      data: {title: 'Tests > Reports'}
    })
    .state('testReport', {
      parent: 'testReports',
      url: '/{reportId:int}',
      views: {
        '@': {template: '<test-report-view></test-report-view>'}
      },
      data: {title: 'Tests > Reports'}
    })
    .state('testResults', {
      parent: 'test',
      url: '/results',
      views: {
        '@': {template: '<test-case-results-view></test-case-results-view>'}
      },
      data: {title: 'Tests > Results'},
    })

    // learning related routes
    .state('learner', {
      parent: 'project',
      url: '/learner',
      abstract: true,
      redirectTo: 'learnerSetup'
    })
    .state('learnerSetup', {
      parent: 'learner',
      url: '/setup',
      views: {
        '@': {template: '<learner-setup-view></learner-setup-view>'}
      },
      data: {title: 'Learner > Setup'}
    })
    .state('learnerStart', {
      parent: 'learner',
      url: '/learn',
      views: {
        '@': {template: '<learner-view></learner-view>'}
      },
      data: {title: 'Learning'},
      params: {result: null}
    })
    .state('learnerResults', {
      parent: 'learner',
      url: '/results',
      views: {
        '@': {template: '<results-view></results-view>'}
      },
      data: {title: 'Results'}
    })
    .state('learnerResultsCompare', {
      parent: 'learnerResults',
      url: '/{testNos:string}',
      views: {
        '@': {template: '<results-compare-view></results-compare-view>'}
      },
      data: {title: 'Results'}
    })
    .state('learnerResultsStatistics', {
      parent: 'learnerResults',
      url: '/statistics/{testNos:string}',
      views: {
        '@': {template: '<statistics-compare-view></statistics-compare-view>'}
      },
      data: {title: 'Statistics > Compare'}
    })

    // integrations related routes
    .state('integrations', {
      parent: 'root',
      url: '/integrations',
      abstract: true,
      data: {requiresProject: false, roles: ['REGISTERED', 'ADMIN'], title: 'Integrations'},
    })
    .state('webhooks', {
      parent: 'integrations',
      url: '/webhooks',
      views: {
        '@': {template: '<webhooks-view></webhooks-view>'}
      },
    })

    // misc routes
    .state('about', {
      parent: 'root',
      url: '/about',
      views: {
        '@': {template: '<about-view></about-view>'}
      },
      data: {title: 'About'}
    })
    .state('error', {
      parent: 'root',
      url: '/error',
      views: {
        '@': {template: '<error-view></error-view>'}
      },
      params: {
        message: null,
      },
      data: {title: 'Error'}
    });
}

/**
 * Validate routes on state change.
 *
 * @param {TransitionService} $transitions
 * @param {ProjectService} ProjectService
 * @param {UserService} UserService
 * @param {ToastService} ToastService
 */
// @ngInject
export function run($transitions, ProjectService, UserService, ToastService) {

  // route validation
  $transitions.onBefore({}, onBefore, {});
  $transitions.onSuccess({}, onSuccess, {});

  function onBefore(transition) {
    const user = UserService.store.currentUser;
    const project = ProjectService.store.currentProject;

    const data = transition.to().data;
    if ((data.roles && (user === null || data.roles.indexOf(user.role) === -1))
      || (data.requiresProject && project === null)) {

      ToastService.danger('You cannot access this page!');
      return transition.router.stateService.target('root');
    }
  }

  function onSuccess(transition) {
    document.querySelector('title').innerHTML = 'ALEX | ' + transition.to().data.title;
  }
}
