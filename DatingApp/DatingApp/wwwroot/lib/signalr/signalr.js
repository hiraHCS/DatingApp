(function () {
    'use strict';

    angular
        .module('app')
        .directive('signalr', signalr);

    signalr.$inject = ['$window'];

    function signalr($window) {
        // Usage:
        //     <signalr></signalr>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();