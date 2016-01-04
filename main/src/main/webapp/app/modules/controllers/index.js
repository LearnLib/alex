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
import VariablesCountersOccurrenceModalController from './modals/VariablesCountersOccurrenceModalController';

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
    .controller('VariablesCountersOccurrenceModalController', VariablesCountersOccurrenceModalController);

export const controllers = moduleName;