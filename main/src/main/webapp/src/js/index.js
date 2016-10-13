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
import uiRouter from "angular-ui-router";
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
import {ErrorService} from "./services/ErrorService";
import {EventBus} from "./services/EventBus";
import {EqOracleService} from "./services/EqOracleService";
import {DownloadService} from "./services/DownloadService";
import {LearnerResultChartService} from "./services/LearnerResultChartService";
import {PromptService} from "./services/PromptService";
import {SessionService} from "./services/SessionService";
import {ToastService} from "./services/ToastService";
import {LearnerResultDownloadService} from "./services/LearnerResultDownloadService";
import {HtmlElementPickerService} from "./services/HtmlElementPickerService";
import {formatAlgorithm, formatEqOracle, formatMilliseconds, formatUserRole, formatWebBrowser} from "./filters";
import {actionCreateModalHandle} from "./directives/modals/actionCreateModalHandle";
import {actionEditModalHandle} from "./directives/modals/actionEditModalHandle";
import {hypothesisLayoutSettingsModalHandle} from "./directives/modals/hypothesisLayoutSettingsModalHandle";
import {learnResultDetailsModalHandle} from "./directives/modals/learnResultDetailsModalHandle";
import {learnSetupSettingsModalHandle} from "./directives/modals/learnSetupSettingsModalHandle";
import {projectSettingsModalHandle} from "./directives/modals/projectSettingsModalHandle";
import {symbolCreateModalHandle} from "./directives/modals/symbolCreateModalHandle";
import {symbolEditModalHandle} from "./directives/modals/symbolEditModalHandle";
import {symbolGroupCreateModalHandle} from "./directives/modals/symbolGroupCreateModalHandle";
import {symbolGroupEditModalHandle} from "./directives/modals/symbolGroupEditModalHandle";
import {symbolMoveModalHandle} from "./directives/modals/symbolMoveModalHandle";
import {userEditModalHandle} from "./directives/modals/userEditModalHandle";
import {resultListModalHandle} from "./directives/modals/resultListModalHandle";
import {dropdownHover} from "./directives/dropdownHover";
import {htmlElementPickerHandle} from "./directives/htmlElementPickerHandle";
import {aboutView} from "./components/views/aboutView";
import {adminUsersView} from "./components/views/adminUsersView";
import {countersView} from "./components/views/countersView";
import {errorView} from "./components/views/errorView";
import {filesView} from "./components/views/filesView";
import {homeView} from "./components/views/homeView";
import {learnerSetupView} from "./components/views/learnerSetupView";
import {learnerStartView} from "./components/views/learnerStartView";
import {projectsView} from "./components/views/projectsView";
import {projectsDashboardView} from "./components/views/projectsDashboardView";
import {resultsCompareView} from "./components/views/resultsCompareView";
import {resultsView} from "./components/views/resultsView";
import {settingsView} from "./components/views/settingsView";
import {statisticsCompareView} from "./components/views/statisticsCompareView";
import {statisticsView} from "./components/views/statisticsView";
import {symbolsActionsView} from "./components/views/symbolsActionsView";
import {symbolsView} from "./components/views/symbolsView";
import {symbolsHistoryView} from "./components/views/symbolsHistoryView";
import {symbolsImportView} from "./components/views/symbolsImportView";
import {symbolsTestView} from "./components/views/symbolsTestView";
import {symbolsTrashView} from "./components/views/symbolsTrashView";
import {usersSettingsView} from "./components/views/usersSettingsView";
import {actionForm} from "./components/forms/actions/actionForm";
import {projectCreateForm} from "./components/forms/projectCreateForm";
import {userEditForm} from "./components/forms/userEditForm";
import {userLoginForm} from "./components/forms/userLoginForm";
import {userRegisterForm} from "./components/forms/userRegisterForm";
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
import {
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
    actionFormCheckNodeAttributeValue
} from "./components/forms/actions/webActionForms";
import {
    actionFormCall,
    actionFormCheckAttributeExists,
    actionFormCheckAttributeType,
    actionFormCheckAttributeValue,
    actionFormCheckHeaderField,
    actionFormCheckHttpBody,
    actionFormCheckStatus
} from "./components/forms/actions/restActionForms";
import {
    actionFormAssertCounter,
    actionFormAssertVariable,
    actionFormExecuteSymbol,
    actionFormIncrementCounter,
    actionFormSetCounter,
    actionFormSetVariable,
    actionFormSetVariableByCookie,
    actionFormSetVariableByHtml,
    actionFormSetVariableByJson,
    actionFormSetVariableByNodeAttribute,
    actionFormWait
} from "./components/forms/actions/generalActionForms";

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
    .config(config.config)
    .config(routes.config)
    .run(routes.run)

    // constants
    .constant('learnAlgorithm', constant.learnAlgorithm)
    .constant('webBrowser', constant.webBrowser)
    .constant('eqOracleType', constant.eqOracleType)
    .constant('events', constant.events)
    .constant('actionType', constant.actionType)
    .constant('chartMode', constant.chartMode)

    // filters
    .filter('formatEqOracle', formatEqOracle)
    .filter('formatAlgorithm', formatAlgorithm)
    .filter('formatMilliseconds', formatMilliseconds)
    .filter('formatUserRole', formatUserRole)
    .filter('formatWebBrowser', formatWebBrowser)

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

    // services
    .service('ActionService', ActionService)
    .service('ClipboardService', ClipboardService)
    .service('ErrorService', ErrorService)
    .service('EventBus', EventBus)
    .service('EqOracleService', EqOracleService)
    .service('DownloadService', DownloadService)
    .service('LearnerResultChartService', LearnerResultChartService)
    .service('PromptService', PromptService)
    .service('SessionService', SessionService)
    .service('ToastService', ToastService)
    .service('LearnerResultDownloadService', LearnerResultDownloadService)
    .service('HtmlElementPickerService', HtmlElementPickerService)

    // directives
    .directive('dropdownHover', dropdownHover)
    .directive('htmlElementPickerHandle', htmlElementPickerHandle)
    .directive('actionCreateModalHandle', actionCreateModalHandle)
    .directive('actionEditModalHandle', actionEditModalHandle)
    .directive('hypothesisLayoutSettingsModalHandle', hypothesisLayoutSettingsModalHandle)
    .directive('learnResultDetailsModalHandle', learnResultDetailsModalHandle)
    .directive('learnSetupSettingsModalHandle', learnSetupSettingsModalHandle)
    .directive('projectSettingsModalHandle', projectSettingsModalHandle)
    .directive('symbolCreateModalHandle', symbolCreateModalHandle)
    .directive('symbolEditModalHandle', symbolEditModalHandle)
    .directive('symbolGroupCreateModalHandle', symbolGroupCreateModalHandle)
    .directive('symbolGroupEditModalHandle', symbolGroupEditModalHandle)
    .directive('symbolMoveModalHandle', symbolMoveModalHandle)
    .directive('userEditModalHandle', userEditModalHandle)
    .directive('resultListModalHandle', resultListModalHandle)

    // view components
    .component('aboutView', aboutView)
    .component('adminUsersView', adminUsersView)
    .component('countersView', countersView)
    .component('errorView', errorView)
    .component('filesView', filesView)
    .component('homeView', homeView)
    .component('learnerSetupView', learnerSetupView)
    .component('learnerStartView', learnerStartView)
    .component('projectsView', projectsView)
    .component('projectsDashboardView', projectsDashboardView)
    .component('resultsCompareView', resultsCompareView)
    .component('resultsView', resultsView)
    .component('settingsView', settingsView)
    .component('statisticsCompareView', statisticsCompareView)
    .component('statisticsView', statisticsView)
    .component('symbolsActionsView', symbolsActionsView)
    .component('symbolsView', symbolsView)
    .component('symbolsHistoryView', symbolsHistoryView)
    .component('symbolsImportView', symbolsImportView)
    .component('symbolsTestView', symbolsTestView)
    .component('symbolsTrashView', symbolsTrashView)
    .component('usersSettingsView', usersSettingsView)

    // forms components
    .component('actionForm', actionForm)
    .component('projectCreateForm', projectCreateForm)
    .component('userEditForm', userEditForm)
    .component('userLoginForm', userLoginForm)
    .component('userRegisterForm', userRegisterForm)

    // widgets components
    .component('widget', widget)
    .component('counterexamplesWidget', counterexamplesWidget)
    .component('learnResumeSettingsWidget', learnResumeSettingsWidget)
    .component('learnerStatusWidget', learnerStatusWidget)
    .component('latestLearnResultWidget', latestLearnResultWidget)
    .component('projectDetailsWidget', projectDetailsWidget)

    // web action forms
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
    .component('actionFormWaitForNode', actionFormWaitForNode)
    .component('actionFormWaitForTitle', actionFormWaitForTitle)
    .component('actionFormPressKey', actionFormPressKey)

    // rest action forms
    .component('actionFormCall', actionFormCall)
    .component('actionFormCheckAttributeExists', actionFormCheckAttributeExists)
    .component('actionFormCheckAttributeType', actionFormCheckAttributeType)
    .component('actionFormCheckAttributeValue', actionFormCheckAttributeValue)
    .component('actionFormCheckHeaderField', actionFormCheckHeaderField)
    .component('actionFormCheckHttpBody', actionFormCheckHttpBody)
    .component('actionFormCheckStatus', actionFormCheckStatus)

    // general action forms
    .component('actionFormAssertCounter', actionFormAssertCounter)
    .component('actionFormAssertVariable', actionFormAssertVariable)
    .component('actionFormExecuteSymbol', actionFormExecuteSymbol)
    .component('actionFormIncrementCounter', actionFormIncrementCounter)
    .component('actionFormSetCounter', actionFormSetCounter)
    .component('actionFormSetVariable', actionFormSetVariable)
    .component('actionFormSetVariableByCookie', actionFormSetVariableByCookie)
    .component('actionFormSetVariableByHtml', actionFormSetVariableByHtml)
    .component('actionFormSetVariableByJson', actionFormSetVariableByJson)
    .component('actionFormSetVariableByNodeAttribute', actionFormSetVariableByNodeAttribute)
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
    .component('learnResultPanel', learnResultPanel)
    .component('observationTable', observationTable)
    .component('symbolListItem', symbolListItem)
    .component('symbolGroupListItem', symbolGroupListItem)
    .component('learnResultListItem', learnResultListItem);

angular.bootstrap(document, ['ALEX']);