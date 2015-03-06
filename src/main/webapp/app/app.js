(function () {
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
            'n3-line-chart',

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
        .config(['ngToastProvider', function (ngToastProvider) {
            ngToastProvider.configure({
                verticalPosition: 'top',
                horizontalPosition: 'center',
                maxNumber: 1
            });
        }])
        .run(['$rootScope', '_', 'SelectionService', function ($rootScope, _, SelectionService) {
            $rootScope._ = _;
            $rootScope.selection = SelectionService;
        }])
}());;angular.module('templates-all', ['app/views/directives/counter-example-builder.html', 'app/views/directives/hypothesis-panel.html', 'app/views/directives/hypothesis.html', 'app/views/directives/learner-result-chart-multiple-final.html', 'app/views/directives/load-screen.html', 'app/views/directives/navigation.html', 'app/views/directives/observation-table.html', 'app/views/directives/rest-action-edit-form.html', 'app/views/directives/web-action-edit-form.html', 'app/views/directives/web-element-picker.html', 'app/views/modals/action-create-modal.html', 'app/views/modals/action-edit-modal.html', 'app/views/modals/hypothesis-layout-settings-modal.html', 'app/views/modals/learn-setup-settings-modal.html', 'app/views/modals/modal-confirm-dialog.html', 'app/views/modals/modal-prompt-dialog.html', 'app/views/modals/modal-test-details.html', 'app/views/modals/symbol-create-modal.html', 'app/views/modals/symbol-edit-modal.html', 'app/views/modals/symbol-group-create-modal.html', 'app/views/modals/symbol-group-edit-modal.html', 'app/views/modals/symbol-move-modal.html', 'app/views/pages/about.html', 'app/views/pages/help.html', 'app/views/pages/home.html', 'app/views/pages/learn-results-compare.html', 'app/views/pages/learn-results-statistics.html', 'app/views/pages/learn-results.html', 'app/views/pages/learn-setup.html', 'app/views/pages/learn-start.html', 'app/views/pages/project-create.html', 'app/views/pages/project-settings.html', 'app/views/pages/project.html', 'app/views/pages/symbols-actions.html', 'app/views/pages/symbols-export.html', 'app/views/pages/symbols-history.html', 'app/views/pages/symbols-import.html', 'app/views/pages/symbols-trash.html', 'app/views/pages/symbols.html', 'app/views/pages/tools-hypotheses-view.html', 'app/views/widgets/widget-counter-examples.html', 'app/views/widgets/widget-test-resume-settings.html']);

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

angular.module("app/views/directives/learner-result-chart-multiple-final.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/learner-result-chart-multiple-final.html",
    "<div id=\"learn-result-chart\">\n" +
    "    <linechart data=\"dataSets\" options=\"options\" mode=\"\" width=\"\" height=\"500\"></linechart>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <button class=\"btn btn-xs\"\n" +
    "                ng-class=\"selectedMode === modes.RESETS ? 'btn-primary':'btn-default'\"\n" +
    "                ng-click=\"selectedMode = modes.RESETS\">\n" +
    "            #Resets\n" +
    "        </button>\n" +
    "        <button class=\"btn btn-xs\"\n" +
    "                ng-class=\"selectedMode === modes.SYMBOLS ? 'btn-primary':'btn-default'\"\n" +
    "                ng-click=\"selectedMode = modes.SYMBOLS\">\n" +
    "            #Symbols\n" +
    "        </button>\n" +
    "        <button class=\"btn btn-xs\"\n" +
    "                ng-class=\"selectedMode === modes.DURATION ? 'btn-primary':'btn-default'\"\n" +
    "                ng-click=\"selectedMode = modes.DURATION\">\n" +
    "            Duration\n" +
    "        </button>\n" +
    "    </div>\n" +
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
    "<nav class=\"navbar navbar-application navbar-fixed-top\" role=\"navigation\">\n" +
    "\n" +
    "    <div class=\"container-fluid\">\n" +
    "\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <a class=\"navbar-brand\" ui-sref=\"home\"><strong>Wl</strong></a>\n" +
    "        </div>\n" +
    "\n" +
    "        <ul class=\"nav navbar-nav navbar-left navbar-menu-handle\">\n" +
    "            <li>\n" +
    "                <a href=\"#\">\n" +
    "                    <i class=\"fa fa-fw fa-bars\"></i> Menu\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"navbar-offscreen\">\n" +
    "\n" +
    "            <div class=\"navbar-offscreen-header\">\n" +
    "                <a href class=\"pull-right navbar-menu-handle\">\n" +
    "                    <i class=\"fa fa-close\" style=\"color: #fff\"></i>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-if=\"!project\">\n" +
    "\n" +
    "                <ul class=\"nav navbar-nav navbar-left\">\n" +
    "                    <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                        <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                           aria-expanded=\"false\">\n" +
    "                            <span>Project</span>\n" +
    "                            <span class=\"caret\"></span>\n" +
    "                        </a>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\" ng-if=\"!project\">\n" +
    "                            <li><a ui-sref=\"project.create\">Create a new project</a></li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-if=\"project\">\n" +
    "\n" +
    "                <ul class=\"nav navbar-nav navbar-left\">\n" +
    "                    <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                        <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                           aria-expanded=\"false\">\n" +
    "                            <strong ng-bind=\"project.name\"></strong>\n" +
    "                            <span class=\"caret\"></span>\n" +
    "                        </a>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\" ng-if=\"project\">\n" +
    "                            <li><a class=\"disabled\" ui-sref=\"project\">Overview</a></li>\n" +
    "                            <li><a ui-sref=\"project.settings\">Settings</a></li>\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li><a href=\"#/\" ng-click=\"closeProject()\">Close</a></li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <ul class=\"nav navbar-nav navbar-left\">\n" +
    "                    <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                        <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                           aria-expanded=\"false\">Symbols <span class=\"caret\"></span></a>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                            <li><a ui-sref=\"symbols\">Manage Symbols</a></li>\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li><a ui-sref=\"symbols.import\">Import</a></li>\n" +
    "                            <li><a ui-sref=\"symbols.export\">Export</a></li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <ul class=\"nav navbar-nav navbar-left\">\n" +
    "                    <li>\n" +
    "                        <a href=\"#\" ui-sref=\"learn.setup\" role=\"button\"\n" +
    "                           aria-expanded=\"false\">Learn </a>\n" +
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
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav navbar-right\">\n" +
    "                <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                    <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                       aria-expanded=\"false\">App <span class=\"caret\"></span></a>\n" +
    "                    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
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
    "\n" +
    "</nav>\n" +
    "");
}]);

angular.module("app/views/directives/observation-table.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/observation-table.html",
    "");
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
    "    <h3 class=\"modal-title\">Create Action</h3>\n" +
    "    <span class=\"text-muted\">Create a new action for a symbol</span>\n" +
    "</div>\n" +
    "\n" +
    "<form ng-submit=\"createAction()\" id=\"action-create-form\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-xs-5\">\n" +
    "\n" +
    "                <accordion close-others=\"true\" class=\"action-types-accordion\">\n" +
    "                    <accordion-group heading=\"Web\" is-open=\"true\">\n" +
    "                        <a href ng-repeat=\"(k,v) in actionTypes.web\" ng-click=\"selectNewActionType(v)\"\n" +
    "                           ng-bind=\"::(k|formatEnumKey)\"></a>\n" +
    "                    </accordion-group>\n" +
    "                    <accordion-group heading=\"Rest\">\n" +
    "                        <a href ng-repeat=\"(k,v) in actionTypes.rest\" ng-click=\"selectNewActionType(v)\"\n" +
    "                           ng-bind=\"::(k|formatEnumKey)\"></a>\n" +
    "                    </accordion-group>\n" +
    "                    <accordion-group heading=\"Other\">\n" +
    "                        <a href ng-repeat=\"(k,v) in actionTypes.other\" ng-click=\"selectNewActionType(v)\"\n" +
    "                           ng-bind=\"::(k|formatEnumKey)\"></a>\n" +
    "                    </accordion-group>\n" +
    "                </accordion>\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-7\">\n" +
    "\n" +
    "                <div class=\"alert alert-info alert-condensed\" ng-show=\"action === null\">\n" +
    "                    Please select an action type\n" +
    "                </div>\n" +
    "\n" +
    "                <!-- BEGIN: SEARCH_FOR_TEXT -->\n" +
    "                <div ng-if=\"action.type === actionTypes.web.SEARCH_FOR_TEXT\">\n" +
    "\n" +
    "                    <h4><strong>Search for Text</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Search on a page for a piece of text or a regular expression\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">Value</label>\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.value\">\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"action.regexp\"> Use Regular Expression\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\"\n" +
    "                            selector=\"action.value\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </button>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: SEARCH_FOR_TEXT -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: SEARCH_FOR_NODE -->\n" +
    "                <div ng-if=\"action.type === actionTypes.web.SEARCH_FOR_NODE\">\n" +
    "\n" +
    "                    <h4><strong>Search for Node</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Search an HTML element in the DOM tree of a page\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">CSS selector</label>\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.value\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\"\n" +
    "                            selector=\"action.value\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </button>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: SEARCH_FOR_NODE -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: CLEAR -->\n" +
    "                <div ng-if=\"action.type === actionTypes.web.CLEAR\">\n" +
    "\n" +
    "                    <h4><strong>Clear Node</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Clear an element (eg. input or contenteditable element)\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">CSS selector</label>\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\"\n" +
    "                            selector=\"action.node\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </button>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: CLEAR -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: CLICK -->\n" +
    "                <div ng-if=\"action.type === actionTypes.web.CLICK\">\n" +
    "\n" +
    "                    <h4><strong>Click</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Click on an element\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">CSS selector</label>\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "                    </div>\n" +
    "                    <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\"\n" +
    "                            selector=\"action.node\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </button>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: CLICK -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: FILL -->\n" +
    "                <div ng-if=\"action.type === actionTypes.web.FILL\">\n" +
    "\n" +
    "                    <h4><strong>Fill Node</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Fill an element with content (eg. input or contenteditable element)\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">CSS selector</label>\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">The value to fill the element with</label>\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.generator\">\n" +
    "                    </div>\n" +
    "                    <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\"\n" +
    "                            selector=\"action.node\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </button>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: FILL -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: GO_TO -->\n" +
    "                <div ng-if=\"action.type === actionTypes.web.GO_TO\">\n" +
    "\n" +
    "                    <h4><strong>Go to URL</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Go to a url that is <strong>relative</strong> to your projects' base url\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">Url</label>\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: GO_TO -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: SUBMIT -->\n" +
    "                <div ng-if=\"action.type === actionTypes.web.SUBMIT\">\n" +
    "\n" +
    "                    <h4><strong>Submit Form</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Submit a form\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\">CSS selector</label>\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "                    </div>\n" +
    "                    <button class=\"btn btn-default btn-sm\" open-web-element-picker url=\"action.url\"\n" +
    "                            selector=\"action.node\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </button>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: SUBMIT -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: CALL_URL -->\n" +
    "                <div ng-if=\"action.type === actionTypes.rest.CALL_URL\">\n" +
    "\n" +
    "                    <h4><strong>Call Url</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">Make a HTTP request to an URL (relative to your projects base url)</p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <select class=\"form-control\" ng-options=\"m for m in ['DELETE', 'GET', 'POST', 'PUT']\"\n" +
    "                                ng-model=\"action.method\">\n" +
    "                            <option value=\"\" disabled>Select a Method</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label>Data</label>\n" +
    "\n" +
    "                        <div ng-model=\"action.data\"\n" +
    "                             style=\"border-radius: 4px; width: 100%; height: 150px; border: 1px solid #ccc\"\n" +
    "                             ui-ace=\"{useWrapMode : true, showGutter: true, theme:'eclipse', mode: 'json'}\"></div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: CALL_URL -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "                <div ng-if=\"action.type === actionTypes.rest.CHECK_ATTRIBUTE_EXISTS\">\n" +
    "\n" +
    "                    <h4><strong>Check Attribute Exists</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">Check if a JSON attribute exists in the response body</p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\"\n" +
    "                               ng-model=\"action.attribute\">\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: CHECK_ATTRIBUTE_TYPE -->\n" +
    "                <div ng-if=\"action.type === actionTypes.rest.CHECK_ATTRIBUTE_TYPE\">\n" +
    "\n" +
    "                    <h4><strong>Check Attribute Type</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">Check if a JSON attribute in the response body has a specific type</p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\"\n" +
    "                               ng-model=\"action.attribute\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <select class=\"form-control\" ng-model=\"action.jsonType\"\n" +
    "                                ng-options=\"t as t for t in ['ARRAY', 'BOOLEAN', 'INTEGER', 'OBJECT', 'NULL', 'STRING']\">\n" +
    "                            <option value=\"\" disabled>Choose a JavaScript type</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: CHECK_ATTRIBUTE_TYPE -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: CHECK_ATTRIBUTE_VALUE -->\n" +
    "                <div ng-if=\"action.type === actionTypes.rest.CHECK_ATTRIBUTE_VALUE\">\n" +
    "\n" +
    "                    <h4><strong>Check Attribute Value</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">Check a JSON attribute of the response body to be a specific value</p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\"\n" +
    "                               ng-model=\"action.attribute\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"the attribute value\"\n" +
    "                               ng-model=\"action.value\">\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"action.regexp\"> is regular expression\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: CHECK_ATTRIBUTE_VALUE -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: CHECK_HEADER_FIELD -->\n" +
    "                <div ng-if=\"action.type === actionTypes.rest.CHECK_HEADER_FIELD\">\n" +
    "\n" +
    "                    <h4><strong>Check Header Field</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">Check a HTTP response header field to have a specific value</p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"http header field, e.g. Content-Type\"\n" +
    "                               ng-model=\"action.key\">\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" type=\"text\"\n" +
    "                               placeholder=\"http header field value, e.g. application/json\" ng-model=\"action.value\">\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"action.regexp\">is regular expression\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: CHECK_HEADER_FIELD -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: CHECK_HTTP_BODY_TEXT -->\n" +
    "                <div ng-if=\"action.type === actionTypes.rest.CHECK_HTTP_BODY_TEXT\">\n" +
    "\n" +
    "                    <h4><strong>Check HTTP Body Text</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">Search for a string or a regular express in the response body of a request</p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"value to search for\"\n" +
    "                               ng-model=\"action.value\">\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"action.regexp\">\n" +
    "                            is regular expression\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: CHECK_HTTP_BODY_TEXT -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: CHECK_STATUS -->\n" +
    "                <div ng-if=\"action.type === actionTypes.rest.CHECK_STATUS\">\n" +
    "\n" +
    "                    <h4><strong>Check Status</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">Check the HTTP response to have a specific status</p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <label>HTTP Status</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" type=\"number\" placeholder=\"e.g. 200, 404 ...\"\n" +
    "                               ng-model=\"action.status\">\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <!-- END: CHECK_STATUS -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: WAIT -->\n" +
    "                <div ng-if=\"action.type === actionTypes.other.WAIT\">\n" +
    "                    <h4><strong>Wait</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Wait for a specified amount of time in ms.\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "\n" +
    "                    <label>Duration</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"number\" class=\"form-control\" min=\"0\" ng-model=\"action.duration\" placeholder=\"0\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- END: WAIT -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: DECLARE_COUNTER -->\n" +
    "                <div ng-if=\"action.type === actionTypes.other.DECLARE_COUNTER\">\n" +
    "                    <h4><strong>Declare Counter</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Declare a counter variable that can be used in other actions\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "                    <label>Name</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                               placeholder=\"The name of the counter\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- END: DECLARE_COUNTER -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: DECLARE_VARIABLE -->\n" +
    "                <div ng-if=\"action.type === actionTypes.other.DECLARE_VARIABLE\">\n" +
    "                    <h4><strong>Declare Variable</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Declare a variable that can be used in other actions\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "                    <label>Name</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                               placeholder=\"The name of the variable\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- END: DECLARE_VARIABLE -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: INCREMENT_COUNTER -->\n" +
    "                <div ng-if=\"action.type === actionTypes.other.INCREMENT_COUNTER\">\n" +
    "                    <h4><strong>Increment Counter</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Increment an <strong>already declared</strong> counter variable\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "                    <label>Name</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                               placeholder=\"The name of the counter\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- END: INCREMENT_COUNTER -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: SET_COUNTER -->\n" +
    "                <div ng-if=\"action.type === actionTypes.other.SET_COUNTER\">\n" +
    "                    <h4><strong>Set Counter</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Set the value of an <strong>already declared</strong> counter variable\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "                    <label>Name</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                               placeholder=\"The name of the counter\">\n" +
    "                    </div>\n" +
    "                    <label>Value</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"number\" class=\"form-control\" ng-model=\"action.value\" placeholder=\"0\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- END: SET_COUNTER -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: SET_VARIABLE -->\n" +
    "                <div ng-if=\"action.type === actionTypes.other.SET_VARIABLE\">\n" +
    "                    <h4><strong>Set Variable</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Set the value of an <strong>already declared</strong> variable\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "                    <label>Name</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                               placeholder=\"The name of the variable\">\n" +
    "                    </div>\n" +
    "                    <label>Value</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" ng-model=\"action.value\" placeholder=\"The value of the variable\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- END: SET_VARIABLE -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: SET_VARIABLE_BY_JSON_ATTRIBUTE -->\n" +
    "                <div ng-if=\"action.type === actionTypes.other.SET_VARIABLE_BY_JSON_ATTRIBUTE\">\n" +
    "                    <h4><strong>Set Variable By JSON Attribute</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Set the value of an <strong>already declared</strong> variable to the content of a JSON\n" +
    "                        attribute\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "                    <label>Name</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                               placeholder=\"The name of the variable\">\n" +
    "                    </div>\n" +
    "                    <label>Attribute</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" ng-model=\"action.value\" placeholder=\"The JSON attribute\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- END: SET_VARIABLE_BY_JSON_ATTRIBUTE -->\n" +
    "\n" +
    "\n" +
    "                <!-- BEGIN: SET_VARIABLE_BY_NODE -->\n" +
    "                <div ng-if=\"action.type === actionTypes.other.SET_VARIABLE_BY_NODE\">\n" +
    "                    <h4><strong>Set Variable By Node Value</strong></h4>\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        Set the value of an <strong>already declared</strong> variable to the content of a HTML element\n" +
    "                    </p>\n" +
    "                    <hr>\n" +
    "                    <label>Name</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                               placeholder=\"The name of the variable\">\n" +
    "                    </div>\n" +
    "                    <label>XPath</label>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <input class=\"form-control\" ng-model=\"action.value\" placeholder=\"The CSS3 XPath to the element\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- END: SET_VARIABLE_BY_JSON_ATTRIBUTE -->\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary btn-sm\" type=\"submit\">Create</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
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
    "    <h3 class=\"modal-title\">Update Action</h3>\n" +
    "    <span class=\"text-muted\">Update an existing action for a symbol</span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
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

