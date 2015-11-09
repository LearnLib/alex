(function () {
    'use strict';

    /** The event bus */
    // @ngInject
    class EventBus {

        /**
         * Constructor
         * @param $rootScope
         */
        constructor($rootScope) {
            this.$rootScope = $rootScope;
        }

        /**
         * Listen on an event with automatic event destructor
         * @param {string} eventName - The event to emit
         * @param fn - The callback function
         * @param scope - The related scope
         */
        on(eventName, fn, scope = null) {
            const off = this.$rootScope.$on(eventName, fn);
            if (scope !== null) scope.$on('$destroy', off);
        }

        /**
         * Emits an event on the rootScope
         * @param {string} eventName - The eventName
         * @param {any} data - The data to pass
         */
        emit(eventName, data) {
            this.$rootScope.$emit(eventName, data);
        }
    }

    angular.module('ALEX.services').service('EventBus', EventBus);
}());