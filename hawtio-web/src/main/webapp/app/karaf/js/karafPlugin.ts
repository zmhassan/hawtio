/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>
/// <reference path='../../core/js/workspace.ts'/>

module Karaf {
  var pluginName = 'karaf';
  angular.module(pluginName, ['bootstrap', 'ngResource', 'hawtioCore']).config(($routeProvider) => {
    $routeProvider.
            when('/osgi/server', {templateUrl: 'app/karaf/html/server.html'}).
            when('/osgi/features', {templateUrl: 'app/karaf/html/features.html', reloadOnSearch: false}).
            when('/osgi/scr-components', {templateUrl: 'app/karaf/html/scr-components.html'}).
            when('/osgi/scr-component/:name', {templateUrl: 'app/karaf/html/scr-component.html'}).
            when('/osgi/feature/:name/:version', {templateUrl: 'app/karaf/html/feature.html'})
  }).
      run((workspace:Workspace, viewRegistry, helpRegistry) => {

        helpRegistry.addUserDoc('karaf', 'app/karaf/doc/help.md', () => {
          return workspace.treeContainsDomainAndProperties('org.apache.karaf');
        });

      });

  hawtioPluginLoader.addModule(pluginName);
}
