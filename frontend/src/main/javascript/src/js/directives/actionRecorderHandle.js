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

/**
 * The directive that creates a new Action Recorder. Can only be used as an attribute and attaches a click
 * event to the source element that opens the picker. On first start, it loads the page that is defined in the
 * projects baseUrl.
 *
 * Use: '<button action-recorder-handle>Click Me!</button>'.
 *
 * @param $document
 * @param $compile
 * @param $q
 * @param ActionRecorderService
 * @returns {{restrict: string, scope: {selectorModel: string}, link: Function}}
 */
// @ngInject
export function actionRecorderHandle($document, $compile, $q, ActionRecorderService) {
    return {
        restrict: 'A',
        scope: {
            onRecorded: '&'
        },
        link(scope, el) {
            el.on('click', () => {

                // create a new element picker under the current scope and append to the body
                const recorder = $compile('<action-recorder></action-recorder>')(scope);
                $document.find('body').prepend(recorder);

                ActionRecorderService.deferred = $q.defer();
                ActionRecorderService.deferred.promise
                    .then(data => {
                        scope.onRecorded({actions: data});
                    })
                    .finally(() => {
                        recorder.remove();
                    });
            });
        }
    };
}