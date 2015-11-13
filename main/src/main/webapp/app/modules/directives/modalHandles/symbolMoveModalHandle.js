import {Symbol} from '../../entities/Symbol';

/**
 * The directive for handling the opening of the modal for moving symbols into another group. Can only be used as
 * an attribute and attaches a click event to its source element.
 *
 * Use: '<button symbol-move-modal-handle symbols="..." onMoved="...">Click Me!</button>'
 *
 * @param $modal - The ui.bootstrap $modal service
 * @returns {{scope: {symbols: string, onMoved: string}, link: link}}
 */
// @ngInject
function symbolMoveModalHandle($modal) {
    return {
        restrict: 'A',
        scope: {
            symbols: '=',
            onMoved: '&'
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            var modal = $modal.open({
                templateUrl: 'views/modals/symbol-move-modal.html',
                controller: 'SymbolMoveModalController',
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return {symbols: scope.symbols.map(s => new Symbol(s))}
                    }
                }
            });
            modal.result.then(data => {
                scope.onMoved()(data.symbols, data.group);
            })
        });
    }
}

export default symbolMoveModalHandle;