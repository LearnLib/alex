import actionBar from './actionBar';
import {checkbox, checkboxMultiple} from './checkbox';
import discriminationTree from './discriminationTree';
import dispatchResize from './dispatchResize';
import downloadAsJson from './downloadAsJson';
import downloadLearnerResultsAsCsv from './downloadLearnerResultsAsCsv';
import downloadSvg from './downloadSvg';
import downloadTableAsCsv from './downloadTableAsCsv';
import dropdownHover from './dropdownHover';
import fileDropzone from './fileDropzone';
import {htmlElementPicker, htmlElementPickerInstance, htmlElementPickerWindow} from './htmlElementPicker';
import hypothesis from './hypothesis';
import {layout, layoutToggleElement, layoutToggleButton} from './layout';
import {learnResultList, learnResultListItem} from './learnResultList';
import {learnResultPanel, learnResultComparePanel} from './learnResultPanel';
import loadScreen from './loadScreen';
import observationTable from './observationTable';
import projectList from './projectList';
import responsiveIframe from './responsiveIframe';
import sidebar from './sidebar';
import {symbolGroupList, symbolGroupListItem} from './symbolGroupList';
import {symbolList, symbolListItem} from './symbolList';
import viewHeader from './viewHeader';

// forms
import actionFormFields from './forms/actionFormFields';
import projectCreateForm from './forms/projectCreateForm';
import userEditForm from './forms/userEditForm';
import userLoginForm from './forms/userLoginForm';
import userRegisterForm from './forms/userRegisterForm';

// modal handles
import actionCreateModalHandle from './modalHandles/actionCreateModalHandle';
import actionEditModalHandle from './modalHandles/actionEditModalHandle';
import hypothesisLayoutSettingsModalHandle from './modalHandles/hypothesisLayoutSettingsModalHandle';
import learnResultDetailsModalHandle from './modalHandles/learnResultDetailsModalHandle';
import learnSetupSettingsModalHandle from './modalHandles/learnSetupSettingsModalHandle';
import projectSettingsModalHandle from './modalHandles/projectSettingsModalHandle';
import symbolCreateModalHandle from './modalHandles/symbolCreateModalHandle';
import symbolEditModalHandle from './modalHandles/symbolEditModalHandle';
import symbolGroupCreateModalHandle from './modalHandles/symbolGroupCreateModalHandle';
import symbolGroupEditModalHandle from './modalHandles/symbolGroupEditModalHandle';
import symbolMoveModalHandle from './modalHandles/symbolMoveModalHandle';
import userEditModalHandle from './modalHandles/userEditModalHandle';
import variablesCountersOccurrenceModalHandle from './modalHandles/variablesCountersOccurrenceModalHandle';

// widgets
import widget from './widgets/widget';
import projectDetailsWidget from './widgets/projectDetailsWidget';
import learnResumeSettingsWidget from './widgets/learnResumeSettingsWidget';
import learnerStatusWidget from './widgets/learnerStatusWidget';
import latestLearnResultWidget from './widgets/latestLearnResultWidget';
import counterexamplesWidget from './widgets/counterexamplesWidget';

const moduleName = 'ALEX.directives';

angular
    .module(moduleName, [])
    .directive('actionBar', actionBar)
    .directive('actionFormFields', actionFormFields)
    .directive('checkbox', checkbox)
    .directive('checkboxMultiple', checkboxMultiple)
    .directive('discriminationTree', discriminationTree)
    .directive('dispatchResize', dispatchResize)
    .directive('downloadAsJson', downloadAsJson)
    .directive('downloadLearnerResultsAsCsv', downloadLearnerResultsAsCsv)
    .directive('downloadTableAsCsv', downloadTableAsCsv)
    .directive('dropdownHover', dropdownHover)
    .directive('fileDropzone', fileDropzone)
    .directive('htmlElementPicker', htmlElementPicker)
    .directive('htmlElementPickerWindow', htmlElementPickerWindow)
    .factory('htmlElementPickerInstance', htmlElementPickerInstance)
    .directive('hypothesis', hypothesis)
    .directive('layout', layout)
    .directive('layoutToggleElement', layoutToggleElement)
    .directive('layoutToggleButton', layoutToggleButton)
    .directive('learnResultList', learnResultList)
    .directive('learnResultListItem', learnResultListItem)
    .directive('learnResultPanel', learnResultPanel)
    .directive('learnResultComparePanel', learnResultComparePanel)
    .directive('loadScreen', loadScreen)
    .directive('observationTable', observationTable)
    .directive('projectCreateForm', projectCreateForm)
    .directive('projectList', projectList)
    .directive('responsiveIframe', responsiveIframe)
    .directive('sidebar', sidebar)
    .directive('symbolGroupList', symbolGroupList)
    .directive('symbolGroupListItem', symbolGroupListItem)
    .directive('symbolList', symbolList)
    .directive('symbolListItem', symbolListItem)
    .directive('userEditForm', userEditForm)
    .directive('userLoginForm', userLoginForm)
    .directive('userRegisterForm', userRegisterForm)
    .directive('viewHeader', viewHeader)

    // modal handles
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
    .directive('variablesCountersOccurrenceModalHandle', variablesCountersOccurrenceModalHandle)

    // widgets
    .directive('widget', widget)
    .directive('counterexamplesWidget', counterexamplesWidget)
    .directive('learnResumeSettingsWidget', learnResumeSettingsWidget)
    .directive('learnerStatusWidget', learnerStatusWidget)
    .directive('latestLearnResultWidget', latestLearnResultWidget)
    .directive('projectDetailsWidget', projectDetailsWidget);

export const directives = moduleName;