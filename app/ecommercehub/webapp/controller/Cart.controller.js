sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("ecommercehub.controller.Cart", {
        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Cart").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched(oEvent) {
            const customerCode = oEvent.getParameter("arguments").customerCode;
            console.log("Received customerCode:", customerCode);
            this._loadCart(customerCode);
        },

        _loadCart(customerCode) {
            const oModel = this.getOwnerComponent().getModel();

            const oContextBinding = oModel.bindContext(
                `/findCurrentUserCart?code=${customerCode}`
            );

            oContextBinding.requestObject()
                .then((cart) => {
                    this.getView().setModel(
                        new sap.ui.model.json.JSONModel(cart.cartItem),
                        "cartItem"
                    );
                    this.getView().setModel(
                        new sap.ui.model.json.JSONModel(cart),
                        "cart"
                    );
                    console.log(cart);
                });
        }
    });
});