(function () {

    angular
        .module('ALEX.directives')
        .directive('learnResultDetailsModalHandle', learnResultDetailsModalHandle);

    /**
     * The directive that handles the modal dialog for displaying details about a learn result. Can only be used as
     * an attribute and expects a second attribute 'result' which should be the LearnResult whose details should be
     * shown. Attaches a click event on the element that opens the modal.
     *
     * Use it like this: '<button learn-result-details-modal-handle result="...">Click me!</button>'
     *
     * @param $modal - The modal service
     * @returns {{restrict: string, scope: {result: string}, link: link}}
     */
    // @ngInject
    function learnResultDetailsModalHandle($modal) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                result: '='
            },
            link: link
        };

        // the behaviour of the directive
        function link(scope, el, attrs) {
            el.on('click', handleModal);

            function handleModal() {
                if (angular.isDefined(scope.result)) {
                    $modal.open({
                        templateUrl: 'views/modals/learn-result-details-modal.html',
                        controller: 'LearnResultDetailsModalController',
                        resolve: {
                            modalData: function () {
                                return {
                                    result: scope.result
                                }
                            }
                        }
                    })
                }
            }
        }
    }
}());