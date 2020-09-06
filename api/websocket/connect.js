import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log('event', event);
  const {connectionId : connectionID} = event.requestContext;
  const params = {
    TableName: process.env.tableChatsName,
    Item: {
      ID : connectionID,
      timestamp : Date.now().toString(),
      messages: []
    }
  };
  await dynamoDb.put(params);
  return { status: true, message: 'connected' };
});