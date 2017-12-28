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
 * The directive for the dashboard widget that displays information about the current project.
 */
class ProjectDetailsWidget {

    /**
     * Constructor.
     *
     * @param {SymbolGroupResource} SymbolGroupResource
     * @param {LearnResultResource} LearnResultResource
     */
    // @ngInject
    constructor(SymbolGroupResource, LearnResultResource) {
        this.SymbolGroupResource = SymbolGroupResource;
        this.LearnResultResource = LearnResultResource;

        /**
         * The number of symbol groups of the project.
         * @type {null|number}
         */
        this.numberOfGroups = null;

        /**
         * The number of visible symbols of the project.
         * @type {null|number}
         */
        this.numberOfSymbols = null;

        /**
         * The number of persisted test runs in the database.
         * @type {null|number}
         */
        this.numberOfTests = null;
    }

    $onInit() {
        this.SymbolGroupResource.getAll(this.project.id, true)
            .then(groups => {
                this.numberOfGroups = groups.length;
                let counter = 0;
                groups.forEach(g => counter += g.symbols.length);
                this.numberOfSymbols = counter;
            })
            .catch(err => console.log(err));

        this.LearnResultResource.getAll(this.project.id)
            .then(results => {
                this.numberOfTests = results.length;
            })
            .catch(err => console.log(err));
    }
}

export const projectDetailsWidget = {
    templateUrl: 'html/components/widgets/project-details-widget.html',
    bindings: {
        project: '='
    },
    controller: ProjectDetailsWidget,
    controllerAs: 'vm'
};