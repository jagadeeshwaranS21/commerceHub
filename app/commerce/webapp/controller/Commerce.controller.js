sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("commerce.app.commerce.controller.Commerce", {
        func:(oEvent) => {
                console.log("Data Changed");
                console.log("Changed:", oEvent.getParameter("path"));
            },
        onInit() {
            let userData = { name: "arun", age: 26 };
            const oModel = new JSONModel();
            oModel.setData(userData);
            oModel.attachPropertyChange(this.func);
            // oModel.setDefaultBindingMode('OneTime');
            this.getView().setModel(oModel, 'UserModel');
        }, changeData() {
            const oModel = this.getView().getModel('UserModel');
            oModel.setData({ name: 'arun B', age: 25 }, true);
            oModel.detachPropertyChange(this.func);
        }
    });
});