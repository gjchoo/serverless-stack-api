import handler from "../../../libs/handler-lib";
import chatsModel from '../../models/chatsModel';
import usersModel from '../../models/usersModel';

export const main = handler(async (event, context) => {
  const {reason, userId, conversationId, type} = JSON.parse(event.body);
  const currentUser = event.requestContext.identity.cognitoIdentityId;
  const currentTime = Date.now();
  console.log(reason, userId, conversationId, currentUser, currentTime);

  conversationId && await chatsModel.deactivateConversation(conversationId, currentTime);
  await usersModel.unMatchUserById(currentUser, userId, currentTime, type, reason);

  // find the conversation id
  // delete the conversation id,
  // for both users add into the list
  return ({status: true});
});

// createdAt: '12313',
// userId_liked_user: '111-222',
// conversationId: 'room123',
// userId: 'us-east-1:8fd958f4-7c82-4815-8abb-c3aead916688'
// status: true
// deactivatedAt: '' <-- if status is false
// minus points or smth