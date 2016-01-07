// views
import {aboutView} from './views/aboutView';
import {adminUsersView} from './views/adminUsersView';
import {countersView} from './views/countersView';
import {errorView} from './views/errorView';
import {filesView} from './views/filesView';
import {homeView} from './views/homeView';
import {learnerSetupView} from './views/learnerSetupView';
import {learnerStartView} from './views/learnerStartView';
import {projectsView} from './views/projectsView';
import {projectsDashboardView} from './views/projectsDashboardView';
import {resultsCompareView} from './views/resultsCompareView';
import {resultsView} from './views/resultsView';
import {statisticsCompareView} from './views/statisticsCompareView';
import {statisticsView} from './views/statisticsView';
import {symbolsActionsView} from './views/symbolsActionsView';
import {symbolsView} from './views/symbolsView';
import {symbolsHistoryView} from './views/symbolsHistoryView';
import {symbolsImportView} from './views/symbolsImportView';
import {symbolsTrashView} from './views/symbolsTrashView';
import {usersSettingsView} from './views/usersSettingsView';

// forms
import actionCreateEditForm from './forms/actionCreateEditForm';
import projectCreateForm from './forms/projectCreateForm';
import userEditForm from './forms/userEditForm';
import userLoginForm from './forms/userLoginForm';
import userRegisterForm from './forms/userRegisterForm';

// widgets
import widget from './widgets/widget';
import projectDetailsWidget from './widgets/projectDetailsWidget';
import learnResumeSettingsWidget from './widgets/learnResumeSettingsWidget';
import learnerStatusWidget from './widgets/learnerStatusWidget';
import latestLearnResultWidget from './widgets/latestLearnResultWidget';
import counterexamplesWidget from './widgets/counterexamplesWidget';

// misc
import alex from './alex';
import {actionBar} from './actionBar';
import {checkbox, checkboxMultiple} from './checkbox';
import {fileDropzone} from './fileDropzone';
import loadScreen from './loadScreen';
import projectList from './projectList';
import sidebar from './sidebar';
import viewHeader from './viewHeader';

const moduleName = 'ALEX.components';

angular
    .module(moduleName, [])

    // views
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
    .component('statisticsCompareView', statisticsCompareView)
    .component('statisticsView', statisticsView)
    .component('symbolsActionsView', symbolsActionsView)
    .component('symbolsView', symbolsView)
    .component('symbolsHistoryView', symbolsHistoryView)
    .component('symbolsImportView', symbolsImportView)
    .component('symbolsTrashView', symbolsTrashView)
    .component('usersSettingsView', usersSettingsView)

    // forms
    .component('actionCreateEditForm', actionCreateEditForm)
    .component('projectCreateForm', projectCreateForm)
    .component('userEditForm', userEditForm)
    .component('userLoginForm', userLoginForm)
    .component('userRegisterForm', userRegisterForm)

    // widgets
    .component('widget', widget)
    .component('counterexamplesWidget', counterexamplesWidget)
    .component('learnResumeSettingsWidget', learnResumeSettingsWidget)
    .component('learnerStatusWidget', learnerStatusWidget)
    .component('latestLearnResultWidget', latestLearnResultWidget)
    .component('projectDetailsWidget', projectDetailsWidget)

    // misc
    .component('alex', alex)
    .component('actionBar', actionBar)
    .component('checkbox', checkbox)
    .component('checkboxMultiple', checkboxMultiple)
    .component('fileDropzone', fileDropzone)
    .component('loadScreen', loadScreen)
    .component('projectList', projectList)
    .component('sidebar', sidebar)
    .component('viewHeader', viewHeader);

export const components = moduleName;