angular.module("app/views/modals/learn-setup-settings-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/learn-setup-settings-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"closeModal()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "    <h3 class=\"modal-title\">Test Settings</h3>\n" +
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
    "                                                           ng-model=\"selectedEqOracle\"\n" +
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
    "        <button class=\"btn btn-primary\" type=\"submit\">Ok</button>\n" +
    "	</div>\n" +
    "\n" +
    "</form>");
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

angular.module("app/views/modals/symbol-create-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/symbol-create-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"closeModal()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "    <h3 class=\"modal-title\">Create a Symbol</h3>\n" +
    "    <span class=\"text-muted\">Create a new symbol</span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<form id=\"symbol-create-form\" name=\"create_symbol_form\" ng-submit=\"createSymbol()\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>Symbol Name</label>\n" +
    "            <input class=\"form-control\" name=\"name\" type=\"text\" placeholder=\"name\" required ng-model=\"symbol.name\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\"\n" +
    "             ng-show=\"create_symbol_form.name.$dirty && create_symbol_form.name.$invalid\">\n" +
    "            <small ng-show=\"create_symbol_form.name.$error.required\"> The field must not be empty.</small>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>Symbol Abbreviation</label>\n" +
    "            <input class=\"form-control\" name=\"abbreviation\" type=\"text\" placeholder=\"abbreviation\" required\n" +
    "                   ng-model=\"symbol.abbreviation\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\"\n" +
    "             ng-show=\"create_symbol_form.abbreviation.$dirty && create_symbol_form.abbreviation.$invalid\">\n" +
    "            <small ng-show=\"create_symbol_form.abbreviation.$error.required\"> The field must not be empty.</small>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>Group</label>\n" +
    "            <input class=\"form-control\" type=\"text\" list=\"groupNames\" ng-model=\"selectedGroup\" placeholder=\"Group name\">\n" +
    "            <datalist id=\"groupNames\">\n" +
    "                <option ng-repeat=\"group in groups\" value=\"{{group.name}}\"></option>\n" +
    "            </datalist>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary\" type=\"submit\">Create Symbol</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
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
    "    <h3 class=\"modal-title\">Update a Symbol</h3>\n" +
    "    <span class=\"text-muted\">Update an existing symbol</span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<form id=\"symbol-edit-form\" name=\"symbol_edit_form\" ng-submit=\"updateSymbol()\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>Symbol Name</label>\n" +
    "            <input class=\"form-control\" name=\"name\" type=\"text\" placeholder=\"name\" required ng-model=\"symbol.name\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\"\n" +
    "             ng-show=\"symbol_edit_form.name.$dirty && symbol_edit_form.name.$invalid\">\n" +
    "            <small ng-show=\"symbol_edit_form.name.$error.required\"> The field must not be empty.</small>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>Symbol Abbreviation</label>\n" +
    "            <input class=\"form-control\" name=\"abbreviation\" type=\"text\" placeholder=\"abbreviation\" required\n" +
    "                   ng-model=\"symbol.abbreviation\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\"\n" +
    "             ng-show=\"symbol_edit_form.abbreviation.$dirty && symbol_edit_form.abbreviation.$invalid\">\n" +
    "            <small ng-show=\"symbol_edit_form.abbreviation.$error.required\"> The field must not be empty.</small>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary\" type=\"submit\">Update Symbol</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/modals/symbol-group-create-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/symbol-group-create-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"closeModal()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "    <h3 class=\"modal-title\">Create a Symbol Group</h3>\n" +
    "    <span class=\"text-muted\">Create a new symbol group</span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<form id=\"symbol-group-create-form\" name=\"create_symbol_group_form\" ng-submit=\"createGroup()\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>Symbol Group Name</label>\n" +
    "            <input class=\"form-control\" name=\"name\" type=\"text\" placeholder=\"name\" required ng-model=\"group.name\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\"\n" +
    "             ng-show=\"create_symbol_group_form.name.$dirty && create_symbol_group_form.name.$invalid\">\n" +
    "            <small ng-show=\"create_symbol_group_form.name.$error.required\"> The field must not be empty.</small>\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"groupExists\">\n" +
    "            <small>\n" +
    "                There is already a symbol group with the name \"<strong ng-bind=\"group.name\"></strong>\". Please choose\n" +
    "                another one.\n" +
    "            </small>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary\" type=\"submit\">Create Symbol Group</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/modals/symbol-group-edit-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/symbol-group-edit-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"closeModal()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "    <h3 class=\"modal-title\">Update a Symbol Group</h3>\n" +
    "    <span class=\"text-muted\">Update or delete a symbol group</span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<form id=\"symbol-group-edit-form\" name=\"create_symbol_edit_form\" ng-submit=\"updateGroup()\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <label>Symbol Group Name</label>\n" +
    "            <input class=\"form-control\" name=\"name\" type=\"text\" placeholder=\"name\" required ng-model=\"group.name\">\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\"\n" +
    "             ng-show=\"create_symbol_group_form.name.$dirty && create_symbol_group_form.name.$invalid\">\n" +
    "            <small ng-show=\"create_symbol_group_form.name.$error.required\"> The field must not be empty.</small>\n" +
    "        </div>\n" +
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"groupExists\">\n" +
    "            <small>\n" +
    "                There is already a symbol group with the name \"<strong ng-bind=\"group.name\"></strong>\". Please choose\n" +
    "                another one.\n" +
    "            </small>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <a href class=\"btn btn-default\" ng-if=\"group.id !== 0\" ng-click=\"deleteGroup()\">Delete</a>\n" +
    "        <button class=\"btn btn-primary\" type=\"submit\">Update</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/modals/symbol-move-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/symbol-move-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"closeModal()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "    <h3 class=\"modal-title\">Move Symbols</h3>\n" +
    "    <span class=\"text-muted\">Move Symbols into another group</span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <div class=\"alert alert-info alert-condensed\">\n" +
    "        <span ng-bind=\"symbols.length\"></span> symbols selected\n" +
    "    </div>\n" +
    "\n" +
    "    <ul class=\"list-group\" style=\"margin-bottom: 0\">\n" +
    "        <li class=\"list-group-item\" ng-repeat=\"group in groups\"\n" +
    "            ng-class=\"selectedGroup === group ? 'active': ''\"\n" +
    "            ng-click=\"selectGroup(group)\">\n" +
    "            <span class=\"label label-default pull-right\" ng-bind=\"group.symbols.length\"></span>\n" +
    "            <span ng-bind=\"group.name\"></span>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-sm btn-primary\" ng-click=\"moveSymbols()\">Move Symbols</button>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("app/views/pages/about.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/about.html",
    "<div view-heading\n" +
    "     title=\"About\"\n" +
    "     sub-title=\"Information about this application\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <h3>Authors</h3>\n" +
    "\n" +
    "        <p>\n" +
    "            <strong>Alexander Bainczyk</strong><br>\n" +
    "            <a href=\"mailto:alexander.bainczyk@tu-dortmund.de\">\n" +
    "                <i class=\"fa fa-envelope-o fa-fw\"></i>&nbsp;\n" +
    "                alexander.bainczyk@tu-dortmund.de\n" +
    "            </a>\n" +
    "        </p>\n" +
    "\n" +
    "        <p>\n" +
    "            <strong>Alexander Schieweck</strong><br>\n" +
    "            <a href=\"mailto:alexander.schieweck@tu-dortmund.de\">\n" +
    "                <i class=\"fa fa-envelope-o fa-fw\"></i>&nbsp;\n" +
    "                alexander.schieweck@tu-dortmund.de\n" +
    "            </a>\n" +
    "        </p>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/pages/help.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/help.html",
    "<div view-heading\n" +
    "     title=\"Help\"\n" +
    "     sub-title=\"If you need help using this application, maybe there is some information for you here\">\n" +
    "</div>");
}]);

angular.module("app/views/pages/home.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/home.html",
    "<div view-heading\n" +
    "     title=\"Home\"\n" +
    "     sub-title=\"Hello! Choose a project or create one and start learning.\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"list-group project-list-group\">\n" +
    "\n" +
    "            <div class=\"list-group-item\" ng-if=\"projects.length > 0\" ng-repeat=\"project in projects\"\n" +
    "                 ng-click=\"openProject(project)\">\n" +
    "                <h3 class=\"list-group-item-heading\" ng-bind=\"project.name\"></h3>\n" +
    "\n" +
    "                <p class=\"list-group-item-text\">\n" +
    "                    <span ng-bind=\"project.baseUrl\"></span> <br>\n" +
    "                    <span class=\"text-muted\"\n" +
    "                          ng-if=\"!project.description\">There is no description for this project</span>\n" +
    "                    <span class=\"text-muted\" ng-if=\"project.description\" ng-bind=\"project.description\"></span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"container\" ng-if=\"projects.length == 0\">\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    You haven't created a project yet. You can create a new one <a href=\"#/project/create\">here</a> and\n" +
    "                    start\n" +
    "                    testing it.\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
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
    "<div view-heading\n" +
    "     title=\"Statistics\"\n" +
    "     sub-title=\"Have a look at some numbers we gathered for your tests\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div ng-if=\"selectedChartMode === null\">\n" +
    "\n" +
    "            <div class=\"pull-left\" selectable items=\"results\" style=\"margin-right: 16px\">\n" +
    "                <input type=\"checkbox\" selectable-item-checkbox>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"btn-group btn-group-xs pull-left\" dropdown dropdown-hover>\n" +
    "                <button class=\"btn btn-primary\">\n" +
    "                    Create Chart\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                    <li>\n" +
    "                        <a href ng-click=\"createChartFromFinalResults()\">\n" +
    "                            <i class=\"fa fa-fw fa-bar-chart\"></i> Final Results\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href ng-click=\"createChartFromCompleteResults()\">\n" +
    "                            <i class=\"fa fa-fw fa-area-chart\"></i> Complete Results\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                <button class=\"btn btn-default\">\n" +
    "                    <i class=\"fa fa-fw fa-download\"></i> Download as *.csv\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                    <li>\n" +
    "                        <a href download-learner-results-as-csv results=\"results\">\n" +
    "                            All Final Results\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"selectedChartMode !== null\">\n" +
    "\n" +
    "            <div class=\"pull-left\">\n" +
    "                <button class=\"btn btn-default btn-xs\" ng-click=\"back()\">\n" +
    "                    <i class=\"fa fa-reply fa-fw\"></i> Back\n" +
    "                </button>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"pull-right\">\n" +
    "                <button class=\"btn btn-default btn-xs\" download-svg=\"#learn-result-chart\">\n" +
    "                    <i class=\"fa fa-download fa-fw\"></i> Download as *.svg\n" +
    "                </button>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div selectable items=\"results\" ng-if=\"selectedChartMode === null\">\n" +
    "            <div selectable-list>\n" +
    "                <div selectable-list-item ng-repeat=\"result in results track by $index\">\n" +
    "\n" +
    "                    <strong>Test No\n" +
    "                        <span ng-bind=\"result.testNo\"></span>\n" +
    "                    </strong>,\n" +
    "                    [<span ng-bind=\"(result.configuration.algorithm|formatEnumKey)\"></span>]\n" +
    "\n" +
    "                    <div class=\"text-muted\">\n" +
    "                        Started: <span ng-bind=\"(result.startTime | date : 'EEE, dd.MM.yyyy, HH:mm')\"></span>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"selectedChartMode !== null && chartData.data !== null && chartData.options !== null\"\n" +
    "             id=\"learn-result-chart\">\n" +
    "\n" +
    "            <linechart data=\"chartData.data\" options=\"chartData.options\" mode=\"\" width=\"\" height=\"500\"></linechart>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <button class=\"btn btn-xs\"\n" +
    "                        ng-class=\"selectedChartProperty === chartProperties.RESETS ? 'btn-primary':'btn-default'\"\n" +
    "                        ng-click=\"selectChartProperty(chartProperties.RESETS)\">\n" +
    "                    #Resets\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-xs\"\n" +
    "                        ng-class=\"selectedChartProperty === chartProperties.SYMBOLS ? 'btn-primary':'btn-default'\"\n" +
    "                        ng-click=\"selectChartProperty(chartProperties.SYMBOLS)\">\n" +
    "                    #Symbols\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-xs\"\n" +
    "                        ng-class=\"selectedChartProperty === chartProperties.DURATION ? 'btn-primary':'btn-default'\"\n" +
    "                        ng-click=\"selectChartProperty(chartProperties.DURATION)\">\n" +
    "                    Duration\n" +
    "                </button>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/pages/learn-results.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/learn-results.html",
    "<div view-heading\n" +
    "     title=\"Tests\"\n" +
    "     sub-title=\"Have a look at all the tests you ran for this project\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" select-all-items-checkbox items=\"tests\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" ng-click=\"deleteTests()\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\">\n" +
    "                Slideshow\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "\n" +
    "    <div ng-if=\"tests.length > 0\">\n" +
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
    "\n" +
    "</div>");
}]);

