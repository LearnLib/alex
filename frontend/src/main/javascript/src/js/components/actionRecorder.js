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

import uniqueId from "lodash/uniqueId";
import {DomUtils} from "../utils/dom-utils";

/**
 * The actual HTML element picker. Handles the complete window including the selection of elements and loading
 * of urls. Works as a 'mini embedded browser'
 *
 * Use: '<html-element-picker></html-element-picker>'
 *
 * @param SessionService - The SessionService
 */
class ActionRecorder {

    /**
     * Constructor.
     * @param {SessionService} SessionService
     * @param {ActionRecorderService} ActionRecorderService
     * @param $element
     * @param $scope
     * @param $uibModal
     */
    // @ngInject
    constructor(SessionService, ActionRecorderService, $element, $scope, $uibModal) {
        this.SessionService = SessionService;
        this.ActionRecorderService = ActionRecorderService;
        this.iframe = $element.find('iframe');
        this.$scope = $scope;
        this.$uibModal = $uibModal;

        // when moving with the mouse over an element, this elements gets saved in this variable in order to
        // prevent multiple calls of getCssPath for the same element
        this.lastTarget = null;

        /**
         * The url that is loaded in the iframe
         * @type {string}
         */
        this.url = null;

        /**
         * The project in the session
         * @type {null|Project}
         */
        this.project = null;

        /**
         * The XPath of the selected element
         * @type {null|string}
         */
        this.selector = null;

        /**
         * The type of the selector [CSS|XPATH].
         *
         * @type {string}
         */
        this.selectorType = 'CSS';

        /**
         * If CORS is disabled.
         * @type {null|boolean}
         */
        this.corsDisabled = null;

        /**
         * If the recorder is running.
         * @type {boolean}
         */
        this.isRecording = false;

        this.actions = [];

        this.mouseMoveHandler = null;
        this.keyUpHandler = null;
        this.clickHandler = null;

        this.init();
    }

    /**
     * Load project, create proxy address and load the last url in the iframe.
     */
    init() {
        this.project = this.SessionService.getProject();
        this.loadUrl();
    }

    /**
     * Loads an entered url into the iframe and handles the click on every a element
     */
    loadUrl() {
        const self = this;

        this.iframe.attr('src', this.project.baseUrl + (this.url === null ? '/' : this.url));
        this.iframe.on('load', () => {
            try {
                this.iframe.contents();
                self.$scope.$apply(() => this.corsDisabled = false);
            } catch (err) {
                self.$scope.$apply(() => this.corsDisabled = true);
            }
        });
    }

    /**
     * Makes the web element picker invisible and fires the close event
     */
    close() {
        this.ActionRecorderService.deferred.reject();
    }

    /**
     * Makes the web element Picker invisible and fires the ok event with the selector of the element that was
     * selected. If no selector is defined, then it just closes the picker
     */
    ok() {
        this.ActionRecorderService.deferred.resolve(this.actions);
    }

    /**
     * Toggle the type of the selector.
     */
    toggleSelectorType() {
        this.selectorType = this.selectorType === 'CSS' ? 'XPATH' : 'CSS';
    }

    toggleRecording() {
        if (this.isRecording) {
            this.selector = null;

            angular.element(this.iframe.contents()[0].body).off('mousemove', this.mouseMoveHandler);
            angular.element(this.iframe.contents()[0].body).off('click', this.clickHandler);
            document.body.removeEventListener('keyup', this.keyUpHandler);

            if (this.lastTarget !== null) {
                this.lastTarget.style.outline = 'none';
                this.lastTarget = null;
            }
        } else {
            const iframeBody = angular.element(this.iframe.contents()[0].body);
            this.mouseMoveHandler = this.handleMouseMove.bind(this);
            this.keyUpHandler = this.handleKeyUp.bind(this);

            this.clickHandler = (e) => {
                this.handleClick(e);
                this.$scope.$apply(() => {
                    this.isSelectable = false;
                });
            };

            iframeBody.on('mousemove', this.mouseMoveHandler);
            iframeBody.on('click', this.clickHandler);
            document.body.addEventListener('keyup', this.keyUpHandler, false);
        }
        this.isRecording = !this.isRecording;
    }

    /**
     * Removes the outline from the selected element, removes all events from the iframe and removes the
     * keypress event. When this function is called the selected element is fixed and won't change by any
     * further interaction with the iframe
     *
     * @param e - js event
     */
    handleClick(e) {
        if (typeof e !== "undefined") {
            e.preventDefault();
            e.stopPropagation();
        }

        this.$uibModal.open({
            component: 'actionRecorderActionsModal',
            size: 'lg',
            windowClass: 'modal-zindex',
            resolve: {
                modalData: () => {
                    return {
                        element: this.lastTarget,
                        selector: this.selector,
                        selectorType: this.selectorType
                    };
                }
            }
        }).result.then(data => {
            data.action._id = uniqueId();
            this.actions.push(data.action);
            this.toggleRecording();
        });
    }

    updateAction(action, $index) {
        this.actions[$index] = action;
    }

    /**
     * Saves the element that is under the cursor so that it can be selected. Adds an outline to the element
     * in order to highlight it.
     *
     * @param e - js event
     * @returns {boolean}
     */
    handleMouseMove(e) {
        if (this.lastTarget === e.target) {
            return false;
        } else {
            if (this.lastTarget !== null) {
                this.lastTarget.style.outline = '0px';
            }
            this.lastTarget = e.target;
        }
        this.lastTarget.style.outline = '5px solid red';

        if (this.selectorType === 'CSS') {
            this.selector = DomUtils.getCssPath(this.lastTarget);
        } else {
            this.selector = DomUtils.getXPath(this.lastTarget);
        }

        if (this.lastTarget.nodeName.toLowerCase() === 'input') {
            this.textContent = this.lastTarget.value;
        } else {
            this.textContent = this.lastTarget.textContent;
        }

        this.$scope.$apply();
    }

    /**
     * Calls handleClick() when control key is pressed to have an alternative for selecting a dom node without
     * firing any click events on it.
     *
     * @param e
     */
    handleKeyUp(e) {
        if (e.keyCode == 17) { // strg
            this.handleClick();
            this.isRecording = false;
        }
    }
}

export const actionRecorderComponent = {
    templateUrl: 'html/components/action-recorder.html',
    controller: ActionRecorder,
    controllerAs: 'vm'
};