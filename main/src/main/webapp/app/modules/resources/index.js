import CounterResource from './CounterResource';
import FileResource from './FileResource';
import LearnerResource from './LearnerResource';
import LearnResultResource from './LearnResultResource';
import ProjectResource from './ProjectResource';
import SymbolGroupResource from './SymbolGroupResource';
import SymbolResource from './SymbolResource';
import UserResource from './UserResource';

const moduleName = 'ALEX.resources';

angular
    .module(moduleName, [])
    .factory('CounterResource', CounterResource)
    .factory('FileResource', FileResource)
    .factory('LearnerResource', LearnerResource)
    .factory('LearnResultResource', LearnResultResource)
    .factory('ProjectResource', ProjectResource)
    .factory('SymbolGroupResource', SymbolGroupResource)
    .factory('SymbolResource', SymbolResource)
    .factory('UserResource', UserResource);

export const resources = moduleName;
