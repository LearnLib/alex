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

        // configure toast position
        .config(['ngToastProvider', function (ngToastProvider) {
            ngToastProvider.configure({
                verticalPosition: 'top',
                horizontalPosition: 'center',
                maxNumber: 1
            });
        }])

        .run(['$rootScope', '$state', '_', 'paths', function ($rootScope, $state, _, paths) {

            // make some stuff available for use in templates
            $rootScope._ = _;
            $rootScope.paths = paths;

            // workaround for go back in history button since ui.router does not support it
            // save previous state in ui.router $state service
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                $state.previous = fromState;
            });
        }])
}());;angular.module('templates-all', ['app/views/directives/counterexamples-widget.html', 'app/views/directives/html-element-picker.html', 'app/views/directives/hypothesis.html', 'app/views/directives/index-browser.html', 'app/views/directives/learn-results-panel.html', 'app/views/directives/learn-results-slideshow-panel.html', 'app/views/directives/learn-resume-settings-widget.html', 'app/views/directives/learner-result-chart-multiple-final.html', 'app/views/directives/load-screen.html', 'app/views/directives/navigation.html', 'app/views/directives/observation-table.html', 'app/views/directives/view-heading.html', 'app/views/directives/widget.html', 'app/views/includes/action-forms.html', 'app/views/modals/action-create-modal.html', 'app/views/modals/action-edit-modal.html', 'app/views/modals/confirm-dialog.html', 'app/views/modals/hypothesis-layout-settings-modal.html', 'app/views/modals/learn-result-details-modal.html', 'app/views/modals/learn-setup-settings-modal.html', 'app/views/modals/prompt-dialog.html', 'app/views/modals/symbol-create-modal.html', 'app/views/modals/symbol-edit-modal.html', 'app/views/modals/symbol-group-create-modal.html', 'app/views/modals/symbol-group-edit-modal.html', 'app/views/modals/symbol-move-modal.html', 'app/views/modals/variables-counters-occurrence-modal.html', 'app/views/pages/about.html', 'app/views/pages/counters.html', 'app/views/pages/help.html', 'app/views/pages/home.html', 'app/views/pages/learn-results-compare.html', 'app/views/pages/learn-results-statistics.html', 'app/views/pages/learn-results.html', 'app/views/pages/learn-setup.html', 'app/views/pages/learn-start.html', 'app/views/pages/project-create.html', 'app/views/pages/project-settings.html', 'app/views/pages/project.html', 'app/views/pages/symbols-actions.html', 'app/views/pages/symbols-export.html', 'app/views/pages/symbols-history.html', 'app/views/pages/symbols-import.html', 'app/views/pages/symbols-trash.html', 'app/views/pages/symbols.html']);

angular.module("app/views/directives/counterexamples-widget.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/counterexamples-widget.html",
    "<form class=\"form form-condensed\" ng-submit=\"addCounterExample()\">\n" +
    "    <p class=\"text-muted\">\n" +
    "        <em>Click on the labels of the hypothesis to create a counterexample. Click on an output to toggle it.</em>\n" +
    "    </p>\n" +
    "\n" +
    "    <div class=\"list-group list-group-condensed\" as-sortable ng-model=\"counterExample\">\n" +
    "        <div class=\"list-group-item\" ng-repeat=\"io in counterExample\" as-sortable-item>\n" +
    "\n" +
    "            <i class=\"fa fa-fw fa-close pull-right\" ng-click=\"removeInputOutputAt($index)\"></i>\n" +
    "            <i class=\"fa fa-fw fa-sort pull-right\" as-sortable-item-handle></i>\n" +
    "\n" +
    "            <span class=\"label label-primary\">{{io.input}}</span>\n" +
    "            <span class=\"label\" ng-class=\"io.output === outputAlphabet.OK ? 'label-success' : 'label-danger'\"\n" +
    "                  ng-click=\"toggleOutputAt($index)\">{{io.output}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\" ng-show=\"counterExample.length > 0\">\n" +
    "        <button class=\"btn btn-primary btn-xs\">Add</button>\n" +
    "        <a href class=\"btn btn-default btn-xs\" ng-click=\"testCounterExample()\">Test</a>\n" +
    "        <hr>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<ul class=\"list-group\">\n" +
    "    <li class=\"list-group-item\" ng-repeat=\"ce in tmpCounterExamples\" ng-click=\"selectCounterExampleAt($index)\">\n" +
    "        <span class=\"btn btn-icon pull-right\" ng-click=\"removeCounterExampleAt($index)\">\n" +
    "            <i class=\"fa fa-trash\"></i>\n" +
    "        </span>\n" +
    "        {{ce}}\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("app/views/directives/html-element-picker.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/html-element-picker.html",
    "<div id=\"web-element-picker-wrapper\"></div>\n" +
    "\n" +
    "<div id=\"web-element-picker\">\n" +
    "\n" +
    "    <nav class=\"navbar navbar-default\" role=\"navigation\">\n" +
    "        <div class=\"container-fluid\">\n" +
    "\n" +
    "            <form class=\"navbar-form navbar-left\" ng-submit=\"loadUrl()\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <div class=\"input-group-addon\" tooltip-placement=\"right\" tooltip=\"{{project.baseUrl}}\">..</div>\n" +
    "                        <input type=\"text\" class=\"form-control\" ng-model=\"url\" placeholder=\"url\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <button type=\"submit\" class=\"btn btn-default\">Load</button>\n" +
    "            </form>\n" +
    "\n" +
    "            <button class=\"btn btn-default navbar-btn\" ng-click=\"enableSelection()\"><i\n" +
    "                    class=\"fa fa-magic\"></i></button>\n" +
    "\n" +
    "            <button class=\"btn btn-default navbar-btn disabled\" ng-show=\"selector != null\" ng-bind=\"selector\"></button>\n" +
    "            <button class=\"btn btn-default navbar-btn disabled\" ng-show=\"selector == null\">\n" +
    "                No Selected Element\n" +
    "            </button>\n" +
    "\n" +
    "            <div class=\"navbar navbar-nav navbar-right\">\n" +
    "                <button class=\"btn btn-default navbar-btn pull-right\" ng-click=\"close()\"><i\n" +
    "                        class=\"fa fa-close\"></i></button>\n" +
    "                <button class=\"btn btn-default navbar-btn pull-right\" ng-click=\"ok()\" style=\"margin-right: 7px\">ok\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </nav>\n" +
    "\n" +
    "    <div class=\"iframe-wrapper\">\n" +
    "        <iframe fit-parent-dimensions bind-resize=\"true\"></iframe>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("app/views/directives/hypothesis.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/hypothesis.html",
    "<div style=\"position: absolute; top: 0; width: 100%; bottom: 0; overflow: hidden; background: #fff;\">\n" +
    "    <svg class=\"hypothesis\"></svg>\n" +
    "</div>");
}]);

angular.module("app/views/directives/index-browser.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/index-browser.html",
    "<div class=\"page-browser\">\n" +
    "    <div class=\" btn-group btn-group-xs\">\n" +
    "        <button class=\"btn btn-default\" ng-click=\"firstStep()\">\n" +
    "            <i class=\"fa fa-angle-double-left fa-fw\"></i>\n" +
    "        </button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"previousStep()\">\n" +
    "            <i class=\"fa fa-angle-left fa-fw\"></i>\n" +
    "        </button>\n" +
    "        <button class=\"btn btn-default disabled\">\n" +
    "            <span ng-bind=\"index + 1\"></span>/<span ng-bind=\"length\"></span>\n" +
    "        </button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"nextStep()\">\n" +
    "            <i class=\"fa fa-angle-right fa-fw\"></i>\n" +
    "        </button>\n" +
    "        <button class=\"btn btn-default\" ng-click=\"lastStep()\">\n" +
    "            <i class=\"fa fa-angle-double-right fa-fw\"></i>\n" +
    "        </button>\n" +
    "    </div>\n" +
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
    "                                <a href learn-result-details-modal-handle result=\"results[pointer]\">\n" +
    "                                    <i class=\"fa fa-info fa-fw\"></i> Details\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li>\n" +
    "                                <a href download-svg ancestor-or-element=\"#hypothesis-panel-{{index}}\">\n" +
    "                                    <i class=\"fa fa-save fa-fw\"></i>&nbsp; Save as *.svg\n" +
    "                                </a>\n" +
    "                                <a href download-as-json data=\"results[pointer].hypothesis\">\n" +
    "                                    <i class=\"fa fa-save fa-fw\"></i>&nbsp; Save as *.json\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <button class=\"btn btn-default btn-xs\" hypothesis-layout-settings-modal-handle\n" +
    "                            layout-settings=\"layoutSettings\">\n" +
    "                        <i class=\"fa fa-sliders fa-fw\"></i> Layout\n" +
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
    "                            ng-show=\"mode === modes.INTERNAL && results[pointer].configuration.algorithm === learnAlgorithms.EXTENSIBLE_LSTAR\"\n" +
    "                            download-table-as-csv ancestor-or-element=\"#hypothesis-panel-{{index}}\">\n" +
    "                        Download CSV\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default btn-xs\"\n" +
    "                            ng-show=\"mode === modes.INTERNAL && results[pointer].configuration.algorithm === learnAlgorithms.DISCRIMINATION_TREE\"\n" +
    "                            download-svg ancestor-or-element=\"#hypothesis-panel-{{index}}\">\n" +
    "                        Download SVG\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-default btn-xs\"\n" +
    "                            ng-show=\"mode === modes.HYPOTHESIS\"\n" +
    "                            ng-click=\"showInternalDataStructure()\">\n" +
    "                        Internal\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"pull-right\" ng-transclude></div>\n" +
    "\n" +
    "            <div class=\"pull-right\">\n" +
    "                <index-browser index=\"pointer\" length=\"{{results.length}}\"></index-browser>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- END: Subnavigation -->\n" +
    "\n" +
    "    <div class=\"hypothesis-panel\" id=\"hypothesis-panel-{{index}}\">\n" +
    "\n" +
    "        <hypothesis id=\"hypothesis\" test=\"results[pointer]\" layout-settings=\"layoutSettings\"\n" +
    "                    ng-if=\"mode === modes.HYPOTHESIS && pointer === results.length - 1\"\n" +
    "                    is-selectable=\"true\"></hypothesis>\n" +
    "\n" +
    "        <hypothesis id=\"hypothesis\" test=\"results[pointer]\" layout-settings=\"layoutSettings\"\n" +
    "                    ng-if=\"mode === modes.HYPOTHESIS && pointer !== results.length - 1\"></hypothesis>\n" +
    "\n" +
    "        <observation-table data=\"results[pointer].algorithmInformation\"\n" +
    "                           ng-if=\"mode === modes.INTERNAL && results[pointer].configuration.algorithm === learnAlgorithms.EXTENSIBLE_LSTAR\">\n" +
    "        </observation-table>\n" +
    "\n" +
    "        <discrimination-tree data=\"results[pointer].algorithmInformation\"\n" +
    "                             ng-if=\"mode === modes.INTERNAL && results[pointer].configuration.algorithm === learnAlgorithms.DISCRIMINATION_TREE\">\n" +
    "        </discrimination-tree>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("app/views/directives/learn-results-slideshow-panel.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/learn-results-slideshow-panel.html",
    "<learn-results-panel results=\"results\" index=\"{{index}}\">\n" +
    "    <button class=\"btn btn-xs btn-danger\" ng-click=\"close()\" style=\"margin-left: 5px\">\n" +
    "        <i class=\"fa fa-close\"></i>\n" +
    "    </button>\n" +
    "</learn-results-panel>");
}]);

angular.module("app/views/directives/learn-resume-settings-widget.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/learn-resume-settings-widget.html",
    "<form class=\"form form-condensed\">\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">EQ Oracle</label><br>\n" +
    "        <select class=\"form-control\" ng-model=\"selectedEqOracle\" ng-change=\"setEqOracle()\"\n" +
    "                ng-options=\"(v|formatEqOracle) for (k,v) in eqOracles\">\n" +
    "            <option value=\"\" disabled>select a method</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <div ng-if=\"learnConfiguration.eqOracle.type == eqOracles.RANDOM\">\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"learnConfiguration.eqOracle.minLength\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> min length\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"learnConfiguration.eqOracle.maxLength\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> max length\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"learnConfiguration.eqOracle.maxNoOfTests\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> no of random words\n" +
    "            </p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"learnConfiguration.eqOracle.type == eqOracles.COMPLETE\">\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"learnConfiguration.eqOracle.minDepth\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> min depth\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                <input class=\"form-control\" ng-model=\"learnConfiguration.eqOracle.maxDepth\" type=\"number\"\n" +
    "                       style=\"display: inline; width: auto\"> max depth\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">Steps to Learn (0 := never stop)</label>\n" +
    "        <input ng-model=\"learnConfiguration.maxAmountOfStepsToLearn\" class=\"form-control\" type=\"text\" placeholder=\"0\">\n" +
    "    </div>\n" +
    "\n" +
    "</form>");
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
    "            <a class=\"navbar-brand\" ui-sref=\"home\"><strong>ALEX</strong></a>\n" +
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
    "                            <strong class=\"project-title\" ng-bind=\"project.name\"></strong>\n" +
    "                            <span class=\"caret\"></span>\n" +
    "                        </a>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\" ng-if=\"project\">\n" +
    "                            <li><a class=\"disabled\" ui-sref=\"project\">Overview</a></li>\n" +
    "                            <li><a ui-sref=\"project.settings\">Settings</a></li>\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li><a href=\"#\" ng-click=\"closeProject()\">Close</a></li>\n" +
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
    "                    <li class=\"dropdown\" dropdown dropdown-navigation>\n" +
    "                        <a href=\"#\" dropdown-toggle class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\"\n" +
    "                           aria-expanded=\"false\">Learn <span class=\"caret\"></span></a>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                            <li><a ui-sref=\"learn.setup\">Setup a Learn Process</a></li>\n" +
    "                            <li class=\"divider\"></li>\n" +
    "                            <li><a ui-sref=\"counters\">Manage Counters</a></li>\n" +
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
    "<table class=\"table table-condensed observation-table\">\n" +
    "    <thead>\n" +
    "        <tr>\n" +
    "            <th ng-repeat=\"th in table.header\" ng-bind=\"th\"></th>\n" +
    "        </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "    <tr ng-repeat=\"tr in table.body.s1 track by $index\">\n" +
    "        <td ng-repeat=\"td in tr track by $index\" ng-bind=\"td\"></td>\n" +
    "    </tr>\n" +
    "    <tr ng-repeat=\"tr in table.body.s2 track by $index\" ng-class=\"$index === 0 ? 'line': ''\">\n" +
    "        <td ng-repeat=\"td in tr track by $index\" ng-bind=\"td\"></td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>");
}]);

angular.module("app/views/directives/view-heading.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/view-heading.html",
    "<div class=\"view-heading\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"view-heading-title-pre\" ng-transclude></div>\n" +
    "        <h2 class=\"view-heading-title\" ng-bind=\"::title\"></h2>\n" +
    "\n" +
    "        <p class=\"view-heading-sub-title\" ng-bind=\"::subTitle\"></p>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("app/views/directives/widget.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/directives/widget.html",
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <div class=\"pull-right\">\n" +
    "           <span class=\"panel-collapse-handle\" ng-click=\"toggleCollapse()\">\n" +
    "               <i class=\"fa\" ng-class=\"collapsed ? 'fa-plus-square' : 'fa-minus-square'\"></i>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "        <strong class=\"text-muted\" ng-bind=\"title\"></strong>\n" +
    "    </div>\n" +
    "    <div class=\"panel-body\" ng-show=\"!collapsed\" ng-transclude></div>\n" +
    "</div>");
}]);

