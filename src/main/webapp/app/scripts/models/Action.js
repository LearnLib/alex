(function () {

    angular
        .module('weblearner.models')
        .factory('Action', ActionModel);

    ActionModel.$inject = ['actionTypes'];

    function ActionModel(actionTypes) {

        function Action() {
            this.negated = false;
            this.ignoreFailure = false;
        }

        Action.Web = function () {
        };

        Action.Web.SearchForText = function (value, isRegexp) {
            Action.call(this);
            this.type = actionTypes.web.SEARCH_FOR_TEXT;
            this.value = value || null;
            this.regexp = isRegexp || false;
        };

        Action.Web.SearchForText.prototype.toString = function () {
            return 'Search for ' + (this.regexp ? 'regexp' : 'string') + '"' + this.value + '"';
        };

        Action.Web.SearchForNode = function (value, isRegexp) {
            Action.call(this);
            this.type = actionTypes.web.SEARCH_FOR_NODE;
            this.value = value || null;
            this.regexp = isRegexp || false
        };

        Action.Web.SearchForNode.prototype.toString = function () {
            return 'Search for node "' + this.value + '"' + (this.regexp ? 'as regexp' : '');
        };

        Action.Web.Clear = function (node) {
            Action.call(this);
            this.type = actionTypes.web.CLEAR;
            this.node = node || null;
        };

        Action.Web.Clear.prototype.toString = function () {
            return 'Clear element "' + this.node + '"';
        };

        Action.Web.Click = function (node) {
            Action.call(this);
            this.type = actionTypes.web.CLICK;
            this.node = node || null;
        };

        Action.Web.Click.prototype.toString = function () {
            return 'Click on element "' + this.node + '"';
        };

        Action.Web.Fill = function (node, value) {
            Action.call(this);
            this.type = actionTypes.web.FILL;
            this.node = node || null;
            this.value = value || null
        };

        Action.Web.Fill.prototype.toString = function () {
            return 'Fill element "' + this.node + '" with "' + this.value + '"';
        };

        Action.Web.GoTo = function (url) {
            Action.call(this);
            this.type = actionTypes.web.GO_TO;
            this.url = url || null;
        };

        Action.Web.GoTo.prototype.toString = function () {
            return 'Go to URL "' + this.url + '"';
        };

        Action.Web.Submit = function (node) {
            Action.call(this);
            this.type = actionTypes.web.SUBMIT;
            this.node = node || null;
        };

        Action.Web.Submit.prototype.toString = function () {
            return 'Submit element "' + this.node + '"';
        };

        //////////

        Action.Rest = function () {
        };

        Action.Rest.Call = function (method, url, data) {
            Action.call(this);
            this.type = actionTypes.rest.CALL_URL;
            this.method = method || null;
            this.url = url || null;
            this.data = data || null;
        };

        Action.Rest.Call.prototype.toString = function () {
            return 'Make a "' + this.method + '" request to "' + this.url + '"';
        };

        Action.Rest.CheckStatus = function (statusCode) {
            Action.call(this);
            this.type = actionTypes.rest.CHECK_STATUS;
            this.status = statusCode || null;
        };

        Action.Rest.CheckStatus.prototype.toString = function () {
            return 'Check HTTP response status to be "' + this.status + '"'
        };

        Action.Rest.CheckHeaderField = function (key, value, isRegexp) {
            Action.call(this);
            this.type = actionTypes.rest.CHECK_HEADER_FIELD;
            this.key = key || null;
            this.value = value || null;
            this.regexp = isRegexp || false;
        };

        Action.Rest.CheckHeaderField.prototype.toString = function () {
            return 'Check HTTP response header field "' + this.key + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
        };

        Action.Rest.CheckHttpBodyText = function (value, isRegexp) {
            Action.call(this);
            this.type = actionTypes.rest.CHECK_HTTP_BODY_TEXT;
            this.value = value || null;
            this.regexp = isRegexp || false;
        };

        Action.Rest.CheckHttpBodyText.prototype.toString = function () {
            return 'Search in the HTTP response body for ' + (this.regexp ? 'regexp' : 'string') + ' "' + this.value + '"';
        };

        Action.Rest.CheckAttributeExists = function (attribute) {
            Action.call(this);
            this.type = actionTypes.rest.CHECK_ATTRIBUTE_EXISTS;
            this.attribute = this.attribute = attribute || null;
        };

        Action.Rest.CheckAttributeExists.prototype.toString = function () {
            return 'Check if the JSON of a HTTP response has attribute "' + this.attribute + '"';
        };

        Action.Rest.CheckAttributeValue = function (attribute, value, isRegexp) {
            Action.call(this);
            this.type = actionTypes.rest.CHECK_ATTRIBUTE_VALUE;
            this.attribute = attribute || null;
            this.value = value || null;
            this.regexp = isRegexp || false
        };

        Action.Rest.CheckAttributeValue.prototype.toString = function () {
            return 'Check the JSON of a HTTP response to have attribute "' + this.attribute + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
        };

        Action.Rest.CheckAttributeType = function (attribute, jsonType) {
            Action.call(this);
            this.type = actionTypes.rest.CHECK_ATTRIBUTE_TYPE;
            this.attribute = attribute || null;
            this.jsonType = jsonType || null;
        };

        Action.Rest.CheckAttributeType.prototype.toString = function () {
            return 'Check the JSON attribute "' + this.attribute + '" of a HTTP response to be type of "' + this.jsonType + '"';
        };

        //////////

        Action.Other = function () {
        };

        Action.Other.Wait = function (duration) {
            Action.call(this);
            this.type = actionTypes.other.WAIT;
            this.duration = duration || 0;
        };

        Action.Other.Wait.prototype.toString = function () {
            return 'Wait for ' + this.duration + 'ms'
        };

        Action.Other.DeclareCounter = function (name) {
            Action.call(this);
            this.type = actionTypes.other.DECLARE_COUNTER;
            this.name = name || null;
        };

        Action.Other.DeclareCounter.prototype.toString = function () {
            return 'Declare counter "' + this.name + '"';
        };

        Action.Other.DeclareVariable = function (name) {
            Action.call(this);
            this.type = actionTypes.other.DECLARE_VARIABLE;
            this.name = name || null;
        };

        Action.Other.DeclareVariable.prototype.toString = function () {
            return 'Declare variable "' + this.name + '"';
        };

        Action.Other.IncrementCounter = function (name) {
            Action.call(this);
            this.type = actionTypes.other.INCREMENT_COUNTER;
            this.name = name || null;
        };

        Action.Other.IncrementCounter.prototype.toString = function () {
            return 'Increment counter "' + this.name + '"';
        };

        Action.Other.SetCounter = function (name, value) {
            Action.call(this);
            this.type = actionTypes.other.SET_COUNTER;
            this.name = name || null;
            this.value = value || null;
        };

        Action.Other.SetCounter.prototype.toString = function () {
            return 'Set counter "' + this.name + '" to "' + this.value + '"';
        };

        Action.Other.SetVariable = function (name, value) {
            Action.call(this);
            this.type = actionTypes.other.SET_VARIABLE;
            this.name = name;
            this.value = value;
        };

        Action.Other.SetVariable.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to "' + this.value + '"';
        };

        Action.Other.SetVariableByJSONAttribute = function (name, jsonAttribute) {
            Action.call(this);
            this.type = actionTypes.other.SET_VARIABLE_BY_JSON_ATTRIBUTE;
            this.name = name || null;
            this.value = jsonAttribute || null;
        };

        Action.Other.SetVariableByJSONAttribute.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the JSON attribute "' + this.value + '"';
        };

        Action.Other.SetVariableByNode = function (name, xPath) {
            Action.call(this);
            this.type = actionTypes.other.SET_VARIABLE_BY_NODE;
            this.name = name || null;
            this.value = xPath || null;
        };

        Action.Other.SetVariableByNode.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the element "' + this.value + '"';
        };

        Action.build = function (data) {
            var action;

            switch (data.type) {

                // web actions
                case actionTypes.web.SEARCH_FOR_TEXT:
                    action = new Action.Web.SearchForText(data.value, data.regexp);
                    break;
                case actionTypes.web.SEARCH_FOR_NODE:
                    action = new Action.Web.SearchForNode(data.value, data.regexp);
                    break;
                case actionTypes.web.CLEAR:
                    action = new Action.Web.Clear(data.node);
                    break;
                case actionTypes.web.CLICK:
                    action = new Action.Web.Click(data.node);
                    break;
                case actionTypes.web.FILL:
                    action = new Action.Web.Fill(data.node, data.value);
                    break;
                case actionTypes.web.GO_TO:
                    action = new Action.Web.GoTo(data.url);
                    break;
                case actionTypes.web.SUBMIT:
                    action = new Action.Web.Submit(data.node);
                    break;

                // rest actions
                case actionTypes.rest.CALL_URL:
                    action = new Action.Rest.Call(data.method, data.url, data.data);
                    break;
                case actionTypes.rest.CHECK_STATUS:
                    action = new Action.Rest.CheckStatus(data.status);
                    break;
                case actionTypes.rest.CHECK_HEADER_FIELD:
                    action = new Action.Rest.CheckHeaderField(data.key, data.value, data.regexp);
                    break;
                case actionTypes.rest.CHECK_HTTP_BODY_TEXT:
                    action = new Action.Rest.CheckHttpBodyText(data.value, data.regexp);
                    break;
                case actionTypes.rest.CHECK_ATTRIBUTE_EXISTS:
                    action = new Action.Rest.CheckAttributeExists(data.attribute);
                    break;
                case actionTypes.rest.CHECK_ATTRIBUTE_VALUE:
                    action = new Action.Rest.CheckAttributeValue(data.attribute, data.value, data.regexp);
                    break;
                case actionTypes.rest.CHECK_ATTRIBUTE_TYPE:
                    action = new Action.Rest.CheckAttributeType(data.attribute, data.jsonType);
                    break;

                // other actions
                case actionTypes.other.WAIT:
                    action = new Action.Other.Wait(data.duration);
                    break;
                case actionTypes.other.DECLARE_COUNTER:
                    action = new Action.Other.DeclareCounter(data.name);
                    break;
                case actionTypes.other.DECLARE_VARIABLE:
                    action = new Action.Other.DeclareVariable(data.name);
                    break;
                case actionTypes.other.INCREMENT_COUNTER:
                    action = new Action.Other.IncrementCounter(data.name);
                    break;
                case actionTypes.other.SET_COUNTER:
                    action = new Action.Other.SetCounter(data.name, data.value);
                    break;
                case actionTypes.other.SET_VARIABLE:
                    action = new Action.Other.SetVariable(data.name, data.value);
                    break;
                case actionTypes.other.SET_VARIABLE_BY_JSON_ATTRIBUTE:
                    action = new Action.Other.SetVariableByJSONAttribute(data.name, data.value);
                    break;
                case actionTypes.other.SET_VARIABLE_BY_NODE:
                    action = new Action.Other.SetVariableByNode(data.name, data.value);
                    break;

                default:
                    return null;
                    break;
            }

            action.negated = data.negated;
            action.ignoreFailure = data.ignoreFailure;

            return action;
        };

        Action.buildSome = function (data) {
            var actions = [];
            for (var i = 0; i < data.length; i++) {
                actions.push(Action.build(data[i]));
            }
            return actions;
        };

        Action.createByType = function (type) {
            return Action.build({
                type: type
            })
        };

        return Action;
    }
}());