/**
 * This directive changes the dimensions of an element to its parent element. Optionally you can trigger this
 * behaviour by passing the value 'true' to the parameter bindResize so that every time the window resizes,
 * the dimensions of the element will be updated.
 *
 * @param $window
 * @returns {{link: link, template: string}}
 */
// @ngInject
function responsiveIframe($window) {
    return {
        link: link,
        template: '<iframe></iframe>'
    };

    function link(scope, el) {
        const parent = el[0].parentNode;
        const iframe = el.find('iframe');

        $window.addEventListener('resize', fitToParent);

        scope.$on('$destroy', () => {
            $window.removeEventListener('resize', fitToParent);
        });

        /**
         * Set the element to the dimensions of its parent
         */
        function fitToParent() {
            iframe[0].setAttribute('width', parent.offsetWidth);
            iframe[0].setAttribute('height', parent.offsetHeight);
        }

        fitToParent();
    }
}

export default responsiveIframe;