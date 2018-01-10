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

export const testsImportModal = {
    templateUrl: 'html/components/modals/tests-import-modal.html',
    bindings: {
        close: '&',
        dismiss: '&',
        resolve: '='
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         *
         * @param {SessionService} SessionService
         * @param {SymbolResource} SymbolResource
         * @param {TestResource} TestResource
         * @param {TestService} TestService
         */
        // @ngInject
        constructor(SessionService, SymbolResource, TestResource, TestService) {
            this.SymbolResource = SymbolResource;
            this.TestResource = TestResource;
            this.TestService = TestService;

            this.project = SessionService.getProject();

            this.tests = [];
            this.errorMessage = null;
        }

        /**
         * Callback from the file drop zone.
         *
         * @param {string} data - The contents of the imported file.
         */
        fileLoaded(data) {
            try {
                const tests = JSON.parse(data);
                if (!tests.length) throw 'The file does not seem to contain any tests';
                this.tests = tests;
                this.errorMessage = null;
            } catch (exception) {
                this.errorMessage = '' + exception;
            }
        }

        /**
         * Import all test cases.
         */
        importTests() {
            this.errorMessage = null;

            if (this.tests.length) {
                const parentId = this.resolve.modalData.test.id;

                console.log(this.tests);

                this.TestService.importTests(this.project.id, this.tests, parentId)
                    .then((tests) => this.close({$value: tests}))
                    .catch((err) => {
                        console.log(err);
                        this.errorMessage = err.data.message;
                    });
            } else {
                this.errorMessage = 'There aren\'t any tests to import';
            }
        }
    }
};

const r = [{
    'type': 'case',
    'name': 'should open and close a project',
    'variables': {},
    'shouldPass': true,
    'symbols': ['Reset', 'Create User', 'Login User', 'Create Project', 'Open Project', 'Close Project']
}, {
    'type': 'case',
    'name': 'should login after email change',
    'variables': {},
    'shouldPass': true,
    'symbols': ['Reset', 'Create User', 'Login User', 'Change Email', 'Logout', 'Login User']
}, {
    'type': 'case',
    'name': 'should not create the same user twice',
    'variables': {},
    'shouldPass': false,
    'symbols': ['Reset', 'Create User', 'Create User']
}, {
    'type': 'case',
    'name': 'should not create the same project twice',
    'variables': {},
    'shouldPass': false,
    'symbols': ['Reset', 'Create User', 'Login User', 'Create Project', 'Create Project']
}, {
    'type': 'case',
    'name': 'should create and delete a project',
    'variables': {},
    'shouldPass': true,
    'symbols': ['Reset', 'Create User', 'Login User', 'Create Project', 'Delete Project']
}, {
    'type': 'case',
    'name': 'should create, update and delete a counter',
    'variables': {},
    'shouldPass': true,
    'symbols': ['Reset', 'Create User', 'Login User', 'Create Project', 'Open Project', 'Create Counter', 'Update Counter', 'Delete Counter']
}, {
    'type': 'case',
    'name': 'should login and logout admin',
    'variables': {},
    'shouldPass': true,
    'symbols': ['Reset', 'Login Admin', 'Logout']
}, {
    'type': 'suite',
    'name': 'User Story XY',
    'tests': [{
        'type': 'case',
        'name': 'User Story 2',
        'variables': {},
        'shouldPass': true,
        'symbols': []
    }, {'type': 'case', 'name': 'User Story 3', 'variables': {}, 'shouldPass': true, 'symbols': []}, {
        'type': 'case',
        'name': 'User Story 1',
        'variables': {},
        'shouldPass': true,
        'symbols': []
    }]
}, {
    'type': 'case',
    'name': 'admin settings should be visible for admins',
    'variables': {},
    'shouldPass': true,
    'symbols': ['Reset', 'Login Admin', 'Admin Settings Visible']
}, {'type': 'case', 'name': 'should reset', 'variables': {}, 'shouldPass': true, 'symbols': ['Reset']}, {
    'type': 'case',
    'name': 'should login after password change',
    'variables': {},
    'shouldPass': true,
    'symbols': ['Reset', 'Create User', 'Login User', 'Change Email', 'Logout', 'Login User']
}, {
    'type': 'case',
    'name': 'admin settings should not be displayed for a user',
    'variables': {},
    'shouldPass': false,
    'symbols': ['Reset', 'Create User', 'Login User', 'Admin Settings Visible']
}, {
    'type': 'case',
    'name': 'should create, login and logout user',
    'variables': {},
    'shouldPass': true,
    'symbols': ['Reset', 'Create User', 'Login User', 'Logout']
}];
