module Fabric {

  export function FabricBrokersController($scope, localStorage, $routeParams, $location, jolokia, workspace, $compile, $templateCache) {

    Fabric.initScope($scope, $location, jolokia, workspace);

    $scope.maps = {
      group: {},
      profile: {},
      broker: {},
      container: {}
    };

    $scope.showBroker = (broker) => {
      var path = Fabric.profileLink(workspace, jolokia, localStorage, broker.version, broker.profile);
      path += "/org.fusesource.mq.fabric.server-" + broker.id + ".properties";
      $location.path(path);
    };

    $scope.createBroker = (group) => {
      var args = {};
      if (group) {
        var profileId = group["profile"];
        if (profileId) {
          args["profile"] = profileId;
        }
        var groupId = group["id"];
        if (groupId) {
          args["group"] = groupId;
        }
      }
      $location.url("/fabric/createBroker").search(args);
    };

    function matchesFilter(text) {
      var filter = $scope.searchFilter;
      return !filter || (text && text.has(filter));
    }

    $scope.groupMatchesFilter = (group) => {
      return matchesFilter(group.id) ||
              group.profiles.find((item) => $scope.profileMatchesFilter(item));
    };

    $scope.profileMatchesFilter = (profile) => {
      return matchesFilter(profile.id) || matchesFilter(profile.group) ||
              matchesFilter(profile.version) ||
              profile.brokers.find((item) => $scope.brokerMatchesFilter(item));
    };

    $scope.brokerMatchesFilter = (broker) => {
      return matchesFilter(broker.id) || matchesFilter(broker.group) ||
              matchesFilter(broker.version) ||
              broker.containers.find((item) => $scope.containerMatchesFilter(item));
    };

    $scope.containerMatchesFilter = (container) => {
      return matchesFilter(container.id) || matchesFilter(container.group) ||
              matchesFilter(container.profile) || matchesFilter(container.version) || matchesFilter(container.brokerName) ||
              (container.master && $scope.searchFilter && $scope.searchFilter.has("master"));
    };

    if (Fabric.hasMQManager) {
      Core.register(jolokia, $scope, {type: 'exec', mbean: Fabric.mqManagerMBean, operation: "loadBrokerStatus()"}, onSuccess(onBrokerData));
    }

    function onBrokerData(response) {

      if (response) {

        var responseJson = angular.toJson(response.value);
        if ($scope.responseJson === responseJson) {
          return;
        }

        $scope.responseJson = responseJson;

        var brokers = response.value;

        function findByIdOrCreate(collection, id, map, fn) {
          var value = collection.find({"id": id});
          if (!value) {
            value = fn();
            value["id"] = id;
            collection.push(value);

            var old = map[id];
            // copy any view related across
            value["expanded"] = old ? old["expanded"] : true;
            map[id] = value;
          }
          return value;
        }

        $scope.groups = [];
        var maps = $scope.maps;

        angular.forEach(brokers, (brokerStatus) => {
          var groupId = brokerStatus.group || "Unknown";
          var profileId = brokerStatus.profile || "Unknown";
          var brokerId = brokerStatus.brokerName || "Unknown";
          var containerId = brokerStatus.container;
          var versionId = brokerStatus.version || "1.0";

          var group = findByIdOrCreate($scope.groups, groupId, maps.group, () => {
            return {
              profiles: []
            };
          });
          var profile = findByIdOrCreate(group.profiles, profileId, maps.profile, () => {
            return {
              group: groupId,
              version: versionId,
              requirements: {
                minimumInstances: brokerStatus.minimumInstances
              },
              brokers: [],
              containers: []
            };
          });
          var broker = findByIdOrCreate(profile.brokers, brokerId, maps.broker, () => {
            return {
              group: groupId,
              profile: profileId,
              version: versionId,
              containers: []
            };
          });
          if (containerId) {
            var container = findByIdOrCreate(broker.containers, containerId, maps.container, () => {
              return brokerStatus;
            });
            profile.containers.push(container);
          }
        });

        // update the stats
        angular.forEach($scope.groups, (group) => {

          angular.forEach(group.profiles, (profile) => {

            angular.forEach(profile.brokers, (broker) => {
              broker.containers = broker.containers.sortBy((c) => {
                return c.id;
              });
            });

            profile.containers = profile.containers.sortBy((c) => { return c.id; });

            var count = profile.containers.length;
            profile.requireStyle = Fabric.containerCountBadgeStyle(profile.requirements.minimumInstances, count);
            profile.count = count;
          });
        });

        Core.$apply($scope);
      }
    }
  }
}