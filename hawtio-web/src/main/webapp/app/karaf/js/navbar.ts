/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>
/// <reference path='../../core/js/workspace.ts'/>
/// <reference path='karafHelpers.ts'/>

module Karaf {

  export function NavBarController($scope, workspace:Workspace) {

    $scope.hash = workspace.hash();

    $scope.isKarafEnabled = workspace.treeContainsDomainAndProperties("org.apache.karaf")
    $scope.isFeaturesEnabled = Karaf.getSelectionFeaturesMBean(workspace);
    $scope.isScrEnabled = Karaf.getSelectionScrMBean(workspace);

    $scope.$on('$routeChangeSuccess', () => {
      $scope.hash = workspace.hash();
    });

    $scope.isActive = (nav) => {
      return workspace.isLinkActive(nav);
    };
  }
}
