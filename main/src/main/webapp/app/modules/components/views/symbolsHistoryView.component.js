import {Symbol} from '../../entities/Symbol';

/**
 * The controller for the page where the revision history if a symbol is listed and old revisions can be restored
 */
// @ngInject
class SymbolsHistoryViewComponent {

    /**
     * Constructor
     * @param $stateParams
     * @param SymbolResource
     * @param SessionService
     * @param ToastService
     * @param ErrorService
     */
    constructor($stateParams, SymbolResource, SessionService, ToastService, ErrorService) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;

        // The project in the session
        const project = SessionService.getProject();

        /**
         * All revisions of a symbol
         * @type {Symbol[]}
         */
        this.revisions = [];

        /**
         * The most current version of a symbol
         * @type {Symbol}
         */
        this.latestRevision = null;

        // load all revisions of the symbol whose id is passed in the URL
        this.SymbolResource.getRevisions(project.id, $stateParams.symbolId)
            .then(revisions => {
                this.latestRevision = revisions.pop();
                this.revisions = revisions;
            })
            .catch(() => {
                ErrorService.setErrorMessage('The symbol with the ID "' + $stateParams.symbolId + '" could not be found');
            });
    }

    /**
     * Restores a previous revision of a symbol by updating the latest with the properties of the revision
     * @param {Symbol} revision - The revision of the symbol that should be restored
     */
    restoreRevision(revision) {
        const symbol = new Symbol(this.latestRevision);

        // copy all important properties from the revision to the latest
        symbol.name = revision.name;
        symbol.abbreviation = revision.abbreviation;
        symbol.actions = revision.actions;

        // update symbol with new properties
        this.SymbolResource.update(symbol)
            .then(updatedSymbol => {
                this.ToastService.success('Updated symbol to revision <strong>' + revision.revision + '</strong>');
                this.revisions.unshift($scope.latestRevision);
                this.latestRevision = updatedSymbol;
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Update to revision failed</strong></p>' + response.data.message);
            });
    }
}

export const symbolsHistoryViewComponent = {
    controller: SymbolsHistoryViewComponent,
    controllerAs: 'vm',
    templateUrl: 'views/pages/symbols-history.html'
};