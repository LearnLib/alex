angular.module('templates-all', ['app/views/directives/counterexamples-widget.html', 'app/views/directives/html-element-picker.html', 'app/views/directives/hypothesis.html', 'app/views/directives/index-browser.html', 'app/views/directives/learn-results-panel.html', 'app/views/directives/learn-results-slideshow-panel.html', 'app/views/directives/learn-resume-settings-widget.html', 'app/views/directives/learner-result-chart-multiple-final.html', 'app/views/directives/load-screen.html', 'app/views/directives/navigation.html', 'app/views/directives/observation-table.html', 'app/views/directives/view-heading.html', 'app/views/directives/widget.html', 'app/views/includes/action-forms.html', 'app/views/modals/action-create-modal.html', 'app/views/modals/action-edit-modal.html', 'app/views/modals/confirm-dialog.html', 'app/views/modals/hypothesis-layout-settings-modal.html', 'app/views/modals/learn-result-details-modal.html', 'app/views/modals/learn-setup-settings-modal.html', 'app/views/modals/prompt-dialog.html', 'app/views/modals/symbol-create-modal.html', 'app/views/modals/symbol-edit-modal.html', 'app/views/modals/symbol-group-create-modal.html', 'app/views/modals/symbol-group-edit-modal.html', 'app/views/modals/symbol-move-modal.html', 'app/views/modals/variables-counters-occurrence-modal.html', 'app/views/pages/about.html', 'app/views/pages/counters.html', 'app/views/pages/help.html', 'app/views/pages/home.html', 'app/views/pages/learn-results-compare.html', 'app/views/pages/learn-results-statistics.html', 'app/views/pages/learn-results.html', 'app/views/pages/learn-setup.html', 'app/views/pages/learn-start.html', 'app/views/pages/project-create.html', 'app/views/pages/project-settings.html', 'app/views/pages/project.html', 'app/views/pages/symbols-actions.html', 'app/views/pages/symbols-export.html', 'app/views/pages/symbols-history.html', 'app/views/pages/symbols-import.html', 'app/views/pages/symbols-trash.html', 'app/views/pages/symbols.html']);

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
    "    <a class=\"btn btn-default btn-sm\" html-element-picker model=\"action.node\">\n" +
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
    "        Increment an <strong>already declared</strong> counter variable\n" +
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
    "        Set the value of an <strong>already declared</strong> counter variable\n" +
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
    "        Set the value of an <strong>already declared</strong> variable\n" +
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
    "        Set the value of an <strong>already declared</strong> variable to the content of a JSON\n" +
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
    "        Set the value of an <strong>already declared</strong> variable to the content of a HTML element\n" +
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
    "                <td colspan=\"4\"><strong>Counters</strong></td>\n" +
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
    "                <td colspan=\"4\"><strong>Variables</strong></td>\n" +
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
    "    <button class=\"btn btn-primary\" ng-click=\"close()\">Ok</button>\n" +
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
    "    <a class=\"back-button btn btn-default btn-xs\" ui-sref=\"symbols\">\n" +
    "        <i class=\"fa fa-fw fa-arrow-left\"></i>\n" +
    "    </a>\n" +
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
    "        <div class=\"pull-left\" style=\"margin-right: 16px\" selectable items=\"allSymbols\">\n" +
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
    "        <div class=\"pull-left\" style=\"margin-right: 16px\" selectable items=\"symbols\">\n" +
    "            <input type=\"checkbox\" selection-checkbox-all items=\"selectedSymbols\">\n" +
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
    "                <div class=\"btn-group btn-group-xs pull-right\" dropdown dropdown-hover ng-if=\"$index !== 0\">\n" +
    "                    <button type=\"button\" class=\"btn btn-default btn-icon dropdown-toggle\" dropdown-toggle>\n" +
    "                        <i class=\"fa fa-bars\"></i>\n" +
    "                    </button>\n" +
    "                    <ul class=\"dropdown-menu pull-left\" role=\"menu\">\n" +
    "                        <li>\n" +
    "                            <a href ng-click=\"restoreRevision(revision)\">\n" +
    "                                <i class=\"fa fa-history fa-fw\"></i> Restore\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
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
