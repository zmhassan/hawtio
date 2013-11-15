/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/workspace.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>
/// <reference path='camelHelpers.ts'/>

module Camel {

  export function PropertiesController($scope, workspace:Workspace) {
    $scope.viewTemplate = null;
    $scope.schema = _apacheCamelModel;

    $scope.$on("$routeChangeSuccess", function (event, current, previous) {
      // lets do this asynchronously to avoid Error: $digest already in progress
      setTimeout(updateData, 50);
    });

    $scope.$watch('workspace.selection', function () {
      if (workspace.moveIfViewInvalid()) return;
      updateData();
    });

    function updateData() {
      var routeXmlNode = getSelectedRouteNode(workspace);
      $scope.nodeData = getRouteNodeJSON(routeXmlNode);

      if (routeXmlNode) {
        var nodeName = routeXmlNode.nodeName;
        $scope.model = getCamelSchema(nodeName);

        if ($scope.model) {
          console.log("data is: " + JSON.stringify($scope.nodeData, null, "  "));
          console.log("model schema is: " + JSON.stringify($scope.model, null, "  "));

          $scope.viewTemplate = "app/camel/html/nodePropertiesView.html";
        }
      }
    }
  }
}



