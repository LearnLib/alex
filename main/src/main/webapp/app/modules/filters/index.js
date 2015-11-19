import * as filter from './filters';

const moduleName = 'ALEX.filters';

angular
    .module(moduleName, [])
    .filter('formatEqOracle', filter.formatEqOracle)
    .filter('formatAlgorithm', filter.formatAlgorithm)
    .filter('formatMilliseconds', filter.formatMilliseconds)
    .filter('formatWebBrowser', filter.formatWebBrowser);

export const filters = moduleName;