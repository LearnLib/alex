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
 * A directive in addition to the dropdown directive from ui-bootstrap. It opens the dropdown menu when entering the
 * trigger element of the menu with the mouse so you don't have to click on it. Place it as attribute 'dropdown-hover'
 * beside 'uib-dropdown-toggle' in order to work as expected.
 *
 * @return {{require: string, link: Function}}
 */
export function dropdownHover() {
    return {
        require: '^uibDropdown',
        link(scope, el, attrs, ctrl) {
            el.on('mouseenter', () => {
                scope.$apply(() => {
                    ctrl.toggle(true);
                });
            });
        }
    };
}