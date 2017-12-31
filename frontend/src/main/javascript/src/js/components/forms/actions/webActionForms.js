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

import {supportedKeys} from '../../../constants';

export const actionFormAlertAcceptDismiss = {
    templateUrl: 'html/components/forms/actions/web/alert-accept-dismiss.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormAlertGetText = {
    templateUrl: 'html/components/forms/actions/web/alert-get-text.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormAlertSendKeys = {
    templateUrl: 'html/components/forms/actions/web/alert-send-keys.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormCheckForNode = {
    templateUrl: 'html/components/forms/actions/web/check-for-node.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormCheckForText = {
    templateUrl: 'html/components/forms/actions/web/check-for-text.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         * @param {HtmlElementPickerService} HtmlElementPickerService
         */
        // @ngInject
        constructor(HtmlElementPickerService) {
            this.HtmlElementPickerService = HtmlElementPickerService;
        }

        /** Opens the element picker. */
        openPicker() {
            this.HtmlElementPickerService.open()
                .then(data => {
                    this.action.value = data.textContent;
                });
        }
    }
};

export const actionFormCheckPageTitle = {
    templateUrl: 'html/components/forms/actions/web/check-page-title.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormClearInput = {
    templateUrl: 'html/components/forms/actions/web/clear-input.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormClick = {
    templateUrl: 'html/components/forms/actions/web/click.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormClickLinkByText = {
    templateUrl: 'html/components/forms/actions/web/click-link-by-text.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         * @param {HtmlElementPickerService} HtmlElementPickerService
         */
        // @ngInject
        constructor(HtmlElementPickerService) {
            this.HtmlElementPickerService = HtmlElementPickerService;
        }

        /** Opens the element picker. */
        openPicker() {
            this.HtmlElementPickerService.open()
                .then(data => {
                    this.action.value = data.textContent;
                });
        }
    }
};

export const actionFormExecuteScript = {
    templateUrl: 'html/components/forms/actions/web/execute-script.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm',
    controller: class {
        constructor() {
            this.aceOptions = {
                useWrapMode: true,
                showGutter: true
            };
        }
    }
};

export const actionFormPressKey = {
    templateUrl: 'html/components/forms/actions/web/press-key.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm',
    controller: function () {
        this.keys = supportedKeys;
    }
};

export const actionFormCheckNodeAttributeValue = {
    templateUrl: 'html/components/forms/actions/web/check-node-attribute-value.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm',
    controller: function () {
        this.checkMethods = ['IS', 'CONTAINS', 'MATCHES'];
    }
};

export const actionFormMoveMouse = {
    templateUrl: 'html/components/forms/actions/web/move-mouse.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormOpen = {
    templateUrl: 'html/components/forms/actions/web/open.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSelect = {
    templateUrl: 'html/components/forms/actions/web/select.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSendKeys = {
    templateUrl: 'html/components/forms/actions/web/send-keys.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSubmit = {
    templateUrl: 'html/components/forms/actions/web/submit.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormWaitForNode = {
    templateUrl: 'html/components/forms/actions/web/wait-for-node.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormWaitForNodeAttribute = {
    templateUrl: 'html/components/forms/actions/web/wait-for-node-attribute.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormWaitForTitle = {
    templateUrl: 'html/components/forms/actions/web/wait-for-title.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormWaitForText = {
    templateUrl: 'html/components/forms/actions/web/wait-for-text.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSwitchTo = {
    templateUrl: 'html/components/forms/actions/web/switch-to.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};

export const actionFormSwitchToFrame = {
    templateUrl: 'html/components/forms/actions/web/switch-to-frame.html',
    bindings: {
        action: '='
    },
    controllerAs: 'vm'
};
