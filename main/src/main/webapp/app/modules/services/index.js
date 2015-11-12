import ActionService from './ActionService';
import ClipboardService from './ClipboardService';
import ErrorService from './ErrorService';
import EventBus from './EventBus';
import FileDownloadService from './FileDownloadService';
import LearnerResultChartService from './LearnerResultChartService';
import PromptService from './PromptService';
import SessionService from './SessionService';
import ToastService from './ToastService';

const moduleName = 'ALEX.services';

angular
    .module(moduleName, [])
    .factory('ActionService', ActionService)
    .service('ClipboardService', ClipboardService)
    .service('ErrorService', ErrorService)
    .service('EventBus', EventBus)
    .service('FileDownloadService', FileDownloadService)
    .factory('LearnerResultChartService', LearnerResultChartService)
    .service('PromptService', PromptService)
    .factory('SessionService', SessionService)
    .service('ToastService', ToastService);

export const services = moduleName;