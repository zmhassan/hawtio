/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/workspace.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>

module Apollo {
  export function VirtualHostController($scope, $http, $location, localStorage, workspace:Workspace) {
    $scope.virtual_host = {}
    $scope.init = (virtual_host_name)=>{
      $scope.ajax("GET", "/broker/virtual-hosts/"+virtual_host_name, (host)=>{
        $scope.virtual_host = host
      });
    };
  }
}
