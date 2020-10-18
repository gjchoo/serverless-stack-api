// import AWS from "aws-sdk";
import handler from "../../../libs/handler-lib";
import usersModel from '../../models/usersModel';

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.identity.cognitoIdentityId;
  const result = await usersModel.updateUserProfile(userId, data);

  return result;
});