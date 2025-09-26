import Router from "sap/ui/core/routing/Router";
import BaseController from "../BaseController";
import { Route$MatchedEvent } from "sap/ui/core/routing/Route";
import Event from "sap/ui/base/Event";


export default class Employee extends BaseController {
  public onInit(): void {
    let oRouter = this.getRouter();
    oRouter?.getRoute("employee")?.attachMatched(this._onRouteMatched, this);
  }
  public getRouter(): Router {
    return super.getRouter();
  }
  public onNavBack(): void {
    super.onNavBack();
  }
  public _onRouteMatched(oEvent: Route$MatchedEvent): void {
    let oArgs = oEvent.getParameter("arguments") as { employeeId: string };
    let oView = this.getView();
    // bind the view to the object path, which is /Employees(<id>)
    oView?.bindElement({
      path: "/Employees(" + oArgs.employeeId + ")",
      events: {
        change: this._onBindingChange.bind(this),
        dataRequested(oEvent: Event) {
          oView.setBusy(true);
        },
        dataReceived(oEvent: Event) {
          oView.setBusy(false);
        },
      },
    });
  }
  public onShowResume(oEvent: Event): void {
    let oCtx = this.getView()?.getElementBinding()?.getBoundContext();
    this.getRouter().navTo("employeeResume", {
      employeeId: oCtx?.getProperty("EmployeeID"),
    });

  }
  private _onBindingChange(): void {
    // No data for the binding
    if (!this?.getView()?.getBindingContext()) {
      this?.getRouter()?.getTargets()?.display("notFound");
    }
  }
}
