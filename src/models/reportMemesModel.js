import dynamoDb from "../../libs/dynamodb-lib";
const TableName = process.env.tableReportMemes;

export default {
  getUserReportedMemesById: async (userId) => {
    try {
      const reportMemesParams = {
        TableName,
        KeyConditionExpression: "userId = :userId",
        ProjectionExpression: "memeId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      };

      const memeResult = await dynamoDb.query(reportMemesParams);

      return memeResult;
    } catch (err) {
      throw new Error(err);
    }
  },
  userReportMemes: async (userId, data) => {
    try {
      const params = {
        TableName,
        Item: {
          userId,
          memeId: data.memeId,
          createdAt: Date.now(),
        }
      };

      const result = await dynamoDb.put(params);

      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
};