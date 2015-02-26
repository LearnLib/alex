(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadHypothesisAsSvg', [
            'PromptService',
            downloadHypothesisAsSvg
        ]);

    function downloadHypothesisAsSvg(PromptService) {
    	
    	var defs = '' +
    		'<defs>' +
        	'<style type="text/css"><![CDATA[' +
            '	.hypothesis text {' +
    	  	'		font-size: 12px;}' +
			'	.hypothesis .node {' +
      		'		fill: #fff;' +
      		'		stroke: #000;' +
      		'		stroke-width: 1; }' +
			'	.hypothesis .node .label text {' +
		    ' 		fill: #000;' +
      		'		stroke: #000;' +
      		'		stroke-width: 1; }' +
    		'	.hypothesis .edgePath .path {' +
      		'		stroke: rgba(0, 0, 0, 0.3);' +
      		'		stroke-width: 3;' +
      		'		fill: none; }' +
    		'	.hypothesis .edgeLabel text {' +
      		'		fill: #555; }' +
			']]></style>'+
			'</defs>';

        var directive = {
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', promptFilename);

            //////////

            function promptFilename() {
                PromptService.prompt('Enter a name for the svg file.', {
                    regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                    errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
                }).then(download);
            }

            function download(filename) {

                var selector = attrs.downloadHypothesisAsSvg;
                var svg = document.querySelector(selector);
                var a;

                if (svg.nodeName != 'SVG') {
                    svg = svg.getElementsByTagName('svg')[0];
                    if (svg == null) {
                        return;
                    }
                }

                svg.setAttribute('version', '1.1');
                svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                // create serialized string from svg element
                var svgString = new XMLSerializer().serializeToString(svg);

                // create new link element with image data
                a = document.createElement('a');
                a.style.display = 'none';
                a.setAttribute('href', 'data:image/svg+xml,' + svgString);                
                a.setAttribute('target', '_blank');
                a.setAttribute('download', filename + '.svg');

                // append link to the dom, fire click event and remove it
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    }
}());