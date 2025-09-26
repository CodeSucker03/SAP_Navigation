import Router from "sap/ui/core/routing/Router";
import BaseController from "./BaseController";

export default class Home extends BaseController {
  public onInit(): void {}
  public getRouter(): Router {
    return super.getRouter();
  }
  public onDisplayNotFound(): void {
    //display the "notFound" target without changing the hash
    this.getRouter()?.getTargets()?.display("notFound", {
      fromTarget: "home",
    });
  }
  public onNavToEmployees(): void {
    // nav to name of route "employeeList" in manifest.json
    this.getRouter()?.navTo("employeeList");
  }
  public onNavToEmployeeOverview(): void {
    this.getRouter()?.navTo("employeeOverview");
  }
}
