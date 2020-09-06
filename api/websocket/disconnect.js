import handler from "../../libs/handler-lib";
// import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  console.log('event', event);
  return { status: true, message: 'disconnected' };
});