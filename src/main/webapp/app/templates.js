angular.module('templates-all', ['app/views/directives/counter-example-builder.html', 'app/views/directives/hypothesis-panel.html', 'app/views/directives/hypothesis.html', 'app/views/directives/load-screen.html', 'app/views/directives/navigation.html', 'app/views/directives/observation-table.html', 'app/views/directives/rest-action-create-form.html', 'app/views/directives/rest-action-edit-form.html', 'app/views/directives/web-action-create-form.html', 'app/views/directives/web-action-edit-form.html', 'app/views/directives/web-element-picker.html', 'app/views/modals/action-create-modal.html', 'app/views/modals/action-edit-modal.html', 'app/views/modals/hypothesis-layout-settings-modal.html', 'app/views/modals/modal-confirm-dialog.html', 'app/views/modals/modal-prompt-dialog.html', 'app/views/modals/modal-test-details.html', 'app/views/modals/modal-test-setup-settings.html', 'app/views/modals/symbol-create-modal.html', 'app/views/modals/symbol-edit-modal.html', 'app/views/modals/symbol-group-create-modal.html', 'app/views/modals/symbol-group-edit-modal.html', 'app/views/modals/symbol-move-modal.html', 'app/views/pages/about.html', 'app/views/pages/groups.html', 'app/views/pages/help.html', 'app/views/pages/home.html', 'app/views/pages/learn-results-compare.html', 'app/views/pages/learn-results-statistics.html', 'app/views/pages/learn-results.html', 'app/views/pages/learn-setup.html', 'app/views/pages/learn-start.html', 'app/views/pages/project-create.html', 'app/views/pages/project-settings.html', 'app/views/pages/project.html', 'app/views/pages/symbols-actions.html', 'app/views/pages/symbols-export.html', 'app/views/pages/symbols-history.html', 'app/views/pages/symbols-import.html', 'app/views/pages/symbols-trash.html', 'app/views/pages/symbols.html', 'app/views/pages/tools-hypotheses-view.html', 'app/views/widgets/widget-counter-examples.html', 'app/views/widgets/widget-test-resume-settings.html']);

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
    "    <h3 class=\"modal-title\">Create Action</h3>\n" +
    "    <span class=\"text-muted\">Create a new action for a symbol</span>\n" +
    "</div>\n" +
    "\n" +
    "<form ng-submit=\"createAction()\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <select class=\"form-control\" ng-model=\"selectedActionType\" ng-options=\"k for (k,v) in actionTypes.web\"></select>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <select class=\"form-control\" ng-model=\"selectedActionType\" ng-options=\"k for (k,v) in actionTypes.rest\"></select>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"form-group\">\n" +
    "            <select class=\"form-control\" ng-model=\"selectedActionType\" ng-options=\"k for (k,v) in actionTypes.other\"></select>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "\n" +
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
    "        <button class=\"btn btn-primary\" type=\"submit\">Update Symbol Group</button>\n" +
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
    "            ng-class=\"selectedGroup.name === group.name ? 'active': ''\"\n" +
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

