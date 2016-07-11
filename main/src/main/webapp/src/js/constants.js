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

export const learnAlgorithm = {
    LSTAR: 'LSTAR',
    DHC: 'DHC',
    DISCRIMINATION_TREE: 'DISCRIMINATION_TREE',
    TTT: 'TTT'
};

export const webBrowser = {
    CHROME: 'chrome',
    FIREFOX: 'firefox',
    HTMLUNITDRIVER: 'htmlunitdriver'
};

export const eqOracleType = {
    RANDOM: 'random_word',
    COMPLETE: 'complete',
    SAMPLE: 'sample',
    WMETHOD: 'wmethod'
};

export const userRole = {
    ADMIN: 'ADMIN',
    REGISTERED: 'REGISTERED'
};

export const events = {

    // project related events
    PROJECT_CREATED: 'project:created',
    PROJECT_UPDATED: 'project:updated',
    PROJECT_DELETED: 'project:deleted',
    PROJECT_OPENED: 'project:opened',

    // symbol group related events
    GROUP_CREATED: 'group:created',
    GROUP_UPDATED: 'group:updated',
    GROUP_DELETED: 'group:deleted',

    // hypothesis related events
    HYPOTHESIS_LABEL_SELECTED: 'hypothesis:labelSelected',
    HYPOTHESIS_LAYOUT_UPDATED: 'hypothesis:layoutUpdated',

    // user related events
    USER_UPDATED: 'user:updated',
    USER_DELETED: 'user:deleted',
    USER_LOGGED_IN: 'user:loggedIn',

    // action related events
    ACTION_CREATED: 'action:created',
    ACTION_UPDATED: 'action:updated',

    // symbol related events
    SYMBOL_CREATED: 'symbol:created',
    SYMBOL_UPDATED: 'symbol:updated',
    SYMBOLS_MOVED: 'symbols:moved',

    // learn config related events
    LEARN_CONFIG_UPDATED: 'learnConfig:updated',

    // file related events
    FILE_LOADED: 'file:loaded',

    // results related events
    RESULT_SELECTED: 'result:selected'
};

export const chartMode = {
    CUMULATED: 'cumulated',
    COMPLETE: 'complete'
};

export const actionType = {

    // web actions
    WEB_CHECK_NODE: 'web_checkForNode',
    WEB_CHECK_TEXT: 'web_checkForText',
    WEB_CHECK_PAGE_TITLE: 'web_checkPageTitle',
    WEB_CLEAR: 'web_clear',
    WEB_CLICK_LINK_BY_TEXT: 'web_clickLinkByText',
    WEB_CLICK: 'web_click',
    WEB_EXECUTE_SCRIPT: 'web_executeScript',
    WEB_FILL: 'web_fill',
    WEB_GO_TO: 'web_goto',
    WEB_MOUSE_MOVE: 'web_moveMouse',
    WEB_SELECT: 'web_select',
    WEB_SUBMIT: 'web_submit',
    WAIT_FOR_NODE: 'web_waitForNode',
    WAIT_FOR_TITLE: 'web_waitForTitle',

    // rest actions
    REST_CALL: 'rest_call',
    REST_CHECK_ATTRIBUTE_EXISTS: 'rest_checkAttributeExists',
    REST_CHECK_ATTRIBUTE_TYPE: 'rest_checkAttributeType',
    REST_CHECK_ATTRIBUTE_VALUE: 'rest_checkAttributeValue',
    REST_CHECK_HEADER_FIELD: 'rest_checkHeaderField',
    REST_CHECK_FOR_TEXT: 'rest_checkForText',
    REST_CHECK_STATUS: 'rest_checkStatus',

    // general actions
    GENERAL_ASSERT_COUNTER: 'assertCounter',
    GENERAL_ASSERT_VARIABLE: 'assertVariable',
    GENERAL_EXECUTE_SYMBOL: 'executeSymbol',
    GENERAL_INCREMENT_COUNTER: 'incrementCounter',
    GENERAL_SET_COUNTER: 'setCounter',
    GENERAL_SET_VARIABLE_BY_COOKIE: 'setVariableByCookie',
    GENERAL_SET_VARIABLE_BY_JSON: 'setVariableByJSON',
    GENERAL_SET_VARIABLE_BY_HTML: 'setVariableByHTML',
    GENERAL_SET_VARIABLE_BY_NODE_ATTRIBUTE: 'setVariableByNodeAttribute',
    GENERAL_SET_VARIABLE: 'setVariable',
    WAIT: 'wait'
};