// web actions
import SelectWebAction from '../../../src/js/entities/actions/webActions/SelectWebAction';
import SubmitWebAction from '../../../src/js/entities/actions/webActions/SubmitWebAction';
import GoToWebAction from '../../../src/js/entities/actions/webActions/GoToWebAction';
import FillWebAction from '../../../src/js/entities/actions/webActions/FillWebAction';
import ClickWebAction from '../../../src/js/entities/actions/webActions/ClickWebAction';
import ClickLinkByTextWebAction from '../../../src/js/entities/actions/webActions/ClickLinkByTextWebAction';
import ClearWebAction from '../../../src/js/entities/actions/webActions/ClearWebAction';
import CheckPageTitleAction from '../../../src/js/entities/actions/webActions/CheckPageTitleAction';
import CheckForTextWebAction from '../../../src/js/entities/actions/webActions/CheckForTextWebAction';
import CheckForNodeWebAction from '../../../src/js/entities/actions/webActions/CheckForNodeWebAction';
import WaitForNodeAction from '../../../src/js/entities/actions/webActions/WaitForNodeAction';
import WaitForTitleAction from '../../../src/js/entities/actions/webActions/WaitForTitleAction';

// rest actions
import CallRestAction from '../../../src/js/entities/actions/restActions/CallRestAction';
import CheckAttributeExistsRestAction from '../../../src/js/entities/actions/restActions/CheckAttributeExistsRestAction';
import CheckAttributeTypeRestAction from '../../../src/js/entities/actions/restActions/CheckAttributeTypeRestAction';
import CheckAttributeValueRestAction from '../../../src/js/entities/actions/restActions/CheckAttributeValueRestAction';
import CheckHeaderFieldRestAction from '../../../src/js/entities/actions/restActions/CheckHeaderFieldRestAction';
import CheckHTTPBodyTextRestAction from '../../../src/js/entities/actions/restActions/CheckHTTPBodyTextRestAction';
import CheckStatusRestAction from '../../../src/js/entities/actions/restActions/CheckStatusRestAction';

// general actions
import ExecuteSymbolGeneralAction from '../../../src/js/entities/actions/generalActions/ExecuteSymbolGeneralAction';
import AssertCounterAction from '../../../src/js/entities/actions/generalActions/AssertCounterAction';
import AssertVariableAction from '../../../src/js/entities/actions/generalActions/AssertVariableAction';
import IncrementCounterGeneralAction from '../../../src/js/entities/actions/generalActions/IncrementCounterGeneralAction';
import SetCounterGeneralAction from '../../../src/js/entities/actions/generalActions/SetCounterGeneralAction';
import SetVariableByCookieAction from '../../../src/js/entities/actions/generalActions/SetVariableByCookieAction';
import SetVariableByJsonAttributeGeneralAction from '../../../src/js/entities/actions/generalActions/SetVariableByJsonAttributeGeneralAction';
import SetVariableByNodeGeneralAction from '../../../src/js/entities/actions/generalActions/SetVariableByNodeGeneralAction';
import SetVariableGeneralAction from '../../../src/js/entities/actions/generalActions/SetVariableGeneralAction';
import WaitGeneralAction from '../../../src/js/entities/actions/generalActions/WaitGeneralAction';

describe('ActionService', () => {
    let ActionService;

    let actionType;

    beforeEach(angular.mock.module('ALEX'));
    beforeEach(angular.mock.inject($injector => {
        ActionService = $injector.get('ActionService');
        actionType = $injector.get('actionType');
    }));

    it('should correctly create web actions from a given type', () => {
        let action = ActionService.createFromType(actionType.WEB_CHECK_NODE);
        expect(action instanceof CheckForNodeWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CHECK_TEXT);
        expect(action instanceof CheckForTextWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CHECK_PAGE_TITLE);
        expect(action instanceof CheckPageTitleAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CLEAR);
        expect(action instanceof ClearWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CLICK_LINK_BY_TEXT);
        expect(action instanceof ClickLinkByTextWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_CLICK);
        expect(action instanceof ClickWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_FILL);
        expect(action instanceof FillWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_GO_TO);
        expect(action instanceof GoToWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_SELECT);
        expect(action instanceof SelectWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WEB_SUBMIT);
        expect(action instanceof SubmitWebAction).toBe(true);
        action = ActionService.createFromType(actionType.WAIT_FOR_NODE);
        expect(action instanceof WaitForNodeAction).toBe(true);
        action = ActionService.createFromType(actionType.WAIT_FOR_TITLE);
        expect(action instanceof WaitForTitleAction).toBe(true);
    });

    it('should should correctly create rest actions from a given type', () => {
        let action = ActionService.createFromType(actionType.REST_CALL);
        expect(action instanceof CallRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_ATTRIBUTE_EXISTS);
        expect(action instanceof CheckAttributeExistsRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_ATTRIBUTE_TYPE);
        expect(action instanceof CheckAttributeTypeRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_ATTRIBUTE_VALUE);
        expect(action instanceof CheckAttributeValueRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_FOR_TEXT);
        expect(action instanceof CheckHTTPBodyTextRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_HEADER_FIELD);
        expect(action instanceof CheckHeaderFieldRestAction).toBe(true);
        action = ActionService.createFromType(actionType.REST_CHECK_STATUS);
        expect(action instanceof CheckStatusRestAction).toBe(true);
    });

    it('should correctly create general actions from a given type', () => {
        let action = ActionService.createFromType(actionType.GENERAL_ASSERT_COUNTER);
        expect(action instanceof AssertCounterAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_ASSERT_VARIABLE);
        expect(action instanceof AssertVariableAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_EXECUTE_SYMBOL);
        expect(action instanceof ExecuteSymbolGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_INCREMENT_COUNTER);
        expect(action instanceof IncrementCounterGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_COUNTER);
        expect(action instanceof SetCounterGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_VARIABLE_BY_COOKIE);
        expect(action instanceof SetVariableByCookieAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_VARIABLE_BY_JSON);
        expect(action instanceof SetVariableByJsonAttributeGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_VARIABLE_BY_HTML);
        expect(action instanceof SetVariableByNodeGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.GENERAL_SET_VARIABLE);
        expect(action instanceof SetVariableGeneralAction).toBe(true);
        action = ActionService.createFromType(actionType.WAIT);
        expect(action instanceof WaitGeneralAction).toBe(true);
    })
});