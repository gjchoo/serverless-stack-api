// import AWS from "aws-sdk";
import handler from "../../../libs/handler-lib";
import usersModel from '../../models/usersModel';
import memesModel from '../../models/memesModel';
import likesModel from '../../models/likesModel';
import userService from '../../services/userService';

export const main = handler(async (event, context) => {

  const userId = event.requestContext.identity.cognitoIdentityId;
  const { filterAge1, filterAge2, filterGender, gender } = await usersModel.getUserFilterParms(userId);

  const queryUserMemes = await memesModel.getUserMemesById(userId);
  const currentUserMemes = queryUserMemes.Items;

  // UserId + likes && blocked || reported to be excluded from search
  const userLikesResult = await likesModel.getUserLikes(userId);
  const {matchFilterExpression, matchExpressionAttributeValues} = await userService.prepareMatchFilters(userId, userLikesResult);

  // key step in preparing algorithm for matching
  const { Items } = await usersModel.getMatchSuggestion({filterGender, filterAge1, filterAge2, gender,matchFilterExpression, matchExpressionAttributeValues});

  if ( ! Items) {
    return {};
  };

  return userService.getUserSimilarityPercentage(Items, currentUserMemes);
});
