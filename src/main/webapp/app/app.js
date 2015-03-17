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
            'n3-line-chart',
            'selectionModel',

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
}());;angular.module('templates-all', ['app/views/directives/hypothesis-panel.html', 'app/views/directives/hypothesis.html', 'app/views/directives/learn-results-panel.html', 'app/views/directives/learner-result-chart-multiple-final.html', 'app/views/directives/load-screen.html', 'app/views/directives/navigation.html', 'app/views/directives/observation-table.html', 'app/views/directives/rest-action-edit-form.html', 'app/views/directives/view-heading.html', 'app/views/directives/web-element-picker.html', 'app/views/modals/action-create-modal.html', 'app/views/modals/action-edit-modal.html', 'app/views/modals/confirm-dialog.html', 'app/views/modals/hypothesis-layout-settings-modal.html', 'app/views/modals/learn-result-details-modal.html', 'app/views/modals/learn-setup-settings-modal.html', 'app/views/modals/prompt-dialog.html', 'app/views/modals/symbol-create-modal.html', 'app/views/modals/symbol-edit-modal.html', 'app/views/modals/symbol-group-create-modal.html', 'app/views/modals/symbol-group-edit-modal.html', 'app/views/modals/symbol-move-modal.html', 'app/views/pages/about.html', 'app/views/pages/help.html', 'app/views/pages/home.html', 'app/views/pages/learn-results-compare.html', 'app/views/pages/learn-results-statistics.html', 'app/views/pages/learn-results.html', 'app/views/pages/learn-setup.html', 'app/views/pages/learn-start.html', 'app/views/pages/project-create.html', 'app/views/pages/project-settings.html', 'app/views/pages/project.html', 'app/views/pages/symbols-actions.html', 'app/views/pages/symbols-export.html', 'app/views/pages/symbols-history.html', 'app/views/pages/symbols-import.html', 'app/views/pages/symbols-trash.html', 'app/views/pages/symbols.html', 'app/views/widgets/widget-counter-examples.html', 'app/views/widgets/widget-test-resume-settings.html']);

angular.module("app/views/directives/hypothesis-panel.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/hypothesis-panel.html",
    "<div class=\"hypothesis-panel-container\">\n" +
    "\n" +
    "    <!-- BEGIN: Subnavigation -->\n" +
    "    <div class=\"sub-nav absolute\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "\n" +
    "                <div style=\"display: inline-block;\" ng-show=\"mode === modes.HYPOTHESIS\">\n" +
    "                    <div class=\"btn-group btn-group-xs\" dropdown>\n" +
    "                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" dropdown-toggle>\n" +
    "                            <i class=\"fa fa-bars\"></i>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                            <li>\n" +
    "                                <a href learn-result-details-modal-handle result=\"getCurrentStep()\">\n" +
    "                                    <i class=\"fa fa-info fa-fw\"></i> Details\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li>\n" +
    "                                <a href download-svg=\"#hypothesis-{{index}}\">\n" +
    "                                    <i class=\"fa fa-save fa-fw\"></i>&nbsp; Save as *.svg\n" +
    "                                </a>\n" +
    "                                <a href download-as-json data=\"getCurrentStep().hypothesis\">\n" +
    "                                    <i class=\"fa fa-save fa-fw\"></i>&nbsp; Save as *.json\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <button class=\"btn btn-default btn-xs\" open-hypothesis-layout-settings-modal\n" +
    "                            layout-settings=\"layoutSettings[index]\">\n" +
    "                        <i class=\"fa fa-eye fa-fw\"></i> Layout\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "                <div style=\"display: inline-block;\" ng-if=\"hasInternalDataStructure()\">\n" +
    "                    <button class=\"btn btn-default btn-xs\"\n" +
    "                            ng-show=\"mode === modes.INTERNAL\"\n" +
    "                            ng-click=\"showHypothesis()\">\n" +
    "                        Hypothesis\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default btn-xs\"\n" +
    "                            ng-show=\"mode === modes.HYPOTHESIS\"\n" +
    "                            ng-click=\"showInternalDataStructure()\">\n" +
    "                        Internal\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
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
    "        <hypothesis id=\"hypothesis-{{index}}\" test=\"getCurrentStep()\"\n" +
    "                    layout-settings=\"layoutSettings[index]\"\n" +
    "                    ng-if=\"mode === modes.HYPOTHESIS\"></hypothesis>\n" +
    "\n" +
    "        <observation-table data=\"result[pointer].algorithmInformation\"\n" +
    "                           ng-if=\"mode === modes.INTERNAL && result[pointer].configuration.algorithm === learnAlgorithms.EXTENSIBLE_LSTAR\">\n" +
    "        </observation-table>\n" +
    "\n" +
    "        <discrimination-tree data=\"result[pointer].algorithmInformation\"\n" +
    "                           ng-if=\"mode === modes.INTERNAL && result[pointer].configuration.algorithm === learnAlgorithms.DISCRIMINATION_TREE\">\n" +
    "        </discrimination-tree>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
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

angular.module("app/views/directives/learn-results-panel.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/learn-results-panel.html",
    "<div class=\"hypothesis-panel-container\">\n" +
    "\n" +
    "    <!-- BEGIN: Subnavigation -->\n" +
    "    <div class=\"sub-nav absolute\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "            <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "\n" +
    "                <div style=\"display: inline-block;\" ng-show=\"mode === modes.HYPOTHESIS\">\n" +
    "                    <div class=\"btn-group btn-group-xs\" dropdown dropdown-hover>\n" +
    "                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" dropdown-toggle>\n" +
    "                            <i class=\"fa fa-bars\"></i>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                            <li>\n" +
    "                                <a href learn-result-details-modal-handle result=\"getCurrentStep()\">\n" +
    "                                    <i class=\"fa fa-info fa-fw\"></i> Details\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li>\n" +
    "                                <a href download-svg=\"#hypothesis\">\n" +
    "                                    <i class=\"fa fa-save fa-fw\"></i>&nbsp; Save as *.svg\n" +
    "                                </a>\n" +
    "                                <a href download-as-json data=\"getCurrentStep().hypothesis\">\n" +
    "                                    <i class=\"fa fa-save fa-fw\"></i>&nbsp; Save as *.json\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <button class=\"btn btn-default btn-xs\" open-hypothesis-layout-settings-modal\n" +
    "                            layout-settings=\"layoutSettings\">\n" +
    "                        <i class=\"fa fa-eye fa-fw\"></i> Layout\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "                <div style=\"display: inline-block;\" ng-if=\"hasInternalDataStructure()\">\n" +
    "                    <button class=\"btn btn-default btn-xs\"\n" +
    "                            ng-show=\"mode === modes.INTERNAL\"\n" +
    "                            ng-click=\"showHypothesis()\">\n" +
    "                        Hypothesis\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default btn-xs\"\n" +
    "                            ng-show=\"mode === modes.HYPOTHESIS\"\n" +
    "                            ng-click=\"showInternalDataStructure()\">\n" +
    "                        Internal\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
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
    "                        <span ng-bind=\"pointer + 1\"></span>/<span ng-bind=\"results.length\"></span>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default\" ng-click=\"nextStep()\">\n" +
    "                        <i class=\"fa fa-angle-right fa-fw\"></i>\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default\" ng-click=\"lastStep()\">\n" +
    "                        <i class=\"fa fa-angle-double-right fa-fw\"></i>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: Subnavigation -->\n" +
    "\n" +
    "    <div class=\"hypothesis-panel\">\n" +
    "\n" +
    "        <hypothesis id=\"hypothesis\" test=\"getCurrentStep()\" layout-settings=\"layoutSettings\"\n" +
    "                    ng-if=\"mode === modes.HYPOTHESIS\" && pointer=== results.length - 1></hypothesis>\n" +
    "\n" +
    "        <hypothesis id=\"hypothesis\" test=\"getCurrentStep()\" layout-settings=\"layoutSettings\"\n" +
    "                    counter-example=\"counterExample\"\n" +
    "                    ng-if=\"mode === modes.HYPOTHESIS\" && pointer !== results.length - 1></hypothesis>\n" +
    "\n" +
    "        <observation-table data=\"result[pointer].algorithmInformation\"\n" +
    "                           ng-if=\"mode === modes.INTERNAL && result[pointer].configuration.algorithm === learnAlgorithms.EXTENSIBLE_LSTAR\">\n" +
    "        </observation-table>\n" +
    "\n" +
    "        <discrimination-tree data=\"result[pointer].algorithmInformation\"\n" +
    "                             ng-if=\"mode === modes.INTERNAL && result[pointer].configuration.algorithm === learnAlgorithms.DISCRIMINATION_TREE\">\n" +
    "        </discrimination-tree>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
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
    "                            <li><a ui-sref=\"symbols.trash\">Trash</a></li>\n" +
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
    "<table class=\"table table-condensed obsevation-table\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "            <th ng-repeat=\"th in table.header\" ng-bind=\"::th\"></th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "        <tr ng-repeat=\"tr in table.body track by $index\">\n" +
    "            <td ng-repeat=\"td in tr track by $index\" ng-bind=\"::td\"></td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>");
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

angular.module("app/views/directives/view-heading.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/view-heading.html",
    "<div class=\"view-heading\">\n" +
    "    <div class=\"container\">\n" +
    "        <h2 class=\"view-heading-title\" ng-bind=\"::title\"></h2>\n" +
    "\n" +
    "        <p class=\"view-heading-sub-title\" ng-bind=\"::subTitle\"></p>\n" +
    "    </div>\n" +
    "</div>");
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
    "                    <a class=\"btn btn-default btn-sm\" web-element-picker-handle>\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </a>\n" +
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
    "                    <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.value\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </a>\n" +
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
    "                    <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.node\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </a>\n" +
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
    "                    <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.node\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </a>\n" +
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
    "                        <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.value\">\n" +
    "                    </div>\n" +
    "                    <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.node\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </a>\n" +
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
    "                    <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.node\">\n" +
    "                        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "                    </a>\n" +
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
    "</div>\n" +
    "\n" +
    "<form ng-submit=\"updateAction()\" id=\"action-create-form\">\n" +
    "\n" +
    "    <div class=\"modal-body\">\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: SEARCH_FOR_TEXT -->\n" +
    "        <div ng-if=\"action.type === actionTypes.web.SEARCH_FOR_TEXT\">\n" +
    "\n" +
    "            <h4><strong>Search for Text</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Search on a page for a piece of text or a regular expression\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Value</label>\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.value\">\n" +
    "            </div>\n" +
    "            <div class=\"checkbox\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" ng-model=\"action.regexp\"> Use Regular Expression\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <a class=\"btn btn-default btn-sm\" web-element-picker-handle>\n" +
    "                <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "            </a>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: SEARCH_FOR_TEXT -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: SEARCH_FOR_NODE -->\n" +
    "        <div ng-if=\"action.type === actionTypes.web.SEARCH_FOR_NODE\">\n" +
    "\n" +
    "            <h4><strong>Search for Node</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Search an HTML element in the DOM tree of a page\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">CSS selector</label>\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.value\">\n" +
    "            </div>\n" +
    "\n" +
    "            <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.value\">\n" +
    "                <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "            </a>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: SEARCH_FOR_NODE -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: CLEAR -->\n" +
    "        <div ng-if=\"action.type === actionTypes.web.CLEAR\">\n" +
    "\n" +
    "            <h4><strong>Clear Node</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Clear an element (eg. input or contenteditable element)\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">CSS selector</label>\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "            </div>\n" +
    "\n" +
    "            <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.node\">\n" +
    "                <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "            </a>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: CLEAR -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: CLICK -->\n" +
    "        <div ng-if=\"action.type === actionTypes.web.CLICK\">\n" +
    "\n" +
    "            <h4><strong>Click</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Click on an element\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">CSS selector</label>\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "            </div>\n" +
    "            <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.node\">\n" +
    "                <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "            </a>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: CLICK -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: FILL -->\n" +
    "        <div ng-if=\"action.type === actionTypes.web.FILL\">\n" +
    "\n" +
    "            <h4><strong>Fill Node</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Fill an element with content (eg. input or contenteditable element)\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">CSS selector</label>\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">The value to fill the element with</label>\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.value\">\n" +
    "            </div>\n" +
    "            <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.node\">\n" +
    "                <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "            </a>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: FILL -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: GO_TO -->\n" +
    "        <div ng-if=\"action.type === actionTypes.web.GO_TO\">\n" +
    "\n" +
    "            <h4><strong>Go to URL</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Go to a url that is <strong>relative</strong> to your projects' base url\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">Url</label>\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: GO_TO -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: SUBMIT -->\n" +
    "        <div ng-if=\"action.type === actionTypes.web.SUBMIT\">\n" +
    "\n" +
    "            <h4><strong>Submit Form</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Submit a form\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\">CSS selector</label>\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "            </div>\n" +
    "            <a class=\"btn btn-default btn-sm\" web-element-picker-handle selector=\"action.node\">\n" +
    "                <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "            </a>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: SUBMIT -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: CALL_URL -->\n" +
    "        <div ng-if=\"action.type === actionTypes.rest.CALL_URL\">\n" +
    "\n" +
    "            <h4><strong>Call Url</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">Make a HTTP request to an URL (relative to your projects base url)</p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <select class=\"form-control\" ng-options=\"m for m in ['DELETE', 'GET', 'POST', 'PUT']\"\n" +
    "                        ng-model=\"action.method\">\n" +
    "                    <option value=\"\" disabled>Select a Method</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label>Data</label>\n" +
    "\n" +
    "                <div ng-model=\"action.data\"\n" +
    "                     style=\"border-radius: 4px; width: 100%; height: 150px; border: 1px solid #ccc\"\n" +
    "                     ui-ace=\"{useWrapMode : true, showGutter: true, theme:'eclipse', mode: 'json'}\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: CALL_URL -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "        <div ng-if=\"action.type === actionTypes.rest.CHECK_ATTRIBUTE_EXISTS\">\n" +
    "\n" +
    "            <h4><strong>Check Attribute Exists</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">Check if a JSON attribute exists in the response body</p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\"\n" +
    "                       ng-model=\"action.attribute\">\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: CHECK_ATTRIBUTE_TYPE -->\n" +
    "        <div ng-if=\"action.type === actionTypes.rest.CHECK_ATTRIBUTE_TYPE\">\n" +
    "\n" +
    "            <h4><strong>Check Attribute Type</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">Check if a JSON attribute in the response body has a specific type</p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\"\n" +
    "                       ng-model=\"action.attribute\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <select class=\"form-control\" ng-model=\"action.jsonType\"\n" +
    "                        ng-options=\"t as t for t in ['ARRAY', 'BOOLEAN', 'INTEGER', 'OBJECT', 'NULL', 'STRING']\">\n" +
    "                    <option value=\"\" disabled>Choose a JavaScript type</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: CHECK_ATTRIBUTE_TYPE -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: CHECK_ATTRIBUTE_VALUE -->\n" +
    "        <div ng-if=\"action.type === actionTypes.rest.CHECK_ATTRIBUTE_VALUE\">\n" +
    "\n" +
    "            <h4><strong>Check Attribute Value</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">Check a JSON attribute of the response body to be a specific value</p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\"\n" +
    "                       ng-model=\"action.attribute\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"the attribute value\"\n" +
    "                       ng-model=\"action.value\">\n" +
    "            </div>\n" +
    "            <div class=\"checkbox\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" ng-model=\"action.regexp\"> is regular expression\n" +
    "                </label>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: CHECK_ATTRIBUTE_VALUE -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: CHECK_HEADER_FIELD -->\n" +
    "        <div ng-if=\"action.type === actionTypes.rest.CHECK_HEADER_FIELD\">\n" +
    "\n" +
    "            <h4><strong>Check Header Field</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">Check a HTTP response header field to have a specific value</p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"http header field, e.g. Content-Type\"\n" +
    "                       ng-model=\"action.key\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" type=\"text\"\n" +
    "                       placeholder=\"http header field value, e.g. application/json\" ng-model=\"action.value\">\n" +
    "            </div>\n" +
    "            <div class=\"checkbox\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" ng-model=\"action.regexp\">is regular expression\n" +
    "                </label>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: CHECK_HEADER_FIELD -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: CHECK_HTTP_BODY_TEXT -->\n" +
    "        <div ng-if=\"action.type === actionTypes.rest.CHECK_HTTP_BODY_TEXT\">\n" +
    "\n" +
    "            <h4><strong>Check HTTP Body Text</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">Search for a string or a regular express in the response body of a request</p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" type=\"text\" placeholder=\"value to search for\"\n" +
    "                       ng-model=\"action.value\">\n" +
    "            </div>\n" +
    "            <div class=\"checkbox\">\n" +
    "                <label>\n" +
    "                    <input type=\"checkbox\" ng-model=\"action.regexp\">\n" +
    "                    is regular expression\n" +
    "                </label>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: CHECK_HTTP_BODY_TEXT -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: CHECK_STATUS -->\n" +
    "        <div ng-if=\"action.type === actionTypes.rest.CHECK_STATUS\">\n" +
    "\n" +
    "            <h4><strong>Check Status</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">Check the HTTP response to have a specific status</p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <label>HTTP Status</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" type=\"number\" placeholder=\"e.g. 200, 404 ...\"\n" +
    "                       ng-model=\"action.status\">\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <!-- END: CHECK_STATUS -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: WAIT -->\n" +
    "        <div ng-if=\"action.type === actionTypes.other.WAIT\">\n" +
    "            <h4><strong>Wait</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Wait for a specified amount of time in ms.\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "\n" +
    "            <label>Duration</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"number\" class=\"form-control\" min=\"0\" ng-model=\"action.duration\" placeholder=\"0\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- END: WAIT -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: DECLARE_COUNTER -->\n" +
    "        <div ng-if=\"action.type === actionTypes.other.DECLARE_COUNTER\">\n" +
    "            <h4><strong>Declare Counter</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Declare a counter variable that can be used in other actions\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "            <label>Name</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                       placeholder=\"The name of the counter\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- END: DECLARE_COUNTER -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: DECLARE_VARIABLE -->\n" +
    "        <div ng-if=\"action.type === actionTypes.other.DECLARE_VARIABLE\">\n" +
    "            <h4><strong>Declare Variable</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Declare a variable that can be used in other actions\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "            <label>Name</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                       placeholder=\"The name of the variable\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- END: DECLARE_VARIABLE -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: INCREMENT_COUNTER -->\n" +
    "        <div ng-if=\"action.type === actionTypes.other.INCREMENT_COUNTER\">\n" +
    "            <h4><strong>Increment Counter</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Increment an <strong>already declared</strong> counter variable\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "            <label>Name</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                       placeholder=\"The name of the counter\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- END: INCREMENT_COUNTER -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: SET_COUNTER -->\n" +
    "        <div ng-if=\"action.type === actionTypes.other.SET_COUNTER\">\n" +
    "            <h4><strong>Set Counter</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Set the value of an <strong>already declared</strong> counter variable\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "            <label>Name</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                       placeholder=\"The name of the counter\">\n" +
    "            </div>\n" +
    "            <label>Value</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"number\" class=\"form-control\" ng-model=\"action.value\" placeholder=\"0\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- END: SET_COUNTER -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: SET_VARIABLE -->\n" +
    "        <div ng-if=\"action.type === actionTypes.other.SET_VARIABLE\">\n" +
    "            <h4><strong>Set Variable</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Set the value of an <strong>already declared</strong> variable\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "            <label>Name</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                       placeholder=\"The name of the variable\">\n" +
    "            </div>\n" +
    "            <label>Value</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" ng-model=\"action.value\" placeholder=\"The value of the variable\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- END: SET_VARIABLE -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: SET_VARIABLE_BY_JSON_ATTRIBUTE -->\n" +
    "        <div ng-if=\"action.type === actionTypes.other.SET_VARIABLE_BY_JSON_ATTRIBUTE\">\n" +
    "            <h4><strong>Set Variable By JSON Attribute</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Set the value of an <strong>already declared</strong> variable to the content of a JSON\n" +
    "                attribute\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "            <label>Name</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                       placeholder=\"The name of the variable\">\n" +
    "            </div>\n" +
    "            <label>Attribute</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" ng-model=\"action.value\" placeholder=\"The JSON attribute\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- END: SET_VARIABLE_BY_JSON_ATTRIBUTE -->\n" +
    "\n" +
    "\n" +
    "        <!-- BEGIN: SET_VARIABLE_BY_NODE -->\n" +
    "        <div ng-if=\"action.type === actionTypes.other.SET_VARIABLE_BY_NODE\">\n" +
    "            <h4><strong>Set Variable By Node Value</strong></h4>\n" +
    "\n" +
    "            <p class=\"text-muted\">\n" +
    "                Set the value of an <strong>already declared</strong> variable to the content of a HTML element\n" +
    "            </p>\n" +
    "            <hr>\n" +
    "            <label>Name</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "                       placeholder=\"The name of the variable\">\n" +
    "            </div>\n" +
    "            <label>XPath</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" ng-model=\"action.value\" placeholder=\"The CSS3 XPath to the element\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- END: SET_VARIABLE_BY_JSON_ATTRIBUTE -->\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary btn-sm\" type=\"submit\">Update</button>\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
}]);

