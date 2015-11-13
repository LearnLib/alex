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
            case SelectWebAction.type:
                return new SelectWebAction(data);
            case SubmitWebAction.type:
                return new SubmitWebAction(data);
            case GoToWebAction.type:
                return new GoToWebAction(data);
            case FillWebAction.type:
                return new FillWebAction(data);
            case ClickWebAction.type:
                return new ClickWebAction(data);
            case ClickLinkByTextWebAction.type:
                return new ClickLinkByTextWebAction(data);
            case ClearWebAction.type:
                return new ClearWebAction(data);
            case CheckPageTitleAction.type:
                return new CheckPageTitleAction(data);
            case CheckForTextWebAction.type:
                return new CheckForTextWebAction(data);
            case CheckForNodeWebAction.type:
                return new CheckForNodeWebAction(data);

            // rest actions
            case CallRestAction.type:
                return new CallRestAction(data);
            case CheckAttributeExistsRestAction.type:
                return new CheckAttributeExistsRestAction(data);
            case CheckAttributeTypeRestAction.type:
                return new CheckAttributeTypeRestAction(data);
            case CheckAttributeValueRestAction.type:
                return new CheckAttributeValueRestAction(data);
            case CheckHeaderFieldRestAction.type:
                return new CheckHeaderFieldRestAction(data);
            case CheckHTTPBodyTextRestAction.type:
                return new CheckHTTPBodyTextRestAction(data);
            case CheckStatusRestAction.type:
                return new CheckStatusRestAction(data);

            // general actions
            case ExecuteSymbolGeneralAction.type:
                return new ExecuteSymbolGeneralAction(data);
            case AssertCounterAction.type:
                return new AssertCounterAction(data);
            case AssertVariableAction.type:
                return new AssertVariableAction(data);
            case IncrementCounterGeneralAction.type:
                return new IncrementCounterGeneralAction(data);
            case SetCounterGeneralAction.type:
                return new SetCounterGeneralAction(data);
            case SetVariableByCookieAction.type:
                return new SetVariableByCookieAction(data);
            case SetVariableByJsonAttributeGeneralAction.type:
                return new SetVariableByJsonAttributeGeneralAction(data);
            case SetVariableByNodeGeneralAction.type:
                return new SetVariableByNodeGeneralAction(data);
            case SetVariableGeneralAction.type:
                return new SetVariableGeneralAction(data);
            case WaitGeneralAction.type:
                return new WaitGeneralAction(data);
        }
    };

    /**
     * Creates a new action from a given type
     * @param {string} type - The type of the action that should be created
     * @returns {*}
     */
    createFromType(type) {
        return this.create({type: type});
    }
}

export default new ActionService();