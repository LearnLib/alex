(function(){
    'use strict';

    angular
        .module('weblearner', [
                               
            // modules from external libraries
            'ngAnimate',
            'ui.sortable',
            'ui.bootstrap',
            'ui.ace',
            'ui.router',
            'ngToast',
            'draganddrop',
            
            //all templates
			'templates-all',
            
            // application specific modules
            'weblearner.controller',
            'weblearner.resources',
            'weblearner.directives',
            'weblearner.services',
            'weblearner.filters',
            'weblearner.routes',
            'weblearner.constants',
            'weblearner.models'
        ]);

    angular.module('weblearner.controller', []);
    angular.module('weblearner.resources', []);
    angular.module('weblearner.directives', []);
    angular.module('weblearner.services', []);
    angular.module('weblearner.filters', []);
    angular.module('weblearner.routes', ['weblearner.constants', 'templates-all', 'ui.router']);
    angular.module('weblearner.constants', []);
    angular.module('weblearner.models', []);


    angular.module('weblearner')
        .config(['ngToastProvider', function(ngToastProvider){
        	
            ngToastProvider.configure({
                verticalPosition: 'top',
                horizontalPosition: 'center',
                maxNumber: 1
            });
        }])
        .run(['$rootScope', '_', function($rootScope, _){
            $rootScope._ = _;
        }])
}());;angular.module('templates-all', ['app/views/directives/counter-example-builder.html', 'app/views/directives/hypothesis-panel.html', 'app/views/directives/hypothesis.html', 'app/views/directives/load-screen.html', 'app/views/directives/navigation.html', 'app/views/directives/observation-table.html', 'app/views/directives/rest-action-create-form.html', 'app/views/directives/rest-action-edit-form.html', 'app/views/directives/symbol-create-form.html', 'app/views/directives/symbol-edit-form.html', 'app/views/directives/web-action-create-form.html', 'app/views/directives/web-action-edit-form.html', 'app/views/directives/web-element-picker.html', 'app/views/modals/action-create-modal.html', 'app/views/modals/action-edit-modal.html', 'app/views/modals/hypothesis-layout-settings-modal.html', 'app/views/modals/modal-confirm-dialog.html', 'app/views/modals/modal-prompt-dialog.html', 'app/views/modals/modal-test-details.html', 'app/views/modals/modal-test-setup-settings.html', 'app/views/modals/symbol-create-modal.html', 'app/views/modals/symbol-edit-modal.html', 'app/views/pages/about.html', 'app/views/pages/help.html', 'app/views/pages/home.html', 'app/views/pages/learn-results-compare.html', 'app/views/pages/learn-results-statistics.html', 'app/views/pages/learn-results.html', 'app/views/pages/learn-setup.html', 'app/views/pages/learn-start.html', 'app/views/pages/project-create.html', 'app/views/pages/project-settings.html', 'app/views/pages/project.html', 'app/views/pages/symbols-actions.html', 'app/views/pages/symbols-export.html', 'app/views/pages/symbols-history.html', 'app/views/pages/symbols-import.html', 'app/views/pages/symbols-trash.html', 'app/views/pages/symbols.html', 'app/views/pages/tools-hypotheses-view.html', 'app/views/widgets/widget-counter-examples.html', 'app/views/widgets/widget-test-resume-settings.html']);

angular.module("app/views/directives/counter-example-builder.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/counter-example-builder.html",
    "<div id=\"counter-example-builder\">\n" +
    "	<div class=\"wrapper\">\n" +
    "	\n" +
    "		<nav class=\"navbar navbar-default\" role=\"navigation\">\n" +
    "	        <div class=\"container-fluid\">\n" +
    "	        \n" +
    "	        	<p class=\"navbar-text\"><strong>Counter Example Builder</strong></p>\n" +
    "	        \n" +
    "	            <button class=\"btn btn-default navbar-btn pull-right\" ng-click=\"close()\"><i\n" +
    "	                    class=\"fa fa-close\"></i></button>\n" +
    "	            <button class=\"btn btn-primary navbar-btn pull-right\" ng-click=\"ok()\" style=\"margin-right: 7px\">ok</button>\n" +
    "	            <button class=\"btn btn-default navbar-btn pull-right\" ng-click=\"ok()\" style=\"margin-right: 7px\">\n" +
    "	            	<i class=\"fa fa-eye\"></i>\n" +
    "	            </button>  \n" +
    "	        </div>\n" +
    "	    </nav>\n" +
    "	    \n" +
    "	    <div class=\"available-inputs-panel\">\n" +
    "	        <ul class=\"list-group\">\n" +
    "	            <li class=\"list-group-item\" ng-repeat=\"input in inputs\" draggable=\"true\" effect-allowed=\"copy\"\n" +
    "	                draggable-type=\"custom-object\" draggable-data=\"input\">{{input}}</li>\n" +
    "	        </ul>\n" +
    "	    </div>\n" +
    "    \n" +
    "    <div class=\"counter-example-panel\">\n" +
    "\n" +
    "		<div class=\"counter-example-list-wrapper\">\n" +
    "            <div class=\"list-group\" as-sortable ng-model=\"ios\">\n" +
    "                <div class=\"list-group-item\" ng-repeat=\"io in counterExample track by $index\" as-sortable-item>\n" +
    "\n" +
    "                    <span class=\"text-muted pull-right\" ng-click=\"remove($index)\">\n" +
    "                        <i class=\"fa fa-trash fa-fw\"></i>\n" +
    "                    </span>\n" +
    "\n" +
    "                    <span class=\"text-muted pull-right\" as-sortable-item-handle style=\"display: inline-block; margin-right: 5px\">\n" +
    "                        <i class=\"fa fa-sort fa-fw\"></i>\n" +
    "                    </span>\n" +
    "\n" +
    "                    <div class=\"container-fluid clearfix\" style=\"margin-right: 50px; padding: 0\">\n" +
    "\n" +
    "                        <div style=\"width: 66%; float: left\" drop=\"onDropInput($data, $event, $index)\" drop-effect=\"copy\"\n" +
    "                             drop-accept=\"'json/custom-object'\">\n" +
    "                            <div class=\"counter-example-input\">{{io.input}}</div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div style=\"width: 34%; float: left\">\n" +
    "                            <select class=\"form-control\">\n" +
    "                            	<option>OK</option>\n" +
    "                            	<option>FAILED</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "        	</div>\n" +
    "        	\n" +
    "        	<button class=\"btn btn-default btn-sm btn-block\" ng-click=\"add()\">\n" +
    "	            Add\n" +
    "	        </button>\n" +
    "    	</div>\n" +
    "		\n" +
    "    </div>\n" +
    "				\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("app/views/directives/hypothesis-panel.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/hypothesis-panel.html",
    "<div class=\"hypothesis-panel-container\">\n" +
    "\n" +
    "    <!-- BEGIN: Subnavigation -->\n" +
    "    <div class=\"sub-nav absolute\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "                <div class=\"btn-group btn-group-xs\" dropdown>\n" +
    "                    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" dropdown-toggle>\n" +
    "                        <i class=\"fa fa-bars\"></i>\n" +
    "                    </button>\n" +
    "                    <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                        <li>\n" +
    "                            <a href=\"\" open-test-details-modal test=\"getCurrentStep()\">\n" +
    "                                <i class=\"fa fa-info fa-fw\"></i> Details\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li class=\"divider\"></li>\n" +
    "                        <li>\n" +
    "                            <a href=\"\" download-hypothesis-as-svg=\"#hypothesis-{{index}}\">\n" +
    "                                <i class=\"fa fa-save fa-fw\"></i>&nbsp; Save as *.svg\n" +
    "                            </a>\n" +
    "                            <a href=\"\" download-as-json data=\"getCurrentStep().hypothesis\">\n" +
    "                                <i class=\"fa fa-save fa-fw\"></i>&nbsp; Save as *.json\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                \n" +
    "                <button class=\"btn btn-default btn-xs\" open-hypothesis-layout-settings-modal layout-settings=\"layoutSettings[index]\">\n" +
    "                     	<i class=\"fa fa-eye fa-fw\"></i> Layout\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            <div class=\"pull-right\">\n" +
    "\n" +
    "                <div class=\"btn-group btn-group-xs\">\n" +
    "                    <button class=\"btn btn-default\" ng-click=\"firstStep()\">\n" +
    "                        <i class=\"fa fa-angle-double-left fa-fw\"></i>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default\" ng-click=\"previousStep()\">\n" +
    "                        <i class=\"fa fa-angle-left fa-fw\"></i>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default disabled\">\n" +
    "                        <span ng-bind=\"pointer + 1\"></span>/<span ng-bind=\"result.length\"></span>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default\" ng-click=\"nextStep()\">\n" +
    "                        <i class=\"fa fa-angle-right fa-fw\"></i>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default\" ng-click=\"lastStep()\">\n" +
    "                        <i class=\"fa fa-angle-double-right fa-fw\"></i>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "                <button class=\"btn btn-xs btn-danger\" panel-close-button=\"{{index}}\">\n" +
    "                    <i class=\"fa fa-close\"></i>\n" +
    "                </button>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: Subnavigation -->\n" +
    "\n" +
    "    <div class=\"hypothesis-panel\">\n" +
    "\n" +
    "        <hypothesis id=\"hypothesis-{{index}}\" test=\"getCurrentStep()\" layout-settings=\"layoutSettings[index]\"></hypothesis>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/directives/hypothesis.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/hypothesis.html",
    "<div style=\"position: absolute; top: 0; width: 100%; bottom: 0; overflow: hidden; background: #fff;\">\n" +
    "    <svg class=\"hypothesis\"></svg>\n" +
    "</div>");
}]);

angular.module("app/views/directives/load-screen.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/load-screen.html",
    "<div id=\"load-screen\">\n" +
    "    <p class=\"text-center\" id=\"load-screen-indicator\">\n" +
    "        <i class=\"fa fa-spin fa-3x fa-circle-o-notch\"></i>\n" +
    "    </p>\n" +
    "</div>");
}]);

angular.module("app/views/directives/navigation.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/navigation.html",
    "<nav class=\"app-navigation navbar navbar-default navbar-fixed-top navbar-application\" role=\"navigation\">\n" +
    "\n" +
    "    <div class=\"container-fluid\">\n" +
    "\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <a class=\"navbar-brand\" href=\"#/\"><strong>Wl</strong></a>\n" +
    "        </div>\n" +
    "\n" +
    "        <ul class=\"nav navbar-nav navbar-left navbar-menu\">\n" +
    "            <li>\n" +
    "                <a href=\"\" class=\"off-screen-navigation-handle\"><i class=\"fa fa-bars\"></i>&nbsp; Menu</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"app-navigation-wrapper\">\n" +
    "\n" +
    "            <button class=\"btn btn-default navbar-menu navbar-menu-close\">\n" +
    "                <i class=\"fa fa-close\"></i>\n" +
    "            </button>\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav navbar-left\">\n" +
    "                <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                    <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                       aria-expanded=\"false\">\n" +
    "                        <span ng-if=\"!project\">Project</span>\n" +
    "                        <strong ng-if=\"project\" ng-bind=\"project.name\" style=\"text-decoration: underline\"></strong>\n" +
    "                        <span class=\"caret\"></span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"dropdown-menu\" role=\"menu\" ng-if=\"project\">\n" +
    "                        <li><a class=\"disabled\" ui-sref=\"project\">Overview</a></li>\n" +
    "                        <li><a ui-sref=\"project.settings\">Settings</a></li>\n" +
    "                        <li class=\"divider\"></li>\n" +
    "                        <li><a href=\"#/\" ng-click=\"closeProject()\">Close</a></li>\n" +
    "                    </ul>\n" +
    "                    <ul class=\"dropdown-menu\" role=\"menu\" ng-if=\"!project\">\n" +
    "                        <li><a ui-sref=\"project.create\">Create a new project</a></li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <div ng-if=\"project\">\n" +
    "                <ul class=\"nav navbar-nav navbar-left\">\n" +
    "                    <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                        <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                           aria-expanded=\"false\">Symbols <span class=\"caret\"></span></a>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                            <li><a ui-sref=\"symbols.web\">Web Symbol Editor</a></li>\n" +
    "                            <li><a ui-sref=\"symbols.rest\">Rest Symbol Editor</a></li>\n" +
    "                            <!--<li class=\"divider\"></li>-->\n" +
    "                            <!--<li><a href=\"#/\">Text Editor</a></li>-->\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li><a ui-sref=\"symbols.import\">Import</a></li>\n" +
    "                            <li><a ui-sref=\"symbols.export\">Export</a></li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <ul class=\"nav navbar-nav navbar-left\">\n" +
    "                    <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                        <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                           aria-expanded=\"false\">Learn <span class=\"caret\"></span></a>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                            <li><a ui-sref=\"learn.setup.web\">Web Application</a></li>\n" +
    "                            <li><a ui-sref=\"learn.setup.rest\">Rest Interface</a></li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <ul class=\"nav navbar-nav navbar-left\">\n" +
    "                    <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                        <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                           aria-expanded=\"false\">Results <span class=\"caret\"></span></a>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                            <li><a ui-sref=\"learn.results\">View & Compare</a></li>\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li><a ui-sref=\"learn.results.statistics\">Statistics</a></li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav navbar-right\">\n" +
    "                <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                    <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                       aria-expanded=\"false\">App <span class=\"caret\"></span></a>\n" +
    "                    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                        <!--  <li><a href=\"#/\">Settings</a></li>  -->\n" +
    "                        <!--  <li class=\"divider\"></li> -->\n" +
    "                        <li><a ui-sref=\"about\">About</a></li>\n" +
    "                        <li><a ui-sref=\"help\">Help</a></li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav navbar-right\" ng-if=\"!project\">\n" +
    "                <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                    <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                       aria-expanded=\"false\">Tools <span class=\"caret\"></span></a>\n" +
    "                    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                        <li><a ui-sref=\"tools.hypotheses\">View Hypothesis from PC</a></li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</nav>\n" +
    "");
}]);

angular.module("app/views/directives/observation-table.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/observation-table.html",
    "");
}]);

angular.module("app/views/directives/rest-action-create-form.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/rest-action-create-form.html",
    "<form id=\"rest-action-create-form\" ng-submit=\"submitForm()\">\n" +
    "\n" +
    "    <select class=\"form-control\" ng-model=\"action.type\" ng-options=\"k for (k,v) in actionTypes\">\n" +
    "        <option value=\"\" disabled>Select an action you want to create</option>\n" +
    "    </select>\n" +
    "\n" +
    "    <p></p>\n" +
    "\n" +
    "    <!-- BEGIN: CALL_URL -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CALL_URL\">\n" +
    "        <p class=\"text-muted\">Make a HTTP request to an URL (relative to your projects base url)</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <select class=\"form-control\" ng-options=\"m for m in ['DELETE', 'GET', 'POST', 'PUT']\" ng-model=\"action.method\">\n" +
    "                <option value=\"\" disabled>Select a Method</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>Data</label>\n" +
    "            <div ng-model=\"action.data\" style=\"border-radius: 4px; width: 100%; height: 150px; border: 1px solid #ccc\" ui-ace=\"{useWrapMode : true, showGutter: true, theme:'eclipse', mode: 'json'}\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CALL_URL -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_ATTRIBUTE_EXISTS\">\n" +
    "        <p class=\"text-muted\">Check if a JSON attribute exists in the response body</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\" ng-model=\"action.attribute\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_ATTRIBUTE_TYPE -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_ATTRIBUTE_TYPE\">\n" +
    "        <p class=\"text-muted\">Check if a JSON attribute in the response body has a specific type</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\" ng-model=\"action.attribute\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <select class=\"form-control\" ng-model=\"action.jsonType\" ng-options=\"t as t for t in ['ARRAY', 'BOOLEAN', 'INTEGER', 'OBJECT', 'NULL', 'STRING']\">\n" +
    "                <option value=\"\" disabled>Choose a JavaScript type</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_ATTRIBUTE_TYPE -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_ATTRIBUTE_VALUE -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_ATTRIBUTE_VALUE\">\n" +
    "        <p class=\"text-muted\">Check a JSON attribute of the response body to be a specific value</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\" ng-model=\"action.attribute\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"the attribute value\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.regexp\"> is regular expression\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_ATTRIBUTE_VALUE -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_HEADER_FIELD -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_HEADER_FIELD\">\n" +
    "        <p class=\"text-muted\">Check a HTTP response header field to have a specific value</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"http header field, e.g. Content-Type\" ng-model=\"action.key\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"http header field value, e.g. application/json\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.regexp\">is regular expression\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_HEADER_FIELD -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_HTTP_BODY_TEXT -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_HTTP_BODY_TEXT\">\n" +
    "        <p class=\"text-muted\">Search for a string or a regular express in the response body of a request</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"value to search for\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.regexp\">\n" +
    "                is regular expression\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_HTTP_BODY_TEXT -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_STATUS -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_STATUS\">\n" +
    "        <p class=\"text-muted\">Check the HTTP response to have a specific status</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"number\" placeholder=\"e.g. 200, 404 ...\" ng-model=\"action.status\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_STATUS -->\n" +
    "\n" +
    "    <div ng-if=\"action.type\">\n" +
    "        <hr>\n" +
    "        <button class=\"btn btn-primary btn-sm\" type=\"submit\">Create Action</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/directives/rest-action-edit-form.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/rest-action-edit-form.html",
    "<form id=\"rest-action-update-form\" ng-submit=\"submitForm()\">\n" +
    "\n" +
    "    <!-- BEGIN: CALL_URL -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CALL_URL\">\n" +
    "        <p class=\"text-muted\">Make a HTTP request to an URL (relative to your projects base url)</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <select class=\"form-control\" ng-options=\"m for m in ['DELETE', 'GET', 'POST', 'PUT']\" ng-model=\"action.method\">\n" +
    "                <option value=\"\" disabled>Select a Method</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>Data</label>\n" +
    "            <div ng-model=\"action.data\" style=\"border-radius: 4px; width: 100%; height: 150px; border: 1px solid #ccc\" ui-ace=\"{useWrapMode : true, showGutter: true, theme:'eclipse', mode: 'json'}\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CALL_URL -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_ATTRIBUTE_EXISTS\">\n" +
    "        <p class=\"text-muted\">Check if a JSON attribute exists in the response body</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\" ng-model=\"action.attribute\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_ATTRIBUTE_TYPE -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_ATTRIBUTE_TYPE\">\n" +
    "        <p class=\"text-muted\">Check if a JSON attribute in the response body has a specific type</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\" ng-model=\"action.attribute\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <select class=\"form-control\" ng-model=\"action.jsonType\" ng-options=\"t as t for t in ['ARRAY', 'BOOLEAN', 'INTEGER', 'OBJECT', 'NULL', 'STRING']\">\n" +
    "                <option value=\"\" disabled>Choose a JavaScript type</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_ATTRIBUTE_TYPE -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_ATTRIBUTE_VALUE -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_ATTRIBUTE_VALUE\">\n" +
    "        <p class=\"text-muted\">Check a JSON attribute of the response body to be a specific value</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\" ng-model=\"action.attribute\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"the attribute value\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.regexp\"> is regular expression\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_ATTRIBUTE_VALUE -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_HEADER_FIELD -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_HEADER_FIELD\">\n" +
    "        <p class=\"text-muted\">Check a HTTP response header field to have a specific value</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"http header field, e.g. Content-Type\" ng-model=\"action.key\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"http header field value, e.g. application/json\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.regexp\">is regular expression\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_HEADER_FIELD -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_HTTP_BODY_TEXT -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_HTTP_BODY_TEXT\">\n" +
    "        <p class=\"text-muted\">Search for a string or a regular express in the response body of a request</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"value to search for\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.regexp\">\n" +
    "                is regular expression\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_HTTP_BODY_TEXT -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CHECK_STATUS -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CHECK_STATUS\">\n" +
    "        <p class=\"text-muted\">Check the HTTP response to have a specific status</p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"number\" placeholder=\"e.g. 200, 404 ...\" ng-model=\"action.status\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: CHECK_STATUS -->\n" +
    "\n" +
    "    <hr>\n" +
    "    <button class=\"btn btn-primary btn-sm\" type=\"submit\">Update Action</button>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/directives/symbol-create-form.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/symbol-create-form.html",
    "<form id=\"symbol-create-form\" name=\"create_symbol_form\" ng-submit=\"submitForm()\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>Symbol Name</label>\n" +
    "        <input class=\"form-control\" name=\"name\" type=\"text\" placeholder=\"name\" required ng-model=\"symbol.name\">\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-danger alert-condensed\" ng-show=\"create_symbol_form.name.$dirty && create_symbol_form.name.$invalid\">\n" +
    "        <small ng-show=\"create_symbol_form.name.$error.required\"> The field must not be empty. </small>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>Symbol Abbreviation</label>\n" +
    "        <input class=\"form-control\" name=\"abbreviation\" type=\"text\" placeholder=\"abbreviation\" required ng-model=\"symbol.abbreviation\">\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-danger alert-condensed\" ng-show=\"create_symbol_form.abbreviation.$dirty && create_symbol_form.abbreviation.$invalid\">\n" +
    "        <small ng-show=\"create_symbol_form.abbreviation.$error.required\"> The field must not be empty. </small>\n" +
    "    </div>\n" +
    "\n" +
    "    <button class=\"btn btn-primary\" type=\"submit\">Create Symbol</button>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/directives/symbol-edit-form.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/symbol-edit-form.html",
    "<form name=\"update_symbol_form\" ng-submit=\"submitForm()\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>Symbol Name</label>\n" +
    "        <input class=\"form-control\" name=\"name\" type=\"text\" placeholder=\"name\" required ng-model=\"symbol.name\">\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-danger alert-condensed\"\n" +
    "         ng-show=\"update_symbol_form.name.$dirty && update_symbol_form.name.$invalid\">\n" +
    "        <small ng-show=\"update_symbol_form.name.$error.required\"> The field must not be empty.</small>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>Symbol Abbreviation</label>\n" +
    "        <input class=\"form-control\" name=\"abbreviation\" type=\"text\" placeholder=\"abbreviation\" required\n" +
    "               ng-model=\"symbol.abbreviation\">\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-danger alert-condensed\"\n" +
    "         ng-show=\"update_symbol_form.abbreviation.$dirty && update_symbol_form.abbreviation.$invalid\">\n" +
    "        <small ng-show=\"update_symbol_form.abbreviation.$error.required\"> The field must not be empty.</small>\n" +
    "    </div>\n" +
    "\n" +
    "    <button class=\"btn btn-sm btn-primary\" type=\"submit\">Update Symbol</button>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/directives/web-action-create-form.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/web-action-create-form.html",
    "<form id=\"web-action-create-form\" ng-submit=\"submitForm()\">\n" +
    "\n" +
    "    <select class=\"form-control\" ng-model=\"action.type\" ng-options=\"k for (k,v) in actionTypes\">\n" +
    "        <option value=\"\" disabled>Select an action you want to create</option>\n" +
    "    </select>\n" +
    "\n" +
    "    <p></p>\n" +
    "\n" +
    "    <!-- BEGIN: SEARCH_FOR_TEXT -->\n" +
    "    <div ng-if=\"action.type == actionTypes.SEARCH_FOR_TEXT\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Search on a page for a piece of text or a regular expression\n" +
    "        </p>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Value</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.regexp\"> Use Regular Expression\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.value\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: SEARCH_FOR_TEXT -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: SEARCH_FOR_NODE -->\n" +
    "    <div ng-if=\"action.type == actionTypes.SEARCH_FOR_NODE\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Search an HTML element in the DOM tree of a page\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.value\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: SEARCH_FOR_NODE -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CLEAR -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CLEAR\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Clear an element (eg. input or contenteditable element)\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "        </div>\n" +
    "\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.node\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: CLEAR -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CLICK -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CLICK\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Click on an element\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.node\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: CLICK -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: FILL -->\n" +
    "    <div ng-if=\"action.type == actionTypes.FILL\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Fill an element with content (eg. input or contenteditable element)\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">The value to fill the element with</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.generator\">\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.node\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: FILL -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: GO_TO -->\n" +
    "    <div ng-if=\"action.type == actionTypes.GO_TO\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Go to a url that is <strong>relative</strong> to your projects' base url\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Url</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: GO_TO -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: SUBMIT -->\n" +
    "    <div ng-if=\"action.type == actionTypes.SUBMIT\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Submit a form\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.node\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: SUBMIT -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: WAIT -->\n" +
    "    <div ng-if=\"action.type == actionTypes.WAIT\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Wait for a specified amount of time before the next action will be executed\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Time to wait (in ms)</label>\n" +
    "            <input class=\"form-control\" type=\"number\" placeholder=\"time in ms\" ng-model=\"action.duration\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: WAIT -->\n" +
    "\n" +
    "    <div ng-if=\"action.type\">\n" +
    "        <hr>\n" +
    "        <button class=\"btn btn-primary btn-sm\" type=\"submit\">Create Action</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/directives/web-action-edit-form.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/web-action-edit-form.html",
    "<form id=\"web-action-edit-form\" ng-submit=\"submitForm()\">\n" +
    "\n" +
    "    <!-- BEGIN: SEARCH_FOR_TEXT -->\n" +
    "    <div ng-if=\"action.type == actionTypes.SEARCH_FOR_TEXT\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Search on a page for a piece of text or a regular expression\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Value</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.regexp\"> Use Regular Expression\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.value\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: SEARCH_FOR_TEXT -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: SEARCH_FOR_NODE -->\n" +
    "    <div ng-if=\"action.type == actionTypes.SEARCH_FOR_NODE\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Search an HTML element in the DOM tree of a page\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.value\">\n" +
    "        </div>\n" +
    "\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.value\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: SEARCH_FOR_NODE -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CLEAR -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CLEAR\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Clear an element (eg. input or contenteditable element)\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "        </div>\n" +
    "\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.node\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: CLEAR -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: CLICK -->\n" +
    "    <div ng-if=\"action.type == actionTypes.CLICK\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Click on an element\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.node\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: CLICK -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: FILL -->\n" +
    "    <div ng-if=\"action.type == actionTypes.FILL\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Fill an element with content (eg. input or contenteditable element)\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">The value to fill the element with</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.generator\">\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.node\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: FILL -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: GO_TO -->\n" +
    "    <div ng-if=\"action.type == actionTypes.GO_TO\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Go to a url that is <strong>relative</strong> to your projects' base url\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Url</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: GO_TO -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: SUBMIT -->\n" +
    "    <div ng-if=\"action.type == actionTypes.SUBMIT\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Submit a form\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">CSS selector</label>\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "        </div>\n" +
    "        <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\" selector=\"action.node\">\n" +
    "            <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <!-- END: SUBMIT -->\n" +
    "\n" +
    "\n" +
    "    <!-- BEGIN: WAIT -->\n" +
    "    <div ng-if=\"action.type == actionTypes.WAIT\">\n" +
    "        <p class=\"text-muted\">\n" +
    "            Wait for a specified amount of time before the next action will be executed\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Time to wait (in ms)</label>\n" +
    "            <input class=\"form-control\" type=\"number\" placeholder=\"time in ms\" ng-model=\"action.duration\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: WAIT -->\n" +
    "\n" +
    "    <hr>\n" +
    "    <button class=\"btn btn-primary btn-sm\" type=\"submit\">Update Action</button>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/directives/web-element-picker.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/web-element-picker.html",
    "<div ng-show=\"show\" id=\"web-element-picker-wrapper\">\n" +
    "\n" +
    "    <div id=\"web-element-picker\">\n" +
    "\n" +
    "        <nav class=\"navbar navbar-default\" role=\"navigation\">\n" +
    "            <div class=\"container-fluid\">\n" +
    "\n" +
    "                <form class=\"navbar-form navbar-left\" ng-submit=\"loadUrl()\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <div class=\"input-group-addon\" tooltip-placement=\"right\" tooltip=\"{{project.baseUrl}}\">..</div>\n" +
    "                            <input type=\"text\" class=\"form-control\" ng-model=\"url\" placeholder=\"url\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <button type=\"submit\" class=\"btn btn-default\">Load</button>\n" +
    "                </form>\n" +
    "\n" +
    "                <button class=\"btn btn-default navbar-btn\" ng-click=\"enableSelection()\"><i\n" +
    "                        class=\"fa fa-magic\"></i></button>\n" +
    "\n" +
    "                <button class=\"btn btn-default navbar-btn disabled\" ng-show=\"selector != null\" ng-bind=\"selector\"></button>\n" +
    "                <button class=\"btn btn-default navbar-btn disabled\" ng-show=\"selector == null\">\n" +
    "                    No Selected Element\n" +
    "                </button>\n" +
    "\n" +
    "                <div class=\"navbar navbar-nav navbar-right\">\n" +
    "                    <button class=\"btn btn-default navbar-btn pull-right\" ng-click=\"close()\"><i\n" +
    "                            class=\"fa fa-close\"></i></button>\n" +
    "                    <button class=\"btn btn-default navbar-btn pull-right\" ng-click=\"ok()\" style=\"margin-right: 7px\">ok\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </nav>\n" +
    "\n" +
    "        <div class=\"iframe-wrapper\">\n" +
    "            <iframe fit-parent-dimensions bind-resize=\"true\"></iframe>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/modals/action-create-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/action-create-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"closeModal()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "	<h3 class=\"modal-title\">Create <span ng-bind=\"(symbol.type|capitalize)\"></span> Action</h3>\n" +
    "	<span class=\"text-muted\">Create a new action for a <span ng-bind=\"symbol.type\"></span> symbol</span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <web-action-create-form if-is-type-of-web=\"symbol.type\"></web-action-create-form>\n" +
    "    <rest-action-create-form if-is-type-of-rest=\"symbol.type\"></rest-action-create-form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/modals/action-edit-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/action-edit-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"closeModal()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "    <div>\n" +
    "        <h3 class=\"modal-title\">Update <span ng-bind=\"(symbol.type|capitalize)\"></span> Action</h3>\n" +
    "        <span class=\"text-muted\">Update an existing action for a <span ng-bind=\"symbol.type\"></span> symbol</span>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <web-action-edit-form action=\"action\" if-is-type-of-web=\"symbol.type\"></web-action-edit-form>\n" +
    "    <rest-action-edit-form action=\"action\" if-is-type-of-rest=\"symbol.type\"></rest-action-edit-form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/modals/hypothesis-layout-settings-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/hypothesis-layout-settings-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <div>\n" +
    "        <h3 class=\"modal-title\">Hypothesis Layout Settings</h3>\n" +
    "        <span class=\"text-muted\">Edit the settings for the presentation of the hypothesis</span>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "	\n" +
    "	<div class=\"form-group\">\n" +
    "		<label>Node Separation</label>\n" +
    "		<input type=\"number\" class=\"form-control\" placeholder=\"nodesep\" ng-model=\"layoutSettings.nodesep\">\n" +
    "		<p class=\"help-block\">Number of pixels that separate nodes horizontally in the layout.</p>\n" +
    "	</div>\n" +
    "	\n" +
    "	<div class=\"form-group\">\n" +
    "		<label>Edge Separation</label>\n" +
    "		<input type=\"number\" class=\"form-control\" placeholder=\"edgesep\" ng-model=\"layoutSettings.edgesep\">\n" +
    "		<p class=\"help-block\">Number of pixels that separate edges horizontally in the layout.</p>\n" +
    "	</div>\n" +
    "	\n" +
    "	<div class=\"form-group\">\n" +
    "		<label>Rank Separation</label>\n" +
    "		<input type=\"number\" class=\"form-control\" placeholder=\"ranksep\" ng-model=\"layoutSettings.ranksep\">\n" +
    "		<p class=\"help-block\">Number of pixels between each rank in the layout.</p>\n" +
    "	</div>\n" +
    "	\n" +
    "	<div class=\"checkbox\">\n" +
    "    	<label>\n" +
    "      		<input type=\"checkbox\" ng-model=\"layoutSettings.multigraph\"> Multigraph\n" +
    "    	</label>\n" +
    "  	</div>\n" +
    "		\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "	<button class=\"btn btn-default btn-sm\" ng-click=\"defaultLayoutSettings()\">Default</button>\n" +
    "    <button class=\"btn btn-primary btn-sm\" ng-click=\"update()\">Update</button>\n" +
    "    <button class=\"btn btn-warning btn-sm\" ng-click=\"close()\">Cancel</button>\n" +
    "</div>");
}]);

