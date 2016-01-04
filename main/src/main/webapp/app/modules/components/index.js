import {aboutViewComponent} from './views/aboutView.component';
import {adminUsersViewComponent} from './views/adminUsersView.component';
import {countersViewComponent} from './views/countersView.component';
import {errorViewComponent} from './views/errorView.component';
import {filesViewComponent} from './views/filesView.component';
import {homeViewComponent} from './views/homeView.component';
import {learnerSetupViewComponent} from './views/learnerSetupView.component';
import {learnerStartViewComponent} from './views/learnerStartView.component';
import {projectsViewComponent} from './views/projectsView.component';
import {projectsDashboardViewComponent} from './views/projectsDashboardView.component';
import {resultsCompareViewComponent} from './views/resultsCompareView.component';
import {resultsViewComponent} from './views/resultsView.component';
import {statisticsCompareViewComponent} from './views/statisticsCompareView.component';
import {statisticsViewComponent} from './views/statisticsView.component';
import {symbolsActionsViewComponent} from './views/symbolsActionsView.component';
import {symbolsViewComponent} from './views/symbolsView.component';
import {symbolsHistoryViewComponent} from './views/symbolsHistoryView.component';
import {symbolsImportViewComponent} from './views/symbolsImportView.component';
import {symbolsTrashViewComponent} from './views/symbolsTrashView.component';
import {usersSettingsViewComponent} from './views/usersSettingsView.component';

const moduleName = 'ALEX.components';

angular
    .module(moduleName, [])

    // view components
    .component('aboutView', aboutViewComponent)
    .component('adminUsersView', adminUsersViewComponent)
    .component('countersView', countersViewComponent)
    .component('errorView', errorViewComponent)
    .component('filesView', filesViewComponent)
    .component('homeView', homeViewComponent)
    .component('learnerSetupView', learnerSetupViewComponent)
    .component('learnerStartView', learnerStartViewComponent)
    .component('projectsView', projectsViewComponent)
    .component('projectsDashboardView', projectsDashboardViewComponent)
    .component('resultsCompareView', resultsCompareViewComponent)
    .component('resultsView', resultsViewComponent)
    .component('statisticsCompareView', statisticsCompareViewComponent)
    .component('statisticsView', statisticsViewComponent)
    .component('symbolsActionsView', symbolsActionsViewComponent)
    .component('symbolsView', symbolsViewComponent)
    .component('symbolsHistoryView', symbolsHistoryViewComponent)
    .component('symbolsImportView', symbolsImportViewComponent)
    .component('symbolsTrashView', symbolsTrashViewComponent)
    .component('usersSettingsView', usersSettingsViewComponent);

export const components = moduleName;