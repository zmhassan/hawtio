/// <reference path='../../definitions/DefinitelyTyped/angularjs/angular.d.ts'/>
/// <reference path='../../definitions/DefinitelyTyped/jquery/jquery.d.ts'/>
/// <reference path='../../definitions/jolokia-1.0.d.ts'/>
/// <reference path='../../definitions/logger.d.ts'/>
/// <reference path='../../definitions/sugar-1.3.d.ts'/>
/// <reference path='../../core/js/workspace.ts'/>
/// <reference path='../../core/js/coreHelpers.ts'/>

module ActiveMQ {

  export var log:Logging.Logger = Logger.get("activemq");

  export function getSelectionQueuesFolder(workspace) {
    function findQueuesFolder(node) {
      if (node) {
        if (node.title === "Queues" || node.title === "Queue") {
          return node;
        }
        var parent = node.parent;
        if (parent) {
          return findQueuesFolder(parent);
        }
      }
      return null;
    }


    var selection = workspace.selection;
    if (selection) {
      return findQueuesFolder(selection);
    }
    return null;
  }
}
