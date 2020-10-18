const axios = require('axios');
const graphql = require('graphql');
const { print } = graphql;

export default async function(gql, input) {
  try {
    const graphqlData = await axios({
      url: 'https://kwiwtp5euvge3mmvg7b7dwy6ee.appsync-api.us-east-1.amazonaws.com/graphql',
      method: 'post',
      headers: {'x-api-key': 'da2-hr4izbjmxfgc3otadh4xkpk7va'},
      data: {
        query: print(gql),
        variables : {
          input
        }
      }
    });

    if(graphqlData.data.errors){
      throw graphqlData.data.errors;
    };

    return graphqlData.data.data;
  } catch (err) {
    console.log('error appsync: ', err);
  };
};