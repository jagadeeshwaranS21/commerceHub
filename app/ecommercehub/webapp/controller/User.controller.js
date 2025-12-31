sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("ecommercehub.controller.User", {
        onInit() {
            const customerCode = 'CUST-1001';
            const oModel = this.getOwnerComponent().getModel();
            const oContextBinding = oModel.bindContext(`/findCurrentUser(code='${customerCode}')`);
            oContextBinding.requestObject()
                .then((oUser) => {
                    const oUserModel = new JSONModel(oUser);
                    this.getView().setModel(oUserModel, "CurrentUser");
                    console.log("User:", oUser);
                })
                .catch((oError) => {
                    console.error("OData V4 error:", oError);
                });
        },backToHome : function () {
			this.getOwnerComponent().getTargets().display("TargetECommerceHub");
		}
    });
});