import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { USER_PERMISSIONS } from "shared/constants/user";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";
import { BaseManageVariables, MangeVariablesPageTitle } from "./Base";

export function VariablesSettings() {
  useSetPageDetails({
    pageTitle: MangeVariablesPageTitle,
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  return (
    <BaseSettingsLayout>
      <BaseManageVariables />
    </BaseSettingsLayout>
  );
}