angular.module("app/views/pages/learn-setup.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/learn-setup.html",
    "<div view-heading\n" +
    "     title=\"Learn Setup\"\n" +
    "     sub-title=\"Include or exclude symbols & groups you want to use for the following test\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:115,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\" selectable items=\"allSymbols\">\n" +
    "            <input type=\"checkbox\" selectable-item-checkbox>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-xs btn-default\" open-learn-setup-settings-modal\n" +
    "                    learn-configuration=\"learnConfiguration\" on-ok=\"updateLearnConfiguration\">\n" +
    "                <i class=\"fa fa-gear\"></i>\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-primary\" ng-click=\"startLearning()\">\n" +
    "                Start Learning\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container symbol-group-list\">\n" +
    "        <div ng-repeat=\"group in groups track by group.id\" class=\"symbol-group\">\n" +
    "\n" +
    "            <div class=\"selectable-list symbol-group-header\">\n" +
    "                <div class=\"selectable-list-heading\">\n" +
    "\n" +
    "                    <div class=\"selectable-list-control\" selectable items=\"group.symbols\">\n" +
    "                        <input type=\"checkbox\" selectable-item-checkbox>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"selectable-list-content\">\n" +
    "\n" +
    "                        <span class=\"pull-right\" ng-click=\"group._isCollapsed = !group._isCollapsed\">\n" +
    "                            <i class=\"fa fa-fw\"\n" +
    "                               ng-class=\"group._isCollapsed ? 'fa-chevron-down' : 'fa-chevron-right'\"></i>\n" +
    "                        </span>\n" +
    "\n" +
    "                        <h3 class=\"symbol-group-title\" ng-bind=\"group.name\"\n" +
    "                            ng-click=\"group._isCollapsed = !group._isCollapsed\"></h3>\n" +
    "\n" +
    "                        <p class=\"text-muted\">\n" +
    "                            <span ng-bind=\"group.symbols.length\"></span> Symbols\n" +
    "                        </p>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"symbol-group-body\" collapse=\"group._isCollapsed\" selectable items=\"group.symbols\">\n" +
    "\n" +
    "                <div selectable-list>\n" +
    "                    <div selectable-list-item ng-repeat=\"symbol in group.symbols\">\n" +
    "\n" +
    "                        <a class=\"pull-right\" ng-click=\"setResetSymbol(symbol)\">\n" +
    "                            <i class=\"fa\" ng-class=\"resetSymbol == symbol ? 'fa-star' : 'fa-star-o'\"></i>\n" +
    "                        </a>\n" +
    "\n" +
    "                        <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]<br>\n" +
    "\n" +
    "                        <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                            <span ng-bind=\"symbol.actions.length\"></span> Actions <i class=\"fa fa-edit\"></i>\n" +
    "                        </a>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
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
    "<div view-heading\n" +
    "     title=\"Create Project\"\n" +
    "     sub-title=\"Create a new project\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <form id=\"project-create-form\" name=\"create_form\" role=\"form\" ng-submit=\"createProject()\">\n" +
    "\n" +
    "            <!-- Name -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Name*</label>\n" +
    "\n" +
    "                <p class=\"text-muted\">The name of your project</p>\n" +
    "                <input name=\"name\" type=\"text\" class=\"form-control\"\n" +
    "                       placeholder=\"Enter a name for the project\" ng-model=\"project.name\" ng-required=\"true\">\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger alert-condensed\"\n" +
    "                 ng-show=\"create_form.name.$dirty && create_form.name.$invalid\">\n" +
    "                <small ng-show=\"create_form.name.$error.required\">Name must not be empty.</small>\n" +
    "            </div>\n" +
    "            <!-- Name -->\n" +
    "\n" +
    "            <!-- Base Url -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Url*</label>\n" +
    "\n" +
    "                <p class=\"text-muted\">The url of your website</p>\n" +
    "                <input name=\"url\" class=\"form-control\" type=\"text\"\n" +
    "                       placeholder=\"Enter the url of the project\" ng-model=\"project.baseUrl\" ng-required=\"true\"\n" +
    "                       ng-pattern=\"/^(http://|https://).{1,}/\">\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger alert-condensed\"\n" +
    "                 ng-show=\"create_form.url.$dirty && create_form.url.$invalid\">\n" +
    "                <small ng-show=\"create_form.url.$error.required\">\n" +
    "                    Url must not be empty.\n" +
    "                </small>\n" +
    "                <small ng-show=\"create_form.url.$error.pattern\">\n" +
    "                    The url has to start with http(s):// and have a host name\n" +
    "                </small>\n" +
    "            </div>\n" +
    "            <!-- /Base Url -->\n" +
    "\n" +
    "            <!-- Description -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Description</label>\n" +
    "\n" +
    "                <p class=\"text-muted\">\n" +
    "                    If you want you can describe your new project with a few words\n" +
    "                </p>\n" +
    "            <textarea name=\"description\" ng-model=\"project.description\"\n" +
    "                      placeholder=\"Enter the description for the project\"\n" +
    "                      class=\"form-control\" rows=\"3\"></textarea>\n" +
    "            </div>\n" +
    "            <!-- /Description -->\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"submit\" class=\"btn btn-sm btn-primary\">Create Project</button>\n" +
    "            </div>\n" +
    "\n" +
    "        </form>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/pages/project-settings.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/project-settings.html",
    "<div view-heading\n" +
    "     title=\"Project Settings\"\n" +
    "     sub-title=\"Update your project and change settings\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <form id=\"project-edit-form\" name=\"update_form\" role=\"form\" ng-submit=\"updateProject()\">\n" +
    "\n" +
    "            <!-- Name -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Name*</label>\n" +
    "\n" +
    "                <p class=\"text-muted\">The name of your project</p>\n" +
    "                <input name=\"name\" type=\"text\" class=\"form-control\"\n" +
    "                       placeholder=\"Enter a name for the project\" ng-model=\"project.name\" ng-required=\"true\">\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger alert-condensed\"\n" +
    "                 ng-show=\"create_form.name.$dirty && create_form.name.$invalid\">\n" +
    "                <small ng-show=\"update_form.name.$error.required\">Name must not be empty.</small>\n" +
    "            </div>\n" +
    "            <!-- Name -->\n" +
    "\n" +
    "            <!-- Base Url -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Url*</label>\n" +
    "\n" +
    "                <p class=\"text-muted\">The url of your website</p>\n" +
    "                <input name=\"url\" class=\"form-control\" type=\"text\"\n" +
    "                       placeholder=\"Enter the url of the project\" ng-model=\"project.baseUrl\" ng-required=\"true\"\n" +
    "                       ng-pattern=\"/^(http://|https://).{1,}/\">\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger alert-condensed\"\n" +
    "                 ng-show=\"create_form.url.$dirty && create_form.url.$invalid\">\n" +
    "                <small ng-show=\"update_form.url.$error.required\">\n" +
    "                    Url must not be empty.\n" +
    "                </small>\n" +
    "                <small ng-show=\"update_form.url.$error.pattern\">\n" +
    "                    The url has to start with http(s):// and have a host name\n" +
    "                </small>\n" +
    "            </div>\n" +
    "            <!-- /Base Url -->\n" +
    "\n" +
    "            <!-- Description -->\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Description</label>\n" +
    "\n" +
    "                <p class=\"text-muted\">\n" +
    "                    If you want you can describe your new project with a few words\n" +
    "                </p>\n" +
    "            <textarea name=\"description\" ng-model=\"project.description\"\n" +
    "                      placeholder=\"Enter the description for the project\"\n" +
    "                      class=\"form-control\" rows=\"3\"></textarea>\n" +
    "            </div>\n" +
    "            <!-- /Description -->\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"submit\" class=\"btn btn-sm btn-primary\">Update</button>\n" +
    "                <a class=\"btn btn-sm btn-default\" ng-click=\"resetForm()\">Reset</a>\n" +
    "                <a class=\"btn btn-sm btn-default\" ng-click=\"deleteProject()\">Delete</a>\n" +
    "            </div>\n" +
    "\n" +
    "        </form>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/pages/project.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/project.html",
    "<div view-heading\n" +
    "     title=\"{{project.name}} Dashboard\"\n" +
    "     sub-title=\"asdasdasd\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        Dashboard will soon appear at this place\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/views/pages/symbols-actions.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols-actions.html",
    "<div class=\"view-heading\">\n" +
    "    <div class=\"container\">\n" +
    "        <h2 class=\"view-heading-title\">Actions</h2>\n" +
    "\n" +
    "        <p class=\"view-heading-sub-title\">\n" +
    "            Create and manage the actions for symbol:\n" +
    "            <strong ng-bind=\"symbol.name\"></strong> <em>[<span ng-bind=\"symbol.abbreviation\"></span>]</em>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:115,class:'fixed'}\">\n" +
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
    "                    ng-class=\"(symbol.actions|selected).length == 0 ? 'disabled': ''\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-default btn-xs\" ng-click=\"revertChanges()\">Reset</button>\n" +
    "            <button class=\"btn btn-success btn-xs\" ng-click=\"saveChanges()\">Save</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div ng-if=\"symbol.actions\" as-sortable ng-model=\"symbol.actions\">\n" +
    "            <div selectable-list ng-model=\"symbol.actions\">\n" +
    "                <div selectable-list-item ng-repeat=\"action in symbol.actions track by $index\" as-sortable-item>\n" +
    "\n" +
    "                    <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                            <i class=\"fa fa-bars\"></i>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                            <li>\n" +
    "                                <a href open-action-edit-modal symbol=\"symbol\" action=\"action\"\n" +
    "                                   on-updated=\"updateAction\">\n" +
    "                                    <i class=\"fa fa-edit fa-fw\"></i> Edit\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a href ng-click=\"deleteAction(action)\">\n" +
    "                                    <i class=\"fa fa-trash fa-fw\"></i> Delete\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <span class=\"text-muted pull-right\" as-sortable-item-handle\n" +
    "                          style=\"margin-right: 15px; padding: 2px;\">\n" +
    "                        <i class=\"fa fa-sort fa-fw\"></i>\n" +
    "                    </span>\n" +
    "\n" +
    "                    <span ng-bind=\"action.toString()\"></span>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-info\" ng-show=\"symbol.actions.length == 0\">\n" +
    "            You haven't created any actions for this symbol yet.\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/pages/symbols-export.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols-export.html",
    "<div view-heading\n" +
    "     title=\"Export Symbols\"\n" +
    "     sub-title=\"Select symbols you want to download as *.json\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:120,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\" selectable items=\"allSymbols\">\n" +
    "            <input type=\"checkbox\" selectable-item-checkbox>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" download-as-json data=\"getSelectedSymbols\">\n" +
    "                <i class=\"fa fa-download fa-fw\"></i> Download\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container symbol-group-list\">\n" +
    "\n" +
    "        <div ng-repeat=\"group in groups track by group.id\" class=\"symbol-group\"\n" +
    "             ng-class=\"group._isCollapsed ? 'collapsed' :''\">\n" +
    "\n" +
    "            <div class=\"selectable-list symbol-group-header\">\n" +
    "                <div class=\"selectable-list-heading\">\n" +
    "                    <div class=\"selectable-list-control\" selectable items=\"group.symbols\">\n" +
    "                        <input type=\"checkbox\" selectable-item-checkbox>\n" +
    "                    </div>\n" +
    "                    <div class=\"selectable-list-content\">\n" +
    "\n" +
    "                        <span class=\"pull-right\" ng-click=\"group._isCollapsed = !group._isCollapsed\">\n" +
    "                            <i class=\"fa fa-fw\"\n" +
    "                               ng-class=\"group._isCollapsed ? 'fa-chevron-down' : 'fa-chevron-right'\"></i>\n" +
    "                        </span>\n" +
    "\n" +
    "                        <h3 class=\"symbol-group-title\" ng-bind=\"group.name\"\n" +
    "                            ng-click=\"group._isCollapsed = !group._isCollapsed\"></h3>\n" +
    "\n" +
    "                        <p class=\"text-muted\">\n" +
    "                            <span ng-bind=\"group.symbols.length\"></span> Symbols\n" +
    "                        </p>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"symbol-group-body\" collapse=\"group._isCollapsed\">\n" +
    "\n" +
    "                <div selectable items=\"group.symbols\">\n" +
    "                    <div selectable-list>\n" +
    "                        <div selectable-list-item item=\"symbol\" ng-repeat=\"symbol in group.symbols\">\n" +
    "\n" +
    "                            <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]<br>\n" +
    "\n" +
    "                            <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                                <span ng-bind=\"symbol.actions.length\"></span> Actions <i class=\"fa fa-edit\"></i>\n" +
    "                            </a>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
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
    "<div view-heading\n" +
    "     title=\"Symbol Upload\"\n" +
    "     sub-title=\"If you already have a *.json file with symbols, you can import them here to this project\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:120,class:'fixed'}\" ng-if=\"symbols.length > 0\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\" selectable items=\"symbols\">\n" +
    "            <input type=\"checkbox\" selectable-item-checkbox>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" ng-click=\"uploadSelectedSymbols()\">\n" +
    "                <i class=\"fa fa-upload fa-fw\"></i> Upload\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div file-dropzone on-loaded=\"fileLoaded\" class=\"alert alert-info\">\n" +
    "            Drag and drop *.json file here\n" +
    "        </div>\n" +
    "\n" +
    "        <hr>\n" +
    "\n" +
    "        <div selectable items=\"symbols\" ng-if=\"symbols.length > 0\">\n" +
    "            <div selectable-list>\n" +
    "                <div selectable-list-item ng-repeat=\"symbol in symbols\">\n" +
    "\n" +
    "                    <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "                    <div class=\"text-muted\">\n" +
    "                        <span ng-bind=\"symbol.actions.length\"></span> Actions <i class=\"fa fa-edit\"></i>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">");
}]);

