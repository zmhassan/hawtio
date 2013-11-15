/// <reference path='../../core/js/coreHelpers.ts'/>
/// <reference path='forceGraphDirective.ts'/>
/// <reference path='graphBuilder.ts'/>
module ForceGraph {
    var pluginName = 'forceGraph';

    angular.module(pluginName, ['bootstrap', 'ngResource', 'hawtioCore']).

        directive('hawtioForceGraph', function () {
            return new ForceGraph.ForceGraphDirective();
        })
        .run((helpRegistry) => {
          helpRegistry.addDevDoc('Force Graph', 'app/forcegraph/doc/developer.md');
        });

    hawtioPluginLoader.addModule(pluginName);
}
