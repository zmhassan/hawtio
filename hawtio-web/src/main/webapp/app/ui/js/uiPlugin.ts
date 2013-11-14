/// <reference path='../../core/js/corePlugin.ts'/>
/// <reference path='helpers.ts'/>
/// <reference path='autoColumns.ts'/>
/// <reference path='autoDropDown.ts'/>
/// <reference path='colorPickerDirective.ts'/>
/// <reference path='confirmDialogDirective.ts'/>
/// <reference path='editablePropertyDirective.ts'/>
/// <reference path='editorDirective.ts'/>
/// <reference path='expandableDirective.ts'/>
/// <reference path='fileUpload.ts'/>
/// <reference path='gridster.ts'/>
/// <reference path='helpers.ts'/>
/// <reference path='jsPlumbDirective.ts'/>
/// <reference path='panels.ts'/>
/// <reference path='row.ts'/>
/// <reference path='slideoutDirective.ts'/>
/// <reference path='tablePager.ts'/>
/// <reference path='templatePopover.ts'/>
/// <reference path='viewport.ts'/>
/// <reference path='zeroclipboard.ts'/>

module UI {

  export var pluginName = 'hawtio-ui';

  export var templatePath = 'app/ui/html/';

  angular.module(UI.pluginName, ['bootstrap', 'ngResource', 'hawtioCore', 'ui', 'ui.bootstrap']).
      config( ($routeProvider) => {
        $routeProvider.
            when('/ui/test', {templateUrl: templatePath + 'test.html'})
      }).
      directive('hawtioConfirmDialog', function() {
        return new UI.ConfirmDialog();
      }).
      directive('hawtioSlideout', function() {
        return new UI.SlideOut();
      }).
      directive('hawtioPager', function() {
        return new UI.TablePager();
      }).
      directive('hawtioEditor', function($parse) {
        return UI.Editor($parse);
      }).directive('hawtioColorPicker', function() {
        return new UI.ColorPicker()
      }).directive('hawtioFileUpload', () => {
        return new UI.FileUpload();
      }).directive('expandable', () => {
        return new UI.Expandable();
      }).directive('gridster', () => {
        return new UI.GridsterDirective();
      }).directive('editableProperty', ($parse) => {
        return new UI.EditableProperty($parse);
      }).directive('hawtioViewport', () => {
        return new UI.ViewportHeight();
      }).directive('hawtioHorizontalViewport', () => {
        return new UI.HorizontalViewport();
      }).directive('hawtioRow', () => {
        return new UI.DivRow();
      }).directive('hawtioJsplumb', () => {
        return new UI.JSPlumb();
      //}).directive('connectTo', () => {
      //  return new UI.JSPlumbConnection();
      }).directive('zeroClipboard', ($parse) => {
        return UI.ZeroClipboardDirective($parse);
      }).directive('hawtioAutoDropdown', () => {
        return UI.AutoDropDown;
      }).directive('hawtioMessagePanel', () => {
        return new UI.MessagePanel();
      }).directive('hawtioInfoPanel', () => {
        return new UI.InfoPanel();
      }).directive('hawtioAutoColumns', () => {
        return new UI.AutoColumns();
      }).directive('hawtioTemplatePopover', ($templateCache, $compile, $document) => {
        return UI.TemplatePopover($templateCache, $compile, $document);
      }).run(function (helpRegistry) {

        helpRegistry.addDevDoc("ui1", 'app/ui/doc/developerPage1.md');
        helpRegistry.addDevDoc("ui2", 'app/ui/doc/developerPage2.md');
      });

  hawtioPluginLoader.addModule(pluginName);

}
