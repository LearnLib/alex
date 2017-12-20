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

export const testTree = {
    template: `
        <div class="test-tree">
            <test-suite-node suite="vm.root" parent="null" result="vm.result" ng-if="vm.root !== null && vm.root.type === 'suite'"></test-suite-node>
            <test-case-node case="vm.root" parent="null" result="vm.result" ng-if="vm.root !== null && vm.root.type === 'case'"></test-case-node>
        </div>
    `,
    bindings: {
        root: '=',
        result: '='
    },
    controllerAs: 'vm',
    controller: class {
        constructor() {
            this.root = null;
            this.result = null;
        }
    }
};

export const testSuiteNode = {
    template: `
        <div class="test-suite-node">
            <div class="header d-flex flex-row">
                <div class="test-icon">
                    <i class="fa fa-fw fa-folder"></i> 
                </div>
                <div class="name flex-grow-1" ui-sref="tests({testId: vm.suite.id})">
                    <strong ng-if="vm.parent === null">{{vm.suite.name}}</strong>
                    <span ng-if="vm.parent !== null">{{vm.suite.name}}</span>
                    
                    <span class="pull-right" ng-if="vm.result">
                        <span class="label label-success" ng-if="vm.result.passed">
                            Passed
                        </span>
                        <span class="label label-danger" ng-if="!vm.result.passed && vm.result.testCasesPassed === 0">
                            Failed
                        </span>
                        <span class="label label-warning" ng-if="!vm.result.passed && vm.result.testCasesPassed > 0">
                            {{vm.result.testCasesFailed}}/{{vm.result.testCasesRun}} Failed
                        </span>                        
                    </span>
                </div>
                <div class="collapse-icon" ng-click="vm.collapsed = !vm.collapsed">
                    <i class="fa fa-fw" ng-class="vm.collapsed ? 'fa-caret-right' : 'fa-caret-down'"></i> 
                </div>
            </div>
            <div class="children" ng-show="!vm.collapsed">
                <div ng-repeat="test in vm.suite.tests | sortTests">                
                    <test-suite-node suite="test" ng-if="test.type === 'suite'" result="vm.result.results[test.id]"></test-suite-node>
                    <test-case-node case="test" ng-if="test.type === 'case'" result="vm.result.results[test.id]"></test-case-node>
                </div>
            </div>
        </div>
    `,
    bindings: {
        suite: '=',
        parent: '=',
        result: '='
    },
    controllerAs: 'vm',
    controller: class {
        constructor() {
            this.suite = null;
            this.collapsed = true;
            this.result = null;
        }
    }
};

export const testCaseNode = {
    template: `
        <div class="test-case-node">
            <div class="header d-flex flex-row">
                <div class="test-icon">
                    <i class="fa fa-fw fa-file"></i>
                </div>
                <div class="name flex-grow-1" ui-sref="tests({testId: vm.case.id})">
                    <span class="pull-right" ng-if="vm.result">
                        <span class="label label-success" ng-if="vm.result.passed">Passed</span>
                        <span class="label label-danger" ng-if="!vm.result.passed">Failed</span>                        
                    </span>
                    
                    <strong ng-if="vm.parent === null">{{vm.case.name}}</strong>
                    <span ng-if="vm.parent !== null">{{vm.case.name}}</span>
                </div>
            </div>
        </div>
    `,
    bindings: {
        case: '=',
        parent: '=',
        result: '='
    },
    controllerAs: 'vm',
    controller: class {
    }
};
