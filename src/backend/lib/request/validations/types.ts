import { RequestMethod } from "../methods";
import { PortalValidationKeys } from "./implementations/portal";

export type ValidationKeys = {
  _type:
    | PortalValidationKeys
    | "isAuthenticated"
    | "guest"
    | "entity"
    | "authenticatedUser"
    | "configKey"
    | "paginationFilter"
    | "canUser"
    | "crudEnabled"
    | "requestBody"
    | "requestQuery"
    | "requestQueries"
    | "entityId"
    | "entityRequestBody"
    | "queryFilters"
    | "withPassword"
    | "configBody";
  method?: RequestMethod[];
  body?: unknown;
};

export const FOR_CODE_COV = 1;
