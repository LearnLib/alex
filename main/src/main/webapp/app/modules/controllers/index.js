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

import ActionCreateModalController from './modals/ActionCreateModalController';
import ActionEditModalController from './modals/ActionEditModalController';
import ConfirmDialogController from './modals/ConfirmDialogController';
import HypothesisLayoutSettingsController from './modals/HypothesisLayoutSettingsController';
import LearnResultDetailsModalController from './modals/LearnResultDetailsModalController';
import LearnSetupSettingsModalController from './modals/LearnSetupSettingsModalController';
import ProjectSettingsModalController from './modals/ProjectSettingsModalController';
import PromptDialogController from './modals/PromptDialogController';
import SymbolCreateModalController from './modals/SymbolCreateModalController';
import SymbolEditModalController from './modals/SymbolEditModalController';
import SymbolGroupCreateModalController from './modals/SymbolGroupCreateModalController';
import SymbolGroupEditModalController from './modals/SymbolGroupEditModalController';
import SymbolMoveModalController from './modals/SymbolMoveModalController';
import UserEditModalController from './modals/UserEditModalController';

const moduleName = 'ALEX.controllers';

angular
    .module(moduleName, [])

    // modal windows
    .controller('ActionCreateModalController', ActionCreateModalController)
    .controller('ActionEditModalController', ActionEditModalController)
    .controller('ConfirmDialogController', ConfirmDialogController)
    .controller('HypothesisLayoutSettingsController', HypothesisLayoutSettingsController)
    .controller('LearnResultDetailsModalController', LearnResultDetailsModalController)
    .controller('LearnSetupSettingsModalController', LearnSetupSettingsModalController)
    .controller('ProjectSettingsModalController', ProjectSettingsModalController)
    .controller('PromptDialogController', PromptDialogController)
    .controller('SymbolCreateModalController', SymbolCreateModalController)
    .controller('SymbolEditModalController', SymbolEditModalController)
    .controller('SymbolGroupCreateModalController', SymbolGroupCreateModalController)
    .controller('SymbolGroupEditModalController', SymbolGroupEditModalController)
    .controller('SymbolMoveModalController', SymbolMoveModalController)
    .controller('UserEditModalController', UserEditModalController)

export const controllers = moduleName;