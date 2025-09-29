import Router from "sap/ui/core/routing/Router";
import BaseController from "../BaseController";
import Event from "sap/ui/base/Event";
import StandardListItem from "sap/m/StandardListItem";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";

export default class EmployeeList extends BaseController {
  public onInit(): void {}
  public getRouter(): Router {
    return super.getRouter();
  }
  public onNavBack(): void {
    super.onNavBack();
  }
  public onListItemPressed(oEvent: ListItemBase$PressEvent): void {
    let oItem = oEvent.getSource() as StandardListItem;
    let oCtx = oItem.getBindingContext();
    console.log(oCtx);
    this.getRouter().navTo("employee", {
      employeeId: oCtx?.getProperty("EmployeeID"),
    });
  }
}
