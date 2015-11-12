// page controllers
import AdminUsersController from './pages/AdminUsersController';
import CountersController from './pages/CountersController';
import ErrorController from './pages/ErrorController';
import FilesController from './pages/FilesController';
import HomeController from './pages/HomeController';
import LearnResultsCompareController from './pages/LearnResultsCompareController';
import LearnResultsController from './pages/LearnResultsController';
import LearnResultsStatisticsController from './pages/LearnResultsStatisticsController';
import LearnSetupController from './pages/LearnSetupController';
import LearnStartController from './pages/LearnStartController';
import ProjectsController from './pages/ProjectsController';
import SymbolsActionsController from './pages/SymbolsActionsController';
import SymbolsController from './pages/SymbolsController';
import SymbolsHistoryController from './pages/SymbolsHistoryController';
import SymbolsImportController from './pages/SymbolsImportController';
import SymbolsTrashController from './pages/SymbolsTrashController';
import UserSettingsController from './pages/UserSettingsController';

// modal controllers
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

    // page controllers
    .controller('AdminUsersController', AdminUsersController)
    .controller('CountersController', CountersController)
    .controller('ErrorController', ErrorController)
    .controller('FilesController', FilesController)
    .controller('HomeController', HomeController)
    .controller('LearnResultsCompareController', LearnResultsCompareController)
    .controller('LearnResultsController', LearnResultsController)
    .controller('LearnResultsStatisticsController', LearnResultsStatisticsController)
    .controller('LearnSetupController', LearnSetupController)
    .controller('LearnStartController', LearnStartController)
    .controller('ProjectsController', ProjectsController)
    .controller('SymbolsActionsController', SymbolsActionsController)
    .controller('SymbolsController', SymbolsController)
    .controller('SymbolsHistoryController', SymbolsHistoryController)
    .controller('SymbolsImportController', SymbolsImportController)
    .controller('SymbolsTrashController', SymbolsTrashController)
    .controller('UserSettingsController', UserSettingsController)

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