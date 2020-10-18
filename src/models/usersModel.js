import dynamoDb from "../../libs/dynamodb-lib";
import userService from '../services/userService';
const TableName = process.env.tableUsers;
const TableUnMatchName = process.env.tableUnMatches;

export default {
  createUser: async (userId) => {
    const minimal18 = new Date().getFullYear() - 18;
    const maximum40 = new Date().getFullYear() - 40;
    const filterAge1 = new Date().setFullYear(minimal18);
    const filterAge2 = new Date().setFullYear(maximum40);

    try {
      const params = {
        TableName,
        Item: {
          userId: userId,
          displayName: '',
          photos: [],
          dob: '',
          horoscope: '',
          gender: '',
          bio: '',
          job: '',
          education: '',
          city: '',
          searchable: Boolean(true),
          accountStatus: Boolean(false),
          banned: Boolean(false),
          popScore: parseFloat(100),
          filterAge1: parseFloat(filterAge1),
          filterAge2: parseFloat(filterAge2),
          filterGender: [],
          createdAt: parseFloat(Date.now()),
          geo_lat: parseFloat(0),
          geo_long: parseFloat(0),
        }
      };

      await dynamoDb.put(params);

      return params;
    } catch (err) {
      throw new Error(err);
    }
  },
  activateUserAccount: async (userId, data) => {
    try {
      const params = {
        TableName,
        Key: {
          userId
        },
        UpdateExpression: "SET filterAge1 = :filterAge1, filterAge2 = :filterAge2, filterGender = :filterGender, displayName = :displayName, photos = :photos, dob = :dob, horoscope = :horoscope, gender = :gender, bio = :bio, job = :job, education = :education, city = :city, searchable = :searchable, accountStatus = :accountStatus",
        ExpressionAttributeValues: {
          ":photos": data.photos,
          ":displayName": data.displayName,
          ":dob": data.dob,
          ":horoscope": await userService.getHoroscope(data.dob),
          ":gender": data.gender,
          ":bio": data.bio,
          ":job": data.job,
          ":education": data.education,
          ":city": data.city,
          ":searchable": data.searchable,
          ":filterAge1": data.filterAge1,
          ":filterAge2": data.filterAge2,
          ":filterGender": data.filterGender,
          ":accountStatus": Boolean(true),
        },

        ReturnValues: "ALL_NEW"
      };

      const { Attributes } = await dynamoDb.update(params);

      return Attributes;
    } catch (err) {
      throw new Error(err);
    }
  },
  updateUserProfile: async (userId, data) => {
    try {
      const params = {
        TableName,
        Key: {
          userId
        },
        UpdateExpression: "SET displayName = :displayName, photos = :photos, bio = :bio, job = :job, education = :education",
        ExpressionAttributeValues: {
          ":displayName": data.displayName,
          ":photos": data.photos || null,
          ":bio": data.bio || null,
          ":job": data.job || null,
          ":education": data.education || null,
        },

        ReturnValues: "ALL_NEW"
      };

      const { Attributes } = await dynamoDb.update(params);

      return Attributes;
    } catch (err) {
      throw new Error(err);
    }
  },
  findCurentUserById: async(userId) => {
    try {
      const params = {
        TableName,
        ProjectionExpression: "userId, displayName, photos, dob, horoscope, gender, bio, job, education, city, searchable, filterAge1, filterAge2, filterGender, accountStatus",
        Key: {
          userId
        }
      };

      const result = await dynamoDb.get(params);

      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  findUserById: async(userId) => {
    try {
      const params = {
        TableName,
        ProjectionExpression: "horoscope, userId, bio, gender, photos, displayName, education, dob, job",
        Key: {
          userId,
        }
      };

      const result = await dynamoDb.get(params);

      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  getUserFilterParms: async (userId) => {
    try {
      const params = {
        TableName,
        ProjectionExpression: "filterAge1, filterAge2, filterGender, gender",
        Key: {
          userId,
        }
      };

      const result = await dynamoDb.get(params);

      return result.Item;
    } catch (err) {
      throw new Error(err);
    }
  },
  getMatchSuggestion: async ({filterGender, filterAge1, filterAge2, gender, matchFilterExpression, matchExpressionAttributeValues}) => {
    try {
      const params = {
        TableName,
        FilterExpression: `(searchable = :searchable) AND (banned = :banned) ${matchFilterExpression} AND ((dob BETWEEN :age1 AND :age2) AND (contains (gender, :gender1) OR contains (gender, :gender2)) AND (contains (filterGender, :fg1) OR contains (filterGender, :fg2)))`,
        ProjectionExpression: "bio, displayName, dob, education, gender, horoscope, job, photos, userId, city",
        ExpressionAttributeValues: {
          ':gender1': filterGender[0],
          ':gender2': filterGender.length === 2 ? filterGender[1] : filterGender[0],
          ':age1': filterAge2,
          ':age2': filterAge1,
          ':fg1': gender,
          ':fg2': gender,
          ':searchable': true,
          ':banned': false,
          ...matchExpressionAttributeValues
        }
      };

      const result = await dynamoDb.scan(params);

      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  unMatchUserById: async (currentUser, userId, currentTime, type, reason) => {
    try {
      const params = {
        TableName: TableUnMatchName,
        Item: {
          userId: currentUser,
          reportedId: userId,
          createdAt: currentTime,
          type: type,
          reason: reason
        }
      };

      return await dynamoDb.put(params);
    } catch (err) {
      throw new Error(err);
    }
  },
};