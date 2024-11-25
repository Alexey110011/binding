/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblessons/bindingsEditable/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblessons/bindingsEditable/test/integration/pages/Worklist",
	"zjblessons/bindingsEditable/test/integration/pages/Object",
	"zjblessons/bindingsEditable/test/integration/pages/NotFound",
	"zjblessons/bindingsEditable/test/integration/pages/Browser",
	"zjblessons/bindingsEditable/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblessons.bindingsEditable.view."
	});

	sap.ui.require([
		"zjblessons/bindingsEditable/test/integration/WorklistJourney",
		"zjblessons/bindingsEditable/test/integration/ObjectJourney",
		"zjblessons/bindingsEditable/test/integration/NavigationJourney",
		"zjblessons/bindingsEditable/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});