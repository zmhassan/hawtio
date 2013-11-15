/// <reference path='../../core/js/corePlugin.ts'/>
/// <reference path='defaultPage.ts'/>
/// <reference path='helpers.ts'/>
/// <reference path='metadata.ts'/>

/// <reference path='../../fabric/js/fabricPlugin.ts'/>
/// <reference path='../../insight/js/insightPlugin.ts'/>

module Perspective {
  var pluginName = 'perspective';
  angular.module(pluginName, ['hawtioCore']).
          config(($routeProvider) => {
            $routeProvider.
                    when('/perspective/defaultPage', {templateUrl: 'app/perspective/html/defaultPage.html',
                      controller: Perspective.DefaultPageController});
          }).
          run(($location:ng.ILocationService, workspace:Workspace, viewRegistry, layoutFull) => {

            viewRegistry['perspective'] = layoutFull;

          });

  hawtioPluginLoader.addModule(pluginName);
}
