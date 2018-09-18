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

export class UiService {

    /**
     * Constructor.
     *
     * @param $rootScope
     * @param $http
     */
    // @ngInject
    constructor($rootScope, $http) {

        /**
         * The UI store.
         *
         * @type {{loading: boolean, sidebar: {collapsed: boolean}}}
         */
        this.store = {
            loading: false,
            sidebar: {
                collapsed: false
            }
        };

        // load ui state from session
        const ui = sessionStorage.getItem('ui.sidebar');
        if (ui != null) this.store = JSON.parse(ui);

        $rootScope.$watch(() => $http.pendingRequests.length > 0, value => {
            this.store.loading = value;
        });
    }

    toggleSidebar() {
        this.store.sidebar.collapsed = !this.store.sidebar.collapsed;
        this.save();
    }

    save() {
        sessionStorage.setItem('ui.sidebar', JSON.stringify(this.store));
    }
}
