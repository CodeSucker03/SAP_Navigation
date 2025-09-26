import BaseComponent from "sap/ui/core/UIComponent";
// import BindingMode from "sap/ui/model/BindingMode";

/**
 * @namespace sap.ui.demo.nav
 */
export default class Component extends BaseComponent {
  public static metadata = {
    manifest: "json",
    interfaces: ["sap.ui.core.IAsyncContentCreation"],
  };

  public init(): void {
    // call the base component's init function
    super.init();
    console.log("Init component");
    this.getRouter().initialize();
    // enable routing
  }
}
