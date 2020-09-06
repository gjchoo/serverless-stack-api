// import AWS from "aws-sdk";
import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableUsersName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      displayName: data.displayName,
      userUuid: data.userUuid,
      photos: data.photos,
      dob: parseInt(data.dob? data.dob : 0),
      horoscope: data.horoscope,
      gender: data.gender,
      bio: data.bio,
      job: data.job,
      education: data.education,
      current_location: data.current_location,
      createdAt: Date.now(),
      privacy: Boolean(data.privacy ? data.privacy : false),
      account_status: Boolean(data.account_status ? data.account_status : true)
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});