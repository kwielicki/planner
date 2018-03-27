angular
    .module('weddingPlanner')
	.directive("imageChange", function ($timeout) {
    return {
        restrict: "A",
        scope: {},
        link: function (scope, element, attrs) {
            element.on("load", function () {
                element.removeClass("ng-hide-fade");
                element.addClass("ng-show-fade");
                element.parent().addClass('img-loaded');
            });
            attrs.$observe("ngSrc", function () {
                element.parent().removeClass('img-loaded');
                element.removeClass("ng-show-fade");
                element.addClass("ng-hide-fade");
            });
        }
    }
});