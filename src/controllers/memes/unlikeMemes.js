// import AWS from "aws-sdk";
import handler from "../../../libs/handler-lib";
import memesModel from '../../models/memesModel';

export const main = handler(async (event, context) => {
  const userId = event.requestContext.identity.cognitoIdentityId;
  const memeId = event.pathParameters.id;
  const result = await memesModel.userDeletesMemes(userId, memeId);

  return result.Item;
});