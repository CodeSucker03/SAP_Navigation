import Router from "sap/ui/core/routing/Router";
import BaseController from "./BaseController";
import Target from "sap/ui/core/routing/Target";
import { Targets$DisplayEvent } from "sap/ui/core/routing/Targets";

export default class NotFound extends BaseController {
  public getRouter(): Router {
    return super.getRouter();
  }
  private _oData?: any; // store custom target data

  public onInit(): void {
    const oRouter: Router = this.getRouter();
    const oTarget = oRouter.getTargets();
    console.log(oTarget);
    // use arrow function to preserve `this`
    oTarget?.attachDisplay((oEvent: Targets$DisplayEvent) => {
      this._oData = oEvent.getParameter("data"); // store the data
      console.log(this._oData);
    });
  }

  public onNavBack(): void {
    // in some cases we could display a certain target when the back button is pressed
    if (this._oData && this._oData.fromTarget) {
      this.getRouter()?.getTargets()?.display(this._oData.fromTarget);
      delete this._oData.fromTarget;
      return;
    }
    // call the parent's onNavBack directly
    super.onNavBack();
  }
}
