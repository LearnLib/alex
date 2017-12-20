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

import angularDragula from "angular-dragula";
import ngFileUpload from "ng-file-upload";
import angularJwt from "angular-jwt";
import uiBootstrap from "angular-ui-bootstrap";
import uiRouter from "@uirouter/angularjs";
import toastr from "angular-toastr";
import ngAnimate from "angular-animate";
import ngMessages from "angular-messages";
import * as config from "./config";
import * as routes from "./routes";
import * as constant from "./constants";
import {CounterResource} from "./resources/CounterResource";
import {FileResource} from "./resources/FileResource";
import {LearnerResource} from "./resources/LearnerResource";
import {LearnResultResource} from "./resources/LearnResultResource";
import {ProjectResource} from "./resources/ProjectResource";
import {SettingsResource} from "./resources/SettingsResource";
import {SymbolGroupResource} from "./resources/SymbolGroupResource";
import {SymbolResource} from "./resources/SymbolResource";
import {UserResource} from "./resources/UserResource";
import {ActionService} from "./services/ActionService";
import {ClipboardService} from "./services/ClipboardService";
import {TestResource} from "./resources/TestResource";
import {ErrorService} from "./services/ErrorService";
import {EventBus} from "./services/EventBus";
import {EqOracleService} from "./services/EqOracleService";
import {LearningAlgorithmService} from "./services/LearningAlgorithmService";
import {DownloadService} from "./services/DownloadService";
import {LearnerResultChartService} from "./services/LearnerResultChartService";
import {PromptService} from "./services/PromptService";
import {SessionService} from "./services/SessionService";
import {ToastService} from "./services/ToastService";
import {LearnerResultDownloadService} from "./services/LearnerResultDownloadService";
import {HtmlElementPickerService} from "./services/HtmlElementPickerService";
import {formatAlgorithm, formatEqOracle, formatMilliseconds, formatUserRole, formatWebBrowser, sortTests} from "./filters";
import {actionCreateModalHandle, actionCreateModalComponent} from "./components/modals/actionCreateModal";
import {actionEditModalHandle, actionEditModalComponent} from "./components/modals/actionEditModal";
import {actionRecorderActionsModal} from "./components/modals/actionRecorderActionsModal";
import {actionRecorderComponent} from "./components/actionRecorder";
import {ActionRecorderService} from "./services/ActionRecorderService";
import {counterCreateModal} from "./components/modals/counterCreateModal";
import {
    hypothesisLayoutSettingsModalHandle,
    hypothesisLayoutSettingsModalComponent
} from "./components/modals/hypothesisLayoutSettingsModal";
import {browserConfigModal} from "./components/modals/browserConfigModal";
import {
    learnerResultDetailsModalHandle,
    learnerResultDetailsModalComponent
} from "./components/modals/learnerResultDetailsModal";
import {
    learnerSetupSettingsModalHandle,
    learnerSetupSettingsModalComponent
} from "./components/modals/learnerSetupSettingsModal";
import {projectSettingsModalHandle, projectSettingsModalComponent} from "./components/modals/projectSettingsModal";
import {symbolCreateModalHandle, symbolCreateModalComponent} from "./components/modals/symbolCreateModal";
import {symbolEditModalHandle, symbolEditModalComponent} from "./components/modals/symbolEditModal";
import {
    symbolGroupCreateModalHandle,
    symbolGroupCreateModalComponent
} from "./components/modals/symbolGroupCreateModal";
import {symbolsImportModalHandle, symbolsImportModalComponent} from "./components/modals/symbolsImportModal";
import {symbolGroupEditModalHandle, symbolGroupEditModalComponent} from "./components/modals/symbolGroupEditModal";
import {symbolMoveModalHandle, symbolMoveModalComponent} from "./components/modals/symbolMoveModal";
import {userEditModalHandle, userEditModalComponent} from "./components/modals/userEditModal";
import {resultListModalHandle, resultListModalComponent} from "./components/modals/resultListModal";
import {promptModalComponent} from "./components/modals/promptModal";
import {confirmModalComponent} from "./components/modals/confirmModal";
import {testsImportModal} from "./components/modals/testsImportModal";
import {htmlElementPickerHandle} from "./directives/htmlElementPickerHandle";
import {aboutView} from "./components/views/aboutView";
import {adminUsersView} from "./components/views/adminUsersView";
import {countersView} from "./components/views/countersView";
import {errorView} from "./components/views/errorView";
import {filesView} from "./components/views/filesView";
import {homeView} from "./components/views/homeView";
import {learnerSetupView} from "./components/views/learnerSetupView";
import {learnerView} from "./components/views/learnerView";
import {projectsView} from "./components/views/projectsView";
import {projectsDashboardView} from "./components/views/projectsDashboardView";
import {resultsCompareView} from "./components/views/resultsCompareView";
import {resultsView} from "./components/views/resultsView";
import {settingsView} from "./components/views/settingsView";
import {statisticsCompareView} from "./components/views/statisticsCompareView";
import {symbolsActionsView} from "./components/views/symbolsActionsView";
import {symbolsView} from "./components/views/symbolsView";
import {testsView} from "./components/views/testsView";
import {testCaseView} from "./components/views/testCaseView";
import {testSuiteView} from "./components/views/testSuiteView";
import {symbolsTrashView} from "./components/views/symbolsTrashView";
import {usersSettingsView} from "./components/views/usersSettingsView";
import {actionForm} from "./components/forms/actions/actionForm";
import {projectCreateForm} from "./components/forms/projectCreateForm";
import {symbolEditFormComponent} from "./components/forms/symbolEditForm";
import {userEditForm} from "./components/forms/userEditForm";
import {userLoginForm} from "./components/forms/userLoginForm";
import {browserConfigForm} from "./components/forms/browserConfigForm";
import {widget} from "./components/widgets/widget";
import {projectDetailsWidget} from "./components/widgets/projectDetailsWidget";
import {learnResumeSettingsWidget} from "./components/widgets/learnResumeSettingsWidget";
import {learnerStatusWidget} from "./components/widgets/learnerStatusWidget";
import {latestLearnResultWidget} from "./components/widgets/latestLearnResultWidget";
import {counterexamplesWidget} from "./components/widgets/counterexamplesWidget";
import {alex} from "./components/alex";
import {actionBar} from "./components/actionBar";
import {checkbox, checkboxMultiple} from "./components/checkbox";
import {fileDropzone} from "./components/fileDropzone";
import {loadScreen} from "./components/loadScreen";
import {projectList} from "./components/projectList";
import {sidebar} from "./components/sidebar";
import {viewHeader} from "./components/viewHeader";
import {responsiveIframe} from "./components/responsiveIframe";
import {learnResultPanel} from "./components/learnResultPanel";
import {observationTable} from "./components/observationTable";
import {symbolListItem} from "./components/symbolListItem";
import {symbolGroupListItem} from "./components/symbolGroupListItem";
import {learnResultListItem} from "./components/learnResultListItem";
import {hypothesis} from "./components/hypothesis";
import {discriminationTree} from "./components/discriminationTree";
import {htmlElementPicker} from "./components/htmlElementPicker";
import {nodeFormGroup} from "./components/forms/nodeFormGroup";
import {testResultReport} from "./components/testResultReport";
import {testTree, testCaseNode, testSuiteNode} from "./components/testTree";
import {
    actionFormAlertAcceptDismiss,
    actionFormAlertGetText,
    actionFormAlertSendKeys,
    actionFormCheckForNode,
    actionFormCheckForText,
    actionFormCheckPageTitle,
    actionFormClearInput,
    actionFormClick,
    actionFormClickLinkByText,
    actionFormExecuteScript,
    actionFormMoveMouse,
    actionFormOpen,
    actionFormSelect,
    actionFormSendKeys,
    actionFormSubmit,
    actionFormWaitForNode,
    actionFormWaitForTitle,
    actionFormPressKey,
    actionFormCheckNodeAttributeValue,
    actionFormWaitForText,
    actionFormWaitForNodeAttribute,
    actionFormSwitchTo,
    actionFormSwitchToFrame
} from "./components/forms/actions/webActionForms";
import {
    actionFormCall,
    actionFormCheckAttributeExists,
    actionFormCheckAttributeType,
    actionFormCheckAttributeValue,
    actionFormCheckHeaderField,
    actionFormCheckHttpBody,
    actionFormCheckStatus,
    actionFormValidateJson
} from "./components/forms/actions/restActionForms";
import {
    actionFormAssertCounter,
    actionFormAssertVariable,
    actionFormIncrementCounter,
    actionFormSetCounter,
    actionFormSetVariable,
    actionFormSetVariableByCookie,
    actionFormSetVariableByHtml,
    actionFormSetVariableByJson,
    actionFormSetVariableByNodeAttribute,
    actionFormSetVariableByNodeCount,
    actionFormSetVariableByRegexGroup,
    actionFormWait
} from "./components/forms/actions/generalActionForms";

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

    // directives
    .directive('htmlElementPickerHandle', htmlElementPickerHandle)

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
    .directive('projectSettingsModalHandle', projectSettingsModalHandle)
    .component('projectSettingsModal', projectSettingsModalComponent)
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
    .component('settingsView', settingsView)
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
    .component('userEditForm', userEditForm)
    .component('userLoginForm', userLoginForm)
    .component('nodeFormGroup', nodeFormGroup)
    .component('browserConfigForm', browserConfigForm)
    .component('symbolEditForm', symbolEditFormComponent)

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