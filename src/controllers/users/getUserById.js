// import AWS from "aws-sdk";
import handler from "../../../libs/handler-lib";
import usersModel from '../../models/usersModel';

export const main = handler(async (event, context) => {
  const userId = event.pathParameters.id;
  const result = await usersModel.findUserById(userId);

  return result.Item;
});