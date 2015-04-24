(function () {
    'use strict';

    angular
        .module('ALEX.actions')
        .factory('AbstractAction', function () {
            function AbstractAction(type, negated, ignoreFailure) {
                this.type = type;
                this.negated = negated || false;
                this.ignoreFailure = ignoreFailure || false;
            }

            return AbstractAction;
        })
}());