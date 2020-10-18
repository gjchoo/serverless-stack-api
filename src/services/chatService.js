const gql = require('graphql-tag');

export default {
  formatArrayMessageToObject: async (array) => {
    try {
      const messageArray = {};
      array.map((e) => {
        const {sender, msgId, pending, timestamp, text, sent} = e;
        messageArray[msgId] = {
          _id: msgId,
          createdAt : timestamp,
          text,
          user : {
            _id: sender,
          },
          pending,
          sent
        };
      });

      return messageArray;
    } catch (err) {
      throw new Error(err);
    }
  },
  createLikesSchema: () => (gql`
    mutation createLikes($input: CreateLikesInput) {
      createLikes(input: $input) {
        userId
        userId_liked_user
        createdAt
        relationship
        respondedAt
      }
    }
  `),
  updateLikesSchema: () => (gql`
    mutation updateLikes($input: UpdateLikesInput) {
      updateLikes(input: $input) {
        relationship
        userId
        respondedAt
      }
    }
  `),
  createConversationSchema: () => (gql`
    mutation createConversations($input: CreateConversationsInput) {
      createConversations(input: $input) {
        conversationId
        active
        createdAt
        deactivatedAt
        userId
        userId_liked_user
      }
    }
  `)
};
