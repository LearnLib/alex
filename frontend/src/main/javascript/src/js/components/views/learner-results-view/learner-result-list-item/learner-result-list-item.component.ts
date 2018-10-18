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

import {LearnResult} from '../../../../entities/learner-result';
import {Selectable} from '../../../../utils/selectable';

/**
 * The component that displays a learn result list item.
 *
 * Everything that is put between the tags is displayed at the most right.
 */
export const learnerResultListItemComponent = {
  template: require('./learner-result-list-item.component.html'),
  transclude: true,
  bindings: {
    result: '=',
    selectable: '='
  },
  controllerAs: 'vm',
  controller: class LearnerResultListItemComponent {

    public result: LearnResult;

    public selectable: Selectable<LearnResult>;
  }
};
