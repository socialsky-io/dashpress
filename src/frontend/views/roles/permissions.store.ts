import { isRouterParamEnabled } from "frontend/hooks";
import { useMutation } from "react-query";
import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { useStorageApi } from "frontend/lib/data/useApi";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { useRoleIdFromRouteParam } from "./hooks";
import { ADMIN_ROLES_CRUD_CONFIG } from "./roles.store";

export const ADMIN_PERMISSIONS_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  path: "N/A",
  plural: "Role Permissions",
  singular: "Role Permission",
});

export const ADMIN_ROLE_PERMISSION_ENDPOINT = (roleId: string) =>
  ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.CUSTOM(roleId, "permissions");

export function useRolePermissions() {
  const roleId = useRoleIdFromRouteParam();

  return useStorageApi<string[]>(ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
    enabled: isRouterParamEnabled(roleId),
    errorMessage: ADMIN_PERMISSIONS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });
}

export function useRolePermissionDeletionMutation() {
  const roleId = useRoleIdFromRouteParam();

  const apiMutateOptions = useApiMutateOptimisticOptions<string[], string[]>({
    dataQueryPath: ADMIN_ROLE_PERMISSION_ENDPOINT(roleId),
    onMutate: MutationHelpers.removeMany,
    successMessage: ADMIN_PERMISSIONS_CRUD_CONFIG.MUTATION_LANG.DELETE,
  });

  return useMutation(async (permissions: string[]) => {
    await makeActionRequest("DELETE", ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
      permissions,
    });
  }, apiMutateOptions);
}

export function useCreateRolePermissionMutation() {
  const roleId = useRoleIdFromRouteParam();

  const apiMutateOptions = useApiMutateOptimisticOptions<string[], string[]>({
    dataQueryPath: ADMIN_ROLE_PERMISSION_ENDPOINT(roleId),
    onMutate: MutationHelpers.mergeArray,
    successMessage: ADMIN_PERMISSIONS_CRUD_CONFIG.MUTATION_LANG.CREATE,
  });

  return useMutation(
    async (permissions: string[]) =>
      await makeActionRequest("POST", ADMIN_ROLE_PERMISSION_ENDPOINT(roleId), {
        permissions,
      }),
    apiMutateOptions
  );
}
