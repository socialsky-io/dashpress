import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IntegrationsConfigurationGroup } from "shared/types/integrations";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import { IKeyValue } from "./types";

export const CAPITAL_AND_UNDERSCORE_REGEX = `^[A-Z_]+$`;

export const FORM_SCHEMA: IAppliedSchemaFormConfig<IKeyValue> = {
  key: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
      {
        validationType: "regex",
        constraint: {
          pattern: CAPITAL_AND_UNDERSCORE_REGEX,
        },
        errorMessage: "Only capital letters and underscores are allowed",
      },
    ],
  },
  value: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export function KeyValueForm({
  group,
  onSubmit,
  initialValues,
}: IFormProps<IKeyValue> & { group: IntegrationsConfigurationGroup }) {
  const isCreate = !initialValues;
  return (
    <SchemaForm<IKeyValue>
      onSubmit={onSubmit}
      initialValues={initialValues}
      icon={isCreate ? "add" : "save"}
      buttonText={
        isCreate
          ? INTEGRATIONS_GROUP_CONFIG[group].crudConfig.FORM_LANG.CREATE
          : INTEGRATIONS_GROUP_CONFIG[group].crudConfig.FORM_LANG.UPDATE
      }
      action={isCreate ? "create" : "update"}
      formExtension={{
        fieldsState: `
          return {
            key: {
              disabled: $.action === "update"
            }
          }
        `,
      }}
      fields={FORM_SCHEMA}
    />
  );
}
