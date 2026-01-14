sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("ecommercehub.controller.Checkout", {
        onInit() {
            const oModel = this.getOwnerComponent().getModel('CurrentUser');
            const oRoute = this.getOwnerComponent().getRouter();
            oRoute.getRoute("Checkout").attachPatternMatched(this._loadCart, this);
        }, backToHome: function () {
            this.getOwnerComponent().getTargets().display("TargetECommerceHub");
        }, _loadCart(oEvent) {
            const cartId = oEvent.getParameter("arguments").cartId;
            const oModel = this.getOwnerComponent().getModel();
            const oBinding = oModel.bindContext(`/Carts(${cartId})`);
            console.log("Cart ID In checkout");
            oBinding.requestObject()
                .then((cart) => {
                    console.log(cart);
                    this.getView().setModel(
                        new sap.ui.model.json.JSONModel(cart),
                        "cart"
                    );
                });
        }
    });
});