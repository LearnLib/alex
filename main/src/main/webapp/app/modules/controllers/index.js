// page controllers
import AdminUsersController from './pages/AdminUsersController';
import CountersController from './pages/CountersController';
import ErrorController from './pages/ErrorController';
import FilesController from './pages/FilesController';
import HomeController from './pages/HomeController';
import ResultsCompareController from './pages/ResultsCompareController';
import ResultsController from './pages/ResultsController';
import StatisticsController from './pages/StatisticsController';
import StatisticsCompareController from './pages/StatisticsCompareController';
import LearnerSetupController from './pages/LearnerSetupController';
import LearnerStartController from './pages/LearnerStartController';
import ProjectsController from './pages/ProjectsController';
import SymbolsActionsController from './pages/SymbolsActionsController';
import SymbolsController from './pages/SymbolsController';
import SymbolsHistoryController from './pages/SymbolsHistoryController';
import SymbolsImportController from './pages/SymbolsImportController';
import SymbolsTrashController from './pages/SymbolsTrashController';
import UsersSettingsController from './pages/UsersSettingsController';

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
    .controller('ResultsCompareController', ResultsCompareController)
    .controller('ResultsController', ResultsController)
    .controller('StatisticsController', StatisticsController)
    .controller('StatisticsCompareController', StatisticsCompareController)
    .controller('LearnerSetupController', LearnerSetupController)
    .controller('LearnerStartController', LearnerStartController)
    .controller('ProjectsController', ProjectsController)
    .controller('SymbolsActionsController', SymbolsActionsController)
    .controller('SymbolsController', SymbolsController)
    .controller('SymbolsHistoryController', SymbolsHistoryController)
    .controller('SymbolsImportController', SymbolsImportController)
    .controller('SymbolsTrashController', SymbolsTrashController)
    .controller('UsersSettingsController', UsersSettingsController)

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