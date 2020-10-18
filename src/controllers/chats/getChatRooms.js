import handler from "../../../libs/handler-lib";
import chatsModel from '../../models/chatsModel';
import usersModel from '../../models/usersModel';
import chatService from '../../services/chatService';

export const main = handler(async (event, context) => {
  const currentUserId = event.requestContext.identity.cognitoIdentityId;

  const chatResult = await chatsModel.getConversations(currentUserId);

  if(chatResult.Items.length === 0){
    // Return the empty array
    return {};
  };

  const allConversations = {};
  await Promise.all(chatResult.Items.map(async(e) => {
    const {userId_liked_user, userId, conversationId, createdAt} = e;
    const chatUserId = currentUserId === userId ? userId_liked_user : userId;

    const { Item }  = await usersModel.findUserById(chatUserId);
    const Items = await chatsModel.getMessagesInConversation(conversationId);

    const { timestamp } = Items[Items.length - 1] ? Items[Items.length - 1] : {};
    allConversations[conversationId] = {
      conversationId,
      user : Item,
      messages : await chatService.formatArrayMessageToObject(Items),
      createdAt : timestamp,
      convoCreatedAt : createdAt
    };
  }));
  return allConversations;
});
