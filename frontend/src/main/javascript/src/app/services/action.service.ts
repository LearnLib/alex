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

import { actionType } from '../constants';
import { AssertCounterAction } from '../entities/actions/misc/assert-counter-action';
import { AssertVariableAction } from '../entities/actions/misc/assert-variable-action';
import { IncrementCounterGeneralAction } from '../entities/actions/misc/increment-counter-action';
import { SetCounterGeneralAction } from '../entities/actions/misc/set-counter-action';
import { SetVariableGeneralAction } from '../entities/actions/misc/set-variable-action';
import { SetVariableByCookieAction } from '../entities/actions/misc/set-variable-by-cookie-action';
import { SetVariableByHttpResponseAction } from '../entities/actions/misc/set-variable-by-http-response';
import { SetVariableByJsonAttributeGeneralAction } from '../entities/actions/misc/set-variable-by-json-attribute-action';
import { SetVariableByNodeGeneralAction } from '../entities/actions/misc/set-variable-by-node-action';
import { SetVariableByNodeAttributeGeneralAction } from '../entities/actions/misc/set-variable-by-node-attribute-action';
import { SetVariableByNodeCountAction } from '../entities/actions/misc/set-variable-by-node-count-action';
import { SetVariableByRegexGroup } from '../entities/actions/misc/set-variable-by-regex-group-action';
import { WaitGeneralAction } from '../entities/actions/misc/wait-action';
import { CheckAttributeExistsRestAction } from '../entities/actions/rest/check-attribute-exists-action';
import { CheckAttributeTypeRestAction } from '../entities/actions/rest/check-attribute-type-action';
import { CheckAttributeValueRestAction } from '../entities/actions/rest/check-attribute-value-action';
import { CheckHeaderFieldRestAction } from '../entities/actions/rest/check-header-field-action';
import { CheckHTTPBodyTextRestAction } from '../entities/actions/rest/check-http-body-action';
import { CheckStatusRestAction } from '../entities/actions/rest/check-status-action';
import { CallRestAction } from '../entities/actions/rest/request-action';
import { ValidateJsonAction } from '../entities/actions/rest/validate-json-action';
import { AlertAcceptDismissAction } from '../entities/actions/web/alert-accept-dismiss-action';
import { AlertGetTextAction } from '../entities/actions/web/alert-get-text-action';
import { AlertSendKeysAction } from '../entities/actions/web/alert-send-keys-action';
import { BrowserAction } from '../entities/actions/web/browser-action';
import { CheckNodeAttributeValueAction } from '../entities/actions/web/check-attribute-value-action';
import { CheckForNodeWebAction } from '../entities/actions/web/check-for-node-action';
import { CheckForTextWebAction } from '../entities/actions/web/check-for-text-action';
import { CheckNodeSelectedAction } from '../entities/actions/web/check-node-selected-action';
import { CheckPageTitleAction } from '../entities/actions/web/check-page-title-action';
import { ClearWebAction } from '../entities/actions/web/clear-action';
import { ClickWebAction } from '../entities/actions/web/click-action';
import { ClickElementByTextAction } from '../entities/actions/web/click-element-by-text';
import { ClickLinkByTextWebAction } from '../entities/actions/web/click-link-by-text-action';
import { ExecuteScriptAction } from '../entities/actions/web/execute-script-action';
import { MoveMouseAction } from '../entities/actions/web/move-mouse-action';
import { GoToWebAction } from '../entities/actions/web/open-url-action';
import { PressKeyAction } from '../entities/actions/web/press-key-action';
import { SelectWebAction } from '../entities/actions/web/select-action';
import { FillWebAction } from '../entities/actions/web/send-keys-action';
import { SubmitWebAction } from '../entities/actions/web/submit-action';
import { SwitchToAction } from '../entities/actions/web/switch-to-action';
import { SwitchToFrameAction } from '../entities/actions/web/switch-to-frame';
import { UploadFileAction } from '../entities/actions/web/upload-file-action';
import { WaitForNodeAction } from '../entities/actions/web/wait-for-node-action';
import { WaitForTextAction } from '../entities/actions/web/wait-for-text-action';
import { WaitForTitleAction } from '../entities/actions/web/wait-for-title-action';
import { WaitForNodeAttributeAction } from '../entities/actions/web/wiat-for-node-attribute-action';
import { SetVariableByHttpStatusAction } from '../entities/actions/misc/set-variable-by-http-status';
import { Action } from '../entities/actions/action';
import { DragAndDropAction } from '../entities/actions/web/drag-and-drop-action';
import { DragAndDropByAction } from '../entities/actions/web/drag-and-drop-by-action';
import { WaitForScriptAction } from '../entities/actions/web/wait-for-script-action';

/**
 * The service that is used to create new actions.
 */
