import { useCallback } from "react";
import uniqBy from "lodash/uniqBy";
import { IFieldValidationItem } from "shared/validations/types";
import { IColorableSelection } from "shared/types/ui";
import { useRouteParam } from "frontend/lib/routing";
import {
  getEntityFieldTypes,
  getEntitySelections,
} from "shared/logic/entities";
import { MAKE_CRUD_CONFIG } from "frontend/lib/makeCrudConfig";
import { DataStateKeys } from "@hadmean/protozoa";
import { DataCrudKeys } from "shared/types/data";
import { CRUD_KEY_CONFIG } from "shared/configurations/permissions";
import {
  getFieldTypeBoundedValidations,
  guessEntityValidations,
} from "./guess";
import { userFriendlyCase } from "../../../shared/lib/strings";
import { FIELD_TYPES_CONFIG_MAP } from "../../../shared/validations";
import { useEntityFields } from "./entity.store";
import { IEntityCrudSettings } from "../../../shared/configurations";
import { useEntityConfiguration } from "../configuration/configuration.store";
import { usePortalHiddenEntityColumns } from "./portal";

export function useEntitySlug(overrideValue?: string) {
  const routeParam = useRouteParam("entity");
  return overrideValue || routeParam;
}

export function useEntityId() {
  return useRouteParam("id");
}

export function useEntityDiction(paramEntity?: string) {
  const entity = useEntitySlug(paramEntity);
  const entityDiction = useEntityConfiguration<{
    plural: string;
    singular: string;
  }>("entity_diction", entity);
  return {
    singular: entityDiction.data?.singular || userFriendlyCase(entity),
    plural: entityDiction.data?.plural || userFriendlyCase(entity),
  };
}

export function useEntityCrudConfig(paramEntity?: string) {
  const { singular, plural } = useEntityDiction(paramEntity);

  return MAKE_CRUD_CONFIG({
    path: "N/A",
    plural,
    singular,
  });
}

export function useEntityFieldLabels(paramEntity?: string) {
  const entity = useEntitySlug(paramEntity);
  const entityFieldLabelsMap = useEntityConfiguration<Record<string, string>>(
    "entity_columns_labels",
    entity
  );

  return useCallback(
    (fieldName: string): string => {
      if (entityFieldLabelsMap.error || entityFieldLabelsMap.isLoading) {
        return userFriendlyCase(fieldName);
      }
      return (
        entityFieldLabelsMap.data?.[fieldName] || userFriendlyCase(fieldName)
      );
    },
    [entityFieldLabelsMap.data]
  );
}

export function useProcessedEntityFieldTypes(
  paramEntity?: string
): Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP> {
  const entity = useEntitySlug(paramEntity);
  const entityFieldTypesMap = useEntityConfiguration<
    Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP>
  >("entity_columns_types", entity);

  const entityFields = useEntityFields(entity);

  if (
    entityFields.isLoading ||
    entityFields.isError ||
    entityFieldTypesMap.isError ||
    entityFieldTypesMap.isLoading
  ) {
    return {};
  }
  return getEntityFieldTypes(entityFields.data, entityFieldTypesMap.data);
}

export function useEntityFieldValidations() {
  const entity = useEntitySlug();
  const entityValidationsMap = useEntityConfiguration<
    Record<string, IFieldValidationItem[]>
  >("entity_validations", entity);
  const processedEntityFieldTypes = useProcessedEntityFieldTypes(entity);
  const entityFields = useEntityFields(entity);

  if (
    entityFields.isLoading ||
    entityFields.isError ||
    entityValidationsMap.isError ||
    entityValidationsMap.isLoading
  ) {
    return {};
  }

  return Object.fromEntries(
    entityFields.data.map((entityField) => {
      // The validation from the DB should override that of the config
      const preSelectedValidation =
        entityValidationsMap.data[entityField.name] || [];

      const uniqKey: keyof IFieldValidationItem = "validationType";
      // Prefering the add new effect over remove old effect
      // Would be nice to reflect accurately
      // TODO if the maxLenghth/max changes then update that too :sweat
      return [
        entityField.name,
        uniqBy(
          [
            ...getFieldTypeBoundedValidations(
              processedEntityFieldTypes[entityField.name]
            ),
            ...guessEntityValidations(entityField),
            ...preSelectedValidation,
          ],
          uniqKey
        ),
      ];
    })
  );
}

export function useEntityFieldSelections(
  paramEntity?: string
): Record<string, IColorableSelection[]> {
  const entity = useEntitySlug(paramEntity);

  const entitySelections = useEntityConfiguration<
    Record<string, IColorableSelection[]>
  >("entity_selections", entity);
  const processedEntityFieldTypes = useProcessedEntityFieldTypes(entity);
  const entityFields = useEntityFields(entity);

  if (
    entityFields.isLoading ||
    entityFields.isError ||
    entitySelections.isError ||
    entitySelections.isLoading
  ) {
    return {};
  }

  return getEntitySelections(
    entityFields.data,
    entitySelections.data,
    processedEntityFieldTypes
  );
}

export function useEntityCrudSettings(paramEntity?: string) {
  const entity = useEntitySlug(paramEntity);

  return useEntityConfiguration<IEntityCrudSettings>(
    "entity_crud_settings",
    entity
  );
}

export function useHiddenEntityColumns(
  crudKey: DataCrudKeys,
  overrideEntity?: string
): DataStateKeys<string[]> {
  const entity = useEntitySlug();
  const entityConfig = useEntityConfiguration<string[]>(
    CRUD_KEY_CONFIG[crudKey],
    overrideEntity || entity
  );

  const portalHiddenEntities = usePortalHiddenEntityColumns(entity, crudKey);

  return {
    data: [...portalHiddenEntities.data, ...entityConfig.data],
    error: portalHiddenEntities.error || entityConfig.error,
    isLoading: portalHiddenEntities.isLoading || entityConfig.isLoading,
    isRefetching: false,
  };
}
