/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>
/// <reference path='../../core/js/workspace.ts'/>
/// <reference path='karafHelpers.ts'/>


module Karaf {

    export function ScrComponentController($scope, $location, workspace, jolokia, $routeParams) {

        $scope.name = $routeParams.name;
        populateTable();



        function populateTable() {
            $scope.row = getComponentByName(workspace, jolokia, $scope.name);
            Core.$apply($scope);
        }

        $scope.activate = () => {
            activateComponent(workspace, jolokia, $scope.row['Name'], function () {
                console.log("Activated!")
            }, function () {
                console.log("Failed to activate!")
            });
        };

        $scope.deactivate = () => {
            deactivateComponent(workspace, jolokia, $scope.row['Name'], function () {
                console.log("Deactivated!")
            }, function () {
                console.log("Failed to deactivate!")
            });
        };
    }
}
