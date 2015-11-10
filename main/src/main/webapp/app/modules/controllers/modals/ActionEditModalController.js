(function () {
    'use strict';

    /** The controller for the modal dialog that handles the editing of an action. */
    // @ngInject
    class ActionEditModalController {

        /**
         * Constructor
         * @param $modalInstance
         * @param modalData
         * @param ActionService
         * @param SymbolResource
         * @param SessionService
         * @param EventBus
         * @param events
         */
        constructor($modalInstance, modalData, ActionService, SymbolResource, SessionService, EventBus, events) {
            this.$modalInstance = $modalInstance;
            this.ActionService = ActionService;
            this.EventBus = EventBus;
            this.events = events;

            // the project in the session
            const project = SessionService.project.get();

            /**
             * The copy of the action that should be edited
             * @type {Object}
             */
            this.action = modalData.action;

            /**
             * The list of symbols
             * @type {Array}
             */
            this.symbols = [];

            /**
             * A map where actions can save temporary key value pairs
             * @type {{}}
             */
            this.map = {};

            // fetch all symbols so that symbols have access to it
            SymbolResource.getAll(project.id).then(symbols => {
                this.symbols = symbols;
            });
        }

        /** Close the modal dialog and pass the updated action to the handle that called it */
        updateAction() {
            this.EventBus.emit(this.events.ACTION_UPDATED, {action: this.action});
            this.$modalInstance.dismiss();
        }

        /** Close the modal dialog without passing any data */
        closeModal() {
            this.$modalInstance.dismiss();
        }
    }

    angular
        .module('ALEX.controllers')
        .controller('ActionEditModalController', ActionEditModalController);
}());