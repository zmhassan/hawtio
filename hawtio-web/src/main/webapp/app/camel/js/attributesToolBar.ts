/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/workspace.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>
/// <reference path='camelHelpers.ts'/>

module Camel {

  export function AttributesToolBarController($scope, workspace:Workspace, jolokia) {

    $scope.deleteDialog = false

    $scope.start = () => {
      $scope.invokeSelectedMBeans((item) => {
        return isState(item, "suspend") ? "resume()" :"start()";
      });
    };

    $scope.pause = () => {
      $scope.invokeSelectedMBeans("suspend()");
    };

    $scope.stop = () => {
      $scope.invokeSelectedMBeans("stop()", () => {
        // lets navigate to the parent folder!
        // as this will be going way
        workspace.removeAndSelectParentNode();
      });
    };

    /**
     * Only for routes!
     */
    $scope.delete = () => {
      $scope.invokeSelectedMBeans("remove()", () => {
        // force a reload of the tree
        $scope.workspace.operationCounter += 1;
        Core.$apply($scope);
      });
    };

    $scope.anySelectionHasState = (state) => {
      var selected = $scope.selectedItems || [];
      return selected.length && selected.any((s) => isState(s, state));
    };

    $scope.everySelectionHasState = (state) => {
      var selected = $scope.selectedItems || [];
      return selected.length && selected.every((s) => isState(s, state));
    };
  }
}
