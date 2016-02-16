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

import discriminationTree from './discriminationTree';
import dropdownHover from './dropdownHover';
import {htmlElementPicker, htmlElementPickerWindow} from './htmlElementPicker';
import hypothesis from './hypothesis';
import {learnResultListItem} from './learnResultList';
import {symbolGroupListItem} from './symbolGroupList';
import {symbolListItem} from './symbolList';

// modal handles
import {actionCreateModalHandle} from './modals/actionCreateModalHandle';
import {actionEditModalHandle} from './modals/actionEditModalHandle';
import hypothesisLayoutSettingsModalHandle from './modals/hypothesisLayoutSettingsModalHandle';
import learnResultDetailsModalHandle from './modals/learnResultDetailsModalHandle';
import learnSetupSettingsModalHandle from './modals/learnSetupSettingsModalHandle';
import {projectSettingsModalHandle} from './modals/projectSettingsModalHandle';
import {symbolCreateModalHandle} from './modals/symbolCreateModalHandle';
import {symbolEditModalHandle} from './modals/symbolEditModalHandle';
import {symbolGroupCreateModalHandle} from './modals/symbolGroupCreateModalHandle';
import {symbolGroupEditModalHandle} from './modals/symbolGroupEditModalHandle';
import symbolMoveModalHandle from './modals/symbolMoveModalHandle';
import {userEditModalHandle} from './modals/userEditModalHandle';
import {resultListModalHandle} from './modals/resultListModalHandle';

const moduleName = 'ALEX.directives';

angular
    .module(moduleName, [])
    .directive('discriminationTree', discriminationTree)
    .directive('dropdownHover', dropdownHover)
    .directive('htmlElementPicker', htmlElementPicker)
    .directive('htmlElementPickerWindow', htmlElementPickerWindow)
    .directive('hypothesis', hypothesis)
    .directive('learnResultListItem', learnResultListItem)
    .directive('symbolGroupListItem', symbolGroupListItem)
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
    .directive('userEditModalHandle', userEditModalHandle)
    .directive('resultListModalHandle', resultListModalHandle);

export const directives = moduleName;