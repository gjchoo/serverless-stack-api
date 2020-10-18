// import AWS from "aws-sdk";
import handler from "../../../libs/handler-lib";
import reportMemesModel from '../../models/reportMemesModel';

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.identity.cognitoIdentityId;
  const result = await reportMemesModel.userReportMemes(userId, data);

  return result.Item;
});