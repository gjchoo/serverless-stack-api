import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableUsersName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      userUuid: event.pathParameters.id
    },

    UpdateExpression: "SET displayName = :displayName, photos = :photos, dob = :dob, horoscope = :horoscope, gender = :gender, bio = :bio, job = :job, education = :education, current_location = :current_location, privacy = :privacy, account_status = :account_status",

    ExpressionAttributeValues: {
      ":displayName": data.displayName || null,
      ":photos": data.photos || null,
      ":dob": data.dob || null,
      ":horoscope": data.horoscope || null,
      ":gender": data.gender || null,
      ":bio": data.bio || null,
      ":job": data.job || null,
      ":education": data.education || null,
      ":current_location": data.current_location || null,
      ":privacy": data.privacy,
      ":account_status": true,
    },

    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  const { Attributes } = await dynamoDb.update(params);

  return { status: true, data : Attributes };
});