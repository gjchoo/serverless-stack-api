import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  // const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableMemesName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      memeId : event.pathParameters.id,
    }
  };

  await dynamoDb.delete(params);

  return { status: true };
});