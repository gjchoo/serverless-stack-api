import dynamoDb from "../../libs/dynamodb-lib";
const TableName = process.env.tableMemes;

export default {
  getUserMemesById: async (userId) => {
    try {
      const memesParams = {
        TableName,
        KeyConditionExpression: "userId = :userId",
        ProjectionExpression: "memeId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      };

      const memeResult = await dynamoDb.query(memesParams);

      return memeResult;
    } catch (err) {
      throw new Error(err);
    }
  },
  userLikesMemes: async (userId, data) => {
    try {
      const params = {
        TableName,
        Item: {
          userId,
          memeId: data.memeId,
          createdAt: Date.now(),
        }
      };

      await dynamoDb.put(params);

      return params.Item;
    } catch (err) {
      throw new Error(err);
    }
  },
  userDeletesMemes: async (userId, memeId) => {
    try {
      const params = {
        TableName,
        Key: {
          userId,
          memeId
        }
      };

      await dynamoDb.delete(params);

      return { status: true };

    } catch (err) {
      throw new Error(err);
    }
  },

};

