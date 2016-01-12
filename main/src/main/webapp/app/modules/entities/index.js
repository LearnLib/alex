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

import Action from './actions/Action';
import Counter from './Counter';
import {RandomEqOracle, CompleteEqOracle, WMethodEqOracle, SampleEqOracle} from './EqOracle';
import LearnConfiguration from './LearnConfiguration';
import LearnResult from './LearnResult';
import {ProjectFormModel, Project} from './Project';
import {SymbolFormModel, Symbol} from './Symbol';
import {SymbolGroupFormModel,SymbolGroup} from './SymbolGroup';
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
import SetVariableByNodeAttributeGeneralAction from './actions/generalActions/SetVariableByNodeAttributeGeneralAction';
import WaitGeneralAction from './actions/generalActions/WaitGeneralAction';

const moduleName = 'ALEX.entities';

angular
    .module(moduleName, [])
    .factory('Counter', () => Counter)
    .factory('RandomEqOracle', () => RandomEqOracle)
    .factory('CompleteEqOracle', () => CompleteEqOracle)
    .factory('WMethodEqOracle', () => WMethodEqOracle)
    .factory('SampleEqOracle', () => SampleEqOracle)
    .factory('LearnConfiguration', () => LearnConfiguration)
    .factory('LearnResult', () => LearnResult)
    .factory('ProjectFormModel', () => ProjectFormModel)
    .factory('Project', () => Project)
    .factory('SymbolFormModel', () => SymbolFormModel)
    .factory('Symbol', () => Symbol)
    .factory('SymbolGroupFormModel', () => SymbolGroupFormModel)
    .factory('SymbolGroup', () => SymbolGroup)
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