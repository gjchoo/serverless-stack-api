import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const userParams = {
    TableName: process.env.tableUsersName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      userUuid: event.pathParameters.id
    }
  };

  const memesParams = {
    TableName: process.env.tableMemesName,
    KeyConditionExpression: "userId = :userId",
    ProjectionExpression: "memeId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId
    }
  };

  const reportMemesParams = {
    TableName: process.env.tableReportMemesName,
    KeyConditionExpression: "userId = :userId",
    ProjectionExpression: "memeId",
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId
    }
  };

  const reportMemesResult = await dynamoDb.query(reportMemesParams);
  const memeResult = await dynamoDb.query(memesParams);
  const userResult = await dynamoDb.get(userParams);

  if ( ! userResult.Item) {
    throw new Error("Item not found.");
  }
  // Return the retrieved item
  return {
    user : userResult.Item,
    memes : memeResult.Items,
    reportMemes : reportMemesResult.Items
  };
});
