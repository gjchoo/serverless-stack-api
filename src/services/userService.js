import memesModel from '../models/memesModel';
import moment from 'moment';

export default {
  prepareMatchFilters: async (userId, userLikesResult, ) => {
    try {
      const ignoreUserIdList = [userId];
      if ( userLikesResult.Items.length > 0) {
        userLikesResult.Items.map(e => {
          ignoreUserIdList.push(e.userId === userId ? e.userId_liked_user : e.userId);
        });
      };

      let FilterExpression = '';
      let ExpressionAttributeValues = {};

      ignoreUserIdList.map((e, index) => {
        const key = `AND (userId <> :userId${index})`;
        FilterExpression = FilterExpression + key;
        ExpressionAttributeValues[`:userId${index}`] = e;
      });

      return {
        matchFilterExpression : FilterExpression,
        matchExpressionAttributeValues : ExpressionAttributeValues
      };
    } catch (err) {
      throw new Error(err);
    }
  },
  getUserSimilarityPercentage: async (Items, currentUserMemes) => {
    try {
      const matchedList = {};

      const operation = (list1, list2, isUnion) => {
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
      };

      await Promise.all(Items.map(async(e) => {
        const { userId } = e;
        const eachUserMemesResult = await await memesModel.getUserMemesById(userId);
        const count = operation(eachUserMemesResult.Items, currentUserMemes, true);
        const totalItem = (eachUserMemesResult.Items.length + currentUserMemes.length) - count.length;
        const percentage = Math.floor((count.length/totalItem) * 100);
        matchedList[userId] = {...e, memes: eachUserMemesResult.Items, percentage : percentage || 0};
        return matchedList;
      }));

      return matchedList;
    } catch (err) {
      throw new Error(err);
    }
  },
  getHoroscope: async (date) => {
    const month = moment(date, 'x').format('M');
    const day = moment(date, 'x').format('DD');
    const zodiacSigns = {
      'capricorn':'Capricorn',
      'aquarius':'Aquarius',
      'pisces':'Pisces',
      'aries':'Aries',
      'taurus':'Taurus',
      'gemini':'Gemini',
      'cancer':'Cancer',
      'leo':'Leo',
      'virgo':'Virgo',
      'libra':'Libra',
      'scorpio':'Scorpio',
      'sagittarius':'Sagittarius'
    };

    if((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
      return zodiacSigns.capricorn;
    } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
      return zodiacSigns.aquarius;
    } else if((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
      return zodiacSigns.pisces;
    } else if((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
      return zodiacSigns.aries;
    } else if((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
      return zodiacSigns.taurus;
    } else if((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
      return zodiacSigns.gemini;
    } else if((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
      return zodiacSigns.cancer;
    } else if((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
      return zodiacSigns.leo;
    } else if((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
      return zodiacSigns.virgo;
    } else if((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
      return zodiacSigns.libra;
    } else if((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
      return zodiacSigns.scorpio;
    } else if((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
      return zodiacSigns.sagittarius;
    }
  }
};
