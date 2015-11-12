import Action from './actions/Action';
import Counter from './Counter';
import EqOracleModel from './EqOracle';
import LearnConfigurationFactory from './LearnConfiguration';
import LearnResultFactory from './LearnResult';
import {ProjectFormModel, Project} from './Project';
import SymbolModel from './Symbol';
import SymbolGroupFactory from './SymbolGroup';
import {UserFormModel, User} from './User';

// web actions
import SelectWebAction from './actions/webActions/SelectWebAction';
import SubmitWebAction from './actions/webActions/SubmitWebAction';
import GoToWebAction from './actions/webActions/GoToWebAction';
import FillWebAction from './actions/webActions/FillWebAction';
import ClickWebAction from './actions/webActions/ClickWebAction';
import ClickLinkByTextWebAction from './actions/webActions/ClickLinkByTextWebAction';
import ClearWebAction from './actions/webActions/ClearWebAction';
import CheckPageTitleAction from './actions/webActions/CheckPageTitleAction';
import CheckForTextWebAction from './actions/webActions/CheckForTextWebAction';
import CheckForNodeWebAction from './actions/webActions/CheckForNodeWebAction';

// rest actions
import CallRestAction from './actions/restActions/CallRestAction';
import CheckAttributeExistsRestAction from './actions/restActions/CheckAttributeExistsRestAction';
import CheckAttributeTypeRestAction from './actions/restActions/CheckAttributeTypeRestAction';
import CheckAttributeValueRestAction from './actions/restActions/CheckAttributeValueRestAction';
import CheckHeaderFieldRestAction from './actions/restActions/CheckHeaderFieldRestAction';
import CheckHTTPBodyTextRestAction from './actions/restActions/CheckHTTPBodyTextRestAction';
import CheckStatusRestAction from './actions/restActions/CheckStatusRestAction';

// general actions
import ExecuteSymbolGeneralAction from './actions/generalActions/ExecuteSymbolGeneralAction';
import AssertCounterAction from './actions/generalActions/AssertCounterAction';
import AssertVariableAction from './actions/generalActions/AssertVariableAction';
import IncrementCounterGeneralAction from './actions/generalActions/IncrementCounterGeneralAction';
import SetCounterGeneralAction from './actions/generalActions/SetCounterGeneralAction';
import SetVariableByCookieAction from './actions/generalActions/SetVariableByCookieAction';
import SetVariableByJsonAttributeGeneralAction from './actions/generalActions/SetVariableByJsonAttributeGeneralAction';
import SetVariableByNodeGeneralAction from './actions/generalActions/SetVariableByNodeGeneralAction';
import SetVariableGeneralAction from './actions/generalActions/SetVariableGeneralAction';
import WaitGeneralAction from './actions/generalActions/WaitGeneralAction';

const moduleName = 'ALEX.entities';

angular
    .module(moduleName, [])
    .factory('Counter', () => Counter)
    .factory('EqOracle', EqOracleModel)
    .factory('LearnConfiguration', LearnConfigurationFactory)
    .factory('LearnResult', LearnResultFactory)
    .factory('ProjectFormModel', () => ProjectFormModel)
    .factory('Project', () => Project)
    .factory('Symbol', SymbolModel)
    .factory('SymbolGroup', SymbolGroupFactory)
    .factory('UserFormModel', () => UserFormModel)
    .factory('User', () => User)
    .factory('Action', () => Action)

    // web actions
    .factory('SelectWebAction', () => SelectWebAction)
    .factory('SubmitWebAction', () => SubmitWebAction)
    .factory('GoToWebAction', () => GoToWebAction)
    .factory('FillWebAction', () => FillWebAction)
    .factory('ClickWebAction', () => ClickWebAction)
    .factory('ClickLinkByTextWebAction', () => ClickLinkByTextWebAction)
    .factory('ClearWebAction', () => ClearWebAction)
    .factory('CheckPageTitleAction', () => CheckPageTitleAction)
    .factory('CheckForTextWebAction', () => CheckForTextWebAction)
    .factory('CheckForNodeWebAction', () => CheckForNodeWebAction)

    // rest actions
    .factory('CallRestAction', () => CallRestAction)
    .factory('CheckAttributeExistsRestAction', () => CheckAttributeExistsRestAction)
    .factory('CheckAttributeTypeRestAction', () => CheckAttributeTypeRestAction)
    .factory('CheckAttributeValueRestAction', () => CheckAttributeValueRestAction)
    .factory('CheckHeaderFieldRestAction', () => CheckHeaderFieldRestAction)
    .factory('CheckHTTPBodyTextRestAction', () => CheckHTTPBodyTextRestAction)
    .factory('CheckStatusRestAction', () => CheckStatusRestAction)

    // general actions
    .factory('ExecuteSymbolGeneralAction', () => ExecuteSymbolGeneralAction)
    .factory('AssertCounterAction', () => AssertCounterAction)
    .factory('AssertVariableAction', () => AssertVariableAction)
    .factory('IncrementCounterGeneralAction', () => IncrementCounterGeneralAction)
    .factory('SetCounterGeneralAction', () => SetCounterGeneralAction)
    .factory('SetVariableByCookieAction', () => SetVariableByCookieAction)
    .factory('SetVariableByJsonAttributeGeneralAction', () => SetVariableByJsonAttributeGeneralAction)
    .factory('SetVariableByNodeGeneralAction', () => SetVariableByNodeGeneralAction)
    .factory('SetVariableGeneralAction', () => SetVariableGeneralAction)
    .factory('WaitGeneralAction', () => WaitGeneralAction);

export const entities = moduleName;