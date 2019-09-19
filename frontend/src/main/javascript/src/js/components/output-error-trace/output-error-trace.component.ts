/*
 * Copyright 2015 - 2019 TU Dortmund
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

export const outputErrorTraceComponent = {
    template: require('./output-error-trace.component.html'),
    bindings: {
        output: '=',
        showFirst: '='
    },
    controllerAs: 'vm',
    controller: class OutputErrorTraceComponent {

        public output: any;
        public showFirst: boolean;

        public formattedTrace: string[];

        constructor() {
            this.formattedTrace = [];
            this.showFirst = true;
        }

        $onInit(): void {
            if (this.output != null && this.output.trace !== '') {
                const trace = this.output.trace;
                this.formattedTrace = trace.substr(1, trace.length - 2).split('] > [').map(p => {
                    const parts = p.split(' / ');
                    return {symbol: parts.shift(), output: parts.join(' / ')}
                });

                console.log(this.showFirst);

                if (!this.showFirst) {
                    this.formattedTrace.shift();
                }
            }
        }
    }
};
