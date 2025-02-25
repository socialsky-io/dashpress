import {
  CONFIGURATION_KEYS,
  AppConfigurationKeys,
} from "shared/configurations";
import { BadRequestError } from "backend/lib/errors";
import { ValidationImplType } from "./types";

export const configKeyFilterValidationImpl: ValidationImplType<
  AppConfigurationKeys
> = async (req) => {
  const key = req.query.key as string;
  const configBag = CONFIGURATION_KEYS[key];
  if (!configBag) {
    throw new BadRequestError(`Configuration key '${key}' doesn't exist`);
  }
  if (configBag.requireEntity && !req.query.entity) {
    throw new BadRequestError(`Configuration of key '${key}' requires entity`);
  }
  return key as AppConfigurationKeys;
};
