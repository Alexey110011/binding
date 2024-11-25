/*global location history */
sap.ui.define([
		"zjblessons/bindingsEditable/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/bindingsEditable/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/Input",
		"sap/m/ColumnListItem",
		"sap/m/ObjectIdentifier",
		"sap/base/util/deepExtend"
	], function (BaseController, JSONModel, formatter, Filter, FilterOperator,Input, ColumnListItem, ObjectIdentifier, deepExtend) {
		"use strict";

		return BaseController.extend("zjblessons.bindingsEditable.controller.Worklist", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			onInit : function (evt) {
				
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");
					var oReadOnlyTemplate = new ColumnListItem({
						highlight: `${"{Description}"==='333'}`?'Error':'Success',
						cells:[
							new sap.m.ObjectIdentifier({
								title:"{DocumentNumber}"
							}),
							new sap.m.Text({
								text:"{DocumentDate}"
								}),
							new sap.m.Text({
								text:"{PlantText}"
								}),
							new sap.m.Text({
								text:"{RegionText}"
								}),
							new sap.m.Text({
								text:"{Description}"
							}),
							new sap.m.Text({
								text:"{Created}"
								})
							]
					});
					
					this.byId("table").bindItems({
				 		path:'/zjblessons_base_Headers',
				 		template:oReadOnlyTemplate
			 		});
					//console.log("Info", oTable.getBindingInfo("items").template)
					//console.log(oReadOnlyTemplate);
					/*var oEditableTemplate = new ColumnListItem({
						cells:[
							new sap.m.ObjectIdentifier({
								title:"{DocumentNumber}"
							}),
							new sap.m.Text({
								text:"{DocumentDate}"
								}),
							new Input({
								value:"{PlantText}"
								}),
							new Input({
								value:"{RegionText}"
								}),
							new Input({
								value:"{Description}"
							}),
							new Input({
								value:"{Created}",
								change:	function(oEvent){
									var sPath = oEvent.getSource().getBindingContext().sPath;
									var currentValue = oEvent.getParameter("value");
			 						oModel.setProperty(sPath +"/Description", currentValue);
			 						console.log(oModel.hasPendingChanges());
			 						}
								})
							]
					});*/
					
					//this.rebindTable(oReadOnlyTemplate, "Navigation");
				// Put down worklist table's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the table is
				// taken care of by the table itself.
				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
				// keeps the search state
				this._aTableSearchState = [];

				// Model used to manipulate control states
				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "worklistView");
				
			
				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oTable.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for worklist's table
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Triggered by the table's 'updateFinished' event: after new table
			 * data is available, this handler method updates the table counter.
			 * This should only happen if the update was successful, which is
			 * why this handler is attached to 'updateFinished' and not to the
			 * table's list binding's 'dataReceived' method.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			 /*rebindTable : function (oTemplate, sKeyboardMode){
			 	var oTable  = this.byId("table");
			 	oTable.bindItems({
			 		path:'/zjblessons_base_Headers',
			 		template:oTemplate,
			 		templateShareable:true,
			 		key:'DocumentNumber'
			 	});
			 },*/
			
			 onEdit : function(){
			 	var oModel = this.getView().getModel();
			 		 var oEditableTemplate = new ColumnListItem({
						cells:[
							new sap.m.ObjectIdentifier({
								title:"{DocumentNumber}"
							}),
							new sap.m.Text({
								text:"{DocumentDate}"
								}),
							new Input({
								value:"{PlantText}"
								}),
							new Input({
								value:"{RegionText}"
								}),
							new Input({
								value:"{Description}",
								change:	function(oEvent){
									var sPath = oEvent.getSource().getBindingContext().sPath;
									var currentValue = oEvent.getParameter("value");
			 						oModel.setProperty(sPath +"/Description", currentValue);
			 						//console.log(oModel.hasPendingChanges());
			 						}
							}),
							new Input({
								value:"{Created}"
								})
							]
					});
			 	this.byId("table").bindItems({
			 		path:'/zjblessons_base_Headers',
			 		template:oEditableTemplate
			 	});
			 		
			 	//this.aProductCollection = deepExtend([], /*this.*/oModel.getProperty("oData/results"));
			 	this.byId("edit_button").setVisible (false);
			 	this.byId("save_button").setVisible (true);
			 	this.byId("cancel_button").setVisible (true);
			 	//this.rebindTable(this.oEditableTemplate, "Edit");
			 },
			 
			 /*showModel :function(oModel,oEvent){
			 	//var oModel = this.getView().getModel()
				var sPath = oEvent.getSource().getBindingContext().sPath;
				var currentValue = oEvent.getParameter('value')
			 	oModel.setProperty(sPath +'/Description', currentValue)
			 	console.log(oModel.hasPendingChanges())
			},*/
			 
			 onSave : function(){
			 	var oModel = this.getView().getModel()
			 	if(oModel.hasPendingChanges()){
			 		oModel.submitChanges({
			 			success:function(oData){
			 				console.log("Success", oData)
			 			},
			 			error:function(oError){
			 				console.log("Success", oData)
			 			}
			 		});
			 	}
			 	var oReadonlyTemplate = new ColumnListItem({
						cells:[
							new ObjectIdentifier({
								title:"{DocumentNumber}"
							}),
							new sap.m.Text({
								text:"{DocumentDate}"
								}),
							new sap.m.Text({
								text:"{PlantText}"
								}),
							new sap.m.Text({
								text:"{RegionText}"
								}),
							new sap.m.Text({
								text:"{Description}"
							}),
							new sap.m.Text({
								text:"{Created}"
								})
							]
					});
			 	//this.aProductCollection = deepExtend([], /*this.*/oModel.getProperty("oData/results"));
			 	this.byId("save_button").setVisible (false);
			 	this.byId("cancel_button").setVisible (false);
			 	this.byId("edit_button").setVisible (true);
			 	/*this.rebindTable(this.oEditableTemplate, "Navigation")*/
			 		this.byId("table").bindItems({
			 		path:'/zjblessons_base_Headers',
			 		template:oReadonlyTemplate
			 	});
			 	/*oModel.resetChanges({
			 		success:function(oData){console.log(oData)},
			 		error:function(oError){console.log(oError)}
				})*/
			 },
			 
			 onCancel : function(){
			 	var oModel = this.getView().getModel()
			 //	this.aProductCollection = deepExtend([], /*this.*/oModel.getProperty("oData/results"));
			 	if(oModel.hasPendingChanges()){
			 		oModel.resetChanges({
			 			success:function(oData){
			 				console.log("Success", oData)
			 			},
			 			error:function(oError){
			 				console.log("Success", oData)
			 			}
			 		});
			 	}
			 	var oReadonlyTemplate = new ColumnListItem({
						cells:[
							new sap.m.ObjectIdentifier({
								title:"{DocumentNumber}"
							}),
							new sap.m.Text({
								text:"{DocumentDate}"
								}),
							new sap.m.Text({
								text:"{PlantText}"
								}),
							new sap.m.Text({
								text:"{RegionText}"
								}),
							new sap.m.Text({
								text:"{Description}"
							}),
							new sap.m.Text({
								text:"{Created}"
								})
							]
					});
			 	this.byId("edit_button").setVisible (true);
			 	this.byId("save_button").setVisible (false);
			 	this.byId("cancel_button").setVisible (false);
			 	//this.oModel.setProperty("oData/results", this.aProductCollection);
			 	//this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			 	this.byId("table").bindItems({
			 		path:'/zjblessons_base_Headers',
			 		template:oReadonlyTemplate
			 	});
			 },
			
			onUpdateFinished : function (oEvent) {
				// update the worklist's object counter after the table update
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				// only update the counter if the length is final and
				// the table is not empty
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},

			/**
			 * Event handler when a table item gets pressed
			 * @param {sap.ui.base.Event} oEvent the table selectionChange event
			 * @public
			 */
			onPress : function (oEvent) {
				// The source is the list item that got pressed
				this._showObject(oEvent.getSource());
			},

			/**
			 * Event handler for navigating back.
			 * We navigate back in the browser historz
			 * @public
			 */
			onNavBack : function() {
				history.go(-1);
			},


			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
				} else {
					var aTableSearchState = [];
					var sQuery = oEvent.getParameter("query");

					if (sQuery && sQuery.length > 0) {
						aTableSearchState = [new Filter("DocumentNumber", FilterOperator.Contains, sQuery)];
					}
					this._applySearch(aTableSearchState);
				}

			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				var oTable = this.byId("table");
				oTable.getBinding("items").refresh();
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Shows the selected item on the object page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showObject : function (oItem) {
				this.getRouter().navTo("object", {
					objectId: oItem.getBindingContext().getProperty("HeaderID")
				});
			},

			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
			 * @private
			 */
			_applySearch: function(aTableSearchState) {
				var oTable = this.byId("table"),
					oViewModel = this.getModel("worklistView");
				oTable.getBinding("items").filter(aTableSearchState, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (aTableSearchState.length !== 0) {
					oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
				}
			}

		});
	}
);