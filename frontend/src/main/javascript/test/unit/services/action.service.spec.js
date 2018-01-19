// web actions
import {SelectWebAction} from '../../../src/js/entities/actions/web/select-action';
import {SubmitWebAction} from '../../../src/js/entities/actions/web/submit-action';
import {GoToWebAction} from '../../../src/js/entities/actions/web/open-url-action';
import {FillWebAction} from '../../../src/js/entities/actions/web/send-keys-action';
import {ClickWebAction} from '../../../src/js/entities/actions/web/click-action';
import {ClickLinkByTextWebAction} from '../../../src/js/entities/actions/web/click-link-by-text-action';
import {ClearWebAction} from '../../../src/js/entities/actions/web/clear-action';
import {CheckPageTitleAction} from '../../../src/js/entities/actions/web/check-page-title-action';
import {CheckForTextWebAction} from '../../../src/js/entities/actions/web/check-for-text-action';
import {CheckForNodeWebAction} from '../../../src/js/entities/actions/web/check-for-node-action';
import {WaitForNodeAction} from '../../../src/js/entities/actions/web/wait-for-node-action';
import {WaitForTitleAction} from '../../../src/js/entities/actions/web/wait-for-title-action';

// rest actions
import {CallRestAction} from '../../../src/js/entities/actions/rest/request-action';
import {CheckAttributeExistsRestAction} from '../../../src/js/entities/actions/rest/check-attribute-exists-action';
import {CheckAttributeTypeRestAction} from '../../../src/js/entities/actions/rest/check-attribute-type-action';
import {CheckAttributeValueRestAction} from '../../../src/js/entities/actions/rest/check-attribute-value-action';
import {CheckHeaderFieldRestAction} from '../../../src/js/entities/actions/rest/check-header-field-action';
import {CheckHTTPBodyTextRestAction} from '../../../src/js/entities/actions/rest/check-http-body-action';
import {CheckStatusRestAction} from '../../../src/js/entities/actions/rest/check-status-action';

// general actions
import {AssertCounterAction} from '../../../src/js/entities/actions/misc/assert-counter-action';
import {AssertVariableAction} from '../../../src/js/entities/actions/misc/assert-variable-action';
import {IncrementCounterGeneralAction} from '../../../src/js/entities/actions/misc/increment-counter-action';
import {SetCounterGeneralAction} from '../../../src/js/entities/actions/misc/set-counter-action';
import {SetVariableByCookieAction} from '../../../src/js/entities/actions/misc/set-variable-by-cookie-action';
import {SetVariableByJsonAttributeGeneralAction} from '../../../src/js/entities/actions/misc/set-variable-by-json-attribute-action';
import {SetVariableByNodeGeneralAction} from '../../../src/js/entities/actions/misc/set-variable-by-node-action';
import {SetVariableGeneralAction} from '../../../src/js/entities/actions/misc/set-variable-action';
import {WaitGeneralAction} from '../../../src/js/entities/actions/misc/wait-action';

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