angular.module("app/views/modals/confirm-dialog.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/confirm-dialog.html",
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

angular.module("app/views/modals/hypothesis-layout-settings-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/hypothesis-layout-settings-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"close()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "    <h3 class=\"modal-title\">Hypothesis Layout Settings</h3>\n" +
    "    <span class=\"text-muted\">Edit the settings for the presentation of the hypothesis</span>\n" +
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
    "</div>");
}]);

angular.module("app/views/modals/learn-result-details-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/learn-result-details-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
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
    "            <td ng-bind=\"result.testNo\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>nth Hypothesis</td>\n" +
    "            <td ng-bind=\"result.stepNo\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Started</td>\n" +
    "            <td ng-bind=\"(result.statistics.startTime | date : 'EEE, dd.MM.yyyy, HH:mm')\"></td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr class=\"active\">\n" +
    "            <td colspan=\"2\"><strong>Configuration</strong></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Algorithm</td>\n" +
    "            <td ng-bind=\"(result.configuration.algorithm | formatAlgorithm)\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>EQ Oracle</td>\n" +
    "            <td ng-bind=\"(result.configuration.eqOracle.type | formatEqOracle)\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Steps to Learn</td>\n" +
    "            <td ng-bind=\"result.configuration.maxAmountOfStepsToLearn\"></td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr class=\"active\">\n" +
    "            <td colspan=\"2\"><strong>Numbers</strong></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>Duration</td>\n" +
    "            <td><span ng-bind=\"result.statistics.duration\"></span> ms</td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>#Membership Queries</td>\n" +
    "            <td ng-bind=\"result.statistics.mqsUsed\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>#Equivalence Queries</td>\n" +
    "            <td ng-bind=\"result.statistics.eqsUsed\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>#Symbol Calls</td>\n" +
    "            <td ng-bind=\"result.statistics.symbolsUsed\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td>|Sigma|</td>\n" +
    "            <td ng-bind=\"result.sigma.length\"></td>\n" +
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
    "                ng-options=\"(k|formatAlgorithm) for (k,v) in learnAlgorithms\">\n" +
    "				<option value=\"\" disabled>select an algorithm</option>\n" +
    "			</select>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"control-label\">EQ Oracle</label><br> <span\n" +
    "				class=\"text-muted\">Select how counter examples should be\n" +
    "				found</span> <select class=\"form-control\" ng-model=\"selectedEqOracle\"\n" +
    "                                     ng-options=\"(v|formatEqOracle) for (k,v) in eqOracles\">\n" +
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

angular.module("app/views/modals/prompt-dialog.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/prompt-dialog.html",
    "<div class=\"modal-header\">\n" +
    "    <h4 ng-bind=\"text\"></h4>\n" +
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
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"errorMsg\" ng-bind=\"errorMsg\"></div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary btn-sm\" type=\"submit\">Create</button>\n" +
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
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"errorMsg\" ng-bind=\"errorMsg\"></div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <button class=\"btn btn-primary btn-sm\" type=\"submit\">Update</button>\n" +
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
    "\n" +
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"errorMsg\" ng-bind=\"errorMsg\"></div>\n" +
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
    "\n" +
    "        <div class=\"alert alert-danger alert-condensed\" ng-show=\"errorMsg\" ng-bind=\"errorMsg\"></div>\n" +
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
    "    <button class=\"btn btn-sm btn-primary\" ng-click=\"moveSymbols()\">Move</button>\n" +
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
    "            <div class=\"alert alert-info\" ng-if=\"projects.length == 0\">\n" +
    "                You haven't created a project yet. You can create a new one <a href=\"#/project/create\">here</a> and\n" +
    "                start\n" +
    "                testing it.\n" +
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
    "<div style=\"position: absolute; width: 100%; top: 42px; bottom: 0; overflow: auto;\">\n" +
    "    <div panel-manager=\"panels\">\n" +
    "\n" +
    "        <div panel panel-index=\"$index\" ng-repeat=\"result in panels track by $index\">\n" +
    "\n" +
    "            <div ng-if=\"result\">\n" +
    "                <hypothesis-slideshow-panel panel-index=\"{{$index}}\" result=\"result\"></hypothesis-slideshow-panel>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-if=\"!result\" style=\"padding: 30px\">\n" +
    "\n" +
    "                <ul class=\"list-group\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"result in results\"\n" +
    "                        ng-click=\"fillPanel(result, $parent.$index)\">\n" +
    "\n" +
    "                        <strong>Test No\n" +
    "                            <span ng-bind=\"result.testNo\"></span>\n" +
    "                        </strong>,\n" +
    "                        [<span ng-bind=\"(result.configuration.algorithm|formatAlgorithm)\"></span>]\n" +
    "\n" +
    "                        <br>\n" +
    "\n" +
    "                        <p class=\"text-muted\">\n" +
    "                            Started: <span\n" +
    "                                ng-bind=\"(result.statistics.startTime | date : 'EEE, dd.MM.yyyy, HH:mm')\"></span>\n" +
    "                        </p>\n" +
    "\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"panels.length == 0\" style=\"padding-top: 30px\">\n" +
    "            <div class=\"container\">\n" +
    "                <div class=\"alert alert-info\">\n" +
    "                    Add a panel by clicking on the grey area on the right and select a test.\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
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
    "        <div ng-show=\"selectedChartMode === null\">\n" +
    "\n" +
    "            <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "                <input type=\"checkbox\" selection-checkbox-all items=\"results\">\n" +
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
    "        <div ng-show=\"selectedChartMode !== null\">\n" +
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
    "                <button class=\"btn btn-default btn-xs\" ng-click=\"fullWidth = !fullWidth\" dispatch-resize=\"20\">\n" +
    "                    <i class=\"fa fa-fw\" ng-class=\"fullWidth ? 'fa-compress' : 'fa-expand'\"></i>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\" ng-style=\"fullWidth ? {'width':'100%'} : {}\">\n" +
    "\n" +
    "        <div class=\"selectable-list\" ng-show=\"selectedChartMode === null\">\n" +
    "            <div ng-repeat=\"result in results\"\n" +
    "                 selection-model\n" +
    "                 selection-model-type=\"checkbox\"\n" +
    "                 selection-model-selected-attribute=\"_selected\"\n" +
    "                 selection-model-mode=\"multiple\"\n" +
    "                 selection-model-selected-items=\"selectedResults\"\n" +
    "                 selection-model-cleanup-strategy=\"deselect\">\n" +
    "\n" +
    "                <div selectable-list-item>\n" +
    "\n" +
    "                    <strong>Test No\n" +
    "                        <span ng-bind=\"result.testNo\"></span>\n" +
    "                    </strong>,\n" +
    "                    [<span ng-bind=\"(result.configuration.algorithm|formatAlgorithm)\"></span>]\n" +
    "\n" +
    "                    <div class=\"text-muted\">\n" +
    "                        Started: <span ng-bind=\"(result.statistics.startTime | date : 'EEE, dd.MM.yyyy, HH:mm')\"></span>\n" +
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
    "                        ng-class=\"selectedChartProperty === chartProperties.MQS ? 'btn-primary':'btn-default'\"\n" +
    "                        ng-click=\"selectChartProperty(chartProperties.MQS)\">\n" +
    "                    #MQs\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-xs\"\n" +
    "                        ng-class=\"selectedChartProperty === chartProperties.EQS ? 'btn-primary':'btn-default'\"\n" +
    "                        ng-click=\"selectChartProperty(chartProperties.EQS)\">\n" +
    "                    #EQs\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-xs\"\n" +
    "                        ng-class=\"selectedChartProperty === chartProperties.SYMBOL_CALLS ? 'btn-primary':'btn-default'\"\n" +
    "                        ng-click=\"selectChartProperty(chartProperties.SYMBOL_CALLS)\">\n" +
    "                    #Called Symbols\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-xs\"\n" +
    "                        ng-class=\"selectedChartProperty === chartProperties.SIGMA ? 'btn-primary':'btn-default'\"\n" +
    "                        ng-click=\"selectChartProperty(chartProperties.SIGMA)\">\n" +
    "                    |Sigma|\n" +
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
    "        <div class=\"alert alert-info\" ng-show=\"results.length === 0\">\n" +
    "            You have not run any tests yet.\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/pages/learn-results.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/learn-results.html",
    "<div view-heading\n" +
    "     title=\"Test Results\"\n" +
    "     sub-title=\"Have a look at all the tests you ran for this project\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:115,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"results\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" ng-click=\"deleteResults()\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\" selectable items=\"results\">\n" +
    "\n" +
    "        <div class=\"selectable-list\">\n" +
    "            <div ng-repeat=\"result in results\"\n" +
    "                 selection-model\n" +
    "                 selection-model-type=\"checkbox\"\n" +
    "                 selection-model-selected-attribute=\"_selected\"\n" +
    "                 selection-model-mode=\"multiple\"\n" +
    "                 selection-model-selected-items=\"selectedResults\"\n" +
    "                 selection-model-cleanup-strategy=\"deselect\">\n" +
    "\n" +
    "                <div selectable-list-item>\n" +
    "                    <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                        <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                            <i class=\"fa fa-bars\"></i>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                            <li>\n" +
    "                                <a href learn-result-details-modal-handle result=\"result\">\n" +
    "                                    <i class=\"fa fa-info fa-fw\"></i> Details\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a ui-sref=\"learn.results.compare({testNos: [result.testNo]})\">\n" +
    "                                    <i class=\"fa fa-code-fork fa-fw\"></i> Hypotheses\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li>\n" +
    "                                <a href=\"\" ng-click=\"deleteResult(result)\">\n" +
    "                                    <i class=\"fa fa-trash fa-fw\"></i> Delete\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <strong>Test No\n" +
    "                        <span ng-bind=\"result.testNo\"></span>\n" +
    "                    </strong>,\n" +
    "                    [<span ng-bind=\"(result.configuration.algorithm | formatAlgorithm)\"></span>]\n" +
    "\n" +
    "                    <div class=\"text-muted\">\n" +
    "                        Started: <span ng-bind=\"(result.statistics.startTime | date : 'EEE, dd.MM.yyyy, HH:mm')\"></span>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-info\" ng-if=\"results.length === 0\">\n" +
    "            You have not run any tests yet or the active one is not finished.\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
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
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"getAllSymbols\">\n" +
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
    "\n" +
    "        <div class=\"alert alert-info alert-condensed clearfix\">\n" +
    "            <button class=\"btn btn-xs btn-info pull-right\" open-learn-setup-settings-modal\n" +
    "                    learn-configuration=\"learnConfiguration\" on-ok=\"updateLearnConfiguration\">\n" +
    "                <i class=\"fa fa-gear\"></i>\n" +
    "            </button>\n" +
    "\n" +
    "            <p>\n" +
    "                Using algorithm <strong ng-bind=\"(learnConfiguration.algorithm | formatAlgorithm)\"></strong>\n" +
    "                with EQ-Oracle <strong ng-bind=\"(learnConfiguration.eqOracle.type | formatEqOracle)\"></strong>\n" +
    "                <span ng-if=\"learnConfiguration.eqOracle.type === 'complete'\">\n" +
    "                    (min-depth: <span ng-bind=\"learnConfiguration.eqOracle.minDepth\"></span>, max-depth: <span\n" +
    "                        ng-bind=\"learnConfiguration.eqOracle.maxDepth\"></span>)\n" +
    "                </span>\n" +
    "                <span ng-if=\"learnConfiguration.eqOracle.type === 'random_word'\">\n" +
    "                    (\n" +
    "                    min-length: <span ng-bind=\"learnConfiguration.eqOracle.minLength\"></span>,\n" +
    "                    max-length: <span ng-bind=\"learnConfiguration.eqOracle.maxLength\"></span>,\n" +
    "                    #words: <span ng-bind=\"learnConfiguration.eqOracle.maxNoOfTests\"></span>\n" +
    "                    )\n" +
    "                </span>\n" +
    "            </p>\n" +
    "\n" +
    "            <p ng-show=\"resetSymbol === null\">\n" +
    "                <em>Please select a reset symbol by clicking on the blue circle</em>\n" +
    "            </p>\n" +
    "\n" +
    "            <p ng-show=\"resetSymbol !== null\">\n" +
    "                Reset symbol is <strong ng-bind=\"resetSymbol.name\"></strong>\n" +
    "            </p>\n" +
    "\n" +
    "        </div>\n" +
    "        <hr>\n" +
    "\n" +
    "        <div ng-repeat=\"group in groups\" class=\"symbol-group\"\n" +
    "             ng-class=\"group._isCollapsed ? 'collapsed' :''\">\n" +
    "\n" +
    "            <div class=\"selectable-list symbol-group-header\">\n" +
    "                <div class=\"selectable-list-heading\">\n" +
    "                    <div class=\"selectable-list-control\">\n" +
    "                        <input type=\"checkbox\" selection-checkbox-all items=\"group.symbols\">\n" +
    "                    </div>\n" +
    "                    <div class=\"selectable-list-content\">\n" +
    "\n" +
    "                        <span class=\"pull-right\" ng-click=\"group._isCollapsed = !group._isCollapsed\">\n" +
    "                        <i class=\"fa fa-fw\"\n" +
    "                           ng-class=\"group._isCollapsed ? 'fa-chevron-down' : 'fa-chevron-right'\"></i>\n" +
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
    "                <div class=\"selectable-list\">\n" +
    "                    <div ng-repeat=\"symbol in group.symbols | orderBy:'-name':true\"\n" +
    "                         selection-model\n" +
    "                         selection-model-type=\"checkbox\"\n" +
    "                         selection-model-selected-attribute=\"_selected\"\n" +
    "                         selection-model-mode=\"multiple\"\n" +
    "                         selection-model-selected-items=\"selectedSymbols\"\n" +
    "                         selection-model-cleanup-strategy=\"deselect\">\n" +
    "\n" +
    "                        <div selectable-list-item>\n" +
    "                            <a class=\"pull-right\" ng-click=\"setResetSymbol(symbol)\">\n" +
    "                                <i class=\"fa\" ng-class=\"resetSymbol == symbol ? 'fa-circle' : 'fa-circle-thin'\"></i>\n" +
    "                            </a>\n" +
    "\n" +
    "                            <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]<br>\n" +
    "\n" +
    "                            <a ui-sref=\"symbols.actions({symbolId:symbol.id})\">\n" +
    "                                <span ng-bind=\"symbol.actions.length\"></span> Actions <i class=\"fa fa-edit\"></i>\n" +
    "                            </a>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/pages/learn-start.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/learn-start.html",
    "<div style=\"position: absolute; width: 100%; top: 42px; bottom: 0; overflow: auto;\">\n" +
    "\n" +
    "    <div ng-if=\"active == true\" class=\"container\" style=\"margin-top: 54px\">\n" +
    "        <div class=\"alert alert-info\">\n" +
    "            <i class=\"fa fa-circle-o-notch fa-spin\"></i>&nbsp; Application is learning ... <br>\n" +
    "        </div>\n" +
    "        <hr>\n" +
    "        <button class=\"btn btn-default btn-xs pull-right\" ng-click=\"abort()\">\n" +
    "            <i class=\"fa fa-close fa-fw\"></i> Abort\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"!active && results.length > 0\">\n" +
    "\n" +
    "        <div class=\"panel-sidebar\">\n" +
    "\n" +
    "            <p>\n" +
    "                <br>\n" +
    "                <button class=\"btn btn-primary btn-sm btn-block\" ng-click=\"resumeLearning()\">Resume</button>\n" +
    "            </p>\n" +
    "\n" +
    "            <div widget widget-title=\"Configuration\" collapsed=\"false\">\n" +
    "                <div widget-test-resume-settings configuration=\"_.last(results).configuration\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div widget widget-title=\"Counter Examples\" collapsed=\"true\"\n" +
    "                 ng-if=\"_.last(results).configuration.eqOracle.type === 'sample'\">\n" +
    "                <div widget-counter-examples counter-examples=\"_.last(results).configuration.eqOracle.counterExamples\"\n" +
    "                     counter-example=\"counterExample\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div learn-results-panel results=\"results\" counter-example=\"counterExample\"></div>\n" +
    "\n" +
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
    "<div view-heading\n" +
    "     title=\"Actions\"\n" +
    "     sub-title=\"Create and manage the actions for symbol: {{symbol.name}}\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:115,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\" selectable=\"symbol.actions\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"symbol.actions\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" action-create-modal-handle on-created=\"addAction\">\n" +
    "                Create\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" action-edit-modal-handle action=\"(selectedActions | first)\"\n" +
    "                    on-updated=\"updateAction\"\n" +
    "                    ng-class=\"selectedActions.length !== 1 ? 'disabled': ''\">\n" +
    "                Edit\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"deleteSelectedActions()\"\n" +
    "                    ng-class=\"selectedActions.length === 0 ? 'disabled': ''\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-default btn-xs\" ng-click=\"revertChanges()\">Reset</button>\n" +
    "            <button class=\"btn btn-success btn-xs\" ng-click=\"saveChanges()\">Save</button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div ng-if=\"symbol.actions\" as-sortable ng-model=\"symbol.actions\">\n" +
    "            <div class=\"selectable-list\">\n" +
    "                <div ng-repeat=\"action in symbol.actions\"\n" +
    "                     selection-model\n" +
    "                     selection-model-type=\"checkbox\"\n" +
    "                     selection-model-selected-attribute=\"_selected\"\n" +
    "                     selection-model-mode=\"multiple\"\n" +
    "                     selection-model-selected-items=\"selectedActions\"\n" +
    "                     selection-model-cleanup-strategy=\"deselect\"\n" +
    "                     as-sortable-item>\n" +
    "\n" +
    "                    <div selectable-list-item>\n" +
    "\n" +
    "                        <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover>\n" +
    "                            <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                                <i class=\"fa fa-bars\"></i>\n" +
    "                            </button>\n" +
    "                            <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                                <li>\n" +
    "                                    <a href action-edit-modal-handle action=\"action\" on-updated=\"updateAction\">\n" +
    "                                        <i class=\"fa fa-edit fa-fw\"></i> Edit\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                                <li>\n" +
    "                                    <a href ng-click=\"deleteAction(action)\">\n" +
    "                                        <i class=\"fa fa-trash fa-fw\"></i> Delete\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <span class=\"text-muted pull-right\" as-sortable-item-handle\n" +
    "                              style=\"margin-right: 15px; padding: 2px;\">\n" +
    "                            <i class=\"fa fa-sort fa-fw\"></i>\n" +
    "                        </span>\n" +
    "\n" +
    "                        <span ng-bind=\"action.toString()\"></span>\n" +
    "\n" +
    "                    </div>\n" +
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
    "<div view-heading\n" +
    "     title=\"Symbols History\"\n" +
    "     sub-title=\"Restore and older version of a symbol\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"selectable-list\">\n" +
    "            <div class=\"selectable-list-item\" ng-repeat=\"revision in revisions | orderBy:'-revision':false \">\n" +
    "                <div class=\"selectable-list-content\" style=\"margin-left: 5px\">\n" +
    "\n" +
    "                    <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover ng-if=\"$index !== 0\">\n" +
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
    "                    <span class=\"label label-primary pull-right\" ng-show=\"$index === 0\">Latest</span>\n" +
    "\n" +
    "                    <strong ng-bind=\"revision.name\"></strong> [<span ng-bind=\"revision.abbreviation\"></span>], Rev. {{revision.revision}}\n" +
    "\n" +
    "                    <p class=\"text-muted\">\n" +
    "                        <a href ng-click=\"revision._collapsed = !revision._collapsed\">\n" +
    "                            <span ng-bind=\"revision.actions.length\"></span>\n" +
    "                            Actions\n" +
    "                            <i class=\"fa fa-fw\" ng-class=\"revision._collapsed ? 'fa-chevron-down': 'fa-chevron-right'\"></i>\n" +
    "                        </a>\n" +
    "\n" +
    "                        <ol collapse=\"!revision._collapsed\">\n" +
    "                            <li ng-repeat=\"action in revision.actions\">\n" +
    "                                {{action.toString()}}\n" +
    "                            </li>\n" +
    "                        </ol>\n" +
    "                    </p>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
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
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"symbols\">\n" +
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
    "        <div class=\"alert alert-info\" ng-show=\"symbols.length === 0\">\n" +
    "            There aren't any deleted symbols.\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"selectable-list\" ng-if=\"symbols.length > 0\">\n" +
    "            <div ng-repeat=\"symbol in symbols | orderBy:'-name':true\"\n" +
    "                 selection-model\n" +
    "                 selection-model-type=\"checkbox\"\n" +
    "                 selection-model-selected-attribute=\"_selected\"\n" +
    "                 selection-model-mode=\"multiple\"\n" +
    "                 selection-model-selected-items=\"selectedSymbols\"\n" +
    "                 selection-model-cleanup-strategy=\"deselect\">\n" +
    "\n" +
    "                <div selectable-list-item>\n" +
    "                    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"recoverSymbol(symbol)\">\n" +
    "                        <i class=\"fa fa-rotate-left fa-fw\"></i>\n" +
    "                    </a>\n" +
    "\n" +
    "                    <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "                    <div class=\"text-muted\">\n" +
    "                        <span ng-bind=\"symbol.actions.length\"></span> Actions\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
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
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"getAllSymbols\">\n" +
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
    "            <button class=\"btn btn-xs btn-default\" ng-class=\"selectedSymbols.length === 1 ? '' : 'disabled'\"\n" +
    "                    symbol-edit-modal-handle symbol=\"selectedSymbols[0]\" on-updated=\"updateSymbol\">\n" +
    "                Edit\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" symbol-move-modal-handle groups=\"groups\" symbols=\"selectedSymbols\"\n" +
    "                    on-moved=\"moveSymbolsToGroup\" ng-class=\"selectedSymbols.length > 0 ? '' : 'disabled'\">\n" +
    "                Move\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-class=\"selectedSymbols.length > 0 ? '' : 'disabled'\"\n" +
    "                    ng-click=\"deleteSelectedSymbols()\">\n" +
    "                Delete\n" +
    "            </button>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-right\">\n" +
    "            <button class=\"btn btn-xs btn-default\" ng-click=\"toggleCollapseAllGroups()\">\n" +
    "                <i class=\"fa fa-fw\" ng-class=\"groupsCollapsed ? 'fa-chevron-down': 'fa-chevron-right'\"></i>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"view-body\">\n" +
    "    <div class=\"container symbol-group-list\">\n" +
    "\n" +
    "        <div ng-repeat=\"group in groups track by $index\" class=\"symbol-group\"\n" +
    "             ng-class=\"group._collapsed ? 'collapsed' :''\">\n" +
    "\n" +
    "            <div class=\"selectable-list symbol-group-header\">\n" +
    "                <div class=\"selectable-list-heading\">\n" +
    "                    <div class=\"selectable-list-control\">\n" +
    "                        <input type=\"checkbox\" selection-checkbox-all items=\"group.symbols\">\n" +
    "                    </div>\n" +
    "                    <div class=\"selectable-list-content\">\n" +
    "\n" +
    "                        <span class=\"pull-right\" ng-click=\"group._collapsed = !group._collapsed\">\n" +
    "                            <i class=\"fa fa-fw\"\n" +
    "                               ng-class=\"group._collapsed ? 'fa-chevron-down' : 'fa-chevron-right'\"></i>\n" +
    "                        </span>\n" +
    "\n" +
    "                        <a href class=\"pull-right\" style=\"margin-right: 15px\" symbol-group-edit-modal-handle\n" +
    "                           group=\"group\" on-updated=\"updateGroup\" on-deleted=\"deleteGroup\">\n" +
    "                            <i class=\"fa fa-fw fa-gear\"></i>\n" +
    "                        </a>\n" +
    "\n" +
    "                        <h3 class=\"symbol-group-title\" ng-bind=\"group.name\"\n" +
    "                            ng-click=\"group._collapsed = !group._collapsed\"></h3>\n" +
    "\n" +
    "                        <p class=\"text-muted\">\n" +
    "                            <span ng-bind=\"group.symbols.length\"></span> Symbols\n" +
    "                        </p>\n" +
    "\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"symbol-group-body\" collapse=\"group._collapsed\">\n" +
    "                <div class=\"selectable-list\">\n" +
    "                    <div ng-repeat=\"symbol in group.symbols | orderBy:'-name':true\"\n" +
    "                         selection-model\n" +
    "                         selection-model-type=\"checkbox\"\n" +
    "                         selection-model-selected-attribute=\"_selected\"\n" +
    "                         selection-model-mode=\"multiple\"\n" +
    "                         selection-model-selected-items=\"selectedSymbols\"\n" +
    "                         selection-model-cleanup-strategy=\"deselect\"\n" +
    "                         ng-if=\"!symbol.hidden\">\n" +
    "\n" +
    "                        <div selectable-list-item>\n" +
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
    "                                        <a href symbol-move-modal-handle groups=\"groups\" symbols=\"[symbol]\"\n" +
    "                                           on-moved=\"moveSymbolsToGroup\">\n" +
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
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/widgets/widget-counter-examples.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/widgets/widget-counter-examples.html",
    "<form class=\"form form-condensed\" ng-submit=\"addCounterExample()\">\n" +
    "    <p class=\"text-muted\">\n" +
    "        Click on the labels of the hypothesis\n" +
    "    </p>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"input\" ng-model=\"newCounterExample.input\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\" placeholder=\"output\" ng-model=\"newCounterExample.output\">\n" +
    "    </div>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <button class=\"btn btn-primary btn-xs\">Add</button>\n" +
    "        <a href class=\"btn btn-default btn-xs\" ng-click=\"testCounterExample(counterExample)\">Test</a>\n" +
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

        function stateChangeStart(event, toState, toParams, fromState, fromParams) {
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
            DISCRIMINATION_TREE: 'DISCRIMINATION_TREE',
            TTT : 'TTT'
        })
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateModalController', ActionCreateModalController);

    ActionCreateModalController.$inject = ['$scope', '$modalInstance', 'actionTypes', 'Action'];

    /**
     * The controller for the modal dialog that handles the creation of a new action.
     *
     * The template can be found at 'views/modals/action-create-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param actionTypes
     * @param Action
     * @constructor
     */
    function ActionCreateModalController($scope, $modalInstance, actionTypes, Action) {

        /**
         * The constant for action type names
         * @type {Object}
         */
        $scope.actionTypes = actionTypes;

        /**
         * The model for the new action
         * @type {null|Object}
         */
        $scope.action = null;

        /**
         * Creates a new instance of an Action by a type that was clicked in the modal dialog.
         *
         * @param {string} type - The type of the action that should be created
         */
        $scope.selectNewActionType = function (type) {
            $scope.action = Action.createByType(type);
        };

        /**
         * Closes the modal dialog an passes the created action back to the handle that called the modal
         */
        $scope.createAction = function () {
            $modalInstance.close($scope.action);
        };

        /**
         * Closes the modal dialog without passing any data
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        };
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionEditModalController', ActionEditModalController);

    ActionEditModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'actionTypes', 'Action'];

    /**
     * The controller for the modal dialog that handles the editing of an action.
     *
     * The template can be found at 'views/modals/action-edit-modal.html'.
     *
     * @param $scope - The controllers scope
     * @param $modalInstance - The model instance
     * @param modalData - The data that is passed to this controller
     * @param actionTypes - The constant for action type names
     * @param Action - The Action model
     * @constructor
     */
    function ActionEditModalController($scope, $modalInstance, modalData, actionTypes, Action) {

        /**
         * The constant for actions type names
         * @type {Object}
         */
        $scope.actionTypes = actionTypes;

        /**
         * The copy of the action that should be edited
         * @type {Object}
         */
        $scope.action = angular.copy(modalData.action);

        /**
         * Close the modal dialog and pass the updated action to the handle that called it
         */
        $scope.updateAction = function () {

            // because actions are identified by temporary id
            // a new action has to be build and given the old id manually
            var id = $scope.action._id;
            $scope.action = Action.build($scope.action);
            $scope.action._id = id;
            $modalInstance.close($scope.action);
        };

        /**
         * Close the modal dialog without passing any data
         */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ConfirmDialogController', ConfirmDialogController);

    ConfirmDialogController.$inject = ['$scope', '$modalInstance', 'modalData'];

    /**
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
        .controller('LearnResultDetailsModalController', LearnResultDetailsModalController);

    LearnResultDetailsModalController.$inject = ['$scope', '$modalInstance', 'modalData'];

    /**
     * The controller that is used to display the details of a learn result in a modal dialog. The data that is passed
     * to this controller should be an object with a property 'result' which contains a learn result object. If none is
     * given, nothing will be displayed.
     *
     * The template can be found at 'views/learn-result-details-modal.html'.
     *
     * @param $scope - The controllers scope
     * @param $modalInstance - The ui.bootstrap $modalInstance service
     * @param modalData - The data that is passed to the controller from its handle
     * @constructor
     */
    function LearnResultDetailsModalController($scope, $modalInstance, modalData) {

        /**
         * The learn result whose details should be displayed
         * @type {LearnResult}
         */
        $scope.result = modalData.result;

        /**
         * Close the modal dialog without passing any data
         */
        $scope.ok = function () {
            $modalInstance.dismiss();
        }
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
        .controller('PromptDialogController', PromptDialogController);

    PromptDialogController.$inject = ['$scope', '$modalInstance', 'modalData'];

    /**
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

    SymbolCreateModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'Symbol', 'SymbolGroup', 'ToastService'
    ];

    /**
     * Handles the behaviour of the modal to create a new symbol.
     *
     * The template for this modal can found at 'app/partials/modals/symbol-create-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SymbolGroup
     * @constructor
     */
    function SymbolCreateModalController($scope, $modalInstance, modalData, Symbol, SymbolGroup, Toast) {

        // the id of the project the new symbol is created for
        var projectId = null;

        /**
         * The model of the symbol that will be created
         * @type {Symbol}
         */
        $scope.symbol = new Symbol();

        /**
         * An error message that can be displayed in the template
         * @type {String|null}
         */
        $scope.errorMsg = null;

        /**
         * The list of available symbol groups where the new symbol could be created in
         * @type {SymbolGroup[]}
         */
        $scope.groups = [];

        /**
         * The symbol group that is selected
         * @type {null|SymbolGroup}
         */
        $scope.selectedGroup = null;

        // parameter validation &
        // fetch all symbol groups so that they can be selected in the template
        (function init() {
            if (angular.isUndefined(modalData.projectId)) {
                throw new Error('required parameter projectId not defined');
            } else {
                projectId = modalData.projectId;
                SymbolGroup.Resource.getAll(projectId)
                    .then(function (groups) {
                        $scope.groups = groups;
                    });
            }
        }());

        /**
         * Makes a request to the API and create a new symbol. If the name of the group the user entered was not found
         * the symbol will be put in the default group with the id 0. Closes the modal on success.
         */
        $scope.createSymbol = function () {
            $scope.errorMsg = null;

            var group = _.find($scope.groups, {name: $scope.selectedGroup});

            $scope.symbol.group = angular.isDefined(group) ? group.id : 0;

            Symbol.Resource.create(projectId, $scope.symbol)
                .then(function (newSymbol) {
                    Toast.success('Created symbol <strong>' + newSymbol.name + '</strong>');
                    $modalInstance.close(newSymbol);
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message
                })
        };

        /** Closes the modal dialog */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolEditModalController', SymbolEditModalController);

    SymbolEditModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'Symbol', 'SelectionService', 'ToastService'
    ];

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
    function SymbolEditModalController($scope, $modalInstance, modalData, Symbol, SelectionService, Toast) {

        /** The symbol that is passed to the modal. @type {Symbol} */
        $scope.symbol = modalData.symbol;

        $scope.errorMsg = null;

        // The copy of the symbol that will be passed back together with the updated one
        var copy = $scope.symbol.copy();

        /**
         * Make a request to the API in order to update the symbol. Close the modal on success.
         */
        $scope.updateSymbol = function () {
            $scope.errorMsg = null;

            // remove the selection from the symbol in case there is any
            SelectionService.removeSelection($scope.symbol);

            // update the symbol and close the modal dialog on success with the updated symbol
            Symbol.Resource.update($scope.symbol.project, $scope.symbol)
                .then(function (updatedSymbol) {
                    Toast.success('Symbol updated');
                    $modalInstance.close({
                        new: updatedSymbol,
                        old: copy
                    });
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message;
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

    SymbolGroupCreateModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'SymbolGroup', '_', 'ToastService'
    ];

    /**
     * The controller for the modal dialog that handles the creation of a new symbol group.
     *
     * The template can be found at 'views/modals/symbol-create-modal.html'
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param SymbolGroup
     * @param _
     * @param Toast
     * @constructor
     */
    function SymbolGroupCreateModalController($scope, $modalInstance, modalData, SymbolGroup, _, Toast) {

        // the id of the project where the new symbol group should be created in
        var projectId = modalData.projectId;

        /**
         * The new symbol group
         * @type {SymbolGroup}
         */
        $scope.group = new SymbolGroup();

        /**
         * The list of all existing symbol groups. They are used in order to check if the name of the new symbol group
         * already exists
         * @type {Array}
         */
        $scope.groups = [];

        /**
         * An error message that can be displayed in the modal template
         * @type {String|null}
         */
        $scope.errorMsg = null;

        // load all existing symbol groups
        (function init() {
            SymbolGroup.Resource.getAll(projectId)
                .then(function (groups) {
                    $scope.groups = groups;
                });
        }());

        /**
         * Creates a new symbol group and closes the modal on success and passes the newly created symbol group
         */
        $scope.createGroup = function () {
            $scope.errorMsg = null;

            var index = _.findIndex($scope.groups, {name: $scope.group.name});

            if (index === -1) {
                SymbolGroup.Resource.create(projectId, $scope.group)
                    .then(function (newGroup) {
                        Toast.success('Symbol group <strong>' + newGroup.name + '</strong> created');
                        $modalInstance.close(newGroup);
                    })
                    .catch(function (response) {
                        $scope.errorMsg = response.data.message;
                    });
            } else {
                $scope.errorMsg = 'The group name is already in use in this project';
            }
        };

        /** Close the modal. */
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolGroupEditModalController', SymbolGroupEditModalController);

    SymbolGroupEditModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'SymbolGroup', 'ToastService'
    ];

    /**
     * The controller that handles the modal dialog for deleting and updating a symbol group. The modal data that is
     * passed must have an property 'group' whose value should be an instance of SymbolGroup
     *
     * The template is at 'views/modals/symbol-group-edit-modal.html'
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData - The data that is passed to this controller
     * @param SymbolGroup
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolGroupEditModalController($scope, $modalInstance, modalData, SymbolGroup, Toast) {

        /**
         * The symbol group that should be edited
         * @type {null|SymbolGroup}
         */
        $scope.group = null;

        /**
         * An error message that can be displayed in the template
         * @type {null|String}
         */
        $scope.errorMsg = null;

        (function init() {
            if (angular.isDefined(modalData.group) && modalData.group instanceof SymbolGroup) {
                $scope.group = modalData.group.copy();
            } else {
                throw new Error('Wrong parameter type');
            }
        }());

        /**
         * Updates the symbol group under edit and closes the modal dialog on success
         */
        $scope.updateGroup = function () {
            $scope.errorMsg = null;

            SymbolGroup.Resource.update($scope.group.project, $scope.group)
                .then(function (updatedGroup) {
                    Toast.success('Group updated');
                    $modalInstance.close({
                        status: 'updated',
                        newGroup: updatedGroup,
                        oldGroup: modalData.group
                    });
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message;
                })
        };

        /**
         * Deletes the symbol group under edit and closes the modal dialog on success
         */
        $scope.deleteGroup = function () {
            $scope.errorMsg = null;

            SymbolGroup.Resource.delete($scope.group.project, $scope.group)
                .then(function () {
                    Toast.success('Group <strong>' + $scope.group.name + '</strong> deleted');
                    $modalInstance.close({
                        status: 'deleted',
                        group: $scope.group
                    });
                })
                .catch(function (response) {
                    $scope.errorMsg = response.data.message;
                })
        };

        /** Closes the modal dialog */
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
        '$scope', '$modalInstance', 'modalData', 'Symbol', 'SelectionService', 'ToastService'
    ];

    /**
     * The controller that handles the moving of symbols into another group.
     *
     * The template can be found at 'views/modals/symbol-move-modal.html'
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param Symbol
     * @param SelectionService
     * @param Toast
     * @constructor
     */
    function SymbolMoveModalController($scope, $modalInstance, modalData, Symbol, SelectionService, Toast) {

        /**
         * The list of symbols that should be moved
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        /**
         * The list of existing symbol groups
         * @type {SymbolGroup[]}
         */
        $scope.groups = [];

        /**
         * The symbol group the symbols should be moved into
         * @type {SymbolGroup|null}
         */
        $scope.selectedGroup = null;

        // some checking if required parameters are given
        (function init() {
            if (angular.isDefined(modalData.groups) && angular.isDefined(modalData.symbols)) {
                $scope.symbols = angular.copy(modalData.symbols);
                $scope.groups = angular.copy(modalData.groups);
            } else {
                throw new Error('Missing data');
            }
        }());

        /**
         * Moves the symbols into the selected group by changing the group property of each symbol and then batch
         * updating them on the server
         */
        $scope.moveSymbols = function () {
            if ($scope.selectedGroup !== null) {
                _.forEach($scope.symbols, function (symbol) {
                    SelectionService.removeSelection(symbol);
                    symbol.group = $scope.selectedGroup.id;
                });
                console.log($scope.symbols);
                Symbol.Resource.updateSome($scope.selectedGroup.project, $scope.symbols)
                    .then(function () {
                        Toast.success('Symbols move to group <strong>' + $scope.selectedGroup.name + '</strong>');
                        $modalInstance.close({
                            symbols: modalData.symbols,
                            group: $scope.selectedGroup
                        });
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Moving symbols failed</strong></p>' + response.data.message);
                    })
            }
        };

        /**
         * Selects the group where the symbols should be moved into
         *
         * @param {SymbolGroup} group
         */
        $scope.selectGroup = function (group) {
            $scope.selectedGroup = $scope.selectedGroup === group ? null : group;
        };

        /** Close the modal dialog */
        $scope.closeModal = function () {
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
     * The controller for the landing page. It lists the projects.
     *
     * The controller can be found at 'views/pages/home.html'
     *
     * @param $scope
     * @param $state
     * @param Project
     * @param Session
     * @constructor
     */
    function HomeController($scope, $state, Project, Session) {

        /**
         * The list of all created projects
         * @type {Project[]}
         */
        $scope.projects = [];

        // initialize the controllers data
        (function init() {

            // redirect to the project dash page if one is open
            if (Session.project.get() !== null) {
                $state.go('project');
            }

            // get all projects from the server
            Project.Resource.all()
                .then(function (projects) {
                    $scope.projects = projects;
                });
        }());

        /**
         * Opens a project by saving it into the session and redirect to the projects dashboard.
         *
         * @param {Project} project - The project that should be saved in the sessionStorage
         */
        $scope.openProject = function (project) {
            Session.project.save(project);
            $state.go('project');
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsCompareController', LearnResultsCompareController);

    LearnResultsCompareController.$inject = ['$scope', '$stateParams', 'SessionService', 'LearnResult', '_'];

    /**
     * The controller that handles the page for displaying multiple complete learn results in a slide show.
     *
     * The template can be found at 'views/pages/learn-result-compare.html'
     *
     * @param $scope - The controllers $scope
     * @param $stateParams - The state parameters
     * @param Session - The session service
     * @param LearnResult - The LearnResult model
     * @param _ - Lodash
     * @constructor
     */
    function LearnResultsCompareController($scope, $stateParams, Session, LearnResult, _) {

        // the project that is saved in the session
        var project = Session.project.get();

        /**
         * All final learn results from all tests that were made for a project
         * @type {LearnResult[]}
         */
        $scope.results = [];

        /**
         * The list of active panels where each panel contains a complete learn result set
         * @type {LearnResult[][]}
         */

        $scope.panels = [];

        /**
         * The list of layout settings for the current hypothesis that is shown in a panel
         * @type {Object[]}
         */
        $scope.layoutSettings = [];

        // load all final learn results of all test an then load the complete test results from the test numbers
        // that are passed from the url in the panels
        (function init() {
            LearnResult.Resource.getAllFinal(project.id)
                .then(function (results) {
                    $scope.results = results;
                    return $stateParams.testNos;
                })
                .then(loadComplete);
        }());

        /**
         * Loads a complete learn result set from a test number in the panel with a given index
         *
         * @param {String} testNos - The test numbers as concatenated string, separated by a ','
         * @param {number} index - The index of the panel the complete learn result should be displayed in
         */
        function loadComplete(testNos, index) {
            testNos = testNos.split(',');
            _.forEach(testNos, function (testNo) {
                LearnResult.Resource.getComplete($scope.project.id, testNo)
                    .then(function (completeTestResult) {
                        if (angular.isUndefined(index)) {
                            $scope.panels.push(completeTestResult);
                        } else {
                            $scope.panels[index] = completeTestResult;
                        }
                    })
            })
        }

        /**
         * Loads a complete learn result set from a learn result in the panel with a given index
         *
         * @param {LearnResult} result - The learn result whose complete set should be loaded in a panel
         * @param {number} index - The index of the panel the complete set should be displayed in
         */
        $scope.fillPanel = function (result, index) {
            loadComplete(result.testNo + '', index);
        }
    }

}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsController', LearnResultsController);

    LearnResultsController.$inject = ['$scope', 'SessionService', 'LearnResult', 'PromptService', 'ToastService'];

    /**
     * The controller for listing all final test results.
     *
     * The template can be found at 'views/pages/learn-results.html'
     *
     * @param $scope - The controllers scope
     * @param Session - The SessionService
     * @param LearnResult - The service for creating LearnResults
     * @param PromptService - The service for prompts
     * @param Toast - The ToastService
     * @constructor
     */
    function LearnResultsController($scope, Session, LearnResult, PromptService, Toast) {

        // The project that is saved in the session
        var project = Session.project.get();

        /**
         * All final test results of a project
         * @type {Array}
         */
        $scope.results = [];

        /**
         * The test results the user selected
         * @type {Array}
         */
        $scope.selectedResults = [];

        (function init() {

            // get all final test results
            LearnResult.Resource.getAllFinal($scope.project.id)
                .then(function (results) {
                    $scope.results = results;
                    console.log(results)
                });
        }());

        /**
         * Deletes a test result from the server after prompting the user for confirmation
         *
         * @param result - The test result that should be deleted
         */
        $scope.deleteResult = function (result) {
            PromptService.confirm("Do you want to permanently delete this result? Changes cannot be undone.")
                .then(function () {
                    LearnResult.Resource.delete(project.id, result.testNo)
                        .then(function () {
                            Toast.success('Learn result for test <strong>' + result.testNo + '</strong> deleted');
                            _.remove($scope.results, {testNo: result.testNo});
                        })
                        .catch(function (response) {
                            Toast.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                        });
                })
        };

        /**
         * Deletes selected test results from the server after prompting the user for confirmation
         */
        $scope.deleteResults = function () {
            var testNos;

            if ($scope.selectedResults.length > 0) {
                testNos = _.pluck($scope.selectedResults, 'testNo');
                PromptService.confirm("Do you want to permanently delete theses results? Changes cannot be undone.")
                    .then(function () {
                        LearnResult.Resource.deleteSome(project.id, testNos)
                            .then(function () {
                                Toast.success('Learn results deleted');
                                _.forEach(testNos, function (testNo) {
                                    _.remove($scope.results, {testNo: testNo})
                                })
                            })
                            .catch(function (response) {
                                Toast.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                            });
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
        '$scope', 'SessionService', 'LearnResult', 'LearnerResultChartService'
    ];

    /**
     * The controller for the learn result statistics page.
     *
     * The corresponding template can be found under 'views/pages/learn-results-statistics.html'.
     *
     * @param $scope
     * @param Session
     * @param LearnResult
     * @param LearnerResultChartService
     * @constructor
     */
    function LearnResultsStatisticsController($scope, Session, LearnResult, LearnerResultChartService) {

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
         * The list of selected learn results
         * @type {Array}
         */
        $scope.selectedResults = [];

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
         * @type {boolean}
         */
        $scope.fullWidth = false;

        /**
         * The n3 chart data for the directive
         * @type {{data: null|Array, options: null|{}}}
         */
        $scope.chartData = {
            data: null,
            options: null
        };

        // initialize the controller
        (function init () {

            // get all final learn results of the project
            LearnResult.Resource.getAllFinal(project.id)
                .then(function (results) {
                    $scope.results = results;
                });
        }());

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
            var chartData;

            console.log($scope.selectedResults)
            if ($scope.selectedResults.length > 0) {
                chartData =
                    LearnerResultChartService
                        .createDataFromMultipleFinalResults($scope.selectedResults, $scope.selectedChartProperty);

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
            var chartData;

            if ($scope.selectedResults.length > 0) {

                // TODO: get complete results from selected results as soon as there is an interface for that

                //chartData =
                //    LearnerResultChartService
                //        .createDataFromMultipleCompleteResults($scope.selectedResults, $scope.selectedChartProperty);
                //
                //$scope.chartData = {
                //    data: chartData.data,
                //    options: chartData.options
                //};
                //
                //$scope.selectedChartMode = $scope.chartModes.MULTIPLE_COMPLETE;
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
            $scope.fullWidth = false;
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnSetupController', LearnSetupController);

    LearnSetupController.$inject = [
        '$scope', '$state', 'SymbolGroup', 'SessionService', 'SelectionService', 'LearnConfiguration',
        'LearnerService', 'ToastService'
    ];

    /**
     * The controller that handles the preparation of a learn process. Lists all symbol groups and its visible symbols.
     *
     * The template can be found at 'views/pages/learn-setup.html'
     *
     * @param $scope
     * @param $state
     * @param SymbolGroup
     * @param Session
     * @param SelectionService
     * @param LearnConfiguration
     * @param Learner
     * @param Toast
     * @constructor
     */
    function LearnSetupController($scope, $state, SymbolGroup, Session, SelectionService, LearnConfiguration,
                                  Learner, Toast) {

        // the project that is stored in the session
        var project = Session.project.get();

        /**
         * All symbol groups that belong the the sessions project
         * @type {SymbolGroup[]}
         */
        $scope.groups = [];

        /**
         * A list of all symbols of all groups that is used in order to select them
         * @type {Symbol[]}
         */
        $scope.allSymbols = [];

        /**
         * The configuration that is send to the server for learning
         * @type {LearnConfiguration}
         */
        $scope.learnConfiguration = new LearnConfiguration();

        /**
         * The symbol that should be used as a reset symbol
         * @type {Symbol|null}
         */
        $scope.resetSymbol = null;

        (function init() {

            // make sure that there isn't any other learn process active
            // redirect to the load screen in case there is an active one
            Learner.isActive()
                .then(function (data) {
                    if (data.active) {
                        if (data.project == project.id) {
                            $state.go('learn.start');
                        } else {
                            Toast.danger('There is already running a test from another project.');
                        }
                    } else {

                        // load all symbols in case there isn't any active learning process
                        SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
                            .then(function (groups) {
                                $scope.groups = groups;
                                $scope.allSymbols = _.flatten(_.pluck($scope.groups, 'symbols'));
                            });
                    }
                });
        }());

        /**
         * Sets the reset symbol
         *
         * @param {Symbol} symbol - The symbol that will be used to reset the sul
         */
        $scope.setResetSymbol = function (symbol) {
            $scope.resetSymbol = symbol;
        };

        /**
         * Starts the learning process if symbols are selected and a reset symbol is defined. Redirects to the
         * learning load screen on success.
         */
        $scope.startLearning = function () {
            var selectedSymbols;

            if ($scope.resetSymbol === null) {
                Toast.danger('You <strong>must</strong> selected a reset symbol in order to start learning');
                return;
            }

            selectedSymbols = SelectionService.getSelected($scope.allSymbols);

            if (selectedSymbols.length > 0) {
                _.forEach(selectedSymbols, function (symbol) {
                    $scope.learnConfiguration.addSymbol(symbol)
                });

                $scope.learnConfiguration.setResetSymbol($scope.resetSymbol);

                Learner.start($scope.project.id, $scope.learnConfiguration)
                    .then(function () {
                        $state.go('learn.start')
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Start learning failed</strong></p>' + response.data.message);
                    });
            } else {
                Toast.danger('You <strong>must</strong> at least select one symbol to start learning');
            }
        };

        /**
         * Updates the learn configuration
         *
         * @param {LearnConfiguration} config
         */
        $scope.updateLearnConfiguration = function (config) {
            $scope.learnConfiguration = config;
        };

        /**
         * Extracts all symbols from all symbol groups and merges them into a single array
         *
         * @returns {Symbol[]}
         */
        $scope.getAllSymbols = function () {
            return _.flatten(_.pluck($scope.groups, 'symbols'));
        };
    }
}());;(function () {

    angular
        .module('weblearner.controller')
        .controller('LearnStartController', LearnStartController);

    LearnStartController.$inject = [
        '$scope', '$interval', 'SessionService', 'LearnerService', 'LearnResult', 'ToastService'
    ];

    /**
     * The controller for showing a load screen during the learning and shows all learn results from the current test
     * in the intermediate steps.
     *
     * The template can be found at 'views/pages/learn-start.html'.
     *
     * @param $scope
     * @param $interval
     * @param Session
     * @param Learner
     * @param LearnResult
     * @param Toast
     * @constructor
     */
    function LearnStartController($scope, $interval, Session, Learner, LearnResult, Toast) {

        // The project that is stored in the session
        var project = Session.project.get();

        // The interval object
        var interval = null;

        // The time for the polling interval
        var intervalTime = 10000;

        /**
         * The complete learn result until the most recent learned one
         * @type {LearnResult[]}
         */
        $scope.results = [];

        /**
         * Indicates if polling the server for a test result is still active
         * @type {boolean}
         */
        $scope.active = false;

        /**
         *
         * @type {{input: string, output: string}}
         */
        $scope.counterExample = {
            input: '',
            output: ''
        };

        // initialize the controller
        (function init() {

            // start polling the server
            poll();

            // stop polling when you leave the page
            $scope.$on("$destroy", function () {
                $interval.cancel(interval);
            });
        }());

        /**
         * Checks every x seconds if the server has finished learning and set the test if he did finish
         */
        function poll() {
            $scope.active = true;
            interval = $interval(function () {
                Learner.isActive()
                    .then(function (data) {
                        if (!data.active) {
                            Learner.getStatus().then(loadComplete);
                            $interval.cancel(interval);
                            $scope.active = false;
                        }
                    })
            }, intervalTime);

            // load the complete set of steps for the learn result
            function loadComplete(result) {
                LearnResult.Resource.getComplete(project.id, result.testNo)
                    .then(function (results) {
                        $scope.results = results;
                    });
            }
        }

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
            var copy = angular.copy(_.last($scope.results).configuration);
            delete copy.algorithm;
            delete copy.symbols;
            delete copy.resetSymbol;
            Learner.resume(project.id, _.last($scope.results).testNo, copy)
                .then(poll)
        };

        /**
         * Tell the learner to stop learning at the next possible time, when the next hypothesis is generated
         */
        $scope.abort = function () {
            if ($scope.active) {
                Toast.info('The learner will stop with the next hypothesis');
                Learner.stop()
            }
        };

        /**
         * Test if a counter example really is one
         *
         * @param counterExample
         */
        $scope.testCounterExample = function (counterExample) {
            
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

    ProjectCreateController.$inject = ['$scope', '$state', 'Project', 'ToastService'];

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
    function ProjectCreateController($scope, $state, Project, Toast) {

        $scope.project = new Project();

        /**
         * Make a call to the API to create a new project
         */
        $scope.createProject = function() {
            Project.Resource.create($scope.project)
                .then(function (createdProject) {
                    Toast.success('Project "' + createdProject.name + '" created');
                    $state.go('home');
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Creation of project failed</strong></p>' + response.data.message)
                })
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ProjectSettingsController', ProjectSettingsController);

    ProjectSettingsController.$inject = [
        '$scope', '$state', 'Project', 'SessionService', 'PromptService', 'ToastService', 'LearnerService'
    ];

    /**
     * The controller that handles the deleting and updating of a project. Belongs to the template at
     * '/views/pages/project-settings.html'
     *
     * @param $scope
     * @param $state
     * @param Project
     * @param Session
     * @param PromptService
     * @param Toast
     * @param Learner
     */
    function ProjectSettingsController($scope, $state, Project, Session, PromptService, Toast, Learner) {

        var projectCopy;

        /**
         * The project that is stored in the session
         * @type {Project}
         **/
        $scope.project = Session.project.get();
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
         * was deleted and removes the project from the sessionStorage.
         */
        $scope.deleteProject = function () {
            var message = 'Do you really want to delete this project with all its symbols and test results? This process can not be undone.';

            // check if the current project is used in learning and abort deletion
            // because of unknown side effects
            Learner.isActive()
                .then(function (data) {
                    if (data.active !== false || (data.project !== $scope.project.id)) {
                        confirmDeletion();
                    } else {
                        Toast.info('Project could not be deleted because there is an active learning process')
                    }
                });

            function confirmDeletion() {
                PromptService.confirm(message)
                    .then(function () {
                        Project.Resource.delete($scope.project)
                            .then(function () {
                                Toast.success('Project <strong>' + $scope.project.name + '</strong> deleted');
                                Session.project.remove();
                                $state.go('home');
                            })
                            .catch(function (response) {
                                Toast.danger('<p><strong>Deleting project failed</strong></p>' + response.data.message);
                            })
                    })
            }
        };

        /**
         * Resets the project edit form by copying the project copy back to the project under edit
         */
        $scope.resetForm = function () {
            $scope.project = angular.copy(projectCopy);
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsActionsController', SymbolsActionsController);

    SymbolsActionsController.$inject = [
        '$scope', '$stateParams', 'Symbol', 'SessionService', 'SelectionService', 'ToastService'
    ];

    /**
     * The controller that handles the page for managing all actions of a symbol. The symbol whose actions should be
     * manages has to be defined in the url by its id. The URL /symbols/4/actions therefore manages the actions of the
     * symbol with id 4. When no such id was found, the controller redirects to an error page.
     *
     * The template can be found at 'views/pages/symbols-actions.html'.
     *
     * @param $scope - The controllers scope
     * @param $stateParams - The parameters of the state
     * @param Symbol - The Symbol model
     * @param Session - The session service
     * @param SelectionService - The selection service
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolsActionsController($scope, $stateParams, Symbol, Session, SelectionService, Toast) {

        /**
         * The project that is stored in the session
         * @type {Project}
         */
        $scope.project = Session.project.get();

        /**
         * The symbol whose actions are managed
         * @type {Symbol|null}
         */
        $scope.symbol = null;

        /**
         * A copy of $scope.symbol to revert unsaved changes
         * @type {Symbol|null}
         */
        $scope.symbolCopy = null;

        /**
         * The list of selected actions
         * @type {Array}
         */
        $scope.selectedActions = [];

        // load all actions from the symbol
        // redirect to an error page when the symbol from the url id cannot be found
        (function init() {
            Symbol.Resource.get($scope.project.id, $stateParams.symbolId)
                .then(prepareSymbol)
                .catch(function (response) {
                    // TODO: redirect to an error page with a message
                });
        }());

        // initialize the controller for a given symbol
        function prepareSymbol(symbol) {

            // create unique ids for actions
            _.forEach(symbol.actions, function (action) {
                action._id = _.uniqueId();
            });

            // add symbol to scope and create a copy in order to revert changes
            $scope.symbol = symbol;
            $scope.symbolCopy = symbol.copy();
        }

        /**
         * Deletes the actions that the user selected from the scope
         */
        $scope.deleteSelectedActions = function () {
            if ($scope.selectedActions.length > 0) {
                _.forEach($scope.selectedActions, $scope.deleteAction);
                Toast.success('Actions deleted');
            }
        };

        /**
         * Removes an action from a symbol
         *
         * @param {Object} action
         */
        $scope.deleteAction = function (action) {
            _.remove($scope.symbol.actions, {_id: action._id});
            Toast.success('Action deleted');
        };

        /**
         * Adds a new action to the list of actions of the symbol and gives it a temporary unique id
         *
         * @param {Object} action
         */
        $scope.addAction = function (action) {
            action._id = _.uniqueId();
            $scope.symbol.actions.push(action);
            Toast.success('Action created');
        };

        /**
         * Updates an existing action
         *
         * @param {Object} updatedAction
         */
        $scope.updateAction = function (updatedAction) {
            var index = _.findIndex($scope.symbol.actions, {_id: updatedAction._id});
            if (index > -1) {
                $scope.symbol.actions[index] = updatedAction;
                Toast.success('Action updated');
            }
        };

        /**
         * Saves the changes that were made to the symbol by updating it on the server.
         */
        $scope.saveChanges = function () {

            // update the copy for later reverting
            var copy = $scope.symbol.copy();
            SelectionService.removeSelection(copy.actions);

            // remove the temporarily create unique id attribute
            _.forEach(copy.actions, function (action) {
                delete action._id;
            });

            // update the symbol
            Symbol.Resource.update($scope.project.id, copy)
                .then(function (updatedSymbol) {
                    prepareSymbol(updatedSymbol);
                    Toast.success('Symbol <strong>' + updatedSymbol.name + '</strong> updated');
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Error updating symbol</strong></p>' + response.data.message);
                })
        };

        /**
         * Reverts the changes that were made to the symbol before the last update
         */
        $scope.revertChanges = function () {
            prepareSymbol($scope.symbolCopy);
            Toast.info('Changes reverted to the last update');
        };
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsController', SymbolsController);

    SymbolsController.$inject = ['$scope', 'SessionService', 'Symbol', 'SymbolGroup', '_', 'ToastService'];

    /**
     * The controller that handles CRUD operations on symbols and symbol groups.
     *
     * The template can be found at 'views/pages/symbols.html'.
     *
     * @param $scope
     * @param Session
     * @param Symbol
     * @param SymbolGroup
     * @param _
     * @param Toast
     * @constructor
     */
    function SymbolsController($scope, Session, Symbol, SymbolGroup, _, Toast) {

        /**
         * The project that is saved in the session
         * @type {Project}
         */
        $scope.project = Session.project.get();

        /**
         * indicates if symbol groups are displayed collapsed
         * @type {boolean}
         */
        $scope.groupsCollapsed = false;

        /**
         * The model for selected symbols
         * @type {Symbol[]}
         */
        $scope.selectedSymbols = [];

        /**
         * The symbol groups that belong to the project
         * @type {SymbolGroup}
         */
        $scope.groups = [];

        // fetch all symbol groups and include all symbols
        (function init() {
            SymbolGroup.Resource.getAll($scope.project.id, {embedSymbols: true})
                .then(function (groups) {
                    $scope.groups = groups;
                })
        }());

        /**
         * Finds the symbol group object from a given symbol. Returns undefined if no symbol group was found.
         *
         * @param symbol - The symbol whose group object should be found
         * @returns {SymbolGroup|undefined} - The found symbol group or undefined
         */
        function findGroupFromSymbol(symbol) {
            return _.find($scope.groups, {id: symbol.group});
        }

        /**
         * Extracts all symbols from all symbol groups and merges them into a single array
         *
         * @returns {Symbol[]}
         */
        $scope.getAllSymbols = function () {
            return _.flatten(_.pluck($scope.groups, 'symbols'));
        };

        /**
         * Adds a single new symbol to the scope by finding its corresponding group and adding it there
         *
         * @param {Symbol} symbol - The symbol that should be added
         */
        $scope.addSymbol = function (symbol) {
            findGroupFromSymbol(symbol).symbols.push(symbol)
        };

        /**
         * Removes a list of symbols from the scope by finding the group of each symbol and removing it from
         * it
         *
         * @param {Symbol[]} symbols - The symbols that should be removed
         */
        $scope.removeSymbols = function (symbols) {
            var group;
            _.forEach(symbols, function (symbol) {
                delete symbol._selected;
                group = findGroupFromSymbol(symbol);
                _.remove(group.symbols, {id: symbol.id});
            })
        };

        /**
         * Updates an existing symbol
         *
         * @param {Symbol} updatedSymbol - The updated symbol object
         */
        $scope.updateSymbol = function (updatedSymbol) {
            $scope.updateSymbols([updatedSymbol]);
        };

        /**
         * Updates multiple existing symbols
         *
         * @param {Symbol[]} updatedSymbols - The updated symbol objects
         */
        $scope.updateSymbols = function (updatedSymbols) {
            var group;
            var i;
            _.forEach(updatedSymbols, function (symbol) {
                group = findGroupFromSymbol(symbol);
                i = _.findIndex(group.symbols, {id: symbol.id});
                if (i > -1) {
                    group.symbols[i].name = symbol.name;
                    group.symbols[i].abbreviation = symbol.abbreviation;
                    group.symbols[i].group = symbol.group
                }
            })
        };

        /**
         * Moves a list of existing symbols into another group.
         *
         * @param {Symbol[]} symbols - The symbols that should be moved
         * @param {SymbolGroup} group - The group the symbols should be moved into
         */
        $scope.moveSymbolsToGroup = function (symbols, group) {
            var group = _.find($scope.groups, {id: group.id});

            _.forEach(symbols, function (symbol) {
                var g = _.find($scope.groups, {id: symbol.group});
                var i = _.findIndex(g.symbols, {id: symbol.id});
                g.symbols.splice(i, 1);
                symbol.group = group.id;
                group.symbols.push(symbol);
            })
        };

        /**
         * Deletes a single symbol from the server and from the scope if the deletion was successful
         *
         * @param {Symbol} symbol - The symbol to be deleted
         */
        $scope.deleteSymbol = function (symbol) {
            Symbol.Resource.delete($scope.project.id, symbol)
                .then(function () {
                    Toast.success('Symbol <strong>' + symbol.name + '</strong> deleted');
                    $scope.removeSymbols([symbol]);
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Deleting symbol failed</strong></p>' + response.data.messageł);
                })
        };

        /**
         * Deletes all symbols that the user selected from the server and the scope, if the deletion was successful
         */
        $scope.deleteSelectedSymbols = function () {
            Symbol.Resource.deleteSome($scope.project.id, $scope.selectedSymbols)
                .then(function () {
                    Toast.success('Symbols deleted');
                    $scope.removeSymbols($scope.selectedSymbols);
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Deleting symbols failed</strong></p>' + response.data.message);
                })
        };

        /**
         * Adds a new symbol group to the scope
         *
         * @param {SymbolGroup} group - The group that should be added
         */
        $scope.addGroup = function (group) {
            $scope.groups.push(group);
        };

        /**
         * Updates a symbol group in the scope by changing its name property to the one of the groups that is passed
         * as a parameter
         *
         * @param {SymbolGroup} updatedGroup - The updated symbol group
         */
        $scope.updateGroup = function (updatedGroup) {
            _.find($scope.groups, {id: updatedGroup.id}).name = updatedGroup.name;
        };

        /**
         * Collapses all groups or expands them
         */
        $scope.toggleCollapseAllGroups = function () {
            $scope.groupsCollapsed = !$scope.groupsCollapsed;
            for (var i = 0; i < $scope.groups; i++) {
                $scope.groups[i]._collapsed = $scope.groupsCollapsed;
            }
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
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsHistoryController', SymbolsHistoryController);

    SymbolsHistoryController.$inject = ['$scope', '$stateParams', 'Symbol', 'SessionService', 'ToastService'];

    /**
     * @param $scope - The controllers scope
     * @param $stateParams - The ui.router $stateParams service
     * @param Symbol - The factory for the Symbol model
     * @param Session - The SessionService
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolsHistoryController($scope, $stateParams, Symbol, Session, Toast) {

        // The project in the session
        var project = Session.project.get();

        /**
         * All revisions of a symbol
         * @type {Symbol[]}
         */
        $scope.revisions = [];

        /**
         * The most current version of a symbol
         * @type {Symbol}
         */
        $scope.latestRevision = null;

        // init controller
        (function init() {

            // load all revisions of the symbol whose id is passed in the URL
            if (angular.isDefined($stateParams.symbolId)) {
                Symbol.Resource.getRevisions(project.id, $stateParams.symbolId)
                    .then(function (revisions) {
                        $scope.latestRevision = revisions[revisions.length - 1];
                        $scope.revisions = revisions;
                    })
                    .catch(function () {
                        // TODO: go to error page
                    })
            } else {
                // TODO: go to error page
            }
        }());

        /**
         * Restores a previous revision of a symbol by updating the latest with the properties of the revision
         *
         * @param {Symbol} revision - The revision of the symbol that should be restored
         */
        $scope.restoreRevision = function (revision) {
            var symbol = $scope.latestRevision.copy();

            // copy all important properties from the revision to the latest
            symbol.name = revision.name;
            symbol.abbreviation = revision.abbreviation;
            symbol.actions = revision.actions;

            // update symbol with new properties
            Symbol.Resource.update(project.id, symbol)
                .then(function (updatedSymbol) {
                    Toast.success('Updated symbol to revision <strong>' + revision.revision + '</strong>');
                    $scope.revisions.push(updatedSymbol);
                    $scope.latestRevision = updatedSymbol;
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Update to revision failed</strong></p>' + response.data.message);
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

    SymbolsTrashController.$inject = ['$scope', 'SessionService', 'Symbol', '_', 'ToastService'];

    /**
     * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
     * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
     *
     * @param $scope - The controllers scope object
     * @param Session - The SessionService
     * @param Symbol - The Symbol factory
     * @param _ - Lodash
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolsTrashController($scope, Session, Symbol, _, Toast) {

        // The project that is saved in the sessionStorage
        var project = Session.project.get();

        /**
         * The list of deleted symbols
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        /**
         * The list of selected symbols
         * @type {Symbol[]}
         */
        $scope.selectedSymbols = [];

        // initialize controller scope variables
        (function init() {

            // fetch all deleted symbols and save them in scope
            Symbol.Resource.getAll(project.id, {deleted: true})
                .then(function (symbols) {
                    $scope.symbols = symbols;
                });
        }())

        /**
         * Recovers a deleted symbol by calling the API and removes the recovered symbol from the symbol list on success
         *
         * @param {Symbol} symbol - The symbol that should be recovered from the trash
         */
        $scope.recoverSymbol = function (symbol) {
            Symbol.Resource.recover(project.id, symbol)
                .then(function (recoveredSymbol) {
                    Toast.success('Symbol ' + recoveredSymbol.name + ' recovered');
                    _.remove($scope.symbols, {id: recoveredSymbol.id});
                })
                .catch(function (response) {
                    Toast.error('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + response.data.message);
                })
        };

        /**
         * Recovers all symbols that were selected and calls $scope.recoverSymbol for each one
         */
        $scope.recoverSelectedSymbols = function () {
            if ($scope.selectedSymbols.length > 0) {
                Symbol.Resource.recoverSome(project.id, $scope.selectedSymbols)
                    .then(function () {
                        Toast.success('Symbols recovered');
                        _.forEach($scope.selectedSymbols, function (symbol) {
                            _.remove($scope.symbols, {id: symbol.id})
                        })
                    })
                    .catch(function (response) {
                        Toast.error('<p><strong>Error recovering symbols!</strong></p>' + response.data.message);
                    })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('actionCreateModalHandle', actionCreateModalHandle);

    actionCreateModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that is used to handle the modal dialog for creating an action. Must be used as an attribute for
     * the attached element. It attaches a click event to the element that opens the modal dialog. Does NOT saves the
     * action on the server.
     *
     * The directive excepts one additional attribute. 'onCreated' has to be a function with one parameter where the
     * created action is passed on success.
     *
     * Can be used like this: '<button action-create-modal-handle on-created="...">Click Me!</button>'
     *
     * @param $modal - The modal service
     * @param paths - The applications paths constant
     * @returns {{restrict: string, scope: {onCreated: string}, link: link}}
     */
    function actionCreateModalHandle($modal, paths) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                onCreated: '&'
            },
            link: link
        };

        // handles the directives logic
        function link(scope, el, attr) {
            el.on('click', handleModal);

            function handleModal() {

                // create the modal
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/action-create-modal.html',
                    controller: 'ActionCreateModalController'
                });

                // call the callback on success
                modal.result.then(function (action) {
                    scope.onCreated()(action);
                });
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('actionEditModalHandle', actionEditModalHandle);

    actionEditModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that is used to handle the modal dialog for editing an action. Must be used as an attribute for the
     * attached element. It attaches a click event to the element that opens the modal dialog. Does NOT update the symbol
     * with the new action.
     *
     * The directive excepts two additional attributes. 'action' has to contain the action object to be edited.
     * 'onUpdated' has to be a function with one parameter where the updated action is passed on success.
     *
     * Can be used like this: '<button action-edit-modal-handle action="..." on-updated="...">Click Me!</button>'
     *
     * @param $modal - The modal service
     * @param paths - The applications paths constant
     * @returns {{restrict: string, scope: {action: string, onUpdated: string}, link: link}}
     */
    function actionEditModalHandle($modal, paths) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                action: '=',
                onUpdated: '&'
            },
            link: link
        };

        // handles the directives logic
        function link(scope, el, attr) {
            el.on('click', handleModal);

            function handleModal() {

                // create and open the modal dialog
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/action-edit-modal.html',
                    controller: 'ActionEditModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                action: scope.action
                            };
                        }
                    }
                });

                // when successfully creating an action, call the callback function and pass the updated action
                modal.result.then(function (action) {
                    scope.onUpdated()(action);
                });
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('discriminationTree', discriminationTree);

    discriminationTree.$inject = ['_', '$window'];

    function discriminationTree(_, $window) {

        return {
            scope: {
                data: '='
            },
            template: '<svg><g></g></svg>',
            link: link
        }

        function link(scope, el, attrs) {

            var data = {
                discriminator: "w2 w3",
                children: [
                    {
                        discriminator: 'w3',
                        children: [
                            {data: 'q0'},
                            {data: 'q2'}
                        ]
                    },
                    {data: 'q1'}
                ]
            }

            var svg = d3.select(el.find('svg')[0]);
            var svgGroup = d3.select(el.find('svg').find('g')[0]);
            var svgContainer = el[0].parentNode;

            var graph = createGraph(data);
            var layoutedGraph = layout(graph);
            render(layoutedGraph);

            function createGraph(dt) {

                var nodes = [];
                var edges = [];

                function createGraphData(node, parent) {

                    if (node.children.length === 0) {
                        return;
                    }

                    if (!_.find(nodes, node.discriminator)) {
                        nodes.push(node.discriminator)
                    }

                    if (parent !== null) {
                        edges.push({
                            from: parent.discriminator,
                            to: node.discriminator
                        })
                    }

                    _.forEach(node.children, function(child){
                        if (child.data) {
                            nodes.push(child.data);
                            edges.push({
                                from: node.discriminator,
                                to: child.data
                            })
                        }
                    });

                    _.forEach(node.children, function (child) {
                        if (child.discriminator) {
                            createGraphData(child, node);
                        }
                    })
                }

                createGraphData(dt, null);

                return {
                    nodes: nodes,
                    edges: edges
                }
            }

            function layout(graph){

                var _graph = new graphlib.Graph({
                    directed: true,
                });

                _graph.setGraph({})

                //// add nodes to the graph
                _.forEach(graph.nodes, function (node, i) {
                    _graph.setNode(node, {
                        shape: 'circle',
                        label: node,
                        width: 25,
                        style: 'fill: #fff; stroke: #000; stroke-width: 1',
                        labelStyle: 'font-size: 1.25em; font-weight: bold'
                    });
                });

                //add edges to the graph
                _.forEach(graph.edges, function (edge, i) {
                    _graph.setEdge(edge.from, edge.to, {
                        lineInterpolate: 'basis',
                        style: "stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none"
                    });
                });

                // layout
                dagreD3.dagre.layout(_graph, {});

                return _graph;
            }

            function render(graph) {
                new dagreD3.render()(svgGroup, graph);

                var xCenterOffset = (svgContainer.clientWidth - graph.graph().width) / 2;
                svgGroup.attr("transform", "translate(" + xCenterOffset + ", 100)");

                // Create and handle zoom  & pan event
                var zoom = d3.behavior.zoom().scaleExtent([0.1, 10])
                    .translate([(svgContainer.clientWidth - graph.graph().width) / 2, 100]).on("zoom", zoomHandler);
                zoom(svg);

                function zoomHandler() {
                    svgGroup.attr('transform', 'translate(' + zoom.translate()
                    + ')' + ' scale(' + zoom.scale() + ')');
                }

                angular.element($window).on('resize', fitSize);

                function fitSize() {
                    svg.attr("width", svgContainer.clientWidth);
                    svg.attr("height", svgContainer.clientHeight);
                }

                window.setTimeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 100);
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('dispatchResize', dispatchResize);

    /**
     * This directive is used to fire a resize event to the window element with a given delay. Therefore it adds
     * a click event to element the directive was used on. Directive must be used as attribute with a value that
     * indicates how long resize event firing should be delayed (in ms). When no value is given, the resize event is
     * fired directly with a delay of 0 ms.
     *
     * Use: <button dispatch-resize="1000">Click Me</button>
     *
     * @returns {{link: link}}
     */
    function dispatchResize() {

        var directive = {
            restrict: 'A',
            link: link
        };
        return directive;

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {
            el.on('click', function () {
                var delay = 0;
                if (attrs.dispatchResize && angular.isNumber(parseInt(attrs.dispatchResize))) {
                    delay = parseInt(attrs.dispatchResize);
                }
                window.setTimeout(function () {
                    window.dispatchEvent(new Event('resize'));
                }, delay);
            })
        }
    }
}());;(function() {
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
                var csv = 'Project,Test No,Start Time,Step No,Algorithm,Eq Oracle,|Sigma|,#MQs,#EQs,#Symbol Calls,Duration (ms)\n';

                _.forEach(results, function (result) {
                    csv += result.project + ',';
                    csv += result.testNo + ',';
                    csv += '"' + result.statistics.startTime + '",';
                    csv += result.stepNo + ',';
                    csv += result.configuration.algorithm + ',';
                    csv += result.configuration.eqOracle.type + ',';
                    csv += result.configuration.symbols.length + ',';
                    csv += result.statistics.mqsUsed + ',';
                    csv += result.statistics.eqsUsed + ',';
                    csv += result.statistics.symbolsUsed + ',';
                    csv += result.statistics.duration + '\n';
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
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadTableAsCsv', downloadTableAsCsv);

    function downloadTableAsCsv() {
        return {
            link: link
        };

        function link(scope, el, attrs) {

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

            var parent = el.parent()[0];

            if (scope.bindResize) {
                angular.element($window).on('resize', fitToParent)
            }

            /**
             * Set the element to the dimensions of its parent
             */
            function fitToParent() {
                var width = parent.offsetWidth;
                var height = parent.offsetHeight;

                if (scope.asStyle) {
                    el[0].style.width = width + 'px';
                    el[0].style.height = height + 'px';
                } else {
                    el[0].setAttribute('width', width);
                    el[0].setAttribute('height', height);
                }
            }

            fitToParent();
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
;(function () {

    angular.module('weblearner.directives')
        .directive('hypothesis', hypothesis);

    hypothesis.$inject = ['$window', 'paths'];

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
        var line = d3.svg.line().x(function (d) {
            return d.x;
        }).y(function (d) {
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
            scope: {
                test: '=',
                counterExample: '=',
                layoutSettings: '='
            },
            templateUrl: paths.views.DIRECTIVES + '/hypothesis.html',
            link: link
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

            scope.$watch('test', function (test) {
                if (angular.isDefined(test) && test != null) {
                    createHypothesis();
                }
            });

            scope.$watch('layoutSettings', function (ls) {
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
                    directed: true,
                    multigraph: true
                });

                if (angular.isDefined(scope.layoutSettings)) {
                    _graph.setGraph({
                        edgesep: scope.layoutSettings.edgesep,
                        nodesep: scope.layoutSettings.nodesep,
                        ranksep: scope.layoutSettings.ranksep
                    });
                } else {
                    _graph.setGraph({
                        edgesep: 25
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
                _.forEach(scope.test.hypothesis.nodes, function (node, i) {
                    _graph.setNode("" + i, {
                        shape: 'circle',
                        label: node.toString(),
                        width: 25,
                        style: 'fill: #fff; stroke: #000; stroke-width: 1',
                        labelStyle: 'font-size: 1.25em; font-weight: bold'
                    });
                });

                // add edges to the graph
                _.forEach(scope.test.hypothesis.edges, function (edge, i) {
                    var edgeName = edge.from + "-" + edge.to + "|" + i;
                    _graph.setEdge(edge.from, edge.to, {
                        label: edge.input + "/" + edge.output,
                        labeloffset: 5,
                        lineInterpolate: 'basis',
                        style: "stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none",
                        labelStyle: 'font-size: 1.2em'
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
                _.forEach(scope.test.hypothesis.nodes, function (node, i) {
                    _graph.setNode("" + i, {
                        shape: 'circle',
                        label: node.toString(),
                        width: 25,
                        style: 'fill: #fff; stroke: #000; stroke-width: 1',
                        labelStyle: 'font-size: 1.5em; font-weight: bold'
                    });
                });

                // build data structure for the alternative representation by
                // pushing some data
                _.forEach(scope.test.hypothesis.edges, function (edge, i) {
                    if (!graph[edge.from]) {
                        graph[edge.from] = {};
                        graph[edge.from][edge.to] = [edge.input + "/"
                        + edge.output];
                    } else {
                        if (!graph[edge.from][edge.to]) {
                            graph[edge.from][edge.to] = [edge.input + "/"
                            + edge.output];
                        } else {
                            graph[edge.from][edge.to].push(edge.input + "/"
                            + edge.output);
                        }
                    }
                });

                // add edges to the rendered graph and combine <label[]>
                _.forEach(graph, function (k, from) {
                    _.forEach(k, function (labels, to) {
                        _graph.setEdge(from, to, {
                            label: labels.join('\n'),
                            labeloffset: 5,
                            lineInterpolate: 'basis',
                            style: "stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none",
                            labelStyle: 'font-size: 1.2em'
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

            function handleEvents() {

                var zoom;
                var drag;

                // attach click events for the selection of counter examples to the edge labels
                // only if counterExamples is defined
                if (angular.isDefined(scope.counterExample)) {
                    _svg.selectAll('.edgeLabel tspan').on('click', function () {
                        var label = this.innerHTML.split('/');
                        scope.$apply(function () {
                            scope.counterExample.input += (label[0] + ',');
                            scope.counterExample.output += (label[1] + ',');
                        });
                    });
                }

                // Create and handle zoom  & pan event
                zoom = d3.behavior.zoom().scaleExtent([0.1, 10])
                    .translate([(_svgContainer.clientWidth - _graph.graph().width) / 2, 100]).on("zoom", zoomHandler);
                zoom(_svg);

                function zoomHandler() {
                    _svgGroup.attr('transform', 'translate(' + zoom.translate()
                    + ')' + ' scale(' + zoom.scale() + ')');
                }

                // Add drag behavior for nodes
                drag = d3.behavior.drag()
                    .origin(function (d) {
                        return d;
                    })
                    .on('dragstart', dragstart)
                    .on("drag", drag);

                _svg.selectAll('.node')
                    .attr('cx', function (d) {
                        return d.x;
                    })
                    .attr('cy', function (d) {
                        return d.y;
                    })
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
                    _.forEach(_graph.edges(), function (edge, i) {
                        var line = calcPoints(_graph, edge);
                        paths[0][i].setAttribute('d', line);
                    });
                }

                angular.element($window).on('resize', fitSize);

                function fitSize() {
                    _svg.attr("width", _svgContainer.clientWidth);
                    _svg.attr("height", _svgContainer.clientHeight);
                }

                window.setTimeout(function () {
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
            '<div style="position: absolute; top: 0; bottom: 0; width: 100%;">' +
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

    hypothesisSlideshowPanel.$inject = ['paths', 'learnAlgorithms'];

    function hypothesisSlideshowPanel(paths, learnAlgorithms) {

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
            scope.learnAlgorithms = learnAlgorithms;

            scope.modes = {
                HYPOTHESIS: 0,
                INTERNAL: 1
            };

            scope.mode = scope.modes.HYPOTHESIS;

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
            };

            scope.hasInternalDataStructure = function () {
                return angular.isDefined(scope.result[scope.pointer].algorithmInformation);
            };

            scope.showInternalDataStructure = function () {
                scope.mode = scope.modes.INTERNAL;
            };

            scope.showHypothesis = function () {
                scope.mode = scope.modes.HYPOTHESIS;
            }
        }
    }
}());;(function () {

    angular
        .module('weblearner.directives')
        .directive('learnResultDetailsModalHandle', learnResultDetailsModalHandle);

    learnResultDetailsModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the modal dialog for displaying details about a learn result. Can only be used as
     * an attribute and expects a second attribute 'result' which should be the LearnResult whose details should be
     * shown. Attaches a click event on the element that opens the modal.
     *
     * Use it like this: '<button learn-result-details-modal-handle result="...">Click me!</button>'
     *
     * @param $modal - The modal service
     * @param paths - The application paths constant
     * @returns {{restrict: string, scope: {result: string}, link: link}}
     */
    function learnResultDetailsModalHandle($modal, paths) {

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
                        templateUrl: paths.views.MODALS + '/learn-result-details-modal.html',
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
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('learnResultsPanel', learnResultsPanel);

    learnResultsPanel.$inject = ['paths'];

    function learnResultsPanel(paths) {
        return {
            scope: {
                results: '=',
                counterExample: '='
            },
            templateUrl: paths.views.DIRECTIVES + '/learn-results-panel.html',
            controller: ['$scope', controller]
        };

        function controller($scope) {

            $scope.modes = {
                HYPOTHESIS: 0,
                INTERNAL: 1
            };

            /**
             * The layout settings for the displayed hypothesis
             * @type {undefined|Object}
             */
            $scope.layoutSettings;

            $scope.mode = $scope.modes.HYPOTHESIS;

            $scope.pointer = $scope.results.length - 1;

            $scope.firstStep = function () {
                scope.pointer = 0;
            };

            $scope.previousStep = function () {
                if ($scope.pointer - 1 < 0) {
                    $scope.lastStep();
                } else {
                    $scope.pointer--;
                }
            };

            $scope.nextStep = function () {
                if ($scope.pointer + 1 > $scope.results.length - 1) {
                    $scope.firstStep();
                } else {
                    $scope.pointer++;
                }
            };

            $scope.lastStep = function () {
                $scope.pointer = $scope.results.length - 1;
            };

            $scope.getCurrentStep = function () {
                return $scope.results[$scope.pointer];
            };

            $scope.hasInternalDataStructure = function () {
                return angular.isDefined($scope.results[$scope.pointer].algorithmInformation);
            };

            $scope.showInternalDataStructure = function () {
                $scope.mode = $scope.modes.INTERNAL;
            };

            $scope.showHypothesis = function () {
                $scope.mode = $scope.modes.HYPOTHESIS;
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
}());;(function(){
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('observationTable', observationTable);

    observationTable.$inject = ['paths'];

    function observationTable(paths){

        return {
            scope: {
                data: '='
            },
            link: link,
            templateUrl: paths.views.DIRECTIVES + '/observation-table.html'
        };

        function link(scope, el, attrs) {
            scope.table = {
                header: [],
                body: []
            };

            scope.$watch('data', function(n){
                if (angular.isDefined(n)) {
                    createObservationTable();
                }
            });

            function createObservationTable(){
                var rows = scope.data.split('\n');

                if (rows.length > 1) {
                    for (var i = 1; i < rows.length; i+=2) {
                        rows[i] = rows[i].split('|');
                        rows[i].shift();
                        rows[i].pop();
                        for (var j = 0; j < rows[i].length; j++) {
                            rows[i][j] = rows[i][j].trim();
                        }
                        if (i === 1) {
                            scope.table.header = rows[i];
                        } else {
                            scope.table.body.push(rows[i]);
                        }
                    }
                }
            }
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
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('selectionCheckboxAll', selectionCheckboxAll)
        .directive('selectableListItem', selectableListItem);

    function selectionCheckboxAll() {

        var directive = {
            scope: {
                items: '&'
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs, ctrl) {
            el.on('change', function () {
                var _this = this;
                var items = scope.items();

                if (angular.isFunction(items)) {
                    items = items();
                }

                scope.$apply(function () {
                    for (var i = 0; i < items.length; i++) {
                        items[i]._selected = _this.checked;
                    }
                });
            })
        }
    }

    function selectableListItem() {

        var directive = {
            transclude: true,
            template: ' <div class="selectable-list-item">' +
            '               <div class="selectable-list-control">' +
            '                   <input type="checkbox">' +
            '               </div>' +
            '               <div class="selectable-list-content" ng-transclude></div>' +
            '           </div>'
        };
        return directive;
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

            //$scope.$watch('counterExamples.length', function (n, o) {
            //
            //});

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

    /**
     *
     * @param $modal
     * @param paths
     * @returns {{scope: {group: string, onUpdated: string, onDeleted: string}, link: link}}
     */
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

        /**
         * @param scope
         * @param el
         * @param attrs
         */
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

                modal.result.then(function (data) {
                    if (data.status === 'updated') {
                        scope.onUpdated()(data.newGroup, data.oldGroup);
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
                symbols: '&',
                groups: '=',
                onMoved: '&'
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs) {

            el.on('click', handleModal);

            function handleModal() {
                var symbols = scope.symbols();
                if (angular.isFunction(symbols)) {
                    symbols = symbols();
                }
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/symbol-move-modal.html',
                    controller: 'SymbolMoveModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                symbols: symbols,
                                groups: scope.groups
                            }
                        }
                    }
                });
                modal.result.then(function (data) {
                    scope.onMoved()(data.symbols, data.group);
                })
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('viewHeading', viewHeading);

    viewHeading.$inject = ['paths'];

    /**
     * A directive that is used as a shortcut for the heading of a page to save some coding. Use it on every page that
     * should have a header with a title and a sub-title. The directive accepts two parameters 'title' and 'subTile'
     * which both only accept static values.
     *
     * Use it like '<view-heading title="..." sub-title="..."></view-heading>'
     *
     * The template can be found and changed at 'views/directives/view-heading.html'
     *
     * @returns {{scope: {title: string, subTitle: string}, templateUrl: string}}
     */
    function viewHeading(paths) {
        return {
            scope: {
                title: '@',
                subTitle: '@'
            },
            templateUrl: paths.views.DIRECTIVES + '/view-heading.html'
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webElementPicker', webElementPicker);

    webElementPicker.$inject = ['$window', 'WebElementPickerService', 'paths'];

    /**
     * The web element picker. It is used to select an element from the dom tree of the site of the projects base
     * url.
     *
     * @param $window - AngularJS window wrapper
     * @param WebElementPickerService - The service to communicate with the picker
     * @param paths - The applications constants
     * @returns {{scope: {}, templateUrl: string, link: link, controller: *[]}}
     */
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

        /**
         * @param scope
         * @param el
         * @param attrs
         */
        function link(scope, el, attrs) {

            // the iframe where the projects site gets loaded into
            var iframe = el.find('iframe');

            // when moving with the mouse over an element, this elements gets saved in this variable in order to
            // prevent multiple calls of getCssPath for the same element
            var lastTarget = null;

            /**
             * Get the unique CSS XPath from selected Element
             * http://stackoverflow.com/questions/4588119/get-elements-css-selector-without-element-id
             *
             * @param el  - The element to get the unique css path from
             * @returns {String} - The unique css path ot the element
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

            /**
             * Saves the element that is under the cursor so that it can be selected. Adds an outline to the element
             * in order to highlight it.
             *
             * @param e - js event
             * @returns {boolean}
             */
            function handleMouseMove(e) {
                if (lastTarget == e.target) {
                    return false;
                } else {
                    if (lastTarget != null) {
                        lastTarget.style.outline = '0px'
                    }
                    lastTarget = e.target;
                }
                lastTarget.style.outline = '5px solid red';
                scope.selector = getCssPath(lastTarget);
                scope.$apply();
            }

            /**
             * Removes the outline from the selected element, removes all events from the iframe and removes the
             * keypress event. When this function is called the selected element is fixed and won't change by any
             * further interaction with the iframe
             *
             * @param e - js event
             */
            function handleClick(e) {
                if (angular.isDefined(e)) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                lastTarget.style.outline = '0px';
                lastTarget = null;

                angular.element(iframe.contents()[0].body).off('mousemove', handleMouseMove);
                angular.element(iframe.contents()[0].body).off('click', handleClick);
                angular.element(document.body).off('keyup', handleKeyUp);
            }

            /**
             * Calls handleClick() when control key is pressed to have an alternative for selecting a dom node without
             * firing any click events on it.
             *
             * @param e
             */
            function handleKeyUp(e) {
                if (e.keyCode == 17) { // strg
                    handleClick();
                }
            }

            /**
             * Loads an entered url into the iframe
             */
            scope.loadUrl = function () {
                if (scope.url == '') {
                    iframe[0].setAttribute('src', scope.proxyUrl);
                } else {
                    iframe[0].setAttribute('src', scope.proxyUrl + '/' + scope.url);
                }
            };

            /**
             * Enables the selection mode and therefore adds events to the iframe
             */
            scope.enableSelection = function () {
                var iframeBody = angular.element(iframe.contents()[0].body);
                iframeBody.on('mousemove', handleMouseMove);
                iframeBody.one('click', handleClick);
                angular.element(document.body).on('keyup', handleKeyUp);
            };
        }

        /**
         * The controller of the web element picker. Listens on events and
         *
         * @param $scope
         * @param SessionService
         * @param paths
         */
        function controller($scope, Session, paths) {

            /**
             * Indicator if web element picker is visible or not
             * @type {boolean}
             */
            $scope.show = false;

            /**
             * The project that is stored in the session. Is used to get the baseUrl of it
             * @type {Project}
             */
            $scope.project = null;

            /**
             * The URL of the proxy
             * policies
             * @type {String|null}
             */
            $scope.proxyUrl = null;

            /**
             * The XPath of the selected element
             * @type {null}
             */
            $scope.selector = null;

            /**
             * The url that is loaded in the iframe
             * @type {string}
             */
            $scope.url = '';

            /**
             * Creates the proxy url where all requests are send to in order to avoid violation of foreign domain
             * @returns {*}
             */
            function buildProxyUrl() {
                return $window.location.origin + paths.api.PROXY_URL + $scope.project.baseUrl;
            }

            /**
             * Initialize scope properties and listen for events
             */
            function init() {
                $scope.project = Session.project.get();
                if ($scope.project != null) {
                    $scope.proxyUrl = buildProxyUrl();
                }

                // show the web element picker when open event gets fired
                $scope.$on('webElementPicker.open', function () {
                    $scope.show = true;
                });

                // when a new project gets opened initialize the controller again
                $scope.$on('project.opened', init);
            }

            /**
             * Makes the web element picker invisible and fires the close event
             */
            $scope.close = function () {
                $scope.show = false;
                WebElementPickerService.close();
            };

            /**
             * Makes the web element Picker invisible and fires the ok event with the selector of the element that was
             * selected. If no selector is defined, then it just closes the picker
             */
            $scope.ok = function () {
                $scope.show = false;
                if ($scope.selector === null) {
                    $scope.close();
                } else {
                    WebElementPickerService.ok($scope.selector);
                }
            };

            init();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('webElementPickerHandle', webElementPickerHandle);

    webElementPickerHandle.$inject = ['WebElementPickerService'];

    /**
     * The handle for the web element picker. Adds an click event to the attached element that opens the web element
     * picker.
     *
     * Accepts an attribute 'selector' that should be the model where the XPath of the selected element should be
     * stored into.
     *
     * Use it like '<button web-element-picker-handle selector="..."></button>'
     *
     * @param WebElementPickerService - The service for the web element picker
     * @returns {{scope: {selector: string}, link: link}}
     */
    function webElementPickerHandle(WebElementPickerService) {

        var directive = {
            scope: {
                selector: '='
            },
            link: link
        };
        return directive;

        function link(scope, el, attrs) {
            el.on('click', WebElementPickerService.open);

            scope.$on('webElementPicker.ok', function (e, xpath) {
                scope.selector = xpath;
            });
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

        Action.Web.SearchForNode.prototype.toString = function () {
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
            this.value = value || null
        };

        Action.Web.Fill.prototype.toString = function () {
            return 'Fill element "' + this.node + '" with "' + this.value + '"';
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

        Action.Rest.CheckHttpBodyText.prototype.toString = function () {
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
            this.value = jsonAttribute || null;
        };

        Action.Other.SetVariableByJSONAttribute.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the JSON attribute "' + this.value + '"';
        };

        Action.Other.SetVariableByNode = function (name, xPath) {
            this.type = actionTypes.other.SET_VARIABLE_BY_NODE;
            this.name = name || null;
            this.value = xPath || null;
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
                    return new Action.Web.Fill(data.node, data.value);
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

        Action.buildSome = function (data) {
            var actions = [];
            for (var i = 0; i < data.length; i++) {
                actions.push(Action.build(data[i]));
            }
            return actions;
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
}());;(function () {
    'use strict';

    angular
        .module('weblearner.models')
        .factory('LearnResult', LearnResultModel);

    LearnResultModel.$inject = ['LearnConfiguration', 'LearnResultResource'];

    /**
     * The factory for the model of a learn result
     *
     * @param LearnConfiguration
     * @param LearnResultResource
     * @returns {LearnResult}
     * @constructor
     */
    function LearnResultModel(LearnConfiguration, LearnResultResource) {

        /**
         * The model of a learn result
         *
         * @constructor
         */
        function LearnResult() {
            this.configuration;
            this.hypothesis;
            this.project;
            this.sigma;
            this.stepNo;
            this.testNo;
            this.algorithmInformation;
            this.statistics = {
                startTime: null,
                duration: null,
                eqsUsed: null,
                mqsUsed: null,
                symbolsUsed: null
            }
        }

        /**
         * Creates a new instance of a LearnResult from an object
         *
         * @param {Object} data - The object the learn result should be build from
         * @returns {LearnResultModel.LearnResult} - The instance of LearnResult from the data
         */
        LearnResult.build = function (data) {
            var result = new LearnResult();
            result.configuration = LearnConfiguration.build(data.configuration);
            result.hypothesis = data.hypothesis;
            result.project = data.project;
            result.sigma = data.sigma;
            result.stepNo = data.stepNo;
            result.testNo = data.testNo;
            result.algorithmInformation = data.algorithmInformation;
            result.statistics = data.statistics;
            return result;
        };

        /**
         * Creates a list of new instances of LearnResult from a list of objects
         *
         * @param {Object[]} data - The list of objects the list of learn results should be build from
         * @returns {LearnResultModel.LearnResult[]} - The list of learn results
         */
        LearnResult.buildSome = function (data) {
            var results = [];
            for (var i = 0; i < data.length; i++) {
                results.push(LearnResult.build(data[i]));
            }
            return results;
        };

        /**
         * The resource for learn results for communication with the API
         * @type {LearnResultResource}
         */
        LearnResult.Resource = new LearnResultResource();

        // overwrite the build methods of the resource so that the API returns instances of
        // learn results instead of plain objects
        LearnResult.Resource.build = LearnResult.build;
        LearnResult.Resource.buildSome = LearnResult.buildSome;

        return LearnResult;
    }
}());;(function () {
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

    SymbolModel.$inject = ['SymbolResource', 'Action'];

    /**
     * The factory for the symbol model.
     *
     * @param SymbolResource - The resource to do CRUD operations on symbols
     * @returns {Symbol} - The symbol model
     * @constructor
     */
    function SymbolModel(SymbolResource, Action) {

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
            symbol.actions = data.actions ? Action.buildSome(data.actions) : [];
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
         * @param data - The data the symbol instances should be build from
         * @returns {SymbolModel.Symbol[]} - The array of symbol instances
         */
        Symbol.buildSome = function (data) {
            if (angular.isDefined(data)) {
                var symbols = [];
                for (var i = 0; i < data.length; i++) {
                    symbols.push(Symbol.build(data[i]))
                }
                return symbols;
            } else {
                return [];
            }
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

    SymbolGroupModel.$inject = ['SymbolGroupResource', 'Symbol', '_'];

    /**
     * The service for the model of a symbol group
     *
     * @param SymbolGroupResource
     * @param Symbol
     * @param _
     * @returns {SymbolGroup}
     * @constructor
     */
    function SymbolGroupModel(SymbolGroupResource, Symbol, _) {

        /**
         * The symbol group model
         *
         * @param name - The name of the symbol group
         * @constructor
         */
        function SymbolGroup(name) {
            this.name = name || null;
            this.id;
            this.project;
            this.symbols;
        }

        /**
         * Creates a copy of the current instance
         *
         * @returns {*}
         */
        SymbolGroup.prototype.copy = function () {
            return SymbolGroup.build(angular.copy(this));
        };

        /**
         * Creates an instance of a SymbolGroup from a given object
         *
         * @param {Object} data - The object the SymbolGroup should be build from
         * @returns {SymbolGroupModel.SymbolGroup} - A new instance of SymbolGroup with the data
         */
        SymbolGroup.build = function (data) {
            var group = new SymbolGroup(data.name);
            group.id = data.id;
            group.symbols = Symbol.buildSome(data.symbols);
            group.project = data.project;
            return group;
        };

        /**
         * Creates a list of instances of SymbolGroup from a given object list
         *
         * @param {Object[]} data - The list the array of SymbolGroup should be build from
         * @returns {SymbolGroup[]} - The list of SymbolGroups
         */
        SymbolGroup.buildSome = function (data) {
            var groups = [];
            for (var i = 0; i < data.length; i++) {
                groups.push(SymbolGroup.build(data[i]));
            }
            return groups;
        };

        // attach the resource of the symbol groups
        SymbolGroup.Resource = new SymbolGroupResource();

        // overwrite the build functions so that the resource creates instances of SymbolGroups
        SymbolGroup.Resource.build = SymbolGroup.build;
        SymbolGroup.Resource.buildSome = SymbolGroup.buildSome;

        return SymbolGroup;
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('LearnResultResource', Resource);

    Resource.$inject = ['$http', 'paths'];

    /**
     * The resource that handles http request to the API to do CRUD operations on learn results
     *
     * @param $http - The angular http service
     * @param paths - The constant with application paths
     * @returns {LearnResultResource} - The LearnResource class
     * @constructor
     */
    function Resource($http, paths) {

        /**
         * The LearnResultResource
         * @constructor
         */
        function LearnResultResource() {
        }

        /**
         * Makes a GET request to 'rest/projects/{projectId}/results in order to get all final learn results of all
         * tests of a project.
         *
         * @param {number} projectId - The id of the project whose final learn results should be fetched
         * @returns {*} - A promise with the learn results
         */
        LearnResultResource.prototype.getAllFinal = function (projectId) {
            var _this = this;

            return $http.get(paths.api.URL + '/projects/' + projectId + '/results')
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        /**
         * Makes a GET request to 'rest/projects/{projectId}/results/{testNo}/complete in order to get all intermediate
         * results of a test.
         *
         * @param {number} projectId - The id of the project of the test
         * @param {number} testNo - The number of the test that should be completely fetched
         * @returns {*} - A promise with a list of learn results
         */
        LearnResultResource.prototype.getComplete = function (projectId, testNo) {
            var _this = this;

            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + testNo + '/complete')
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        // TODO: implement when api has implemented the function
        // LearnResultResource.prototype.getSomeComplete = function (projectId, testNos) {}

        /**
         * Wrapper for deleteSome for a single testNo
         *
         * @param {number} projectId
         * @param {number} testNo
         */
        LearnResultResource.prototype.delete = function (projectId, testNo) {
            this.deleteSome(projectId, [testNo]);
        };

        /**
         * Makes a DELETE request to '/rest/projects/{projectId}/results/{testNos} in order to delete test results.
         *
         * @param {number} projectId - The id of the tests that should be deleted
         * @param {number[]} testNos - The array of test numbers of the tests that should be deleted
         * @returns {*} - A promise
         */
        LearnResultResource.prototype.deleteSome = function (projectId, testNos) {
            testNos = testNos.join(',');

            return $http.delete(paths.api.URL + '/projects/' + projectId + '/results/' + testNos, {})
        };

        /**
         * Overwrite this method in order to map the data that is fetched from the server to a class. The function is
         * called after every successful request that contains data.
         *
         * @param {Object} data - The object that should be created an instance of a class from
         * @returns {*}
         */
        LearnResultResource.prototype.build = function (data) {
            return data;
        };

        /**
         * Overwrite this method in order to map the a list of objects that is fetched from the server to a list of
         * class instances. The function is called after every successful request that contains data.
         *
         * @param {Object[]} data - The list of objects that should be created a list of instances of a class from
         * @returns {*}
         */
        LearnResultResource.prototype.buildSome = function (data) {
            return data;
        };

        return LearnResultResource;
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.resources')
        .factory('ProjectResource', ProjectResource);

    ProjectResource.$inject = ['$http', 'paths'];

    /**
     * The resource that handles http calls to the API to do CRUD operations on projects
     *
     * @param $http - The $http angular service
     * @param paths - The constant with application paths
     * @return {Resource}
     * @constructor
     */
    function ProjectResource($http, paths) {

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

    Resource.$inject = ['$http', 'paths', 'ResourceResponseService'];

    /**
     * The resource that handles http requests to the API to do CRUD operations on symbol groups
     *
     * @param $http
     * @param paths
     * @returns {SymbolGroupResource}
     * @constructor
     */
    function Resource($http, paths, ResourceResponseService) {

        /**
         * The recourse object for a symbol group
         *
         * @constructor
         */
        function SymbolGroupResource() {
        }

        /**
         * Makes a GET request to /rest/projects/{projectId}/groups/{groupId} in order to fetch a specific symbol group.
         * As options, an object with a property 'embedSymbols' with a boolean property can be passed. If 'embedSymbols'
         * is true, then all symbols will be fetched, too. Otherwise an empty symbols array.
         *
         * @param {number} projectId - The id of the project the symbol group belongs to
         * @param {number} groupId - The id of the group that should be fetched
         * @param {Object} [options] - An object that can have a boolean property 'embedSymbols'
         * @returns {*} - An angular promise
         */
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

        /**
         * Makes a GET request to /rest/projects/{projectId}/groups in order to fetch all symbol groups of a project.
         * As options, an object with a property 'embedSymbols' with a boolean property can be passed. If 'embedSymbols'
         * is true, then all symbols of all symbol groups will be fetched, too. Otherwise an empty symbols array.
         *
         * @param {number} projectId - The id of the project whose projects should be fetched
         * @param {Object} options - An object that can have a boolean property 'embedSymbols'
         * @returns {*} - An angular promise
         */
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

        /**
         * Makes a GET request to /rest/projects/{projectId}/groups/{groupId}/symbols in order to fetch all symbols that
         * belong to a given symbol group.
         *
         * @param {number} projectId - The id of the project of the group
         * @param {number} groupId - The id of the group
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.getSymbols = function (projectId, groupId) {
            var _this = this;

            $http.get(paths.api.URL + '/projects/' + projectId + '/groups/' + groupId + '/symbols')
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Makes a POST request to /rest/projects/{projectId}/groups in order to create a new symbol group.
         *
         * @param {number} projectId - The id of the project of the symbol group
         * @param {number} group - The object of the symbol group that should be created
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.create = function (projectId, group) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/groups', group)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Makes a PUT request to /rest/projects/{projectId}/groups in order to update an existing symbol group.
         *
         * @param {number} projectId - The id of the project of the symbol group
         * @param {number} group - The symbol group that should be updated
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.update = function (projectId, group) {
            var _this = this;

            return $http.put(paths.api.URL + '/projects/' + projectId + '/groups/' + group.id, group)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Makes a DELETE request to /rest/projects/{projectId}/groups/{groupId} in order to delete an existing symbol
         * group. When deleted successfully, the symbols that belonged to the group are moved to the default group with
         * the id 0.
         *
         * @param {number} projectId - The id of the project of the symbol group
         * @param {number} group - The symbol group that should be deleted
         * @returns {*} - An angular promise
         */
        SymbolGroupResource.prototype.delete = function (projectId, group) {
            var _this = this;

            return $http.delete(paths.api.URL + '/projects/' + projectId + '/groups/' + group.id)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Overwrite this method in order to create an instance of a symbol group. This method will be called on every
         * successful http request where a single symbol group is involved.
         *
         * @param {Object} data - The data the symbol group instance should be build from
         * @returns {*}
         */
        SymbolGroupResource.prototype.build = function (data) {
            return data;
        };

        /**
         * Overwrite this method in order to create a list of instances of symbol groups. This method will be called on
         * every successful http request where multiple symbol groups are involved.
         *
         * @param {Object[]} data - The data the list of symbol group instances should be build from
         * @returns {*}
         */
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

    Resource.$inject = ['$http', 'paths', '_'];

    /**
     * The resource that handles http requests to the API to do CRUD operations on symbols
     *
     * @param $http - The angular $http service
     * @param paths - The constant with application paths
     * @param _ - Lodash
     * @returns {SymbolResource}
     * @constructor
     */
    function Resource($http, paths, _) {

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

            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId)
                .then(function (response) {
                    return _this.build(response.data);
                });
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

            if (options && options.deleted && options.deleted === true) {
                query = '?visibility=hidden';
            }

            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols' + (query ? query : ''))
                .then(function (response) {
                    return _this.buildSome(response.data);
                });
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

            return $http.get(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/complete')
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols in order to create a new symbol.
         *
         * @param projectId - The id of the project the symbol should belong to
         * @param symbol - The symbol that should be created
         */
        SymbolResource.prototype.create = function (projectId, symbol) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols', symbol)
                .then(function (response) {
                    return _this.build(response.data);
                })
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/batch in order to create multiple symbols at once.
         *
         * @param projectId - The id of the project the symbols should belong to
         * @param symbols - The array of symbols that should be created
         * @returns {*}
         */
        SymbolResource.prototype.createSome = function (projectId, symbols) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/batch', symbols)
                .then(function (response) {
                    return _this.buildSome(response.data);
                });
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

            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id, symbol)
                .then(function (response) {
                    return _this.build(response.data);
                });
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/batch/{symbolIds} in order to update a bunch of
         * symbols at once
         *
         * @param projectId
         * @param symbols
         * @returns {*}
         */
        SymbolResource.prototype.updateSome = function (projectId, symbols) {
            var _this = this;
            var ids = _.pluck(symbols, 'id').join(',');

            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/batch/' + ids, symbols)
                .then(function (response) {
                    return _this.buildSome(response.data);
                })
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/hide in order to delete a single symbol. The
         * Symbol will not be deleted permanently, it will be just hidden and ignored when you call getAll().
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbol - The the symbol that should be deleted
         * @returns {*}
         */
        SymbolResource.prototype.delete = function (projectId, symbol) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id + '/hide', {})
                .then(function (resonse) {
                    return _this.build(resonse.data);
                });
        };

        /**
         * Make a POST request to /rest/projects/{projectId}/symbols/batch/{symbolIds}/hide in order to delete multiple symbols at once.
         * Symbols will not be deleted permanently but stay hidden.
         *
         * @param projectId - The id of the projects the symbols belong to
         * @param symbols - The symbols that should be deleted
         * @returns {*}
         */
        SymbolResource.prototype.deleteSome = function (projectId, symbols) {
            var _this = this;
            var symbolIds = _.pluck(symbols, 'id').join(',');

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/batch/' + symbolIds + '/hide', {})
                .then(function (response) {
                    return _this.buildSome(response.data);
                });
        };

        /**
         * Makes a POST request to /rest/projects/{projectId}/symbols/symbolId/show in order to revert the deleting
         * of a symbol.
         *
         * @param projectId - The id of the project the symbol belongs to
         * @param symbol - The symbol that should be made visible again
         * @returns {*}
         */
        SymbolResource.prototype.recover = function (projectId, symbol) {
            var _this = this;

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbol.id + '/show', {})
                .then(function (response) {
                    return _this.build(response.data);
                });
        };

        /**
         * Makes a POST request to /rest/projects/{projectId}/symbols/batch/{symbolIds}/show in order to revert the
         * deleting of multiple symbols.
         *
         * @param projectId - The id of the project the symbols belongs to
         * @param symbols - The symbols that should be made visible again
         * @returns {*} - A promise object
         */
        SymbolResource.prototype.recoverSome = function (projectId, symbols) {
            var _this = this;
            var symbolIds = _.pluck(symbols, 'id').join(',');

            return $http.post(paths.api.URL + '/projects/' + projectId + '/symbols/batch/' + symbolIds + '/show', {})
                .then(function (response) {
                    return _this.buildSome(response.data);
                });
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
            MQS: 'mqsUsed',
            EQS: 'eqsUsed',
            SYMBOL_CALLS: 'symbolsUsed',
            SIGMA: 'sigma',
            DURATION: 'duration'
        };

        // The available service data
        return {
            createDataFromMultipleFinalResults: createDataFromMultipleFinalResults,
            createDataFromMultipleCompleteResults: createDataFromMultipleCompleteResults,
            properties: properties
        };

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
                        color: "#4B6396",
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

            var statistics = _.pluck(results, 'statistics');

            // extract values from learner results by a property
            switch (property) {
                case properties.MQS:
                    dataValues = _.pluck(statistics, properties.MQS);
                    break;
                case properties.EQS:
                    dataValues = _.pluck(statistics, properties.EQS);
                    break;
                case properties.SIGMA:
                    dataValues = _.map(_.pluck(results, properties.SIGMA), function (n) {
                        return n.length
                    });
                    break;
                case properties.SYMBOL_CALLS:
                    dataValues = _.pluck(statistics, properties.SYMBOL_CALLS);
                    break;
                case properties.DURATION:
                    dataValues = _.pluck(statistics, properties.DURATION);
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

            // create dummy data so that bar gets displayed correctly
            if (dataSets.length === 1) {
                dataSets.push({
                    x: 1,
                    val_1: 0
                })
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
            var colors = ['#4B6396', '#3BA3B8', '#3BB877', '#8ACF36', '#E8E835', '#F7821B', '#F74F1B', '#C01BF7'];
            var i, j;

            // extract values from learner results by a property
            switch (property) {
                case properties.MQS:
                    _.forEach(results, function (result) {
                        dataValues.push(_.pluck(result.statistics, properties.MQS));
                    });
                    break;
                case properties.EQS:
                    _.forEach(results, function (result) {
                        dataValues.push(_.pluck(result.statistics, properties.EQS));
                    });
                    break;
                case properties.SIGMA:
                    _.forEach(results, function (result) {
                        dataValues.push(_.map(_.pluck(result, properties.SIGMA), function (n) {
                            return n.length;
                        }));
                    });
                    break;
                case properties.SYMBOL_CALLS:
                    _.forEach(results, function (result) {
                        dataValues.push(_.pluck(result.statistics, properties.SYMBOL_CALLS));
                    });
                    break;
                case properties.DURATION:
                    _.forEach(results, function (result) {
                        dataValues.push(_.pluck(result.statistics, properties.DURATION));
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
                    color: colors[i % colors.length],
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
        .module('weblearner.resources')
        .factory('LearnerService', LearnerService);

    LearnerService.$inject = ['$http', '$q', 'paths'];

    /**
     * @param $http
     * @param $q
     * @param paths
     * @returns {{start: start, stop: stop, resume: resume, getStatus: getStatus, isActive: isActive}}
     * @constructor
     */
    function LearnerService($http, $q, paths) {

        return {
            start: start,
            stop: stop,
            resume: resume,
            getStatus: getStatus,
            isActive: isActive
        };

        /**
         * Start the server side learning process of a project
         *
         * @param projectId
         * @param learnConfiguration
         * @return {*}
         */
        function start(projectId, learnConfiguration) {
            return $http.post(paths.api.URL + '/learner/start/' + projectId, learnConfiguration);
        }

        /**
         * Try to force stop a running learning process of a project. May not necessarily work due to difficulties
         * with the thread handling
         *
         * @return {*}
         */
        function stop() {
            return $http.get(paths.api.URL + '/learner/stop/');
        }

        /**
         * Resume a paused learning process where the eqOracle was 'sample' and the learn process was interrupted
         * so that the ongoing process parameters could be defined
         *
         * @param projectId
         * @param learnConfiguration
         * @return {*}
         */
        function resume(projectId, testNo, learnConfiguration) {
            return $http.post(paths.api.URL + '/learner/resume/' + projectId + '/' + testNo, learnConfiguration);
        }

        /**
         * Gets the learner result that includes the hypothesis. make sure isActive() returns true before calling this
         * function
         *
         * @return {*}
         */
        function getStatus() {
            return $http.get(paths.api.URL + '/learner/status/')
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Check if the server is finished learning a project
         *
         * @return {*}
         */
        function isActive() {
            return $http.get(paths.api.URL + '/learner/active')
                .then(function (response) {
                    return response.data;
                })
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
     *
     * @param $modal
     * @param paths
     * @returns {{prompt: prompt, confirm: confirm}}
     * @constructor
     */
    function PromptService($modal, paths) {

        // the available service methods
        return {
            prompt: prompt,
            confirm: confirm
        };

        /**
         * Opens the prompt dialog.
         *
         * @param text {string} - The text to display
         * @param options {{regexp: string, errorMsg: string}}
         * @return {*} - The modal result promise
         */
        function prompt(text, options) {
            var modal = $modal.open({
                templateUrl: paths.views.MODALS + '/prompt-dialog.html',
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
         * Opens the confirm dialog
         *
         * @param text - The text to be displayed in the confirm dialog
         * @returns {*} - The modal result promise
         */
        function confirm(text) {
            var modal = $modal.open({
                templateUrl: paths.views.MODALS + '/confirm-dialog.html',
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
        .service('ToastService', ToastService);

    ToastService.$inject = ['ngToast'];

    /**
     * A service that is used as a wrapper around the ngToast module.
     *
     * @param ngToast - The ngToast
     * @returns {{success: success, danger: danger, info: info}}
     * @constructor
     */
    function ToastService(ngToast) {

        return {
            success: success,
            danger: danger,
            info: info
        };

        /**
         * Create a success toast message
         *
         * @param {String} message - The message to be displayed
         */
        function success(message) {
            ngToast.create({
                class: 'success',
                content: message,
                dismissButton: true
            });
        }

        /**
         * Create an error / danger toast message
         *
         * @param {String} message - The message to be displayed
         */
        function danger(message) {
            ngToast.create({
                class: 'danger',
                content: message,
                dismissButton: true
            });
        }

        /**
         * Create an info toast message
         *
         * @param {String} message - The message to be displayed
         */
        function info(message) {
            ngToast.create({
                class: 'info',
                content: message,
                dismissButton: true
            });
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('WebElementPickerService', WebElementPickerService);

    WebElementPickerService.$inject = ['$rootScope'];

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

        return {
            open: open,
            close: close,
            ok: ok
        };

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
        .filter('formatEnumKey', formatEnumKey)
        .filter('formatEqOracle', formatEqOracle)
        .filter('formatAlgorithm', formatAlgorithm);

    formatEqOracle.$inject = ['eqOracles'];
    formatAlgorithm.$inject = ['learnAlgorithms'];

    function formatEnumKey() {
        return function (string) {
            return string.toLowerCase().split('_').join(' ').replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        }
    }

    function formatEqOracle(eqOracles) {
        return function (type) {
            switch (type) {
                case eqOracles.RANDOM:
                    return 'Random Word';
                case eqOracles.COMPLETE:
                    return 'Complete';
                case eqOracles.SAMPLE:
                    return 'Sample';
                default:
                    return type;
            }
        }
    }

    function formatAlgorithm(learnAlgorithms) {
        return function (name) {
            switch (name) {
                case learnAlgorithms.EXTENSIBLE_LSTAR:
                    return 'L*';
                case learnAlgorithms.DHC:
                    return 'DHC';
                case learnAlgorithms.TTT:
                    return 'TTT';
                case learnAlgorithms.DISCRIMINATION_TREE:
                    return 'Discrimination Tree';
                default:
                    return name;
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

    /**
     * Capitalizes a given string
     *
     * @returns {Function} - The filter
     */
    function capitalize() {
        return function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
}());