/*
 * Copyright 2015 - 2022 TU Dortmund
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

export const learningAlgorithm = {
  LSTAR: 'LSTAR',
  DHC: 'DHC',
  DT: 'DT',
  TTT: 'TTT',
  KEARNS_VAZIRANI: 'KEARNS_VAZIRANI'
};

export const symbolParameterType = {
  STRING: 'STRING',
  COUNTER: 'COUNTER'
};

export const eqOracleType = {
  RANDOM: 'random_word',
  COMPLETE: 'complete',
  SAMPLE: 'sample',
  WMETHOD: 'wmethod',
  WP_METHOD: 'wp_method',
  HYPOTHESIS: 'hypothesis',
  TEST_SUITE: 'test_suite'
};

export const userRole = {
  ADMIN: 'ADMIN',
  REGISTERED: 'REGISTERED'
};

export const actionType = {

  // web actions
  WEB_ALERT_ACCEPT_DISMISS: 'web_alertAcceptDismiss',
  WEB_ALERT_GET_TEXT: 'web_alertGetText',
  WEB_ALERT_SEND_KEYS: 'web_alertSendKeys',
  WEB_BROWSER: 'web_browser',
  WEB_CHECK_NODE: 'web_checkForNode',
  WEB_CHECK_TEXT: 'web_checkForText',
  WEB_CHECK_PAGE_TITLE: 'web_checkPageTitle',
  WEB_CHECK_NODE_SELECTED: 'web_checkNodeSelected',
  WEB_CLEAR: 'web_clear',
  WEB_CLICK_ELEMENT_BY_TEXT: 'web_clickElementByText',
  WEB_CLICK_LINK_BY_TEXT: 'web_clickLinkByText',
  WEB_CLICK: 'web_click',
  WEB_DRAG_AND_DROP: 'web_dragAndDrop',
  WEB_DRAG_AND_DROP_BY: 'web_dragAndDropBy',
  WEB_EXECUTE_SCRIPT: 'web_executeScript',
  WEB_FILL: 'web_fill',
  WEB_GO_TO: 'web_goto',
  WEB_MOUSE_MOVE: 'web_moveMouse',
  WEB_SELECT: 'web_select',
  WEB_SUBMIT: 'web_submit',
  WEB_SWITCH_TO: 'web_switchTo',
  WEB_SWITCH_TO_FRAME: 'web_switchToFrame',
  WEB_UPLOAD_FILE: 'web_uploadFile',
  WEB_PRESS_KEY: 'web_pressKey',
  WAIT_FOR_NODE: 'web_waitForNode',
  WAIT_FOR_NODE_ATTRIBUTE: 'web_waitForNodeAttribute',
  WAIT_FOR_TITLE: 'web_waitForTitle',
  WAIT_FOR_TEXT: 'web_waitForText',
  WEB_CHECK_ATTRIBUTE_VALUE: 'web_checkNodeAttributeValue',
  WEB_WAIT_FOR_SCRIPT: 'web_waitForScript',

  // rest actions
  REST_CALL: 'rest_call',
  REST_CHECK_ATTRIBUTE_EXISTS: 'rest_checkAttributeExists',
  REST_CHECK_ATTRIBUTE_TYPE: 'rest_checkAttributeType',
  REST_CHECK_ATTRIBUTE_VALUE: 'rest_checkAttributeValue',
  REST_CHECK_HEADER_FIELD: 'rest_checkHeaderField',
  REST_CHECK_FOR_TEXT: 'rest_checkForText',
  REST_CHECK_STATUS: 'rest_checkStatus',
  REST_VALIDATE_JSON: 'rest_validateJson',

  // general actions
  GENERAL_ASSERT_COUNTER: 'assertCounter',
  GENERAL_ASSERT_VARIABLE: 'assertVariable',
  GENERAL_INCREMENT_COUNTER: 'incrementCounter',
  GENERAL_SET_COUNTER: 'setCounter',
  GENERAL_SET_VARIABLE_BY_COOKIE: 'setVariableByCookie',
  GENERAL_SET_VARIABLE_BY_JSON: 'setVariableByJSON',
  GENERAL_SET_VARIABLE_BY_HTTP_STATUS: 'setVariableByHttpStatus',
  GENERAL_SET_VARIABLE_BY_HTTP_RESPONSE: 'setVariableByHttpResponse',
  GENERAL_SET_VARIABLE_BY_HTML: 'setVariableByHTML',
  GENERAL_SET_VARIABLE_BY_NODE_ATTRIBUTE: 'setVariableByNodeAttribute',
  GENERAL_SET_VARIABLE_BY_NODE_COUNT: 'setVariableByNodeCount',
  GENERAL_SET_VARIABLE_BY_REGEX_GROUP: 'setVariableByRegexGroup',
  GENERAL_SET_VARIABLE: 'setVariable',
  GENERAL_JUMP_TO_LABEL: 'jumpToLabel',
  GENERAL_CREATE_LABEL: 'createLabel',
  WAIT: 'wait'
};

export const supportedKeys = {
  CANCEL: '\\ue001',
  HELP: '\\ue002',
  BACK_SPACE: '\\ue003',
  TAB: '\\ue004',
  CLEAR: '\\ue005',
  RETURN: '\\ue006',
  ENTER: '\\ue007',
  SHIFT: '\\ue008',
  LEFT_SHIFT: '\\ue008',
  CONTROL: '\\ue009',
  LEFT_CONTROL: '\\ue009',
  ALT: '\\ue00a',
  LEFT_ALT: '\\ue00a',
  PAUSE: '\\ue00b',
  ESCAPE: '\\ue00c',
  SPACE: '\\ue00d',
  PAGE_UP: '\\ue00e',
  PAGE_DOWN: '\\ue00f',
  END: '\\ue010',
  HOME: '\\ue011',
  LEFT: '\\ue012',
  ARROW_LEFT: '\\ue012',
  UP: '\\ue013',
  ARROW_UP: '\\ue013',
  RIGHT: '\\ue014',
  ARROW_RIGHT: '\\ue014',
  DOWN: '\\ue015',
  ARROW_DOWN: '\\ue015',
  INSERT: '\\ue016',
  DELETE: '\\ue017',
  SEMICOLON: '\\ue018',
  EQUALS: '\\ue019',
  NUMPAD0: '\\ue01a',
  NUMPAD1: '\\ue01b',
  NUMPAD2: '\\ue01c',
  NUMPAD3: '\\ue01d',
  NUMPAD4: '\\ue01e',
  NUMPAD5: '\\ue01f',
  NUMPAD6: '\\ue020',
  NUMPAD7: '\\ue021',
  NUMPAD8: '\\ue022',
  NUMPAD9: '\\ue023',
  MULTIPLY: '\\ue024',
  ADD: '\\ue025',
  SEPARATOR: '\\ue026',
  SUBTRACT: '\\ue027',
  DECIMAL: '\\ue028',
  DIVIDE: '\\ue029',
  F1: '\\ue031',
  F2: '\\ue032',
  F3: '\\ue033',
  F4: '\\ue034',
  F5: '\\ue035',
  F6: '\\ue036',
  F7: '\\ue037',
  F8: '\\ue038',
  F9: '\\ue039',
  F10: '\\ue03a',
  F11: '\\ue03b',
  F12: '\\ue03c'
};