angular.module("app/views/pages/groups.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/groups.html",
    "<div view-heading\n" +
    "     title=\"Symbol Groups\"\n" +
    "     sub-title=\"Manage all symbol groups\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:120,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-primary btn-xs\">\n" +
    "                Create\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\">\n" +
    "                Edit\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div ng-repeat=\"group in groups track by $index\">\n" +
    "            {{group.name}}\n" +
    "\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"symbol in group.symbols track by symbol.id\">\n" +
    "                    {{symbol.name}}\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
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
    "    <div class=\"container\" ng-if=\"chartDataSets.length == 0\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" select-all-items-checkbox items=\"tests\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "            <div class=\"btn-group btn-group-xs\" dropdown dropdown-hover>\n" +
    "                <button type=\"button\" class=\"btn btn-default dropdown-toggle\" dropdown-toggle>\n" +
    "                    Charts\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                    <li>\n" +
    "                        <a href ng-click=\"chartFromSingleCompleteTestResult()\">\n" +
    "                            <i class=\"fa fa-line-chart fa-fw\"></i> Single Complete Test\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href ng-click=\"chartFromMultipleFinalTestResults()\">\n" +
    "                            <i class=\"fa fa-bar-chart fa-fw\"></i> Multiple Tests\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a href ng-click=\"chartFromTwoCompleteTestResults()\">\n" +
    "                            <i class=\"fa fa-columns fa-fw\"></i> Compare Two Complete Tests\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "            <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
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
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\" ng-if=\"chartDataSets.length > 0\">\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"back()\">\n" +
    "                <i class=\"fa fa-list-ul fa-fw\"></i> Test Results\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" download-canvas-as-image=\"test-results-chart\">\n" +
    "                <i class=\"fa fa-save fa-fw\"></i> Download Diagram\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"container\" ng-if=\"chartDataSets.length == 0\">\n" +
    "\n" +
    "        <div selectable-list ng-model=\"tests\">\n" +
    "            <div selectable-list-item ng-repeat=\"test in tests\">\n" +
    "\n" +
    "                <span class=\"label label-primary pull-right\">\n" +
    "                    Web\n" +
    "                </span>\n" +
    "\n" +
    "                <strong>Test No\n" +
    "                    <span ng-bind=\"test.testNo\"></span>\n" +
    "                </strong>,\n" +
    "                [<span ng-bind=\"test.configuration.algorithm\"></span>]\n" +
    "\n" +
    "                <br>\n" +
    "\n" +
    "                <p class=\"text-muted\">\n" +
    "                    Started: <span ng-bind=\"(test.startTime | date : 'EEE, dd.MM.yyyy, HH:mm')\"></span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"container\" ng-if=\"chartDataSets.length > 0\">\n" +
    "\n" +
    "        <hr>\n" +
    "\n" +
    "        <div ng-if=\"chartMode == chartModes.MULTIPLE_FINAL_TEST_RESULTS\">\n" +
    "            <div test-results-chart test-results-chart-multiple-final chart-data=\"chartDataSets\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"chartMode == chartModes.SINGLE_COMPLETE_TEST_RESULT\">\n" +
    "            <div test-results-chart test-results-chart-single-complete chart-data=\"chartDataSets\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"chartMode == chartModes.TWO_COMPLETE_TEST_RESULTS\">\n" +
    "            <div test-results-chart test-results-chart-two-complete chart-data=\"chartDataSets\"></div>\n" +
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
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" select-all-items-checkbox items=\"allSymbols\">\n" +
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
    "<div class=\"view-body\">\n" +
    "    <div class=\"container symbol-group-list\">\n" +
    "        <div ng-repeat=\"group in groups track by group.id\" class=\"symbol-group\">\n" +
    "\n" +
    "            <div class=\"selectable-list symbol-group-header\">\n" +
    "                <div class=\"selectable-list-heading\">\n" +
    "                    <div class=\"selectable-list-control\">\n" +
    "                        <input type=\"checkbox\" select-all-items-checkbox items=\"group.symbols\">\n" +
    "                    </div>\n" +
    "                    <div class=\"selectable-list-content\">\n" +
    "\n" +
    "                    <span class=\"pull-right\" ng-click=\"group._isCollapsed = !group._isCollapsed\">\n" +
    "                        <i class=\"fa fa-fw\" ng-class=\"group._isCollapsed ? 'fa-chevron-down' : 'fa-chevron-right'\"></i>\n" +
    "                    </span>\n" +
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
    "                <div selectable-list ng-model=\"group.symbols\">\n" +
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
    "            <button class=\"btn btn-success btn-xs\" ng-click=\"saveChanges()\">Save</button>\n" +
    "            <button class=\"btn btn-default btn-xs\" ng-click=\"revertChanges()\">Reset</button>\n" +
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
    "                <div selectable-list-item ng-repeat=\"action in symbol.actions\" as-sortable-item>\n" +
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
    "	            \n" +
    "	           <span class=\"text-muted pull-right\" as-sortable-item-handle style=\"margin-right: 15px; padding: 2px;\">\n" +
    "                    <i class=\"fa fa-sort fa-fw\"></i>\n" +
    "                </span>\n" +
    "\n" +
    "                    <strong ng-bind=\"action.type\"></strong><br>\n" +
    "\n" +
    "                    <!-- BEGIN: Display Web Actions -->\n" +
    "                    <div class=\"text-muted\" ng-if=\"symbol.type == 'web'\">\n" +
    "\n" +
    "                        <p ng-if=\"action.type == webActionTypes.SEARCH_FOR_TEXT\">\n" +
    "                            Search for the\n" +
    "                            <span ng-show=\"action.regexp\">regexp</span>\n" +
    "                            <span ng-show=\"!action.regexp\">string</span>\n" +
    "                            \"{{action.value}}\" on the page\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == webActionTypes.SEARCH_FOR_NODE\">\n" +
    "                            Search for the element \"{{action.value}}\" in the DOM tree of the page\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == webActionTypes.CLEAR\">\n" +
    "                            Clear the element \"{{action.node}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == webActionTypes.CLICK\">\n" +
    "                            Click on the element \"{{action.node}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == webActionTypes.FILL\">\n" +
    "                            Fill the element \"{{action.node}}\" with \"{{action.generator}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == webActionTypes.GO_TO\">\n" +
    "                            Go to the page with the url \"{{action.url}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == webActionTypes.SUBMIT\">\n" +
    "                            Submit the form element \"{{action.node}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == webActionTypes.WAIT\">\n" +
    "                            Wait for {{action.duration}} ms.\n" +
    "                        </p>\n" +
    "\n" +
    "                    </div>\n" +
    "                    <!-- END: Display Web Actions -->\n" +
    "\n" +
    "                    <!-- BEGIN: Display Rest Actions -->\n" +
    "                    <div class=\"text-muted\" ng-if=\"symbol.type == 'rest'\">\n" +
    "\n" +
    "                        <p ng-if=\"action.type == restActionTypes.CALL_URL\">\n" +
    "                            Make a \"{{action.method}}\" request to \"{{action.url}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == restActionTypes.CHECK_STATUS\">\n" +
    "                            Check http status to be \"{{action.status}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == restActionTypes.CHECK_HEADER_FIELD\">\n" +
    "                            Check header field \"{{action.key}}\" to be \"{{action.value}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == restActionTypes.CHECK_HTTP_BODY_TEXT\">\n" +
    "                            Search in the response body for \"{{action.value}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == restActionTypes.CHECK_ATTRIBUTE_EXISTS\">\n" +
    "                            Check if response body attribute \"{{action.attribute}}\" exists\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == restActionTypes.CHECK_ATTRIBUTE_VALUE\">\n" +
    "                            Check response body attribute \"{{action.attribute}}\" to be \"{{action.value}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-if=\"action.type == restActionTypes.CHECK_ATTRIBUTE_TYPE\">\n" +
    "                            Check response body attribute \"{{action.attribute}}\" to be type of \"{{action.jsonType}}\"\n" +
    "                        </p>\n" +
    "\n" +
    "                    </div>\n" +
    "                    <!-- END: Display Rest Actions -->\n" +
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
    "     title=\"Symbols Export\"\n" +
    "     sub-title=\"Export your symbols as *.json\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" select-all-items-checkbox items=\"symbols.web\"> Web\n" +
    "            </label>\n" +
    "            &nbsp;\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" select-all-items-checkbox items=\"symbols.rest\"> Rest\n" +
    "            </label>\n" +
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
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div selectable-list ng-model=\"symbols.web\">\n" +
    "            <div selectable-list-item ng-repeat=\"symbol in symbols.web\">\n" +
    "\n" +
    "                <span class=\"label label-primary pull-right\" ng-bind=\"symbol.type\"></span>\n" +
    "\n" +
    "                <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "                <p class=\"text-muted\">\n" +
    "                    <span ng-bind=\"symbol.actions.length\"></span> Actions\n" +
    "                </p>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div selectable-list ng-model=\"symbols.rest\">\n" +
    "            <div selectable-list-item ng-repeat=\"symbol in symbols.rest\">\n" +
    "\n" +
    "                <span class=\"label label-warning pull-right\" ng-bind=\"symbol.type\"></span>\n" +
    "\n" +
    "                <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "                <p class=\"text-muted\">\n" +
    "                    <span ng-bind=\"symbol.actions.length\"></span> Actions\n" +
    "                </p>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
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
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:124,class:'fixed'}\"\n" +
    "     ng-if=\"symbols.web.length > 0 || symbols.rest.length > 0\">\n" +
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
    "            <button class=\"btn btn-xs btn-primary\" ng-click=\"uploadSymbols()\">Upload</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div file-dropzone on-loaded=\"fileLoaded\" class=\"alert alert-info\">\n" +
    "            Drag and drop *.json file here\n" +
    "        </div>\n" +
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
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">");
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
    "<div view-heading\n" +
    "     title=\"Symbols\"\n" +
    "     sub-title=\"Manage all symbols of the project\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:120,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" select-all-items-checkbox items=\"allSymbols\">\n" +
    "        </div>\n" +
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
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"toggleCollapseAllGroups()\">\n" +
    "                <i class=\"fa fa-fw\" ng-class=\"collapseAll ? 'fa-chevron-down': 'fa-chevron-right'\"></i>\n" +
    "            </button>\n" +
    "        </div>\n" +
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
    "                    <div class=\"selectable-list-control\">\n" +
    "                        <input type=\"checkbox\" select-all-items-checkbox items=\"group.symbols\">\n" +
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
    "                <div selectable-list ng-model=\"group.symbols\">\n" +
    "                    <div selectable-list-item ng-repeat=\"symbol in group.symbols\">\n" +
    "\n" +
    "                        <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                            <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                                <i class=\"fa fa-bars\"></i>\n" +
    "                            </button>\n" +
    "                            <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                                <li>\n" +
    "                                    <a href symbol-edit-modal-handle symbol=\"symbol\" on-updated=\"updateSymbol\">\n" +
    "                                        <i class=\"fa fa-edit fa-fw\"></i> Edit\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href ng-click=\"\">\n" +
    "                                        <i class=\"fa fa-exchange fa-fw\"></i> Move\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href ng-click=\"deleteSymbol(symbol)\" symbol-move-modal-handle groups=\"groups\">\n" +
    "                                        <i class=\"fa fa-trash fa-fw\"></i> Delete\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li class=\"divider\"></li>\n" +
    "                                <li>\n" +
    "                                    <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                                        <i class=\"fa fa-list-ol fa-fw\"></i> Actions\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li class=\"divider\"></li>\n" +
    "                                <li>\n" +
    "                                    <a ui-sref=\"symbols.history({symbolId:symbol.id})\">\n" +
    "                                        <i class=\"fa fa-history fa-fw\"></i> Restore\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]<br>\n" +
    "\n" +
    "                        <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                            <span ng-bind=\"symbol.actions.length\"></span> Actions <i class=\"fa fa-edit\"></i>\n" +
    "                        </a>\n" +
    "\n" +
    "\n" +
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
