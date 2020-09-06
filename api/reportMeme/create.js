// import AWS from "aws-sdk";
import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableReportMemesName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      memeId: data.memeId,
      createdAt: Date.now(),
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});