angular.module("app/views/modals/modal-confirm-dialog.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/modal-confirm-dialog.html",
    "<form ng-submit=\"ok()\">\n" +
    "\n" +
    "	<div class=\"modal-body\">\n" +
    "	    <h4 ng-bind=\"text\"></h4>\n" +
    "	</div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"submit\" class=\"btn btn-primary btn-sm\">Yes</button>\n" +
    "        <a class=\"btn btn-default btn-sm\" ng-click=\"close()\">No</a>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/modals/modal-prompt-dialog.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/modal-prompt-dialog.html",
    "<div class=\"modal-header\">\n" +
    "    <h3 ng-bind=\"text\"></h3>\n" +
    "</div>\n" +
    "\n" +
    "<form name=\"prompt_form\" ng-submit=\"ok()\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <input name=\"user_input\" type=\"text\" class=\"form-control\" ng-model=\"userInput\" ng-pattern=\"inputPattern\" required>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"prompt_form.submitted\">\n" +
    "            <small ng-show=\"prompt_form.user_input.$error\" ng-bind=\"errorMsg\"></small>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button type=\"submit\" class=\"btn btn-primary btn-sm\">Ok</button>\n" +
    "        <a class=\"btn btn-default btn-sm\" ng-click=\"close()\">Cancel</a>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/modals/modal-test-details.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/modal-test-details.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <h3 class=\"modal-title\">Test Details</h3>\n" +
    "    <span class=\"text-muted\">View some details about this test</span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <table class=\"table table-condensed\">\n" +
    "\n" +
    "        <tr class=\"active\">\n" +
    "            <td colspan=\"2\"><strong>About This Test</strong></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>nth Test</td>\n" +
    "            <td>{{test.testNo}}</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>nth Hypothesis</td>\n" +
    "            <td>{{test.stepNo}}</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Started</td>\n" +
    "            <td format-data-time=\"test.startDate\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Duration</td>\n" +
    "            <td>{{test.duration}} ms</td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr class=\"active\">\n" +
    "            <td colspan=\"2\"><strong>Configuration</strong></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Algorithm</td>\n" +
    "            <td>{{test.configuration.algorithm}}</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>EQ Oracle</td>\n" +
    "            <td>{{test.configuration.eqOracle.type}}</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Steps to Learn</td>\n" +
    "            <td>{{test.configuration.maxAmountOfStepsToLearn}}</td>\n" +
    "        </tr>\n" +
    "\n" +
    "    </table>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">Ok</button>\n" +
    "</div>");
}]);

angular.module("app/views/modals/modal-test-setup-settings.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/modal-test-setup-settings.html",
    "<div class=\"modal-header\">\n" +
    "	<h3 class=\"modal-title\">Test Settings</h3>\n" +
    "	<span class=\"text-muted\">Manually set some parameters for the\n" +
    "		Test</span>\n" +
    "</div>\n" +
    "\n" +
    "<form name=\"learn_config_form\" ng-submit=\"ok()\">\n" +
    "\n" +
    "	<div class=\"modal-body\">\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"control-label\">Algorithm</label><br> <span\n" +
    "				class=\"text-muted\">Select an algorithm that will be used for\n" +
    "				the learn process (default is L*)</span> <select class=\"form-control\"\n" +
    "				ng-model=\"learnConfiguration.algorithm\"\n" +
    "				ng-options=\"k for (k,v) in learnAlgorithms\">\n" +
    "				<option value=\"\" disabled>select an algorithm</option>\n" +
    "			</select>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"control-label\">EQ Oracle</label><br> <span\n" +
    "				class=\"text-muted\">Select how counter examples should be\n" +
    "				found (default is COMPLETE)</span> <select class=\"form-control\"\n" +
    "				ng-model=\"learnConfiguration.eqOracle.type\"\n" +
    "				ng-options=\"v for (k,v) in eqOracles\">\n" +
    "				<option value=\"\" disabled>select a method</option>\n" +
    "			</select>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "\n" +
    "			<!-- BEGIN: EQ Oracle: RANDOM -->\n" +
    "			<div ng-if=\"learnConfiguration.eqOracle.type == eqOracles.RANDOM\">\n" +
    "				<p>\n" +
    "					<input class=\"form-control\" name=\"eq_oracle_random_min_length\"\n" +
    "						ng-model=\"learnConfiguration.eqOracle.minLength\" type=\"number\"\n" +
    "						required min=\"0\" style=\"display: inline; width: auto\"\n" +
    "						placeholder=\"0\"> min length\n" +
    "				</p>\n" +
    "				<div class=\"alert alert-danger alert-condensed\"\n" +
    "					ng-show=\"learn_config_form.eq_oracle_random_min_length.$dirty && learn_config_form.eq_oracle_random_min_length.$invalid\">\n" +
    "					<small\n" +
    "						ng-show=\"learn_config_form.eq_oracle_complete_min_depth.$error.required\">\n" +
    "						The field must not be empty. </small>\n" +
    "				</div>\n" +
    "\n" +
    "				<p>\n" +
    "					<input class=\"form-control\" name=\"eq_oracle_random_max_length\"\n" +
    "						ng-model=\"learnConfiguration.eqOracle.maxLength\" type=\"number\"\n" +
    "						required min=\"0\" style=\"display: inline; width: auto\"\n" +
    "						placeholder=\"0\"> max length\n" +
    "				</p>\n" +
    "				<div class=\"alert alert-danger alert-condensed\"\n" +
    "					ng-show=\"learn_config_form.eq_oracle_random_max_length.$dirty && learn_config_form.eq_oracle_random_max_length.$invalid\">\n" +
    "					<small\n" +
    "						ng-show=\"learn_config_form.eq_oracle_random_max_length.$error.required\">\n" +
    "						The field must not be empty. </small>\n" +
    "				</div>\n" +
    "\n" +
    "				<p>\n" +
    "					<input class=\"form-control\" name=\"eq_oracle_random_no_words\"\n" +
    "						ng-model=\"learnConfiguration.eqOracle.maxNoOfTests\" type=\"number\"\n" +
    "						required min=\"0\" style=\"display: inline; width: auto\"\n" +
    "						placeholder=\"0\"> no of random words to be generated\n" +
    "				</p>\n" +
    "				<div class=\"alert alert-danger alert-condensed\"\n" +
    "					ng-show=\"learn_config_form.eq_oracle_random_no_words.$dirty && learn_config_form.eq_oracle_random_no_words.$invalid\">\n" +
    "					<small\n" +
    "						ng-show=\"learn_config_form.eq_oracle_random_no_words.$error.required\">\n" +
    "						The field must not be empty. </small>\n" +
    "				</div>\n" +
    "			</div>\n" +
    "			<!-- END: EQ Oracle: RANDOM -->\n" +
    "\n" +
    "			<!-- BEGIN: EQ Oracle: COMPLETE -->\n" +
    "			<div ng-if=\"learnConfiguration.eqOracle.type == eqOracles.COMPLETE\">\n" +
    "				<p>\n" +
    "					<input class=\"form-control\" name=\"eq_oracle_complete_min_depth\"\n" +
    "						ng-model=\"learnConfiguration.eqOracle.minDepth\" type=\"number\"\n" +
    "						required min=\"0\" style=\"display: inline; width: auto\"\n" +
    "						placeholder=\"0\"> min depth\n" +
    "				</p>\n" +
    "				<div class=\"alert alert-danger alert-condensed\"\n" +
    "					ng-show=\"learn_config_form.eq_oracle_complete_min_depth.$dirty && learn_config_form.eq_oracle_complete_min_depth.$invalid\">\n" +
    "					<small\n" +
    "						ng-show=\"learn_config_form.eq_oracle_complete_min_depth.$error.required\">\n" +
    "						The field must not be empty. </small>\n" +
    "				</div>\n" +
    "\n" +
    "				<p>\n" +
    "					<input class=\"form-control\" name=\"eq_oracle_complete_max_depth\"\n" +
    "						ng-model=\"learnConfiguration.eqOracle.maxDepth\" type=\"number\"\n" +
    "						required min=\"0\" style=\"display: inline; width: auto\"\n" +
    "						placeholder=\"0\"> max depth\n" +
    "				</p>\n" +
    "				<div class=\"alert alert-danger alert-condensed\"\n" +
    "					ng-show=\"learn_config_form.eq_oracle_complete_max_depth.$dirty && learn_config_form.eq_oracle_complete_max_depth.$invalid\">\n" +
    "					<small\n" +
    "						ng-show=\"learn_config_form.eq_oracle_complete_max_depth.$error.required\">\n" +
    "						The field must not be empty. </small>\n" +
    "				</div>\n" +
    "\n" +
    "			</div>\n" +
    "			<!-- END: EQ Oracle: COMPLETE -->\n" +
    "\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"control-label\">Max Amount of Steps to Learn (0\n" +
    "				:= never stop)</label> <input name=\"max_steps\" required min=\"0\"\n" +
    "				ng-model=\"learnConfiguration.maxAmountOfStepsToLearn\"\n" +
    "				class=\"form-control\" type=\"number\" placeholder=\"0\">\n" +
    "		</div>\n" +
    "		<div class=\"alert alert-danger alert-condensed\"\n" +
    "			ng-show=\"learn_config_form.max_steps.$dirty && learn_config_form.max_steps.$invalid\">\n" +
    "			<small ng-show=\"learn_config_form.max_steps.$error.required\">\n" +
    "				The field must not be empty. </small>\n" +
    "		</div>\n" +
    "\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"modal-footer\">\n" +
    "		<button class=\"btn btn-default\" type=\"submit\">Ok</button>\n" +
    "		<a class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</a>\n" +
    "	</div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/modals/symbol-create-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/symbol-create-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"closeModal()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "	<h3 class=\"modal-title\">Create <span ng-bind=\"(type|capitalize)\"></span> Symbol</h3>\n" +
    "    <span class=\"text-muted\">Create a new <span ng-bind=\"type\"></span> symbol</span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <symbol-create-form type=\"{{type}}\"></symbol-create-form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/modals/symbol-edit-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/symbol-edit-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"closeModal()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "	<h3 class=\"modal-title\">Update <span ng-bind=\"(symbol.type|capitalize)\"></span> Symbol</h3>\n" +
    "	<span class=\"text-muted\">Update an existing <span ng-bind=\"symbol.type\"></span> symbol</span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <symbol-edit-form symbol=\"symbol\"></symbol-edit-form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/about.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/about.html",
    "<div class=\"container\">\n" +
    "\n" +
    "    <h2>About</h2>\n" +
    "    <p class=\"text-muted\">Information about this application</p>\n" +
    "    <hr/>\n" +
    "\n" +
    "    <h3>Authors</h3>\n" +
    "    <p>\n" +
    "        <strong>Alexander Bainczyk</strong><br>\n" +
    "        <a href=\"mailto:alexander.bainczyk@tu-dortmund.de\">\n" +
    "            <i class=\"fa fa-envelope-o fa-fw\"></i>&nbsp;\n" +
    "            alexander.bainczyk@tu-dortmund.de\n" +
    "        </a>\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        <strong>Alexander Schieweck</strong><br>\n" +
    "        <a href=\"mailto:alexander.schieweck@tu-dortmund.de\">\n" +
    "            <i class=\"fa fa-envelope-o fa-fw\"></i>&nbsp;\n" +
    "            alexander.schieweck@tu-dortmund.de\n" +
    "        </a>\n" +
    "    </p>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/help.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/help.html",
    "<div class=\"container\">\n" +
    "\n" +
    "    <h2>Help</h2>\n" +
    "    <p class=\"text-muted\">If you need help using this application, maybe there is some information for you here</p>\n" +
    "    <hr/>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/home.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/home.html",
    "<div class=\"container\">\n" +
    "\n" +
    "    <div class=\"list-group project-list-group\">\n" +
    "\n" +
    "        <div class=\"list-group-item\" ng-if=\"projects.length > 0\" ng-repeat=\"project in projects\"\n" +
    "             ng-click=\"openProject(project)\">\n" +
    "            <h3 class=\"list-group-item-heading\" ng-bind=\"project.name\"></h3>\n" +
    "\n" +
    "            <p class=\"list-group-item-text\">\n" +
    "                <span ng-bind=\"project.baseUrl\"></span> <br>\n" +
    "                <span class=\"text-muted\" ng-if=\"!project.description\">There is no description for this project</span>\n" +
    "                <span class=\"text-muted\" ng-if=\"project.description\" ng-bind=\"project.description\"></span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"container\" ng-if=\"projects.length == 0\">\n" +
    "            <div class=\"alert alert-info\">\n" +
    "                You haven't created a project yet. You can create a new one <a href=\"#/project/create\">here</a> and start\n" +
    "                testing it.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/learn-results-compare.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/learn-results-compare.html",
    "<div panel-manager=\"panels\">\n" +
    "\n" +
    "    <div panel panel-index=\"$index\" ng-repeat=\"result in panels track by $index\">\n" +
    "\n" +
    "        <div ng-if=\"result\">\n" +
    "            <hypothesis-slideshow-panel panel-index=\"{{$index}}\" result=\"result\"></hypothesis-slideshow-panel>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"!result\" style=\"padding: 30px\">\n" +
    "\n" +
    "            <ul class=\"list-group\">\n" +
    "                <li class=\"list-group-item\" ng-repeat=\"result in finalTestResults\"\n" +
    "                    ng-click=\"fillPanel(result, $parent.$index)\">\n" +
    "\n" +
    "                    <strong>Test No\n" +
    "                        <span ng-bind=\"result.testNo\"></span>\n" +
    "                    </strong>,\n" +
    "                    [<span ng-bind=\"result.configuration.algorithm\"></span>]\n" +
    "\n" +
    "                    <br>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Started: <span ng-bind=\"(result.startTime | date : 'EEE, dd.MM.yyyy, HH:mm')\"></span>\n" +
    "                    </p>\n" +
    "\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"panels.length == 0\" style=\"padding-top: 30px\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"alert alert-info\">\n" +
    "                Add a panel first\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/learn-results-statistics.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/learn-results-statistics.html",
    "<div class=\"container\">\n" +
    "\n" +
    "    <h2>Statistics</h2>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Have a look at some numbers we gathered for your tests\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "\n" +
    "    <div class=\"container\" ng-if=\"chartDataSets.length == 0\">\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" select-all-items-checkbox items=\"tests\">\n" +
    "        </div>\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"chartFromSingleCompleteTestResult()\">\n" +
    "                <i class=\"fa fa-line-chart fa-fw\"></i> Single Complete Test\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"chartFromMultipleFinalTestResults()\">\n" +
    "                <i class=\"fa fa-bar-chart fa-fw\"></i> Multiple Tests\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"chartFromTwoCompleteTestResults()\">\n" +
    "                <i class=\"fa fa-columns fa-fw\"></i> Compare Two Complete Tests\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"pull-right\">\n" +
    "\n" +
    "            <div class=\"btn-group btn-group-xs pull-right\" dropdown>\n" +
    "                <button type=\"button\" class=\"btn btn-default dropdown-toggle\" dropdown-toggle>\n" +
    "                    <i class=\"fa fa-download fa-fw\"></i> Export to CSV\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                    <li>\n" +
    "                        <a href=\"\" download-test-results-as-csv test-results=\"tests\">\n" +
    "                            All Final Results\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href=\"\" download-test-results-as-csv test-results=\"tests\">\n" +
    "                            A Single Complete Result\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"container\" ng-if=\"chartDataSets.length > 0\">\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"back()\">\n" +
    "                <i class=\"fa fa-list-ul fa-fw\"></i> Test Results\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" download-canvas-as-image=\"test-results-chart\">\n" +
    "                <i class=\"fa fa-save fa-fw\"></i> Download Diagram\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\" ng-if=\"chartDataSets.length == 0\">\n" +
    "\n" +
    "    <div selectable-list ng-model=\"tests\">\n" +
    "        <div selectable-list-item ng-repeat=\"test in tests\">\n" +
    "\n" +
    "            <span class=\"label label-primary pull-right\">\n" +
    "                Web\n" +
    "            </span>\n" +
    "\n" +
    "            <strong>Test No\n" +
    "                <span ng-bind=\"test.testNo\"></span>\n" +
    "            </strong>,\n" +
    "            [<span ng-bind=\"test.configuration.algorithm\"></span>]\n" +
    "\n" +
    "            <br>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Started: <span ng-bind=\"(test.startTime | date : 'EEE, dd.MM.yyyy, HH:mm')\"></span>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\" ng-if=\"chartDataSets.length > 0\">\n" +
    "\n" +
    "    <hr>\n" +
    "\n" +
    "    <div ng-if=\"chartMode == chartModes.MULTIPLE_FINAL_TEST_RESULTS\">\n" +
    "        <div test-results-chart test-results-chart-multiple-final chart-data=\"chartDataSets\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"chartMode == chartModes.SINGLE_COMPLETE_TEST_RESULT\">\n" +
    "        <div test-results-chart test-results-chart-single-complete chart-data=\"chartDataSets\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"chartMode == chartModes.TWO_COMPLETE_TEST_RESULTS\">\n" +
    "        <div test-results-chart test-results-chart-two-complete chart-data=\"chartDataSets\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/learn-results.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/learn-results.html",
    "<div class=\"container\">\n" +
    "        <h2>Tests</h2>\n" +
    "\n" +
    "        <p class=\"text-muted\">\n" +
    "            Have a look at all the tests you ran for this project\n" +
    "        </p>\n" +
    "        <hr>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"tests.length > 0\">\n" +
    "        <div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "            <div class=\"container\">\n" +
    "                <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "                    <input type=\"checkbox\" select-all-items-checkbox items=\"tests\">\n" +
    "                </div>\n" +
    "                <div class=\"pull-left\">\n" +
    "                    <button class=\"btn btn-xs btn-primary\" ng-click=\"deleteTests()\">\n" +
    "                        Delete\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-xs btn-default\">\n" +
    "                        Slideshow\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"container\">\n" +
    "\n" +
    "            <div selectable-list ng-model=\"tests\">\n" +
    "                <div selectable-list-item ng-repeat=\"test in (tests|typeOfWeb)\">\n" +
    "\n" +
    "                    <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                            <i class=\"fa fa-bars\"></i>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                            <li>\n" +
    "                                <a href=\"\" open-test-details-modal test=\"test\">\n" +
    "                                    <i class=\"fa fa-info fa-fw\"></i>&nbsp; Details\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a ui-sref=\"learn.results.compare({testNos: [test.testNo]})\">\n" +
    "                                    <i class=\"fa fa-code-fork fa-fw\"></i>&nbsp; Hypotheses\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a href=\"\" ng-click=\"deleteTest(test)\">\n" +
    "                                    <i class=\"fa fa-trash fa-fw\"></i>&nbsp; Delete\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <strong>Test No\n" +
    "                        <span ng-bind=\"test.testNo\"></span>\n" +
    "                    </strong>,\n" +
    "                    [<span ng-bind=\"test.configuration.algorithm\"></span>]\n" +
    "\n" +
    "                    <br>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Started: <span ng-bind=\"(test.startTime | date : 'EEE, dd.MM.yyyy, HH:mm')\"></span>\n" +
    "                    </p>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"container\" ng-if=\"tests.length == 0\">\n" +
    "        <div class=\"alert alert-info\">\n" +
    "            You have not run any tests yet or the active one is not finished.\n" +
    "        </div>\n" +
    "    </div>\n" +
    "");
}]);

