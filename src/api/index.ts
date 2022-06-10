import axios from 'axios';

export async function getCannedReponses () {
  return await fetch(`${process.env.REACT_APP_SERVICE_FUNCTION_URL}/chat-responses`)
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      return `Error: ${err}`;
    });
}

export async function getDialogflowNLP (message: string, taskSid: string | undefined) {
    const endpointURL = `${process.env.REACT_APP_SERVICE_FUNCTION_URL}/gdf-bot?customerMessage=${message}` ?? '';
    const { data } = await axios.get(endpointURL);
    const response = {...data, taskSid};
    return response;
}