export class ActionService {
  private registry = {
    // web actions
    [actionType.WEB_ALERT_ACCEPT_DISMISS]: (data) => new AlertAcceptDismissAction(data),
    [actionType.WEB_ALERT_GET_TEXT]: (data) => new AlertGetTextAction(data),
    [actionType.WEB_ALERT_SEND_KEYS]: (data) => new AlertSendKeysAction(data),
    [actionType.WEB_BROWSER]: (data) => new BrowserAction(data),
    [actionType.WEB_SELECT]: (data) => new SelectWebAction(data),
    [actionType.WEB_SUBMIT]: (data) => new SubmitWebAction(data),
    [actionType.WEB_GO_TO]: (data) => new GoToWebAction(data),
    [actionType.WEB_FILL]: (data) => new FillWebAction(data),
    [actionType.WEB_EXECUTE_SCRIPT]: (data) => new ExecuteScriptAction(data),
    [actionType.WEB_CLICK]: (data) => new ClickWebAction(data),
    [actionType.WEB_MOUSE_MOVE]: (data) => new MoveMouseAction(data),
    [actionType.WEB_CLICK_ELEMENT_BY_TEXT]: (data) => new ClickElementByTextAction(data),
    [actionType.WEB_CLICK_LINK_BY_TEXT]: (data) => new ClickLinkByTextWebAction(data),
    [actionType.WEB_CLEAR]: (data) => new ClearWebAction(data),
    [actionType.WEB_CHECK_PAGE_TITLE]: (data) => new CheckPageTitleAction(data),
    [actionType.WEB_CHECK_TEXT]: (data) => new CheckForTextWebAction(data),
    [actionType.WEB_CHECK_NODE]: (data) => new CheckForNodeWebAction(data),
    [actionType.WEB_CHECK_NODE_SELECTED]: (data) => new CheckNodeSelectedAction(data),
    [actionType.WEB_PRESS_KEY]: (data) => new PressKeyAction(data),
    [actionType.WEB_CHECK_ATTRIBUTE_VALUE]: (data) => new CheckNodeAttributeValueAction(data),
    [actionType.WEB_SWITCH_TO]: (data) => new SwitchToAction(data),
    [actionType.WEB_SWITCH_TO_FRAME]: (data) => new SwitchToFrameAction(data),
    [actionType.WEB_UPLOAD_FILE]: (data) => new UploadFileAction(data),
    [actionType.WEB_DRAG_AND_DROP]: (data) => new DragAndDropAction(data),
    [actionType.WEB_DRAG_AND_DROP_BY]: (data) => new DragAndDropByAction(data),
    [actionType.WEB_WAIT_FOR_SCRIPT]: (data) => new WaitForScriptAction(data),

    // rest actions
    [actionType.REST_CALL]: (data) => new CallRestAction(data),
    [actionType.REST_CHECK_ATTRIBUTE_EXISTS]: (data) => new CheckAttributeExistsRestAction(data),
    [actionType.REST_CHECK_ATTRIBUTE_TYPE]: (data) => new CheckAttributeTypeRestAction(data),
    [actionType.REST_CHECK_ATTRIBUTE_VALUE]: (data) => new CheckAttributeValueRestAction(data),
    [actionType.REST_CHECK_HEADER_FIELD]: (data) => new CheckHeaderFieldRestAction(data),
    [actionType.REST_CHECK_FOR_TEXT]: (data) => new CheckHTTPBodyTextRestAction(data),
    [actionType.REST_CHECK_STATUS]: (data) => new CheckStatusRestAction(data),
    [actionType.REST_VALIDATE_JSON]: (data) => new ValidateJsonAction(data),

    // general actions
    [actionType.GENERAL_ASSERT_COUNTER]: (data) => new AssertCounterAction(data),
    [actionType.GENERAL_ASSERT_VARIABLE]: (data) => new AssertVariableAction(data),
    [actionType.GENERAL_INCREMENT_COUNTER]: (data) => new IncrementCounterGeneralAction(data),
    [actionType.GENERAL_SET_COUNTER]: (data) => new SetCounterGeneralAction(data),
    [actionType.GENERAL_SET_VARIABLE_BY_COOKIE]: (data) => new SetVariableByCookieAction(data),
    [actionType.GENERAL_SET_VARIABLE_BY_JSON]: (data) => new SetVariableByJsonAttributeGeneralAction(data),
    [actionType.GENERAL_SET_VARIABLE_BY_HTML]: (data) => new SetVariableByNodeGeneralAction(data),
    [actionType.GENERAL_SET_VARIABLE_BY_HTTP_RESPONSE]: (data) => new SetVariableByHttpResponseAction(data),
    [actionType.GENERAL_SET_VARIABLE_BY_HTTP_STATUS]: (data) => new SetVariableByHttpStatusAction(data),
    [actionType.GENERAL_SET_VARIABLE]: (data) => new SetVariableGeneralAction(data),
    [actionType.GENERAL_SET_VARIABLE_BY_NODE_ATTRIBUTE]: (data) => new SetVariableByNodeAttributeGeneralAction(data),
    [actionType.GENERAL_SET_VARIABLE_BY_NODE_COUNT]: (data) => new SetVariableByNodeCountAction(data),
    [actionType.GENERAL_SET_VARIABLE_BY_REGEX_GROUP]: (data) => new SetVariableByRegexGroup(data),
    [actionType.WAIT]: (data) => new WaitGeneralAction(data),
    [actionType.WAIT_FOR_TITLE]: (data) => new WaitForTitleAction(data),
    [actionType.WAIT_FOR_NODE]: (data) => new WaitForNodeAction(data),
    [actionType.WAIT_FOR_TEXT]: (data) => new WaitForTextAction(data),
    [actionType.WAIT_FOR_NODE_ATTRIBUTE]: (data) => new WaitForNodeAttributeAction(data),
  };

  /**
   * Creates an action from a given object.
   *
   * @param data The object to create an action from.
   * @returns The created action.
   */
  create(data: any): Action {
    return this.registry[data.type](data);
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
