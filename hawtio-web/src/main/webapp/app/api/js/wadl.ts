/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/workspace.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>
/// <reference path='helpers.ts'/>

module API {

  export function WadlViewController($scope, $location, jolokia) {

    $scope.url = $location.search()["wadl"];
    var log:Logging.Logger = Logger.get("API3");

    var wadlNamespace = "http://schemas.xmlsoap.org/wsdl/";

    loadXml($scope.url, onWsdl);

    function onWsdl(response) {
      $scope.apidocs = API.onWadlXmlLoaded(response);
      log.info("API docs: " + JSON.stringify($scope.apidocs, null, "  "));
      Core.$apply($scope);
    }
  }
}
