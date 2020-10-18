// import AWS from "aws-sdk";
import handler from "../../libs/handler-lib";
import graphqlHander from "../../libs/graphql-lib";
const gql = require('graphql-tag');

const likes = gql`
  query listMessages {
    listMessages {
      items {
        conversationId
        timestamp
        msgId
      }
    }
  }
`;

export const main = handler(async(event, context) => {
  try {
    const graphqlData = await graphqlHander(likes);
    const body = graphqlData;

    return body;
  } catch (err) {
    console.log('error posting to appsync: ', err);
  };
});