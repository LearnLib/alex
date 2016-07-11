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

export const actionFormAssertCounter = {
    templateUrl: 'html/components/forms/actions/general/assert-counter.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormAssertVariable = {
    templateUrl: 'html/components/forms/actions/general/assert-variable.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormExecuteSymbol = {
    templateUrl: 'html/components/forms/actions/general/execute-symbol.html',
    bindings: {
        action: '=',
        symbols: '='
    },
    controllerAs: 'vm',
    controller: function () {
        this.name = null;
    }
};

export const actionFormIncrementCounter = {
    templateUrl: 'html/components/forms/actions/general/increment-counter.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSetCounter = {
    templateUrl: 'html/components/forms/actions/general/set-counter.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSetVariable = {
    templateUrl: 'html/components/forms/actions/general/set-variable.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSetVariableByCookie = {
    templateUrl: 'html/components/forms/actions/general/set-variable-by-cookie.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSetVariableByHtml = {
    templateUrl: 'html/components/forms/actions/general/set-variable-by-html.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSetVariableByJson = {
    templateUrl: 'html/components/forms/actions/general/set-variable-by-json.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSetVariableByNodeAttribute = {
    templateUrl: 'html/components/forms/actions/general/set-variable-by-node-attribute.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormWait = {
    templateUrl: 'html/components/forms/actions/general/wait.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};