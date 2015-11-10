(function () {
    'use strict';

    /** The controller for the modal dialog that handles the creation of a new action. */
    // @ngInject
    class ActionCreateModalController {

        /**
         * Constructor
         * @param $modalInstance
         * @param ActionService
         * @param SymbolResource
         * @param SessionService
         * @param EventBus
         * @param events
         */
        constructor($modalInstance, ActionService, SymbolResource, SessionService, EventBus, events) {
            this.$modalInstance = $modalInstance;
            this.ActionService = ActionService;
            this.EventBus = EventBus;
            this.events = events;

            const project = SessionService.project.get();

            /**
             * The model for the new action
             * @type {null|Object}
             */
            this.action = null;

            /**
             * All symbols of the project
             * @type {Symbol[]}
             */
            this.symbols = [];

            /**
             * A map where actions can save temporary key value pairs
             * @type {{}}
             */
            this.map = {};

            // get all symbols
            SymbolResource.getAll(project.id).then(symbols => {
                this.symbols = symbols;
            });
        }

        /**
         * Creates a new instance of an Action by a type that was clicked in the modal dialog.
         * @param {string} type - The type of the action that should be created
         */
        selectNewActionType(type) {
            this.action = this.ActionService.buildFromType(type);
        }

        /** Closes the modal dialog an passes the created action back to the handle that called the modal */
        createAction() {
            this.EventBus.emit(this.events.ACTION_CREATED, {action: this.action});
            this.$modalInstance.dismiss();
        }

        /** Creates a new action in the background without closing the dialog */
        createActionAndContinue() {
            this.EventBus.emit(this.events.ACTION_CREATED, {action: this.action});
            this.action = null;
            this.map = {};
        }

        /** Closes the modal dialog without passing any data */
        closeModal() {
            this.$modalInstance.dismiss();
        }
    }

    angular
        .module('ALEX.controllers')
        .controller('ActionCreateModalController', ActionCreateModalController);
}());