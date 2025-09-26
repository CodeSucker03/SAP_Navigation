/**
 * Generic base type for UI5 route arguments
 * - T = path parameters (like employeeId, orderId, etc.)
 * - Query = query string parameters (optional)
 */
export type RouteArgs<T extends object = {}, Query extends object = {}> =
  T & {
    "?query"?: Query;
  };

/**
 * Example: Employee route
 * Pattern in manifest.json:
 *   "pattern": "Employees/{employeeId}"
 */
export interface IEmployeeParams {
  employeeId: string;
}

export interface IEmployeeQuery {
  tab?: string; // e.g., ?tab=details
}

export type EmployeeRouteArgs = RouteArgs<IEmployeeParams, IEmployeeQuery>;