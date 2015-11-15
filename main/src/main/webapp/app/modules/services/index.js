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

const moduleName = 'ALEX.services';

angular
    .module(moduleName, [])
    .service('ActionService', ActionService)
    .service('ClipboardService', ClipboardService)
    .service('ErrorService', ErrorService)
    .service('EventBus', EventBus)
    .service('EqOracleService', EqOracleService)
    .service('FileDownloadService', FileDownloadService)
    .factory('LearnerResultChartService', LearnerResultChartService)
    .service('PromptService', PromptService)
    .factory('SessionService', SessionService)
    .service('ToastService', ToastService);

export const services = moduleName;