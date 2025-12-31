sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], function (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("ecommercehub.controller.ProductListing", {

        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("ProductListing").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched(oEvent) {
            const sQuery = decodeURIComponent(
                oEvent.getParameter("arguments").query
            );

            this._loadProducts(sQuery);
        },

        _loadProducts(sQuery) {
            const oList = this.byId("productList");
            const oBinding = oList.getBinding("items");
            // Server-side search (recommended)
            oBinding.changeParameters({
                $search: sQuery
            });
        },
        selectProduct(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sProductId = oContext.getProperty("ID");
            this.getOwnerComponent().getRouter().navTo("ProductDisplay", {
                productId: sProductId
            });
        }
    });
});
