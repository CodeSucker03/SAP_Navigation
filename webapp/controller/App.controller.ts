import BaseController from "./BaseController";
import Log from "sap/base/Log";
import Router, {
  Router$BypassedEvent,
  Router$RouteMatchedEvent,
} from "sap/ui/core/routing/Router";

export default class App extends BaseController {
  public getRouter(): Router {
    return super.getRouter();
  }
  public onInit(): void {
    // This is ONLY for being used within the tutorial.
    // The default log level of the current running environment may be higher than INFO,
    // in order to see the debug info in the console, the log level needs to be explicitly
    // set to INFO here.
    // But for application development, the log level doesn't need to be set again in the code.
    Log.setLevel(Log.Level.INFO);

    let oRouter = this.getRouter();

    oRouter.attachBypassed(function (oEvent: Router$BypassedEvent) {
      let sHash = oEvent.getParameter("hash");
      // do something here, i.e. send logging data to the backend for analysis
      // telling what resource the user tried to access...
      Log.info(
        "Sorry, but the hash '" + sHash + "' is invalid.",
        "The resource was not found."
      );
    });
    oRouter.attachRouteMatched(function (oEvent: Router$RouteMatchedEvent) {
      let sRouteName = oEvent.getParameter("name");
      // do something, i.e. send usage statistics to back end
      // in order to improve our app and the user experience (Build-Measure-Learn cycle)
      Log.info(
        "User accessed route " + sRouteName + ", timestamp = " + Date.now()
      );
    });
  }
}
