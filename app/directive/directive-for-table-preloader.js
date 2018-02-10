/*
 * @TODO zaimplementować w lepszy sposob
 */
weddingPlanner.directive('direTablePreloader', function() {
  return function(scope, element, attrs) {
      if (scope.$last) {
            $('.js-preloader').addClass('is--done').fadeOut('fast', function() {
                $(this).remove();
            });
            if (element.parent().hasClass('has--preloader')) {
                element.parent().animate({
                    opacity: 'toggle',
                    height: 'toggle'
                }, function() {
                    $(this).removeClass('has--preloader');
                });
            }
        }
    }
});
