// import AWS from "aws-sdk";
import handler from "../../../libs/handler-lib";
import axios from 'axios';
const headers = { Authorization: 'Client-ID e8e65ea3a4894a3' };

export const main = handler(async (event, context) => {
  const index = event.pathParameters.id;
  const { data } = await axios({method: 'get', url: `https://api.imgur.com/3/g/memes/${index}`, headers});

  return data.data;
});