angular.module("app/views/pages/learn-setup.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/learn-setup.html",
    "<div class=\"container\">\n" +
    "    <h2>Test Setup - <span ng-bind=\"(type|capitalize)\"></span></h2>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Include or exclude Symbols you want to use for the following test\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" select-all-items-checkbox items=\"symbols\">\n" +
    "        </div>\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-xs btn-default\" open-test-setup-settings-modal\n" +
    "                    learn-configuration=\"learnConfiguration\" on-ok=\"updateLearnConfiguration\">\n" +
    "                <i class=\"fa fa-gear\"></i>\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-primary\" ng-click=\"startLearning()\">\n" +
    "                Start Test\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "\n" +
    "    <div selectable-list ng-model=\"symbols\">\n" +
    "        <div selectable-list-item ng-repeat=\"symbol in symbols\">\n" +
    "\n" +
    "            <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                    <span ng-bind=\"symbol.actions.length\"></span> Actions <i class=\"fa fa-edit\"></i>\n" +
    "                </a>\n" +
    "            </p>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/learn-start.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/learn-start.html",
    "<div style=\"position: absolute; width: 100%; top: 50px; bottom: 0; overflow: auto;\">\n" +
    "\n" +
    "    <div ng-if=\"active == true\" class=\"container\" style=\"margin-top: 54px\">\n" +
    "        <div class=\"alert alert-info\">\n" +
    "            <i class=\"fa fa-circle-o-notch fa-spin\"></i>&nbsp; Application is learning ... <br>\n" +
    "        </div>\n" +
    "        <hr>\n" +
    "        <button class=\"btn btn-default btn-xs pull-right\" ng-click=\"abort()\">\n" +
    "            <i class=\"fa fa-close fa-fw\"></i> Abort Learning\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"!active && test\">\n" +
    "        <div class=\"sub-nav fixed\">\n" +
    "            <div class=\"container-fluid\">\n" +
    "\n" +
    "                <div class=\"pull-left\">\n" +
    "                    <button class=\"btn btn-xs btn-default\" open-test-details-modal test=\"test\">\n" +
    "                        <i class=\"fa fa-info fa-fw\"></i> Details\n" +
    "                    </button>\n" +
    "                	<button class=\"btn btn-xs btn-default\" open-hypothesis-layout-settings-modal layout-settings=\"layoutSettings\" on-update=\"updateLayoutSettings\">\n" +
    "                		<i class=\"fa fa-eye fa-fw\"></i> Layout\n" +
    "                	</button>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"pull-right\" ng-if=\"isEqOracleSample\">\n" +
    "                    <button class=\"btn btn-xs btn-success\" ng-click=\"resumeLearning()\">\n" +
    "                        Resume\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel-sidebar\" ng-if=\"isEqOracleSample\">\n" +
    "\n" +
    "            <div widget widget-title=\"Configuration\" collapsed=\"false\">\n" +
    "                <div widget-test-resume-settings configuration=\"test.configuration\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div widget widget-title=\"Counter Examples\" collapsed=\"true\">\n" +
    "                <div widget-counter-examples counter-examples=\"test.configuration.eqOracle.counterExamples\" counter-example=\"counterExample\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <hypothesis test=\"test\" counter-example=\"counterExample\" layout-settings=\"layoutSettings\"></hypothesis>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/views/pages/project-create.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/project-create.html",
    "<div class=\"container\">\n" +
    "\n" +
    "    <h2>Create a New Project</h2>\n" +
    "\n" +
    "    <p class=\"text-muted\">You can create a new project here</p>\n" +
    "    <hr/>\n" +
    "\n" +
    "    <form id=\"project-create-form\" name=\"create_form\" role=\"form\" ng-submit=\"createProject()\">\n" +
    "\n" +
    "        <!-- Name -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Name*</label>\n" +
    "\n" +
    "            <p class=\"text-muted\">The name of your project</p>\n" +
    "            <input name=\"name\" type=\"text\" class=\"form-control\"\n" +
    "                   placeholder=\"Enter a name for the project\" ng-model=\"project.name\" ng-required=\"true\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"create_form.name.$dirty && create_form.name.$invalid\">\n" +
    "            <small ng-show=\"create_form.name.$error.required\">Name must not be empty.</small>\n" +
    "        </div>\n" +
    "        <!-- Name -->\n" +
    "\n" +
    "        <!-- Base Url -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Url*</label>\n" +
    "\n" +
    "            <p class=\"text-muted\">The url of your website</p>\n" +
    "            <input name=\"url\" class=\"form-control\" type=\"text\"\n" +
    "                   placeholder=\"Enter the url of the project\" ng-model=\"project.baseUrl\" ng-required=\"true\"\n" +
    "                   ng-pattern=\"/^(http://|https://).{1,}/\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"create_form.url.$dirty && create_form.url.$invalid\">\n" +
    "            <small ng-show=\"create_form.url.$error.required\">\n" +
    "                Url must not be empty.\n" +
    "            </small>\n" +
    "            <small ng-show=\"create_form.url.$error.pattern\">\n" +
    "                The url has to start with http(s):// and have a host name\n" +
    "            </small>\n" +
    "        </div>\n" +
    "        <!-- /Base Url -->\n" +
    "\n" +
    "        <!-- Description -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Description</label>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                If you want you can describe your new project with a few words\n" +
    "            </p>\n" +
    "            <textarea name=\"description\" ng-model=\"project.description\"\n" +
    "                      placeholder=\"Enter the description for the project\"\n" +
    "                      class=\"form-control\" rows=\"3\"></textarea>\n" +
    "        </div>\n" +
    "        <!-- /Description -->\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <button type=\"submit\" class=\"btn btn-sm btn-primary\">Create Project</button>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/project-settings.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/project-settings.html",
    "<div class=\"container\">\n" +
    "\n" +
    "    <h2>Project Settings</h2>\n" +
    "    <p class=\"text-muted\">Update your project and change settings</p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <form id=\"project-edit-form\" name=\"update_form\" role=\"form\" ng-submit=\"updateProject()\">\n" +
    "\n" +
    "        <!-- Name -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Name*</label>\n" +
    "\n" +
    "            <p class=\"text-muted\">The name of your project</p>\n" +
    "            <input name=\"name\" type=\"text\" class=\"form-control\"\n" +
    "                   placeholder=\"Enter a name for the project\" ng-model=\"project.name\" ng-required=\"true\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"create_form.name.$dirty && create_form.name.$invalid\">\n" +
    "            <small ng-show=\"update_form.name.$error.required\">Name must not be empty.</small>\n" +
    "        </div>\n" +
    "        <!-- Name -->\n" +
    "\n" +
    "        <!-- Base Url -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Url*</label>\n" +
    "\n" +
    "            <p class=\"text-muted\">The url of your website</p>\n" +
    "            <input name=\"url\" class=\"form-control\" type=\"text\"\n" +
    "                   placeholder=\"Enter the url of the project\" ng-model=\"project.baseUrl\" ng-required=\"true\" ng-pattern=\"/^(http://|https://).{1,}/\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"create_form.url.$dirty && create_form.url.$invalid\">\n" +
    "            <small ng-show=\"update_form.url.$error.required\">\n" +
    "                Url must not be empty.\n" +
    "            </small>\n" +
    "            <small ng-show=\"update_form.url.$error.pattern\">\n" +
    "                The url has to start with http(s):// and have a host name\n" +
    "            </small>\n" +
    "        </div>\n" +
    "        <!-- /Base Url -->\n" +
    "\n" +
    "        <!-- Description -->\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label\">Description</label>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                If you want you can describe your new project with a few words\n" +
    "            </p>\n" +
    "            <textarea name=\"description\" ng-model=\"project.description\"\n" +
    "                      placeholder=\"Enter the description for the project\"\n" +
    "                      class=\"form-control\" rows=\"3\"></textarea>\n" +
    "        </div>\n" +
    "        <!-- /Description -->\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <button type=\"submit\" class=\"btn btn-sm btn-primary\">Update</button>\n" +
    "            <a class=\"btn btn-sm btn-default\" ng-click=\"resetForm()\">Reset</a>\n" +
    "            <a class=\"btn btn-sm btn-default\" ng-click=\"deleteProject()\">Delete</a>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/project.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/project.html",
    "<div class=\"container\">\n" +
    "\n" +
    "    Dashboard will soon appear at this place\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/views/pages/symbols-actions.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols-actions.html",
    "<div class=\"container\">\n" +
    "    <h2>Actions Editor</h2>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Create and manage the actions for symbol:\n" +
    "        <strong ng-bind=\"symbol.name\"></strong> <em>[<span ng-bind=\"symbol.abbreviation\"></span>]</em>\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" select-all-items-checkbox items=\"symbol.actions\">\n" +
    "        </div>\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" open-action-create-modal symbol=\"symbol\" on-created=\"addAction\">\n" +
    "                Create\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" open-action-edit-modal symbol=\"symbol\"\n" +
    "                    action=\"(symbol.actions | selected | first)\"\n" +
    "                    on-updated=\"updateAction\"\n" +
    "                    ng-class=\"(symbol.actions|selected).length != 1 ? 'disabled': ''\">\n" +
    "                Edit\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"deleteSelectedActions()\"\n" +
    "            		ng-class=\"(symbol.actions|selected).length == 0 ? 'disabled': ''\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-success btn-xs\" ng-click=\"saveChanges()\">Save</button>\n" +
    "            <button class=\"btn btn-default btn-xs\" ng-click=\"revertChanges()\">Reset</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "\n" +
    "    <div ng-if=\"symbol.actions\" as-sortable ng-model=\"symbol.actions\">\n" +
    "        <div selectable-list ng-model=\"symbol.actions\">\n" +
    "            <div selectable-list-item ng-repeat=\"action in symbol.actions\" as-sortable-item>\n" +
    "                \n" +
    "                <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "	                <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "	                    <i class=\"fa fa-bars\"></i>\n" +
    "	                </button>\n" +
    "	                <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "	                    <li>\n" +
    "	                        <a href open-action-edit-modal symbol=\"symbol\" action=\"action\" on-updated=\"updateAction\">\n" +
    "	                            <i class=\"fa fa-edit fa-fw\"></i> Edit\n" +
    "	                        </a>\n" +
    "	                    </li>\n" +
    "	                    <li>\n" +
    "	                        <a href ng-click=\"deleteAction(action)\">\n" +
    "	                            <i class=\"fa fa-trash fa-fw\"></i> Delete\n" +
    "	                        </a>\n" +
    "	                    </li>\n" +
    "	                </ul>\n" +
    "	            </div>\n" +
    "	            \n" +
    "	           <span class=\"text-muted pull-right\" as-sortable-item-handle style=\"margin-right: 15px; padding: 2px;\">\n" +
    "                    <i class=\"fa fa-sort fa-fw\"></i>\n" +
    "                </span>\n" +
    "\n" +
    "                <strong ng-bind=\"action.type\"></strong><br>\n" +
    "\n" +
    "                <!-- BEGIN: Display Web Actions -->\n" +
    "                <div class=\"text-muted\" ng-if=\"symbol.type == 'web'\">\n" +
    "\n" +
    "                    <p ng-if=\"action.type == webActionTypes.SEARCH_FOR_TEXT\">\n" +
    "                        Search for the\n" +
    "                        <span ng-show=\"action.regexp\">regexp</span>\n" +
    "                        <span ng-show=\"!action.regexp\">string</span>\n" +
    "                        \"{{action.value}}\" on the page\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == webActionTypes.SEARCH_FOR_NODE\">\n" +
    "                        Search for the element \"{{action.value}}\" in the DOM tree of the page\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == webActionTypes.CLEAR\">\n" +
    "                        Clear the element \"{{action.node}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == webActionTypes.CLICK\">\n" +
    "                        Click on the element \"{{action.node}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == webActionTypes.FILL\">\n" +
    "                        Fill the element \"{{action.node}}\" with \"{{action.generator}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == webActionTypes.GO_TO\">\n" +
    "                        Go to the page with the url \"{{action.url}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == webActionTypes.SUBMIT\">\n" +
    "                        Submit the form element \"{{action.node}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == webActionTypes.WAIT\">\n" +
    "                        Wait for {{action.duration}} ms.\n" +
    "                    </p>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: Display Web Actions -->\n" +
    "\n" +
    "                <!-- BEGIN: Display Rest Actions -->\n" +
    "                <div class=\"text-muted\" ng-if=\"symbol.type == 'rest'\">\n" +
    "\n" +
    "                    <p ng-if=\"action.type == restActionTypes.CALL_URL\">\n" +
    "                        Make a \"{{action.method}}\" request to \"{{action.url}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == restActionTypes.CHECK_STATUS\">\n" +
    "                        Check http status to be \"{{action.status}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == restActionTypes.CHECK_HEADER_FIELD\">\n" +
    "                        Check header field \"{{action.key}}\" to be \"{{action.value}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == restActionTypes.CHECK_HTTP_BODY_TEXT\">\n" +
    "                        Search in the response body for \"{{action.value}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == restActionTypes.CHECK_ATTRIBUTE_EXISTS\">\n" +
    "                        Check if response body attribute \"{{action.attribute}}\" exists\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == restActionTypes.CHECK_ATTRIBUTE_VALUE\">\n" +
    "                        Check response body attribute \"{{action.attribute}}\" to be \"{{action.value}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"action.type == restActionTypes.CHECK_ATTRIBUTE_TYPE\">\n" +
    "                        Check response body attribute \"{{action.attribute}}\" to be type of \"{{action.jsonType}}\"\n" +
    "                    </p>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: Display Rest Actions -->\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"alert alert-info\" ng-show=\"symbol.actions.length == 0\">\n" +
    "        You haven't created any actions for this symbol yet.\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/views/pages/symbols-export.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols-export.html",
    "<div class=\"container\">\n" +
    "\n" +
    "    <h2>Symbol Export</h2>\n" +
    "\n" +
    "    <p class=\"text-muted\">Export your web and rest symbols as a json file</p>\n" +
    "    <hr>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<!--\n" +
    "BEGIN: Sub Navigation\n" +
    "contains call to action buttons to create update & delete symbols\n" +
    "-->\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" select-all-items-checkbox items=\"symbols.web\"> Web\n" +
    "            </label>\n" +
    "            &nbsp;\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" select-all-items-checkbox items=\"symbols.rest\"> Rest\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" download-as-json data=\"getSelectedSymbols\">\n" +
    "                <i class=\"fa fa-download fa-fw\"></i> Download\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- END: Sub Navigation -->\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "\n" +
    "    <div selectable-list ng-model=\"symbols.web\">\n" +
    "        <div selectable-list-item ng-repeat=\"symbol in symbols.web\">\n" +
    "\n" +
    "            <span class=\"label label-primary pull-right\" ng-bind=\"symbol.type\"></span>\n" +
    "\n" +
    "            <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                <span ng-bind=\"symbol.actions.length\"></span> Actions\n" +
    "            </p>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div selectable-list ng-model=\"symbols.rest\">\n" +
    "        <div selectable-list-item ng-repeat=\"symbol in symbols.rest\">\n" +
    "\n" +
    "            <span class=\"label label-warning pull-right\" ng-bind=\"symbol.type\"></span>\n" +
    "\n" +
    "            <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                <span ng-bind=\"symbol.actions.length\"></span> Actions\n" +
    "            </p>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/symbols-history.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols-history.html",
    "<div class=\"container\">\n" +
    "    <h2>Symbols History</h2>\n" +
    "\n" +
    "    <p class=\"muted\">\n" +
    "        Restore and older version of the symbol <strong>Symbol.Name</strong>\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "    <table class=\"table\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th></th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "\n" +
    "            <tr ng-repeat=\"revision in revisions\">\n" +
    "                <td>\n" +
    "\n" +
    "                    <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                            <i class=\"fa fa-bars\"></i>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                            <li>\n" +
    "                                <a href ng-click=\"restoreRevision(revision)\">\n" +
    "                                    <i class=\"fa fa-history fa-fw\"></i> Restore\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <strong ng-bind=\"revision.name\"></strong> [<span ng-bind=\"revision.abbreviation\"></span>]\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        <span ng-bind=\"revision.actions.length\"></span> Actions\n" +
    "                    </p>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>");
}]);

angular.module("app/views/pages/symbols-import.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols-import.html",
    "<div class=\"container\">\n" +
    "\n" +
    "        <h2>Symbol Upload</h2>\n" +
    "\n" +
    "        <p class=\"text-muted\">If you already have a *.json file with symbols, you can import them here to this\n" +
    "            project</p>\n" +
    "        <hr>\n" +
    "\n" +
    "        <div file-dropzone on-loaded=\"fileLoaded\" class=\"alert alert-info\">\n" +
    "            Drag and drop *.json file here\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <!--\n" +
    "    BEGIN: Sub Navigation\n" +
    "    contains call to action buttons to create update & delete symbols\n" +
    "    -->\n" +
    "    <div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\"\n" +
    "         ng-if=\"symbols.web.length > 0 || symbols.rest.length > 0\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" select-all-items-checkbox items=\"symbols.web\"> Web\n" +
    "                </label>\n" +
    "                &nbsp;\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" select-all-items-checkbox items=\"symbols.rest\"> Rest\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"pull-right\">\n" +
    "                <button class=\"btn btn-xs btn-primary\" ng-click=\"uploadSymbols()\">Upload</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: Sub Navigation -->\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div ng-if=\"symbols.web.length > 0\" selectable-list ng-model=\"symbols.web\">\n" +
    "            <div selectable-list-item ng-repeat=\"symbol in symbols.web\">\n" +
    "\n" +
    "                <span class=\"label label-primary pull-right\" ng-bind=\"symbol.type\"></span>\n" +
    "\n" +
    "                <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "                <br>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"symbols.rest.length > 0\" selectable-list ng-model=\"symbols.rest\">\n" +
    "            <div selectable-list-item ng-repeat=\"symbol in symbols.rest\">\n" +
    "\n" +
    "                <span class=\"label label-warning pull-right\" ng-bind=\"symbol.type\"></span>\n" +
    "\n" +
    "                <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "                <br>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>");
}]);

angular.module("app/views/pages/symbols-trash.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols-trash.html",
    "<div class=\"container\">\n" +
    "    <h2>Symbols Trash - <span ng-bind=\"(type|capitalize)\"></span></h2>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        View deleted <span ng-bind=\"type\"></span> symbols and recover them\n" +
    "    </p>\n" +
    "\n" +
    "    <hr>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" select-all-items-checkbox items=\"symbols\">\n" +
    "        </div>\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-class=\"(symbols|selected).length > 0 ? '' : 'disabled'\"\n" +
    "                    ng-click=\"recoverSelected()\">\n" +
    "                <i class=\"fa fa-rotate-left fa-fw\"></i> Recover\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "\n" +
    "    <div selectable-list ng-model=\"symbols\">\n" +
    "        <div selectable-list-item ng-repeat=\"symbol in symbols\">\n" +
    "\n" +
    "            <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                    <i class=\"fa fa-bars\"></i>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                    <li>\n" +
    "                        <a href ng-click=\"recover(symbol)\">\n" +
    "                            <i class=\"fa fa-rotate-left fa-fw\"></i> Recover\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "            <span class=\"text-muted\">Rev. <span ng-bind=\"symbol.revision\"></span></span>\n" +
    "            <p class=\"text-muted\">\n" +
    "            	<span ng-bind=\"symbol.actions.length\"></span> Actions\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"alert alert-info\" ng-show=\"symbols.length == 0\">\n" +
    "        There are no symbols in the trash\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/symbols.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols.html",
    "<div class=\"container\">\n" +
    "    <h2>Symbol Editor</h2>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Create and edit symbols and manage its actions\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" select-all-items-checkbox items=\"symbols\">\n" +
    "        </div>\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-primary\"\n" +
    "                    open-symbol-create-modal symbol-type=\"{{type}}\" project-id=\"{{project.id}}\" on-created=\"addSymbol\">\n" +
    "                Create\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-class=\"(symbols|selected).length == 1 ? '' : 'disabled'\"\n" +
    "                    open-symbol-edit-modal symbol=\"(symbols | selected | first)\" on-updated=\"updateSymbol\">\n" +
    "                Edit\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-class=\"(symbols|selected).length > 0 ? '' : 'disabled'\"\n" +
    "                    ng-click=\"deleteSelectedSymbols()\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"pull-right\">\n" +
    "            <a ui-sref=\"symbols.{{type}}.trash\" class=\"btn btn-xs btn-default\">\n" +
    "                <i class=\"fa fa-trash fa-fw\"></i>Trash\n" +
    "            </a>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "\n" +
    "    <div selectable-list ng-model=\"symbols\">\n" +
    "        <div selectable-list-item ng-repeat=\"symbol in symbols\">\n" +
    "\n" +
    "            <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                    <i class=\"fa fa-bars\"></i>\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                    <li>\n" +
    "                        <a href open-symbol-edit-modal symbol=\"symbol\" on-updated=\"updateSymbol\">\n" +
    "                            <i class=\"fa fa-edit fa-fw\"></i> Edit\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href ng-click=\"deleteSymbol(symbol)\">\n" +
    "                            <i class=\"fa fa-trash fa-fw\"></i> Delete\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\"></li>\n" +
    "                    <li>\n" +
    "                        <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                            <i class=\"fa fa-list-ol fa-fw\"></i> Actions\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\"></li>\n" +
    "                    <li>\n" +
    "                        <a ui-sref=\"symbols.history({symbolId:symbol.id})\">\n" +
    "                            <i class=\"fa fa-history fa-fw\"></i> Restore\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                    <span ng-bind=\"symbol.actions.length\"></span> Actions <i class=\"fa fa-edit\"></i>\n" +
    "                </a>\n" +
    "            </p>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"alert alert-info\" ng-show=\"symbols.length == 0\">\n" +
    "        You haven't created any symbols yet.\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("app/views/pages/tools-hypotheses-view.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/tools-hypotheses-view.html",
    "drop hypothesis from json here");
}]);

