import dynamoDb from "../../libs/dynamodb-lib";
import graphqlHander from "../../libs/graphql-lib";
import chatService from '../services/chatService';
const TableName = process.env.tableLikes;
import * as uuid from 'uuid';

export default {
  getUserLikes: async (userId) => {
    try {
      const params = {
        TableName,
        FilterExpression: "userId = :userId OR userId_liked_user = :userId_liked_user",
        ProjectionExpression: "userId_liked_user, userId",
        ExpressionAttributeValues: {
          ":userId": userId,
          ":userId_liked_user": userId
        }
      };

      const result = await dynamoDb.scan(params);

      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  queryUserLikes: async (userId) => {
    try {
      const params = {
        TableName,
        Key: {
          userId : userId,
        }
      };

      const result = await dynamoDb.get(params);

      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  createLikes: async (userId, userId_liked_user, relationship) => {
    return await graphqlHander(
      chatService.createLikesSchema(),
      {
        userId: userId,
        userId_liked_user: userId_liked_user,
        createdAt: new Date().getTime(),
        relationship: relationship,
        respondedAt: ''
      }
    );
  },
  updateLikes: async (relationship, userId_liked_user) => {
    return await graphqlHander(
      chatService.updateLikesSchema(),
      {
        userId: userId_liked_user,
        relationship: relationship,
        respondedAt: new Date().getTime()
      }
    );
  },
  createConversations: async (userId, userId_liked_user) => {
    return await graphqlHander(
      chatService.createConversationSchema(),
      {
        conversationId: uuid.v1(),
        active: true,
        createdAt: new Date().getTime(),
        deactivatedAt: '',
        userId: userId,
        userId_liked_user: userId_liked_user,
      }
    );
  }
};