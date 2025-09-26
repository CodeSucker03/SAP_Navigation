import Router from "sap/ui/core/routing/Router";
import BaseController from "../../BaseController";

export default class EmployeeOverview extends BaseController {
  public onInit(): void {}
  public onNavBack(): void {
    super.onNavBack();
  }
  public getRouter(): Router {
    return super.getRouter();
  }
}
