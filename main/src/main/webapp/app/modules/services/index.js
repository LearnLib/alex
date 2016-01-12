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

import ActionService from './ActionService';
import ClipboardService from './ClipboardService';
import ErrorService from './ErrorService';
import EventBus from './EventBus';
import EqOracleService from './EqOracleService';
import FileDownloadService from './FileDownloadService';
import LearnerResultChartService from './LearnerResultChartService';
import PromptService from './PromptService';
import SessionService from './SessionService';
import ToastService from './ToastService';
import LearnerResultDownloadService from './LearnerResultDownloadService';

const moduleName = 'ALEX.services';

angular
    .module(moduleName, [])
    .service('ActionService', ActionService)
    .service('ClipboardService', ClipboardService)
    .service('ErrorService', ErrorService)
    .service('EventBus', EventBus)
    .service('EqOracleService', EqOracleService)
    .service('FileDownloadService', FileDownloadService)
    .service('LearnerResultChartService', LearnerResultChartService)
    .service('PromptService', PromptService)
    .service('SessionService', SessionService)
    .service('ToastService', ToastService)
    .service('LearnerResultDownloadService', LearnerResultDownloadService);

export const services = moduleName;