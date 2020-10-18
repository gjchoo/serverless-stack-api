// import AWS from "aws-sdk";
import handler from "../../../libs/handler-lib";
import memesModel from '../../models/memesModel';

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.identity.cognitoIdentityId;
  const result = await memesModel.userLikesMemes(userId, data);

  return result.Item;
});