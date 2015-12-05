import {actionType} from '../constants';

// web actions
import SelectWebAction from '../entities/actions/webActions/SelectWebAction';
import SubmitWebAction from '../entities/actions/webActions/SubmitWebAction';
import GoToWebAction from '../entities/actions/webActions/GoToWebAction';
import FillWebAction from '../entities/actions/webActions/FillWebAction';
import ClickWebAction from '../entities/actions/webActions/ClickWebAction';
import ClickLinkByTextWebAction from '../entities/actions/webActions/ClickLinkByTextWebAction';
import ClearWebAction from '../entities/actions/webActions/ClearWebAction';
import CheckPageTitleAction from '../entities/actions/webActions/CheckPageTitleAction';
import CheckForTextWebAction from '../entities/actions/webActions/CheckForTextWebAction';
import CheckForNodeWebAction from '../entities/actions/webActions/CheckForNodeWebAction';

// rest actions
import CallRestAction from '../entities/actions/restActions/CallRestAction';
import CheckAttributeExistsRestAction from '../entities/actions/restActions/CheckAttributeExistsRestAction';
import CheckAttributeTypeRestAction from '../entities/actions/restActions/CheckAttributeTypeRestAction';
import CheckAttributeValueRestAction from '../entities/actions/restActions/CheckAttributeValueRestAction';
import CheckHeaderFieldRestAction from '../entities/actions/restActions/CheckHeaderFieldRestAction';
import CheckHTTPBodyTextRestAction from '../entities/actions/restActions/CheckHTTPBodyTextRestAction';
import CheckStatusRestAction from '../entities/actions/restActions/CheckStatusRestAction';

// general actions
import ExecuteSymbolGeneralAction from '../entities/actions/generalActions/ExecuteSymbolGeneralAction';
import AssertCounterAction from '../entities/actions/generalActions/AssertCounterAction';
import AssertVariableAction from '../entities/actions/generalActions/AssertVariableAction';
import IncrementCounterGeneralAction from '../entities/actions/generalActions/IncrementCounterGeneralAction';
import SetCounterGeneralAction from '../entities/actions/generalActions/SetCounterGeneralAction';
import SetVariableByCookieAction from '../entities/actions/generalActions/SetVariableByCookieAction';
import SetVariableByJsonAttributeGeneralAction from '../entities/actions/generalActions/SetVariableByJsonAttributeGeneralAction';
import SetVariableByNodeGeneralAction from '../entities/actions/generalActions/SetVariableByNodeGeneralAction';
import SetVariableGeneralAction from '../entities/actions/generalActions/SetVariableGeneralAction';
import WaitGeneralAction from '../entities/actions/generalActions/WaitGeneralAction';

/** The service that is used to create new actions */
class ActionService {

    /**
     * Creates an action from a given object
     * @param {object} data - The object to create an action from
     * @returns {*}
     */
    create(data) {
        switch (data.type) {

            // web actions
            case actionType.WEB_SELECT:
                return new SelectWebAction(data);
            case actionType.WEB_SUBMIT:
                return new SubmitWebAction(data);
            case actionType.WEB_GO_TO:
                return new GoToWebAction(data);
            case actionType.WEB_FILL:
                return new FillWebAction(data);
            case actionType.WEB_CLICK:
                return new ClickWebAction(data);
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

            // general actions
            case actionType.GENERAL_EXECUTE_SYMBOL:
                return new ExecuteSymbolGeneralAction(data);
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
            case actionType.GENERAL_WAIT:
                return new WaitGeneralAction(data);
        }
    }

    /**
     * Creates a new action from a given type
     * @param {string} type - The type of the action that should be created
     * @returns {*}
     */
    createFromType(type) {
        return this.create({type: type});
    }
}

export default ActionService;