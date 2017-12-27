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

import {actionType} from '../constants';
import {AssertCounterAction} from '../entities/actions/generalActions/AssertCounterAction';
import {AssertVariableAction} from '../entities/actions/generalActions/AssertVariableAction';
import {IncrementCounterGeneralAction} from '../entities/actions/generalActions/IncrementCounterGeneralAction';
import {SetCounterGeneralAction} from '../entities/actions/generalActions/SetCounterGeneralAction';
import {SetVariableByCookieAction} from '../entities/actions/generalActions/SetVariableByCookieAction';
import {SetVariableByJsonAttributeGeneralAction} from '../entities/actions/generalActions/SetVariableByJsonAttributeGeneralAction';
import {SetVariableByNodeAttributeGeneralAction} from '../entities/actions/generalActions/SetVariableByNodeAttributeGeneralAction';
import {SetVariableByNodeCountAction} from '../entities/actions/generalActions/SetVariableByNodeCountAction';
import {SetVariableByNodeGeneralAction} from '../entities/actions/generalActions/SetVariableByNodeGeneralAction';
import {SetVariableByRegexGroup} from '../entities/actions/generalActions/SetVariableByRegexGroup';
import {SetVariableGeneralAction} from '../entities/actions/generalActions/SetVariableGeneralAction';
import {WaitGeneralAction} from '../entities/actions/generalActions/WaitGeneralAction';
import {CallRestAction} from '../entities/actions/restActions/CallRestAction';
import {CheckAttributeExistsRestAction} from '../entities/actions/restActions/CheckAttributeExistsRestAction';
import {CheckAttributeTypeRestAction} from '../entities/actions/restActions/CheckAttributeTypeRestAction';
import {CheckAttributeValueRestAction} from '../entities/actions/restActions/CheckAttributeValueRestAction';
import {CheckHeaderFieldRestAction} from '../entities/actions/restActions/CheckHeaderFieldRestAction';
import {CheckHTTPBodyTextRestAction} from '../entities/actions/restActions/CheckHTTPBodyTextRestAction';
import {CheckStatusRestAction} from '../entities/actions/restActions/CheckStatusRestAction';
import {ValidateJsonAction} from '../entities/actions/restActions/ValidateJsonAction';
import {AlertAcceptDismissAction} from '../entities/actions/webActions/AlertAcceptDismissAction';
import {AlertGetTextAction} from '../entities/actions/webActions/AlertGetTextAction';
import {AlertSendKeysAction} from '../entities/actions/webActions/AlertSendKeysAction';
import {CheckNodeAttributeValueAction} from '../entities/actions/webActions/CheckAttributeValueAction';
import {CheckForNodeWebAction} from '../entities/actions/webActions/CheckForNodeWebAction';
import {CheckForTextWebAction} from '../entities/actions/webActions/CheckForTextWebAction';
import {CheckPageTitleAction} from '../entities/actions/webActions/CheckPageTitleAction';
import {ClearWebAction} from '../entities/actions/webActions/ClearWebAction';
import {ClickLinkByTextWebAction} from '../entities/actions/webActions/ClickLinkByTextWebAction';
import {ClickWebAction} from '../entities/actions/webActions/ClickWebAction';
import {ExecuteScriptAction} from '../entities/actions/webActions/ExecuteScriptAction';
import {FillWebAction} from '../entities/actions/webActions/FillWebAction';
import {GoToWebAction} from '../entities/actions/webActions/GoToWebAction';
import {MoveMouseAction} from '../entities/actions/webActions/MoveMouseAction';
import {PressKeyAction} from '../entities/actions/webActions/PressKeyAction';
import {SelectWebAction} from '../entities/actions/webActions/SelectWebAction';
import {SubmitWebAction} from '../entities/actions/webActions/SubmitWebAction';
import {SwitchToAction} from '../entities/actions/webActions/SwitchToAction';
import {SwitchToFrameAction} from '../entities/actions/webActions/SwitchToFrameAction';
import {WaitForNodeAction} from '../entities/actions/webActions/WaitForNodeAction';
import {WaitForNodeAttributeAction} from '../entities/actions/webActions/WaitForNodeAttributeAction';
import {WaitForTextAction} from '../entities/actions/webActions/WaitForTextAction';
import {WaitForTitleAction} from '../entities/actions/webActions/WaitForTitleAction';

/**
 * The service that is used to create new actions.
 */
export class ActionService {

