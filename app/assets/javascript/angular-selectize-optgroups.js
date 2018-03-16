// /**
//  * Angular Selectize2
//  * https://github.com/machineboy2045/angular-selectize
//  **/
//
// angular.module('optselect', []).value('selectizeConfig', {}).directive("optselect", ['selectizeConfig', function(selectizeConfig) {
//     return {
//         restrict: 'EA',
//         require: '^ngModel',
//         scope: {ngModel: '=', config: '=?', options: '=?', optgroups: '=?', ngDisabled: '=', ngRequired: '&'},
//         link: function(scope, element, attrs, modelCtrl) {
//
//             Selectize.defaults.maxItems = null; //default to tag editor
//
//             var selectize,
//                 config = angular.extend({}, Selectize.defaults, selectizeConfig, scope.config);
//
//             modelCtrl.$isEmpty = function(val){
//                 return (val === undefined || val === null || !val.length); //override to support checking empty arrays
//             };
//
//             function createItem(input) {
//                 var data = {};
//                 data[config.labelField] = input;
//                 data[config.valueField] = input;
//                 return data;
//             }
//
//             function createGroup(input) {
//                 var data = {};
//                 data[config.optgroupField] = input;
//                 data[config.optgroupLabelField] = input;
//                 data[config.optgroupValueField] = input;
//                 return data;
//             }
//
//             function toggle(disabled){
//                 disabled ? selectize.disable() : selectize.enable();
//             }
//
//             var validate = function() {
//                 var isInvalid = (scope.ngRequired() || attrs.required || config.required) && modelCtrl.$isEmpty(scope.ngModel);
//                 modelCtrl.$setValidity('required', !isInvalid);
//             };
//
//             function generateOptions(data){
//                 if(!data)
//                     return [];
//
//                 data = angular.isArray(data) ? data : [data];
//
//                 return $.map(data, function(opt){
//                     return typeof opt === 'string' ? createItem(opt) : opt;
//                 });
//             }
//
//             function generateGroups(data){
//                 if(!data)
//                     return [];
//
//                 data = angular.isArray(data) ? data : [data];
//
//                 return $.map(data, function(grp){
//                     return typeof grp === 'string' ? createGroup(grp) : grp;
//                 });
//             }
//
//             function updateSelectize(){
//                 validate();
//
//                 selectize.$control.toggleClass('ng-valid', modelCtrl.$valid);
//                 selectize.$control.toggleClass('ng-invalid', modelCtrl.$invalid);
//                 selectize.$control.toggleClass('ng-dirty', modelCtrl.$dirty);
//                 selectize.$control.toggleClass('ng-pristine', modelCtrl.$pristine);
//
//                 if( !angular.equals(selectize.items, scope.ngModel) ){
//                     selectize.addOption(generateOptions(scope.ngModel));
//                     selectize.setValue(scope.ngModel);
//                 }
//
//                 if( !angular.equals(selectize.optgroups, scope.ngModel) ){
//                     selectize.addOptionGroup(generateGroups(scope.ngModel));
//                     selectize.setValue(scope.ngModel);
//                 }
//             }
//
//             var onChange = config.onChange,
//                 onOptionAdd = config.onOptionAdd,
//                 onOptionGroupAdd = config.onOptionGroupAdd;
//
//             config.onChange = function(){
//                 if( !angular.equals(selectize.items, scope.ngModel) )
//                     scope.$evalAsync(function(){
//                         var value = selectize.items.slice();
//                         if (config.maxItems == 1) {
//                             value = value[0];
//                         }
//                         modelCtrl.$setViewValue( value );
//                     });
//
//                 if (onChange) {
//                     onChange.apply(this, arguments);
//                 }
//             };
//
//             config.onOptionAdd = function(value, data) {
//                 if( scope.options.indexOf(data) === -1 )
//                     scope.options.push(data);
//
//                 if (onOptionAdd) {
//                     onOptionAdd.apply(this, arguments);
//                 }
//             };
//
//             config.onOptionGroupAdd = function(id, data) {
//                 if( scope.optgroups.indexOf(data) === -1 )
//                     scope.optgroups.push(data);
//
//                 if (onOptionGroupAdd) {
//                     onOptionGroupAdd.apply(this, arguments);
//                 }
//             };
//
//             // ngModel (ie selected items) is included in this because if no options are specified, we
//             // need to create the corresponding options for the items to be visible
//             scope.options = generateOptions( (scope.options || config.options || scope.ngModel).slice() );
//             scope.optgroups = generateGroups( (scope.optgroups || config.optgroups || scope.ngModel).slice() );
//
//             var angularCallback = config.onInitialize;
//
//             config.onInitialize = function(){
//                 selectize = element[0].selectize;
//                 selectize.addOption(scope.options);
//                 selectize.addOptionGroup(scope.optgroups);
//                 selectize.setValue(scope.ngModel);
//
//                 //provides a way to access the selectize element from an
//                 //angular controller
//                 if(angularCallback){
//                     angularCallback(selectize);
//                 }
//
//                 scope.$watch('options', function(){
//                     selectize.clearOptions();
//                     selectize.addOption(scope.options);
//                     selectize.setValue(scope.ngModel);
//                 }, true);
//
//                 scope.$watch('optgroups', function(){
//                     selectize.clearOptionGroups();
//                     selectize.addOptionGroup(scope.optgroups);
//                     selectize.setValue(scope.ngModel);
//                 }, true);
//
//                 scope.$watch('ngModel', updateSelectize);
//                 scope.$watch('ngDisabled', toggle);
//             };
//
//             element.selectize(config);
//
//             element.on('$destroy', function() {
//                 if (selectize) {
//                     selectize.destroy();
//                     element = null;
//                 }
//             });
//
//         }
//     };
// }]);
