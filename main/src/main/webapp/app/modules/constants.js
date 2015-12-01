const learnAlgorithm = {
    LSTAR: 'LSTAR',
    DHC: 'DHC',
    DISCRIMINATION_TREE: 'DISCRIMINATION_TREE',
    TTT: 'TTT'
};

const webBrowser = {
    FIREFOX: 'FIREFOX',
    CHROME: 'CHROME',
    IE: 'IE',
    HTMLUNITDRIVER: 'HTMLUNITDRIVER'
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

    // rest actions
    REST_CALL: 'rest_call',
    REST_CHECK_ATTRIBUTE_EXISTS: 'rest_checkAttributeExists',
    REST_CHECK_ATTRIBUTE_TYPE: 'rest_checkAttributeType',
    REST_CHECK_ATTRIBUTE_VALUE: 'rest_checkAttributeValue',
    REST_CHECK_HEADER_FIELD: 'rest_checkHeaderField',
    REST_CHECK_FOR_TEXT: 'rest_checkForText',
    REST_CHECK_STATUS: 'rest_checkStatus'
};

export {learnAlgorithm, webBrowser, eqOracleType, events, chartMode, actionType};