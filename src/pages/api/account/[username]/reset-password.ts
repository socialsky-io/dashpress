import { usersApiController } from "backend/users/users.controller";
import { RESET_PASSWORD_FORM_SCHEMA } from "shared/form-schemas/users/reset-password";
import { USER_PERMISSIONS } from "shared/constants/user";
import { requestHandler } from "backend/lib/request";

export default requestHandler(
  {
    PATCH: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: RESET_PASSWORD_FORM_SCHEMA,
        },
        {
          _type: "requestQuery",
          options: "username",
        },
      ]);
      return await usersApiController.resetPassword(
        validatedRequest.requestQuery,
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_RESET_PASSWORD,
    },
  ]
);
