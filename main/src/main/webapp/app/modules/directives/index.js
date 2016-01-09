import discriminationTree from './discriminationTree';
import downloadSvg from './downloadSvg';
import downloadTableAsCsv from './downloadTableAsCsv';
import dropdownHover from './dropdownHover';
import {htmlElementPicker, htmlElementPickerWindow} from './htmlElementPicker';
import hypothesis from './hypothesis';
import {learnResultList, learnResultListItem} from './learnResultList';
import {learnResultPanel, learnResultComparePanel} from './learnResultPanel';
import observationTable from './observationTable';
import responsiveIframe from './responsiveIframe';
import {symbolGroupList, symbolGroupListItem} from './symbolGroupList';
import {symbolList, symbolListItem} from './symbolList';

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

const moduleName = 'ALEX.directives';

angular
    .module(moduleName, [])
    .directive('discriminationTree', discriminationTree)
    .directive('downloadTableAsCsv', downloadTableAsCsv)
    .directive('downloadSvg', downloadSvg)
    .directive('dropdownHover', dropdownHover)
    .directive('htmlElementPicker', htmlElementPicker)
    .directive('htmlElementPickerWindow', htmlElementPickerWindow)
    .directive('hypothesis', hypothesis)
    .directive('learnResultList', learnResultList)
    .directive('learnResultListItem', learnResultListItem)
    .directive('learnResultPanel', learnResultPanel)
    .directive('learnResultComparePanel', learnResultComparePanel)
    .directive('observationTable', observationTable)
    .directive('responsiveIframe', responsiveIframe)
    .directive('symbolGroupList', symbolGroupList)
    .directive('symbolGroupListItem', symbolGroupListItem)
    .directive('symbolList', symbolList)
    .directive('symbolListItem', symbolListItem)

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
    .directive('userEditModalHandle', userEditModalHandle);

export const directives = moduleName;