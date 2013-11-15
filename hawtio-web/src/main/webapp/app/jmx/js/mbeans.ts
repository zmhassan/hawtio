/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jquery.dynatree-1.2.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>
/// <reference path='../../core/js/workspace.ts'/>
/// <reference path='jmxHelpers.ts'/>

module Jmx {
  export function MBeansController($scope, $location: ng.ILocationService, workspace: Workspace) {

    $scope.$on("$routeChangeSuccess", function (event, current, previous) {
      // lets do this asynchronously to avoid Error: $digest already in progress
      setTimeout(updateSelectionFromURL, 50);

    });

    $scope.select = (node:DynaTreeNode) => {
      $scope.workspace.updateSelectionNode(node);
      Core.$apply($scope);
    };

    function updateSelectionFromURL() {
      updateTreeSelectionFromURL($location, $("#jmxtree"));
    }

    $scope.populateTree = () => {
      var treeElement = $("#jmxtree");
      $scope.tree = workspace.tree;
      enableTree($scope, $location, workspace, treeElement, $scope.tree.children, true);
      setTimeout(updateSelectionFromURL, 50);
    };

    $scope.$on('jmxTreeUpdated', $scope.populateTree);

    $scope.populateTree();
  }
}
