/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>
/// <reference path='../../core/js/workspace.ts'/>
/// <reference path='jvmHelpers.ts'/>

module Jvm {

  var pluginName = 'jvm';

  angular.module(pluginName, ['bootstrap', 'ngResource', 'datatable', 'hawtioCore']).
          config(($routeProvider) => {
            $routeProvider.
                    when('/jvm/connect', {templateUrl: 'app/jvm/html/connect.html'}).
                    when('/jvm/local', {templateUrl: 'app/jvm/html/local.html'});
          }).
          constant('mbeanName', 'io.hawt.jvm.local:type=JVMList').
          run(($location, workspace:Workspace, viewRegistry, layoutFull, helpRegistry) => {

            viewRegistry[pluginName] = layoutFull;
            helpRegistry.addUserDoc('jvm', 'app/jvm/doc/help.md');

            workspace.topLevelTabs.push({
              content: "Connect",
              title: "Connect to other JVMs",
              isValid: (workspace) => true,
              href: () => '#/jvm/connect',
              isActive: (workspace:Workspace) => workspace.isLinkActive("jvm")
            });
          });

  hawtioPluginLoader.addModule(pluginName);
}
