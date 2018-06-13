/*
 * Copyright 2018 TU Dortmund
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

/**
 * The service fot the action recorder.
 */
export class ActionRecorderService {

    /**
     * Constructor.
     */
    // @ngInject
    constructor($rootScope, $document, $compile, $q) {
        this.$rootScope = $rootScope;
        this.$document = $document;
        this.$compile = $compile;
        this.$q = $q;

        /**
         * The promise that is used to communicate between the picker and the handle.
         * @type {Promise|null}
         */
        this.deferred = null;
    }

    /**
     * Opens the action recorder.
     * @return {Promise<any>}
     */
    open() {
        // make sure the action recorder is not opened twice.
        if (document.getElementById('action-recorder') !== null) {
            return;
        }

        // create a new element picker under the current scope and append to the body
        const recorder = this.$compile('<action-recorder></action-recorder>')(this.$rootScope.$new());
        this.$document.find('body').prepend(recorder);

        this.deferred = this.$q.defer();
        return this.deferred.promise
            .finally(() => recorder.remove());
    }
}
