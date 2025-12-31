sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("ecommercehub.controller.ProductDisplay", {
        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("ProductDisplay").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched(oEvent) {
            const sProductId = oEvent.getParameter("arguments").productId;
            console.log("Received Product ID:", sProductId);
            this._loadProduct(sProductId);
        },

        _loadProduct(sProductId) {
            const oModel = this.getOwnerComponent().getModel();

            const oContextBinding = oModel.bindContext(
                `/Products('${sProductId}')?$expand=variants($expand=stocks)`
            );

            oContextBinding.requestObject()
                .then((oProduct) => {
                    this.getView().setModel(
                        new sap.ui.model.json.JSONModel(oProduct.variants),
                        "variants"
                    );
                    console.log(oProduct.variants);
                });
        },backToHome : function () {
			this.getOwnerComponent().getTargets().display("TargetECommerceHub");
		}        
    });
});