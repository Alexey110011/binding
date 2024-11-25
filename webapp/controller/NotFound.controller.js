sap.ui.define([
		"zjblessons/bindingsEditable/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblessons.bindingsEditable.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);