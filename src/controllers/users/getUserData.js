// import AWS from "aws-sdk";
import handler from "../../../libs/handler-lib";
import usersModel from '../../models/usersModel';
import memesModel from '../../models/memesModel';
import reportMemesModel from '../../models/reportMemesModel';

export const main = handler(async (event, context) => {
  const userId = event.requestContext.identity.cognitoIdentityId;
  const reportMemesResult = await reportMemesModel.getUserReportedMemesById(userId);
  const memeResult = await memesModel.getUserMemesById(userId);
  const userResult = await usersModel.findCurentUserById(userId);

  if ( ! userResult.Item) {
    throw new Error("Item not found.");
  }

  return {
    user : userResult.Item,
    memes : memeResult.Items,
    reportMemes : reportMemesResult.Items
  };
});