angular.module("app/views/includes/action-forms.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/includes/action-forms.html",
    "<!-- BEGIN: SEARCH_FOR_TEXT -->\n" +
    "<div ng-if=\"action.type === actionTypes.web.SEARCH_FOR_TEXT\">\n" +
    "\n" +
    "    <h4><strong>Search for Text</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Search on a page for a piece of text or a regular expression\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">Value</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.value\">\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "        <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"action.regexp\"> Use Regular Expression\n" +
    "        </label>\n" +
    "    </div>\n" +
    "    <a class=\"btn btn-default btn-sm\" html-element-picker text=\"action.value\">\n" +
    "        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "    </a>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: SEARCH_FOR_TEXT -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: SEARCH_FOR_NODE -->\n" +
    "<div ng-if=\"action.type === actionTypes.web.SEARCH_FOR_NODE\">\n" +
    "\n" +
    "    <h4><strong>Search for Node</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Search an HTML element in the DOM tree of a page\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">CSS selector</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.value\">\n" +
    "    </div>\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-sm\" html-element-picker model=\"action.value\">\n" +
    "        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "    </a>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: SEARCH_FOR_NODE -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CLEAR -->\n" +
    "<div ng-if=\"action.type === actionTypes.web.CLEAR\">\n" +
    "\n" +
    "    <h4><strong>Clear Node</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Clear an element (eg. input or contenteditable element)\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">CSS selector</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "    </div>\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-sm\" html-element-picker model=\"action.node\">\n" +
    "        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "    </a>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CLEAR -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CLICK -->\n" +
    "<div ng-if=\"action.type === actionTypes.web.CLICK\">\n" +
    "\n" +
    "    <h4><strong>Click</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Click on an element\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">CSS selector</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "    </div>\n" +
    "    <a class=\"btn btn-default btn-sm\" html-element-picker model=\"action.node\">\n" +
    "        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "    </a>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CLICK -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CLICK_LINK_BY_TEXT -->\n" +
    "<div ng-if=\"action.type === actionTypes.web.CLICK_LINK_BY_TEXT\">\n" +
    "\n" +
    "    <h4><strong>Click Link By Its Text</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Finds a link element with a given text and clicks on it\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">Link Text</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"The text of the link\" ng-model=\"action.value\">\n" +
    "    </div>\n" +
    "    <a class=\"btn btn-default btn-sm\" html-element-picker text=\"action.value\">\n" +
    "        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "    </a>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CLICK_LINK_BY_TEXT -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: FILL -->\n" +
    "<div ng-if=\"action.type === actionTypes.web.FILL\">\n" +
    "\n" +
    "    <h4><strong>Fill Node</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Fill an element with content (eg. input or contenteditable element)\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">CSS selector</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">The value to fill the element with</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"value\" ng-model=\"action.value\">\n" +
    "    </div>\n" +
    "    <a class=\"btn btn-default btn-sm\" html-element-picker model=\"action.node\" text=\"action.value\">\n" +
    "        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "    </a>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: FILL -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: GO_TO -->\n" +
    "<div ng-if=\"action.type === actionTypes.web.GO_TO\">\n" +
    "\n" +
    "    <h4><strong>Go to URL</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Go to a url that is <strong>relative</strong> to your projects' base url\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">Url</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: GO_TO -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: SUBMIT -->\n" +
    "<div ng-if=\"action.type === actionTypes.web.SUBMIT\">\n" +
    "\n" +
    "    <h4><strong>Submit Form</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Submit a form\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">CSS selector</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "    </div>\n" +
    "    <a class=\"btn btn-default btn-sm\" html-element-picker model=\"action.node\">\n" +
    "        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "    </a>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: SUBMIT -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: SELECT -->\n" +
    "<div ng-if=\"action.type === actionTypes.web.SELECT\">\n" +
    "\n" +
    "    <h4><strong>Select value</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Select a value from a select input\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">CSS selector</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"CSS selector\" ng-model=\"action.node\">\n" +
    "    </div>\n" +
    "    <a class=\"btn btn-default btn-sm\" html-element-picker model=\"action.node\">\n" +
    "        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "    </a>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <label class=\"control-label\">Value</label>\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"Selected value\" ng-model=\"action.value\">\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: SELECT -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CALL_URL -->\n" +
    "<div ng-if=\"action.type === actionTypes.rest.CALL_URL\">\n" +
    "\n" +
    "    <h4><strong>Call Url</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">Make a HTTP request to an URL (relative to your projects base url)</p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"url\" ng-model=\"action.url\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <select class=\"form-control\" ng-options=\"m for m in ['DELETE', 'GET', 'POST', 'PUT']\"\n" +
    "                ng-model=\"action.method\">\n" +
    "            <option value=\"\" disabled>Select a Method</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label>Data</label>\n" +
    "\n" +
    "        <div ng-model=\"action.data\"\n" +
    "             style=\"border-radius: 4px; width: 100%; height: 150px; border: 1px solid #ccc\"\n" +
    "             ui-ace=\"{useWrapMode : true, showGutter: true, theme:'eclipse', mode: 'json'}\"></div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CALL_URL -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "<div ng-if=\"action.type === actionTypes.rest.CHECK_ATTRIBUTE_EXISTS\">\n" +
    "\n" +
    "    <h4><strong>Check Attribute Exists</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">Check if a JSON attribute exists in the response body</p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\"\n" +
    "               ng-model=\"action.attribute\">\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CHECK_ATTRIBUTE_EXISTS -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CHECK_ATTRIBUTE_TYPE -->\n" +
    "<div ng-if=\"action.type === actionTypes.rest.CHECK_ATTRIBUTE_TYPE\">\n" +
    "\n" +
    "    <h4><strong>Check Attribute Type</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">Check if a JSON attribute in the response body has a specific type</p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\"\n" +
    "               ng-model=\"action.attribute\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <select class=\"form-control\" ng-model=\"action.jsonType\"\n" +
    "                ng-options=\"t as t for t in ['ARRAY', 'BOOLEAN', 'INTEGER', 'OBJECT', 'NULL', 'STRING']\">\n" +
    "            <option value=\"\" disabled>Choose a JavaScript type</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CHECK_ATTRIBUTE_TYPE -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CHECK_ATTRIBUTE_VALUE -->\n" +
    "<div ng-if=\"action.type === actionTypes.rest.CHECK_ATTRIBUTE_VALUE\">\n" +
    "\n" +
    "    <h4><strong>Check Attribute Value</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">Check a JSON attribute of the response body to be a specific value</p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"json attribute, e.g. myobj.attr[1].obj\"\n" +
    "               ng-model=\"action.attribute\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"the attribute value\"\n" +
    "               ng-model=\"action.value\">\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "        <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"action.regexp\"> is regular expression\n" +
    "        </label>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CHECK_ATTRIBUTE_VALUE -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CHECK_HEADER_FIELD -->\n" +
    "<div ng-if=\"action.type === actionTypes.rest.CHECK_HEADER_FIELD\">\n" +
    "\n" +
    "    <h4><strong>Check Header Field</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">Check a HTTP response header field to have a specific value</p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"http header field, e.g. Content-Type\"\n" +
    "               ng-model=\"action.key\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" type=\"text\"\n" +
    "               placeholder=\"http header field value, e.g. application/json\" ng-model=\"action.value\">\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "        <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"action.regexp\">is regular expression\n" +
    "        </label>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CHECK_HEADER_FIELD -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CHECK_HTTP_BODY_TEXT -->\n" +
    "<div ng-if=\"action.type === actionTypes.rest.CHECK_HTTP_BODY_TEXT\">\n" +
    "\n" +
    "    <h4><strong>Check HTTP Body Text</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">Search for a string or a regular express in the response body of a request</p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" type=\"text\" placeholder=\"value to search for\"\n" +
    "               ng-model=\"action.value\">\n" +
    "    </div>\n" +
    "    <div class=\"checkbox\">\n" +
    "        <label>\n" +
    "            <input type=\"checkbox\" ng-model=\"action.regexp\">\n" +
    "            is regular expression\n" +
    "        </label>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CHECK_HTTP_BODY_TEXT -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: CHECK_STATUS -->\n" +
    "<div ng-if=\"action.type === actionTypes.rest.CHECK_STATUS\">\n" +
    "\n" +
    "    <h4><strong>Check Status</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">Check the HTTP response to have a specific status</p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <label>HTTP Status</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" type=\"number\" placeholder=\"e.g. 200, 404 ...\"\n" +
    "               ng-model=\"action.status\">\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "<!-- END: CHECK_STATUS -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: WAIT -->\n" +
    "<div ng-if=\"action.type === actionTypes.other.WAIT\">\n" +
    "    <h4><strong>Wait</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Wait for a specified amount of time in ms.\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "\n" +
    "    <label>Duration</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"number\" class=\"form-control\" min=\"0\" ng-model=\"action.duration\" placeholder=\"0\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- END: WAIT -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: EXECUTE_SYMBOL -->\n" +
    "<div ng-if=\"action.type === actionTypes.other.EXECUTE_SYMBOL\">\n" +
    "    <h4><strong>Execute Symbol</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Execute the actions of another symbol\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-xs-8\">\n" +
    "            <label>Symbol</label>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <input class=\"form-control\" list=\"symbols\" type=\"text\"\n" +
    "                       ng-model=\"action.getSymbol().name\" placeholder=\"The name of the symbol\"\n" +
    "                       ng-change=\"action.setSymbol(_.find(symbols, {name: action.getSymbol().name}))\">\n" +
    "                <datalist id=\"symbols\">\n" +
    "                    <option ng-repeat=\"symbol in symbols\" value=\"{{symbol.name}}\"></option>\n" +
    "                </datalist>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-xs-4\" ng-show=\"action.getSymbol().revision\">\n" +
    "            <label>Revision</label>\n" +
    "            <input class=\"form-control\" list=\"revisions\" type=\"number\" min=\"1\"\n" +
    "                   max=\"{{action.getSymbol().revision}}\" ng-model=\"action.symbolToExecute.revision\">\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- END: EXECUTE_SYMBOL -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: INCREMENT_COUNTER -->\n" +
    "<div ng-if=\"action.type === actionTypes.other.INCREMENT_COUNTER\">\n" +
    "    <h4><strong>Increment Counter</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Increment a counter variable\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "    <label>Name</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "               placeholder=\"The name of the counter\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- END: INCREMENT_COUNTER -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: SET_COUNTER -->\n" +
    "<div ng-if=\"action.type === actionTypes.other.SET_COUNTER\">\n" +
    "    <h4><strong>Set Counter</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Set the value of a counter variable\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "    <label>Name</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "               placeholder=\"The name of the counter\">\n" +
    "    </div>\n" +
    "    <label>Value</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"number\" class=\"form-control\" ng-model=\"action.value\" placeholder=\"0\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- END: SET_COUNTER -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: SET_VARIABLE -->\n" +
    "<div ng-if=\"action.type === actionTypes.other.SET_VARIABLE\">\n" +
    "    <h4><strong>Set Variable</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Set the value of a variable\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "    <label>Name</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "               placeholder=\"The name of the variable\">\n" +
    "    </div>\n" +
    "    <label>Value</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" ng-model=\"action.value\" placeholder=\"The value of the variable\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- END: SET_VARIABLE -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: SET_VARIABLE_BY_JSON_ATTRIBUTE -->\n" +
    "<div ng-if=\"action.type === actionTypes.other.SET_VARIABLE_BY_JSON_ATTRIBUTE\">\n" +
    "    <h4><strong>Set Variable By JSON Attribute</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Set the value of a variable to the content of a JSON\n" +
    "        attribute\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "    <label>Name</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "               placeholder=\"The name of the variable\">\n" +
    "    </div>\n" +
    "    <label>Attribute</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" ng-model=\"action.value\" placeholder=\"The JSON attribute\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- END: SET_VARIABLE_BY_JSON_ATTRIBUTE -->\n" +
    "\n" +
    "\n" +
    "<!-- BEGIN: SET_VARIABLE_BY_NODE -->\n" +
    "<div ng-if=\"action.type === actionTypes.other.SET_VARIABLE_BY_NODE\">\n" +
    "    <h4><strong>Set Variable By Node Value</strong></h4>\n" +
    "\n" +
    "    <p class=\"text-muted\">\n" +
    "        Set the value of a variable to the content of a HTML element\n" +
    "    </p>\n" +
    "    <hr>\n" +
    "    <label>Name</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" class=\"form-control\" ng-model=\"action.name\"\n" +
    "               placeholder=\"The name of the variable\">\n" +
    "    </div>\n" +
    "    <label>XPath</label>\n" +
    "\n" +
    "    <div class=\"form-group\">\n" +
    "        <input class=\"form-control\" ng-model=\"action.value\" placeholder=\"The CSS3 XPath to the element\">\n" +
    "    </div>\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-sm\" html-element-picker model=\"action.value\">\n" +
    "        <i class=\"fa fa-magic fa-fw\"></i>&nbsp; WebPicker\n" +
    "    </a>\n" +
    "</div>\n" +
    "<!-- END: SET_VARIABLE_BY_JSON_ATTRIBUTE -->\n" +
    "\n" +
    "\n" +
    "<div ng-if=\"action !== null\">\n" +
    "    <hr>\n" +
    "    <p>\n" +
    "        <a href ng-click=\"advancedOptions = !advancedOptions\"><i class=\"fa fa-gear fa-fw\"></i> Advanced\n" +
    "            Options</a>\n" +
    "    </p>\n" +
    "\n" +
    "    <div collapse=\"!advancedOptions\">\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.negated\"> Negate\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"checkbox\">\n" +
    "            <label>\n" +
    "                <input type=\"checkbox\" ng-model=\"action.ignoreFailure\"> Ignore Failure\n" +
    "            </label>\n" +
    "        </div>\n" +
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
    "                    <accordion-group is-open=\"true\">\n" +
    "                        <accordion-heading>\n" +
    "                            <div><strong>Web</strong></div>\n" +
    "                        </accordion-heading>\n" +
    "                        <a href ng-repeat=\"(k,v) in actionTypes.web\" ng-click=\"selectNewActionType(v)\"\n" +
    "                           ng-bind=\"::(k|formatEnumKey)\"></a>\n" +
    "                    </accordion-group>\n" +
    "                    <accordion-group>\n" +
    "                        <accordion-heading>\n" +
    "                            <div><strong>Rest</strong></div>\n" +
    "                        </accordion-heading>\n" +
    "                        <a href ng-repeat=\"(k,v) in actionTypes.rest\" ng-click=\"selectNewActionType(v)\"\n" +
    "                           ng-bind=\"::(k|formatEnumKey)\"></a>\n" +
    "                    </accordion-group>\n" +
    "                    <accordion-group>\n" +
    "                        <accordion-heading>\n" +
    "                            <div><strong>Other</strong></div>\n" +
    "                        </accordion-heading>\n" +
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
    "                <ng-include src=\"paths.views.INCLUDES + '/action-forms.html'\"></ng-include>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"modal-footer\">\n" +
    "        <a href class=\"btn btn-info btn-sm\" ng-click=\"createActionAndContinue()\">Create and Continue</a>\n" +
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
    "        <ng-include src=\"paths.views.INCLUDES + '/action-forms.html'\"></ng-include>\n" +
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
    "    <button class=\"btn btn-sm btn-primary\" ng-click=\"ok()\">Ok</button>\n" +
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
    "            <label class=\"control-label\">EQ Oracle</label><br>\n" +
    "            <span class=\"text-muted\">Select how counter examples should be found</span>\n" +
    "            <select class=\"form-control\"\n" +
    "                    ng-model=\"selectedEqOracle\"\n" +
    "                    ng-change=\"setEqOracle()\"\n" +
    "                    ng-options=\"(v|formatEqOracle) for (k,v) in eqOracles\">\n" +
    "                <option value=\"\" disabled>select an EQ-Oracle</option>\n" +
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
    "        <button class=\"btn btn-sm btn-primary\" type=\"submit\">Ok</button>\n" +
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
    "        <button class=\"btn btn-sm btn-primary\" type=\"submit\">Create Symbol Group</button>\n" +
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
    "        <a href class=\"btn btn-sm btn-default\" ng-if=\"group.id !== 0\" ng-click=\"deleteGroup()\">Delete</a>\n" +
    "        <button class=\"btn btn-sm btn-primary\" type=\"submit\">Update</button>\n" +
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

angular.module("app/views/modals/variables-counters-occurrence-modal.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/modals/variables-counters-occurrence-modal.html",
    "<div class=\"modal-header\">\n" +
    "\n" +
    "    <a class=\"btn btn-default btn-icon pull-right\" ng-click=\"close()\">\n" +
    "        <i class=\"fa fa-close fa-fw\"></i>\n" +
    "    </a>\n" +
    "\n" +
    "    <h3 class=\"modal-title\">Occurrences</h3>\n" +
    "    <span class=\"text-muted\">A list of all occurrences of used variables and counters</span>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "    <table class=\"table table-condensed\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th>Name</th>\n" +
    "                <th>Group</th>\n" +
    "                <th>Symbol</th>\n" +
    "                <th>Action No.</th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr class=\"active\">\n" +
    "                <td colspan=\"4\"><strong>Counters (#)</strong></td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr ng-repeat=\"counter in occurrences.counters\">\n" +
    "                <td><em ng-bind=\"counter.name\"></em></td>\n" +
    "                <td ng-bind=\"counter.group\"></td>\n" +
    "                <td ng-bind=\"counter.symbol\"></td>\n" +
    "                <td ng-bind=\"counter.action\"></td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr class=\"active\">\n" +
    "                <td colspan=\"4\"><strong>Variables ($)</strong></td>\n" +
    "            </tr>\n" +
    "\n" +
    "            <tr ng-repeat=\"variable in occurrences.variables\">\n" +
    "                <td><em ng-bind=\"variable.name\"></em></td>\n" +
    "                <td ng-bind=\"variable.group\"></td>\n" +
    "                <td ng-bind=\"variable.symbol\"></td>\n" +
    "                <td ng-bind=\"variable.action\"></td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-sm btn-primary\" ng-click=\"close()\">Ok</button>\n" +
    "</div>");
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

angular.module("app/views/pages/counters.html", []).run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("app/views/pages/counters.html",
    "<div view-heading\n" +
    "     title=\"Counters\"\n" +
    "     sub-title=\"Manage counters for learning processes\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:115,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"counters\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" ng-click=\"deleteSelectedCounters()\">\n" +
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
    "        <div class=\"alert alert-info alert-condensed\" ng-show=\"counters.length > 0\">\n" +
    "            <i class=\"fa fa-info fa-fw\"></i>\n" +
    "            Deleted counters will be created as soon as they are used in a learning process, starting with value 0.\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"selectable-list\"\n" +
    "             ng-if=\"counters.length > 0\">\n" +
    "\n" +
    "            <div ng-repeat=\"counter in counters\"\n" +
    "                 selection-model\n" +
    "                 selection-model-type=\"checkbox\"\n" +
    "                 selection-model-selected-attribute=\"_selected\"\n" +
    "                 selection-model-mode=\"multiple\"\n" +
    "                 selection-model-selected-items=\"selectedCounters\"\n" +
    "                 selection-model-cleanup-strategy=\"deselect\">\n" +
    "\n" +
    "                <div selectable-list-item>\n" +
    "                    <button class=\"btn btn-xs btn-default btn-icon pull-right\"\n" +
    "                            ng-click=\"deleteCounter(counter)\">\n" +
    "                        <i class=\"fa fa-trash fa-fw\"></i>\n" +
    "                    </button>\n" +
    "\n" +
    "                    <strong ng-bind=\"counter.name\"></strong><br>\n" +
    "                    <span class=\"text-muted\">Value: <span ng-bind=\"counter.value\"></span></span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-info\" ng-if=\"counters.length === 0\">\n" +
    "            There aren't any counters yet\n" +
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
    "                <learn-results-slideshow-panel index=\"{{$index}}\" results=\"result\"></learn-results-slideshow-panel>\n" +
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
    "                <button class=\"btn btn-primary\" ng-class=\"selectedResults.length > 0 ? '' : 'disabled'\">\n" +
    "                    Create Chart\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu\" role=\"menu\" ng-show=\"selectedResults.length > 0\">\n" +
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
    "                <button class=\"btn btn-default\" ng-class=\"selectedResults.length > 0 ? '' : 'disabled'\">\n" +
    "                    <i class=\"fa fa-fw fa-download\"></i> Download as *.csv\n" +
    "                </button>\n" +
    "                <ul class=\"dropdown-menu\" role=\"menu\" ng-show=\"selectedResults.length > 0\">\n" +
    "                    <li>\n" +
    "                        <a href download-learner-results-as-csv results=\"selectedResults\">\n" +
    "                            Selected Final Results\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li ng-show=\"selectedResults.length === 1\">\n" +
    "                        <a href download-learner-results-as-csv results=\"selectedResults\">\n" +
    "                            Selected Complete Result\n" +
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
    "                <button class=\"btn btn-default btn-xs\" download-svg ancestor-or-element=\"#learn-result-chart\">\n" +
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
    "            <hr>\n" +
    "\n" +
    "            <div ng-repeat=\"result in selectedResults | orderBy:'-testNo'\">\n" +
    "                <strong>Test <span ng-bind=\"result.testNo\"></span></strong>:\n" +
    "                [<span ng-bind=\"(result.configuration.algorithm|formatAlgorithm)\"></span>],\n" +
    "                {{result.configuration.eqOracle}}\n" +
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
    "            <button class=\"btn btn-xs btn-default\" learn-setup-settings-modal-handle\n" +
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
    "            <button class=\"btn btn-xs btn-info pull-right\" learn-setup-settings-modal-handle\n" +
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
    "                         selection-model-cleanup-strategy=\"deselect\"\n" +
    "                         ng-if=\"!symobl.hidden\">\n" +
    "\n" +
    "                        <div selectable-list-item>\n" +
    "                            <a class=\"pull-right\" ng-click=\"setResetSymbol(symbol)\">\n" +
    "                                <i class=\"fa\" ng-class=\"resetSymbol == symbol ? 'fa-circle' : 'fa-circle-thin'\"></i>\n" +
    "                            </a>\n" +
    "\n" +
    "                            <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]<br>\n" +
    "\n" +
    "                            <p class=\"text-muted\">\n" +
    "                                <a href ng-click=\"symbol._collapsed = !symbol._collapsed\">\n" +
    "                                    <span ng-bind=\"symbol.actions.length\"></span>\n" +
    "                                    Actions\n" +
    "                                    <i class=\"fa fa-fw\"\n" +
    "                                       ng-class=\"symbol._collapsed ? 'fa-chevron-down': 'fa-chevron-right'\"></i>\n" +
    "                                </a>\n" +
    "\n" +
    "                            <ol collapse=\"!symbol._collapsed\">\n" +
    "                                <li ng-repeat=\"action in symbol.actions\">\n" +
    "                                    {{action.toString()}}\n" +
    "                                </li>\n" +
    "                            </ol>\n" +
    "                            </p>\n" +
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
    "<div style=\"position: absolute; width: 100%; top: 42px; bottom: 0; overflow: hidden\">\n" +
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
    "        <div class=\"panel-sidebar\" ng-class=\"showSidebar === true ? 'show' : ''\">\n" +
    "            <div widget widget-title=\"Configuration\" collapsed=\"false\">\n" +
    "                <div learn-resume-settings-widget learn-configuration=\"_.last(results).configuration\"></div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div widget widget-title=\"Counter Examples\" collapsed=\"false\"\n" +
    "                 ng-if=\"_.last(results).configuration.eqOracle.type === 'sample'\">\n" +
    "                <div counterexamples-widget\n" +
    "                     counterexamples=\"_.last(results).configuration.eqOracle.counterExamples\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div learn-results-panel results=\"results\">\n" +
    "            <div class=\"btn-group btn-group-xs\" style=\"margin-left: 7px\">\n" +
    "                <button class=\"btn btn-success\" ng-click=\"resumeLearning()\">Resume</button>\n" +
    "                <button class=\"btn btn-success\" ng-click=\"toggleSidebar()\">\n" +
    "                    <i class=\"fa fa-fw\" ng-class=\"showSidebar ? 'fa-close' : 'fa-gear'\"></i>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
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
    "     title=\"Dashboard\"\n" +
    "     sub-title=\"sub-title\">\n" +
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
    "    <a class=\"back-button btn btn-default btn-xs\" ui-sref=\"symbols\">\n" +
    "        <i class=\"fa fa-fw fa-arrow-left\"></i>\n" +
    "    </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:115,class:'fixed'}\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"symbol.actions\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" action-create-modal-handle on-created=\"addAction\">\n" +
    "                Create\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-xs btn-default\" action-edit-modal-handle action=\"selectedActions[0]\"\n" +
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
    "            <button class=\"btn btn-default btn-xs\"\n" +
    "                    variables-counters-occurrence-modal-handle>Occurrences\n" +
    "            </button>\n" +
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
    "        <div class=\"alert alert-info alert-condensed\" ng-show=\"hasUnsavedChanges\">\n" +
    "            <i class=\"fa fa-fw fa-info\"></i> There are unsaved changes made to the symbol\n" +
    "        </div>\n" +
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
    "                        <div>\n" +
    "                            <label class=\"label label-info\" ng-show=\"action.negated\">Negate</label>\n" +
    "                            <label class=\"label label-danger\" ng-show=\"action.ignoreFailure\">Ignore Failure</label>\n" +
    "                        </div>\n" +
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
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"allSymbols\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
    "            <button class=\"btn btn-xs btn-primary\" download-as-json data=\"getDownloadableSymbols\">\n" +
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
    "     title=\"Symbols Upload\"\n" +
    "     sub-title=\"If you already have a *.json file with symbols, you can import them here to this project\">\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"sub-nav\" fix-on-scroll=\"{top:120,class:'fixed'}\" ng-if=\"symbols.length > 0\">\n" +
    "    <div class=\"container\">\n" +
    "\n" +
    "        <div class=\"pull-left\" style=\"margin-right: 16px\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"symbols\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"pull-left\">\n" +
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
    "        <div ng-if=\"symbols.length === 0\">\n" +
    "            <div file-dropzone on-loaded=\"fileLoaded\" class=\"alert alert-info\">\n" +
    "                Drag and drop *.json file here\n" +
    "            </div>\n" +
    "            <hr>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-info alert-condensed\" ng-show=\"symbols.length > 0\">\n" +
    "            <i class=\"fa fa-fw fa-info\"></i>\n" +
    "            For symbols with actions that invoke other symbols, please make sure you adjust the references after\n" +
    "            uploading them\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"selectable-list\">\n" +
    "            <div ng-repeat=\"symbol in symbols\"\n" +
    "                 selectable-list-item\n" +
    "                 selection-model\n" +
    "                 selection-model-type=\"checkbox\"\n" +
    "                 selection-model-selected-attribute=\"_selected\"\n" +
    "                 selection-model-mode=\"multiple\"\n" +
    "                 selection-model-selected-items=\"selectedSymbols\"\n" +
    "                 selection-model-cleanup-strategy=\"deselect\">\n" +
    "\n" +
    "                <button class=\"btn btn-xs btn-default btn-icon pull-right\"\n" +
    "                        symbol-edit-modal-handle symbol=\"symbol\" on-updated=\"updateSymbol\" update-on-server=\"false\">\n" +
    "                    <i class=\"fa fa-edit\"></i>\n" +
    "                </button>\n" +
    "\n" +
    "                <strong ng-bind=\"symbol.name\"></strong> [<span ng-bind=\"symbol.abbreviation\"></span>]\n" +
    "\n" +
    "                <p class=\"text-muted\">\n" +
    "                    <a href ng-click=\"symbol._collapsed = !symbol._collapsed\">\n" +
    "                        <span ng-bind=\"symbol.actions.length\"></span>\n" +
    "                        Actions\n" +
    "                        <i class=\"fa fa-fw\"\n" +
    "                           ng-class=\"symbol._collapsed ? 'fa-chevron-down': 'fa-chevron-right'\"></i>\n" +
    "                    </a>\n" +
    "\n" +
    "                <ol collapse=\"!symbol._collapsed\">\n" +
    "                    <li ng-repeat=\"action in symbol.actions\">\n" +
    "                        {{action.toString()}}\n" +
    "                    </li>\n" +
    "                </ol>\n" +
    "                </p>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
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
    "    </div>\n" +
    "</div>");
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
            // counter related routes


            .state('counters', {
                url: '/counters',
                views: {
                    '@': {
                        templateUrl: paths.views.PAGES + '/counters.html',
                        controller: 'CountersController'
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
}());;(function () {
    'use strict';

    angular
        .module('weblearner.constants')

        // make global libraries a constant for better testing
        .constant('_', window._)                // lodash
        .constant('dagreD3', window.dagreD3)    // dagreD3
        .constant('d3', window.d3)              // d3
        .constant('graphlib', window.graphlib)  // graphlib

        // paths that are used in the application
        .constant('paths', {
            views: {
                BASE: 'app/views',
                DIRECTIVES: 'app/views/directives',
                MODALS: 'app/views/modals',
                PAGES: 'app/views/pages',
                INCLUDES: 'app/views/includes'
            },
            api: {
                URL: '/rest',
                PROXY_URL: '/rest/proxy?url='
            }
        })

        .constant('outputAlphabet', {
            OK: 'OK',
            FAILED: 'FAILED'
        })

        // web action types
        .constant('actionTypes', {
            web: {
                SEARCH_FOR_TEXT: 'web_checkForText',
                SEARCH_FOR_NODE: 'web_checkForNode',
                CLEAR: 'web_clear',
                CLICK: 'web_click',
                CLICK_LINK_BY_TEXT: 'web_clickLinkByText',
                FILL: 'web_fill',
                GO_TO: 'web_goto',
                SUBMIT: 'web_submit',
                SELECT: 'web_select'
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
                EXECUTE_SYMBOL: 'executeSymbol',
                INCREMENT_COUNTER: 'incrementCounter',
                SET_COUNTER: 'setCounter',
                SET_VARIABLE: 'setVariable',
                SET_VARIABLE_BY_JSON_ATTRIBUTE: 'setVariableByJSON',
                SET_VARIABLE_BY_NODE: 'setVariableByHTML',
                WAIT: 'wait'
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
            TTT: 'TTT'
        })
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('ActionCreateModalController', ActionCreateModalController);

    ActionCreateModalController.$inject = [
        '$scope', '$modalInstance', 'modalData', 'actionTypes', 'Action', 'Symbol', 'SessionService'
    ];

    /**
     * The controller for the modal dialog that handles the creation of a new action.
     *
     * The template can be found at 'views/modals/action-create-modal.html'.
     *
     * @param $scope
     * @param $modalInstance
     * @param modalData
     * @param actionTypes
     * @param Action
     * @param Symbol
     * @param Session
     * @constructor
     */
    function ActionCreateModalController($scope, $modalInstance, modalData, actionTypes, Action, Symbol, Session) {

        var project = Session.project.get();

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
         * All symbols of the project
         * @type {Array}
         */
        $scope.symbols = [];

        (function init() {
            Symbol.Resource.getAll(project.id)
                .then(function (symbols) {
                    $scope.symbols = symbols;
                })
        }());

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
         * Creates a new action in the background without closing the dialog
         */
        $scope.createActionAndContinue = function () {
            modalData.addAction($scope.action);
            $scope.action = null;
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

    ActionEditModalController.$inject = ['$scope', '$modalInstance', 'modalData', 'actionTypes', 'Action', 'Symbol', 'SessionService'];

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
     * @param Symbol - The factory for symbols
     * @param Session - The SessionService
     * @constructor
     */
    function ActionEditModalController($scope, $modalInstance, modalData, actionTypes, Action, Symbol, Session) {

        // the project in the session
        var project = Session.project.get();

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
         *
         * @type {Array}
         */
        $scope.symbols = [];

        (function init() {
            Symbol.Resource.getAll(project.id)
                .then(function (symbols) {
                    $scope.symbols = symbols;
                })
        }());

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
		
		$scope.layoutSettings = {};
		
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
        $scope.learnConfiguration = modalData.learnConfiguration.copy();

        /**
         * Sets the Eq Oracle of the learn configuration depending on the selected value
         */
        $scope.setEqOracle = function () {
            $scope.learnConfiguration.eqOracle = EqOracle.createFromType($scope.selectedEqOracle)
        };

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
     * @param Toast
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
     * @oaram Toast
     * @constructor
     */
    function SymbolEditModalController($scope, $modalInstance, modalData, Symbol, SelectionService, Toast) {

        /** The symbol that is passed to the modal. @type {Symbol} */
        $scope.symbol = modalData.symbol;

        /**
         * The error message that is displayed when update fails
         * @type {null|string}
         */
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

            // do not update on server
            if (angular.isDefined(modalData.updateOnServer) && !modalData.updateOnServer) {
                $modalInstance.close({
                    new: $scope.symbol,
                    old: copy
                });
                return;
            }

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
                Symbol.Resource.moveSome($scope.selectedGroup.project, $scope.symbols, $scope.selectedGroup.id)
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
        .controller('VariablesCountersOccurrenceModalController', VariablesCountersOccurrenceModalController);

    VariablesCountersOccurrenceModalController.$inject = [
        '$scope', '$modalInstance', 'SessionService', 'SymbolGroup'
    ];

    /**
     * The controller of the modal dialog that shows all occurrences of used variables and counters in a project in
     * all visible symbols.
     *
     * @param $scope - The controllers scope
     * @param $modalInstance - the ui.bootstrap $modalInstance service
     * @param Session - The SessionService
     * @param SymbolGroup - The factory for symbol groups
     * @constructor
     */
    function VariablesCountersOccurrenceModalController($scope, $modalInstance, Session, SymbolGroup) {

        // the project in the session
        var project = Session.project.get();

        /**
         * The occurrences of all variables and counter that where found.
         *
         * occurrence object: {group: ..., symbol: ..., action: ..., name: ...} where
         *   group  := symbol group name
         *   symbol := symbol name
         *   action := action position
         *   name   := variable/counter name
         *
         * @type {null|{counters: Array, variables: Array}}
         */
        $scope.occurrences = null;

        // load all symbol groups and symbols
        SymbolGroup.Resource.getAll(project.id, {embedSymbols: true})
            .then(function (groups) {
                $scope.occurrences = findOccurrences(groups);
            });

        /**
         * Finds all occurrences of variables and counters in all existing actions of the project.
         *
         * @param {SymbolGroup[]} groups - All symbol groups
         * @returns {{counters: Array, variables: Array}} - The occurrences
         */
        function findOccurrences(groups) {
            var occurrences = {
                counters: [],
                variables: []
            };

            // list of found counters of a single action property
            var foundCounters;

            // list of found variables of a single action property
            var foundVariables;

            /**
             * Creates an occurrence object
             *
             * @param {SymbolGroup} group - The symbol group where the variable/counter is found
             * @param {Symbol} symbol - The symbol where the variable/counter is found
             * @param {number} actionPos - The position of the action in the symbol
             * @param {string} counterOrVariable - the name of the variable with prefix $ or #
             * @returns {{group: (group.name|*), symbol: *, action: *, name: string}}
             */
            function createOccurrence(group, symbol, actionPos, counterOrVariable) {
                return {
                    group: group.name,
                    symbol: symbol.name,
                    action: actionPos,
                    name: counterOrVariable.substring(3, counterOrVariable.length - 2)
                }
            }

            // iterate over all groups, each symbol and each action
            _.forEach(groups, function (group) {
                _.forEach(group.symbols, function (symbol) {

                    // don't check deleted symbols since they don't matter
                    if (!symbol.hidden) {
                        _.forEach(symbol.actions, function (action, i) {

                            // check for each action property if a counter or a variable was found
                            for (var prop in action) {
                                if (action.hasOwnProperty(prop) && angular.isString(action[prop])) {
                                    foundCounters = action[prop].match(/{{#(.*?)}}/g);
                                    foundVariables = action[prop].match(/{{\$(.*?)}}/g);

                                    // add found variables and counters to occurrences
                                    if (foundCounters !== null) {
                                        _.forEach(foundCounters, function (counter) {
                                            occurrences.counters.push(createOccurrence(group, symbol, i, counter));
                                        })
                                    }
                                    if (foundVariables !== null) {
                                        _.forEach(foundVariables, function (variable) {
                                            occurrences.variables.push(createOccurrence(group, symbol, i, variable));
                                        })
                                    }
                                }
                            }
                        })
                    }
                })
            });

            return occurrences;
        }

        /** Close the modal dialog */
        $scope.close = function () {
            $modalInstance.dismiss();
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('CountersController', CountersController);

    CountersController.$inject = ['$scope', 'SessionService', 'CountersService', 'ToastService', '_'];

    /**
     * The controller for the page that lists all counters of a project in a list. It is also possible to delete them.
     *
     * Template: 'views/pages/counters.html';
     *
     * @param $scope - The projects scope
     * @param Session - The SessionService
     * @param Counters - The CountersService
     * @param Toast - The ToastService
     * @param _ - Lodash
     * @constructor
     */
    function CountersController($scope, Session, Counters, Toast, _) {

        // the sessions project
        var project = Session.project.get();

        /**
         * The counters of the project
         * @type {{name: string, value: number, project: number}[]}
         */
        $scope.counters = [];

        /**
         * The selected counters objects
         * @type {{name: string, value: number, project: number}[]}
         */
        $scope.selectedCounters = [];

        // load all existing counters from the server
        (function init() {
            Counters.getAll(project.id)
                .then(function (counters) {
                    $scope.counters = counters;
                });
        }());

        /**
         * Delete a counter from the server and on success from scope
         *
         * @param {{name: string, value: number, project: number}} counter - The counter that should be deleted
         */
        $scope.deleteCounter = function (counter) {
            Counters.delete(project.id, counter.name)
                .then(function () {
                    Toast.success('Counter "' + counter.name + '" deleted');
                    _.remove($scope.counters, {name: counter.name});
                })
                .catch(function (response) {
                    Toast.danger('<p><strong>Deleting counter "' + counter.name + '" failed</strong></p>' + response.data.message);
                })
        };

        /**
         * Delete all selected counters from the server and on success from scope
         */
        $scope.deleteSelectedCounters = function () {
            if ($scope.selectedCounters.length > 0) {
                Counters.deleteSome(project.id, _.pluck($scope.counters, 'name'))
                    .then(function () {
                        Toast.success('Counters deleted');
                        _.forEach($scope.selectedCounters, function (counter) {
                            _.remove($scope.counters, {name: counter.name});
                        })
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Deleting counters failed</strong></p>' + response.data.message);
                    })
            }
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
            var numbers = testNos.split(',');
            _.forEach(numbers, function (testNo) {
                LearnResult.Resource.getComplete(project.id, testNo)
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
            LearnResult.Resource.getAllFinal(project.id)
                .then(function (results) {
                    $scope.results = results;
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
        $scope.selectedChartProperty = $scope.chartProperties.MQS;

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
                LearnResult.Resource.getSomeComplete(project.id, _.pluck($scope.selectedResults, 'testNo'))
                    .then(function (completeResults) {
                        chartData =
                            LearnerResultChartService
                                .createDataFromMultipleCompleteResults(completeResults, $scope.selectedChartProperty);

                        $scope.chartData = {
                            data: chartData.data,
                            options: chartData.options
                        };

                        $scope.selectedChartMode = $scope.chartModes.MULTIPLE_COMPLETE;
                    })
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
                            Toast.info('There is currently running a learn process.');
                            $state.go('learn.start');
                        } else {
                            Toast.danger('There is already running a test from another project.');
                            $state.go('project')
                        }
                    } else {

                        // load all symbols in case there isn't any active learning process
                        SymbolGroup.Resource.getAll(project.id, {embedSymbols: true})
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

                Learner.start(project.id, $scope.learnConfiguration)
                    .then(function () {
                        Toast.success('Learn process started successfully.');
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
        '$scope', '$interval', 'SessionService', 'LearnerService', 'LearnResult', 'ToastService', '_'
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
     * @param _
     * @constructor
     */
    function LearnStartController($scope, $interval, Session, Learner, LearnResult, Toast, _) {

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
         * Flag for showing or hiding the sidebar
         * @type {boolean}
         */
        $scope.showSidebar = false;

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
            var config = _.last($scope.results).configuration.copy().toLearnResumeConfiguration();

            Learner.resume(project.id, _.last($scope.results).testNo, config)
                .then(poll)
                .catch(function (response) {
                    Toast.danger('<p><strong>Resume learning failed!</strong></p>' + response.data.message);
                })
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

        $scope.toggleSidebar = function () {
            $scope.showSidebar = !$scope.showSidebar;
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
     * @param Toast
     * @constructor
     */
    function ProjectCreateController($scope, $state, Project, Toast) {

        /**
         * The model for the new project
         * @type {Project}
         */
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
     * The controller that handles the deleting and updating of a project. The page cannot be requested if the learner
     * is actively learning the current project. Therefore it redirects to the projects dashboard.
     *
     * Template: '/views/pages/project-settings.html'
     *
     * @param $scope - The controllers scope
     * @param $state - The ui.router $state service
     * @param Project - The factory for Projects
     * @param Session - The SessionService
     * @param PromptService - The PromptService
     * @param Toast - The ToastService
     * @param Learner - The LearnerService for the API
     */
    function ProjectSettingsController($scope, $state, Project, Session, PromptService, Toast, Learner) {

        // a copy of the sessions project for resetting the form
        var projectCopy;

        /**
         * The project that is stored in the session
         * @type {Project}
         **/
        $scope.project = Session.project.get();

        (function init() {

            // check if the current project is used in learning and abort deletion
            // because of unknown side effects
            Learner.isActive()
                .then(function (data) {
                    if (data.active && data.project === $scope.project.id) {
                        Toast.info('Cannot edit the project. A learning process is still active.');
                        $state.go('project');
                    }
                });

            copyProject();
        }());

        /**
         *
         */
        function copyProject() {
            projectCopy = Project.build(angular.copy($scope.project));
        }

        /**
         * Updates a project and saves the updated project in the sessionStorage
         */
        $scope.updateProject = function () {

            // update the project on the server
            Project.Resource.update($scope.project)
                .then(function (updatedProject) {
                    Toast.success('Project updated');
                    Session.project.save(updatedProject);
                    $scope.project = updatedProject;
                    copyProject();
                })
                .catch(function () {
                    Toast.danger('<p><strong>Project update failed!</strong></p> The project seems to exists already.');
                })
        };

        /**
         * Prompts the user for confirmation and deletes the project on success. Redirects to '/home' when project
         * was deleted and removes the project from the sessionStorage.
         */
        $scope.deleteProject = function () {
            var message = 'Do you really want to delete this project with all its symbols and test results? This process can not be undone.';
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

        /**
         * Flag for
         * @type {boolean}
         */
        $scope.hasUnsavedChanges = false;

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

            // create unique ids for actions so that they can be found
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
            $scope.hasUnsavedChanges = true;
        };

        /**
         * Removes an action from a symbol
         *
         * @param {Object} action
         */
        $scope.deleteAction = function (action) {
            _.remove($scope.symbol.actions, {_id: action._id});
            Toast.success('Action deleted');
            $scope.hasUnsavedChanges = true;
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
            $scope.hasUnsavedChanges = true;
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
            $scope.hasUnsavedChanges = true;
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
                    $scope.hasUnsavedChanges = false;
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
            $scope.hasUnsavedChanges = false;
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
            var grp = _.find($scope.groups, {id: group.id});

            _.forEach(symbols, function (symbol) {
                var g = _.find($scope.groups, {id: symbol.group});
                var i = _.findIndex(g.symbols, {id: symbol.id});
                g.symbols.splice(i, 1);
                symbol.group = group.id;
                grp.symbols.push(symbol);
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
                    Toast.danger('<p><strong>Deleting symbol failed</strong></p>' + response.data.message);
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
            for (var i = 0; i < $scope.groups.length; i++) {
                $scope.groups[i]._collapsed = $scope.groupsCollapsed;
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('SymbolsExportController', SymbolsExportController);

    SymbolsExportController.$inject = ['$scope', 'SessionService', 'SymbolGroup', 'SelectionService', 'actionTypes'];

    /**
     * The controller that handles the export of symbols. The corresponding template is at
     * 'views/pages/symbols-export.html'.
     *
     * @param $scope
     * @param Session
     * @param SymbolGroup
     * @param SelectionService
     * @param actionTypes
     * @constructor
     */
    function SymbolsExportController($scope, Session, SymbolGroup, SelectionService, actionTypes) {

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
        $scope.getDownloadableSymbols = function () {
            var selectedSymbols = angular.copy(SelectionService.getSelected($scope.allSymbols));
            SelectionService.removeSelection(selectedSymbols);
            selectedSymbols = _.sortBy(selectedSymbols, function (n) {
                return n.id
            });
            _.forEach(selectedSymbols, function (symbol) {
                delete symbol.revision;
                delete symbol.project;
                delete symbol.group;
                delete symbol.hidden;
                delete symbol.id;
                _.forEach(symbol.actions, function (action) {
                    if (action.type === actionTypes.EXECUTE_SYMBOL) {
                        action.symbolToExecute.revision = 1;
                    }
                })
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

    SymbolsImportController.$inject = ['$scope', 'SessionService', 'Symbol', '_', 'ToastService'];

    /**
     * The controller that handles the import of symbols from a *.json file.
     *
     * Template: 'views/pages/symbols-import.html'
     *
     * @param $scope - The controllers scope
     * @param Session - The SessionService
     * @param Symbol - The factory for Symbols
     * @param _ - Lodash
     * @param Toast - The ToastService
     * @constructor
     */
    function SymbolsImportController($scope, Session, Symbol, _, Toast) {

        // The project that is saved in the sessionStorage
        var project = Session.project.get();

        /**
         * The symbols that will be uploaded
         * @type {Symbol[]}
         */
        $scope.symbols = [];

        /**
         * The list of selected symbols
         * @type {Symbol[]}
         */
        $scope.selectedSymbols = [];

        /**
         * Creates instances of Symbols from the json string from the *.json file and puts them in the scope.
         *
         * @param data - The json string of loaded symbols
         */
        $scope.fileLoaded = function (data) {
            try {
                $scope.$apply(function () {
                    $scope.symbols = Symbol.buildSome(angular.fromJson(data));
                });
            } catch (e) {
                Toast.danger('<p><strong>Loading json file failed</strong></p>' + e);
            }
        };

        /**
         * Makes an API request in order to create the selected symbols. Removes successfully created symbols from the
         * scope.
         */
        $scope.uploadSelectedSymbols = function () {
            if ($scope.selectedSymbols.length > 0) {
                var symbols = angular.copy($scope.selectedSymbols);
                _.forEach(symbols, function (symbol) {
                    delete symbol._collapsed;
                    delete symbol._selected;
                });
                Symbol.Resource.createSome(project.id, symbols)
                    .then(function (createdSymbols) {
                        Toast.success('Symbols uploaded');
                        _.forEach(createdSymbols, function (symbol) {
                            _.remove($scope.symbols, {name: symbol.name})
                        })
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Symbol upload failed</strong></p>' + response.data.message)
                    })
            }
        };

        /**
         * Changes the name and/or the abbreviation a symbol before uploading it to prevent naming conflicts in the
         * database.
         *
         * @param {Symbol} updatedSymbol - The updated symbol
         * @param {Symbol} oldSymbol - The old symbol
         */
        $scope.updateSymbol = function (updatedSymbol, oldSymbol) {
            var symbol;

            // check whether name or abbreviation already exist and don't update symbol
            if (angular.equals(updatedSymbol, oldSymbol)) {
                return
            } else if (updatedSymbol.name !== oldSymbol.name &&
                updatedSymbol.abbreviation === oldSymbol.abbreviation) {
                if (_.where($scope.symbols, {name: updatedSymbol.name}).length > 0) {
                    Toast.danger('Name <strong>' + updatedSymbol.name + '</strong> already exists');
                    return;
                }
            } else if (updatedSymbol.abbreviation !== oldSymbol.abbreviation &&
                updatedSymbol.name === oldSymbol.name) {
                if (_.where($scope.symbols, {abbreviation: updatedSymbol.abbreviation}).length > 0) {
                    Toast.danger('Abbreviation <strong>' + updatedSymbol.abbreviation + '</strong> already exists');
                    return;
                }
            }

            // update symbol in scope
            symbol = _.find($scope.symbols, {name: oldSymbol.name});
            symbol.name = updatedSymbol.name;
            symbol.abbreviation = updatedSymbol.abbreviation;
        }
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
        }());

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
                    Toast.danger('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + response.data.message);
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
                        });
                        $scope.selectedSymbols = [];
                    })
                    .catch(function (response) {
                        Toast.danger('<p><strong>Error recovering symbols!</strong></p>' + response.data.message);
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
                    controller: 'ActionCreateModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                addAction: function (action) {
                                    if (action !== null) {
                                        scope.onCreated()(action);
                                    }
                                }
                            }
                        }
                    }
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

    discriminationTree.$inject = ['_', 'd3', 'dagreD3', 'graphlib', '$window'];

    /**
     * The directive for displaying a discrimination tree in an svg element. Can be used as an attribute or an element.
     * Expects another property 'data' which holds the string representation of the discrimination tree.
     *
     * Use it like: '<discrimination-tree data="...."></discrimination-tree>'
     *
     * @param _ - Lodash
     * @param d3 - D3
     * @param dagreD3 - dagreD3
     * @param graphlib - graphlib
     * @param $window - angular $window object
     * @returns {{scope: {data: string}, template: string, link: link}}
     */
    function discriminationTree(_, d3, dagreD3, graphlib, $window) {

        // the directive
        return {
            scope: {
                data: '='
            },
            template: '<svg><g></g></svg>',
            link: link
        };

        // handle the directives logic
        function link(scope, el, attrs) {

            // the svg where the discrimination tree is drawn into
            var svg = d3.select(el.find('svg')[0]);

            // the first g node of the svg for rendering
            var svgGroup = d3.select(el.find('svg').find('g')[0]);

            // the parent of the svg to fit its size accordingly
            var svgContainer = el[0].parentNode;

            // render the new discrimination tree when property 'data' changes
            scope.$watch('data', function (newValue) {
                if (angular.isDefined(newValue)) {
                    var data = angular.fromJson(newValue);
                    var graph = createGraph(data);
                    var layoutedGraph = layout(graph);
                    render(layoutedGraph);
                }
            });

            /**
             * Creates a graph structure from a discrimination tree in order to layout it with the given dagreD3 library
             *
             * @param {Object} dt - The discrimination tree
             * @returns {{nodes: Array, edges: Array}} - The tree as graph representation
             */
            function createGraph(dt) {

                var nodes = [];
                var edges = [];

                function createGraphData(node, parent) {

                    // root without children
                    if (!node.children && parent === null) {
                        nodes.push(node.data);
                        return;
                    }

                    // is leaf?
                    if (node.children.length === 0) {
                        return;
                    }

                    // add node if not exists
                    if (!_.find(nodes, node.discriminator)) {
                        nodes.push(node.discriminator)
                    }

                    if (parent !== null) {
                        edges.push({
                            from: parent.discriminator,
                            to: node.discriminator,
                            label: node.edgeLabel
                        });
                    }

                    _.forEach(node.children, function (child) {
                        if (child.data) {
                            nodes.push(child.data);
                            edges.push({
                                from: node.discriminator,
                                to: child.data,
                                label: child.edgeLabel
                            });
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

            /**
             * Creates positions for nodes and edges of the discrimination tree that can be rendered with dagreD3
             *
             * @param {Object} graph - The discrimination tree as graph
             * @returns {exports.Graph} - The graph with positions of nodes
             */
            function layout(graph) {

                // initialize graph
                var _graph = new graphlib.Graph({
                    directed: true
                });
                _graph.setGraph({});

                // add nodes to the graph
                _.forEach(graph.nodes, function (node) {
                    _graph.setNode(node, {
                        shape: node[0] === 'q' ? 'rect' : 'circle',     // draw a rectangle when node is a leaf
                        label: node,
                        width: 25,
                        style: 'fill: #fff; stroke: #000; stroke-width: 1',
                        labelStyle: 'font-size: 1.25em; font-weight: bold'
                    });
                });

                //add edges to the graph
                _.forEach(graph.edges, function (edge) {
                    _graph.setEdge(edge.from, edge.to, {
                        lineInterpolate: 'basis',
                        style: "stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none",
                        label: edge.label
                    });
                });

                // layout
                dagreD3.dagre.layout(_graph, {});

                return _graph;
            }

            /**
             * Renders the discrimination tree in the svg with the dagreD3 library
             *
             * @param {exports.Graph} graph - The graph with position information
             */
            function render(graph) {

                // render the graph
                new dagreD3.render()(svgGroup, graph);

                // position it in the center of the svg parent
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

                // resize the svg to its parents size on window resize
                // and call it once so that svg gets the proper dimensions
                angular.element($window).on('resize', fitSize);
                function fitSize() {
                    svg.attr("width", svgContainer.clientWidth);
                    svg.attr("height", svgContainer.clientHeight);
                }

                fitSize();

                // in order to prevent only a white screen in some browsers, firing a resize event on the window
                // displays the svg contents
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
     * a click event to element the directive was used on.
     *
     * Directive must be used as attribute with a value that indicates how long resize event firing should be delayed
     * (in ms). When no value is given, the resize event is fired directly with a delay of 0 ms.
     *
     * Use: <button dispatch-resize="1000">Click Me!</button>
     *
     * @returns {{link: link}}
     */
    function dispatchResize() {

        // the directive
        return {
            restrict: 'A',
            link: link
        };

        // the directives behavior
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
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadAsJson', downloadAsJson);

    downloadAsJson.$inject = ['FileDownloadService'];

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
    function downloadAsJson(FileDownloadService) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                data: '='
            },
            link: link
        };

        // the directives behaviour
        function link(scope, el, attrs) {
            el.on('click', function () {
                if (angular.isDefined(scope.data)) {
                    var data = scope.data;
                    if (angular.isFunction(scope.data)) {
                        data = scope.data();
                    }
                    FileDownloadService.downloadJson(data);
                }
            });
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadLearnerResultsAsCsv', downloadLearnerResultsAsCsv);

    downloadLearnerResultsAsCsv.$inject = ['FileDownloadService'];

    /**
     * The directive to download statistics from learner results as csv file. Attaches a click event to the directives
     * element that starts the download.
     *
     * Expects an attribute "results" which value should be the learn results to download.
     *
     * Use it like <button download-learner-results-as-csv results="...">Click Me!</button>
     *
     * @param FileDownloadService - The service to download files
     * @returns {{restrict: string, scope: {results: string}, link: link}}
     */
    function downloadLearnerResultsAsCsv(FileDownloadService) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                results: '='
            },
            link: link
        };

        // the directives behavior
        function link(scope, el, attrs) {

            // download csv on click
            el.on('click', function () {
                if (angular.isDefined(scope.results)) {
                    FileDownloadService.downloadCSV(createCsvData(scope.results));
                }
            });

            /**
             * Creates a csv string from learner results.
             *
             * @param {LearnResult[]} results - The learner results
             * @returns {string} - The csv string from learn results
             */
            function createCsvData(results) {
                var csv = 'Project,Test No,Start Time,Step No,Algorithm,Eq Oracle,|Sigma|,#MQs,#EQs,#Symbol Calls,Duration (ms)\n';

                for (var i = 0; i < results.length; i++) {
                    csv += result[i].project + ',';
                    csv += result[i].testNo + ',';
                    csv += '"' + result[i].statistics.startTime + '",';
                    csv += result[i].stepNo + ',';
                    csv += result[i].configuration.algorithm + ',';
                    csv += result[i].configuration.eqOracle.type + ',';
                    csv += result[i].configuration.symbols.length + ',';
                    csv += result[i].statistics.mqsUsed + ',';
                    csv += result[i].statistics.eqsUsed + ',';
                    csv += result[i].statistics.symbolsUsed + ',';
                    csv += result[i].statistics.duration + '\n';
                }

                return csv;
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadSvg', downloadSvg);

    downloadSvg.$inject = ['FileDownloadService'];

    /**
     * The directive that lets you directly download a svg element from the html page into a file. It attaches a click
     * event to the element it was used on, that download the svg. It can only be used as an attribute.
     *
     * Expects an attribute 'ancestorOrElement' whose value should be the selector of the svg or of an ancestor of an
     * svg.
     *
     * Use: '<button download-svg ancestor-or-element="#...">Click Me!</button>'.
     *
     * @param FileDownloadService - The service for downloading files
     * @returns {{restrict: string, link: link}}
     */
    function downloadSvg(FileDownloadService) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                ancestorOrElement: '@'
            },
            link: link
        };

        // the directives behaviour
        function link(scope, el, attrs) {
            el.on('click', function () {
                var svg;

                // find the downloadable svg element
                if (scope.ancestorOrElement) {
                    svg = document.querySelector(scope.ancestorOrElement);
                    if (svg !== null && svg.nodeName.toLowerCase() === 'svg') {
                        FileDownloadService.downloadSVG(svg);
                    } else {
                        svg = svg.querySelector('svg');
                        if (svg !== null) {
                            FileDownloadService.downloadSVG(svg);
                        }
                    }
                }
            });
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('downloadTableAsCsv', downloadTableAsCsv);

    downloadTableAsCsv.$inject = ['FileDownloadService'];

    /**
     * The directive that downloads a HTML table element as CSV. It attaches a click event to the directives element
     * which downloads the file. The directive must be used as an attribute.
     *
     * It expects one attribute 'ancestorOrElement' which should contain the selector to the table or the an ancestor
     * of the table.
     *
     * Use it like "<button download-table-as-csv ancestor-or-element="#table">Click Me!</button>"
     *
     * @param FileDownloadService - The service for downloading files
     * @returns {{restrict: string, scope: {ancestorOrElement: string}, link: link}}
     */
    function downloadTableAsCsv(FileDownloadService) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                ancestorOrElement: '@'
            },
            link: link
        };

        // the directives behaviour
        function link(scope, el, attrs) {
            el.on('click', function () {

                // the table element
                var table;
                var csv;

                // find the downloadable table element
                if (scope.ancestorOrElement) {
                    table = document.querySelector(scope.ancestorOrElement);
                    if (table !== null && table.nodeName.toLowerCase() === 'table') {
                        csv = createCSV(table);
                    } else {
                        table = table.querySelector('table');
                        if (table !== null) {
                            csv = createCSV(table);
                        }
                    }

                    // download it
                    if (angular.isDefined(csv)) {
                        FileDownloadService.downloadCSV(csv);
                    }
                }
            });

            /**
             * Creates CSV data from the entries of a HTML table element
             *
             * @param table - The table element that should be converted
             * @returns {string} - The table as CSV string
             */
            function createCSV(table) {
                var head = table.querySelectorAll('thead th');
                var rows = table.querySelectorAll('tbody tr');
                var csv = '';

                // add entries from table head
                if (head.length > 0) {
                    for (var i = 0; i < head.length; i++) {
                        csv += head[i].textContent.replace(',', ' ') + (i === head.length - 1 ? '\n' : ',');
                    }
                }

                // add entries from table row
                if (rows.length > 0) {
                    for (i = 0; i < rows.length; i++) {
                        var tds = rows[i].querySelectorAll('td');
                        if (tds.length > 0) {
                            for (var j = 0; j < tds.length; j++) {
                                csv += tds[j].textContent.replace(',', ' ') + (j === tds.length - 1 ? '\n' : ',');
                            }
                        }
                    }
                }

                return csv;
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('dropdownHover', dropdownHover);

    /**
     * A directive in addition to the dropdown directive from ui-bootstrap. It opens the dropdown menu when entering the
     * trigger element of the menu with the mouse so you don't have to click on it. Place it as attribute 'dropdown-hover'
     * beside 'dropdown' in order to work as expected.
     *
     * @return {{require: string, link: link}}
     */
    function dropdownHover() {
        return {
            restrict: 'A',
            require: 'dropdown',
            link: link
        };

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the ui.bootstrap dropdown controller
         */
        function link(scope, el, attrs, ctrl) {
            el.on('mouseenter', function () {
                scope.$apply(function () {
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
     * supports to read files as a text. It can only be used as an attribute.
     *
     * Attribute 'onLoaded' expects to be a function with one parameter that represents the value of the loaded
     * file as string
     *
     * Use: '<div file-dropzone on-loaded="load">' with function load(contents) { ... }
     *
     * @return {{restrict: string, scope: {onLoaded: string}, link: link}}
     */
    function fileDropzone() {
        return {
            restrict: 'A',
            scope: {
                onLoaded: '&'
            },
            link: link
        };
        function link(scope, el, attrs) {
            var reader = new FileReader();

            // call the callback as soon as a file is loaded
            reader.onload = function (e) {
                if (angular.isDefined(scope.onLoaded)) {
                    scope.onLoaded()(e.target.result);
                }
            };

            // attach some styles to the element on dragover etc.
            el.on('dragover', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
            });

            el.on('dragenter', function () {
                el[0].style.outline = '2px solid rgba(0,0,0,0.2)';
            }).on('dragleave', function () {
                el[0].style.outline = '0';
            });

            el.on('drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
                el[0].style.outline = '0';
                readFiles(e.dataTransfer.files);
            });

            /**
             * Read files as a text file
             *
             * @param files
             */
            function readFiles(files) {
                for (var i = 0; i < files.length; i++) {
                    reader.readAsText(files[i]);
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
        return {
            restrict: 'A',
            scope: {
                bindResize: '=',
                asStyle: '='
            },
            link: link
        };

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
        .directive('fixOnScroll', fixOnScroll);

    fixOnScroll.$inject = ['$window'];

    /**
     * The directive that should be used for fixing elements as soon as a certain scroll point in the browser is
     * reached. Can only be used as an attribute. It automatically creates a placeholder element with the same height
     * of the fixed one for smooth scrolling. Best is you use it only on divs...
     *
     * Attribute fixOnScroll should contain a JSON string with properties 'top' and 'class' where top is the amount of
     * pixels that should be scrolled down before applying 'class'.
     *
     * !! Does not automatically fix the element, the toggles css class should do that !!
     *
     * Use: '<div fix-on-scroll="{top:120, class:'aCSSClass'}"></div>'
     *
     * @param $window - The angular window wrapper
     * @returns {{link: link}}
     */
	function fixOnScroll($window) {
        return {
            restrict: 'A',
			link: link
		};

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
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('htmlElementPicker', htmlElementPicker)
        .directive('htmlElementPickerWindow', htmlElementPickerWindow)
        .factory('htmlElementPickerInstance', htmlElementPickerInstance);

    htmlElementPicker.$inject = ['$document', '$compile', 'htmlElementPickerInstance'];
    htmlElementPickerWindow.$inject = ['$window', 'SessionService', 'paths', 'htmlElementPickerInstance'];
    htmlElementPickerInstance.$inject = ['$q'];

    /**
     * The directive that creates a new HTML element picker. Can only be used as an attribute and attaches a click
     * event to the source element that opens the picker. On first start, it loads the page that is defined in the
     * projects baseUrl. On following calls the last visited page is loaded.
     *
     * Attribute 'model' is the model for the XPath
     * Attribute 'text' is the model for the .textContent value of the selected element
     *
     * Use: '<button html-element-picker model="..." text="...">Click Me!</button>'
     *
     * @param $document - angular document wrapper
     * @param $compile - angular $compile service
     * @param htmlElementPickerInstance - Holds the promise and methods for opening and closing the picker
     * @returns {{restrict: string, scope: {selectorModel: string}, link: Function}}
     */
    function htmlElementPicker($document, $compile, htmlElementPickerInstance) {
        return {
            restrict: 'A',
            scope: {
                selectorModel: '=model',
                textModel: '=text'
            },
            link: link
        };
        function link(scope, el, attrs) {

            // The HTML picker element that is dynamically appended and removed to/from the pages DOM tree
            var picker;

            el.on('click', function () {

                // create a new element picker under the current scope and append to the body
                picker = $compile('<html-element-picker-window></html-element-picker-window>')(scope);
                $document.find('body').prepend(picker);

                // open the picker
                htmlElementPickerInstance.open()
                    .then(function (data) {

                        // copy the selected XPath and .textContent value to the scopes models
                        if (angular.isDefined(scope.selectorModel)) {
                            scope.selectorModel = data.xPath;
                        }
                        if (angular.isDefined(scope.textModel)) {
                            scope.textModel = data.textContent;
                        }
                    })

                    // remove the picker from the dom on close
                    .finally(function () {
                        picker.remove();
                    })
            })
        }
    }

    /**
     * The instance for the HTML element picker that holds the promise offers methods to persist the last opened url as
     * well as opening and closing the HTML element picker
     *
     * @returns {{close: Function, open: Function, setUrl: Function, getUrl: Function}}
     */
    function htmlElementPickerInstance($q) {

        // the promise
        var deferred;

        // the url was called at the last opening
        var lastUrl = null;

        return {
            close: close,
            open: open,
            setUrl: setUrl,
            getUrl: getUrl
        };

        /**
         * Resolves the promise with selected data or cancels the promise of no data is defined
         *
         * @param {Object} data - The object that should contain an XPath and a .textContent value
         */
        function close(data) {
            if (angular.isDefined(data)) {
                deferred.resolve(data)
            } else {
                deferred.reject();
            }
        }

        /**
         * Creates the promise that is used to pass data between the directive and the picker
         *
         * @returns {d.promise|promise|qFactory.Deferred.promise|p.ready.promise|fd.g.promise}
         */
        function open() {
            deferred = $q.defer();
            return deferred.promise;
        }

        function setUrl(url) {
            lastUrl = url;
        }

        function getUrl() {
            return lastUrl;
        }
    }

    /**
     * The actual HTML element picker. Handles the complete window including the selection of elements and loading
     * of urls. Works as a 'mini embedded browser'
     *
     * Use: '<html-element-picker-window></html-element-picker-window>'
     *
     * @param $window - angular window wrapper
     * @param Session - The SessionService
     * @param paths - The applications paths
     * @param htmlElementPickerInstance - @see{@link htmlElementPickerInstance}
     * @returns {{scope: {}, templateUrl: string, link: link}}
     */
    function htmlElementPickerWindow($window, Session, paths, htmlElementPickerInstance) {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/html-element-picker.html',
            link: link
        };

        function link(scope, el, attrs) {

            // the iframe where the projects site gets loaded into
            var iframe = el.find('iframe');

            // when moving with the mouse over an element, this elements gets saved in this variable in order to
            // prevent multiple calls of getCssPath for the same element
            var lastTarget = null;

            // the project that is stored in the session
            var project = null;

            // the url of the proxy
            var proxyUrl = null;

            // flag for selection mode
            var isSelectable = false;

            /**
             * The XPath of the selected element
             * @type {null|string}
             */
            scope.selector = null;

            /**
             * The element.textContent value
             * @type {null|string}
             */
            scope.textContent = null;

            /**
             * The url that is loaded in the iframe
             * @type {string}
             */
            scope.url = null;

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

                if (lastTarget.nodeName.toLowerCase() === 'input') {
                    scope.textContent = lastTarget.value;
                } else {
                    scope.textContent = lastTarget.textContent;
                }

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
                isSelectable = false;

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

            // load project, create proxy address and load the last url in the iframe
            function init() {
                project = Session.project.get();
                proxyUrl = $window.location.origin + paths.api.PROXY_URL;

                scope.url = htmlElementPickerInstance.getUrl();
                scope.loadUrl();
            }

            /**
             * Loads an entered url into the iframe and handles the click on every a element
             */
            scope.loadUrl = function () {
                iframe[0].setAttribute('src', proxyUrl + project.baseUrl + '/' + (scope.url === null ? '' : scope.url));
                iframe[0].onload = function () {
                    angular.element(iframe.contents()[0].body.getElementsByTagName('a'))
                        .on('click', function () {
                            if (!isSelectable) {
                                var _this = this;
                                if (_this.getAttribute('href') !== '' && _this.getAttribute('href') !== '#') {
                                    scope.$apply(function () {
                                        scope.url = decodeURIComponent(_this.getAttribute('href'))
                                            .replace(proxyUrl + project.baseUrl + '/', '')
                                    })
                                }
                            }
                        }
                    )
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
                isSelectable = true;
            };


            /**
             * Makes the web element picker invisible and fires the close event
             */
            scope.close = function () {
                htmlElementPickerInstance.setUrl(scope.url);
                htmlElementPickerInstance.close();
            };

            /**
             * Makes the web element Picker invisible and fires the ok event with the selector of the element that was
             * selected. If no selector is defined, then it just closes the picker
             */
            scope.ok = function () {
                htmlElementPickerInstance.setUrl(scope.url);
                htmlElementPickerInstance.close({
                    xPath: scope.selector,
                    textContent: scope.textContent
                });
            };

            // init directive
            init();
        }
    }
}());;(function () {

    angular.module('weblearner.directives')
        .directive('hypothesis', hypothesis);

    hypothesis.$inject = ['$window', 'paths', 'CounterExampleService', '_', 'dagreD3', 'd3', 'graphlib'];

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

    function hypothesis($window, paths, CounterExampleService, _, dagreD3, d3, graphlib) {

        return {
            scope: {
                test: '=',
                layoutSettings: '=',
                isSelectable: '@'
            },
            templateUrl: paths.views.DIRECTIVES + '/hypothesis.html',
            link: link
        };

        function link(scope, el, attrs) {

            var _svg;
            var _svgGroup;
            var _svgContainer;
            var _graph;
            var _renderer;

            var labelStyle = 'display: inline; font-weight: bold; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline;';
            var labelStyleEdge = labelStyle + 'font-size: 10px';
            var labelStyleNode = labelStyle + 'font-size: 12px';

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

                _svg.style('font-family', '"Helvetica Neue",Helvetica,Arial,sans-serif');
                _svg.style('font-size', '12px');
                _svg.style('line-height', '1.42857');
                _svg.style('color', '#333');

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
                    var n = {
                        shape: 'circle',
                        label: node.toString(),
                        width: 25,
                        labelStyle: labelStyleNode
                    };

                    if (node === scope.test.hypothesis.initNode) {
                        n.style = 'fill: #B3E6B3; stroke: #5cb85c; stroke-width: 3';
                    } else {
                        n.style = 'fill: #fff; stroke: #000; stroke-width: 1';
                    }

                    _graph.setNode(node.toString(), n);
                });

                // add edges to the graph
                _.forEach(scope.test.hypothesis.edges, function (edge, i) {
                    var edgeName = edge.from + "-" + edge.to + "|" + i;
                    _graph.setEdge(edge.from, edge.to, {
                        label: edge.input + "/" + edge.output,
                        labeloffset: 5,
                        lineInterpolate: 'basis',
                        style: "stroke: rgba(0, 0, 0, 0.3); stroke-width: 3; fill:none",
                        labelStyle: labelStyleEdge
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
                    var n = {
                        shape: 'circle',
                        label: node.toString(),
                        width: 25,
                        labelStyle: labelStyleNode
                    };

                    if (node === scope.test.hypothesis.initNode) {
                        n.style = 'fill: #B3E6B3; stroke: #5cb85c; stroke-width: 3';
                    } else {
                        n.style = 'fill: #fff; stroke: #000; stroke-width: 1';
                    }

                    _graph.setNode(node.toString(), n);
                });

                // build data structure for the alternative representation by
                // pushing some data
                _.forEach(scope.test.hypothesis.edges, function (edge) {
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
                            labelStyle: labelStyleEdge
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

                // swap defs and paths children of .edgepaths because arrows are not shown
                // on export otherwise <.<
                _.forEach(el.find('svg')[0].querySelectorAll('.edgePath'), function(edgePath){
                    edgePath.insertBefore(edgePath.childNodes[1],edgePath.firstChild);
                })
            }

            function handleEvents() {

                var zoom;
                var drag;

                // attach click events for the selection of counter examples to the edge labels
                // only if counterExamples is defined
                if (angular.isDefined(scope.isSelectable)) {
                    _svg.selectAll('.edgeLabel tspan').on('click', function () {
                        var label = this.innerHTML.split('/');
                        scope.$apply(function () {
                            CounterExampleService.addIOPairToCurrentCounterexample(label[0], label[1]);
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
                function dragstart() {
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
        .directive('hypothesisLayoutSettingsModalHandle', hypothesisLayoutSettingsModalHandle);

    hypothesisLayoutSettingsModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the opening of the modal dialog for layout setting of a hypothesis. Has to be used
     * as attribute. It attaches a click event to its element that opens the modal dialog.
     *
     * The corresponding controller should inject 'modalData' {Object}. It holds a property 'layoutSettings' which
     * contains the layoutSettings model.
     *
     * Attribute 'layoutSettings' {Object} should be the model that is passed to the hypothesis directive.
     *
     * Use: '<button hypothesis-layout-settings-modal-handle layout-settings="...">Click Me!</button>'
     *
     * @param $modal - The ui.boostrap $modal service
     * @param paths - The constant with application paths
     * @returns {{restrict: string, scope: {layoutSettings: string}, link: link}}
     */
    function hypothesisLayoutSettingsModalHandle($modal, paths) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                layoutSettings: '='
            },
            link: link
        };

        // the directives behaviour
        function link(scope, el, attrs) {
            el.on('click', function () {
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
            });
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

        return {
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

        return {
            require: '^panelManager',
            template: template,
            transclude: true,
            link: link,
            scope: {
                index: '=panelIndex'
            }
        };

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
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('indexBrowser', indexBrowser);

    indexBrowser.$inject = ['paths'];

    /**
     * The directive that displays a pagination like button group for clicking through elements of a list. Displays
     * the current index and the length of the list.
     *
     * Attribute 'index' is the model of the current index
     * Attribute 'length' should be the length of the list as string
     *
     * Use: '<index-browser index="..." length="{{list.length}}"></index-browser>'
     *
     * @param paths - the application paths constant
     * @returns {{templateUrl: string, scope: {length: string, index: string}, link: link}}
     */
    function indexBrowser(paths) {
        return {
            templateUrl: paths.views.DIRECTIVES + '/index-browser.html',
            scope: {
                length: '@',
                index: '='
            },
            link: link
        };

        function link(scope, el, attrs) {

            // the length of the array
            var length = parseInt(scope.length);

            // update length on change so that it can be clicked that far in the template
            scope.$watch('length', function (n) {
                if (angular.isDefined(n)) {
                    length = n;
                    scope.lastStep();
                }
            });

            scope.firstStep = function () {
                scope.index = 0;
            };

            scope.previousStep = function () {
                if (scope.index - 1 < 0) {
                    scope.lastStep();
                } else {
                    scope.index--;
                }
            };

            scope.nextStep = function () {
                if (scope.index + 1 > length - 1) {
                    scope.firstStep();
                } else {
                    scope.index++;
                }
            };

            scope.lastStep = function () {
                scope.index = length - 1;
            };
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
        .directive('learnResultsPanel', learnResultsPanel)
        .directive('learnResultsSlideshowPanel', learnResultsSlideshowPanel);

    learnResultsPanel.$inject = ['paths', 'learnAlgorithms'];
    learnResultsSlideshowPanel.$inject = ['paths'];

    /**
     * The directive that displays a browsable list of learn results. For each result, it can display the observation
     * table, if L* was used, or the Discrimination Tree from the corresponding algorithm.
     *
     * It expects an attribute 'results' which should contain a list of the learn results that should be displayed. It
     * can for example be the list of all intermediate results of a complete test or multiple single results from
     * multiple tests.
     *
     * The second attribute 'index' is optional and should only be used if multiple learnResultPanels are created in
     * a ng-repeat loop in order to be able to download the internal data structures. Give it the value of scope.$index
     * in the loop.
     *
     * Content that is written inside the tag will be displayed a the top left corner beside the index browser. So
     * just add small texts or additional buttons in there.
     *
     * Use it like '<learn-results-panel results="..."> ... </learn-results-panel>'
     *
     * @param {Object} paths - The constant for application paths
     * @param {Object} learnAlgorithms - The constant for available learn algorithms
     * @returns {{scope: {results: string}, transclude: boolean, templateUrl: string, controller: *[]}}
     */
    function learnResultsPanel(paths, learnAlgorithms) {
        return {
            scope: {
                results: '=',
                index: '@'
            },
            transclude: true,
            templateUrl: paths.views.DIRECTIVES + '/learn-results-panel.html',
            controller: ['$scope', controller]
        };

        function controller($scope) {

            /**
             * Enum for displayable modes.
             * 0 := show hypothesis
             * 1 := show internal data structure
             * @type {{HYPOTHESIS: number, INTERNAL: number}}
             */
            $scope.modes = {
                HYPOTHESIS: 0,
                INTERNAL: 1
            };

            /**
             * Available learn algorithms
             * @type {Object}
             */
            $scope.learnAlgorithms = learnAlgorithms;

            /**
             * The layout settings for the displayed hypothesis
             * @type {undefined|Object}
             */
            $scope.layoutSettings;

            /**
             * The mode that is used
             * @type {number}
             */
            $scope.mode = $scope.modes.HYPOTHESIS;

            /**
             * The index of the step from the results that should be shown
             * @type {number}
             */
            $scope.pointer = $scope.results.length - 1;

            /**
             * Checks if the property 'algorithmInformation' is define which holds the internal data structure
             * for the algorithm of a learn result
             * @returns {boolean|*}
             */
            $scope.hasInternalDataStructure = function () {
                return angular.isDefined($scope.results[$scope.pointer].algorithmInformation);
            };

            /**
             * Switches the mode to the one to display the internal data structure
             */
            $scope.showInternalDataStructure = function () {
                $scope.mode = $scope.modes.INTERNAL;
            };

            /**
             * Switches the mode to the one to display the hypothesis
             */
            $scope.showHypothesis = function () {
                $scope.mode = $scope.modes.HYPOTHESIS;
            }
        }
    }

    /**
     * The directive to display a closeable learn result panel for the panel manager. Requires to be a child of a
     * panelManager directive. For everything else see {@link learnResultsPanel}
     *
     * @returns {{require: string, scope: {results: string, index: string}, templateUrl: string, link: link}}
     */
    function learnResultsSlideshowPanel(paths) {

        // the directive
        return {
            require: '^panelManager',
            scope: {
                results: '=',
                index: '@'
            },
            templateUrl: paths.views.DIRECTIVES + '/learn-results-slideshow-panel.html',
            link: link
        };

        // the directives behaviour
        function link(scope, el, attrs, ctrl) {

            /**
             * Tells the panel manager to close this panel
             */
            scope.close = function () {
                ctrl.closePanelAt(scope.index);
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('learnSetupSettingsModalHandle', learnSetupSettingsModalHandle);

    learnSetupSettingsModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the opening of the modal dialog for manipulating a learn configuration. Can only be
     * used as an attribute and attaches a click event to the source element that opens the modal.
     *
     * Attribute 'learnConfiguration' should be the model with a LearnConfiguration object instance.
     * Attribute 'onOk' should be a callback function with one parameter where the modified config is passed.
     *
     * @param $modal - The ui.boostrap $modal service
     * @param paths - The applications path constant
     * @returns {{restrict: string, scope: {learnConfiguration: string, onOk: string}, link: link}}
     */
    function learnSetupSettingsModalHandle($modal, paths) {

        // the directive
        return {
            restrict: 'A',
            scope: {
                learnConfiguration: '=',
                onOk: '&'
            },
            link: link
        };

        // the directives behaviour
        function link(scope, el, attr) {
            el.on('click', function () {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/learn-setup-settings-modal.html',
                    controller: 'LearnSetupSettingsModalController',
                    resolve: {
                        modalData: function () {
                            return {
                                learnConfiguration: scope.learnConfiguration
                            };
                        }
                    }
                });
                modal.result.then(function (learnConfiguration) {
                    if (angular.isDefined(scope.onOk)) {
                        scope.onOk()(learnConfiguration);
                    }
                });
            });
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('loadScreen', loadScreen);

    loadScreen.$inject = ['$http', 'paths'];

    /**
     * The load screen that is shown during http requests. It lays over the application to prevent further
     * interactions with the page. The navigation is still usable. Add it right after the body and give the element
     * a high value for z-index in the stylesheet.
     *
     * Use is like '<load-screen></load-screen>'.
     *
     * @param $http - The angular $http service
     * @param {Object} paths - The constant with application paths
     * @returns {{scope: {}, templateUrl: string, link: link}}
     */
    function loadScreen($http, paths) {

        // the directive
        return {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/load-screen.html',
            link: link
        };

        // the directives behaviour
        function link(scope, el, attrs) {

            /**
             * Shows if there are currently any active http requests going on
             *
             * @returns {boolean} - If there are any active requests
             */
            scope.hasPendingRequests = function () {
                return $http.pendingRequests.length > 0;
            };

            // watch the change of pendingRequests and change the visibility of the loadscreen
            scope.$watch(scope.hasPendingRequests, function (value) {
                if (value) {
                    el[0].style.display = 'block';
                } else {
                    el[0].style.display = 'none';
                }
            });
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('navigation', navigation);

    navigation.$inject = ['paths', '$state', 'SessionService'];

    /**
     * The directive for the main navigation of the app. Converts into a off screen navigation as soon as the screen
     * is minimized.
     *
     * Use: '<navigation></navigation>'
     *
     * !! Place it at the top of your DOM before the main content part
     *
     * @param paths - The applications paths constant
     * @param $state - The ui.router $state service
     * @param Session - The SessionService
     * @returns {{scope: {}, templateUrl: string, link: link}}
     */
    function navigation(paths, $state, Session) {
        return {
            scope: {},
            templateUrl: paths.views.DIRECTIVES + '/navigation.html',
            link: link
        };

        function link(scope, el, attrs) {

            // the button that is used to show or hide the hidden sidebar
            var handle = angular.element(el[0].getElementsByClassName('navbar-menu-handle'));

            // the container of the element that holds the navigation items
            var offscreen = angular.element(el[0].getElementsByClassName('navbar-offscreen'));

            // the css class applied to the nav when it should be displayed off screen
            var offscreenClass = 'show';

            /**
             * The project that is stored in the session
             * @type {Project|null}
             */
            scope.project = Session.project.get();

            // handle events and stuff
            (function init() {
                handle.on('click', toggleNavigation);

                // load project into scope when projectOpened is emitted
                scope.$on('project.opened', function () {
                    scope.project = Session.project.get();
                });

                // delete project from scope when projectOpened is emitted
                scope.$on('project.closed', function () {
                    scope.project = null;
                });
            }());

            /**
             * Removes the project object from the session and redirect to the start page
             */
            scope.closeProject = function () {
                Session.project.remove();
                $state.go('home');
            };

            /**
             * Toggles the class for the navigation so that it is displayed off screen or not
             * @param e - js event
             */
            function toggleNavigation(e) {
                e.stopPropagation();
                offscreen.toggleClass(offscreenClass);
            }
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('observationTable', observationTable);

    observationTable.$inject = ['paths'];

    /**
     * The directive that renders an observation table from an ascii representation into a html table. Can only be used
     * as a tag.
     *
     * Attribute 'data' should be the ascii string representation of the table from the LearnLib.
     *
     * Use: <observation-table data="..."></observation-table>
     *
     * @param paths - The applications paths constant
     * @returns {{restrict: string, scope: {data: string}, link: link, templateUrl: string}}
     */
    function observationTable(paths) {
        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            link: link,
            templateUrl: paths.views.DIRECTIVES + '/observation-table.html'
        };

        function link(scope, el, attrs) {

            // the object of the table for the template
            scope.table = {
                header: [],
                body: {
                    s1: [],
                    s2: []
                }
            };

            // render the observation table as soon as the data changes
            scope.$watch('data', function (n) {
                if (angular.isDefined(n)) {
                    createObservationTable();
                }
            });

            /**
             * Parses the ascii representation of the observation table and stores it into scope.table
             */
            function createObservationTable() {

                var rows = scope.data.split('\n');  // the rows of the table
                var marker = 0;                     // a flag that is used to indicate on which set of the table I am

                if (rows.length > 1) {
                    for (var i = 0; i < rows.length - 1; i++) {

                        // +=====+======+ ... + is checked
                        // before the third occurrence of this pattern we are in set S\Sigma
                        // after that we are in set S
                        if (new RegExp('^(\\+\\=+)+\\+$').test(rows[i])) {
                            marker++;
                            continue;
                        }

                        // only check each second row because all others are only separators
                        if (i % 2 === 1) {

                            //remove column separators and white spaces around the entry content
                            rows[i] = rows[i].split('|');
                            rows[i].shift();
                            rows[i].pop();
                            for (var j = 0; j < rows[i].length; j++) {
                                rows[i][j] = rows[i][j].trim();
                            }

                            // fill the table
                            if (i === 1) {
                                scope.table.header = rows[i];
                            } else {

                                // depending on which set of the table i am
                                if (marker === 2) {
                                    scope.table.body.s1.push(rows[i]);
                                } else {
                                    scope.table.body.s2.push(rows[i]);
                                }
                            }
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
        .directive('selectionCheckboxAll', selectionCheckboxAll)
        .directive('selectableListItem', selectableListItem);

    /**
     * Directive to select multiple items at once. Can only be used as an attribute to a input[type=checkbox] element.
     * On change, toggles property '_selected' of each item.
     *
     * Attribute 'items' should be the list of selectable items or a function that returns this list.
     *
     * Use: '<input type="checkbox" selection-checkbox-all items="..."/>'
     *
     * @returns {{restrict: string, scope: {items: string}, link: link}}
     */
    function selectionCheckboxAll() {
        return {
            restrict: 'A',
            scope: {
                items: '&'
            },
            link: link
        };
        function link(scope, el, attrs) {
            el.on('change', function () {
                var _this = this;
                var items = scope.items();

                // if attribute was function get items
                if (angular.isFunction(items)) {
                    items = items();
                }

                // select or deselect all items
                scope.$apply(function () {
                    for (var i = 0; i < items.length; i++) {
                        items[i]._selected = _this.checked;
                    }
                });
            })
        }
    }

    /**
     * The directive serves only as a template to reduce HTML code. Use it to display a selectable item and fill it with
     * stuff you want.
     *
     * Use: '<div selectable-list-item> ... </div>';
     *
     * @returns {{transclude: boolean, template: string}}
     */
    function selectableListItem() {
        return {
            transclude: true,
            template: ' <div class="selectable-list-item">' +
            '               <div class="selectable-list-control">' +
            '                   <input type="checkbox">' +
            '               </div>' +
            '               <div class="selectable-list-content" ng-transclude></div>' +
            '           </div>'
        };
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
        return {
            restrict: 'A',
            scope: {
                projectId: '@',
                onCreated: '&'
            },
            link: link
        };

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

        return {
            restrict: 'A',
            scope: {
                symbol: '=',
                onUpdated: '&',
                updateOnServer: '='
            },
            link: link
        };

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
                                symbol: scope.symbol.copy(),
                                updateOnServer: scope.updateOnServer
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

    /**
     * The directive for handling the opening of the modal for creating a new symbol group. Can only be used as
     * an attribute and attaches a click event to its source element.
     *
     * Use: '<button symbol-group-create-modal-handle project-id=".." on-created="..">Click Me!</button>'
     *
     * @param $modal - The ui.bootstrap $modal service
     * @param paths - The applications paths constant
     * @returns {{restrict: string, scope: {projectId: string, onCreated: string}, link: link}}
     */
    function symbolGroupCreateModalHandle($modal, paths) {
        return {
            restrict: 'A',
            scope: {
                projectId: '@',
                onCreated: '&'
            },
            link: link
        };

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
     * The directive that handles the opening of the modal for editing or deleting a symbol group. Can only be used as
     * attribute and attaches a click event to the source element that opens the modal.
     *
     * Attribute 'group' - The model for the symbol group
     * Attribute 'onUpdated' - The callback function with two parameters. First the updated and second the old group
     * Attribute 'onDeleted' - The callback function with one parameter - the deleted group object
     *
     * Use: '<button symbol-group-edit-modal group="..." on-updated="..." on-deleted="...">Click Me!</button>'
     *
     * @param $modal - The ui.bootstrap $modal service
     * @param paths - The applications paths constant
     * @returns {{scope: {group: string, onUpdated: string, onDeleted: string}, link: link}}
     */
    function symbolGroupEditModalHandle($modal, paths) {
        return {
            restrict: 'A',
            scope: {
                group: '=',
                onUpdated: '&',
                onDeleted: '&'
            },
            link: link
        };

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

    /**
     * The directive for handling the opening of the modal for moving symbols into another group. Can only be used as
     * an attribute and attaches a click event to its source element.
     *
     * Use: '<button symbol-move-modal-handle symbols="..." groups="..." onMoved="...">Click Me!</button>'
     *
     * @param $modal - The ui.bootstrap $modal service
     * @param paths - The applications paths constant
     * @returns {{scope: {symbols: string, groups: string, onMoved: string}, link: link}}
     */
    function symbolMoveModalHandle($modal, paths) {
        return {
            restrict: 'A',
            scope: {
                symbols: '=',
                groups: '=',
                onMoved: '&'
            },
            link: link
        };
        function link(scope, el, attrs) {
            el.on('click', function () {
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
                modal.result.then(function (data) {
                    scope.onMoved()(data.symbols, data.group);
                })
            });
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('variablesCountersOccurrenceModalHandle', variablesCountersOccurrenceModalHandle);

    variablesCountersOccurrenceModalHandle.$inject = ['$modal', 'paths'];

    /**
     * The directive that handles the opening of the modal dialog that shows occurrences of variables and counters. Can
     * only be used as an attribute and attaches a click event to the element that opens the modal.#
     *
     * Use: <button variabales-counters-occurrence-modal-handle>Click Me!</button>
     *
     * @param $modal - The ui.bootstrap $modal service
     * @param paths - The application constant with paths
     * @returns {{restrict: string, link: link}}
     */
    function variablesCountersOccurrenceModalHandle($modal, paths) {
        return {
            restrict: 'A',
            link: link
        };
        function link(scope, el, attrs) {
            el.on('click', function () {
                var modal = $modal.open({
                    templateUrl: paths.views.MODALS + '/variables-counters-occurrence-modal.html',
                    controller: 'VariablesCountersOccurrenceModalController'
                });
            });
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
     * Is transcludable so that child elements can be added before the title. So just add buttons or additional text
     * there.
     *
     * Use it like '<view-heading title="..." sub-title="..."> ... </view-heading>'
     *
     * The template can be found and changed at 'views/directives/view-heading.html'
     *
     * @returns {{scope: {title: string, subTitle: string}, transclude: boolean, templateUrl: string}}
     */
    function viewHeading(paths) {
        return {
            scope: {
                title: '@',
                subTitle: '@'
            },
            transclude: true,
            templateUrl: paths.views.DIRECTIVES + '/view-heading.html'
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('widget', widget)
        .directive('counterexamplesWidget', counterexamplesWidget)
        .directive('learnResumeSettingsWidget', learnResumeSettingsWidget);

    widget.$inject = ['paths'];
    counterexamplesWidget.$inject = ['paths', 'CounterExampleService', 'LearnerService', 'ToastService', 'outputAlphabet'];
    learnResumeSettingsWidget.$inject = ['paths', 'eqOracles', 'EqOracle'];


    /**
     * The directive for displaying a collapsable widget without content. Use is a a wrapper for any content you like.
     *
     * Attribute 'collapsed' {boolean} can be applied to tell whether the widgets content should be displayed or not.
     * Attribute 'widgetTitle' {string} can be applied for displaying a widget title.
     *
     * Use: '<widget widget-title="..." collapsed="..."></widget>'
     *
     * @param paths - The applications constant for paths
     * @returns {{scope: {collapsed: string, widgetTitle: string}, templateUrl: string, transclude: boolean, link: link}}
     */
    function widget(paths) {

        // the directive
        return {
            scope: {
                collapsed: '=',
                widgetTitle: '@'
            },
            templateUrl: paths.views.DIRECTIVES + '/widget.html',
            transclude: true,
            link: link
        };

        // the directives behavior
        function link(scope, el, attrs) {

            /**
             * The title that should be displayed in the widget header
             * @type {string}
             */
            scope.title = scope.widgetTitle || 'Untitled';

            /**
             * Flag for the display of the widget content
             * @type {boolean}
             */
            scope.collapsed = scope.collapsed || false;

            /**
             * Collapses or uncollapses the widget content
             */
            scope.toggleCollapse = function () {
                scope.collapsed = !scope.collapsed;
            }
        }
    }


    /**
     * The directive for the content of the counterexample widget that is used to create and test counterexamples.
     * Should be included into a <widget></widget> directive for visual appeal.
     *
     * Attribute 'counterexamples' {array} should be the model where the created counterexamples are put into.
     *
     * Use: '<div counterexamples-widget counterexamples="..."></div>'
     *
     * @param paths - The application paths constant
     * @param CounterExampleService - The service for sharing a counterexample with a hypothesis
     * @param Learner - The LearnerService for communication with the Learner
     * @param Toast - The ToastService
     * @param outputAlphabet - The dictionary for the output alphabet
     * @returns {{scope: {counterexamples: string}, templateUrl: string, link: link}}
     */
    function counterexamplesWidget(paths, CounterExampleService, Learner, Toast, outputAlphabet) {

        // the directive
        return {
            scope: {
                counterexamples: '='
            },
            templateUrl: paths.views.DIRECTIVES + '/counterexamples-widget.html',
            link: link
        };

        // the directives behavior
        function link(scope, el, attrs) {

            /**
             * The array of input output pairs of the shared counterexample
             * @type {Array}
             */
            scope.counterExample = [];

            /**
             * A list of counterexamples for editing purposes without manipulation the actual model
             * @type {Object[]}
             */
            scope.tmpCounterExamples = [];

            /**
             * The dictionary for the output alphabet
             * @type {Object}
             */
            scope.outputAlphabet = outputAlphabet;

            // get the shared counterexample object
            function init() {
                scope.counterExample = CounterExampleService.getCurrentCounterexample();
            }

            // update the model
            function renewCounterexamples() {
                scope.counterexamples = scope.tmpCounterExamples;
            }

            /**
             * Removes a input output pair from the temporary counterexamples array.
             *
             * @param {number} i - The index of the pair to remove
             */
            scope.removeInputOutputAt = function (i) {
                scope.counterExample.splice(i, 1);
            };

            /**
             * Toggles the output symbol of a input output pair between OK and FAILED
             *
             * @param {number} i - The index of the pair
             */
            scope.toggleOutputAt = function (i) {
                if (scope.counterExample[i].output === outputAlphabet.OK) {
                    scope.counterExample[i].output = outputAlphabet.FAILED
                } else {
                    scope.counterExample[i].output = outputAlphabet.OK
                }
            };

            /**
             * Adds a new counterexample to the scope and the model
             */
            scope.addCounterExample = function () {
                scope.tmpCounterExamples.push(scope.counterExample);
                CounterExampleService.resetCurrentCounterexample();
                renewCounterexamples();
                init();
            };

            /**
             * Removes a counterexample from the temporary and the model
             *
             * @param {number} i - the index of the pair in the temporary list of counterexamples
             */
            scope.removeCounterExampleAt = function (i) {
                scope.tmpCounterExamples.splice(i, 1);
                renewCounterexamples();
            };

            /**
             * Sets a selected counterexamples to the current one and shares it with the service
             *
             * @param {number} i - The index of the counterexample
             */
            scope.selectCounterExampleAt = function (i) {
                CounterExampleService.setCurrentCounterexample(scope.tmpCounterExamples[i]);
                scope.removeCounterExampleAt(i);
                init();
            };

            /**
             * Tests if the entered counterexample really is one by sending it to the server for testing purposes.
             */
            scope.testCounterExample = function () {
                Learner.isCounterexample(scope.counterExample)
                    .then(function (isCounterexample) {
                        if (isCounterexample) {
                            Toast.success('The selected word is a counterexample');
                        } else {
                            Toast.danger('The selected word is not a counterexample');
                        }
                    })
            };

            init();
        }
    }


    /**
     * The directive for the widget of the sidebar where learn resume configurations can be edited. Should be included
     * into a <div widget></div> directive for visual appeal.
     *
     * Expects an attribute 'learnConfiguration' attached to the element whose value should be a LearnConfiguration
     * object.
     *
     * Use: <div learn-resume-settings-widget learn-configuration="..."></div>
     *
     * @param paths - The constant for applications paths
     * @param eqOracles
     * @param EqOracle
     * @returns {{scope: {learnConfiguration: string}, templateUrl: string, link: link}}
     */
    function learnResumeSettingsWidget(paths, eqOracles, EqOracle) {

        // the directive
        return {
            scope: {
                learnConfiguration: '='
            },
            templateUrl: paths.views.DIRECTIVES + '/learn-resume-settings-widget.html',
            link: link
        };

        // the directives behavior
        function link(scope, el, attrs) {

            /**
             * The dictionary for eq oracle types
             * @type {Object}
             */
            scope.eqOracles = eqOracles;

            /**
             * The selected eq oracle type from the select box
             * @type {string}
             */
            scope.selectedEqOracle = scope.learnConfiguration.eqOracle.type;

            /**
             * Creates a new eq oracle object from the selected type and assigns it to the configuration
             */
            scope.setEqOracle = function () {
                scope.learnConfiguration.eqOracle = EqOracle.createFromType(scope.selectedEqOracle);
            };
        }
    }
}());;(function () {

    angular
        .module('weblearner.models')
        .factory('Action', ActionModel);

    ActionModel.$inject = ['actionTypes'];

    function ActionModel(actionTypes) {

        function Action(type) {
            this.type = type;
            this.negated = false;
            this.ignoreFailure = false;
        }

        Action.Web = function () {
        };

        Action.Web.SearchForText = function (value, isRegexp) {
            Action.call(this, actionTypes.web.SEARCH_FOR_TEXT);
            this.value = value || null;
            this.regexp = isRegexp || false;
        };

        Action.Web.SearchForText.prototype.toString = function () {
            return 'Search for ' + (this.regexp ? 'regexp' : 'string') + ' "' + this.value + '"';
        };

        Action.Web.SearchForNode = function (value, isRegexp) {
            Action.call(this, actionTypes.web.SEARCH_FOR_NODE);
            this.value = value || null;
            this.regexp = isRegexp || false
        };

        Action.Web.SearchForNode.prototype.toString = function () {
            return 'Search for node "' + this.value + '"' + (this.regexp ? 'as regexp' : '');
        };

        Action.Web.Clear = function (node) {
            Action.call(this, actionTypes.web.CLEAR);
            this.node = node || null;
        };

        Action.Web.Clear.prototype.toString = function () {
            return 'Clear element "' + this.node + '"';
        };

        Action.Web.Click = function (node) {
            Action.call(this, actionTypes.web.CLICK);
            this.node = node || null;
        };

        Action.Web.Click.prototype.toString = function () {
            return 'Click on element "' + this.node + '"';
        };

        Action.Web.ClickLinkByText = function (value) {
            Action.call(this, actionTypes.web.CLICK_LINK_BY_TEXT);
            this.value = value || null;
        };

        Action.Web.ClickLinkByText.prototype.toString = function () {
            return 'Click on link with text "' + this.value + '"';
        };

        Action.Web.Fill = function (node, value) {
            Action.call(this, actionTypes.web.FILL);
            this.node = node || null;
            this.value = value || null
        };

        Action.Web.Fill.prototype.toString = function () {
            return 'Fill element "' + this.node + '" with "' + this.value + '"';
        };

        Action.Web.GoTo = function (url) {
            Action.call(this, actionTypes.web.GO_TO);
            this.url = url || null;
        };

        Action.Web.GoTo.prototype.toString = function () {
            return 'Go to URL "' + this.url + '"';
        };

        Action.Web.Submit = function (node) {
            Action.call(this, actionTypes.web.SUBMIT);
            this.node = node || null;
        };

        Action.Web.Submit.prototype.toString = function () {
            return 'Submit element "' + this.node + '"';
        };

        Action.Web.Select = function (node, value) {
            Action.call(this, actionTypes.web.SELECT);
            this.node = node || null;
            this.value = value || null;
        };

        Action.Web.Select.prototype.toString = function () {
            return 'Select value "' + this.value + '" from select input "' + this.node + '"';
        };

        //////////

        Action.Rest = function () {
        };

        Action.Rest.Call = function (method, url, data) {
            Action.call(this, actionTypes.rest.CALL_URL);
            this.method = method || null;
            this.url = url || null;
            this.data = data || null;
        };

        Action.Rest.Call.prototype.toString = function () {
            return 'Make a "' + this.method + '" request to "' + this.url + '"';
        };

        Action.Rest.CheckStatus = function (statusCode) {
            Action.call(this, actionTypes.rest.CHECK_STATUS);
            this.status = statusCode || null;
        };

        Action.Rest.CheckStatus.prototype.toString = function () {
            return 'Check HTTP response status to be "' + this.status + '"'
        };

        Action.Rest.CheckHeaderField = function (key, value, isRegexp) {
            Action.call(this, actionTypes.rest.CHECK_HEADER_FIELD);
            this.key = key || null;
            this.value = value || null;
            this.regexp = isRegexp || false;
        };

        Action.Rest.CheckHeaderField.prototype.toString = function () {
            return 'Check HTTP response header field "' + this.key + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
        };

        Action.Rest.CheckHttpBodyText = function (value, isRegexp) {
            Action.call(this, actionTypes.rest.CHECK_HTTP_BODY_TEXT);
            this.value = value || null;
            this.regexp = isRegexp || false;
        };

        Action.Rest.CheckHttpBodyText.prototype.toString = function () {
            return 'Search in the HTTP response body for ' + (this.regexp ? 'regexp' : 'string') + ' "' + this.value + '"';
        };

        Action.Rest.CheckAttributeExists = function (attribute) {
            Action.call(this, actionTypes.rest.CHECK_ATTRIBUTE_EXISTS);
            this.attribute = this.attribute = attribute || null;
        };

        Action.Rest.CheckAttributeExists.prototype.toString = function () {
            return 'Check if the JSON of a HTTP response has attribute "' + this.attribute + '"';
        };

        Action.Rest.CheckAttributeValue = function (attribute, value, isRegexp) {
            Action.call(this, actionTypes.rest.CHECK_ATTRIBUTE_VALUE);
            this.attribute = attribute || null;
            this.value = value || null;
            this.regexp = isRegexp || false
        };

        Action.Rest.CheckAttributeValue.prototype.toString = function () {
            return 'Check the JSON of a HTTP response to have attribute "' + this.attribute + '" to be' + (this.regexp ? ' like ' : ' ') + '"' + this.value + '"';
        };

        Action.Rest.CheckAttributeType = function (attribute, jsonType) {
            Action.call(this, actionTypes.rest.CHECK_ATTRIBUTE_TYPE);
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
            Action.call(this, actionTypes.other.WAIT);
            this.duration = duration || 0;
        };

        Action.Other.Wait.prototype.toString = function () {
            return 'Wait for ' + this.duration + 'ms'
        };

        Action.Other.ExecuteSymbol = function (symbolName, idRevisionPair) {
            Action.call(this, actionTypes.other.EXECUTE_SYMBOL);

            var _symbol = {
                name: symbolName || null,
                revision: null
            };

            this.symbolToExecute = idRevisionPair || {id: null, revision: null};

            this.setSymbol = function (symbol) {
                if (angular.isDefined(symbol)) {
                    this.symbolToExecute = {
                        id: symbol.id,
                        revision: symbol.revision
                    };
                    _symbol.name = symbol.name;
                    _symbol.revision = symbol.revision;
                }
            };

            this.getSymbol = function () {
                return _symbol;
            }
        };

        Action.Other.ExecuteSymbol.prototype.toString = function () {
            return 'Execute symbol "' + this.getSymbol().name + '", rev. ' + this.symbolToExecute.revision;
        };

        Action.Other.IncrementCounter = function (name) {
            Action.call(this, actionTypes.other.INCREMENT_COUNTER);
            this.name = name || null;
        };

        Action.Other.IncrementCounter.prototype.toString = function () {
            return 'Increment counter "' + this.name + '"';
        };

        Action.Other.SetCounter = function (name, value) {
            Action.call(this, actionTypes.other.SET_COUNTER);
            this.name = name || null;
            this.value = value || null;
        };

        Action.Other.SetCounter.prototype.toString = function () {
            return 'Set counter "' + this.name + '" to "' + this.value + '"';
        };

        Action.Other.SetVariable = function (name, value) {
            Action.call(this, actionTypes.other.SET_VARIABLE);
            this.name = name || null;
            this.value = value || '';
        };

        Action.Other.SetVariable.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to "' + this.value + '"';
        };

        Action.Other.SetVariableByJSONAttribute = function (name, jsonAttribute) {
            Action.call(this, actionTypes.other.SET_VARIABLE_BY_JSON_ATTRIBUTE);
            this.name = name || null;
            this.value = jsonAttribute || null;
        };

        Action.Other.SetVariableByJSONAttribute.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the JSON attribute "' + this.value + '"';
        };

        Action.Other.SetVariableByNode = function (name, xPath) {
            Action.call(this, actionTypes.other.SET_VARIABLE_BY_NODE);
            this.name = name || null;
            this.value = xPath || null;
        };

        Action.Other.SetVariableByNode.prototype.toString = function () {
            return 'Set variable "' + this.name + '" to the value of the element "' + this.value + '"';
        };

        Action.build = function (data) {
            var action;

            switch (data.type) {

                // web actions
                case actionTypes.web.SEARCH_FOR_TEXT:
                    action = new Action.Web.SearchForText(data.value, data.regexp);
                    break;
                case actionTypes.web.SEARCH_FOR_NODE:
                    action = new Action.Web.SearchForNode(data.value, data.regexp);
                    break;
                case actionTypes.web.CLEAR:
                    action = new Action.Web.Clear(data.node);
                    break;
                case actionTypes.web.CLICK:
                    action = new Action.Web.Click(data.node);
                    break;
                case actionTypes.web.CLICK_LINK_BY_TEXT:
                    action = new Action.Web.ClickLinkByText(data.value);
                    break;
                case actionTypes.web.FILL:
                    action = new Action.Web.Fill(data.node, data.value);
                    break;
                case actionTypes.web.GO_TO:
                    action = new Action.Web.GoTo(data.url);
                    break;
                case actionTypes.web.SUBMIT:
                    action = new Action.Web.Submit(data.node);
                    break;
                case actionTypes.web.SELECT:
                    action = new Action.Web.Select(data.node);
                    break;

                // rest actions
                case actionTypes.rest.CALL_URL:
                    action = new Action.Rest.Call(data.method, data.url, data.data);
                    break;
                case actionTypes.rest.CHECK_STATUS:
                    action = new Action.Rest.CheckStatus(data.status);
                    break;
                case actionTypes.rest.CHECK_HEADER_FIELD:
                    action = new Action.Rest.CheckHeaderField(data.key, data.value, data.regexp);
                    break;
                case actionTypes.rest.CHECK_HTTP_BODY_TEXT:
                    action = new Action.Rest.CheckHttpBodyText(data.value, data.regexp);
                    break;
                case actionTypes.rest.CHECK_ATTRIBUTE_EXISTS:
                    action = new Action.Rest.CheckAttributeExists(data.attribute);
                    break;
                case actionTypes.rest.CHECK_ATTRIBUTE_VALUE:
                    action = new Action.Rest.CheckAttributeValue(data.attribute, data.value, data.regexp);
                    break;
                case actionTypes.rest.CHECK_ATTRIBUTE_TYPE:
                    action = new Action.Rest.CheckAttributeType(data.attribute, data.jsonType);
                    break;

                // other actions
                case actionTypes.other.WAIT:
                    action = new Action.Other.Wait(data.duration);
                    break;
                case actionTypes.other.EXECUTE_SYMBOL:
                    action = new Action.Other.ExecuteSymbol(data.symbolToExecuteName, data.symbolToExecute);
                    break;
                case actionTypes.other.INCREMENT_COUNTER:
                    action = new Action.Other.IncrementCounter(data.name);
                    break;
                case actionTypes.other.SET_COUNTER:
                    action = new Action.Other.SetCounter(data.name, data.value);
                    break;
                case actionTypes.other.SET_VARIABLE:
                    action = new Action.Other.SetVariable(data.name, data.value);
                    break;
                case actionTypes.other.SET_VARIABLE_BY_JSON_ATTRIBUTE:
                    action = new Action.Other.SetVariableByJSONAttribute(data.name, data.value);
                    break;
                case actionTypes.other.SET_VARIABLE_BY_NODE:
                    action = new Action.Other.SetVariableByNode(data.name, data.value);
                    break;

                default:
                    return null;
                    break;
            }

            action.negated = data.negated;
            action.ignoreFailure = data.ignoreFailure;

            return action;
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
        return {
            Random: Random,
            Complete: Complete,
            Sample: Sample,
            build: build,
            createFromType: createFromType
        };

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
        function Sample(counterExamples) {
            this.type = eqOracles.SAMPLE;
            this.counterExamples = counterExamples || [];
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
                    eqOracle = new Random(data.minLength, data.maxLength, data.maxNoOfTests);
                    break;
                case eqOracles.COMPLETE:
                    eqOracle = new Complete(data.minDepth, data.maxDepth);
                    break;
                case eqOracles.SAMPLE:
                    eqOracle = new Sample(data.counterExamples);
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
         * @constructor
         */
        function LearnConfiguration() {
            this.symbols = [];
            this.maxAmountOfStepsToLearn = 0;
            this.eqOracle = new EqOracle.Random(1, 10, 20);
            this.algorithm = learnAlgorithms.EXTENSIBLE_LSTAR;
            this.resetSymbol = null;
        }

        LearnConfiguration.prototype.toLearnResumeConfiguration = function () {
            delete this.symbols;
            delete this.algorithm;
            delete this.resetSymbol;
            return this;
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

        /**
         * Fetches multiple complete test results.
         *
         * @param {number} projectId - The id of the project
         * @param {number[]} testNos - The numbers of the tests
         * @returns {*}
         */
        LearnResultResource.prototype.getSomeComplete = function (projectId, testNos) {
            var numbers = testNos.join(',');

            return $http.get(paths.api.URL + '/projects/' + projectId + '/results/' + numbers + '/complete')
                .then(function (response) {
                    var data = response.data;
                    if (data.length > 0) {
                        if (!angular.isArray(data[0])) {
                            return [data]
                        } else {
                            return data;
                        }
                    } else {
                        return [[]];
                    }
                })
        };

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
            var numbers = testNos.join(',');

            return $http.delete(paths.api.URL + '/projects/' + projectId + '/results/' + numbers, {})
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
         * Make a GET http request to /rest/projects in order to fetch all existing projects
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

    Resource.$inject = ['$http', 'paths'];

    /**
     * The resource that handles http requests to the API to do CRUD operations on symbol groups
     *
     * @param $http
     * @param paths
     * @returns {SymbolGroupResource}
     * @constructor
     */
    function Resource($http, paths) {

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
         * @param {SymbolGroup} group - The symbol group that should be updated
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
         * @param {SymbolGroup} group - The symbol group that should be deleted
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
         * Makes a PUT request to /rest/projects/{projectId}/symbols/{symbolId}/moveTo/{groupId} in order to move
         * a symbol to another group without creating a new revision
         *
         * @param {number} projectId - The id of the project
         * @param {number} symbolId - The id of the symbol
         * @param {number} groupId - The id of the symbol group
         * @returns {HttpPromise}
         */
        SymbolResource.prototype.move = function (projectId, symbolId, groupId) {
            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/' + symbolId + '/moveTo/' + groupId, {})
        };

        /**
         * Makes a PUT request to /rest/projects/{projectId}/symbols/{symbolId}/moveTo/{groupId} in order to move
         * a symbol to another group without creating a new revision
         *
         * @param {number} projectId - The id of the project
         * @param {Symbol[]} symbols - The symbols to be moved
         * @param {number} groupId - The id of the symbol group
         * @returns {HttpPromise}
         */
        SymbolResource.prototype.moveSome = function (projectId, symbols, groupId) {
            var symbolIds = _.pluck(symbols, 'id').join(',');
            return $http.put(paths.api.URL + '/projects/' + projectId + '/symbols/batch/' + symbolIds + '/moveTo/' + groupId, {})
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
                .then(function (response) {
                    return _this.build(response.data);
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
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('CounterExampleService', CounterExampleService);

    CounterExampleService.$inject = [];

    /**
     * The service that is used to share a counterexample between the counter example widget and a hypothesis.
     * A counterexample is defined by a list of objects with input & output property
     *
     * @returns {{getCurrentCounterexample: getCurrentCounterexample, setCurrentCounterexample: setCurrentCounterexample, resetCurrentCounterexample: resetCurrentCounterexample, addIOPairToCurrentCounterexample: addIOPairToCurrentCounterexample}}
     * @constructor
     */
    function CounterExampleService() {

        // the counterexample
        var counterexample = [];

        return {
            getCurrentCounterexample: getCurrentCounterexample,
            setCurrentCounterexample: setCurrentCounterexample,
            resetCurrentCounterexample: resetCurrentCounterexample,
            addIOPairToCurrentCounterexample: addIOPairToCurrentCounterexample
        };

        /**
         * Gets the counterexample
         *
         * @returns {Object[]} - The counterexample
         */
        function getCurrentCounterexample() {
            return counterexample;
        }

        /**
         * Sets the counterexample
         *
         * @param {Object[]} ce - The list of input/output pairs that define a counterexample
         */
        function setCurrentCounterexample(ce) {
            counterexample = ce;
        }

        /**
         * Removes all input / output pairs from the counterexample
         */
        function resetCurrentCounterexample() {
            counterexample = [];
        }

        /**
         * Adds a new input / output pair to the counterexample
         *
         * @param {string} input - The input symbol
         * @param {string} output - The output symbol
         */
        function addIOPairToCurrentCounterexample(input, output) {
            counterexample.push({
                input: input,
                output: output
            })
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('CountersService', CountersService);

    CountersService.$inject = ['$http', 'paths'];

    /**
     * The service that communicates with the API in order to read and delete counters. Counters are objects consisting
     * of a unique 'name' property, a 'value' which holds the current value of the counter in the database and 'project'
     * for the projects id.
     *
     * Example: {"name": "i", "value": 10, "project": 1}
     *
     * @param $http - angular $http service
     * @param paths - application paths constants
     * @returns {{getAll: getAll, delete: deleteOne, deleteSome: deleteSome}}
     * @constructor
     */
    function CountersService($http, paths) {

        // the services functions
        return {
            getAll: getAll,
            delete: deleteOne,
            deleteSome: deleteSome
        };

        /**
         * Makes a GET request to /rest/projects/{projectId}/counters in order to fetch all counter of the current
         * project.
         *
         * @param {number} projectId - The id of a project
         * @returns angular promise object of the request
         */
        function getAll(projectId) {
            return $http.get(paths.api.URL + '/projects/' + projectId + '/counters')
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Makes a DELETE request to /rest/projects/{projectId}/counters/{counterName} in order to delete a counter from
         * the database.
         *
         * @param {number} projectId - The id of a project
         * @param {string} name - The name of a counter
         * @returns angular promise object of the request
         */
        function deleteOne(projectId, name) {
            return $http.delete(paths.api.URL + '/projects/' + projectId + '/counters/' + name)
                .then(function (response) {
                    return response.data;
                })
        }

        /**
         * Makes a DELETE request to /rest/projects/{projectId}/counters/batch/{counterNames} in order to delete
         * multiple counters from the database
         *
         * @param {number} projectId - The id of a project
         * @param {string[]} names - A list of the names of counters
         * @returns angular promise object of the request
         */
        function deleteSome(projectId, names) {
            var n = names.join(',');
            return $http.delete(paths.api.URL + '/projects/' + projectId + '/counters/batch/' + n)
                .then(function (response) {
                    return response.data;
                })
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('FileDownloadService', FileDownloadService);

    FileDownloadService.$inject = ['PromptService'];

    /**
     * The service that allows the file download of various filetypes: JSON, SVG, CSV. For each download, it prompts
     * the user for a filename of the downloadable file.
     *
     * @param PromptService - The service to create prompts with
     * @returns {{downloadJson: downloadJson, downloadCSV: downloadCSV, downloadSVG: downloadSVG}}
     * @constructor
     */
    function FileDownloadService(PromptService) {

        // the service
        return {
            downloadJson: downloadJson,
            downloadCSV: downloadCSV,
            downloadSVG: downloadSVG
        };

        // private functions

        /**
         * Downloads a file.
         *
         * @param {string} filename - The name of the file
         * @param {string} fileExtension - The file extension of the file
         * @param {string} href - The contents of the href attribute which holds the data of the file
         * @private
         */
        function _download(filename, fileExtension, href) {

            // create new link element with downloadable
            var a = document.createElement('a');
            a.style.display = 'none';
            a.setAttribute('href', href);
            a.setAttribute('target', '_blank');
            a.setAttribute('download', filename + '.' + fileExtension);

            // append link to the dom, fire click event and remove it
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        /**
         * Opens a prompt dialog that asks for a file name.
         *
         * @param {string} fileExtension - The file extension of the file that should be downloaded
         * @returns {Promise} - The promise with the filename
         * @private
         */
        function _prompt(fileExtension) {
            return PromptService.prompt('Enter a name for the ' + fileExtension + ' file.', {
                regexp: /^[a-zA-Z0-9\.\-,_]+$/,
                errorMsg: 'The name may not be empty and only consist of letters, numbers and the symbols ",._-".'
            })
        }

        // available service functions

        /**
         * Downloads an object as a json file. Prompts for a file name.
         *
         * @param {Object} jsonObject - The object that should be downloaded
         */
        function downloadJson(jsonObject) {
            _prompt('JSON')
                .then(function (filename) {
                    var href = 'data:text/json;charset=utf-8,' + encodeURIComponent(angular.toJson(jsonObject));
                    _download(filename, 'json', href);
                })
        }

        /**
         * Downloads a given string as csv file. Prompts for a filename.
         *
         * @param {string} csv - The string that represents the csv
         */
        function downloadCSV(csv) {
            _prompt('CSV')
                .then(function (filename) {
                    var href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                    _download(filename, 'csv', href);
                })
        }

        /**
         * Downloads a SVG element as a svg file. Prompts for a filename.
         *
         * @param {*|HTMLElement} svg - The svg element that should be downloaded
         */
        function downloadSVG(svg) {
            _prompt('SVG')
                .then(function (filename) {

                    // set proper xml attributes for downloadable file
                    svg.setAttribute('version', '1.1');
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                    // create serialized string from svg element and encode it in
                    // base64 otherwise the file will not be completely downloaded
                    // what results in errors opening the file
                    var svgString = new XMLSerializer().serializeToString(svg);
                    var href = 'data:image/svg+xml;base64,\n' + window.btoa(svgString);

                    _download(filename, 'svg', href);
                })
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('LearnerResultChartService', LearnerResultChartService);

    LearnerResultChartService.$inject = ['_'];

    /**
     * The service to create n3 line chart data from learner results. Can create bar chart data from multiple final
     * learner results and area chart data from multiple complete learner results.
     *
     * @param _ - Lodash
     * @returns {{createDataFromMultipleFinalResults: createDataFromMultipleFinalResults, createDataFromMultipleCompleteResults: createDataFromMultipleCompleteResults, properties: {MQS: string, EQS: string, SYMBOL_CALLS: string, SIGMA: string, DURATION: string}}}
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
                        dataValues.push(_(result).pluck('statistics').pluck(properties.MQS).value());
                    });

                    break;
                case properties.EQS:
                    _.forEach(results, function (result) {
                        dataValues.push(_(result).pluck('statistics').pluck(properties.EQS).value());
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
                        dataValues.push(_(result).pluck('statistics').pluck(properties.SYMBOL_CALLS).value());
                    });
                    break;
                case properties.DURATION:
                    _.forEach(results, function (result) {
                        dataValues.push(_(result).pluck('statistics').pluck(properties.DURATION).value());
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
            for (i = 0; i < maxSteps; i++) {
                var data = {x: i};
                for (j = 0; j < dataValues.length; j++) {
                    data['val_' + j] = dataValues[j][i];
                }
                dataSets.push(data);
            }

            // create options for each test
            for (i = 0; i < results.length; i++) {
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
        .module('weblearner.services')
        .factory('LearnerService', LearnerService);

    LearnerService.$inject = ['$http', 'paths'];

    /**
     * The service for interacting with the learner
     *
     * @param $http - angular $http service
     * @param paths - The applications paths constant
     * @returns {{start: start, stop: stop, resume: resume, getStatus: getStatus, isActive: isActive, isCounterexample: isCounterexample}}
     * @constructor
     */
    function LearnerService($http, paths) {
        return {
            start: start,
            stop: stop,
            resume: resume,
            getStatus: getStatus,
            isActive: isActive,
            isCounterexample: isCounterexample
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
         * @param testNo
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

        /**
         * Checks if the selected path is a counterexample.
         * TODO: implement
         *
         * @param {number} projectId
         * @param {{input: string, output: string}[]} counterexample
         * @returns {*}
         */
        function isCounterexample(projectId, counterexample) {
            return $http.post(paths.api.URL + '/learner/active', {})
                .then(function () {
                    return true;
                })
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
        .factory('SelectionService', SelectionService);

    SelectionService.$inject = ['_'];

    /**
     * Service with helper functions for selecting models.
     *
     * @param _ - Lodash
     * @returns {{getSelected: getSelected, removeSelection: removeSelection, isSelected: isSelected}}
     * @constructor
     */
    function SelectionService(_) {

        /**
         * The property whose value determines whether an object is selected or not.
         * @type {string}
         * @private
         */
        var _propertyName = "_selected";

        // the service
        return {
            getSelected: getSelected,
            removeSelection: removeSelection,
            isSelected: isSelected
        };

        /**
         * Filters all objects where the property '_selected' doesn't exists or is false.
         *
         * @param {Object[]} items
         * @return {Object[]|[]}
         */
        function getSelected(items) {
            return _.filter(items, function (item) {
                return item[_propertyName] === true;
            });
        }

        /**
         * Removes the property '_selected' from all items.
         *
         * @param {Object[]|Object} items
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
         * Checks if an object is selected.
         *
         * @param {Object} item - The item whose status is checked
         * @returns {boolean} - Whether or not the item is selected
         */
        function isSelected(item) {
            return angular.isUndefined(item._selected) ? false : item._selected;
        }
    }
}());;(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .factory('SessionService', SessionService);

    SessionService.$inject = ['$rootScope', 'Project'];

    /**
     * The session that is used in this application to save data in the session storage of the browser to store data in
     * between page refreshes in the same tab. So the project doesn't have to be fetched from the server every time the
     * page refreshes
     *
     * @param $rootScope
     * @param Project
     * @return {{project: {get: getProject, save: saveProject, remove: removeProject}}}
     * @constructor
     */
    function SessionService($rootScope, Project) {

        // the service
        return {
            project: {
                get: getProject,
                save: saveProject,
                remove: removeProject
            }
        };

        /**
         * Get the stored project object from the session storage
         *
         * @return {Project}
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
         * Creates a toast message.
         *
         * @param {string} type - a bootstrap alert class type: 'success', 'error', 'info' etc.
         * @param {string} message - The message to be displayed
         */
        function createToast(type, message) {
            ngToast.create({
                class: type,
                content: message,
                dismissButton: true
            });
        }

        /**
         * Create a success toast message
         *
         * @param {String} message - The message to be displayed
         */
        function success(message) {
            createToast('success', message);
        }

        /**
         * Create an error / danger toast message
         *
         * @param {String} message - The message to be displayed
         */
        function danger(message) {
            createToast('danger', message);
        }

        /**
         * Create an info toast message
         *
         * @param {String} message - The message to be displayed
         */
        function info(message) {
            createToast('info', message);
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

    /**
     * The filter that formats something like 'A_CONSTANT_KEY' to 'A Constant Key'
     *
     * @returns {filter}
     */
    function formatEnumKey() {
        return filter;

        /**
         * @param {string} string - The enum key in upper snake case format
         * @returns {string}
         */
        function filter(string) {
            return string.toLowerCase().split('_').join(' ').replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            })
        }
    }


    /**
     * The filter to format a EQ type constant to something more readable
     *
     * @param {Object} eqOracles - The EQ oracle constant
     * @returns {filter}
     */
    function formatEqOracle(eqOracles) {
        return filter;

        /**
         * @param {string} type - The eq oracle type
         * @returns {string}
         */
        function filter(type) {
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

    /**
     * The filter to format a learn algorithm name to something more readable

     * @param {Object} learnAlgorithms - The dictionary of learn algorithms
     * @returns {filter}
     */
    function formatAlgorithm(learnAlgorithms) {
        return filter

        /**
         * @param {string} name - the name of a learn algorithm
         * @returns {string}
         */
        function filter(name) {
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

}());