angular.module("app/views/widgets/widget-counter-examples.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/widgets/widget-counter-examples.html",
    "<form class=\"form form-condensed\" ng-submit=\"addCounterExample()\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"input-group\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"input\" ng-model=\"newCounterExample.input\">\n" +
    "\n" +
    "            <div class=\"input-group-addon\">\n" +
    "                <i class=\"fa fa-info\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <div class=\"input-group\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"output\" ng-model=\"newCounterExample.output\">\n" +
    "\n" +
    "            <div class=\"input-group-addon\">\n" +
    "                <i class=\"fa fa-info\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "		<div class=\"btn-group btn-group-sm\">\n" +
    "    		<button class=\"btn btn-primary\">Add Counter Example</button>\n" +
    "    		<a href open-counter-example-builder counter-example=\"newCounterExample\" class=\"btn btn-default\">Edit</a>\n" +
    "		</div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "<hr>\n" +
    "\n" +
    "<ul class=\"list-group\">\n" +
    "    <li class=\"list-group-item\" ng-repeat=\"ce in counterExamples\">\n" +
    "        <span class=\"btn btn-icon pull-right\" ng-click=\"removeCounterExample(ce, $index)\">\n" +
    "            <i class=\"fa fa-trash\"></i>\n" +
    "        </span>\n" +
    "        {{ce.input}}<br>\n" +
    "        {{ce.output}}\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("app/views/widgets/widget-test-resume-settings.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/widgets/widget-test-resume-settings.html",
    "<form class=\"form form-condensed\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">EQ Oracle</label><br>\n" +
    "        <select class=\"form-control\" ng-model=\"configuration.eqOracle.type\" ng-options=\"k for (k,v) in eqOracles\">\n" +
    "            <option value=\"\" disabled>select a method</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <div ng-if=\"configuration.eqOracle.type == eqOracles.RANDOM\">\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"configuration.eqOracle.minLength\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> min length\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"configuration.eqOracle.maxLength\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> max length\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"configuration.eqOracle.maxNoOfTests\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> no of random words to be generated\n" +
    "            </p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"configuration.eqOracle.type == eqOracles.COMPLETE\">\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"configuration.eqOracle.minDepth\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> min depth\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"configuration.eqOracle.maxDepth\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> max depth\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">Max Amount of Steps to Learn (0 := never stop)</label>\n" +
    "        <input ng-model=\"configuration.maxAmountOfStepsToLearn\" class=\"form-control\" type=\"text\" placeholder=\"0\">\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
}]);
;(function () {
    'use strict';

    angular
        .module('weblearner.routes')
        .config([
            '$stateProvider', '$urlRouterProvider', 'paths',
            config
        ])
        .run([
            '$rootScope', '$state', 'SessionService',
            run
        ]);

    /**
     * Define application routes
     *
     * @param $stateProvider
     * @param $urlRouterProvider
     * @param paths
     */
    function config($stateProvider, $urlRouterProvider, paths) {
    	    	
        // redirect to the start page when no other route fits
        $urlRouterProvider.otherwise("/home");

        $stateProvider

            // =========================================================
            // index route

            .state('home', {
                url: '/home',
                controller: 'HomeController',
                templateUrl: paths.views.PAGES + '/home.html'
            })

            // =========================================================
            // project related routes

            .state('project', {
                url: '/project',
                views: {
                    '@': {
                        controller: 'ProjectController',
                        templateUrl: paths.views.PAGES + '/project.html'
                    }
                },
                data: {
                    requiresProject: true
                }
            })
            .state('project.create', {
                url: '/create',
                views: {
                    '@': {
                        controller: 'ProjectCreateController',
                        templateUrl: paths.views.PAGES + '/project-create.html'
                    }
                },
                data: {
                    requiresProject: false
                }
            })
            .state('project.settings', {
                url: '/settings',
                views: {
                    '@': {
                        templateUrl: paths.views.PAGES + '/project-settings.html',
                        controller: 'ProjectSettingsController'
                    }
                }
            })

            // =========================================================
            // symbol related routes

            .state('symbols', {
                abstract: true,
                url: '/symbols',
                data: {
                    requiresProject: true
                }
            })
            .state('symbols.web', {
                url: '/web',
                views: {
                    '@': {
                        controller: 'SymbolsController',
                        templateUrl: paths.views.PAGES + '/symbols.html'
                    }
                },
                resolve: {
                    type: function () {
                        return 'web'
                    }
                }
            })
            .state('symbols.web.trash', {
                url: '/trash',
                views: {
                    '@': {
                        controller: 'SymbolsTrashController',
                        templateUrl: paths.views.PAGES + '/symbols-trash.html'
                    }
                }
            })
            .state('symbols.rest', {
                url: '/rest',
                views: {
                    '@': {
                        controller: 'SymbolsController',
                        templateUrl: paths.views.PAGES + '/symbols.html'
                    }
                },
                resolve: {
                    type: function () {
                        return 'rest'
                    }
                }
            })
            .state('symbols.rest.trash', {
                url: '/trash',
                views: {
                    '@': {
                        controller: 'SymbolsTrashController',
                        templateUrl: paths.views.PAGES + '/symbols-trash.html'
                    }
                }
            })
            .state('symbols.history', {
            	url: '/{symbolId:int}/history',
                views: {
                    '@': {
                        controller: 'SymbolsHistoryController',
                        templateUrl: paths.views.PAGES + '/symbols-history.html'
                    }
                }
            })
            .state('symbols.actions', {
                url: '/{symbolId:int}/actions',
                views: {
                    '@': {
                        controller: 'SymbolsActionsController',
                        templateUrl: paths.views.PAGES + '/symbols-actions.html'
                    }
                }

            })
            .state('symbols.import', {
                url: '/import',
                views: {
                    '@': {
                        controller: 'SymbolsImportController',
                        templateUrl: paths.views.PAGES + '/symbols-import.html'
                    }
                }

            })
            .state('symbols.export', {
                url: '/export',
                views: {
                    '@': {
                        controller: 'SymbolsExportController',
                        templateUrl: paths.views.PAGES + '/symbols-export.html'
                    }
                }
            })

            // =========================================================
            // test and learn related routes

            .state('learn', {
                abstract: true,
                url: '/learn',
                data: {
                    requiresProject: true
                }
            })
            .state('learn.setup', {
                abstract: true,
                url: '/setup'
            })
            .state('learn.setup.web', {
                url: '/web',
                views: {
                    '@': {
                        controller: 'LearnSetupController',
                        templateUrl: paths.views.PAGES + '/learn-setup.html'
                    }
                },
                resolve: {
                    type: function () {
                        return 'web'
                    }
                }
            })
            .state('learn.setup.rest', {
                url: '/rest',
                views: {
                    '@': {
                        controller: 'LearnSetupController',
                        templateUrl: paths.views.PAGES + '/learn-setup.html'
                    }
                },
                resolve: {
                    type: function () {
                        return 'rest'
                    }
                }
            })
            .state('learn.start', {
                url: '/start',
                views: {
                    '@': {
                        controller: 'LearnStartController',
                        templateUrl: paths.views.PAGES + '/learn-start.html'
                    }
                }
            })
            .state('learn.results', {
                url: '/results',
                views: {
                    '@': {
                        controller: 'LearnResultsController',
                        templateUrl: paths.views.PAGES + '/learn-results.html'
                    }
                }
            })
            .state('learn.results.statistics', {
                url: '/statistics',
                views: {
                    '@': {
                        controller: 'LearnResultsStatisticsController',
                        templateUrl: paths.views.PAGES + '/learn-results-statistics.html'
                    }
                }
            })
            .state('learn.results.compare', {
                url: '/compare/:testNos',
                views: {
                    '@': {
                        controller: 'LearnResultsCompareController',
                        templateUrl: paths.views.PAGES + '/learn-results-compare.html'
                    }
                }
            })


            // =========================================================
            // static pages related routes

            .state('about', {
                url: '/about',
                templateUrl: paths.views.PAGES + '/about.html',
                data: {
                    requiresProject: false
                }
            })
            .state('help', {
                url: '/help',
                templateUrl: paths.views.PAGES + '/help.html',
                data: {
                    requiresProject: false
                }
            })

            // =========================================================
            // tool pages

            .state('tools', {
                abstract: true,
                template: '<ui-view class="animate-view" />'
            })
            .state('tools.hyotheses', {
                url: '/tools/hypotheses/view',
                templateUrl: paths.views.PAGES + '/tools-hypotheses-view.html',
                data: {
                    requiresProject: false
                }
            })
    }

    /**
     * Validate routes on state change
     *
     * @param $rootScope
     * @param $state
     * @param SessionService
     */
    function run($rootScope, $state, SessionService) {
    	
        // route validation
        $rootScope.$on("$stateChangeStart", stateChangeStart);

        function stateChangeStart(event, toState, toParams, fromState, fromParams){
            if (toState.data) {
                if (toState.data.requiresProject && SessionService.project.get() == null) {
                    $state.go("home");
                    event.preventDefault();
                }
            }
        }
    }
}());;(function(){
    'use strict';

    angular
        .module('weblearner.constants')
        
        // make lodash a constant for better testing
        .constant('_', window._)

        // paths that are used in the application
    	.constant('paths', {
    		views: {
    			BASE: 'app/views',
    			DIRECTIVES: 'app/views/directives',
    			MODALS: 'app/views/modals',
    			WIDGETS: 'app/views/widgets',
                PAGES: 'app/views/pages'
    		},
    		api: {
    			URL: '/rest',
    			PROXY_URL: '/rest/proxy?url='
    		}
    	})

        // web action types
        .constant('WebActionTypes', {
            SEARCH_FOR_TEXT: 'checkText',
            SEARCH_FOR_NODE: 'checkNode',
            CLEAR: 'clear',
            CLICK: 'click',
            FILL: 'fill',
            GO_TO: 'goto',
            SUBMIT: 'submit',
            WAIT: 'wait'
        })

        // rest action types
        .constant('RestActionTypes', {
            CALL_URL: 'call',
            CHECK_STATUS: 'checkStatus',
            CHECK_HEADER_FIELD: 'checkHeaderField',
            CHECK_HTTP_BODY_TEXT: 'checkForText',
            CHECK_ATTRIBUTE_EXISTS: 'checkAttributeExists',
            CHECK_ATTRIBUTE_VALUE: 'checkAttributeValue',
            CHECK_ATTRIBUTE_TYPE: 'checkAttributeType'
        })

        // eq oracles
        .constant('EqOraclesEnum', {
            RANDOM: 'random_word',
            COMPLETE: 'complete',
            SAMPLE: 'sample'
        })

        // learn algorithms
        .constant('LearnAlgorithmsEnum', {
            EXTENSIBLE_LSTAR: 'EXTENSIBLE_LSTAR',
            DHC: 'DHC',
            DISCRIMINATION_TREE: 'DISCRIMINATION_TREE'
        })
}());;(function(){
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateModalController', [
            '$scope', '$modalInstance', 'modalData', 'WebActionTypes', 'RestActionTypes',
            ActionCreateModalController
        ]);

    function ActionCreateModalController ($scope, $modalInstance, modalData, WebActionTypes, RestActionTypes) {

        $scope.webActionTypes = WebActionTypes;
        $scope.restActionTypes = RestActionTypes;
        $scope.symbol = modalData.symbol;

        //////////

        $scope.$on('action.created', createAction);

        //////////

        function createAction(evt, action) {
            $modalInstance.close(action);
        }

        //////////

        $scope.closeModal = function(){
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionEditModalController', [
            '$scope', '$modalInstance', 'modalData', 'WebActionTypes', 'RestActionTypes',
            ActionEditModalController
        ]);

    function ActionEditModalController($scope, $modalInstance, modalData, WebActionTypes, RestActionTypes) {

        $scope.webActionTypes = WebActionTypes;
        $scope.restActionTypes = RestActionTypes;

        //////////

        $scope.symbol = modalData.symbol;
        $scope.action = angular.copy(modalData.action);

        //////////

        $scope.$on('action.edited', updateAction);

        //////////

        function updateAction (evt, action) {
            $modalInstance.close(action);
        }

        //////////

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ConfirmDialogController', [
            '$scope', '$modalInstance', 'modalData',
            ConfirmDialogController
        ]);

    /**
     * ConfirmDialogController
     *
     * The controller that handles the confirm modal dialog.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @constructor
     */
    function ConfirmDialogController($scope, $modalInstance, modalData) {

        /** The text to be displayed **/
        $scope.text = modalData.text;
        $scope.regexp = modalData.regexp;
        $scope.errorMsg = modalData.errorMsg;

        //////////

        /**
         * Close the modal dialog
         */
        $scope.ok = function () {
        	$modalInstance.close();
        };

        /**
         * Close the modal dialog
         */
        $scope.close = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function(){
	'use strict';
	
	angular
		.module('weblearner.controller')
		.controller('HypothesisLayoutSettingsController', [
	         '$scope', '$modalInstance', 'modalData',
	         HypothesisLayoutSettingsController
       ]);
	
	function HypothesisLayoutSettingsController($scope, $modalInstance, modalData){
		
		var _defaultLayoutSetting = {
			nodesep: 50,
			edgesep: 25,
			ranksep: 50,
			multigraph: false,
		};
		
		$scope.layoutSettings;
		
		//////////
		
		if (angular.isDefined(modalData.layoutSettings)) {
			$scope.layoutSettings = angular.copy(modalData.layoutSettings);
		} else {
			$scope.layoutSettings = angular.copy(_defaultLayoutSetting);
		}
		
		//////////
		
		$scope.update = function(){					
			$modalInstance.close($scope.layoutSettings);
		};
		
		$scope.close = function(){			
			$modalInstance.dismiss();
		};
		
		$scope.defaultLayoutSettings = function(){	
			$scope.layoutSettings = angular.copy(_defaultLayoutSetting);
		};
	}
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('PromptDialogController', [
            '$scope', '$modalInstance', 'modalData',
            PromptDialogController
        ]);

    /**
     * PromptDialogController
     *
     * The controller that handles the prompt modal dialog.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @constructor
     */
    function PromptDialogController($scope, $modalInstance, modalData) {

        /** The model for the input field for the user input **/
        $scope.userInput;

        /** The text to be displayed **/
        $scope.text = modalData.text;

        /** The regex the user input has to match **/
        $scope.inputPattern = modalData.regexp || '';

        /** the message that is shown when the user input doesn't match the regex **/
        $scope.errorMsg = modalData.errorMsg || 'Unknown validation error';

        //////////

        /**
         * Close the modal dialog and pass the user input
         */
        $scope.ok = function () {
            if ($scope.prompt_form.$valid) {
                $modalInstance.close($scope.userInput);
            } else {
                $scope.prompt_form.submitted = true;
            }
        };

        /**
         * Close the modal dialog
         */
        $scope.close = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolCreateModalController', [
            '$scope', '$modalInstance', 'modalData', 'SymbolResource',
            SymbolCreateModalController
        ]);

    /**
     * SymbolCreateModalController
     *
     * Handles the behaviour of the modal to create a new symbol. The corresponding template for this modal can found
     * under 'app/partials/modals/symbol-create-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param SymbolResource
     * @constructor
     */
    function SymbolCreateModalController($scope, $modalInstance, modalData, SymbolResource) {

        // the id of the project the new symbol is created for
        var projectId = modalData.projectId;

        //////////

        /**
         * The type of the symbol that should be created.
         *
         * @type {String}
         */
        $scope.type = modalData.symbolType;

        //////////

        // listen on the event 'symbol.created' that is emitted from a child scope
        $scope.$on('symbol.created', createSymbol);

        //////////

        /**
         * Make a request to the API and create a new symbol. Close the modal on success.
         *
         * @param evt - The event object
         * @param symbol - The symbol that is created
         */
        function createSymbol(evt, symbol) {
            SymbolResource.create(projectId, symbol)
                .then(function (newSymbol) {
                    $modalInstance.close(newSymbol);
                })
        }

        /**
         * Close the modal.
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolEditModalController', [
            '$scope', '$modalInstance', 'modalData', 'SymbolResource', 'SelectionService',
            SymbolEditModalController
        ]);

    /**
     * SymbolEditModalController
     *
     * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
     * The corresponding template for this modal can found under 'app/partials/modals/symbol-edit-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param SymbolResource
     * @param SelectionService
     * @constructor
     */
    function SymbolEditModalController($scope, $modalInstance, modalData, SymbolResource, SelectionService) {

        /** The symbol that is passed to the modal. */
        $scope.symbol = modalData.symbol;

        //////////

        // listen on the event 'symbol.edited' from a child scope
        $scope.$on('symbol.edited', updateSymbol);

        //////////

        /**
         * Make a request to the API in order to update the symbol. Close the modal on success.
         *
         * @param evt - The event from the
         * @param symbol - The edited symbol
         */
        function updateSymbol(evt, symbol) {

            // remove the selection from the symbol in case there is any
            SelectionService.removeSelection(symbol);

            // update the symbol
            SymbolResource.update(symbol.project, symbol)
                .then(function (updatedSymbol) {
                    $modalInstance.close(updatedSymbol);
                })
        }

        //////////

        /**
         * Close the modal dialog
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('TestDetailsController', [
            '$scope', '$modalInstance', 'modalData',
            TestDetailsController
        ]);

    function TestDetailsController($scope, $modalInstance, modalData) {

        $scope.test = modalData.test;

        //////////

        $scope.ok = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('TestSetupSettingsController', [
            '$scope', '$modalInstance', 'modalData', 'EqOraclesEnum', 'LearnAlgorithmsEnum', 'EqOracleService',
            TestSetupSettingsController
        ]);

    function TestSetupSettingsController($scope, $modalInstance, modalData, eqOracles, learnAlgorithms, EqOracleService) {

        $scope.eqOracles = eqOracles;
        $scope.learnAlgorithms = learnAlgorithms;
        $scope.learnConfiguration = modalData.learnConfiguration;
        
        //////////
                
        $scope.$watch('learnConfiguration.eqOracle.type', function(type){
    		$scope.learnConfiguration.eqOracle = EqOracleService.create(type);
        });

        //////////

        $scope.ok = function () {
            $modalInstance.close($scope.learnConfiguration);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', 'Project', 'SessionService'];

    /**
     * HomeController
     *
     * The controller for the landing page. It lists the projects.
     *
     * @param $scope
     * @param $state
     * @param Project
     * @param SessionService
     * @constructor
     */
    function HomeController($scope, $state, Project, SessionService) {

        /** The project list */
        $scope.projects = [];

        //////////

        // redirect to the project dash page if one is open
        if (SessionService.project.get()) {
            $state.go('project');
        }

        // get all projects from the server
        Project.Resource.all()
            .then(function(projects){
                $scope.projects = projects;
            });

        //////////

        /**
         * Open a project by saving it into the session and redirect to the projects dashboard.
         *
         * @param project - The project that should be saved in the sessionStorage
         */
        $scope.openProject = function (project) {
            SessionService.project.save(project);
            $state.go('project');
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsCompareController', [
            '$scope', '$stateParams', 'SessionService', 'LearnResultResource',
            LearnResultsCompareController
        ]);

    function LearnResultsCompareController($scope, $stateParams, SessionService, LearnResultResource) {

        $scope.project = SessionService.project.get();
        $scope.finalTestResults = [];
        $scope.panels = [];
        $scope.layoutSettings = [];

        //////////

        LearnResultResource.getAllFinal($scope.project.id)
            .then(function (finalTestResults) {
                $scope.finalTestResults = finalTestResults;
                return $stateParams.testNos;
            })
            .then(loadComplete);

        //////////

        function loadComplete(testNos, index) {
        	testNos = testNos.split(',');
        	_.forEach(testNos, function(testNo){       		
        		LearnResultResource.getComplete($scope.project.id, testNo)
                .then(function(completeTestResult){
                    if (angular.isUndefined(index)) {
                        $scope.panels.push(completeTestResult);
                    } else {
                        $scope.panels[index] = completeTestResult;
                    }
                })
        	})
        }

        //////////

        $scope.fillPanel = function (result, index) {
            loadComplete(result.testNo + '', index);
        }
    }

}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsController', [
            '$scope', 'SessionService', 'LearnResultResource', 'SelectionService', 'PromptService',
            LearnResultsController
        ]);

    function LearnResultsController($scope, SessionService, LearnResultResource, SelectionService, PromptService) {

        $scope.project = SessionService.project.get();
        $scope.tests = [];

        //////////

        LearnResultResource.getAllFinal($scope.project.id)
            .then(function (tests) {
                $scope.tests = tests;
            });

        //////////

        $scope.deleteTest = function (test) {

            SelectionService.removeSelection(test);

            PromptService.confirm("Do you want to permanently delete this result?")
	            .then(function(){
	            	LearnResultResource.delete($scope.project.id, test.testNo)
	                .then(function () {
	                    _.remove($scope.tests, {testNo: test.testNo});
	                })
	            })
        };

        $scope.deleteTests = function () {

            var selectedTests = SelectionService.getSelected($scope.tests);
            var testNos;
            
            if (selectedTests.length > 0) {
            	testNos = _.pluck(selectedTests, 'testNo');
            	
            	PromptService.confirm("Do you want to permanently delete this result?")
	            	.then(function(){
	            		LearnResultResource.delete($scope.project.id, testNos)
	            		.then(function(){
	            			_.forEach(testNos, function(testNo){
	            				_.remove($scope.tests, {testNo: testNo})
	            			})
	            		})
	            	})
            }
        }
    }
}());
;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsStatisticsController', [
            '$scope', 'SessionService', 'LearnResultResource', 'TestResultsChartService', 'SelectionService',
            LearnResultsStatisticsController
        ]);

    /**
     * LearnResultsStatisticsController
     *
     * The controller that is used for the statistics page
     *
     * @param $scope
     * @param SessionService
     * @param TestResource
     * @param TestResultsChartService
     * @param SelectionService
     * @constructor
     */
    function LearnResultsStatisticsController($scope, SessionService, LearnResultResource, TestResultsChartService, SelectionService) {

        /** The open project */
        $scope.project = SessionService.project.get();

        /** The tests of the project @type {Array} */
        $scope.tests = [];

        /** Enum for the kind of chart that will be displayed **/
        $scope.chartModes = {
            SINGLE_COMPLETE_TEST_RESULT: 0,
            MULTIPLE_FINAL_TEST_RESULTS: 1,
            TWO_COMPLETE_TEST_RESULTS: 2
        };

        /** The active mode **/
        $scope.chartMode;

        /** The sets of chart data that is displayed on the chart **/
        $scope.chartDataSets = [];

        //////////

        // get all final tests of the project
        LearnResultResource.getAllFinal($scope.project.id)
            .then(function (tests) {
                $scope.tests = tests;
            });

        //////////

        /**
         * Create chart data from multiple selected final test results
         */
        $scope.chartFromMultipleFinalTestResults = function () {
            var tests = SelectionService.getSelected($scope.tests);
            if (tests.length > 0) {
                $scope.chartMode = $scope.chartModes.MULTIPLE_FINAL_TEST_RESULTS;
                $scope.chartDataSets = [TestResultsChartService.createChartDataFromMultipleTestResults(tests)];
            }
        };

        /**
         * Create chart data for a single complete test result with all intermediate steps. Therefore fetch all
         * intermediate steps first
         */
        $scope.chartFromSingleCompleteTestResult = function () {
            var tests = SelectionService.getSelected($scope.tests);
            if (tests.length == 1) {
            	LearnResultResource.getComplete($scope.project.id, tests[0].testNo)
                    .then(function (results) {
                        $scope.chartMode = $scope.chartModes.SINGLE_COMPLETE_TEST_RESULT;
                        $scope.chartDataSets = [TestResultsChartService.createChartDataFromSingleCompleteTestResult(results)];
                    });
            }
        };

        /**
         * Create chart data for two complete test result with all intermediate steps. Therefore fetch all
         * intermediate steps for both selected tests first
         */
        $scope.chartFromTwoCompleteTestResults = function () {
            var tests = SelectionService.getSelected($scope.tests);
            var dataSets = [];
            if (tests.length == 2) {
            	LearnResultResource.getComplete($scope.project.id, tests[0].testNo)
                    .then(function (results) {
                        dataSets.push(TestResultsChartService.createChartDataFromSingleCompleteTestResult(results));
                        LearnResultResource.getComplete($scope.project.id, tests[1].testNo)
                            .then(function (results) {
                                dataSets.push(TestResultsChartService.createChartDataFromSingleCompleteTestResult(results));
                                $scope.chartMode = $scope.chartModes.TWO_COMPLETE_TEST_RESULTS;
                                $scope.chartDataSets = dataSets;
                            })
                    })
            }
        };

        /**
         * Make the list of final test results visible again and remove the chart
         */
        $scope.back = function () {
            $scope.chartDataSets = [];
        };
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnSetupController', [
            '$scope', '$state', 'SymbolResource', 'SessionService', 'SelectionService', 'type', 'EqOraclesEnum',
            'LearnAlgorithmsEnum', 'LearnerResource', 'ngToast',
            LearnSetupController
        ]);

    function LearnSetupController($scope, $state, SymbolResource, SessionService, SelectionService, type, EqOracles,
                                 LearnAlgorithms, LearnerResource, toast) {

        $scope.project = SessionService.project.get();
        $scope.symbols = [];
        $scope.type = type;

        $scope.learnConfiguration = {
            symbols: [],
            algorithm: LearnAlgorithms.EXTENSIBLE_LSTAR,
            eqOracle: {
                type: EqOracles.COMPLETE,
                minDepth: 1,
                maxDepth: 1
            },
            maxAmountOfStepsToLearn: 0
        };

        //////////

        LearnerResource.isActive()
            .then(function (data) {
                if (data.active) {
                    if (data.project == $scope.project.id) {
                    	$state.go('learn.start');
                    } else {
                        toast.create({
                            class: 'danger',
                            content: 'There is already running a test from another project.',
                            dismissButton: true
                        });
                    }
                } else {
                    SymbolResource.getAll($scope.project.id, {type:type})
                        .then(function(symbols){
                            $scope.symbols = symbols;
                        })
                }
            });

        //////////

        $scope.startLearning = function () {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            
            // make sure there are selected symbols
            if (selectedSymbols.length) {

                // get id:revision pair from each selected symbol and add it to the learn configuration
                _.forEach(selectedSymbols, function (symbol) {
                    $scope.learnConfiguration.symbols.push({
                        id: symbol.id,
                        revision: symbol.revision
                    });
                });

                // start learning and go to the load page
                LearnerResource.start($scope.project.id, $scope.learnConfiguration)
                    .then(function () {
                        $state.go('learn.start')
                    })
            }
        };

        $scope.updateLearnConfiguration = function (config) {
            $scope.learnConfiguration = config;
        };
    }
}());;(function () {

    angular
        .module('weblearner.controller')
        .controller('LearnStartController', [
            '$scope', '$stateParams', '$interval', 'SessionService', 'LearnerResource',
            LearnStartController
        ]);

    /**
     * LearnStartController
     *
     * Shows a load screen and the hypothesis of a test.
     *
     * @param $scope
     * @param $interval
     * @param SessionService
     * @param Learner
     * @constructor
     */
    function LearnStartController($scope, $stateParams, $interval, SessionService, LearnerResource) {

        var _project = SessionService.project.get();
        var _interval = null;
        var _intervalTime = 10000;

        //////////

        /** the test result **/
        $scope.test = null;

        /** indicator for polling the server for a test result */
        $scope.active = false;

        /** indicator if eqOracle was type 'sample' **/
        $scope.isEqOracleSample = false;

        $scope.counterExample = {
            input: '',
            output: ''
        };
        
        $scope.layoutSettings;

        //////////
        
        // start polling the server
        _poll();
        
        // stop polling when you leave the page
        $scope.$on("$destroy", function(){
        	$interval.cancel(_interval);
        });

        //////////

        /**
         * check every x seconds if the server has finished learning and set the test if he did finish
         * @private
         */
        function _poll() {

            $scope.active = true;
            _interval = $interval(function () {
                LearnerResource.isActive()
                    .then(function (data) {
                        if (!data.active) {
                            LearnerResource.status()
                                .then(function (test) {
                                    $scope.active = false;
                                    $scope.test = test;
                                    $scope.isEqOracleSample = test.configuration.eqOracle.type == 'sample';
                                });
                            $interval.cancel(_interval);
                        }
                    })
            }, _intervalTime);
        }

        //////////

        /**
         * Update the configuration for the continuing test when choosing eqOracle 'sample' and showing an intermediate
         * hypothesis
         *
         * @param config
         */
        $scope.updateLearnConfiguration = function (config) {

            $scope.test.configuration = config;
        };

        /**
         * Tell the server to continue learning with the new or old learn configuration when eqOracle type was 'sample'
         *
         * @param config
         */
        $scope.resumeLearning = function () {

            var copy = angular.copy($scope.test.configuration);
            delete copy.algorithm;
            delete copy.symbols;

            LearnerResource.resume(_project.id, $scope.test.testNo, copy)
                .then(function () {
                    _poll();
                })
        }

        $scope.abort = function () {

            if ($scope.active) {
                LearnerResource.stop()
                    .then(function(data){

                        console.log(data)
                    })
            }
        }
    }

}());
;(function(){
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectController', ProjectController);

    ProjectController.$inject = ['$scope', 'SessionService'];

    /**
     * The controller that is responsible for the site '/project' and shows the dashboard of the project
     *
     * @param $scope
     * @param SessionService
     * @constructor
     */
    function ProjectController($scope, SessionService) {

        /** The project that is stored in the sessionStorage **/
        $scope.project = SessionService.project.get();
    }
}());
;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectCreateController', ProjectCreateController);

    ProjectCreateController.$inject = ['$scope', '$state', 'Project'];

    /**
     * ProjectCreateController
     *
     * The controller that belongs to 'app/partials/project-create.html' and handles the creation of a new project
     *
     * @param $scope
     * @param $state
     * @param Project
     * @constructor
     */
    function ProjectCreateController($scope, $state, Project) {

        $scope.project = new Project();

        /**
         * Make a call to the API to create a new project
         *
         * @param project - The project that should be created
         */
        $scope.createProject = function() {
            Project.Resource.create($scope.project)
                .then(function () {
                    $state.go('home');
                })
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectSettingsController', [
            '$scope', '$state', 'Project', 'SessionService', 'PromptService',
            ProjectSettingsController
        ]);

    /**
     * The controller that handles the deleting and updating of a project. Belongs to the template at
     * '/views/pages/project-settings.html'
     *
     * @param $scope
     * @param $state
     * @param Project
     * @param SessionService
     * @param PromptService
     */
    function ProjectSettingsController($scope, $state, Project, SessionService, PromptService) {

        var projectCopy;

        /** The project that is stored in the session **/
        $scope.project = SessionService.project.get();
        projectCopy = angular.copy($scope.project);

        //////////

        /**
         * Updates a project and saves the updated project in the sessionStorage
         */
        $scope.updateProject = function () {

            // delete this property because it is read only and the will throw an error otherwise
        	delete $scope.project.symbolAmount;

            // update the project on the server
            Project.Resource.update($scope.project)
                .then(function (updatedProject) {
                    SessionService.project.save(updatedProject);
                    $scope.project = updatedProject;
                    projectCopy = angular.copy($scope.project);
                })
        };

        /**
         * Prompts the user for confirmation and deletes the project on success. Redirects to '/home' when project
         * was deleted and removes the project from the sessionStorage
         */
        $scope.deleteProject = function () {
            var message = 'Do you really want to delete this project with all its symbols and test results? This process can not be undone.';

            // prompt the user
        	PromptService.confirm(message)
	        	.then(function(){

	        	    // delete project from server
	        		Project.Resource.delete($scope.project)
		                .then(function (deletedProject) {
		                    SessionService.project.remove();
		                    $state.go('home');
		                })
	        	})
        }

        /**
         * Resets the project edit form by copying the project copy back to the project under edit
         */
        $scope.resetForm = function() {
            $scope.project = angular.copy(projectCopy);
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsActionsController', [
            '$scope', '$stateParams', 'SymbolResource', 'SessionService', 'SelectionService', 'WebActionTypes',
            'RestActionTypes', 'ngToast',
            SymbolsActionsController
        ]);

    function SymbolsActionsController($scope, $stateParams, SymbolResource, SessionService, SelectionService,
                                      WebActionTypes, RestActionTypes, toast) {

        /** the enum for web action types that are displayed in a select box */
        $scope.webActionTypes = WebActionTypes;

        /** the enum for rest action types that are displayed in a select box */
        $scope.restActionTypes = RestActionTypes;

        /** the open project */
        $scope.project = SessionService.project.get();

        /** the symbol whose actions are managed */
        $scope.symbol = null;

        /** a copy of $scope.symbol to revert unsaved changes */
        $scope.symbolCopy = null;

        //////////

        // load all actions from the symbol
        SymbolResource.get($scope.project.id, $stateParams.symbolId)
            .then(init);

        //////////

        function init(symbol) {

            // create unique ids for actions
            _.forEach(symbol.actions, function (action) {
                action._id = _.uniqueId();
            });

            // add symbol to scope and create a copy in order to revert changes
            $scope.symbol = symbol;
            $scope.symbolCopy = angular.copy($scope.symbol);
        }

        //////////

        /**
         * delete the actions that the user selected from the scope
         */
        $scope.deleteSelectedActions = function () {
            var selectedActions = SelectionService.getSelected($scope.symbol.actions);
            if (selectedActions.length) {
                _.forEach(selectedActions, $scope.deleteAction);
            }
        };

        $scope.deleteAction = function(action) {
            _.remove($scope.symbol.actions, {_id: action._id});
        };

        /**
         * add a new action to the list of actions of the symbol
         * @param action
         */
        $scope.addAction = function (action) {
            action._id = _.uniqueId();
            $scope.symbol.actions.push(action);
        };

        /**
         * update an action
         * @param updatedAction
         */
        $scope.updateAction = function (updatedAction) {
            var index = _.findIndex($scope.symbol.actions, {_id: updatedAction._id});
            if (index > -1) {
                $scope.symbol.actions[index] = updatedAction;
            }
        };

        /**
         * save the changes that were made to the symbol by updating it on the server
         */
        $scope.saveChanges = function () {
        	
        	var copy = angular.copy($scope.symbol);
            SelectionService.removeSelection(copy.actions);

            // remove the temporarily create unique id attribute
            _.forEach(copy.actions, function (action) {
                delete action._id;
            });

            // update the symbol
            SymbolResource.update($scope.project.id, copy)
                .then(init)
        };

        /**
         * revert the changes that were made to the symbol
         */
        $scope.revertChanges = function () {
            $scope.symbol = angular.copy($scope.symbolCopy);
        };
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService', 'type',
            SymbolsController
        ]);

    function SymbolsController($scope, SessionService, SymbolResource, SelectionService, type) {

        /** the open project @type {*} */
        $scope.project = SessionService.project.get();

        /** the symbol type @type {string} */
        $scope.type = type;

        /** the list of web or rest symbols @type {[]|*[]} */
        $scope.symbols = [];

        //////////

        // load symbols from the server
        SymbolResource.getAll($scope.project.id, {type: type})
            .then(function (symbols) {
                $scope.symbols = symbols;
            });

        //////////

        /**
         *
         * @param symbols
         */
        function removeSymbolsFromScope(symbols) {
            if (symbols.length) {
                _.forEach(symbols, function (symbol) {
                    _.remove($scope.symbols, {id: symbol.id})
                })
            }
        }

        //////////

        /**
         *
         * @param symbol
         */
        $scope.deleteSymbol = function (symbol) {
            SymbolResource.delete($scope.project.id, symbol.id)
                .then(function () {
                    removeSymbolsFromScope([symbol])
                })
        };

        /**
         * Delete the symbols the user selected from the server and the scope
         */
        $scope.deleteSelectedSymbols = function () {

            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            var symbolsIds;

            if (selectedSymbols.length) {
                symbolsIds = _.pluck(selectedSymbols, 'id');
                SymbolResource.deleteSome($scope.project.id, symbolsIds)
                    .then(function () {
                        removeSymbolsFromScope(selectedSymbols);
                    });
            }
        };

        /**
         * Add a symbol to the scope
         * @param symbol
         */
        $scope.addSymbol = function (symbol) {
            $scope.symbols.push(symbol)
        };

        /**
         * Update a symbol in the scope
         * @param symbol
         */
        $scope.updateSymbol = function (symbol) {
            var index = _.findIndex($scope.symbols, {id: symbol.id});
            if (index > -1) {
                SelectionService.select(symbol);
                $scope.symbols[index] = symbol;
            }
        };
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsExportController', [
            '$scope', '$filter', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolsExportController
        ]);

    function SymbolsExportController($scope, $filter, SessionService, SymbolResource, SelectionService) {

        var _project = SessionService.project.get();

        //////////

        $scope.symbols = {
    		web: [], rest: []
        };

        //////////
        
        SymbolResource.getAll(_project.id)
            .then(function (symbols) {
            	$scope.symbols.web = $filter('typeOfWeb')(symbols);
            	$scope.symbols.rest = $filter('typeOfRest')(symbols);
            });

        //////////

        $scope.getSelectedSymbols = function () {
            var symbols = $scope.symbols.web.concat($scope.symbols.rest);
            var selectedSymbols = SelectionService.getSelected(symbols);
            SelectionService.removeSelection(selectedSymbols);
            _.forEach(selectedSymbols, function (symbol) {
                delete symbol.id;
                delete symbol.revision;
                delete symbol.project;
            });
            return selectedSymbols;
        };
    }
}());;(function(){
	'use strict';

	angular
		.module('weblearner.controller')
		.controller('SymbolsHistoryController', [
		     '$scope', '$stateParams', 'SymbolResource', 'SessionService',
		     SymbolsHistoryController
	     ]);
     
    function SymbolsHistoryController($scope, $stateParams, SymbolResource, SessionService) {
		
		$scope.project = SessionService.project.get();
		$scope.revisions = [];
		$scope.latestSymbol;
		
		//////////
		
		SymbolResource.getRevisions($scope.project.id, $stateParams.symbolId)
			.then(function(revisions){
				$scope.latestSymbol = revisions.pop();
				$scope.revisions = revisions;
			});
		
		//////////
		
		$scope.restoreRevision = function(revision) {
			
			// copy all important properties from the revision to the latest
			$scope.latestSymbol.name = revision.name;
			$scope.latestSymbol.abbreviation = revision.abbreviation;
			$scope.latestSymbol.actions = revision.actions;
			
			// update symbol with new properties
			SymbolResource.update($scope.project.id, $scope.latestSymbol)
				.then(function(symbol){
					$scope.revisions.push($scope.latestSymbol);
					$scope.latestSymbol = symbol;
				})
		}
	}
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsImportController', [
            '$scope', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolsImportController
        ]);

    function SymbolsImportController($scope, SessionService, SymbolResource, SelectionService) {

        var _project = SessionService.project.get();

        ////////////

        $scope.symbols = {
            web: [],
            rest: []
        };

        ////////////

        $scope.fileLoaded = function (data) {

            var symbols = angular.fromJson(data);

            _.forEach($scope.symbols, function (symbol) {
                symbol.project = _project.id;
            });

            $scope.$apply(function(){
            	$scope.symbols.web = _.filter(symbols, {type: 'web'});
                $scope.symbols.rest = _.filter(symbols, {type: 'rest'});
            });
        };

        $scope.uploadSymbols = function () {

            var selectedWebSymbols = SelectionService.getSelected($scope.symbols.web);
            var selectedRestSymbols = SelectionService.getSelected($scope.symbols.rest);
            var selectedSymbols = selectedWebSymbols.concat(selectedRestSymbols);

            SelectionService.removeSelection(selectedSymbols);
                       
            SymbolResource.create(_project.id, selectedSymbols);
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsTrashController', [
            '$scope', 'type', 'SessionService', 'SymbolResource', 'SelectionService',
            SymbolsTrashController
        ]);

    /**
     * SymbolsTrashController
     *
     * @param $scope
     * @param type
     * @param SessionService
     * @param SymbolResource
     * @param SelectionService
     * @constructor
     */
    function SymbolsTrashController($scope, type, SessionService, SymbolResource, SelectionService) {

        /**
         * The open project
         */
        $scope.project = SessionService.project.get();

        /**
         * The list of deleted symbols
         * @type {Array}
         */
        $scope.symbols = [];

        /**
         * The type of the symbols
         * @type {String}
         */
        $scope.type = type;

        //////////

        // load all deleted symbols into scope
        SymbolResource.getAll($scope.project.id, {type:type, deleted: true})
            .then(function (symbols) {
                $scope.symbols = symbols;
            });

        //////////

        /**
         * Recover a deleted symbol and remove it from the scope
         * @param {Object} symbol
         */
        $scope.recover = function (symbol) {
            SymbolResource.recover($scope.project.id, symbol.id)
                .then(function () {
                    _.remove($scope.symbols, {id: symbol.id});
                })
        };

        /**
         * Recover the symbols that were selected
         */
        $scope.recoverSelected = function () {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);
            _.forEach(selectedSymbols, $scope.recover)
        }
    }
}());;(function(){
	'use strict';
	
	angular
		.module('weblearner.directives')
		.directive('counterExampleBuilder', counterExampleBuilder);
	
	counterExampleBuilder.$inject = ['paths'];
	
	function counterExampleBuilder(paths){
		
		var directive = {
			scope: {},
			controller: ['$scope', controller],
			templateUrl: paths.views.DIRECTIVES + '/counter-example-builder.html'
		}
		return directive;
				
		function controller($scope){
			
			$scope.inputs = ['w1', 'w2', 'w3'];

	        $scope.counterExample = [
	            {input: 'w1', output: 'output1'},
	            {input: 'w2', output: 'output2'},
	            {input: 'w3', output: 'output3'},
	        ]

	        $scope.add = function() {
	            $scope.counterExample.push({input: null, output: null})
	        }

	        $scope.remove = function(index) {
	            $scope.counterExample.splice(index, 1);
	        }

	        $scope.onDropInput = function(data, evt, index){
	            $scope.counterExample[index].input = data['json/custom-object'];
	        }

	        $scope.onDropOutput = function(data, evt, index){
	            $scope.counterExample[index].output = data['json/custom-object'];
	        }
		}
	};
}());(function() {
	'use strict';

	angular
		.module('weblearner.directives')
		.directive('downloadAsJson', ['PromptService', downloadAsJson]);

	/**
	 * downloadAsJson
	 * 
	 * Directive that can be applied to any element as an attribute that downloads an object or an array as
	 * a *.json file. 
	 * 
	 * Attribute 'data' has to be defined in order to work and has to be type of object, array or a function 
	 * that returns an object or an array
	 * 
	 * @param PromptService
	 * @returns {{link: link}}
	 */
	function downloadAsJson(PromptService) {
		
		var directive = {
			restrict: 'A',
			scope:  {
				data: '='
			},
			link: link
		}
		return directive;
		
		//////////
		
		/**
		 * @param scope
		 * @param el
		 * @param attrs
		 */
		function link(scope, el, attrs) {
			
			el.on('click', promptFilename);
			
			//////////
						
			/**
			 * Open a modal dialog that prompts the user for a file name
			 */
			function promptFilename () {
								
				if (angular.isDefined(scope.data)) {
	                PromptService.prompt('Enter a name for the symbols file.', {
	                    regexp: /^[a-zA-Z0-9\.\-,_]+$/,
	                    errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
	                }).then(download);
				}
			}
					
			/**
			 * Download the json file with the file name from the prompt dialog and the jsonified data
			 */
			function download(filename){
				
				var a;
				var json = 'data:text/json;charset=utf-8,';
				
				if (angular.isDefined(scope.data)) {
					
					// if data parameter was function call it otherwise just convert data into json
					if (angular.isObject(scope.data) || angular.isArray(scope.data)) {
						json += encodeURIComponent(angular.toJson(scope.data));
					} else if (angular.isFunction(scope.data)) {
						json += encodeURIComponent(angular.toJson(scope.data()));
					} else {
						return;
					}
					
					// create new link element with downloadable json
					a = document.createElement('a');
					a.style.display = 'none';
					a.setAttribute('href', json);
					a.setAttribute('target', '_blank');
	                a.setAttribute('download', filename + '.json');
          	        
	                // append link to the dom, fire click event and remove it
	                document.body.appendChild(a);
          	        a.click();
          	        document.body.removeChild(a);
				}		
			}
		}
	}
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadCanvasAsImage', [
            'PromptService',
            downloadCanvasAsImage
        ]);

    /**
     * downloadCanvasAsImage
     *
     * The directive to download a given canvas as a png file. Add this directive as an attribute to any kind of
     * element, best on a button. The directive adds an click event to the element of the directive.
     *
     * @param PromptService
     * @returns {{link: link}}
     */
    function downloadCanvasAsImage(PromptService) {

        var directive = {
            restrict: 'A',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope - the scope
         * @param el - the element of the directive
         * @param attrs - the attributes of the element
         */
        function link(scope, el, attrs) {

            el.on('click', promptFileName);

            //////////

            /**
             * Prompt the user for a file name for the image of the chart
             */
            function promptFileName() {
                PromptService.prompt('Enter a name for the chart image file.', {
                    regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                    errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
                }).then(download);
            }

            /**
             * Download the canvas whose id was passed as an attribute from this directive as png
             */
            function download(filename) {

                // make sure the id was passed
                if (attrs.downloadCanvasAsImage) {

                    // find canvas
                    var canvas = document.getElementById(attrs.downloadCanvasAsImage);
                    var a;

                    if (canvas != null) {

                        // create image data with highest quality
                        var img = canvas.toDataURL('image/png', 1.0);
                        
                        // create new link element with image data
    					a = document.createElement('a');
    					a.style.display = 'none';
    					a.setAttribute('href', img);
    					a.setAttribute('target', '_blank');
    	                a.setAttribute('download', filename + '.png');
              	        
    	                // append link to the dom, fire click event and remove it
    	                document.body.appendChild(a);
              	        a.click();
              	        document.body.removeChild(a);
                    }
                }
            }
        }
    }
}());;(function () {
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
}());;(function() {

	angular
		.module('weblearner.directives')
		.directive('downloadTestResultsAsCsv', [ 
             'PromptService', downloadTestResultsAsCsv 
         ]);

	function downloadTestResultsAsCsv(PromptService) {
		
		var directive = {
			restrict: 'A',
			scope: {
				testResults: '='
			},
			link: link
		};
		return directive;
		
		//////////
		
		function link(scope, el, attrs) {
						
			el.on('click', promptFilename);
			
			//////////
			
			function promptFilename() {
				if (angular.isDefined(scope.testResults)) {
	                PromptService.prompt('Enter a name for the csv file.', {
	                    regexp: /^[a-zA-Z0-9\.\-,_]+$/,
	                    errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
	                }).then(download);
				}
			}
			
			function download(filename) {
				
				var csv = 'data:text/csv;charset=utf-8,';
				var a;
				var results;

				if (angular.isDefined(scope.testResults)){

					if (angular.isArray(scope.testResults)) {
						results = scope.testResults;
					} else {
						return;
					}
					
					csv += testResultsToCSV(results);
					
					// create new link element with downloadable csv
					a = document.createElement('a');
					a.style.display = 'none';
					a.setAttribute('href', csv);
					a.setAttribute('target', '_blank');
	                a.setAttribute('download', filename + '.csv');
          	        
	                // append link to the dom, fire click event and remove it
	                document.body.appendChild(a);
          	        a.click();
          	        document.body.removeChild(a);
				}
			}
			
			function testResultsToCSV(testResults) {
				
				var csv = '"Type";"Project";"TestNo";"StepNo";"Algorithm";"EqOracle";"Sybols";"Resets";"Duration (ms)"%0A';
								
				_.forEach(testResults, function(result){

					csv += '"' + result.type + '";';
					csv += '"' + result.project + '";';
					csv += '"' + result.testNo + '";';
					csv += '"' + result.stepNo + '";';
					csv += '"' + result.configuration.algorithm + '";';
					csv += '"' + result.configuration.eqOracle.type + '";';
					csv += '"' + result.sigma.length + '";';
					csv += '"' + result.amountOfResets + '";';
					csv += '"' + result.duration + '"%0A';
				});
				
				return csv;
			}
		}
	}
}());;(function(){
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('dropdownHover', dropdownHover);

    /**
     * dropdownHover
     *
     * A directive in addition to the dropdown directive from ui-bootstrap. It opens the dropdown menu when entering the
     * trigger element of the menu with the mouse so you don't have to click on it. Place it as attribute 'dropdown-hover'
     * beside 'dropdown' in order to work as expected.
     *
     * @return {{require: string, link: link}}
     */
    function dropdownHover(){

        var directive = {
            restrict: 'A',
            require: 'dropdown',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the dropdown controller
         */
        function link(scope, el, attrs, ctrl) {
            el.on('mouseenter', function(){
                scope.$apply(function(){
                    ctrl.toggle(true);
                })
            })
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('fileDropzone', fileDropzone);

    /**
     * fileDropzone
     *
     * This directives makes any element a place to drop files from the local pc. Currently this directive only
     * supports to read files as a text.
     *
     * @return {{restrict: string, scope: {onLoaded: string}, link: link}}
     */
    function fileDropzone() {

        var directive = {
            restrict: 'A',
            scope: {
                onLoaded: '&'
            },
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            var _reader = new FileReader();

            //////////

            // call function that was passed as onLoaded with the result of the FileReader
            _reader.onload = function (e) {
                scope.onLoaded()(e.target.result);
            };

            // add dragover event
            el.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

            el.on('dragenter', function(){
                el[0].style.outline = '4px solid rgba(0,0,0,0.2)'
            }).on('dragleave', function(){
                el[0].style.outline = '0'
            });

            // add drop event and read files
            el.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                readFiles(e.dataTransfer.files);
                el[0].style.outline = '0'
            });

            //////////

            /**
             * Read files as a text file
             * @param files
             */
            function readFiles(files) {
                _.forEach(files, function (file) {
                    _reader.readAsText(file);
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('fitParentDimensions', [
            '$window',
            fitParentDimensions
        ]);

    /**
     * fitParentDimensions
     *
     * This directive changes the dimensions of an element to its parent element. Optionally you can trigger this
     * behaviour by passing the value 'true' to the parameter bindResize so that every time the window resizes,
     * the dimensions of the element will be updated.
     *
     * By setting 'asStyle' to 'true', the dimensions will be written in the style attribute of the element. Otherwise
     * this directive creates the width and height attribute.
     *
     * As Default, both options are disabled.
     *
     * @param $window
     * @return {{scope: {bindResize: string}, link: link}}
     */
    function fitParentDimensions($window) {

        // the directive
        var directive = {
            restrict: 'A',
            scope: {
                bindResize: '=',
                asStyle: '='
            },
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            var _parent = el.parent()[0];

            //////////

            if (scope.bindResize) {
                angular.element($window).on('resize', fitToParent)
            }

            fitToParent();

            //////////

            /**
             * Set the element to the dimensions of its parent
             */
            function fitToParent() {

                var width = _parent.offsetWidth;
                var height = _parent.offsetHeight;

                if (scope.asStyle) {
                    el[0].style.width = width + 'px';
                    el[0].style.height = height + 'px';
                } else {
                    el[0].setAttribute('width', width);
                    el[0].setAttribute('height', height);
                }
            }
        }
    }
}());;(function(){
	'use strict';
	
	angular
		.module('weblearner.directives')
		.directive('fixOnScroll', [
			'$window',
			fixOnScroll
		]);

	function fixOnScroll($window) {
	
		var directive = {
			link: link
		};
		return directive;
		
		//////////
		
		function link (scope, el, attrs) {
		
			// get settings from attribute (top & class)
			var settings = scope.$eval(attrs.fixOnScroll);
			if (angular.isUndefined(settings.top) || angular.isUndefined(settings.class)) {
				 return;
			}

			// get element height for the placeholder element
			var height = el[0].offsetHeight;

			// create, configure, hide & append the placeholder element after the element
			var placeholder = document.createElement('div');
			placeholder.style.height = height + 'px';
			placeholder.style.display = 'none';
			el.after(placeholder);

			// listen to window scroll event and add or remove the specified class to or from the element
			// and show or hide the placeholder for a smooth scrolling behaviour
			angular.element($window).on('scroll', function () {
				 if ($window.scrollY >= settings.top) {
					  if (!el.hasClass(settings.class)) {
							placeholder.style.display = 'block';
							el.addClass(settings.class);
					  }
				 } else {
					  if (el.hasClass(settings.class)) {
							placeholder.style.display = 'none';
							el.removeClass(settings.class);
					  }
				 }
			})
		}
	}
}());
;(function() {

	angular.module('weblearner.directives').directive('hypothesis',
			[ '$window', 'paths', hypothesis ]);

	function intersectNode(node, point) {
		return node.intersect(point);
	}

	function calcPoints(g, e) {
		var edge = g.edge(e), tail = g.node(e.v), head = g.node(e.w), points = edge.points
				.slice(1, edge.points.length - 1);

		points.unshift(intersectNode(tail, points[0]));
		points.push(intersectNode(head, points[points.length - 1]));

		return createLine(edge, points);
	}

	function createLine(edge, points) {
		var line = d3.svg.line().x(function(d) {
			return d.x;
		}).y(function(d) {
			return d.y;
		});

		if (_.has(edge, "lineInterpolate")) {
			line.interpolate(edge.lineInterpolate);
		}

		if (_.has(edge, "lineTension")) {
			line.tension(Number(edge.lineTension));
		}

		return line(points);
	}

	function hypothesis($window, paths) {

		var directive = {
			scope : {
				test : '=',
				counterExample : '=',
				layoutSettings : '='
			},
			templateUrl : paths.views.DIRECTIVES + '/hypothesis.html',
			link : link
		};
		return directive;

		//////////

		function link(scope, el, attrs) {

			var _svg;
			var _svgGroup;
			var _svgContainer;
			var _graph;
			var _renderer;

			//////////

			scope.$watch('test', function(test) {
				if (angular.isDefined(test) && test != null) {
					createHypothesis();
				}
			});

			scope.$watch('layoutSettings', function(ls) {
				if (angular.isDefined(ls)) {
					createHypothesis();
				}
			});

			//////////

			function createHypothesis() {
				clearSvg();
				initGraph();
				layout();
				renderGraph();
				handleEvents();
			}

			function clearSvg() {
				el.find('svg')[0].innerHTML = '';
			}

			function initGraph() {

				_svg = d3.select(el.find('svg')[0]);
				_svgGroup = _svg.append("g");
				_svgContainer = _svg.node().parentNode;

				_graph = new graphlib.Graph({
					directed : true,
					multigraph : true
				});

				if (angular.isDefined(scope.layoutSettings)) {
					_graph.setGraph({
						edgesep : scope.layoutSettings.edgesep,
						nodesep : scope.layoutSettings.nodesep,
						ranksep : scope.layoutSettings.ranksep
					});
				} else {
					_graph.setGraph({
						edgesep : 25
					});
				}
			}
			
			function layout() {
				if (angular.isDefined(scope.layoutSettings)) {
					if (scope.layoutSettings.multigraph) {
						layoutAsMultiGraph();
					} else {
						layoutAsGraph();
					}
				} else {
					layoutAsGraph();
				}
			}

			function layoutAsMultiGraph() {

				// add nodes to the graph
				_.forEach(scope.test.hypothesis.nodes, function(node, i) {
					_graph.setNode("" + i, {
						shape : 'circle',
						label : node.toString(),
						width : 25
					});
				});

				// add edges to the graph
				_.forEach(scope.test.hypothesis.edges, function(edge, i) {
					var edgeName = edge.from + "-" + edge.to + "|" + i;
					_graph.setEdge(edge.from, edge.to, {
						label : edge.input + "/" + edge.output,
						labeloffset : 5,
						lineInterpolate : 'basis'
					}, edgeName);
				});

				// layout it
				dagreD3.dagre.layout(_graph, {});
			}

			function layoutAsGraph() {

				// another format of a graph for merged multi edges
				// graph = {<from>: {<to>: <label[]>, ...}, ...}
				var graph = {};

				// add nodes to the rendered graph
				_.forEach(scope.test.hypothesis.nodes, function(node, i) {
					_graph.setNode("" + i, {
						shape : 'circle',
						label : node.toString(),
						width : 25
					});
				});

				// build data structure for the alternative representation by
				// pushing some data
				_.forEach(scope.test.hypothesis.edges, function(edge, i) {
					if (!graph[edge.from]) {
						graph[edge.from] = {};
						graph[edge.from][edge.to] = [ edge.input + "/"
								+ edge.output ];
					} else {
						if (!graph[edge.from][edge.to]) {
							graph[edge.from][edge.to] = [ edge.input + "/"
									+ edge.output ];
						} else {
							graph[edge.from][edge.to].push(edge.input + "/"
									+ edge.output);
						}
					}
				});

				// add edges to the rendered graph and combine <label[]>
				_.forEach(graph, function(k, from) {
					_.forEach(k, function(labels, to) {
						_graph.setEdge(from, to, {
							label : labels.join('\n'),
							labeloffset : 5,
							lineInterpolate : 'basis'
						}, (from + '' + to));
					});
				});

				// render the graph on the svg
				dagreD3.dagre.layout(_graph, {});
			}

			function renderGraph() {

				// render the graph in the svg
				_renderer = new dagreD3.render();
				_renderer(_svgGroup, _graph);

				// Center graph horizontally
				var xCenterOffset = (_svgContainer.clientWidth - _graph.graph().width) / 2;
				_svgGroup.attr("transform", "translate(" + xCenterOffset + ", 100)");
			}
			
			function handleEvents(){
				
				var zoom;
				var drag;
				
				// attach click events for the selection of counter examples to the edge labels
				// only if counterExamples is defined
				if (angular.isDefined(scope.counterExample)) {
					_svg.selectAll('.edgeLabel tspan').on('click', function() {
						var label = this.innerHTML.split('/');
						scope.$apply(function(){
							scope.counterExample.input += (label[0] + ',');
							scope.counterExample.output += (label[1] + ',');
						});
					});
				}
				
				// Create and handle zoom  & pan event
				zoom = d3.behavior.zoom().scaleExtent([ 0.1, 10 ])
						.translate([ (_svgContainer.clientWidth - _graph.graph().width) / 2, 100 ]).on("zoom", zoomHandler);
				zoom(_svg);

				function zoomHandler() {
					_svgGroup.attr('transform', 'translate(' + zoom.translate()
							+ ')' + ' scale(' + zoom.scale() + ')');
				}
				
				// Add drag behavior for nodes
				drag = d3.behavior.drag()
						.origin(function(d) { return d; })
						.on('dragstart', dragstart)
						.on("drag", drag);

				_svg.selectAll('.node')
						.attr('cx', function(d) { return d.x; })
						.attr('cy', function(d) { return d.y; })
						.call(drag);

				// prevent pan effect while dragging nodes
				function dragstart(d) {
					d3.event.sourceEvent.stopPropagation();
				}

				function drag(d) {
					var node = d3.select(this);
					var attrs = _graph.node(d);
					attrs.x += d3.event.dx;
					attrs.y += d3.event.dy;
					node.attr('transform', 'translate(' + attrs.x + ','
							+ attrs.y + ')');

					// redraw edges
					var paths = d3.selectAll('.path');
					_.forEach(_graph.edges(), function(edge, i) {
						var line = calcPoints(_graph, edge);
						paths[0][i].setAttribute('d', line);
					});
				}
				
				angular.element($window).on('resize', fitSize);

				function fitSize() {
					_svg.attr("width", _svgContainer.clientWidth);
					_svg.attr("height", _svgContainer.clientHeight);
				}

				window.setTimeout(function() {
					window.dispatchEvent(new Event('resize'));
				}, 100);
			}
		}
	}
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('panelManager', panelManager);

    function panelManager() {

        var template = '' +
            '<div style="position: absolute; top: 50px; bottom: 0; width: 100%;">' +
            '   <div ng-click="addPanel()" style="position: absolute; right: 0; top: 0; bottom: 0; width: 40px; background: #f2f2f2; border-left: 1px solid #e7e7e7"></div>' +
            '   <div style="position: absolute; left: 0; top: 0; bottom: 0; right: 40px; background: #fff" ng-transclude></div>' +
            '</div>';

        var directive = {
            template: template,
            transclude: true,
            scope: {
                panels: '=panelManager'
            },
            controller: [
                '$scope',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope) {

            this.getPanels = function () {
                return $scope.panels;
            };

            this.closePanelAt = function (index) {
                $scope.panels.splice(index, 1);
                $scope.$apply();

                // has to call resize so that the hypothesis svg is rezsied properly
                window.dispatchEvent(new Event('resize'));
            };

            //////////

            $scope.addPanel = function () {
                $scope.panels.push(null)
            }
        }
    }

    angular
        .module('weblearner.directives')
        .directive('panel', panel);

    function panel() {

        var template = '<div class="panel" style="position: absolute; top: 0; bottom: 0; width: 100%;" ng-transclude></div>';

        var directive = {
            require: '^panelManager',
            template: template,
            transclude: true,
            link: link,
            scope: {
                index: '=panelIndex'
            }
        };
        return directive;

        //////////

        function link(scope, el, attrs, ctrl) {

            var panel = el.children()[0];
            scope.panels = ctrl.getPanels();

            //////////

            scope.$watch('panels.length', init);
            init();

            //////////

            function init() {
                panel.style.width = (100 / scope.panels.length) + '%';
                panel.style.left = ((100 / scope.panels.length) * (scope.index)) + '%';
            }
        }
    }

    angular
        .module('weblearner.directives')
        .directive('panelCloseButton', panelCloseButton);

    function panelCloseButton() {

        var directive = {
            require: '^panelManager',
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs, ctrl) {

            el.on('click', closePanel);

            function closePanel() {
                var index = parseInt(attrs.panelCloseButton);
                ctrl.closePanelAt(index);
            }
        }
    }

    angular
        .module('weblearner.directives')
        .directive('hypothesisSlideshowPanel', hypothesisSlideshowPanel);

    hypothesisSlideshowPanel.$inject = ['paths'];

    function hypothesisSlideshowPanel(paths) {

        var directive = {
            require: '^panelManager',
            scope: {
                result: '=',
                panelIndex: '@'
            },
            templateUrl: paths.views.DIRECTIVES + '/hypothesis-panel.html',
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs, ctrl) {

            scope.index;
            scope.pointer = scope.result.length - 1;
            scope.panels = ctrl.getPanels();

            //////////

            scope.$watch('panels.length', init);

            //////////

            function init() {
                scope.index = parseInt(scope.panelIndex);
            }

            //////////

            scope.firstStep = function () {
                scope.pointer = 0;
            };

            scope.previousStep = function () {
                if (scope.pointer - 1 < 0) {
                    scope.lastStep();
                } else {
                    scope.pointer--;
                }
            };

            scope.nextStep = function () {
                if (scope.pointer + 1 > scope.result.length - 1) {
                    scope.firstStep();
                } else {
                    scope.pointer++;
                }
            };

            scope.lastStep = function () {
                scope.pointer = scope.result.length - 1;
            };

            scope.getCurrentStep = function () {
                return scope.result[scope.pointer];
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('loadScreen', loadScreen);

    loadScreen.$inject = ['$http', 'paths'];

    function loadScreen($http, paths) {

        var directive = {
            templateUrl: paths.views.DIRECTIVES + '/load-screen.html',
            link: link
        };
        return directive;

        //////////

        function link (scope, el, attrs) {
        	        	            
        	scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if(v){
                	el[0].style.display = 'block'
                }else{
                	el[0].style.display = 'none'
                }
            });
        }
    }
}());;(function(){
	'use strict';
	
	angular
		.module('weblearner.directives')
		.directive('navigation', [
            'paths',
            navigation
        ]);
	
	function navigation(paths) {
		
		var directive = {
			templateUrl: paths.views.DIRECTIVES + '/navigation.html',
			link: link,
			controller: ['$scope', '$window', '$state', 'SessionService', controller]
		};
		return directive;
		
		//////////
		
		function link(scope, el, attrs) {

            var menuButton = angular.element(el[0].getElementsByClassName('navbar-menu'));
            var wrapper = angular.element(el[0].getElementsByClassName('app-navigation-wrapper'));
            var view = angular.element(document.getElementById('view'));
            var cssClass = 'has-off-screen-navigation';

			menuButton.on('click', toggleNavigation);

            function toggleNavigation(e) {
                e.stopPropagation();

                if (wrapper.hasClass(cssClass)) {
                    wrapper.removeClass(cssClass);
                } else {
                    wrapper.addClass(cssClass);
                    wrapper.on('click', hideNavigation);
                }
            }

            function hideNavigation(e) {
                if (e.target.tagName == 'A' && e.target.getAttribute('href') != '#') {
                    wrapper.removeClass(cssClass);
                    wrapper.off('click', hideNavigation);
                }
            }
        }
		
		//////////
		
		function controller($scope, $window, $state, SessionService){

			var mediaQuery;

			//////////
			
			/** the project */
	        $scope.project = SessionService.project.get();
			$scope.hover = false;
			$scope.offScreen = false;

	        //////////

			this.setHover = function(hover){
				$scope.hover = hover;
			};

			this.isHover = function(){
				return $scope.hover;
			};

			this.isOffScreen = function(){
				return $scope.offScreen;
			};

			//////////

	        // load project into scope when projectOpened is emitted
	        $scope.$on('project.opened', function () {
	            $scope.project = SessionService.project.get();
	        });

	        // delete project from scope when projectOpened is emitted
	        $scope.$on('project.closed', function () {
	            $scope.project = null;
	        });

			// watch for media query event
			mediaQuery = window.matchMedia('screen and (max-width: 768px)');
			mediaQuery.addListener(mediaQueryMatches);
			mediaQueryMatches(null, mediaQuery.matches);

			//////////

			function mediaQueryMatches(evt, matches){
				if (evt === null) {
					$scope.offScreen = matches ? true : false;
				} else {
					$scope.offScreen = evt.matches;
				}
			}

	        //////////

	        /**
	         * remove the project object from the session and redirect to the start page
	         */
	        $scope.closeProject = function () {
	        	SessionService.project.remove();
	            $state.go('home');
	        }
		}
	}

	angular
		.module('weblearner.directives')
		.directive('dropdownNavigation', ['$document', dropdownNavigation]);

	function dropdownNavigation($document){
		return {
			require: ['dropdown', '^navigation'],
			link: function(scope, el, attrs, ctrls) {

				var dropDownCtrl = ctrls[0];
				var navigationCtrl = ctrls[1];

				el.on('click', function(e){
					e.stopPropagation();

					if (!navigationCtrl.isOffScreen()){
						if (!navigationCtrl.isHover()){
							navigationCtrl.setHover(true);
							$document.on('click', closeDropDown);
						}
					}
				}).on('mouseenter', function(){
					if (navigationCtrl.isHover()){
						scope.$apply(function(){
							dropDownCtrl.toggle(true);
						})
					}
				});

				function closeDropDown() {
					navigationCtrl.setHover(false);
					$document.off('click', closeDropDown);
				}
			}
		}
	}
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openActionCreateModal', [
            '$modal', 'ngToast', 'paths',
            openActionCreateModal
        ]);

    function openActionCreateModal($modal, toast, paths) {

        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                onCreated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attr) {

            el.on('click', handleModal);

            function handleModal() {

                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/action-create-modal.html',
                    controller: 'ActionCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: angular.copy(scope.symbol)
                            };
                        }
                    }
                });

                // when successfully creating a symbol at the new to the list
                modal.result.then(function (action) {
                    scope.onCreated()(action);
                    toast.create({
                        class: 'success',
                        content: 'Action created'
                    });
                });
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openActionEditModal', [
            '$modal', 'ngToast', 'paths',
            openActionEditModal
        ]);

    function openActionEditModal($modal, toast, paths) {
        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                action: '=',
                onUpdated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attr) {

            el.on('click', handleModal);

            function handleModal() {

                if (angular.isUndefined(scope.action)) {
                    return;
                }

                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/action-edit-modal.html',
                    controller: 'ActionEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: angular.copy(scope.symbol),
                                action: angular.copy(scope.action)
                            };
                        }
                    }
                });

                // when successfully creating a symbol at the new to the list
                modal.result.then(function (action) {
                    toast.create({
                        class: 'success',
                        content: 'Action updated'
                    });
                    scope.onUpdated()(action);
                });
            }
        }
    }
}());;(function(){
	
	angular
		.module('weblearner.directives')
		.directive('openCounterExampleBuilder', openCounterExampleBuilder)
		
	openCounterExampleBuilder.$inject = ['CounterExampleBuilderService'];
	
	function openCounterExampleBuilder(CounterExampleBuilder) {
		
		var directive = {
			scope: {
				inputs: '=',
				outputs: '=',
				counterExample: '='
			},
			link: link
		};
		return directive;
		
		function link(scope, el, attrs) {
			
			el.on('click', function(){
				CounterExampleBuilder.open({
					inputs: angular.copy(scope.inputs),
					outputs: angular.copy(scope.outputs),
					counterExample: angular.copy(scope.counterExample)
				});
			});
		}
	}
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openHypothesisLayoutSettingsModal', [
            '$modal', 'paths',
            openHypothesisLayoutSettingsModal
        ]);

    function openHypothesisLayoutSettingsModal($modal) {

        var directive = {
            scope: {
                layoutSettings: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            //////////

            function handleModal() {

                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/hypothesis-layout-settings-modal.html',
                    controller: 'HypothesisLayoutSettingsController',
                    resolve: {
                        modalData: function () {
                            return {
                                layoutSettings: scope.layoutSettings
                            }
                        }
                    }
                });

                modal.result.then(function (layoutSettings) {
                    scope.layoutSettings = layoutSettings
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openSymbolCreateModal', [
            '$modal', 'paths',
            openSymbolCreateModal
        ]);

    function openSymbolCreateModal($modal, paths) {
        var directive = {
            restrict: 'EA',
            scope: {
                symbolType: '@',
                projectId: '@',
                onCreated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-create-modal.html',
                    controller: 'SymbolCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbolType: scope.symbolType,
                                projectId: scope.projectId
                            }
                        }
                    }
                });
                modal.result.then(function (symbol) {
                    scope.onCreated()(symbol);
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openSymbolEditModal', [
            '$modal', 'paths',
            openSymbolEditModal
        ]);

    function openSymbolEditModal($modal, paths) {

        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                onUpdated: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {

                if (angular.isUndefined(scope.symbol)) {
                    return;
                }

                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-edit-modal.html',
                    controller: 'SymbolEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: angular.copy(scope.symbol)
                            };
                        }
                    }
                });
                modal.result.then(function (symbol) {
                    scope.onUpdated()(symbol);
                })
            }
        }
    }
}());;(function () {

    angular
        .module('weblearner.directives')
        .directive('openTestDetailsModal', [
            '$modal', 'paths',
            openTestDetailsModal
        ]);

    function openTestDetailsModal($modal, paths) {

        var directive = {
            scope: {
                test: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                if (angular.isDefined(scope.test)) {
                    $modal.open({
                        templateUrl: paths.views.MODALS + '/modal-test-details.html',
                        controller: 'TestDetailsController',
                        resolve: {
                            modalData: function () {
                                return {
                                    test: angular.copy(scope.test)
                                }
                            }
                        }
                    })
                }
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openTestSetupSettingsModal', [
            '$modal', 'paths',
            openTestSetupSettingsModal
        ]);

    function openTestSetupSettingsModal($modal, paths) {

        var directive = {
            restrict: 'EA',
            scope: {
                learnConfiguration: '=',
                onOk: '&'
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attr) {

            el.on('click', handleModal);

            function handleModal() {            	
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/modal-test-setup-settings.html',
                    controller: 'TestSetupSettingsController',
                    resolve: {
                        modalData: function () {
                            return {
                                learnConfiguration: angular.copy(scope.learnConfiguration)
                            };
                        }
                    }
                });

                // when successfully creating a symbol at the new to the list
                modal.result.then(function (learnConfiguration) {
                    scope.onOk()(learnConfiguration);
                });
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('openWebElementPicker', [
            'WebElementPickerService',
            openWebElementPicker
        ]);

    function openWebElementPicker(WebElementPickerService) {

        var directive = {
            scope: {
                url: '=',
                selector: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            el.on('click', WebElementPickerService.open);

            //////////

            scope.$on('webElementPicker.ok', ok);

            //////////

            function ok(event, data) {
                scope.url = data.url;
                scope.selector = data.selector;
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('restActionEditForm', [
            'paths',
            restActionEditForm
        ]);

    function restActionEditForm(paths) {

        var directive = {
            scope: {
                action: '&'
            },
            templateUrl: paths.views.DIRECTIVES + '/rest-action-edit-form.html',
            controller: [
                '$scope', 'RestActionTypes',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope, RestActionTypes) {

            $scope.action = angular.copy($scope.action());
            $scope.actionTypes = RestActionTypes;

            $scope.submitForm = function () {
                $scope.$emit('action.edited', angular.copy($scope.action));
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('restActionCreateForm', [
            'paths',
            restActionCreateForm
        ]);

    function restActionCreateForm(paths) {

        var directive = {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/rest-action-create-form.html',
            controller: [
                '$scope', 'RestActionTypes',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope, RestActionTypes) {

            $scope.action = {};
            $scope.actionTypes = RestActionTypes;

            $scope.submitForm = function () {
                $scope.$emit('action.created', angular.copy($scope.action));
            }
        }
    }
}());
;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('selectAllItemsCheckbox', [
            'SelectionService',
            selectAllItemsCheckbox
        ]);

    function selectAllItemsCheckbox(SelectionService) {

        var directive = {
            scope: {
                items: '='
            },
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs, selectionCtrl) {

            el.on('change', changeSelection);

            function changeSelection() {
                if (this.checked) {
                    SelectionService.selectAll(scope.items);
                } else {
                    SelectionService.deselectAll(scope.items);
                }
                scope.$apply();
            }
        }
    }


    angular
        .module('weblearner.directives')
        .directive('selectableList', selectableList);

    function selectableList() {

        var directive = {
            transclude: true,
            replace: true,
            require: 'ngModel',
            scope: {
                items: '=ngModel'
            },
            template: '<div class="selectable-list" ng-transclude></div>',
            controller: ['$scope', 'SelectionService', controller]
        };
        return directive;

        //////////

        function controller($scope, SelectionService) {

            this.getItems = function () {
                return $scope.items;
            };
        }
    }


    angular
        .module('weblearner.directives')
        .directive('selectableListItem', selectableListItem);

    function selectableListItem() {

        var directive = {
            require: '^selectableList',
            replace: true,
            transclude: true,
            template: ' <div class="selectable-list-item" ng-class="item._selected ? \'active\' : \'\'">' +
            '               <div class="selectable-list-control">' +
            '                   <input type="checkbox" ng-model="item._selected">' +
            '               </div>' +
            '               <div class="selectable-list-content" ng-transclude></div>' +
            '           </div>',
            link: link
        };
        return directive;

        //////////

        function link(scope, el, attrs, ctrl) {

            scope.item = ctrl.getItems()[scope.$index];
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('widget', widget);

    function widget() {

        var template = '' +
            '<div class="panel panel-default">' +
            '   <div class="panel-heading">' +
            '       <div class="pull-right">' +
            '           <span class="panel-collapse-handle" ng-click="toggleCollapse()">' +
            '               <i class="fa" ng-class="collapsed? \'fa-plus-square\' : \'fa-minus-square\'"></i>' +
            '           </span>' +
            '       </div>' +
            '       <strong class="text-muted" ng-bind="title"></strong>' +
            '   </div>' +
            '   <div class="panel-body" ng-show="!collapsed" ng-transclude></div>' +
            '</div>';

        ///////////

        var directive = {
            scope: {
                collapsed: '='
            },
            template: template,
            transclude: true,
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            scope.title = attrs.widgetTitle || 'Untitled';
            scope.collapsed = scope.collapsed || false;

            scope.toggleCollapse = function () {
                scope.collapsed = !scope.collapsed;
            }
        }
    }


    angular
        .module('weblearner.directives')
        .directive('widgetCounterExamples', widgetCounterExamples);

    widgetCounterExamples.$inject = ['paths'];

    function widgetCounterExamples(paths) {

        var directive = {
            templateUrl: paths.views.WIDGETS + '/widget-counter-examples.html',
            scope: {
                counterExamples: '=',
                newCounterExample: '=counterExample'
            },
            controller: ['$scope', controller]
        }
        return directive;

        function controller($scope) {

            $scope.$watch('counterExamples.length', function (n, o) {
                console.log(n)
            });

            //////////

            $scope.addCounterExample = function () {

                var ce = {
                    input: [],
                    output: []
                };

                _.forEach($scope.newCounterExample.input.split(','), function (input) {
                    if (input.trim() != '') {
                        ce.input.push(input.trim())
                    }
                });

                _.forEach($scope.newCounterExample.output.split(','), function (output) {
                    if (output.trim() != '') {
                        ce.output.push(output.trim())
                    }
                });

                $scope.counterExamples.push(ce);
                $scope.newCounterExample.input = '';
                $scope.newCounterExample.output = '';
            };

            $scope.removeCounterExample = function (ce, index) {

                $scope.counterExamples.splice(index, 1);
            }
        }
    }


    angular
        .module('weblearner.directives')
        .directive('widgetTestResumeSettings', widgetTestResumeSettings);

    widgetTestResumeSettings.$inject = ['paths'];

    function widgetTestResumeSettings(paths) {

        var directive = {
            templateUrl: paths.views.WIDGETS + '/widget-test-resume-settings.html',
            scope: {
                configuration: '='
            },
            controller: ['$scope', 'EqOraclesEnum', 'EqOracleService', controller]
        };
        return directive;

        function controller($scope, EqOraclesEnum, EqOracleService) {

            $scope.eqOracles = EqOraclesEnum;

            //////////

            $scope.$watch('configuration.eqOracle.type', function (type) {
                $scope.configuration.eqOracle = EqOracleService.create(type);
            });
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolCreateForm', [
            'paths',
            symbolCreateForm
        ]);

    function symbolCreateForm(paths) {

        var directive = {
            scope: {
                type: '@'
            },
            controller: [
                '$scope',
                controller
            ],
            templateUrl: paths.views.DIRECTIVES + '/symbol-create-form.html'
        };
        return directive;

        //////////

        function controller($scope) {

            $scope.symbol = {
                name: null,
                abbreviation: null,
                type: $scope.type
            };

            $scope.submitForm = function(){
                $scope.$emit('symbol.created', angular.copy($scope.symbol));
            }
        }

    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolEditForm', [
            'paths',
            symbolEditForm
        ]);

    function symbolEditForm(paths) {

        var directive = {
            scope: {
                symbol: '&'
            },
            controller: [
                '$scope',
                controller
            ],
            templateUrl: paths.views.DIRECTIVES + '/symbol-edit-form.html'
        };
        return directive;

        //////////

        function controller($scope) {

            $scope.symbol = angular.copy($scope.symbol());

            $scope.submitForm = function(){
                $scope.$emit('symbol.edited', angular.copy($scope.symbol));
            }
        }

    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChart', testResultsChart);

    /**
     * testResultsChart
     *
     * The directive that is placed somewhere in your html markup in order to display the charts for displaying
     * the statistics of some test results.
     *
     * Use the attribute 'chart-data' on the element of the directive to pass the data that should be plotted
     *
     * @return {{scope: {chartData: string}, controller: *[], template: string}}
     */
    function testResultsChart() {

        var template = '' +
            '<div>' +
            '   <canvas id="test-results-chart" width="800" height="400"></canvas>' +
            '   <hr>' +
            '   <div class="text-center">' +
            '       <button class="btn btn-default btn-sm" ng-class="visibleChartProperty == chartProperties.DURATION ? \'active\' : \'\'" ng-click="showDuration()">Duration</button>' +
            '       <button class="btn btn-default btn-sm" ng-class="visibleChartProperty == chartProperties.AMOUNT_OF_RESETS ? \'active\' : \'\'" ng-click="showResets()">#Resets</button>' +
            '       <button class="btn btn-default btn-sm" ng-class="visibleChartProperty == chartProperties.AMOUNT_OF_SYMBOLS ? \'active\' : \'\'" ng-click="showSymbols()">#Symbols</button>' +
            '   </div>' +
            '</div>';

        //////////

        var directive = {
            scope: {
                chartData: '='
            },
            controller: [
                '$scope', '$element', 'TestResultsChartService',
                controller
            ],
            template: template
        };
        return directive;

        //////////

        /**
         * The controller for the directive testResultsChart that can be required by other directives
         *
         * @param $scope - the current scope
         * @param $element - the root element of the directive
         */
        function controller($scope, $element, TestResultsChartService) {

            // The canvas on which the charts will be drawn
            var canvas = $element.find('canvas')[0].getContext('2d');

            // The chart.js Chart object
            var chart;

            // The update method that is dynamically set by other directives in order to update the canvas
            var update;

            //////////

            $scope.chartProperties = TestResultsChartService.chartProperties;
            
            $scope.visibleChartProperty = $scope.chartProperties.AMOUNT_OF_SYMBOLS;

            //////////

            /**
             * Draw a bar chart on the canvas from data
             * @param data - the data in the format that is expected by chart.js
             */
            this.createBarChart = function (data) {
                chart = new Chart(canvas).Bar(data, {responsive: true});
            };

            /**
             * Draw a line chart on the canvas from data
             * @param data - the data in the format that is expected by chart.js
             */
            this.createLineChart = function (data) {
                chart = new Chart(canvas).Line(data, {responsive: true});
            };

            /**
             * Returns the data that was passed as an argument to the directive
             * @return {string|chartData}
             */
            this.getChartData = function () {
                return $scope.chartData;
            };

            /**
             * Set the method that is called to update the chart on the canvas
             * @param f - the update function with to params (chart, property)
             */
            this.setUpdate = function (f) {
                update = f;
            };

            //////////

            /**
             * Update the canvas and show the statistics for the duration of test results
             */
            $scope.showDuration = function () {
                update(chart, $scope.chartProperties.DURATION);
                $scope.visibleChartProperty = $scope.chartProperties.DURATION;
            };

            /**
             * Update the canvas and show the statistics for the number of resets of test results
             */
            $scope.showResets = function () {
                update(chart, $scope.chartProperties.AMOUNT_OF_RESETS);
                $scope.visibleChartProperty = $scope.chartProperties.AMOUNT_OF_RESETS
            };

            /**
             * Update the canvas and show the statistics for the number of symbols of test results
             */
            $scope.showSymbols = function () {
                update(chart, $scope.chartProperties.AMOUNT_OF_SYMBOLS);
                $scope.visibleChartProperty = $scope.chartProperties.AMOUNT_OF_SYMBOLS
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChartMultipleFinal', testResultsChartMultipleFinal);

    /**
     * testResultsChartMultipleFinal
     *
     * The directive that should be applied to the element where the chart for the comparison of multiple final test
     * results should be displayed. Requires that the directive 'testResultsChart' is applied to the element as well
     * because it works with it.
     *
     * Displays a bar chart.
     *
     * @return {{require: string, link: link}}
     */
    function testResultsChartMultipleFinal() {

        var directive = {
            require: 'testResultsChart',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the controller from 'testResultsChart'
         */
        function link(scope, el, attrs, ctrl) {

            // The cache that holds all chart.js data sets for a set of results
            var datasets;

            // get the chart data from the parent directive controller and initialize this directive
            scope.chartData = ctrl.getChartData();
            scope.$watch('chartData', init);

            //////////

            /**
             * Initialize the directive
             *
             * @param data - the data in the format of a chart.js bar chart
             */
            function init(data) {
                if (angular.isDefined(data)) {
                    data = data[0];

                    // save all data sets for later manipulation
                    datasets = angular.copy(data.datasets);
                    // show a single value
                    data.datasets = [datasets[0]];

                    ctrl.createBarChart(data);
                    ctrl.setUpdate(update)
                }
            }

            /**
             * The method that updates the chart. It is called when the user wants to see another value of the test
             *
             * @param chart - the chart.js object
             * @param property - the property that should be plotted on the canvas
             */
            function update(chart, property) {
                _.forEach(datasets[property].data, function (value, i) {
                    chart.datasets[0].bars[i].value = value;
                });
                chart.update();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChartSingleComplete', testResultsChartSingleComplete);

    /**
     * testResultsChartSingleComplete
     *
     * The directive that should be applied to the element where the chart for a single complete test result should be
     * displayed. Requires that the directive 'testResultsChart' is applied to the element as well because it works with
     * it.
     *
     * Displays a line chart if there are at least two steps from the test results to display, otherwise a bar chart
     *
     * @return {{require: string, link: link}}
     */
    function testResultsChartSingleComplete() {

        var directive = {
            require: 'testResultsChart',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the controller from 'testResultsChart'
         */
        function link(scope, el, attrs, ctrl) {

            var datasets;

            // get the chart data from the paren directive
            scope.chartData = ctrl.getChartData();
            scope.$watch('chartData', init);

            //////////

            /**
             * Initialize the directive
             * @param data
             */
            function init(data) {
                if (angular.isDefined(data)) {
                    data = data[0];

                    datasets = angular.copy(data.datasets);
                    data.datasets = [datasets[0]];

                    if (data.datasets[0].data.length == 1) {
                        ctrl.createBarChart(data);
                        ctrl.setUpdate(updateBarChart)

                    } else {
                        ctrl.createLineChart(data);
                        ctrl.setUpdate(updateLineChart)
                    }
                }
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a bar chart
             *
             * @param chart
             * @param property
             */
            function updateBarChart(chart, property) {
                _.forEach(datasets[property].data, function (value, i) {
                    chart.datasets[0].bars[i].value = value;
                });
                chart.update();
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a line chart
             *
             * @param chart
             * @param property
             */
            function updateLineChart(chart, property) {
                _.forEach(datasets[property].data, function (value, i) {
                    chart.datasets[0].points[i].value = value;
                });
                chart.update();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChartTwoComplete', testResultsChartTwoComplete);

    /**
     * testResultsChartTwoComplete
     *
     * The directive that should be applied to the element where the chart for the comparison of two complete test
     * results should be displayed. Requires that the directive 'testResultsChart' is applied to the element as well
     * because it works with it.
     *
     * Displays a line chart if there are at least two steps from the test results to display, otherwise a bar chart
     *
     * @return {{require: string, link: link}}
     */
    function testResultsChartTwoComplete() {

        var directive = {
            require: 'testResultsChart',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the controller from 'testResultsChart'
         */
        function link(scope, el, attrs, ctrl) {

            var datasets0;
            var datasets1;

            // get chart data from the parent directive
            scope.chartData = ctrl.getChartData();
            scope.$watch('chartData', init);

            //////////

            /**
             * Initialize the directive
             * @param data
             */
            function init(data) {
                if (angular.isDefined(data)) {

                    // save the chart data for both complete test results separately
                    datasets0 = angular.copy(data[0].datasets);
                    datasets1 = angular.copy(data[1].datasets);

                    // remodel the data for the chart, take the one with most steps
                    if (data[1].labels.length > data[0].labels.length) {
                        data[0].labels = data[1].labels;
                    }
                    data = data[0];
                    // create the chart.js data sets for a single property for both tests
                    data.datasets = [
                        datasets0[0],
                        datasets1[0]
                    ];

                    // create a bar or a line chart
                    if (data.labels.length == 1) {
                        ctrl.createBarChart(data);
                        ctrl.setUpdate(updateBarChart);
                    } else if (data.labels.length > 1) {
                        ctrl.createLineChart(data);
                        ctrl.setUpdate(updateLineChart);
                    }
                }
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a bar chart
             *
             * @param chart
             * @param property
             */
            function updateBarChart(chart, property) {
                _.forEach(datasets0[property].data, function (value, i) {
                    chart.datasets[0].bars[i].value = value;
                });
                _.forEach(datasets1[property].data, function (value, i) {
                    chart.datasets[1].bars[i].value = value;
                });
                chart.update();
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a line chart
             *
             * @param chart
             * @param property
             */
            function updateLineChart(chart, property) {
                _.forEach(datasets0[property].data, function (value, i) {
                    chart.datasets[0].points[i].value = value;
                });
                _.forEach(datasets1[property].data, function (value, i) {
                    chart.datasets[1].points[i].value = value;
                });
                chart.update();
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webActionCreateForm', [
            'paths',
            webActionCreateForm
        ]);

    function webActionCreateForm(paths) {

        var directive = {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/web-action-create-form.html',
            controller: [
                '$scope', 'WebActionTypes',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope, WebActionTypes) {

            $scope.action = {};
            $scope.actionTypes = WebActionTypes;

            $scope.submitForm = function () {
                $scope.$emit('action.created', angular.copy($scope.action));
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webActionEditForm', [
            'paths',
            webActionEditForm
        ]);

    function webActionEditForm(paths) {

        var directive = {
            scope: {
                action: '&'
            },
            templateUrl: paths.views.DIRECTIVES + '/web-action-edit-form.html',
            controller: [
                '$scope', 'WebActionTypes',
                controller
            ]
        };
        return directive;

        //////////

        function controller($scope, WebActionTypes) {

            $scope.action = angular.copy($scope.action());
            $scope.actionTypes = WebActionTypes;

            $scope.submitForm = function(){
                $scope.$emit('action.edited', angular.copy($scope.action));
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webElementPicker', [
            '$window', 'WebElementPickerService', 'paths',
            webElementPicker
        ]);


    function webElementPicker($window, WebElementPickerService, paths) {

        var directive = {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/web-element-picker.html',
            link: link,
            controller: [
                '$scope', 'SessionService', 'paths',
                controller
            ]
        };
        return directive;

        //////////

        function link(scope, el, attrs) {

            var _iframe = el.find('iframe');
            var _lastTarget = null;

            //////////

            scope.url = '';
            scope.selector = null;

            //////////

            _iframe.on('load', iframeLoaded);

            //////////

            function iframeLoaded() {
                angular.element(_iframe.contents()[0].body.querySelectorAll('a')).on('click', function () {
                    // console.log(this.getAttribute('href'));
                });
            }

            /**
             * Get the unique CSS Path from selected Element
             * http://stackoverflow.com/questions/4588119/get-elements-css-selector-without-element-id
             * @param el  - The element to get the unique css path from
             * @returns {string} - The unique css path ot the element
             * @private
             */
            function getCssPath(el) {

                var names = [];
                while (el.parentNode) {
                    if (el.id) {
                        names.unshift('#' + el.id);
                        break;
                    } else {
                        if (el == el.ownerDocument.documentElement) names.unshift(el.tagName);
                        else {
                            for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++);
                            names.unshift(el.tagName + ":nth-child(" + c + ")");
                        }
                        el = el.parentNode;
                    }
                }
                return names.join(" > ");
            }

            function handleMouseMove(e) {
                if (_lastTarget == e.target) {
                    return false;
                } else {
                    if (_lastTarget != null) {
                        _lastTarget.style.outline = '0px'
                    }
                    _lastTarget = e.target;
                }
                _lastTarget.style.outline = '5px solid red';
                scope.selector = getCssPath(_lastTarget);
                scope.$apply();
            }

            function handleClick(e) {
                if (angular.isDefined(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                _lastTarget.style.outline = '0px';
                _lastTarget = null;

                angular.element(_iframe.contents()[0].body).off('mousemove', handleMouseMove);
                angular.element(_iframe.contents()[0].body).off('click', handleClick);
                angular.element(document.body).off('keyup', handleKeyUp);
            }

            function handleKeyUp(e) {
                if (e.keyCode == 17) { // strg
                    handleClick();
                }
            }

            //////////

            scope.loadUrl = function () {
                if (scope.url == '') {
                    _iframe[0].setAttribute('src', scope.proxyUrl);
                } else {
                    _iframe[0].setAttribute('src', scope.proxyUrl + '/' + scope.url);
                }
            };

            scope.enableSelection = function () {
                var iframeBody = angular.element(_iframe.contents()[0].body);
                iframeBody.on('mousemove', handleMouseMove);
                iframeBody.one('click', handleClick);
                angular.element(document.body).on('keyup', handleKeyUp);
            };
        }

        //////////

        function controller($scope, SessionService, paths) {

            $scope.show = false;
            $scope.project = SessionService.project.get();
            $scope.proxyUrl = null;

            //////////

            if ($scope.project != null) {
                $scope.proxyUrl = $window.location.origin + paths.api.PROXY_URL + $scope.project.baseUrl;
            }

            $scope.$on('webElementPicker.open', function () {
                $scope.show = true;
            });

            $scope.$on('project.opened', function () {
                $scope.project = SessionService.project.get();
                $scope.proxyUrl = $window.location.origin + '/rest/proxy?url=' + $scope.project.baseUrl;
            });

            //////////

            $scope.close = function () {
                $scope.show = false;
                WebElementPickerService.close();
            };

            $scope.ok = function () {
                WebElementPickerService.ok({
                    url: '',
                    selector: $scope.selector
                });
                $scope.show = false;
            }
        }
    }
}());;(function(){
    'use strict';

    angular
        .module('weblearner.models')
        .factory('Project', ProjectModel);

    ProjectModel.$inject = ['ProjectResource'];

    /**
     * The factory for the model of a project
     *
     * @param ProjectResource - The resource to fetch projects from the server
     * @return {Project}
     * @constructor
     */
    function ProjectModel(ProjectResource) {

        /**
         * The project model
         *
         * @param name - The name of the project
         * @param baseUrl - The url the project can be called
         * @param description - The description of the project
         * @constructor
         */
        function Project(name, baseUrl, description) {
            this.name = name;
            this.baseUrl = baseUrl;
            this.description = description;
            this.id;
        }

        /**
         * Create an instance of a project from an object
         *
         * @param data - The data the project should be build from
         * @return {ProjectModel.Project}
         */
        Project.build = function(data){
            var project = new Project(data.name, data.baseUrl, data.description);
            project.id = data.id;
            return project;
        };

        /**
         * The resource object for a project
         * @type {ProjectResource}
         */
        Project.Resource = new ProjectResource();

        // attach the build function of the project to the resource so that it can automatically create instances
        // of projects from http responses
        Project.Resource.build = Project.build;

        return Project;
    }
}());;(function(){
    'use strict';

    angular
        .module('weblearner.models')
        .factory('Symbol', SymbolModel);

    function SymbolModel(){

        function Symbol(name, abbreviation) {
            this.name = name;
            this.abbreviation = abbreviation;
            this.actions = [];
            this.id;
            this.revision;
            this.project;
            this.group;
        }

        Symbol.build = function(data){
            var symbol = new Symbol(data.name, data.abbreviation);
            symbol.actions = data.actions;
            symbol.id = data.id;
            symbol.revision = data.revision;
            symbol.project = data.project;
            symbol.group = data.group;
            return symbol;
        };

        Symbol.Resource = {};
        Symbol.Resource.build = Symbol.build;

        return Symbol;
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('LearnResultResource', [
            '$http', '$q', 'paths', 'ResourceResponseService',
            LearnResultResource
        ]);

    /**
     * LearnResultResource
     * 
     * The resource the get test results from the server
     *
     * @param $http
     * @param $q
     * @param paths
     * @param ResourceResponseService
     * @return {{getGetAllFinal: getGetAllFinal, getFinal: getFinal, getComplete: getComplete, delete: deleteTest}}
     * @constructor
     */
    function LearnResultResource($http, $q, paths, ResourceResponseService) {

        // the service
        var service = {
            getAllFinal: getAllFinal,
            getFinal: getFinal,
            getComplete: getComplete,
            delete: deleteTests
        };
        return service;

        //////////

        /**
         * Get all final results from all tests that were run for a project. the results only include the final
         * hypothesis
         *
         * @param projectId
         * @return {*}
         */
        function getAllFinal(projectId) {
            return $http.get(paths.api.URL + '/projects/' + projectId + '/results')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Get the final test result for a project that only includes the final hypothesis
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function getFinal(projectId, testNo) {
            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNo)
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Get all created hypotheses that were created during a learn process of a project
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function getComplete(projectId, testNo) {

            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNo + '/complete')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Delete a complete test run, that also includes all hypotheses that were created
         *
         * @param projectId
         * @param testNo
         * @return {*}
         */
        function deleteTests(projectId, testNo) {
        	
        	if (angular.isArray(testNo)) {
        		testNo = testNo.join();
        	}
        	
            return $http.delete(paths.api.URL + '/projects/' + projectId + '/results/' + testNo, {})
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'The results were deleted';
                return ResourceResponseService.successWithToast(response, message);
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('LearnerResource', [
            '$http', '$q', 'paths', 'ResourceResponseService',
            Learner
        ]);

    /**
     * Learner
     * The resource that is used to communicate with the learner
     *
     * @param $http
     * @param $q
     * @param paths
     * @param ResourceResponseService
     * @return {{start: startLearning, stop: stopLearning, resume: resumeLearning, status: getStatus, isActive: isActive}}
     * @constructor
     */
    function Learner($http, $q, paths, ResourceResponseService) {

        var service = {
            start: startLearning,
            stop: stopLearning,
            resume: resumeLearning,
            status: getStatus,
            isActive: isActive
        };
        return service;

        //////////

        /**
         * Start the server side learning process of a project
         *
         * @param projectId
         * @param learnConfiguration
         * @return {*}
         */
        function startLearning(projectId, learnConfiguration) {
            return $http.post(paths.api.URL + '/learner/start/' + projectId, learnConfiguration)
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
         * with the thread handling
         *
         * @return {*}
         */
        function stopLearning() {
            return $http.get(paths.api.URL + '/learner/stop/')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
         * so that the ongoing process parameters could be defined
         *
         * @param projectId
         * @param learnConfiguration
         * @return {*}
         */
        function resumeLearning(projectId, testNo, learnConfiguration) {
            return $http.post(paths.api.URL + '/learner/resume/' + projectId + '/' + testNo, learnConfiguration)
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Gets the learner result that includes the hypothesis. make sure isActive() returns true before calling this
         * function
         *
         * @return {*}
         */
        function getStatus() {
            return $http.get(paths.api.URL + '/learner/status/')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * Check if the server is finished learning a project
         *
         * @return {*}
         */
        function isActive() {
            return $http.get(paths.api.URL + '/learner/active')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('ProjectResource', ProjectResource);

    ProjectResource.$inject = ['$http', 'paths', 'ResourceResponseService', '_'];

    /**
     * The resource that handles http call to the API to do CRUD operations on projects
     *
     * @param $http - The $http angular service
     * @param paths - The constant with application paths
     * @param ResourceResponseService
     * @param _ - Lodash
     * @return {Resource}
     * @constructor
     */
    function ProjectResource($http, paths, ResourceResponseService, _) {

        /**
         * The resource object
         *
         * @constructor
         */
        function Resource() {}

        /**
         * Make a GET http request to /rest/projects in order to fetch all existings projects
         *
         * @return {*}
         */
        Resource.prototype.all = function(){
            var _this = this;
            return $http.get(paths.api.URL + '/projects')
                .then(function(response){
                    var projects = [];
                    _.forEach(response.data, function(project){
                        projects.push(_this.build(project));
                    });
                    return projects;
                })
                .catch(ResourceResponseService.fail);
        };

        /**
         * Make a GET http request to /rest/projects/{id} in order to fetch a single project by its id
         *
         * @param id - The id of the project that should be fetched
         * @return {*}
         */
        Resource.prototype.get = function(id){
            var _this = this;
            return $http.get(paths.api.URL + '/projects/' + id)
                .then(function(response){
                    return _this.build(response.data);
                })
                .catch(ResourceResponseService.fail);
        };

        /**
         * Make a POST http request to /rest/projects with a project object as data in order to create a new project
         *
         * @param project - The project that should be created
         * @return {*}
         */
        Resource.prototype.create = function(project){
            var _this = this;
            return $http.post(paths.api.URL + '/projects', project)
                .then(function(response){
                    return _this.build(response.data);
                })
                .catch(ResourceResponseService.fail);
        };

        /**
         * Make a PUT http request to /rest/projects with a project as data in order to update an existing project
         *
         * @param project - The updated instance of a project that should be updated on the server
         * @return {*}
         */
        Resource.prototype.update = function(project){
            var _this = this;
            return $http.put(paths.api.URL + '/projects/' + project.id, project)
                .then(function(response){
                    return _this.build(response.data);
                })
                .catch(ResourceResponseService.fail);
        };

        /**
         * Make a DELETE http request to /rest/projects in order to delete an existing project
         *
         * @param project - The project that should be deleted
         * @return {*}
         */
        Resource.prototype.delete = function(project){
            var _this = this;
            return $http.delete(paths.api.URL + '/projects/' + project.id)
                .then(function(response){
                    return _this.build(response.data);
                })
                .catch(ResourceResponseService.fail);
        };

        /**
         * The function that is called by all other request methods that should create a new instance of a project.
         * Overwrite this method when creating an instance of ProjectResource! Or leave it as it is ...
         *
         * @param data - The object the project should be created from
         * @return {*}
         */
        Resource.prototype.build = function(data) {
            return data;
        };

        return Resource;
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('SymbolResource', [
            '$http', '$q', 'paths', 'ResourceResponseService',
            SymbolResource
        ]);


    /**
     *
     * @param $http
     * @param $q
     * @param paths
     * @param ResourceResponseService
     * @return {{get: getSymbol, getAll: getAllSymbols, getRevisions: getRevisions, recover: recoverSymbol, create: createSymbol, update: updateSymbol, delete: deleteSymbol, deleteSome: deleteSomeSymbols}}
     * @constructor
     */
    function SymbolResource($http, $q, paths, ResourceResponseService) {

        var service = {
            get: getSymbol,
            getAll: getAllSymbols,
            getRevisions: getRevisions,
            recover: recoverSymbol,
            create: createSymbol,
            update: updateSymbol,
            delete: deleteSymbol,
            deleteSome: deleteSomeSymbols
        };
        return service;

        // ////////

        /**
         * get a specific web or rest symbol by its id
         *
         * @param projectId
         * @param symbolId
         * @return {*}
         */
        function getSymbol(projectId, symbolId) {

            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId)
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * get all rest and web symbols of a project by the projects id
         *
         * @param projectId
         * @param options
         * @return {*}
         */
        function getAllSymbols(projectId, options) {

            var queryParams = '?';

            if (options) {

                if (options.type) queryParams += 'type=' + options.type;
                if (options.deleted && options.deleted === true) queryParams += '&visbility=hidden';
                
                return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + queryParams)
                    .then(ResourceResponseService.success)
                    .catch(ResourceResponseService.fail);

            } else {
                return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols')
                    .then(ResourceResponseService.success)
                    .catch(ResourceResponseService.fail);
            }
        }

        /**
         *
         * @param projectId
         * @param symbolId
         * @return {*}
         */
        function recoverSymbol(projectId, symbolId) {
            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/show', {})
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }

        /**
         * create a new symbol
         *
         * @param projectId
         * @param symbol
         * @return {*}
         */
        function createSymbol(projectId, symbol) {

            if (angular.isArray(symbol)) {
                return createSymbols(projectId, symbol)
            }

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols', symbol)
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Symbol ' + response.data.name + ' created';
                return ResourceResponseService.successWithToast(response, message);
            }
        }

        function createSymbols(projectId, symbols) {

            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols', symbols)
                .then(success)
                .catch(fail);

            function success(response) {
                var message = 'Symbols created';
                return ResourceResponseService.successWithToast(response, message);
            }

            function fail(response) {
                var message = 'Upload failed. Some symbols already exist or existed in this project';
                return ResourceResponseService.failWithToast(response, message);
            }
        }

        /**
         * update an existing symbol
         *
         * @param projectId
         * @param symbol
         * @return {*}
         */
        function updateSymbol(projectId, symbol) {
            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id, symbol)
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Symbol "' + response.data.name + '" updated';
                return ResourceResponseService.successWithToast(response, message);
            }
        }

        /**
         * delete an existing symbol
         *
         * @param projectId
         * @param symbolId
         * @return {*}
         */
        function deleteSymbol(projectId, symbolId) {

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/hide')
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Symbol deleted';
                return ResourceResponseService.successWithToast(response, message);
            }
        }

        function deleteSomeSymbols(projectId, symbolsIds) {

            symbolsIds = symbolsIds.join();

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolsIds + '/hide')
                .then(success)
                .catch(ResourceResponseService.fail);

            function success(response) {
                var message = 'Symbols deleted';
                return ResourceResponseService.successWithToast(response, message);
            }
        }

        function getRevisions(projectId, symbolId) {

            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/complete')
                .then(ResourceResponseService.success)
                .catch(ResourceResponseService.fail);
        }
    }
}());;(function(){
	
	angular
		.module('weblearner.services')
		.service('CounterExampleBuilderService', CounterExampleBuilderService);
	
	CounterExampleBuilderService.$inject = ['$rootScope'];
	
	function CounterExampleBuilderService($rootScope) {
		
		var service = {
			open: open,
			close: close,
			ok: ok
		}
		return service;
		
		function open(){
			$rootScope.$broadcast('counterExampleBuilder.open');
		}
		
		function close(){
			$rootScope.$broadcast('counterExampleBuilder.close');
		}
		
		function ok(){
			$rootScope.$broadcast('counterExampleBuilder.ok');
		}
	}
}());(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('EqOracleService', [
            'EqOraclesEnum',
            EqOracleService
        ]);

    function EqOracleService(EqOraclesEnum) {

        var _eqOracleComplete = {
            type: EqOraclesEnum.COMPLETE,
            minDepth: 1,
            maxDepth: 1
        };

        var _eqOracleRandom = {
            type: EqOraclesEnum.RANDOM,
            minLength: 1,
            maxLength: 1,
            maxNoOfTests: 1
        };

        var _eqOracleSample = {
            type: EqOraclesEnum.SAMPLE,
            counterExamples: []
        };

        //////////

        var service = {
            create: create
        };
        return service;

        //////////

        function create(eqOracleType) {
            switch (eqOracleType) {
                case EqOraclesEnum.COMPLETE:
                    return angular.copy(_eqOracleComplete);
                    break;
                case EqOraclesEnum.RANDOM:
                    return angular.copy(_eqOracleRandom);
                    break;
                case EqOraclesEnum.SAMPLE:
                    return angular.copy(_eqOracleSample);
                    break;
                default:
                    return angular.copy(_eqOracleRandom);
                    break;
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('LoadScreenService', [
            '$rootScope',
            LoadScreenService
        ]);

    /**
     * LoadScreenService
     *
     * The service that is used to communicate with the load screen directive in order to tell it to show or hide
     *
     * @param $rootScope
     * @return {{show: show, hide: hide}}
     * @constructor
     */
    function LoadScreenService($rootScope) {

        // the service
        var service = {
            show: show,
            hide: hide
        };
        return service;

        //////////

        /**
         * Emit the event that indicates that the load screen should be displayed
         */
        function show() {
            $rootScope.$broadcast('loadScreen.show');
        }

        /**
         * Emit the event that indicates that the load screen should not be displayed
         */
        function hide() {
            $rootScope.$broadcast('loadScreen.hide');
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .service('PromptService', PromptService);

    PromptService.$inject = ['$modal', 'paths'];

    /**
     * PromptService
     *
     * The service that can be called to replace window.prompt() with some more options.
     *
     * @param $modal
     * @return {{prompt: prompt}}
     * @constructor
     */
    function PromptService($modal, paths) {

        var service = {
            prompt: prompt,
            confirm: confirm
        };
        return service;

        //////////

        /**
         * Open the prompt dialog.
         *
         * @param text {string} - The text to display
         * @param options {{regexp: string, errorMsg: string}}
         * @return {*} - The modal result promise
         */
        function prompt(text, options) {

            var modal = $modal.open({
                templateUrl: paths.views.MODALS + '/modal-prompt-dialog.html',
                controller: 'PromptDialogController',
                resolve: {
                    modalData: function () {
                        return {
                            text: text,
                            regexp: options.regexp,
                            errorMsg: options.errorMsg
                        };
                    }
                }
            });

            return modal.result;
        }
        
        /**
         * Open the confirm dialog
         * 
         * @param text - The text to be displayed
         */
        function confirm(text) {

            var modal = $modal.open({
                templateUrl: paths.views.MODALS + '/modal-confirm-dialog.html',
                controller: 'ConfirmDialogController',
                resolve: {
                    modalData: function () {
                        return {
                            text: text
                        };
                    }
                }
            });

            return modal.result;
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('ResourceResponseService', [
            '$q', 'ngToast',
            ResourceResponseService
        ]);

    function ResourceResponseService($q, ngToast) {

        var service = {
            success: success,
            successWithToast: successWithToast,
            fail: fail,
            failWithoutToast: failWithoutToast,
            failWithToast: failWithToast
        };
        return service;

        //////////

        function success(response) {
            return response.data;
        }

        function successWithToast(response, message) {
            ngToast.create({
                class: 'success',
                content: message
            });
            return response.data;
        }

        function fail(response) {
            console.error(response.data);
            return failWithToast(response, response.data);
        }

        function failWithToast(response, message) {
            console.error(response.data);
            ngToast.create({
                class: 'danger',
                content: message,
                dismissButton: true
            });
            return $q.reject();
        }

        function failWithoutToast(response) {
            console.error(response.data);
            return $q.reject();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('SelectionService', SelectionService);

    /**
     * SelectionService
     *
     * The Service that is used in this application to mark javascript objects as selected by the user. There are
     * filters, controllers & directives that make use of this service, but I don't want to list them all here... yet.
     *
     * @return {{getSelected: getSelected, select: select, deselect: deselect, selectAll: selectAll, deselectAll: deselectAll, removeSelection: removeSelection, isSelected: isSelected, getPropertyName: *}}
     * @constructor
     */
    function SelectionService() {

        /**
         * The property whose value determines whether an object is selected or not.
         *
         * @type {string}
         * @private
         */
        var _propertyName = "_selected";

        //////////

        // the service
        var service = {
            getSelected: getSelected,
            select: select,
            deselect: deselect,
            selectAll: selectAll,
            deselectAll: deselectAll,
            removeSelection: removeSelection,
            isSelected: isSelected,
            getPropertyName: getPropertyName()
        };
        return service;

        //////////

        /**
         * Filters all objects where the property '_selected' doesn't exists or is false.
         *
         * @param items
         * @return {Array}
         */
        function getSelected(items) {
            return _.filter(items, function (item) {
                return item[_propertyName] == true;
            });
        }

        /**
         * Sets the selected flag for an object to true.
         *
         * @param item
         */
        function select(item) {
            item[_propertyName] = true;
        }

        /**
         * Sets the selected flag for an object to false.
         *
         * @param item
         */
        function deselect(item) {
            item[_propertyName] = false
        }

        /**
         * Selects all items.
         *
         * @param items
         */
        function selectAll(items) {
            _.forEach(items, select)
        }

        /**
         * Deselects all items
         *
         * @param items
         */
        function deselectAll(items) {
            _.forEach(items, deselect)
        }

        /**
         * Removes the property '_selected' from all items.
         *
         * @param items
         */
        function removeSelection(items) {
            if (!angular.isArray(items)) {
                items = [items];
            }
            _.forEach(items, function (item) {
                delete item[_propertyName];
            })
        }

        /**
         * Checks if the property '_selected' exists and what value it has.
         *
         * @param item
         * @return boolean
         */
        function isSelected(item) {
            return angular.isUndefined(item._selected) ? false : item._selected;
        }

        /**
         * Get the name of the property whose value marks an object as selected.
         *
         * @return {string}
         */
        function getPropertyName() {
            return _propertyName;
        }
    }
}());;(function(){
    'use strict';

    angular
        .module('weblearner.services')
        .factory('SessionService', SessionService);

    SessionService.$inject = ['$rootScope', 'Project'];

    /**
     * SessionService
     *
     * The session that is used in this application to save data in the session storage of the browser to store data in
     * between page refreshes in the same tab. So the project doesn't have to be fetched from the server every time the
     * page refreshes
     *
     * @param $rootScope
     * @return {{project: {get: getProject, save: saveProject, remove: removeProject}}}
     * @constructor
     */
    function SessionService($rootScope, Project) {

        // the service
        var service = {
            project: {
                get: getProject,
                save: saveProject,
                remove: removeProject
            }
        };
        return service;

        //////////

        /**
         * Get the stored project object from the session storage
         *
         * @return {ProjectModel.Project}
         */
        function getProject() {
            var project = angular.fromJson(sessionStorage.getItem('project'));
            return project === null ? null : Project.build(project);
        }

        /**
         * Save a project into the session storage end emit the 'project.opened' event
         *
         * @param project
         */
        function saveProject(project) {
            sessionStorage.setItem('project', angular.toJson(project));
            $rootScope.$broadcast('project.opened');
        }

        /**
         * Remove the stored project from session storage an emit the 'project.closed' event
         */
        function removeProject() {
            sessionStorage.removeItem('project');
            $rootScope.$broadcast('project.closed');
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .service('TestResultsChartService', TestResultsChartService);

    /**
     * @return {{createChartDataFromMultipleTestResults: createChartDataFromMultipleTestResults, createChartDataFromSingleCompleteTestResult: createChartDataFromSingleCompleteTestResult}}
     * @constructor
     */
    function TestResultsChartService() {

        var chartProperties = {
            AMOUNT_OF_SYMBOLS: 0,
            DURATION: 1,
            AMOUNT_OF_RESETS: 2
        };

        var service = {
            createChartDataFromMultipleTestResults: createChartDataFromMultipleTestResults,
            createChartDataFromSingleCompleteTestResult: createChartDataFromSingleCompleteTestResult,
            chartProperties: chartProperties
        };
        return service;

        //////////

        /**
         * Create a chart.js conform dataset for a line or a bar chart
         *
         * @param label
         * @param data
         * @return {{label: *, fillColor: string, strokeColor: string, pointColor: string, pointStrokeColor: string, pointHighlightFill: string, pointHighlightStroke: string, data: *}}
         * @private
         */
        function _createDataSet(label, data) {

            var dataSet = {
                label: label,
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: data
            };
            return dataSet;
        }

        //////////

        /**
         * @param results
         * @return {{labels: Array, datasets: *[]}}
         */
        function createChartDataFromMultipleTestResults(results) {

            var chartData = {
                labels: [],
                datasets: [
                    _createDataSet('Symbols', []),
                    _createDataSet('Duration', []),
                    _createDataSet('Resets', [])
                ]
            };

            _.forEach(results, function (result) {
                chartData.labels.push('Test ' + result.testNo);
                chartData.datasets[chartProperties.AMOUNT_OF_SYMBOLS]
                    .data.push(result.sigma.length);
                chartData.datasets[chartProperties.DURATION]
                    .data.push(result.duration);
                chartData.datasets[chartProperties.AMOUNT_OF_RESETS]
                    .data.push(result.amountOfResets);
            });

            return chartData;
        }

        /**
         * @param results
         * @return {{labels: Array, datasets: *[]}}
         */
        function createChartDataFromSingleCompleteTestResult(results) {

            var chartData = {
                labels: [],
                datasets: [
                    _createDataSet('Symbols', []),
                    _createDataSet('Duration', []),
                    _createDataSet('Resets', [])
                ]
            };

            _.forEach(results, function (result) {
                chartData.labels.push('Step ' + result.stepNo);
                chartData.datasets[chartProperties.AMOUNT_OF_SYMBOLS]
                    .data.push(result.sigma.length);
                chartData.datasets[chartProperties.DURATION]
                    .data.push(result.duration);
                chartData.datasets[chartProperties.AMOUNT_OF_RESETS]
                    .data.push(result.amountOfResets);
            });

            return chartData;
        }
    }
}());
;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('WebElementPickerService', [
            '$rootScope',
            WebElementPickerService
        ]);

    /**
     * WebElementPickerService
     *
     * The service that is used to communicate with the webElementPicker directive.
     *
     * @param $rootScope
     * @return {{open: open, close: close, ok: ok}}
     * @constructor
     */
    function WebElementPickerService($rootScope) {

        // the service
        var service = {
            open: open,
            close: close,
            ok: ok
        };
        return service;

        //////////

        /**
         * Tell the webElementPicker to be displayed. Listen to the 'webElementPicker.open' event to get notified when
         * the webElementPicker gets closed.
         */
        function open() {
            $rootScope.$broadcast('webElementPicker.open');
        }

        /**
         * Tell the webElementPicker to hide. Listen to the 'webElementPicker.close' event to get notified when the
         * webElementPicker gets closed.
         */
        function close() {
            $rootScope.$broadcast('webElementPicker.close');
        }

        /**
         * The webElementPicker calls this function with a parameter {url: .., selector: ...} when the user selected
         * an element and clicks on the 'ok' button.
         *
         * @param data
         */
        function ok(data) {
            $rootScope.$broadcast('webElementPicker.ok', data);
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('first', first);

    /**
     * Returns the first element of an array.
     *
     * @return {Function}
     */
    function first() {
        return function (items) {
            if (angular.isArray(items) && items.length > 0) {
                return _.first(items);
            } else {
                return undefined;
            }
        }
    }
}());;(function () {
    'use strict';

    // nice names for learnAlgorithms
    // nice names for web and rest actions

    angular
        .module('weblearner.filters')
        .filter('niceEqOracleName', [
            'EqOraclesEnum',
            niceEqOracleName
        ]);

    function niceEqOracleName(EqOraclesEnum) {
        return function (eqOracleType) {
            switch (eqOracleType) {
                case EqOraclesEnum.COMPLETE:
                    return 'Complete';
                    break;
                case EqOraclesEnum.RANDOM:
                    return 'Random';
                    break;
                case  EqOraclesEnum.SAMPLE:
                    return 'Manual';
                    break;
                default :
                    return '';
                    break;
            }
        }
    }

    angular
        .module('weblearner.filters')
        .filter('niceLearnAlgorithmName', [
            'LearnAlgorithmsEnum',
            niceLearnAlgorithmName
        ]);

    function niceLearnAlgorithmName(LearnAlgorithmsEnum) {
        return function (algorithm) {
            switch (algorithm) {
                case LearnAlgorithmsEnum.DHC:
                    return 'DHC';
                    break;
                case LearnAlgorithmsEnum.EXTENSIBLE_LSTAR:
                    return 'L*';
                    break;
                case LearnAlgorithmsEnum.DISCRIMINATION_TREE:
                    return 'Discrimination Tree';
                    break;
                default :
                    return '';
                    break;
            }
        }
    }

}());;(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('selected', [
            'SelectionService',
            selected
        ]);

    /**
     * Filters an array of items and returns the selected ones.
     *
     * @param SelectionService
     * @return {Function}
     */
    function selected(SelectionService) {
        return function (items) {
            return _.filter(items, function (item) {
                return SelectionService.isSelected(item);
            })
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.filters')
        .filter('capitalize', capitalize);

    function capitalize() {
        return function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
}());;(function() {
	'use strict';

	angular.module('weblearner.filters')
		.filter('typeOfRest', typeOfRest)
		.filter('typeOfWeb', typeOfWeb);

	/**
	 * The filter that takes an array of objects and returns only those with a
	 * property 'type' with the value 'rest'
	 * 
	 * @return {Function}
	 */
	function typeOfRest() {
		return function(list) {
			return _.filter(list, {
				type : 'rest'
			})
		}
	}

	/**
	 * The filter that takes an array of objects and returns only those with a
	 * property 'type' with the value 'web'
	 * 
	 * @return {Function}
	 */
	function typeOfWeb() {
		return function(list) {
			return _.filter(list, {
				type : 'web'
			})
		}
	}
}());