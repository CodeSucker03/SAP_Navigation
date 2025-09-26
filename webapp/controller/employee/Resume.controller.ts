import Router from "sap/ui/core/routing/Router";
import BaseController from "../BaseController";
import { Route$MatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";
import Event from "sap/ui/base/Event";
import { IconTabBar$SelectEvent } from "sap/m/IconTabBar";

export default class Resume extends BaseController {
  public onInit(): void {
    let oRouter = this.getRouter();
    this.getView()?.setModel(new JSONModel(), "view");
    oRouter
      ?.getRoute("employeeResume")
      ?.attachMatched(this._onRouteMatched, this);
  }
  public getRouter(): Router {
    return super.getRouter();
  }
  public onNavBack(): void {
    super.onNavBack();
  }
  public _onRouteMatched(oEvent: Route$MatchedEvent): void {
    let _aValidTabKeys: string[] = ["Info", "Projects", "Hobbies", "Notes"];
  
    let oArgs = oEvent.getParameter("arguments") as RouteArgs;
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
    let oQuery = oArgs["?query"];
    if (oQuery && _aValidTabKeys.indexOf(oQuery.tab as string) > -1) {
      let jsonViewModel = oView?.getModel("view") as JSONModel;
      jsonViewModel.setProperty("/selectedTabKey", oQuery.tab);
      // support lazy loading for the hobbies and notes tab
      if (oQuery.tab === "Hobbies" || oQuery.tab === "Notes") {
        // the target is either "resumeTabHobbies" or "resumeTabNotes"
        this.getRouter()?.getTargets()
          ?.display("resumeTab" + oQuery.tab);
      }
    } else {
      // the default query param should be visible at all time
      this.getRouter().navTo(
        "employeeResume",
        {
          employeeId: oArgs.employeeId,
          "?query": {
            tab: _aValidTabKeys[0],
          },
        },
        true /*no history*/
      );
    }
  }
  private _onBindingChange(): void {
    // No data for the binding
    if (!this?.getView()?.getBindingContext()) {
      this?.getRouter()?.getTargets()?.display("notFound");
    }
  }
  public onTabSelect(oEvent: IconTabBar$SelectEvent): void {
    let oCtx = this.getView()?.getBindingContext();
    this.getRouter().navTo(
      "employeeResume",
      {
        employeeId: oCtx?.getProperty("EmployeeID"),
        "?query": {
          tab: oEvent.getParameter("selectedKey"),
        },
      },
      true /*without history*/
    );
  }
}