    /**
     * Creates an action from a given object.
     *
     * @param {object} data - The object to create an action from.
     * @returns {*}
     */
    create(data) {
        switch (data.type) {

            // web actions
            case actionType.WEB_ALERT_ACCEPT_DISMISS:
                return new AlertAcceptDismissAction(data);
            case actionType.WEB_ALERT_GET_TEXT:
                return new AlertGetTextAction(data);
            case actionType.WEB_ALERT_SEND_KEYS:
                return new AlertSendKeysAction(data);
            case actionType.WEB_SELECT:
                return new SelectWebAction(data);
            case actionType.WEB_SUBMIT:
                return new SubmitWebAction(data);
            case actionType.WEB_GO_TO:
                return new GoToWebAction(data);
            case actionType.WEB_FILL:
                return new FillWebAction(data);
            case actionType.WEB_EXECUTE_SCRIPT:
                return new ExecuteScriptAction(data);
            case actionType.WEB_CLICK:
                return new ClickWebAction(data);
            case actionType.WEB_MOUSE_MOVE:
                return new MoveMouseAction(data);
            case actionType.WEB_CLICK_LINK_BY_TEXT:
                return new ClickLinkByTextWebAction(data);
            case actionType.WEB_CLEAR:
                return new ClearWebAction(data);
            case actionType.WEB_CHECK_PAGE_TITLE:
                return new CheckPageTitleAction(data);
            case actionType.WEB_CHECK_TEXT:
                return new CheckForTextWebAction(data);
            case actionType.WEB_CHECK_NODE:
                return new CheckForNodeWebAction(data);
            case actionType.WEB_PRESS_KEY:
                return new PressKeyAction(data);
            case actionType.WEB_CHECK_ATTRIBUTE_VALUE:
                return new CheckNodeAttributeValueAction(data);
            case actionType.WEB_SWITCH_TO:
                return new SwitchToAction(data);
            case actionType.WEB_SWITCH_TO_FRAME:
                return new SwitchToFrameAction(data);

            // rest actions
            case actionType.REST_CALL:
                return new CallRestAction(data);
            case actionType.REST_CHECK_ATTRIBUTE_EXISTS:
                return new CheckAttributeExistsRestAction(data);
            case actionType.REST_CHECK_ATTRIBUTE_TYPE:
                return new CheckAttributeTypeRestAction(data);
            case actionType.REST_CHECK_ATTRIBUTE_VALUE:
                return new CheckAttributeValueRestAction(data);
            case actionType.REST_CHECK_HEADER_FIELD:
                return new CheckHeaderFieldRestAction(data);
            case actionType.REST_CHECK_FOR_TEXT:
                return new CheckHTTPBodyTextRestAction(data);
            case actionType.REST_CHECK_STATUS:
                return new CheckStatusRestAction(data);
            case actionType.REST_VALIDATE_JSON:
                return new ValidateJsonAction(data);

            // general actions
            case actionType.GENERAL_ASSERT_COUNTER:
                return new AssertCounterAction(data);
            case actionType.GENERAL_ASSERT_VARIABLE:
                return new AssertVariableAction(data);
            case actionType.GENERAL_INCREMENT_COUNTER:
                return new IncrementCounterGeneralAction(data);
            case actionType.GENERAL_SET_COUNTER:
                return new SetCounterGeneralAction(data);
            case actionType.GENERAL_SET_VARIABLE_BY_COOKIE:
                return new SetVariableByCookieAction(data);
            case actionType.GENERAL_SET_VARIABLE_BY_JSON:
                return new SetVariableByJsonAttributeGeneralAction(data);
            case actionType.GENERAL_SET_VARIABLE_BY_HTML:
                return new SetVariableByNodeGeneralAction(data);
            case actionType.GENERAL_SET_VARIABLE:
                return new SetVariableGeneralAction(data);
            case actionType.GENERAL_SET_VARIABLE_BY_NODE_ATTRIBUTE:
                return new SetVariableByNodeAttributeGeneralAction(data);
            case actionType.GENERAL_SET_VARIABLE_BY_NODE_COUNT:
                return new SetVariableByNodeCountAction(data);
            case actionType.GENERAL_SET_VARIABLE_BY_REGEX_GROUP:
                return new SetVariableByRegexGroup(data);
            case actionType.WAIT:
                return new WaitGeneralAction(data);
            case actionType.WAIT_FOR_TITLE:
                return new WaitForTitleAction(data);
            case actionType.WAIT_FOR_NODE:
                return new WaitForNodeAction(data);
            case actionType.WAIT_FOR_TEXT:
                return new WaitForTextAction(data);
            case actionType.WAIT_FOR_NODE_ATTRIBUTE:
                return new WaitForNodeAttributeAction(data);
        }
    }

    /**
     * Creates a new action from a given type.
     *
     * @param {string} type - The type of the action that should be created.
     * @returns {*}
     */
    createFromType(type) {
        return this.create({type: type});
    }
}
