import dynamoDb from "../../libs/dynamodb-lib";
const TableMessagesName = process.env.tableMessages;
const TableConversationsName = process.env.tableConversations;

export default {
  getConversations: async (userId) => {
    try {
      const params = {
        TableName: TableConversationsName,
        FilterExpression: "(active= :active AND (contains (userId, :userId) OR contains (userId_liked_user, :userId_liked_user)))",
        ProjectionExpression: "conversationId, userId, userId_liked_user, createdAt",
        ExpressionAttributeValues: {
          ':active': Boolean(true),
          ':userId': userId,
          ':userId_liked_user': userId,
        },
      };

      const result = await dynamoDb.scan(params);

      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  getMessagesInConversation: async (conversationId) => {
    try {
      const params = {
        TableName: TableMessagesName,
        KeyConditionExpression: "conversationId = :conversationId",
        ExpressionAttributeValues: {
          ":conversationId": conversationId
        },
        ScanIndexForward: true,
        Limit: 20
      };

      const { Items } = await dynamoDb.query(params);

      return Items;
    } catch (err) {
      throw new Error(err);
    }
  },
  deactivateConversation: async (conversationId, currentTime) => {
    try {
      const params = {
        TableName: TableConversationsName,
        Key: {
          conversationId: conversationId
        },
        UpdateExpression: "SET active = :active, deactivatedAt = :deactivatedAt",
        ExpressionAttributeValues: {
          ":active": Boolean(false),
          ":deactivatedAt": currentTime,
        },
        ReturnValues: "ALL_NEW"
      };

      return await dynamoDb.update(params);
    } catch (err) {
      throw new Error(err);
    }
  },
};