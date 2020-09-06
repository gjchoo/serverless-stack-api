import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const params = {
    TableName: process.env.tableMemesName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      memeId : event.pathParameters.id,
    },
    UpdateExpression: "SET report = :report",

    ExpressionAttributeValues: {
      ":report": true,
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  const { Attributes } = await dynamoDb.update(params);

  return { status: true, data : Attributes };
});