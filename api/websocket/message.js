import handler from "../../libs/handler-lib";
// import dynamoDb from "../../libs/dynamodb-lib";
const AWS = require('aws-sdk');

export const main = handler(async (event, context) => {
  console.log('message event', event);
  const { connectionId: connectionID, domainName, stage } = event.requestContext;
  const message ='This is a reply to your message';
  // const body = JSON.parse(event.body);
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: domainName + '/' + stage
  });

  await apigwManagementApi.postToConnection({ ConnectionId: connectionID, Data: message }).promise();
  console.log('sent message');

  return { status: true, message: 'got a message' };
});