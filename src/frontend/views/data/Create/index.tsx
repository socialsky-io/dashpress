import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { useRouter } from "next/router";
import { AppLayout } from "frontend/_layouts/app";
import {
  useEntityCrudConfig,
  useEntitySlug,
  useHiddenEntityColumns,
} from "frontend/hooks/entity/entity.config";
import { useEntityDataCreationMutation } from "frontend/hooks/data/data.store";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../../entity/constants";
import { BaseEntityForm } from "../_BaseEntityForm";

export function useRouteParams() {
  const router = useRouter();

  if (typeof window === "undefined") return {};

  const value = router.query;

  if (Array.isArray(value))
    throw new Error("Unexpected handle given by Next.js");
  return value;
}

export function EntityCreate() {
  const routeParams = useRouteParams();
  const entity = useEntitySlug();
  const entityCrudConfig = useEntityCrudConfig();

  const entityDataCreationMutation = useEntityDataCreationMutation(entity);

  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Create,
    EntityActionTypes.Types,
  ]);

  useSetPageDetails({
    pageTitle: entityCrudConfig.TEXT_LANG.CREATE,
    viewKey: "CREATE_ENTITY",
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const hiddenCreateColumns = useHiddenEntityColumns("create");

  const { backLink } = useNavigationStack();

  return (
    <AppLayout actionItems={actionItems}>
      <ContentLayout.Center>
        <SectionBox
          title={entityCrudConfig.TEXT_LANG.CREATE}
          backLink={backLink}
        >
          <BaseEntityForm
            entity={entity}
            action="create"
            initialValues={routeParams}
            onSubmit={entityDataCreationMutation.mutateAsync}
            hiddenColumns={hiddenCreateColumns}
          />
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
