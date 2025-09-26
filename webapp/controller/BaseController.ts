import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import Router from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";

export default class BaseController extends Controller {
  //   public onInit(): void | undefined {}
  public getRouter(): Router {
    return UIComponent.getRouterFor(this);
  }
  public onNavBack(): void {
    console.log("onNavBack fired!");
    let oHistory, sPreviousHash;

    oHistory = History.getInstance();
    sPreviousHash = oHistory.getPreviousHash();

    if (sPreviousHash !== undefined) {
      window.history.go(-1);
    } else {
      //   const router = UIComponent.getRouterFor(this);
      //   router.navTo("appHome", {}, true);
      this.getRouter().navTo("appHome", {}, true /*no history*/);
    }
  }
}
