const learnAlgorithm = {
    LSTAR: 'LSTAR',
    DHC: 'DHC',
    DISCRIMINATION_TREE: 'DISCRIMINATION_TREE',
    TTT: 'TTT'
};

const webBrowser = {
    FIREFOX: 'firefox',
    CHROME: 'chrome',
    IE: 'ie',
    HTMLUNITDRIVER: 'htmlunitdriver'
};

const eqOracleType = {
    RANDOM: 'random_word',
    COMPLETE: 'complete',
    SAMPLE: 'sample',
    WMETHOD: 'wmethod'
};

const events = {

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
    FILE_LOADED: 'file:loaded'
};

const chartMode = {
    CUMULATED: 'cumulated',
    COMPLETE: 'complete'
};

const actionType = {

    // web actions
    WEB_CHECK_NODE: 'web_checkForNode',
    WEB_CHECK_TEXT: 'web_checkForText',
    WEB_CHECK_PAGE_TITLE: 'web_checkPageTitle',
    WEB_CLEAR: 'web_clear',
    WEB_CLICK_LINK_BY_TEXT: 'web_clickLinkByText',
    WEB_CLICK: 'web_click',
    WEB_FILL: 'web_fill',
    WEB_GO_TO: 'web_goto',
    WEB_SELECT: 'web_select',
    WEB_SUBMIT: 'web_submit',

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
    GENERAL_SET_VARIABLE: 'setVariable',
    GENERAL_WAIT: 'wait'
};

export {learnAlgorithm, webBrowser, eqOracleType, events, chartMode, actionType};