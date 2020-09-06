import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

function operation(list1, list2, isUnion) {
  var result = [];
  for (var i = 0; i < list1.length; i++) {
      let item1 = list1[i];
      let found = false;
      for (let j = 0; j < list2.length && !found; j++) {
          found = item1.memeId === list2[j].memeId;
      }
      if (found === !!isUnion) { // isUnion is coerced to boolean
          result.push(item1);
      }
  }
  return result;
}

export const main = handler(async (event, context) => {

  const userId = event.requestContext.identity.cognitoIdentityId;
  const userParams = {
    TableName: process.env.tableUsersName,
    ProjectionExpression: "filterAge1, filterAge2, filterGender, userUuid",
    Key: {
      userId,
      userUuid: event.pathParameters.id
    }
  };
  const { Item } = await dynamoDb.get(userParams);
  if ( ! Item) {
    throw new Error("user not found.");
  }
  const { filterAge1, filterAge2, userUuid} = Item;
  const memesParams = {
    TableName: process.env.tableMemesName,
    KeyConditionExpression: "userId = :userId",
    ProjectionExpression: "memeId",
    ExpressionAttributeValues: {
      ":userId": userUuid
    }
  };
  const queryUserMemes = await dynamoDb.query(memesParams);
  const currentUserMemes = queryUserMemes.Items;
  // retrieve user's filter profile
  // checks search gender filter is if [Male , Female] eg [Male]
  // checks search age filter [18 - 24]
  // filterGender = [Male, Female]
  // Male looking for female, females list must also be looking for males
  const userGender = 'Male';
  const matchParams = {
    TableName: process.env.tableUsersName,
    // KeyConditionExpression for locality, then refine the query
    FilterExpression: "(privacy = :privacy) AND (userId <> :userId) AND  ((dob BETWEEN :age1 AND :age2) AND (contains (gender, :gender1) OR contains (gender, :gender2)) AND (contains (filterGender, :fg1) OR contains (filterGender, :fg2)))",
    ProjectionExpression: "bio, displayName, dob, education, gender, horoscope, job, photos, userUuid",
    ExpressionAttributeValues: {
      ':userId' : userId,
      ':gender1': 'Female',
      ':gender2': 'Female',
      ':age1'   : parseFloat(filterAge1),
      ':age2'   : parseFloat(filterAge2),
      ':fg1'    : userGender,
      ':fg2'    : userGender,
      ':privacy': false,
      // ':age1': {N: '25'},
      // ':age2': {N: '30'},
      // ':h1': {N: '5.4'},
      // ':h2': {N: '5.9'},
      // ':city' : {S: 'India, US'},
    },
  };
  const matchedList = [];
  const { Items } = await dynamoDb.scan(matchParams);
  if ( ! Items) {
    throw new Error("no matched user not found.");
  };
  await Promise.all(Items.map(async(e) => {
    const { userUuid } = e;
    // let count = 0;
    const memesParams = {
      TableName: process.env.tableMemesName,
      KeyConditionExpression: "userId = :userId",
      ProjectionExpression: "memeId",
      ExpressionAttributeValues: {
        ":userId": userUuid
      }
    };
    const eachUserMemesResult = await dynamoDb.query(memesParams);
    const count = operation(eachUserMemesResult.Items, currentUserMemes, true);
    const totalItem = (eachUserMemesResult.Items.length + currentUserMemes.length) - count.length;
    const percentage = Math.floor((count.length/totalItem) * 100);
    // console.log('similar item: ', count.length, 'totalItem: ', totalItem, 'percent: ', percentage);
    return matchedList.push({...e, memes: eachUserMemesResult.Items, percentage });
  }));
  // Return the retrieved item
  return matchedList;
});
