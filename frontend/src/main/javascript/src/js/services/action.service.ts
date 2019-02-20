/*
 * Copyright 2015 - 2019 TU Dortmund
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
import {AssertCounterAction} from '../entities/actions/misc/assert-counter-action';
import {AssertVariableAction} from '../entities/actions/misc/assert-variable-action';
import {IncrementCounterGeneralAction} from '../entities/actions/misc/increment-counter-action';
import {SetCounterGeneralAction} from '../entities/actions/misc/set-counter-action';
import {SetVariableGeneralAction} from '../entities/actions/misc/set-variable-action';
import {SetVariableByCookieAction} from '../entities/actions/misc/set-variable-by-cookie-action';
import {SetVariableByHttpResponseAction} from '../entities/actions/misc/set-variable-by-http-response';
import {SetVariableByJsonAttributeGeneralAction} from '../entities/actions/misc/set-variable-by-json-attribute-action';
import {SetVariableByNodeGeneralAction} from '../entities/actions/misc/set-variable-by-node-action';
import {SetVariableByNodeAttributeGeneralAction} from '../entities/actions/misc/set-variable-by-node-attribute-action';
import {SetVariableByNodeCountAction} from '../entities/actions/misc/set-variable-by-node-count-action';
import {SetVariableByRegexGroup} from '../entities/actions/misc/set-variable-by-regex-group-action';
import {WaitGeneralAction} from '../entities/actions/misc/wait-action';
import {CheckAttributeExistsRestAction} from '../entities/actions/rest/check-attribute-exists-action';
import {CheckAttributeTypeRestAction} from '../entities/actions/rest/check-attribute-type-action';
import {CheckAttributeValueRestAction} from '../entities/actions/rest/check-attribute-value-action';
import {CheckHeaderFieldRestAction} from '../entities/actions/rest/check-header-field-action';
import {CheckHTTPBodyTextRestAction} from '../entities/actions/rest/check-http-body-action';
import {CheckStatusRestAction} from '../entities/actions/rest/check-status-action';
import {CallRestAction} from '../entities/actions/rest/request-action';
import {ValidateJsonAction} from '../entities/actions/rest/validate-json-action';
import {AlertAcceptDismissAction} from '../entities/actions/web/alert-accept-dismiss-action';
import {AlertGetTextAction} from '../entities/actions/web/alert-get-text-action';
import {AlertSendKeysAction} from '../entities/actions/web/alert-send-keys-action';
import {BrowserAction} from '../entities/actions/web/browser-action';
import {CheckNodeAttributeValueAction} from '../entities/actions/web/check-attribute-value-action';
import {CheckForNodeWebAction} from '../entities/actions/web/check-for-node-action';
import {CheckForTextWebAction} from '../entities/actions/web/check-for-text-action';
import {CheckNodeSelectedAction} from '../entities/actions/web/check-node-selected-action';
import {CheckPageTitleAction} from '../entities/actions/web/check-page-title-action';
import {ClearWebAction} from '../entities/actions/web/clear-action';
import {ClickWebAction} from '../entities/actions/web/click-action';
import {ClickElementByTextAction} from '../entities/actions/web/click-element-by-text';
import {ClickLinkByTextWebAction} from '../entities/actions/web/click-link-by-text-action';
import {ExecuteScriptAction} from '../entities/actions/web/execute-script-action';
import {MoveMouseAction} from '../entities/actions/web/move-mouse-action';
import {GoToWebAction} from '../entities/actions/web/open-url-action';
import {PressKeyAction} from '../entities/actions/web/press-key-action';
import {SelectWebAction} from '../entities/actions/web/select-action';
import {FillWebAction} from '../entities/actions/web/send-keys-action';
import {SubmitWebAction} from '../entities/actions/web/submit-action';
import {SwitchToAction} from '../entities/actions/web/switch-to-action';
import {SwitchToFrameAction} from '../entities/actions/web/switch-to-frame';
import {UploadFileAction} from '../entities/actions/web/upload-file-action';
import {WaitForNodeAction} from '../entities/actions/web/wait-for-node-action';
import {WaitForTextAction} from '../entities/actions/web/wait-for-text-action';
import {WaitForTitleAction} from '../entities/actions/web/wait-for-title-action';
import {WaitForNodeAttributeAction} from '../entities/actions/web/wiat-for-node-attribute-action';
import {SetVariableByHttpStatusAction} from '../entities/actions/misc/set-variable-by-http-status';
import {Action} from '../entities/actions/action';

/**
 * The service that is used to create new actions.
 */
export class ActionService {

  /**
   * Creates an action from a given object.
   *
   * @param data The object to create an action from.
   * @returns The created action.
   */
  create(data: any): Action {
    switch (data.type) {

      // web actions
      case actionType.WEB_ALERT_ACCEPT_DISMISS:
        return new AlertAcceptDismissAction(data);
      case actionType.WEB_ALERT_GET_TEXT:
        return new AlertGetTextAction(data);
      case actionType.WEB_ALERT_SEND_KEYS:
        return new AlertSendKeysAction(data);
      case actionType.WEB_BROWSER:
        return new BrowserAction(data);
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
      case actionType.WEB_CLICK_ELEMENT_BY_TEXT:
        return new ClickElementByTextAction(data);
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
      case actionType.WEB_CHECK_NODE_SELECTED:
        return new CheckNodeSelectedAction(data);
      case actionType.WEB_PRESS_KEY:
        return new PressKeyAction(data);
      case actionType.WEB_CHECK_ATTRIBUTE_VALUE:
        return new CheckNodeAttributeValueAction(data);
      case actionType.WEB_SWITCH_TO:
        return new SwitchToAction(data);
      case actionType.WEB_SWITCH_TO_FRAME:
        return new SwitchToFrameAction(data);
      case actionType.WEB_UPLOAD_FILE:
        return new UploadFileAction(data);

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
      case actionType.GENERAL_SET_VARIABLE_BY_HTTP_RESPONSE:
        return new SetVariableByHttpResponseAction(data);
      case actionType.GENERAL_SET_VARIABLE_BY_HTTP_STATUS:
        return new SetVariableByHttpStatusAction(data);
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
   * @param type The type of the action that should be created.
   * @returns The create action.
   */
  createFromType(type: string): Action {
    return this.create({type});
  }
}
