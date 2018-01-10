/*
 * Copyright 2016 TU Dortmund
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
import ngAnimate from 'angular-animate';
import angularDragula from 'angular-dragula';
import angularJwt from 'angular-jwt';
import ngMessages from 'angular-messages';
import toastr from 'angular-toastr';
import uiBootstrap from 'angular-ui-bootstrap';
import ngFileUpload from 'ng-file-upload';
import {actionSearchForm} from './components/acionSearchForm';
import {actionBar} from './components/actionBar';
import {actionRecorderComponent} from './components/actionRecorder';
import {alex} from './components/alex';
import {checkbox, checkboxMultiple} from './components/checkbox';
import {discriminationTree} from './components/discriminationTree';
import {fileDropzone} from './components/fileDropzone';
import {actionForm} from './components/forms/actions/actionForm';
import {
    actionFormAssertCounter, actionFormAssertVariable, actionFormIncrementCounter, actionFormSetCounter,
    actionFormSetVariable, actionFormSetVariableByCookie, actionFormSetVariableByHtml, actionFormSetVariableByJson,
    actionFormSetVariableByNodeAttribute, actionFormSetVariableByNodeCount, actionFormSetVariableByRegexGroup,
    actionFormWait
} from './components/forms/actions/generalActionForms';
import {
    actionFormCall, actionFormCheckAttributeExists, actionFormCheckAttributeType, actionFormCheckAttributeValue,
    actionFormCheckHeaderField, actionFormCheckHttpBody, actionFormCheckStatus, actionFormValidateJson
} from './components/forms/actions/restActionForms';
import {
    actionFormAlertAcceptDismiss, actionFormAlertGetText, actionFormAlertSendKeys, actionFormCheckForNode,
    actionFormCheckForText, actionFormCheckNodeAttributeValue, actionFormCheckPageTitle, actionFormClearInput,
    actionFormClick, actionFormClickLinkByText, actionFormExecuteScript, actionFormMoveMouse, actionFormOpen,
    actionFormPressKey, actionFormSelect, actionFormSendKeys, actionFormSubmit, actionFormSwitchTo,
    actionFormSwitchToFrame, actionFormWaitForNode, actionFormWaitForNodeAttribute, actionFormWaitForText,
    actionFormWaitForTitle
} from './components/forms/actions/webActionForms';
import {browserConfigForm} from './components/forms/browserConfigForm';
import {nodeFormGroup} from './components/forms/nodeFormGroup';
import {projectFormGroups} from './components/forms/project-form-groups';
import {projectCreateForm} from './components/forms/projectCreateForm';
import {symbolEditFormComponent} from './components/forms/symbolEditForm';
import {userEditForm} from './components/forms/userEditForm';
import {userLoginForm} from './components/forms/userLoginForm';
import {htmlElementPicker} from './components/htmlElementPicker';
import {hypothesis} from './components/hypothesis';
import {learnResultListItem} from './components/learnResultListItem';
import {learnResultPanel} from './components/learnResultPanel';
import {loadScreen} from './components/loadScreen';
import {actionCreateModalComponent, actionCreateModalHandle} from './components/modals/actionCreateModal';
import {actionEditModalComponent, actionEditModalHandle} from './components/modals/actionEditModal';
import {actionRecorderActionsModal} from './components/modals/actionRecorderActionsModal';
import {browserConfigModal} from './components/modals/browserConfigModal';
import {confirmModalComponent} from './components/modals/confirmModal';
import {counterCreateModal} from './components/modals/counterCreateModal';
import {
    hypothesisLayoutSettingsModalComponent,
    hypothesisLayoutSettingsModalHandle
} from './components/modals/hypothesisLayoutSettingsModal';
import {
    learnerResultDetailsModalComponent,
    learnerResultDetailsModalHandle
} from './components/modals/learnerResultDetailsModal';
import {
    learnerSetupSettingsModalComponent,
    learnerSetupSettingsModalHandle
} from './components/modals/learnerSetupSettingsModal';
import {projectEditModalComponent, projectEditModalHandle} from './components/modals/projectEditModal';
import {promptModalComponent} from './components/modals/promptModal';
import {resultListModalComponent, resultListModalHandle} from './components/modals/resultListModal';
import {symbolCreateModalComponent, symbolCreateModalHandle} from './components/modals/symbolCreateModal';
import {symbolEditModalComponent, symbolEditModalHandle} from './components/modals/symbolEditModal';
import {
    symbolGroupCreateModalComponent,
    symbolGroupCreateModalHandle
} from './components/modals/symbolGroupCreateModal';
import {symbolGroupEditModalComponent, symbolGroupEditModalHandle} from './components/modals/symbolGroupEditModal';
import {symbolMoveModalComponent, symbolMoveModalHandle} from './components/modals/symbolMoveModal';
import {symbolsImportModalComponent, symbolsImportModalHandle} from './components/modals/symbolsImportModal';
import {testsImportModal} from './components/modals/testsImportModal';
import {userEditModalComponent, userEditModalHandle} from './components/modals/userEditModal';
import {observationTable} from './components/observationTable';
import {projectList} from './components/projectList';
import {responsiveIframe} from './components/responsiveIframe';
import {sidebar} from './components/sidebar';
import {symbolGroupListItem} from './components/symbolGroupListItem';
import {symbolListItem} from './components/symbolListItem';
import {testResultReport} from './components/testResultReport';
import {testCaseNode, testSuiteNode, testTree} from './components/testTree';
import {viewHeader} from './components/viewHeader';
import {aboutView} from './components/views/aboutView';
import {adminSettingsView} from './components/views/adminSettingsView';
import {adminUsersView} from './components/views/adminUsersView';
import {countersView} from './components/views/countersView';
import {errorView} from './components/views/errorView';
import {filesView} from './components/views/filesView';
import {homeView} from './components/views/homeView';
import {learnerSetupView} from './components/views/learnerSetupView';
import {learnerView} from './components/views/learnerView';
import {projectsDashboardView} from './components/views/projectsDashboardView';
import {projectsView} from './components/views/projectsView';
import {resultsCompareView} from './components/views/resultsCompareView';
import {resultsView} from './components/views/resultsView';
import {statisticsCompareView} from './components/views/statisticsCompareView';
import {symbolsActionsView} from './components/views/symbolsActionsView';
import {symbolsTrashView} from './components/views/symbolsTrashView';
import {symbolsView} from './components/views/symbolsView';
import {testCaseView} from './components/views/testCaseView';
import {testSuiteView} from './components/views/testSuiteView';
import {testsView} from './components/views/testsView';
import {usersSettingsView} from './components/views/usersSettingsView';
import {counterexamplesWidget} from './components/widgets/counterexamplesWidget';
import {latestLearnResultWidget} from './components/widgets/latestLearnResultWidget';
import {learnerStatusWidget} from './components/widgets/learnerStatusWidget';
import {learnResumeSettingsWidget} from './components/widgets/learnResumeSettingsWidget';
import {projectDetailsWidget} from './components/widgets/projectDetailsWidget';
import {widget} from './components/widgets/widget';
import * as config from './config';
import * as constant from './constants';
import {
    formatAlgorithm, formatEqOracle, formatMilliseconds, formatUserRole, formatWebBrowser,
    sortTests
} from './filters';
import {CounterResource} from './resources/CounterResource';
import {FileResource} from './resources/FileResource';
import {LearnerResource} from './resources/LearnerResource';
import {LearnResultResource} from './resources/LearnResultResource';
import {ProjectResource} from './resources/ProjectResource';
import {SettingsResource} from './resources/SettingsResource';
import {SymbolGroupResource} from './resources/SymbolGroupResource';
import {SymbolResource} from './resources/SymbolResource';
import {TestResource} from './resources/TestResource';
import {UserResource} from './resources/UserResource';
import * as routes from './routes';
import {ActionRecorderService} from './services/ActionRecorderService';
import {ActionService} from './services/ActionService';
import {ClipboardService} from './services/ClipboardService';
import {DownloadService} from './services/DownloadService';
import {EqOracleService} from './services/EqOracleService';
import {ErrorService} from './services/ErrorService';
import {EventBus} from './services/EventBus';
import {HtmlElementPickerService} from './services/HtmlElementPickerService';
import {LearnerResultChartService} from './services/LearnerResultChartService';
import {LearnerResultDownloadService} from './services/LearnerResultDownloadService';
import {LearningAlgorithmService} from './services/LearningAlgorithmService';
import {PromptService} from './services/PromptService';
import {SessionService} from './services/SessionService';
import {TestService} from './services/TestService';
import {ToastService} from './services/ToastService';

const env = {};
if (window) {
    Object.assign(env, window.__env);
}

angular
    .module('ALEX', [

        // modules from external libraries
        ngAnimate,
        ngMessages,
        uiBootstrap,
        uiRouter,
        'ui.ace',
        'n3-line-chart',
        'selectionModel',
        toastr,
        angularJwt,
        ngFileUpload,
        angularDragula(angular),

        'ALEX.templates'
    ])
    .constant('__env', env)

    .config(config.config)
    .config(routes.config)
    .run(routes.run)

    // constants
    .constant('learnAlgorithm', constant.learnAlgorithm)
    .constant('webBrowser', constant.webBrowser)
    .constant('eqOracleType', constant.eqOracleType)
    .constant('events', constant.events)
    .constant('actionType', constant.actionType)

    // filters
    .filter('formatEqOracle', formatEqOracle)
    .filter('formatAlgorithm', formatAlgorithm)
    .filter('formatMilliseconds', formatMilliseconds)
    .filter('formatUserRole', formatUserRole)
    .filter('formatWebBrowser', formatWebBrowser)
    .filter('sortTests', sortTests)

    // resources
    .service('CounterResource', CounterResource)
    .service('FileResource', FileResource)
    .service('LearnerResource', LearnerResource)
    .service('LearnResultResource', LearnResultResource)
    .service('ProjectResource', ProjectResource)
    .service('SettingsResource', SettingsResource)
    .service('SymbolGroupResource', SymbolGroupResource)
    .service('SymbolResource', SymbolResource)
    .service('UserResource', UserResource)
    .service('TestResource', TestResource)

    // services
    .service('ActionService', ActionService)
    .service('ClipboardService', ClipboardService)
    .service('ErrorService', ErrorService)
    .service('EventBus', EventBus)
    .service('EqOracleService', EqOracleService)
    .service('LearningAlgorithmService', LearningAlgorithmService)
    .service('DownloadService', DownloadService)
    .service('LearnerResultChartService', LearnerResultChartService)
    .service('PromptService', PromptService)
    .service('SessionService', SessionService)
    .service('ToastService', ToastService)
    .service('LearnerResultDownloadService', LearnerResultDownloadService)
    .service('HtmlElementPickerService', HtmlElementPickerService)
    .service('ActionRecorderService', ActionRecorderService)
    .service('TestService', TestService)

    // modals
    .directive('actionCreateModalHandle', actionCreateModalHandle)
    .component('actionCreateModal', actionCreateModalComponent)
    .component('actionRecorderActionsModal', actionRecorderActionsModal)
    .directive('actionEditModalHandle', actionEditModalHandle)
    .component('actionEditModal', actionEditModalComponent)
    .component('counterCreateModal', counterCreateModal)
    .directive('hypothesisLayoutSettingsModalHandle', hypothesisLayoutSettingsModalHandle)
    .component('hypothesisLayoutSettingsModal', hypothesisLayoutSettingsModalComponent)
    .directive('learnerResultDetailsModalHandle', learnerResultDetailsModalHandle)
    .component('learnerResultDetailsModal', learnerResultDetailsModalComponent)
    .directive('learnerSetupSettingsModalHandle', learnerSetupSettingsModalHandle)
    .component('learnerSetupSettingsModal', learnerSetupSettingsModalComponent)
    .directive('projectEditModalHandle', projectEditModalHandle)
    .component('projectEditModal', projectEditModalComponent)
    .directive('symbolCreateModalHandle', symbolCreateModalHandle)
    .component('symbolCreateModal', symbolCreateModalComponent)
    .directive('symbolEditModalHandle', symbolEditModalHandle)
    .component('symbolEditModal', symbolEditModalComponent)
    .directive('symbolGroupCreateModalHandle', symbolGroupCreateModalHandle)
    .component('symbolGroupCreateModal', symbolGroupCreateModalComponent)
    .directive('symbolGroupEditModalHandle', symbolGroupEditModalHandle)
    .component('symbolGroupEditModal', symbolGroupEditModalComponent)
    .directive('symbolMoveModalHandle', symbolMoveModalHandle)
    .component('symbolMoveModal', symbolMoveModalComponent)
    .directive('userEditModalHandle', userEditModalHandle)
    .component('userEditModal', userEditModalComponent)
    .directive('resultListModalHandle', resultListModalHandle)
    .component('resultListModal', resultListModalComponent)
    .directive('symbolsImportModalHandle', symbolsImportModalHandle)
    .component('symbolsImportModal', symbolsImportModalComponent)
    .component('promptModal', promptModalComponent)
    .component('confirmModal', confirmModalComponent)
    .component('browserConfigModal', browserConfigModal)
    .component('testsImportModal', testsImportModal)

    // view components
    .component('aboutView', aboutView)
    .component('adminSettingsView', adminSettingsView)
    .component('adminUsersView', adminUsersView)
    .component('countersView', countersView)
    .component('errorView', errorView)
    .component('filesView', filesView)
    .component('homeView', homeView)
    .component('learnerSetupView', learnerSetupView)
    .component('learnerView', learnerView)
    .component('projectsView', projectsView)
    .component('projectsDashboardView', projectsDashboardView)
    .component('resultsCompareView', resultsCompareView)
    .component('resultsView', resultsView)
    .component('statisticsCompareView', statisticsCompareView)
    .component('symbolsActionsView', symbolsActionsView)
    .component('symbolsView', symbolsView)
    .component('testsView', testsView)
    .component('symbolsTrashView', symbolsTrashView)
    .component('usersSettingsView', usersSettingsView)
    .component('testCaseView', testCaseView)
    .component('testSuiteView', testSuiteView)

    // forms components
    .component('actionForm', actionForm)
    .component('projectCreateForm', projectCreateForm)
    .component('projectFormGroups', projectFormGroups)
    .component('userEditForm', userEditForm)
    .component('userLoginForm', userLoginForm)
    .component('nodeFormGroup', nodeFormGroup)
    .component('browserConfigForm', browserConfigForm)
    .component('symbolEditForm', symbolEditFormComponent)
    .component('actionSearchForm', actionSearchForm)

    // widgets components
    .component('widget', widget)
    .component('counterexamplesWidget', counterexamplesWidget)
    .component('learnResumeSettingsWidget', learnResumeSettingsWidget)
    .component('learnerStatusWidget', learnerStatusWidget)
    .component('latestLearnResultWidget', latestLearnResultWidget)
    .component('projectDetailsWidget', projectDetailsWidget)

    // web action forms
    .component('actionFormAlertAcceptDismiss', actionFormAlertAcceptDismiss)
    .component('actionFormAlertGetText', actionFormAlertGetText)
    .component('actionFormAlertSendKeys', actionFormAlertSendKeys)
    .component('actionFormCheckNodeAttributeValue', actionFormCheckNodeAttributeValue)
    .component('actionFormCheckForNode', actionFormCheckForNode)
    .component('actionFormCheckForText', actionFormCheckForText)
    .component('actionFormCheckPageTitle', actionFormCheckPageTitle)
    .component('actionFormClearInput', actionFormClearInput)
    .component('actionFormClick', actionFormClick)
    .component('actionFormClickLinkByText', actionFormClickLinkByText)
    .component('actionFormExecuteScript', actionFormExecuteScript)
    .component('actionFormMoveMouse', actionFormMoveMouse)
    .component('actionFormOpen', actionFormOpen)
    .component('actionFormSelect', actionFormSelect)
    .component('actionFormSendKeys', actionFormSendKeys)
    .component('actionFormSubmit', actionFormSubmit)
    .component('actionFormSwitchTo', actionFormSwitchTo)
    .component('actionFormSwitchToFrame', actionFormSwitchToFrame)
    .component('actionFormWaitForNode', actionFormWaitForNode)
    .component('actionFormWaitForTitle', actionFormWaitForTitle)
    .component('actionFormWaitForText', actionFormWaitForText)
    .component('actionFormPressKey', actionFormPressKey)
    .component('actionFormWaitForNodeAttribute', actionFormWaitForNodeAttribute)

    // rest action forms
    .component('actionFormCall', actionFormCall)
    .component('actionFormCheckAttributeExists', actionFormCheckAttributeExists)
    .component('actionFormCheckAttributeType', actionFormCheckAttributeType)
    .component('actionFormCheckAttributeValue', actionFormCheckAttributeValue)
    .component('actionFormCheckHeaderField', actionFormCheckHeaderField)
    .component('actionFormCheckHttpBody', actionFormCheckHttpBody)
    .component('actionFormCheckStatus', actionFormCheckStatus)
    .component('actionFormValidateJson', actionFormValidateJson)

    // general action forms
    .component('actionFormAssertCounter', actionFormAssertCounter)
    .component('actionFormAssertVariable', actionFormAssertVariable)
    .component('actionFormIncrementCounter', actionFormIncrementCounter)
    .component('actionFormSetCounter', actionFormSetCounter)
    .component('actionFormSetVariable', actionFormSetVariable)
    .component('actionFormSetVariableByCookie', actionFormSetVariableByCookie)
    .component('actionFormSetVariableByHtml', actionFormSetVariableByHtml)
    .component('actionFormSetVariableByJson', actionFormSetVariableByJson)
    .component('actionFormSetVariableByNodeAttribute', actionFormSetVariableByNodeAttribute)
    .component('actionFormSetVariableByNodeCount', actionFormSetVariableByNodeCount)
    .component('actionFormSetVariableByRegexGroup', actionFormSetVariableByRegexGroup)
    .component('actionFormWait', actionFormWait)

    // misc components
    .component('alex', alex)
    .component('actionBar', actionBar)
    .component('checkbox', checkbox)
    .component('hypothesis', hypothesis)
    .component('discriminationTree', discriminationTree)
    .component('checkboxMultiple', checkboxMultiple)
    .component('fileDropzone', fileDropzone)
    .component('loadScreen', loadScreen)
    .component('projectList', projectList)
    .component('sidebar', sidebar)
    .component('responsiveIframe', responsiveIframe)
    .component('viewHeader', viewHeader)
    .component('htmlElementPicker', htmlElementPicker)
    .component('actionRecorder', actionRecorderComponent)
    .component('learnResultPanel', learnResultPanel)
    .component('observationTable', observationTable)
    .component('symbolListItem', symbolListItem)
    .component('symbolGroupListItem', symbolGroupListItem)
    .component('learnResultListItem', learnResultListItem)
    .component('testResultReport', testResultReport)
    .component('testTree', testTree)
    .component('testCaseNode', testCaseNode)
    .component('testSuiteNode', testSuiteNode);

angular.bootstrap(document, ['ALEX']);
