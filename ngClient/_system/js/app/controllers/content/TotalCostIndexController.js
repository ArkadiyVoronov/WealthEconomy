﻿(function () {
    'use strict';

    var controllerId = 'TotalCostIndexController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'dataContext', '$scope', 'logger', TotalCostIndexController]);

    function TotalCostIndexController(resourcePoolFactory, dataContext, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.existingModelConfig = { userName: 'sample', resourcePoolKey: 'Total-Cost-Index-Existing-Model' };
        vm.newModelConfig = { userName: 'sample', resourcePoolKey: 'Total-Cost-Index-New-Model' };

        // Listen resource pool updated event
        $scope.$on('resourcePoolEditor_elementMultiplierIncreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierDecreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierReset', updateOppositeResourcePool);

        function updateOppositeResourcePool(event, element) {

            var oppositeKey = null;

            if (element.ResourcePool.User.UserName === vm.existingModelConfig.userName && element.ResourcePool.Key === vm.existingModelConfig.resourcePoolKey) {
                oppositeKey = vm.newModelConfig;
            } else if (element.ResourcePool.User.UserName === vm.existingModelConfig.userName && element.ResourcePool.Key === vm.newModelConfig.resourcePoolKey) {
                oppositeKey = vm.existingModelConfig;
            }

            // Call the service to increase the multiplier
            if (oppositeKey !== null) {
                resourcePoolFactory.getResourcePoolExpanded(oppositeKey)
                    .then(function (resourcePool) {

                        switch (event.name) {
                            case 'resourcePoolEditor_elementMultiplierIncreased': {
                                dataContext.updateElementMultiplier(resourcePool.mainElement(), 'increase');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierDecreased': {
                                dataContext.updateElementMultiplier(resourcePool.mainElement(), 'decrease');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierReset': {
                                dataContext.updateElementMultiplier(resourcePool.mainElement(), 'reset');
                                break;
                            }
                        }

                        dataContext.saveChanges(1500);
                    });
            }
        }
    }
})();
