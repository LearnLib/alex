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
    .service('CounterResource', CounterResource)
    .service('FileResource', FileResource)
    .service('LearnerResource', LearnerResource)
    .service('LearnResultResource', LearnResultResource)
    .service('ProjectResource', ProjectResource)
    .service('SymbolGroupResource', SymbolGroupResource)
    .service('SymbolResource', SymbolResource)
    .service('UserResource', UserResource);

export const resources = moduleName;