// import AWS from "aws-sdk";
import handler from "../../../libs/handler-lib";
import likesModel from '../../models/likesModel';

export const main = handler(async(event, context) => {

  const body = JSON.parse(event.body);
  const {userId, userId_liked_user, relationship} = body;

  try {
    const userLikesResult = await likesModel.queryUserLikes(userId);

    if ( ! userLikesResult.Item) {
      const otherUserLikesResult = await likesModel.queryUserLikes(userId_liked_user);

      if ( ! otherUserLikesResult.Item) {
        // no like found, create new like
        await likesModel.createLikes(userId, userId_liked_user, relationship);

      } else {
        // check if the other user expresses likes
        if(otherUserLikesResult.Item.relationship !== 'reject') {
          await likesModel.updateLikes(relationship ? 'reject' : 'likes', userId_liked_user);
          // if likes, creates conversation
          if( ! relationship) {
            await likesModel.createConversations(userId, userId_liked_user);
          };
        }
      };
    };

    return { status: true };

  } catch (err) {
    console.log('AppSync Error: ', err);
  };
});