angular.module("app/views/pages/symbols-trash.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols-trash.html",
    "<div view-heading\n" +
    "     title=\"Symbol Trash\"\n" +
    "     sub-title=\"Restore deleted symbols\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:120,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\" selectable items=\"symbols\">\n" +
    "            <input type=\"checkbox\" selectable-item-checkbox>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" ng-click=\"recoverSelectedSymbols()\">\n" +
    "                <i class=\"fa fa-rotate-left fa-fw\"></i> Recover\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div selectable items=\"symbols\" ng-if=\"symbols.length > 0\">\n" +
    "            <div selectable-list>\n" +
    "                <div selectable-list-item ng-repeat=\"symbol in symbols track by $index\">\n" +
    "\n" +
    "                    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"recoverSymbol(symbol)\">\n" +
    "                        <i class=\"fa fa-rotate-left fa-fw\"></i>\n" +
    "                    </a>\n" +
    "\n" +
    "                    <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "                    <div class=\"text-muted\">\n" +
    "                        <span ng-bind=\"symbol.actions.length\"></span> Actions\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-info\" ng-if=\"symbols.length === 0\">\n" +
    "            There are no deleted symbols\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/pages/symbols.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/symbols.html",
    "<div view-heading\n" +
    "     title=\"Symbols\"\n" +
    "     sub-title=\"Manage all symbols of the project\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:120,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\" selectable items=\"allSymbols\">\n" +
    "            <input type=\"checkbox\" selectable-item-checkbox>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "\n" +
    "            <div class=\"btn-group btn-group-xs\" dropdown dropdown-hover>\n" +
    "                <button class=\"btn btn-primary\">\n" +
    "                    Create\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                    <li>\n" +
    "                        <a href symbol-create-modal-handle project-id=\"{{project.id}}\" on-created=\"addSymbol\">\n" +
    "                            Symbol\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href symbol-group-create-modal-handle project-id=\"{{project.id}}\" on-created=\"addGroup\">\n" +
    "                            Group\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-class=\"(allSymbols|selected).length == 1 ? '' : 'disabled'\"\n" +
    "                    symbol-edit-modal-handle symbol=\"(allSymbols | selected | first)\" on-updated=\"updateSymbol\">\n" +
    "                Edit\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" symbol-move-modal-handle groups=\"groups\"\n" +
    "                    ng-class=\"(allSymbols|selected).length > 0 ? '' : 'disabled'\">\n" +
    "                Move\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-class=\"(allSymbols|selected).length > 0 ? '' : 'disabled'\"\n" +
    "                    ng-click=\"deleteSelectedSymbols()\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"toggleCollapseAllGroups()\">\n" +
    "                <i class=\"fa fa-fw\" ng-class=\"collapseAll ? 'fa-chevron-down': 'fa-chevron-right'\"></i>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container symbol-group-list\">\n" +
    "\n" +
    "        <div ng-repeat=\"group in groups track by group.id\" class=\"symbol-group\"\n" +
    "             ng-class=\"group._isCollapsed ? 'collapsed' :''\">\n" +
    "\n" +
    "            <div class=\"selectable-list symbol-group-header\">\n" +
    "                <div class=\"selectable-list-heading\">\n" +
    "                    <div class=\"selectable-list-control\" selectable items=\"group.symbols\">\n" +
    "                        <input type=\"checkbox\" selectable-item-checkbox>\n" +
    "                    </div>\n" +
    "                    <div class=\"selectable-list-content\">\n" +
    "\n" +
    "                        <span class=\"pull-right\" ng-click=\"group._isCollapsed = !group._isCollapsed\">\n" +
    "                            <i class=\"fa fa-fw\"\n" +
    "                               ng-class=\"group._isCollapsed ? 'fa-chevron-down' : 'fa-chevron-right'\"></i>\n" +
    "                        </span>\n" +
    "\n" +
    "                        <a href class=\"pull-right\" style=\"margin-right: 15px\" symbol-group-edit-modal-handle\n" +
    "                           group=\"group\" on-updated=\"updateGroup\" on-deleted=\"deleteGroup\">\n" +
    "                            <i class=\"fa fa-fw fa-gear\"></i>\n" +
    "                        </a>\n" +
    "\n" +
    "                        <h3 class=\"symbol-group-title\" ng-bind=\"group.name\"\n" +
    "                            ng-click=\"group._isCollapsed = !group._isCollapsed\"></h3>\n" +
    "\n" +
    "                        <p class=\"text-muted\">\n" +
    "                            <span ng-bind=\"group.symbols.length\"></span> Symbols\n" +
    "                        </p>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"symbol-group-body\" collapse=\"group._isCollapsed\">\n" +
    "\n" +
    "                <div selectable items=\"group.symbols\">\n" +
    "                    <div selectable-list>\n" +
    "                        <div selectable-list-item item=\"symbol\" ng-repeat=\"symbol in group.symbols\">\n" +
    "\n" +
    "                            <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                                <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                                    <i class=\"fa fa-bars\"></i>\n" +
    "                                </button>\n" +
    "                                <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                                    <li>\n" +
    "                                        <a href symbol-edit-modal-handle symbol=\"symbol\" on-updated=\"updateSymbol\">\n" +
    "                                            <i class=\"fa fa-edit fa-fw\"></i> Edit\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                    <li>\n" +
    "                                        <a href symbol-move-modal-handle groups=\"groups\">\n" +
    "                                            <i class=\"fa fa-exchange fa-fw\"></i> Move\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                    <li>\n" +
    "                                        <a href ng-click=\"deleteSymbol(symbol)\">\n" +
    "                                            <i class=\"fa fa-trash fa-fw\"></i> Delete\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                    <li class=\"divider\"></li>\n" +
    "                                    <li>\n" +
    "                                        <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                                            <i class=\"fa fa-list-ol fa-fw\"></i> Actions\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                    <li class=\"divider\"></li>\n" +
    "                                    <li>\n" +
    "                                        <a ui-sref=\"symbols.history({symbolId:symbol.id})\">\n" +
    "                                            <i class=\"fa fa-history fa-fw\"></i> Restore\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]<br>\n" +
    "\n" +
    "                            <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                                <span ng-bind=\"symbol.actions.length\"></span> Actions <i class=\"fa fa-edit\"></i>\n" +
    "                            </a>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
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
                url: '/symbols',
                views: {
                    '@': {
                        controller: 'SymbolsController',
                        templateUrl: paths.views.PAGES + '/symbols.html'
                    }
                },
                data: {
                    requiresProject: true
                }
            })
            .state('symbols.trash', {
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
                url: '/setup',
                views: {
                    '@': {
                        controller: 'LearnSetupController',
                        templateUrl: paths.views.PAGES + '/learn-setup.html'
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
        .constant('actionTypes', {
            web: {
                SEARCH_FOR_TEXT: 'web_checkForText',
                SEARCH_FOR_NODE: 'web_checkForNode',
                CLEAR: 'web_clear',
                CLICK: 'web_click',
                FILL: 'web_fill',
                GO_TO: 'web_goto',
                SUBMIT: 'web_submit'
            },
            rest: {
                CALL_URL: 'rest_call',
                CHECK_STATUS: 'rest_checkStatus',
                CHECK_HEADER_FIELD: 'rest_checkHeaderField',
                CHECK_HTTP_BODY_TEXT: 'rest_checkForText',
                CHECK_ATTRIBUTE_EXISTS: 'rest_checkAttributeExists',
                CHECK_ATTRIBUTE_VALUE: 'rest_checkAttributeValue',
                CHECK_ATTRIBUTE_TYPE: 'rest_checkAttributeType'
            },
            other: {
                WAIT: 'wait',
                DECLARE_COUNTER: 'declareCounter',
                DECLARE_VARIABLE: 'declareVariable',
                INCREMENT_COUNTER: 'incrementCounter',
                SET_COUNTER: 'setCounter',
                SET_VARIABLE: 'setVariable',
                SET_VARIABLE_BY_JSON_ATTRIBUTE: 'setVariableByJSON',
                SET_VARIABLE_BY_NODE: 'setVariableByHTML'
            }
        })

        // eq oracles
        .constant('eqOracles', {
            RANDOM: 'random_word',
            COMPLETE: 'complete',
            SAMPLE: 'sample'
        })

        // learn algorithms
        .constant('learnAlgorithms', {
            EXTENSIBLE_LSTAR: 'EXTENSIBLE_LSTAR',
            DHC: 'DHC',
            DISCRIMINATION_TREE: 'DISCRIMINATION_TREE'
        })
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateModalController', ActionCreateModalController);

    ActionCreateModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'actionTypes', 'Action'];

    function ActionCreateModalController($scope, $modalInstance, modalData, actionTypes, Action) {

        $scope.actionTypes = actionTypes;
        $scope.symbol = modalData.symbol;
        $scope.action = null;

        $scope.selectNewActionType = function (type) {
            $scope.action = Action.createByType(type);
        };

        $scope.createAction = function () {
            $modalInstance.close($scope.action);
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        };
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
			multigraph: false
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
        .controller('LearnSetupSettingsModalController', LearnSetupSettingsModalController);

    LearnSetupSettingsModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'eqOracles', 'learnAlgorithms', 'EqOracle'
    ];

    /**
     * The controller for the modal dialog where you can set the settings for an upcoming test run. Handles the template
     * under 'views/modals/learn-setup-settings-modal.html'. Passes the edited instance of a LearnConfiguration on
     * success.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData - The data that is passed to the controller. Must be an object with the property 'learnConfiguration'
     * @param eqOracles - The constants for eqOracles types
     * @param learnAlgorithms - The constants for learnAlgorithm names
     * @param EqOracle - The model for an EqOracle
     * @constructor
     */
    function LearnSetupSettingsModalController($scope, $modalInstance, modalData, eqOracles, learnAlgorithms, EqOracle) {

        /**
         * The constants for eqOracles types
         */
        $scope.eqOracles = eqOracles;

        /**
         * The model for the select input that holds a type for an eqOracle
         */
        $scope.selectedEqOracle = modalData.learnConfiguration.eqOracle.type;

        /**
         * The constants for learnAlgorithm names
         */
        $scope.learnAlgorithms = learnAlgorithms;

        /**
         * The LearnConfiguration to be edited
         *
         * @type {LearnConfiguration}
         */
        $scope.learnConfiguration = modalData.learnConfiguration;

        // watch for the select input to change and create a new EqOracle based on the type
        $scope.$watch('selectedEqOracle', function (type) {
            if (type) {
                $scope.learnConfiguration.eqOracle = EqOracle.createFromType(type);
            }
        });

        /**
         * Close the modal dialog and pass the edited learn configuration instance.
         */
        $scope.ok = function () {
            $modalInstance.close($scope.learnConfiguration);
        };

        /**
         * Close the modal dialog.
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
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
        .controller('SymbolCreateModalController', SymbolCreateModalController);

    SymbolCreateModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'Symbol', 'SymbolGroup'];

    /**
     * Handles the behaviour of the modal to create a new symbol. The corresponding template for this modal can found
     * under 'app/partials/modals/symbol-create-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SymbolGroup
     * @constructor
     */
    function SymbolCreateModalController($scope, $modalInstance, modalData, Symbol, SymbolGroup) {

        // the id of the project the new symbol is created for
        var projectId = modalData.projectId;

        /** The model of the symbol that will be created @type {Symbol} */
        $scope.symbol = new Symbol();

        $scope.groups = [];

        $scope.selectedGroup;

        SymbolGroup.Resource.getAll(projectId)
            .then(function (groups) {
                $scope.groups = groups;
            });

        /**
         * Make a request to the API and create a new symbol. Close the modal on success.
         */
        $scope.createSymbol = function () {

            var group = _.find($scope.groups, {name: $scope.selectedGroup});

            if (angular.isDefined(group)) {
                $scope.symbol.group = group.id;
            } else {
                // TODO: ask the user to create a new group
            }

            Symbol.Resource.create(projectId, $scope.symbol)
                .then(function (newSymbol) {
                    $modalInstance.close(newSymbol);
                })
        };

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
        .controller('SymbolEditModalController', SymbolEditModalController);

    SymbolEditModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'Symbol', 'SelectionService'];

    /**
     * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
     * The corresponding template for this modal can found under 'app/partials/modals/symbol-edit-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SelectionService
     * @constructor
     */
    function SymbolEditModalController($scope, $modalInstance, modalData, Symbol, SelectionService) {

        /** The symbol that is passed to the modal. @type {Symbol} */
        $scope.symbol = modalData.symbol;

        // The copy of the symbol that will be passed back together with the updated one
        var copy = $scope.symbol.copy();

        /**
         * Make a request to the API in order to update the symbol. Close the modal on success.
         */
        $scope.updateSymbol = function () {

            // remove the selection from the symbol in case there is any
            SelectionService.removeSelection($scope.symbol);

            // TODO: delete this when merging is complete
            $scope.symbol.type = 'web';

            // update the symbol and close the modal dialog on success with the updated symbol
            Symbol.Resource.update($scope.symbol.project, $scope.symbol)
                .then(function (updatedSymbol) {
                    $modalInstance.close({
                        new: updatedSymbol,
                        old: copy
                    });
                })
        };

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
        .controller('SymbolGroupCreateModalController', SymbolGroupCreateModalController);

    SymbolGroupCreateModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'SymbolGroup', '_'];

    function SymbolGroupCreateModalController($scope, $modalInstance, modalData, SymbolGroup, _) {

        $scope.projectId = modalData.projectId;
        $scope.group = new SymbolGroup();
        $scope.groups = [];
        $scope.groupExists = false;

        SymbolGroup.Resource.getAll($scope.projectId)
            .then(function (groups) {
                $scope.groups = groups;
            });

        $scope.createGroup = function () {

            var index = _.findIndex($scope.groups, {name: $scope.group.name});
            if (index === -1) {
                SymbolGroup.Resource.create($scope.projectId, $scope.group)
                    .then(function (newGroup) {
                        $modalInstance.close(newGroup);
                    });
                $scope.groupExists = false;
            } else {
                $scope.groupExists = true;
            }
        };

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
        .controller('SymbolGroupEditModalController', SymbolGroupEditModalController);

    SymbolGroupEditModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'SymbolGroup'];

    function SymbolGroupEditModalController($scope, $modalInstance, modalData, SymbolGroup) {

        $scope.groupExists = false;
        $scope.group = modalData.group.copy();
        $scope.groups = [];

        SymbolGroup.Resource.getAll($scope.group.project)
            .then(function (groups) {
                $scope.groups = groups;
            });

        $scope.updateGroup = function () {
            SymbolGroup.Resource.update($scope.group.project, $scope.group)
                .then(function (updatedGroup) {
                    $modalInstance.close({
                        status: 'updated',
                        group: updatedGroup
                    });
                })
        };

        $scope.deleteGroup = function () {
            SymbolGroup.Resource.delete($scope.group.project, $scope.group)
                .then(function () {
                    $modalInstance.close({
                        status: 'deleted',
                        group: $scope.group
                    });
                });
        };

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
        .controller('SymbolMoveModalController', SymbolMoveModalController);

    SymbolMoveModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'Symbol'
    ];

    function SymbolMoveModalController($scope, $modalInstance, modalData, Symbol) {

        $scope.symbols = modalData.symbols;
        $scope.groups = modalData.groups;
        $scope.selectedGroup = null;

        $scope.moveSymbols = function () {
            if ($scope.selectedGroup !== null) {
                _.forEach($scope.symbols, function (symbol) {
                    $scope.symbol.group = $scope.selectedGroup.id;
                    Symbol.Resource.update($scope.selectedGroup.project, symbol);
                })
            }
        };

        $scope.selectGroup = function (group) {
            $scope.selectedGroup = $scope.selectedGroup === group ? null : group;
        };

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
        .controller('LearnResultsStatisticsController', LearnResultsStatisticsController);

    LearnResultsStatisticsController.$inject = [
        '$scope', 'SessionService', 'LearnResultResource', 'SelectionService', 'LearnerResultChartService'
    ];

    /**
     *
     *
     * The corresponding template can be found under 'views/pages/learn-results-statistics.html'.
     *
     * @param $scope
     * @param Session
     * @param LearnResultResource
     * @param SelectionService
     * @param LearnerResultChartService
     * @constructor
     */
    function LearnResultsStatisticsController($scope, Session, LearnResultResource, SelectionService,
                                              LearnerResultChartService) {

        // The project that is stored in the session
        var project = Session.project.get();

        /**
         * The enum that indicates which kind of chart should be displayed
         * @type {{MULTIPLE_FINAL: number, MULTIPLE_COMPLETE: number}}
         */
        $scope.chartModes = {
            MULTIPLE_FINAL: 0,
            MULTIPLE_COMPLETE: 1
        };

        /**
         * The map that indicated from which property of a Learner Result a chart should be created
         * @type {{RESETS: string, SYMBOLS: string, DURATION: string}}
         */
        $scope.chartProperties = LearnerResultChartService.properties;

        /**
         * All final Learn Results from the project
         * @type {Array}
         */
        $scope.results = [];

        /**
         * The mode of the displayed chart
         * @type {null|number}
         */
        $scope.selectedChartMode = null;

        /**
         * The property of a learner result that is displayed in the chart
         * @type {string}
         */
        $scope.selectedChartProperty = $scope.chartProperties.RESETS;

        /**
         * The n3 chart data for the directive
         * @type {{data: null|Array, options: null|{}}}
         */
        $scope.chartData = {
            data: null,
            options: null
        };

        // get all final learn results of the project
        LearnResultResource.getAllFinal(project.id)
            .then(function (results) {
                $scope.results = results;
            });

        /**
         * Sets the selected learner result property from which the chart data should be created. Calls the methods
         * to create the chart data based on the selected chart mode.
         *
         * @param property - The learner result property
         */
        $scope.selectChartProperty = function (property) {
            $scope.selectedChartProperty = property;
            if ($scope.selectedChartMode === $scope.chartModes.MULTIPLE_FINAL) {
                $scope.createChartFromFinalResults();
            } else if ($scope.selectedChartMode === $scope.chartModes.MULTIPLE_COMPLETE) {
                $scope.createChartFromCompleteResults();
            }
        };

        /**
         * Creates n3 line chart data from the selected final learner results and saves it into the scope. Sets the
         * displayable chart mode to MULTIPLE_FINAL
         */
        $scope.createChartFromFinalResults = function () {
            var selectedResults = SelectionService.getSelected($scope.results);
            var chartData;

            if (selectedResults.length > 0) {
                chartData =
                    LearnerResultChartService
                        .createDataFromMultipleFinalResults(selectedResults, $scope.selectedChartProperty);

                $scope.chartData = {
                    data: chartData.data,
                    options: chartData.options
                };

                $scope.selectedChartMode = $scope.chartModes.MULTIPLE_FINAL;
            }
        };

        /**
         * Creates n3 area chart data from the selected learner results. Therefore makes an API request to fetch the
         * complete data from each selected learner result and saves the chart data into the scope. Sets the
         * displayable chart mode to MULTIPLE_COMPLETE
         */
        $scope.createChartFromCompleteResults = function () {
            var selectedResults = SelectionService.getSelected($scope.results);
            var chartData;

            if (selectedResults.length > 0) {

                // TODO: dummy values, fill with data from the server
                var selectedResults = [];
                selectedResults.push([$scope.results[0], $scope.results[1]]);
                selectedResults.push([$scope.results[2], $scope.results[0], $scope.results[1]]);
                selectedResults.push([$scope.results[1], $scope.results[2]]);

                chartData =
                    LearnerResultChartService
                        .createDataFromMultipleCompleteResults(selectedResults, $scope.selectedChartProperty);

                $scope.chartData = {
                    data: chartData.data,
                    options: chartData.options
                };

                $scope.selectedChartMode = $scope.chartModes.MULTIPLE_COMPLETE;
            }
        };

        /**
         * Resets the chart data and removes the selected chart mode so that the chart disappears and the list of
         * learner results will be shown again
         */
        $scope.back = function () {
            $scope.selectedChartMode = null;
            $scope.chartData = {
                data: null,
                options: null
            };
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnSetupController', [
            '$scope', '$state', 'SymbolGroup', 'SessionService', 'SelectionService', 'LearnConfiguration',
            'LearnerResource', 'ngToast',
            LearnSetupController
        ]);

    function LearnSetupController($scope, $state, SymbolGroup, SessionService, SelectionService, LearnConfiguration,
                                  LearnerResource, toast) {

        $scope.project = SessionService.project.get();
        $scope.groups = [];
        $scope.allSymbols = [];
        $scope.learnConfiguration = new LearnConfiguration();
        $scope.resetSymbol;

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
                    SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
                        .then(function (groups) {
                            $scope.groups = groups;
                            $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
                        });
                }
            });

        //////////

        $scope.setResetSymbol = function (symbol) {
            $scope.resetSymbol = symbol;
        };

        $scope.startLearning = function () {
            var selectedSymbols = SelectionService.getSelected($scope.allSymbols);

            if (selectedSymbols.length && $scope.resetSymbol) {

                _.forEach(selectedSymbols, function (symbol) {
                    $scope.learnConfiguration.addSymbol(symbol)
                });

                $scope.learnConfiguration.setResetSymbol($scope.resetSymbol);

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
     * @param LearnerResource
     * @constructor
     */
    function LearnStartController($scope, $interval, SessionService, LearnerResource) {

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
         */
        $scope.resumeLearning = function () {

            var copy = angular.copy($scope.test.configuration);
            delete copy.algorithm;
            delete copy.symbols;

            LearnerResource.resume(_project.id, $scope.test.testNo, copy)
                .then(function () {
                    _poll();
                })
        };

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
		                .then(function () {
		                    SessionService.project.remove();
		                    $state.go('home');
		                })
	        	})
        };

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
        .controller('SymbolsActionsController', SymbolsActionsController);

    SymbolsActionsController.$inject = [
        '$scope', '$stateParams', 'Symbol', 'SessionService', 'SelectionService'
    ];

    function SymbolsActionsController($scope, $stateParams, Symbol, SessionService, SelectionService) {

        /** the open project */
        $scope.project = SessionService.project.get();

        /** the symbol whose actions are managed */
        $scope.symbol;

        /** a copy of $scope.symbol to revert unsaved changes */
        $scope.symbolCopy;

        // load all actions from the symbol
        Symbol.Resource.get($scope.project.id, $stateParams.symbolId)
            .then(init);

        function init(symbol) {

            // create unique ids for actions
            _.forEach(symbol.actions, function (action) {
                action._id = _.uniqueId();
            });

            // add symbol to scope and create a copy in order to revert changes
            $scope.symbol = symbol;
            $scope.symbolCopy = symbol.copy();
        }

        /**
         * delete the actions that the user selected from the scope
         */
        $scope.deleteSelectedActions = function () {
            var selectedActions = SelectionService.getSelected($scope.symbol.actions);
            if (selectedActions.length) {
                _.forEach(selectedActions, $scope.deleteAction);
            }
        };

        $scope.deleteAction = function (action) {
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

            var copy = $scope.symbol.copy();
            SelectionService.removeSelection(copy.actions);

            // remove the temporarily create unique id attribute
            _.forEach(copy.actions, function (action) {
                delete action._id;
            });

            // update the symbol
            Symbol.Resource.update($scope.project.id, copy)
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
        .controller('SymbolsController', SymbolsController);

    SymbolsController.$inject = ['$scope', 'SessionService', 'Symbol', 'SymbolGroup', 'SelectionService', '_'];

    function SymbolsController($scope, Session, Symbol, SymbolGroup, SelectionService, _) {

        $scope.project = Session.project.get();
        $scope.groups = [];
        $scope.allSymbols = [];
        $scope.collapseAll = false;
        $scope.selectedSymbols = [];

        SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.groups = groups;
                $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
            });

        $scope.toggleCollapseAllGroups = function () {
            $scope.collapseAll = !$scope.collapseAll;
            _.forEach($scope.groups, function (group) {
                group._isCollapsed = $scope.collapseAll;
            })
        };

        function removeSymbolsFromScope(symbols) {
            _.forEach(symbols, function(symbol){
                var index = _.findIndex($scope.groups, {id: symbol.group});
                _.remove($scope.groups[index].symbols, {id: symbol.id});
                _.remove($scope.symbols, {id: symbol.id});
            })
        }

        /**
         * Deletes a given symbol and remove it from the scope so that it will not be listed any longer
         *
         * @param symbol {Symbol} - The symbol that should be deleted
         */
        $scope.deleteSymbol = function (symbol) {
            Symbol.Resource.delete($scope.project.id, symbol.id)
                .then(function () {
                    removeSymbolsFromScope([symbol]);
                })
        };

        /**
         * Moves the selected symbols to a new group
         *
         * @param group {SymbolGroup} - The group where the selected symbols should be moved into
         */
        $scope.moveSelectedSymbolsTo = function (group) {
            var selectedSymbols = SelectionService.getSelected($scope.allSymbols);

            SelectionService.removeSelection(selectedSymbols);
            _.forEach(selectedSymbols, function (symbol) {
                symbol.group = group.id;
                group.push(symbol);
            });
        };


        /**
         * Deletes the symbols the user selected from the server and the scope
         */
        $scope.deleteSelectedSymbols = function () {
            var selectedSymbols = SelectionService.getSelected($scope.allSymbols);
            var symbolsIds;

            if (selectedSymbols.length > 0) {
                symbolsIds = _.pluck(selectedSymbols, 'id');
                Symbol.Resource.deleteSome($scope.project.id, symbolsIds)
                    .then(removeSymbolsFromScope);
            }
        };

        /**
         * Adds a symbol to to its corresponding group the scope
         *
         * @param symbol {Symbol} - The new symbol that should be added to the list
         */
        $scope.addSymbol = function (symbol) {
            var index = _.findIndex($scope.groups, {id: symbol.group});
            if (index > -1) {
                $scope.groups[index].symbols.push(symbol);
                $scope.allSymbols.push(symbol);
            }
        };

        /**
         * Adds a group to the scope
         *
         * @param group {SymbolGroup} - The new group that should be added to the list
         */
        $scope.addGroup = function (group) {
            $scope.groups.push(group);
        };

        $scope.updateSymbol = function (symbol) {
            // TODO
        };

        $scope.updateGroup = function (group) {
            var g = _.find($scope.groups, {id: group.id});
            if (angular.isDefined(g)) {
                g.name = group.name;
            }
        };

        $scope.deleteGroup = function (group) {
            removeSymbolsFromScope(group.symbols);
            _.remove($scope.groups, {id: group.id});
        };

        $scope.getSelectedSymbols = function () {
            return SelectionService.getSelected($scope.allSymbols);
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsExportController', SymbolsExportController);

    SymbolsExportController.$inject = ['$scope', 'SessionService', 'SymbolGroup', 'SelectionService'];

    /**
     * The controller that handles the export of symbols. The corresponding template is at
     * 'views/pages/symbols-export.html'.
     *
     * @param $scope
     * @param Session
     * @param SymbolGroup
     * @param SelectionService
     * @constructor
     */
    function SymbolsExportController($scope, Session, SymbolGroup, SelectionService) {

        // the project that is saved in session storage
        var _project = Session.project.get();

        /**
         * The symbol groups that belong to the opened project
         * @type {SymbolGroup[]}
         */
        $scope.groups = [];

        /**
         * All symbols from all symbol groups
         * @type {Symbol[]}
         */
        $scope.allSymbols = [];

        // fetch symbol groups from API
        // extract all symbols
        SymbolGroup.Resource.getAll(_project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.groups = groups;
                $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
            });

        /**
         * Deletes all properties that are not needed for downloading symbols which are the id, revision, project, group
         * and hidden properties. They are removed so that they can later be uploaded and created like new symbols.
         *
         * @returns {*} - The list of downloadable symbols without unneeded properties
         */
        $scope.getSelectedSymbols = function () {
            var selectedSymbols = angular.copy(SelectionService.getSelected($scope.allSymbols));
            SelectionService.removeSelection(selectedSymbols);
            _.forEach(selectedSymbols, function (symbol) {
                delete symbol.id;
                delete symbol.revision;
                delete symbol.project;
                delete symbol.group;
                delete symbol.hidden;
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
        .controller('SymbolsImportController', SymbolsImportController);

    SymbolsImportController.$inject = ['$scope', 'SessionService', 'Symbol', 'SelectionService', '_'];

    /**
     * Handles the import of symbols from a *.json file. The corresponding template for this controller is at
     * 'views/pages/symbols-import.html'
     *
     * @param $scope
     * @param Session
     * @param Symbol
     * @param SelectionService
     * @param _
     * @constructor
     */
    function SymbolsImportController($scope, Session, Symbol, SelectionService, _) {

        // The project that is saved in the sessionStorage
        var _project = Session.project.get();

        /**
         * The symbols that will be uploaded
         *
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        /**
         * Creates instances of Symbols from the json string from the *.json file and puts them in the scope
         *
         * @param data - The json string of loaded symbols
         */
        $scope.fileLoaded = function (data) {
            try {
                var symbols = angular.fromJson(data);
                $scope.$apply(function () {
                    $scope.symbols = $scope.symbols.concat(symbols);
                });
            } catch(e) {
                console.error(e);
            }
        };

        /**
         * Makes an API request in order to create the selected symbols. Removes successfully created symbols from the
         * scope
         */
        $scope.uploadSelectedSymbols = function () {
            var selectedSymbols = angular.copy(SelectionService.getSelected($scope.symbols));
            if (selectedSymbols.length > 0) {
                SelectionService.removeSelection(selectedSymbols);
                Symbol.Resource.createSome(_project.id, selectedSymbols)
                    .then(function (createdSymbols) {
                        _.forEach(createdSymbols, function (symbol) {
                            _.remove($scope.symbols, {name: symbol.name})
                        })
                    })
            }
        };
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsTrashController', SymbolsTrashController);

    SymbolsTrashController.$inject = ['$scope', 'SessionService', 'Symbol', 'SelectionService', '_'];

    /**
     * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
     * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
     *
     * @param $scope
     * @param Session
     * @param Symbol
     * @param SelectionService
     * @constructor
     */
    function SymbolsTrashController($scope, Session, Symbol, SelectionService, _) {

        // The project that is saved in the sessionStorage
        var project = Session.project.get();

        /**
         * The list of deleted symbols
         *
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        // fetch all deleted symbols and save them in scope
        Symbol.Resource.getAll(project.id, {deleted: true})
            .then(function (symbols) {
                $scope.symbols = symbols;
            });

        /**
         * Recovers a deleted symbol by calling the API and removes the recovered symbol from the symbol list on success
         *
         * @param symbol {Symbol} - The symbol that should be recovered from the trash
         */
        $scope.recoverSymbol = function (symbol) {

            // create a copy so that the selection won't be removed in case the API call fails
            var s = symbol.copy();
            SelectionService.removeSelection(s);

            Symbol.Resource.recover(project.id, symbol)
                .then(function (recoveredSymbol) {
                    _.remove($scope.symbols, {id: recoveredSymbol.id});
                })
        };

        /**
         * Recovers all symbols that were selected and calls $scope.recoverSymbol for each one
         */
        $scope.recoverSelectedSymbols = function () {
            var selectedSymbols = SelectionService.getSelected($scope.symbols);

            if (selectedSymbols.length > 0) {
                _.forEach(selectedSymbols, $scope.recoverSymbol);
            }
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
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadLearnerResultsAsCsv', downloadLearnerResultsAsCsv);

    downloadLearnerResultsAsCsv.$inject = ['PromptService', '_'];

    /**
     * @param PromptService
     * @param _ - Lodash
     * @returns {{restrict: string, scope: {results: string}, link: link}}
     */
    function downloadLearnerResultsAsCsv(PromptService, _) {

        var directive = {
            restrict: 'A',
            scope: {
                results: '='
            },
            link: link
        };
        return directive;
        
        function link(scope, el, attrs) {

            el.on('click', handleDirectiveBehavior);

            /**
             * Prompts for a filename of the csv file and calls the method to download the file on success
             */
            function handleDirectiveBehavior() {
                var csvData = '';

                if (angular.isDefined(scope.results)) {
                    csvData = createCsvData(scope.results);
                    PromptService.prompt('Enter a name for the csv file.', {
                        regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                        errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
                    }).then(function (filename) {
                        download(csvData, filename)
                    });
                }
            }

            /**
             * Creates a csv string from learner results
             *
             * @param results - The learner results
             * @returns {string} - The csv string from learner results
             */
            function createCsvData(results) {
                var csv = 'Project,Test No,Start Time,Step No,Algorithm,Eq Oracle,Symbols,Resets,Duration (ms)\n';

                _.forEach(results, function (result) {
                    csv += result.project + ',';
                    csv += result.testNo + ',';
                    csv += '"' + result.startTime + '",';
                    csv += result.stepNo + ',';
                    csv += result.configuration.algorithm + ',';
                    csv += result.configuration.eqOracle.type + ',';
                    csv += result.sigma.length + ',';
                    csv += result.amountOfResets + ',';
                    csv += result.duration + '\n';
                });

                return csv;
            }

            /**
             * Downloads the csv file with learner results
             *
             * @param csv - The csv that should be downloaded
             * @param filename - The name of the csv file
             */
            function download(csv, filename) {

                // create new link element with downloadable csv
                var a = document.createElement('a');
                a.style.display = 'none';
                a.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                a.setAttribute('target', '_blank');
                a.setAttribute('download', filename + '.csv');

                // append link to the dom, fire click event and remove it
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        }
    }
}());;(function () {

    angular
        .module('weblearner.directives')
        .directive('downloadSvg', downloadSvg);

    downloadSvg.$inject = ['PromptService'];

    /**
     * The directive that lets you directly download a svg element from the html page into a file. It attaches a click
     * event to the element it was used on, that first prompts you for a filename and then downloads the svg.
     *
     * It can only be used as an attribute and the value of the attribute should be a css selector that leads either
     * directly to svg or to a parent element of the svg. When the selector point the the parent and the parent has
     * multiple svg children, only the first one will be downloaded.
     *
     * Use the directive for example like this: '<button download-svg="#svg">download</button>'.
     *
     * @param PromptService - The service for prompting a user input
     * @returns {{restrict: string, link: link}}
     */
    function downloadSvg(PromptService) {

        var directive = {
            restrict: 'A',
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            el.on('click', handleDirectiveBehavior);

            /**
             * Makes sure that the required attribute has a value and that a svg element actually exists. Prompts the
             * user to enter a filename and calls the download function on success
             */
            function handleDirectiveBehavior() {
                var svg = null;

                if (angular.isDefined(attrs.downloadSvg)) {
                    svg = findSvg(attrs.downloadSvg);

                    if (svg !== null) {
                        PromptService.prompt('Enter a name for the svg file.', {
                            regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                            errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
                        }).then(function (filename) {
                            download(svg, filename);
                        });
                    }
                }
            }

            /**
             * Checks if the element of the passed selector already is a svg element and if not, searches for a svg
             * element in the dom tree below the element and returns the first occurrence.
             *
             * @param selector - The selector where a svg element should be looked for
             * @returns {*|null} - The first occurrence of an svg
             */
            function findSvg(selector) {
                var svg = document.querySelector(selector);
                if (svg !== null) {
                    if (svg.nodeName.toLowerCase() !== 'svg') {
                        svg = svg.querySelector('svg')
                    }
                    if (svg !== null) {
                        return svg;
                    }
                }
                return null;
            }

            /**
             * Directly downloads a svg element
             *
             * @param svg - The svg element that should be downloaded
             * @param filename - The name the file should have
             */
            function download(svg, filename) {

                // set proper xml attributes for downloadable file
                svg.setAttribute('version', '1.1');
                svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                // create serialized string from svg element and encode it in
                // base64 otherwise the file will not be completely downloaded
                // what results in errors opening the file
                var svgString = new XMLSerializer().serializeToString(svg);
                var encodedSvgString = window.btoa(svgString);

                // create new link element with image data
                var a = document.createElement('a');
                a.style.display = 'none';
                a.setAttribute('href', 'data:image/svg+xml;base64,\n' + encodedSvgString);
                a.setAttribute('target', '_blank');
                a.setAttribute('download', filename + '.svg');

                // append link to the dom, fire click event and remove it
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
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

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            var _reader = new FileReader();

            _reader.onload = function (e) {
                scope.onLoaded()(e.target.result);
            };

            el.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

            el.on('dragenter', function(){
                el[0].style.outline = '2px solid rgba(0,0,0,0.2)'
            }).on('dragleave', function(){
                el[0].style.outline = '0'
            });

            el.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                el[0].style.outline = '0'
                readFiles(e.dataTransfer.files);
            });

            /**
             * Read files as a text file
             *
             * @param files
             */
            function readFiles(files) {
                for (var i = 0; i < files.length; i++) {
                    _reader.readAsText(files[i]);
                }
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
            controller: [
                '$scope', '$window', '$state', 'SessionService',
                controller
            ]
		};
		return directive;
    }

		//////////

		function link(scope, el, attrs) {

            var handle = angular.element(el[0].getElementsByClassName('navbar-menu-handle'));
            var offscreen = angular.element(el[0].getElementsByClassName('navbar-offscreen'));
            var offscreenClass = 'show';

            handle.on('click', toggleNavigation);

            function toggleNavigation(e) {
                e.stopPropagation();
                offscreen.toggleClass(offscreenClass);
            }

            function hideNavigation(e) {
                if (e.target.tagName == 'A' && e.target.getAttribute('href') != '#') {
                    offscreen.removeClass(offscreenClass);
                }
            }
        }

    //
    //	//////////
    //
    function controller($scope, $window, $state, Session) {
        //
        //		var mediaQuery;
        //
        //		//////////
        //
        //		/** the project */
        $scope.project = Session.project.get();
        //		$scope.hover = false;
        //		$scope.offScreen = false;
        //
        //        //////////
        //
        //		this.setHover = function(hover){
        //			$scope.hover = hover;
        //		};
        //
        //		this.isHover = function(){
        //			return $scope.hover;
        //		};
        //
        //		this.isOffScreen = function(){
        //			return $scope.offScreen;
        //		};
        //
        //		//////////
        //
	        // load project into scope when projectOpened is emitted
	        $scope.$on('project.opened', function () {
                $scope.project = Session.project.get();
	        });

	        // delete project from scope when projectOpened is emitted
	        $scope.$on('project.closed', function () {
	            $scope.project = null;
	        });
        //
        //		// watch for media query event
        //		mediaQuery = window.matchMedia('screen and (max-width: 768px)');
        //		mediaQuery.addListener(mediaQueryMatches);
        //		mediaQueryMatches(null, mediaQuery.matches);
        //
        //		//////////
        //
        //		function mediaQueryMatches(evt, matches){
        //			if (evt === null) {
        //				$scope.offScreen = matches ? true : false;
        //			} else {
        //				$scope.offScreen = evt.matches;
        //			}
        //		}
        //
        //        //////////
        //
	        /**
	         * remove the project object from the session and redirect to the start page
	         */
	        $scope.closeProject = function () {
                Session.project.remove();
	            $state.go('home');
	        }
		}

    //}
    //
    //angular
    //	.module('weblearner.directives')
    //	.directive('dropdownNavigation', ['$document', dropdownNavigation]);
    //
    //function dropdownNavigation($document){
    //	return {
    //		require: ['dropdown', '^navigation'],
    //		link: function(scope, el, attrs, ctrls) {
    //
    //			var dropDownCtrl = ctrls[0];
    //			var navigationCtrl = ctrls[1];
    //
    //			el.on('click', function(e){
    //				e.stopPropagation();
    //
    //				if (!navigationCtrl.isOffScreen()){
    //					if (!navigationCtrl.isHover()){
    //						navigationCtrl.setHover(true);
    //						$document.on('click', closeDropDown);
    //					}
    //				}
    //			}).on('mouseenter', function(){
    //				if (navigationCtrl.isHover()){
    //					scope.$apply(function(){
    //						dropDownCtrl.toggle(true);
    //					})
    //				}
    //			});
    //
    //			function closeDropDown() {
    //				navigationCtrl.setHover(false);
    //				$document.off('click', closeDropDown);
    //			}
    //		}
    //	}
    //}
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
        .directive('openHypothesisLayoutSettingsModal', openHypothesisLayoutSettingsModal);

    openHypothesisLayoutSettingsModal.$inject = ['$modal', 'paths'];

    function openHypothesisLayoutSettingsModal($modal, paths) {

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
        .directive('openLearnSetupSettingsModal', openLearnSetupSettingsModal);

    openLearnSetupSettingsModal.$inject = ['$modal', 'paths'];

    function openLearnSetupSettingsModal($modal, paths) {

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
                    templateUrl: paths.views.MODALS + '/learn-setup-settings-modal.html',
                    controller: 'LearnSetupSettingsModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                learnConfiguration: scope.learnConfiguration.copy()
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
        .directive('selectable', selectable)
        .directive('selectableList', selectableList)
        .directive('selectableListItem', selectableListItem)
        .directive('selectableItemCheckbox', selectableItemCheckbox);
    
    function selectable() {

        var directive = {
            scope: {
                items: '='
            },
            controller: ['$scope', controller]
        };
        return directive;

        function controller($scope) {
            this.getItems = function () {
                return $scope.items;
            }
        }
    }

    function selectableList() {

        var directive = {
            transclude: true,
            replace: true,
            template: '<div class="selectable-list" ng-transclude></div>'
        };
        return directive;
    }

    function selectableListItem() {

        var directive = {
            require: '^selectable',
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

        function link(scope, el, attrs, ctrl) {
            scope.item = ctrl.getItems()[scope.$index];
        }
    }

    function selectableItemCheckbox() {

        var directive = {
            require: '^selectable',
            link: link
        };
        return directive;

        function link(scope, el, attrs, ctrl) {

            var items;
            var _this;

            el.on('change', function () {
                items = ctrl.getItems();
                _this = this;

                scope.$apply(function () {
                    for (var i = 0; i < items.length; i++) {
                        items[i]._selected = _this.checked;
                    }
                });
            })
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
            controller: ['$scope', 'eqOracles', 'EqOracle', controller]
        };
        return directive;

        function controller($scope, eqOracles, EqOracle) {

            $scope.eqOracles = eqOracles;

            //////////

            $scope.$watch('configuration.eqOracle.type', function (type) {
                $scope.configuration.eqOracle = EqOracle.createFromType(type);
            });
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolCreateModalHandle', symbolCreateModalHandle);

    symbolCreateModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the modal window for the creation of a new symbol. It attaches an click event to the
     * attached element that opens the modal dialog.
     *
     * Use it as an Attribute like 'symbol-create-modal-handle' and add an attribute 'project-id' with the id of the
     * project and an attribute 'on-created' which expects a callback function from the directives parent controller.
     * The callback function should have one parameter that will be the newly created symbol.
     *
     * @param $modal - The $modal service
     * @param paths - The constants for application paths
     * @returns {{restrict: string, scope: {projectId: string, onCreated: string}, link: link}}
     */
    function symbolCreateModalHandle($modal, paths) {

        var directive = {
            restrict: 'A',
            scope: {
                projectId: '@',
                onCreated: '&'
            },
            link: link
        };
        return directive;

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            // attach the click event on the target element that opens the modal dialog
            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-create-modal.html',
                    controller: 'SymbolCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                projectId: scope.projectId
                            }
                        }
                    }
                });

                // call the callback with the created symbol on success
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
        .directive('symbolEditModalHandle', symbolEditModalHandle);

    symbolEditModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the modal window for the editing of a new symbol. It attaches an click event to the
     * attached element that opens the modal dialog.
     *
     * Use it as an attribute like 'symbol-edit-modal-handle' and add an attribute 'on-created' which expects a callback
     * function from the directives parent controller. The callback function should have one parameter that will be the
     * newly updated symbol.
     *
     * @param $modal - The $modal service
     * @param paths - The constants for application paths
     * @returns {{restrict: string, scope: {symbol: string, onUpdated: string}, link: link}}
     */
    function symbolEditModalHandle($modal, paths) {

        var directive = {
            restrict: 'EA',
            scope: {
                symbol: '=',
                onUpdated: '&'
            },
            link: link
        };
        return directive;

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-edit-modal.html',
                    controller: 'SymbolEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbol: scope.symbol.copy()
                            };
                        }
                    }
                });
                modal.result.then(function (symbol) {
                    scope.onUpdated()(symbol.new, symbol.old);
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolGroupCreateModalHandle', symbolGroupCreateModalHandle);

    symbolGroupCreateModalHandle.$inject = ['$modal', 'paths'];

    function symbolGroupCreateModalHandle($modal, paths) {

        var directive = {
            scope: {
                projectId: '@',
                onCreated: '&'
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-group-create-modal.html',
                    controller: 'SymbolGroupCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                projectId: scope.projectId
                            };
                        }
                    }
                });
                modal.result.then(function (group) {
                    scope.onCreated()(group);
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolGroupEditModalHandle', symbolGroupEditModalHandle);

    symbolGroupEditModalHandle.$inject = ['$modal', 'paths'];

    function symbolGroupEditModalHandle($modal, paths) {

        var directive = {
            scope: {
                group: '=',
                onUpdated: '&',
                onDeleted: '&'
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {

                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-group-edit-modal.html',
                    controller: 'SymbolGroupEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                group: scope.group
                            }
                        }
                    }
                });

                // call the callback with the created symbol on success
                modal.result.then(function (data) {
                    if (data.status === 'updated') {
                        scope.onUpdated()(data.group);
                    } else if (data.status === 'deleted') {
                        scope.onDeleted()(data.group);
                    }
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('symbolMoveModalHandle', symbolMoveModalHandle);

    symbolMoveModalHandle.$inject = ['$modal', 'paths'];

    function symbolMoveModalHandle($modal, paths) {

        var directive = {
            scope: {
                symbols: '=',
                groups: '=',
                onMoved: '&'
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-move-modal.html',
                    controller: 'SymbolMoveModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbols: scope.symbols,
                                groups: scope.groups
                            }
                        }
                    }
                });

                modal.result.then(function (groups) {
                    scope.onMoved()(groups);
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('viewHeading', viewHeading);

    function viewHeading() {

        var template = '' +
            '<div class="view-heading">' +
            '   <div class="container">' +
            '       <h2 class="view-heading-title" ng-bind="::title"></h2>' +
            '       <p class="view-heading-sub-title" ng-bind="::subTitle"></p>' +
            '   </div>' +
            '</div>';

        return {
            scope: {
                title: '@',
                subTitle: '@'
            },
            template: template
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
}());;(function () {

    angular
        .module('weblearner.models')
        .factory('Action', ActionModel);

    ActionModel.$inject = ['actionTypes'];

    function ActionModel(actionTypes) {

        function Action() {
        }

        Action.Web = function () {
        };

        Action.Web.SearchForText = function (value, isRegexp) {
            this.type = actionTypes.web.SEARCH_FOR_TEXT;
            this.value = value || null;
            this.regexp = isRegexp || false;
        };

        Action.Web.SearchForText.prototype.toString = function () {
            return 'Search for ' + (this.regexp ? 'regexp' : 'string') + '"' + this.value + '"';
        };

        Action.Web.SearchForNode = function (value, isRegexp) {
            this.type = actionTypes.web.SEARCH_FOR_NODE;
            this.value = value || null;
            this.regexp = isRegexp || false
        };

        Action.Web.SearchForText.prototype.toString = function () {
            return 'Search for node "' + this.value + '"' + (this.regexp ? 'as regexp' : '');
        };

        Action.Web.Clear = function (node) {
            this.type = actionTypes.web.CLEAR;
            this.node = node || null;
        };

        Action.Web.Clear.prototype.toString = function () {
            return 'Clear element "' + this.node + '"';
        };

        Action.Web.Click = function (node) {
            this.type = actionTypes.web.CLICK;
            this.node = node || null;
        };

        Action.Web.Click.prototype.toString = function () {
            return 'Click on element "' + this.node + '"';
        };

        Action.Web.Fill = function (node, value) {
            this.type = actionTypes.web.FILL;
            this.node = node || null;
            this.generator = value || null
        };

        Action.Web.Fill.prototype.toString = function () {
            return 'Fill element "' + this.node + '" with "' + this.generator + '"';
        };

        Action.Web.GoTo = function (url) {
            this.type = actionTypes.web.GO_TO;
            this.url = url || null;
        };

        Action.Web.GoTo.prototype.toString = function () {
            return 'Go to URL "' + this.url + '"';
        };

        Action.Web.Submit = function (node) {
            this.type = actionTypes.web.SUBMIT;
            this.node = node || null;
        };

        Action.Web.Submit.prototype.toString = function () {
            return 'Submit element "' + this.node + '"';
        };

        //////////

        Action.Rest = function () {
        };

        Action.Rest.Call = function (method, url, data) {
            this.type = actionTypes.rest.CALL_URL;
            this.method = method || null;
            this.url = url || null;
            this.data = data || null;
        };

        Action.Rest.Call.prototype.toString = function () {
            return 'Make a "' + this.method + '" request to "' + this.url + '"';
        };

        Action.Rest.CheckStatus = function (statusCode) {
            this.type = actionTypes.rest.CHECK_STATUS;
            this.status = statusCode || null;
        };

        Action.Rest.CheckStatus.prototype.toString = function () {
            return 'Check HTTP response status to be "' + this.status + '"'
        };

        Action.Rest.CheckHeaderField = function (key, value, isRegexp) {
            this.type = actionTypes.rest.CHECK_HEADER_FIELD;
            this.key = key || null;
            this.value = value || null;
            this.regexp = isRegexp || false;
        };

        Action.Rest.CheckHeaderField.prototype.toString = function () {
            return 'Check HTTP response header field "' + this.key + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
        };

        Action.Rest.CheckHttpBodyText = function (value, isRegexp) {
            this.type = actionTypes.rest.CHECK_HTTP_BODY_TEXT;
            this.value = value || null;
            this.regexp = isRegexp || false;
        };

        Action.Rest.CheckHttpBodyText.toString = function () {
            return 'Search in the HTTP response body for ' + (this.regexp ? 'regexp' : 'string') + ' "' + this.value + '"';
        };

        Action.Rest.CheckAttributeExists = function (attribute) {
            this.type = actionTypes.rest.CHECK_ATTRIBUTE_EXISTS;
            this.attribute = this.attribute = attribute || null;
        };

        Action.Rest.CheckAttributeExists.prototype.toString = function () {
            return 'Check if the JSON of a HTTP response has attribute "' + this.attribute + '"';
        };

        Action.Rest.CheckAttributeValue = function (attribute, value, isRegexp) {
            this.type = actionTypes.rest.CHECK_ATTRIBUTE_VALUE;
            this.attribute = attribute || null;
            this.value = value || null;
            this.regexp = isRegexp || false
        };

        Action.Rest.CheckAttributeValue.prototype.toString = function () {
            return 'Check the JSON of a HTTP response to have attribute "' + this.attribute + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
        };

        Action.Rest.CheckAttributeType = function (attribute, jsonType) {
            this.type = actionTypes.rest.CHECK_ATTRIBUTE_TYPE;
            this.attribute = attribute || null;
            this.jsonType = jsonType || null;
        };

        Action.Rest.CheckAttributeType.prototype.toString = function () {
            return 'Check the JSON attribute "' + this.attribute + '" of a HTTP response to be type of "' + this.jsonType + '"';
        };

        //////////

        Action.Other = function () {
        };

        Action.Other.Wait = function (duration) {
            this.type = actionTypes.other.WAIT;
            this.duration = duration || 0;
        };

        Action.Other.Wait.prototype.toString = function () {
            return 'Wait for ' + this.duration + 'ms'
        };

        Action.Other.DeclareCounter = function (name) {
            this.type = actionTypes.other.DECLARE_COUNTER;
            this.name = name || null;
        };

        Action.Other.DeclareCounter.prototype.toString = function () {
            return 'Declare counter "' + this.name + '"';
        };

        Action.Other.DeclareVariable = function (name) {
            this.type = actionTypes.other.DECLARE_VARIABLE;
            this.name = name || null;
        };

        Action.Other.DeclareVariable.prototype.toString = function () {
            return 'Declare variable "' + this.name + '"';
        };

        Action.Other.IncrementCounter = function (name) {
            this.type = actionTypes.other.INCREMENT_COUNTER;
            this.name = name || null;
        };

        Action.Other.IncrementCounter.prototype.toString = function () {
            return 'Increment counter "' + this.name + '"';
        };

        Action.Other.SetCounter = function (name, value) {
            this.type = actionTypes.other.SET_COUNTER;
            this.name = name || null;
            this.value = value || null;
        };

        Action.Other.SetCounter.prototype.toString = function () {
            return 'Set counter "' + this.name + '" to "' + this.value + '"';
        };

        Action.Other.SetVariable = function (name, value) {
            this.type = actionTypes.other.SET_VARIABLE;
        };

        Action.Other.SetVariable.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to "' + this.value + '"';
        };

        Action.Other.SetVariableByJSONAttribute = function (name, jsonAttribute) {
            this.type = actionTypes.other.SET_VARIABLE_BY_JSON_ATTRIBUTE;
            this.name = name || null;
            this.value = jsonAttribute;
        };

        Action.Other.SetVariableByJSONAttribute.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the JSON attribute "' + this.value + '"';
        };

        Action.Other.SetVariableByNode = function (name, xPath) {
            this.type = actionTypes.other.SET_VARIABLE_BY_NODE;
            this.name = name || null;
            this.value = xPath;
        };

        Action.Other.SetVariableByNode.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the element "' + this.value + '"';
        };

        Action.build = function (data) {

            switch (data.type) {

                // web actions
                case actionTypes.web.SEARCH_FOR_TEXT:
                    return new Action.Web.SearchForText(data.value, data.regexp);
                    break;
                case actionTypes.web.SEARCH_FOR_NODE:
                    return new Action.Web.SearchForNode(data.value, data.regexp);
                    break;
                case actionTypes.web.CLEAR:
                    return new Action.Web.Clear(data.node);
                    break;
                case actionTypes.web.CLICK:
                    return new Action.Web.Click(data.node);
                    break;
                case actionTypes.web.FILL:
                    return new Action.Web.Fill(data.node, data.generator);
                    break;
                case actionTypes.web.GO_TO:
                    return new Action.Web.GoTo(data.url);
                    break;
                case actionTypes.web.SUBMIT:
                    return new Action.Web.Submit(data.node);
                    break;

                // rest actions
                case actionTypes.rest.CALL_URL:
                    return new Action.Rest.Call(data.method, data.url, data.data);
                    break;
                case actionTypes.rest.CHECK_STATUS:
                    return new Action.Rest.CheckStatus(data.status);
                    break;
                case actionTypes.rest.CHECK_HEADER_FIELD:
                    return new Action.Rest.CheckHeaderField(data.key, data.value, data.regexp);
                    break;
                case actionTypes.rest.CHECK_HTTP_BODY_TEXT:
                    return new Action.Rest.CheckHttpBodyText(data.value, data.regexp);
                    break;
                case actionTypes.rest.CHECK_ATTRIBUTE_EXISTS:
                    return new Action.Rest.CheckAttributeExists(data.attribute);
                    break;
                case actionTypes.rest.CHECK_ATTRIBUTE_VALUE:
                    return new Action.Rest.CheckAttributeValue(data.attribute, data.value, data.regexp);
                    break;
                case actionTypes.rest.CHECK_ATTRIBUTE_TYPE:
                    return new Action.Rest.CheckAttributeType(data.attribute, data.jsonType);
                    break;

                // other actions
                case actionTypes.other.WAIT:
                    return new Action.Other.Wait(data.duration);
                    break;
                case actionTypes.other.DECLARE_COUNTER:
                    return new Action.Other.DeclareCounter(data.name);
                    break;
                case actionTypes.other.DECLARE_VARIABLE:
                    return new Action.Other.DeclareVariable(data.name);
                    break;
                case actionTypes.other.INCREMENT_COUNTER:
                    return new Action.Other.IncrementCounter(data.name);
                    break;
                case actionTypes.other.SET_COUNTER:
                    return new Action.Other.SetCounter(data.name, data.value);
                    break;
                case actionTypes.other.SET_VARIABLE:
                    return new Action.Other.SetVariable(data.name, data.value);
                    break;
                case actionTypes.other.SET_VARIABLE_BY_JSON_ATTRIBUTE:
                    return new Action.Other.SetVariableByJSONAttribute(data.name, data.value);
                    break;
                case actionTypes.other.SET_VARIABLE_BY_NODE:
                    return new Action.Other.SetVariableByNode(data.name, data.value);
                    break;

                default:
                    return null;
                    break;
            }

        };

        Action.createByType = function (type) {
            return Action.build({
                type: type
            })
        };

        return Action;
    }
}());;(function () {

    angular
        .module('weblearner.models')
        .factory('EqOracle', EqOracleModel);

    EqOracleModel.$inject = ['eqOracles'];

    /**
     * The factory that holds the models for an eq oracle
     *
     * @param eqOracles - The constants for eq oracle types
     * @returns {{Random: Random, Complete: Complete, Sample: Sample, build: build, createFromType: createFromType}}
     * @constructor
     */
    function EqOracleModel(eqOracles) {

        var EqOracle = {
            Random: Random,
            Complete: Complete,
            Sample: Sample,
            build: build,
            createFromType: createFromType
        };
        return EqOracle;

        /**
         * The model for an eq oracle that searches randomly for counter examples
         *
         * @param minLength - The minimum length of a word that should be created
         * @param maxLength - The maximum length of a word that should be created
         * @param maxNoOfTests - The maximum number of words that are generated
         * @constructor
         */
        function Random(minLength, maxLength, maxNoOfTests) {
            this.type = eqOracles.RANDOM;
            this.minLength = minLength || 1;
            this.maxLength = maxLength || 1;
            this.maxNoOfTests = maxNoOfTests || 1;
        }

        /**
         * The model for an eq oracle that searches in the hypothesis for counter examples starting from the start
         * state
         *
         * @param minDepth - The minimum depth
         * @param maxDepth - The maximum depth
         * @constructor
         */
        function Complete(minDepth, maxDepth) {
            this.type = eqOracles.COMPLETE;
            this.minDepth = minDepth || 1;
            this.maxDepth = maxDepth || 1;
        }

        /**
         * The model for an eq oracle where counter examples are chosen manually
         *
         * @constructor
         */
        function Sample() {
            this.type = eqOracles.SAMPLE;
            this.counterExamples = [];
        }

        /**
         * Creates an instance of an eqOracle from data
         *
         * @param data
         * @returns {*}
         */
        function build(data) {
            var eqOracle;

            switch (data.type) {
                case eqOracles.RANDOM:
                    eqOracle = new Random(data.minLength, data.maxLength);
                    break;
                case eqOracles.COMPLETE:
                    eqOracle = new Complete(data.minDepth, data.maxDepth);
                    break;
                case eqOracles.SAMPLE:
                    eqOracle = new Sample();
                    break;
                default :
                    break;
            }

            return eqOracle;
        }

        /**
         * Creates a new instance of an EqOracle given a specific type
         *
         * @param type
         * @returns {*}
         */
        function createFromType(type) {
            return build({
                type: type
            })
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.models')
        .factory('LearnConfiguration', LearnConfigurationModel);

    LearnConfigurationModel.$inject = ['learnAlgorithms', 'EqOracle'];

    /**
     * The model for setting parameters for a learn process.
     *
     * @param learnAlgorithms
     * @param EqOracle
     * @returns {LearnConfiguration}
     * @constructor
     */
    function LearnConfigurationModel(learnAlgorithms, EqOracle) {

        /**
         *
         * @constructor
         */
        function LearnConfiguration() {
            this.symbols = [];
            this.maxAmountOfStepsToLearn = 0;
            this.eqOracle = new EqOracle.Complete();
            this.algorithm = learnAlgorithms.EXTENSIBLE_LSTAR;
            this.resetSymbol;
        }

        /**
         *
         * @param symbol
         */
        LearnConfiguration.prototype.setResetSymbol = function (symbol) {
            this.resetSymbol = {
                id: symbol.id,
                revision: symbol.revision
            };
        };

        /**
         *
         * @param symbol
         */
        LearnConfiguration.prototype.addSymbol = function (symbol) {
            this.symbols.push({
                id: symbol.id,
                revision: symbol.revision
            });
        };

        /**
         *
         * @returns {*}
         */
        LearnConfiguration.prototype.copy = function () {
            return LearnConfiguration.build(angular.copy(this));
        };


        /**
         *
         * @param data
         * @returns {LearnConfigurationModel.LearnConfiguration}
         */
        LearnConfiguration.build = function (data) {
            var learnConfiguration = new LearnConfiguration();
            learnConfiguration.symbols = data.symbols;
            learnConfiguration.maxAmountOfStepsToLearn = data.maxAmountOfStepsToLearn;
            learnConfiguration.algorithm = data.algorithm;
            learnConfiguration.eqOracle = EqOracle.build(data.eqOracle);
            learnConfiguration.resetSymbol = data.resetSymbol;
            return learnConfiguration;
        };

        return LearnConfiguration;
    }
}());;;(function () {
    'use strict';

    angular
        .module('weblearner.models')
        .factory('Project', ProjectModel);

    ProjectModel.$inject = ['ProjectResource'];

    /**
     * The factory for the model of a project.
     *
     * @param ProjectResource - The resource to fetch projects from the server
     * @return {Project}
     * @constructor
     */
    function ProjectModel(ProjectResource) {

        /**
         * The project model.
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
         * Creates an instance of a project from an object.
         *
         * @param data - The data the project should be build from
         * @return {ProjectModel.Project}
         */
        Project.build = function (data) {
            var project = new Project(data.name, data.baseUrl, data.description);
            project.id = data.id;
            return project;
        };

        /**
         * Creates an array of project instances from an object.
         *
         * @param data
         * @returns {Array}
         */
        Project.buildSome = function (data) {
            var projects = [];
            for (var i = 0; i < data.length; i++) {
                projects.push(Project.build(data[i]));
            }
            return projects;
        };

        /**
         * The resource object for a project
         *
         * @type {ProjectResource}
         */
        Project.Resource = new ProjectResource();

        // attach the build function of the project to the resource so that it can automatically create instances
        // of projects from http responses
        Project.Resource.build = Project.build;
        Project.Resource.buildSome = Project.buildSome;

        return Project;
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.models')
        .factory('Symbol', SymbolModel);

    SymbolModel.$inject = ['SymbolResource'];

    /**
     * The factory for the symbol model.
     *
     * @param SymbolResource - The resource to do CRUD operations on symbols
     * @returns {Symbol} - The symbol model
     * @constructor
     */
    function SymbolModel(SymbolResource) {

        /**
         * The symbol model.
         *
         * @param name - The name of the symbol
         * @param abbreviation - The abbreviation of the symbol
         * @constructor
         */
        function Symbol(name, abbreviation) {
            this.name = name || null;
            this.abbreviation = abbreviation || null;
            this.actions = [];
            this.id;
            this.revision;
            this.project;
            this.hidden;
            this.group;
        }

        /**
         * Create a copy of the instance
         *
         * @returns {SymbolModel.Symbol}
         */
        Symbol.prototype.copy = function () {
            return Symbol.build(angular.copy(this));
        };

        /**
         * Build a symbol instance from an object
         *
         * @param data - The data the symbol instance should be build from
         * @returns {SymbolModel.Symbol} - The symbol instance
         */
        Symbol.build = function (data) {
            var symbol = new Symbol(data.name, data.abbreviation);
            symbol.actions = data.actions;
            symbol.id = data.id;
            symbol.revision = data.revision;
            symbol.project = data.project;
            symbol.hidden = data.hidden;
            symbol.group = data.group;
            return symbol;
        };

        /**
         * Build an array of symbol instances from an object array
         *
         * @param data - The data the symobl instances should be build from
         * @returns {SymbolModel.Symbol[]} - The array of symbol instances
         */
        Symbol.buildSome = function (data) {
            var symbols = [];
            for (var i = 0; i < data.length; i++) {
                symbols.push(Symbol.build(data[i]))
            }
            return symbols;
        };

        /**
         * The symbol resource as a static property for easy access and the mapping of symbols to instances
         *
         * @type {SymbolResource}
         */
        Symbol.Resource = new SymbolResource();

        // attach the build function of the symbol to the resource so that it can automatically create instances
        // of symbols from http responses
        Symbol.Resource.build = Symbol.build;
        Symbol.Resource.buildSome = Symbol.buildSome;

        return Symbol;
    }
}());;(function () {

    angular
        .module('weblearner.models')
        .factory('SymbolGroup', SymbolGroupModel);

    SymbolGroupModel.$inject = ['SymbolGroupResource', 'Symbol'];

    function SymbolGroupModel(SymbolGroupResource, Symbol) {

        function SymbolGroup(name) {
            this.name = name || null;
            this.id;
            this.project;
            this.symbols;
        }

        SymbolGroup.prototype.copy = function () {
            return SymbolGroup.build(angular.copy(this));
        };

        SymbolGroup.build = function (data) {
            var group = new SymbolGroup(data.name);
            group.id = data.id;
            group.symbols = Symbol.buildSome(data.symbols);
            group.project = data.project;
            return group;
        };

        SymbolGroup.buildSome = function (data) {
            var groups = [];
            for (var i = 0; i < data.length; i++) {
                groups.push(SymbolGroup.build(data[i]));
            }
            return groups;
        };

        SymbolGroup.Resource = new SymbolGroupResource();
        SymbolGroup.Resource.build = SymbolGroup.build;
        SymbolGroup.Resource.buildSome = SymbolGroup.buildSome;

        return SymbolGroup;
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
                .then(function(){
                    return [{
                        "amountOfResets": 111,
                        "configuration": {
                            "algorithm": "EXTENSIBLE_LSTAR",
                            "eqOracle": {
                                "type": "sample",
                                "counterExamples": [{"input": ["w2", "w2", "w3"], "output": ["OK", "OK", "OK"]}]
                            },
                            "maxAmountOfStepsToLearn": 0,
                            "symbols": [{"id": 1, "revision": 2}, {"id": 3, "revision": 2}, {
                                "id": 4,
                                "revision": 2
                            }, {"id": 5, "revision": 2}, {"id": 6, "revision": 2}]
                        },
                        "duration": 40759,
                        "hypothesis": {
                            "nodes": [0, 1, 2],
                            "initNode": 0,
                            "edges": [{"from": 0, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 0,
                                "input": "w1",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 0, "input": "w2", "to": 2, "output": "OK"}, {
                                "from": 0,
                                "input": "w3",
                                "to": 0,
                                "output": "FAILED"
                            }, {"from": 0, "input": "w4", "to": 0, "output": "OK"}, {
                                "from": 1,
                                "input": "reset",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 1, "input": "w1", "to": 1, "output": "OK"}, {
                                "from": 1,
                                "input": "w2",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 1, "input": "w3", "to": 2, "output": "OK"}, {
                                "from": 1,
                                "input": "w4",
                                "to": 1,
                                "output": "FAILED"
                            }, {"from": 2, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 2,
                                "input": "w1",
                                "to": 2,
                                "output": "OK"
                            }, {"from": 2, "input": "w2", "to": 1, "output": "OK"}, {
                                "from": 2,
                                "input": "w3",
                                "to": 2,
                                "output": "FAILED"
                            }, {"from": 2, "input": "w4", "to": 2, "output": "OK"}]
                        },
                        "project": 1,
                        "sigma": ["reset", "w1", "w2", "w3", "w4"],
                        "startTime": "2015-03-05T09:19:02.250+00:00",
                        "stepNo": 2,
                        "testNo": 1,
                        "type": "web"
                    }, {
                        "amountOfResets": 41,
                        "configuration": {
                            "algorithm": "DISCRIMINATION_TREE",
                            "eqOracle": {
                                "type": "sample",
                                "counterExamples": [{"input": ["w2", "w2", "w3"], "output": ["OK", "OK", "OK"]}]
                            },
                            "maxAmountOfStepsToLearn": 0,
                            "symbols": [{"id": 1, "revision": 2}, {"id": 3, "revision": 2}, {
                                "id": 4,
                                "revision": 2
                            }, {"id": 5, "revision": 2}, {"id": 6, "revision": 2}]
                        },
                        "duration": 26402,
                        "hypothesis": {
                            "nodes": [0, 2, 1],
                            "initNode": 0,
                            "edges": [{"from": 0, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 0,
                                "input": "w1",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 0, "input": "w2", "to": 1, "output": "OK"}, {
                                "from": 0,
                                "input": "w3",
                                "to": 0,
                                "output": "FAILED"
                            }, {"from": 0, "input": "w4", "to": 0, "output": "OK"}, {
                                "from": 1,
                                "input": "reset",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 1, "input": "w1", "to": 1, "output": "OK"}, {
                                "from": 1,
                                "input": "w2",
                                "to": 2,
                                "output": "OK"
                            }, {"from": 1, "input": "w3", "to": 1, "output": "FAILED"}, {
                                "from": 1,
                                "input": "w4",
                                "to": 1,
                                "output": "OK"
                            }, {"from": 2, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 2,
                                "input": "w1",
                                "to": 2,
                                "output": "OK"
                            }, {"from": 2, "input": "w2", "to": 0, "output": "OK"}, {
                                "from": 2,
                                "input": "w3",
                                "to": 1,
                                "output": "OK"
                            }, {"from": 2, "input": "w4", "to": 2, "output": "FAILED"}]
                        },
                        "project": 1,
                        "sigma": ["reset", "w1", "w2", "w3", "w4"],
                        "startTime": "2015-03-05T09:21:02.962+00:00",
                        "stepNo": 2,
                        "testNo": 2,
                        "type": "web"
                    }, {
                        "amountOfResets": 20,
                        "configuration": {
                            "algorithm": "DHC",
                            "eqOracle": {"type": "random_word", "minLength": 1, "maxLength": 2, "maxNoOfTests": 1},
                            "maxAmountOfStepsToLearn": 0,
                            "symbols": [{"id": 1, "revision": 2}, {"id": 3, "revision": 2}, {
                                "id": 4,
                                "revision": 2
                            }, {"id": 5, "revision": 2}]
                        },
                        "duration": 9208,
                        "hypothesis": {
                            "nodes": [0],
                            "initNode": 0,
                            "edges": [{"from": 0, "input": "reset", "to": 0, "output": "OK"}, {
                                "from": 0,
                                "input": "w1",
                                "to": 0,
                                "output": "OK"
                            }, {"from": 0, "input": "w2", "to": 0, "output": "OK"}, {
                                "from": 0,
                                "input": "w3",
                                "to": 0,
                                "output": "FAILED"
                            }]
                        },
                        "project": 1,
                        "sigma": ["reset", "w1", "w2", "w3"],
                        "startTime": "2015-03-05T12:29:19.995+00:00",
                        "stepNo": 1,
                        "testNo": 3,
                        "type": "web"
                    }];
                })
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

    ProjectResource.$inject = ['$http', 'paths', 'ResourceResponseService'];

    /**
     * The resource that handles http calls to the API to do CRUD operations on projects
     *
     * @param $http - The $http angular service
     * @param paths - The constant with application paths
     * @param ResourceResponseService
     * @return {Resource}
     * @constructor
     */
    function ProjectResource($http, paths, ResourceResponseService) {

        /**
         * The resource object
         *
         * @constructor
         */
        function Resource() {
        }

        /**
         * Make a GET http request to /rest/projects in order to fetch all existings projects
         *
         * @return {*}
         */
        Resource.prototype.all = function () {
            var _this = this;
            return $http.get(paths.api.URL + '/projects')
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
                .catch(ResourceResponseService.fail);
        };

        /**
         * Make a GET http request to /rest/projects/{id} in order to fetch a single project by its id
         *
         * @param id - The id of the project that should be fetched
         * @return {*}
         */
        Resource.prototype.get = function (id) {
            var _this = this;
            return $http.get(paths.api.URL + '/projects/' + id)
                .then(function (response) {
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
        Resource.prototype.create = function (project) {
            var _this = this;
            return $http.post(paths.api.URL + '/projects', project)
                .then(function (response) {
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
        Resource.prototype.update = function (project) {
            var _this = this;
            return $http.put(paths.api.URL + '/projects/' + project.id, project)
                .then(function (response) {
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
        Resource.prototype.delete = function (project) {
            var _this = this;
            return $http.delete(paths.api.URL + '/projects/' + project.id)
                .then(function (response) {
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
        Resource.prototype.build = function (data) {
            return data;
        };

        /**
         * Overwrite this method in order to create an array of projects. This method will be called on every successful
         * http request where multiple projects are involved.
         *
         * @param data - The data the array of projects should be build from
         * @returns {*}
         */
        Resource.prototype.buildSome = function (data) {
            return data;
        };

        return Resource;
    }
}());;(function () {

    angular
        .module('weblearner.resources')
        .factory('SymbolGroupResource', Resource);

    Resource.$inject = ['$http', 'paths'];

    function Resource($http, paths) {

        function SymbolGroupResource() {

        }

        SymbolGroupResource.prototype.get = function (projectId, groupId, options) {
            var _this = this;
            var query = '';

            if (options && options.embedSymbols && options.embedSymbols === true) {
                query = '?embed=symbols';
            }

            return $http.get(paths.api.URL + '/projects/' + projectId + '/groups/' + groupId + query)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        SymbolGroupResource.prototype.getAll = function (projectId, options) {
            var _this = this;
            var query = '';

            if (options && options.embedSymbols && options.embedSymbols === true) {
                query = '?embed=symbols';
            }

            return $http.get(paths.api.URL + '/projects/' + projectId + '/groups' + query)
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        SymbolGroupResource.prototype.getSymbols = function (projectId, groupId) {
            var _this = this;

            $http.get(paths.api.URL + '/projects/' + projectId + '/groups/' + groupId + '/symbols')
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        SymbolGroupResource.prototype.create = function (projectId, group) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/groups', group)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        SymbolGroupResource.prototype.update = function (projectId, group) {
            var _this = this;

            return $http.put(paths.api.URL + '/projects/' + projectId + '/groups/' + group.id, group)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        SymbolGroupResource.prototype.delete = function (projectId, group) {
            var _this = this;

            return $http.delete(paths.api.URL + '/projects/' + projectId + '/groups/' + group.id)
                .then(function (response) {
                    return response.data;
                })
        };

        SymbolGroupResource.prototype.build = function (data) {
            return data;
        };

        SymbolGroupResource.prototype.buildSome = function (data) {
            return data;
        };

        return SymbolGroupResource;
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('SymbolResource', Resource);

    Resource.$inject = ['$http', 'paths', 'ResourceResponseService'];

    /**
     * The resource that handles http requests to the API to do CRUD operations on symbols
     *
     * @param $http - The angular $http service
     * @param paths - The constant with application paths
     * @param ResourceResponseService
     * @returns {SymbolResource}
     * @constructor
     */
    function Resource($http, paths, ResourceResponseService) {

        /**
         * The resource object for a symbol
         * @constructor
         */
        function SymbolResource() {

        }

        /**
         * Make a GET request to /rest/projects/{projectId}/symbols/{symbolId} in order to fetch the latest revision of
         * a symbol.
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbolId - The id of the symbol that should be fetched
         */
        SymbolResource.prototype.get = function (projectId, symbolId) {
            var _this = this;

            // make the request
            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId)
                .then(success)
                .catch(ResourceResponseService.fail);

            // build a symbol instance from the response
            function success(response) {
                return _this.build(response.data);
            }
        };

        /**
         * Make a GET request to /rest/projects/{projectId}/symbols in oder to fetch all symbols, that means all latest
         * revisions from symbols.
         *
         * As options, you can pass an object {deleted: true} which will get all latest revisions from deleted symbols.
         *
         * @param projectId - The id of the project the symbols belong to
         * @param options - The query options as described in the functions description
         * @returns {*}
         */
        SymbolResource.prototype.getAll = function (projectId, options) {
            var _this = this;
            var query;

            // check if options are defined and build a query
            if (options && options.deleted && options.deleted === true) {
                query = '?visibility=hidden';
            }

            // make the request with the query
            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols' + (query ? query : ''))
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an array of symbol instances from the response
            function success(response) {
                return _this.buildSome(response.data);
            }
        };

        /**
         * Make a GET request to /rest/projects/{projectId}/symbols/{symbolId}/complete in order to fetch all revisions.
         * of a symbol
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbolId - The id of the symbol whose revisions should be fetched
         * @returns {*}
         */
        SymbolResource.prototype.getRevisions = function (projectId, symbolId) {
            var _this = this;

            // make the request
            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/complete')
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an instance of a symbol from the http response
            function success(response) {
                return _this.buildSome(response.data);
            }
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols in order to create a new symbol.
         *
         * @param projectId - The id of the project the symbol should belong to
         * @param symbol - The symbol that should be created
         */
        SymbolResource.prototype.create = function (projectId, symbol) {
            var _this = this;

            // make the request
            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols', symbol)
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an instance of a symbol from the http response
            function success(response) {
                return _this.build(response.data);
            }
        };

        /**
         * Make a PUT request to /rest/projects/{projectId}/symbols in order to create multiple symbols at once.
         *
         * @param projectId - The id of the project the symbols should belong to
         * @param symbols - The array of symbols that should be created
         * @returns {*}
         */
        SymbolResource.prototype.createSome = function (projectId, symbols) {
            var _this = this;

            // make the request
            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols', symbols)
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an array of symbol instances from the response
            function success(response) {
                return _this.buildSome(response.data);
            }
        };

        /**
         * Make a PUT request to /rest/projects/{projectId}/symbols in order to update a single symbol.
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbol - The updated symbol
         * @returns {*}
         */
        SymbolResource.prototype.update = function (projectId, symbol) {
            var _this = this;

            // make the request
            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id, symbol)
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an instance of the updated symbol
            function success(response) {
                return _this.build(response.data);
            }
        };

        SymbolResource.prototype.updateSome = function (projectId, symbols) {
            // TODO
        };

        /**
         * Make a DELETE request to /rest/projects/{projectId}/symbols/hide in order to delete a single symbol. The
         * Symbol will not be deleted permanently, it will be just hidden and ignored when you call getAll().
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbolId - The id of the symbol that should be deleted
         * @returns {*}
         */
        SymbolResource.prototype.delete = function (projectId, symbolId) {
            var _this = this;

            // make the request
            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/hide', {})
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an instance of the deleted symbol
            function success(resonse) {
                return _this.build(resonse.data);
            }
        };

        /**
         * Make a DELETE request to /rest/projects/{projectId}/symbols/hide in order to delete multiple symbols at once.
         * Symbols will not be deleted permanently but stay hidden.
         *
         * @param projectId - The id of the projects the symbols belong to
         * @param symbolIds - The array of ids from the symbols that should be deleted
         * @returns {*}
         */
        SymbolResource.prototype.deleteSome = function (projectId, symbolIds) {
            var _this = this;

            // create a string from the ids array for the request path
            symbolIds = symbolIds.join(',');

            // make the request
            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolIds + '/hide', {})
                .then(success)
                .catch(ResourceResponseService.fail);

            // build an array of instances from the deleted symbols
            function success(response) {
                return _this.buildSome(response.data);
            }
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/symbolId/show in order to revert the deleting
         * of a symbol.
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbol - The symbol that should be made visible again
         * @returns {*}
         */
        SymbolResource.prototype.recover = function (projectId, symbol) {
            var _this = this;

            // make the request
            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id + '/show', {})
                .then(success)
                .catch(ResourceResponseService.fail);

            // build and instance of the visible symbol
            function success(response) {
                return _this.build(response.data);
            }
        };

        /**
         * Overwrite this method in order to create an instance of a symbol. This method will be called on every
         * successful http request where a single symbol is involved.
         *
         * @param data - The data the symbol instance should be build from
         * @returns {*}
         */
        SymbolResource.prototype.build = function (data) {
            return data;
        };

        /**
         * Overwrite this method in order to create an array of symbols. This method will be called on every successful
         * http request where multiple symbols are involved.
         *
         * @param data - The data the symbol instances should be build from
         * @returns {*}
         */
        SymbolResource.prototype.buildSome = function (data) {
            return data;
        };

        return SymbolResource;
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
        .factory('LearnerResultChartService', LearnerResultChartService);

    LearnerResultChartService.$inject = ['_'];

    /**
     * The service to create n3 line chart data from learner results. Can create bar chart data from multiple final
     * learner results and area chart data from multiple complete learner results.
     *
     * @param _ - The Lodash library
     * @returns {{createDataFromMultipleFinalResults: createDataFromMultipleFinalResults, createDataFromMultipleCompleteResults: createDataFromMultipleCompleteResults, properties: {RESETS: string, SYMBOLS: string, DURATION: string}}}
     * @constructor
     */
    function LearnerResultChartService(_) {

        // The learner result properties
        var properties = {
            RESETS: 'amountOfResets',
            SYMBOLS: 'sigma',
            DURATION: 'duration'
        };

        // The available service data
        var service = {
            createDataFromMultipleFinalResults: createDataFromMultipleFinalResults,
            createDataFromMultipleCompleteResults: createDataFromMultipleCompleteResults,
            properties: properties
        };
        return service;

        /**
         * Creates bar chart data from a list of final learner results which includes the data itself and options.
         *
         * @param results - The learner results from that the chart data should be created
         * @param property - The learner results property from that the data should be used
         * @returns {{data: Array, options: {series: {y: string, color: string, type: string, axis: string, id: string}[], stacks: Array, axes: {x: {type: string, key: string}, y: {type: string, min: number}}, lineMode: string, tension: number, tooltip: {mode: string}, drawLegend: boolean, drawDots: boolean, columnsHGap: number}}}
         */
        function createDataFromMultipleFinalResults(results, property) {

            var dataSets = [];
            var dataValues = [];
            var options = {
                series: [
                    {
                        y: "val_0",
                        color: "#2ca02c",
                        type: "column",
                        axis: "y",
                        id: "series_0"
                    }
                ],
                stacks: [],
                axes: {x: {type: "linear", key: "x"}, y: {type: "linear", min: 0}},
                lineMode: "linear",
                tension: 0.7,
                tooltip: {mode: "scrubber"},
                drawLegend: false,
                drawDots: true,
                columnsHGap: 3
            };

            // extract values from learner results by a property
            switch (property) {
                case properties.RESETS:
                    dataValues = _.pluck(results, properties.RESETS);
                    break;
                case properties.SYMBOLS:
                    dataValues = _.map(_.pluck(results, properties.SYMBOLS), function (n) {
                        return n.length
                    });
                    break;
                case properties.DURATION:
                    dataValues = _.pluck(results, properties.DURATION);
                    break;
                default :
                    break;
            }

            // create n3 line chart dataSets from extracted values
            for (var i = 0; i < dataValues.length; i++) {
                dataSets.push({
                    x: i,
                    val_0: dataValues[i]
                });
            }

            // create x axis labels for each test result
            options.axes.x.labelFunction = function (l) {
                if (l % 1 == 0 && l >= 0 && l < results.length) {
                    return 'Test ' + results[l].testNo;
                }
            };

            return {
                data: dataSets,
                options: options
            };
        }

        /**
         * Creates area chart data from a list of complete learner results which includes the data itself and options.
         *
         * @param results - A list of complete learner results
         * @param property - The learner result property from which the chart data should be created
         * @returns {{data: Array, options: {series: Array, stacks: Array, axes: {x: {type: string, key: string}, y: {type: string, min: number}}, lineMode: string, tension: number, tooltip: {mode: string}, drawLegend: boolean, drawDots: boolean, columnsHGap: number}}}
         */
        function createDataFromMultipleCompleteResults(results, property) {

            var dataSets = [];
            var dataValues = [];
            var maxSteps = 0;
            var options = {
                series: [],
                stacks: [],
                axes: {x: {type: "linear", key: "x"}, y: {type: "linear", min: 0}},
                lineMode: "linear",
                tension: 0.7,
                tooltip: {mode: "scrubber"},
                drawLegend: true,
                drawDots: true,
                columnsHGap: 3
            };
            var i, j;

            // extract values from learner results by a property
            switch (property) {
                case properties.RESETS:
                    _.forEach(results, function (result) {
                        dataValues.push(_.pluck(result, properties.RESETS));
                    });
                    break;
                case properties.SYMBOLS:
                    _.forEach(results, function (result) {
                        dataValues.push(_.map(_.pluck(result, properties.SYMBOLS), function (n) {
                            return n.length;
                        }));
                    });
                    break;
                case properties.DURATION:
                    _.forEach(results, function (result) {
                        dataValues.push(_.pluck(result, properties.DURATION));
                    });
                    break;
                default :
                    break;
            }

            // find value from test results where #steps is max
            for (i = 0; i < dataValues.length; i++) {
                if (dataValues[i].length > maxSteps) {
                    maxSteps = dataValues[i].length;
                }
            }

            // fill all other values with zeroes
            for (i = 0; i < dataValues.length; i++) {
                if (dataValues[i].length < maxSteps) {
                    for (j = dataValues[i].length; j < maxSteps; j++) {
                        dataValues[i][j] = 0;
                    }
                }
            }

            // create data sets
            for (i = 0; i < dataValues.length; i++) {
                var data = {x: i};
                for (j = 0; j < maxSteps; j++) {
                    data['val_' + j] = dataValues[j][i];
                }
                dataSets.push(data);
            }

            // create options for each test
            for (i = 0; i < dataSets.length; i++) {
                options.series.push({
                    y: 'val_' + i,
                    color: 'rgba(0,255,0,' + (0.2 * (i + 1)) + ')',
                    type: 'area',
                    axis: 'y',
                    id: 'series_' + i,
                    label: 'Test ' + results[i][0].testNo
                })
            }

            // create customs x axis labels
            options.axes.x.labelFunction = function (l) {
                if (l % 1 == 0 && l >= 0 && l < maxSteps) {
                    return 'Step ' + (l + 1);
                }
            };

            return {
                data: dataSets,
                options: options
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

    angular
        .module('weblearner.filters')
        .filter('formatEnumKey', formatEnumKey);

    function formatEnumKey() {
        return function (string) {
            return string.toLowerCase().split('_').join(' ').replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
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