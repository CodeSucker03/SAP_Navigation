import Event from "sap/ui/base/Event";
import BaseController from "../../BaseController";
import SearchField, { SearchField$SearchEvent } from "sap/m/SearchField";
import ViewSettingsDialog, {
  ViewSettingsDialog$ConfirmEvent,
} from "sap/m/ViewSettingsDialog";
import ViewSettingsItem from "sap/m/ViewSettingsItem";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Sorter from "sap/ui/model/Sorter";
import Table from "sap/m/Table";
import ListBinding from "sap/ui/model/ListBinding";
import Router from "sap/ui/core/routing/Router";
import { Route$MatchedEvent } from "sap/ui/core/routing/Route";
export default class EmployeeOverviewContent extends BaseController {
  _oTable: Table | null;
  _oVSD: ViewSettingsDialog | null;
  _sSortField: string | null;
  _bSortDescending: boolean;
  _aValidSortFields: string[];
  _sSearchQuery: undefined | string;
  _oRouterArgs: { "?query"?: { search?: string } } | undefined;

  public onInit(): void {
    let oRouter = this.getRouter();
    this._oTable = this.byId("employeesTable") as Table;
    this._oVSD = null;
    this._sSortField = null;
    this._bSortDescending = false;
    this._aValidSortFields = ["EmployeeID", "FirstName", "LastName"];
    this._sSearchQuery = undefined;
    this._oRouterArgs = {};

    this._initViewSettingsDialog();
    oRouter
      .getRoute("employeeOverview")
      ?.attachMatched(this._onRouteMatched, this);
  }

  public getRouter(): Router {
    return super.getRouter();
  }
  public onSortButtonPressed(): void {
    this._oVSD?.open();
  }

  public _onRouteMatched(oEvent: Route$MatchedEvent): void {
    // save the current query state
    this._oRouterArgs = oEvent.getParameter("arguments");
	if (!this._oRouterArgs) {
		this._oRouterArgs = {};
	}
    this._oRouterArgs["?query"] = this._oRouterArgs["?query"] || {};

    // search/filter via URL hash
    this._applySearchFilter(this._oRouterArgs["?query"].search);
  }

  public onSearchEmployeesTable(oEvent: SearchField$SearchEvent): void {
    this._applySearchFilter(oEvent.getSource().getValue()); /// return string
    // update the hash with the current search term
    let oRouter = this.getRouter();
	if (!this._oRouterArgs) {
		this._oRouterArgs = {};
	}
    if (!this._oRouterArgs["?query"]) {
      this._oRouterArgs["?query"] = {};
    }
    this._oRouterArgs["?query"].search = oEvent.getSource().getValue();
    oRouter.navTo("employeeOverview", this._oRouterArgs, true /*no history*/);
  }

  private _initViewSettingsDialog() {
    this._oVSD = new ViewSettingsDialog("vsd", {
      confirm: (oEvent: ViewSettingsDialog$ConfirmEvent) => {
        let oSortItem = oEvent.getParameter("sortItem");
        this._applySorter(
          oSortItem?.getKey(),
          oEvent.getParameter("sortDescending")
        );
      },
    });

    // init sorting (with simple sorters as custom data for all fields)
    this._oVSD.addSortItem(
      new ViewSettingsItem({
        key: "EmployeeID",
        text: "Employee ID",
        selected: true, // by default the MockData is sorted by EmployeeID
      })
    );

    this._oVSD.addSortItem(
      new ViewSettingsItem({
        key: "FirstName",
        text: "First Name",
        selected: false,
      })
    );

    this._oVSD.addSortItem(
      new ViewSettingsItem({
        key: "LastName",
        text: "Last Name",
        selected: false,
      })
    );
  }

  private _applySearchFilter(sSearchQuery: string | undefined): void {
    let aFilters, oFilter, oBinding;
    // first check if we already have this search value
    if (this._sSearchQuery === sSearchQuery) {
      return;
    }
    this._sSearchQuery = sSearchQuery;
    let searchField = this?.byId("searchField") as SearchField;
    searchField.setValue(sSearchQuery);

    // add filters for search
    aFilters = [];
    if (sSearchQuery && sSearchQuery.length > 0) {
      aFilters.push(
        new Filter("FirstName", FilterOperator.Contains, sSearchQuery)
      );
      aFilters.push(
        new Filter("LastName", FilterOperator.Contains, sSearchQuery)
      );
      oFilter = new Filter({ filters: aFilters, and: false }); // OR filter
    } else {
      oFilter = undefined;
    }

    // update list binding
    oBinding = this._oTable?.getBinding("items") as ListBinding;
    oBinding.filter(oFilter, "Application");
  }
  /**
   * Applies sorting on our table control.
   * @param {string} sSortField		the name of the field used for sorting
   * @param {string} sortDescending	true or false as a string or boolean value to specify a descending sorting
   * @private
   */
  private _applySorter(
    sSortField: string | undefined,
    sortDescending: string | boolean | undefined
  ): void {
    let bSortDescending, oBinding, oSorter;

    // only continue if we have a valid sort field
    if (sSortField && this._aValidSortFields.indexOf(sSortField) > -1) {
      // convert  the sort order to a boolean value
      if (typeof sortDescending === "string") {
        bSortDescending = sortDescending === "true";
      } else if (typeof sortDescending === "boolean") {
        bSortDescending = sortDescending;
      } else {
        bSortDescending = false;
      }

      // sort only if the sorter has changed
      if (
        this._sSortField &&
        this._sSortField === sSortField &&
        this._bSortDescending === bSortDescending
      ) {
        return;
      }

      this._sSortField = sSortField;
      this._bSortDescending = bSortDescending;
      oSorter = new Sorter(sSortField, bSortDescending);

      // sync with View Settings Dialog
      this._syncViewSettingsDialogSorter(sSortField, bSortDescending);

      oBinding = this._oTable?.getBinding("items") as ListBinding;
      oBinding.sort(oSorter);
    }
  }

  private _syncViewSettingsDialogSorter(
    sSortField: string | ViewSettingsItem,
    bSortDescending: boolean | undefined
  ): void {
    this._oVSD?.setSelectedSortItem(sSortField);
    this._oVSD?.setSortDescending(bSortDescending);
  }
}
