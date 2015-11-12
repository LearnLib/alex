/**
 * The directive that can be applied to any element as an attribute that downloads an object or an array as
 * a *.json file. Attaches a click event to the element that downloads the file. Can only be used as attribute.
 *
 * Attribute 'data' has to be defined in order to work and has to be type of object, array or a function
 * that returns an object or an array.
 *
 * Use it like '<button download-as-json data="...">Click Me!</button>'
 *
 * @param FileDownloadService
 * @returns {{restrict: string, scope: {data: string}, link: link}}
 */
// @ngInject
function downloadAsJson(FileDownloadService) {
    return {
        restrict: 'A',
        scope: {
            data: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            if (angular.isDefined(scope.data)) {
                let data = scope.data;
                if (angular.isFunction(scope.data)) {
                    data = scope.data();
                }
                FileDownloadService.downloadJson(data);
            }
        });
    }
}

export default downloadAsJson;