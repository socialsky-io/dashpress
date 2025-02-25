import { USER_PERMISSIONS } from "shared/constants/user";
import { actionsApiController } from "backend/actions/actions.controller";
import { requestHandler } from "backend/lib/request";

const REQUEST_KEY_FIELD = "key";

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestQuery",
          options: REQUEST_KEY_FIELD,
        },
      ]);

      return await actionsApiController.showActionConfig(
        validatedRequest.requestQuery
      );
    },
  },
  [
    {
      _type: "canUser",
      body: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
    },
    {
      _type: "withPassword",
    },
  ]
);
