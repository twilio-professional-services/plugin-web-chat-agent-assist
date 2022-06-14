import { Action } from '.';
import { getCannedReponses, getDialogflowNLP } from '../api'

const ACTION_GET_RESPONSES = 'GET_RESPONSES';
const ACTION_GET_NLP = 'GET_NLP';
const ACTION_UPDATE_NLP = 'UPDATE_NLP';

export interface CannedResponsesState {
  responses: any;
  nlp: any;
  error: any;
}

const initialState: CannedResponsesState = {
  responses: [],
  nlp: {},
  error: null
};

export const Actions = {
  // This action's payload is a function that will return a promise
  // It's payload will resolve to a Promise
  responsesPromise: () => ({
    type: ACTION_GET_RESPONSES,
    payload: getCannedReponses(),
  }),
  nlpPromise: (message: string, taskSid: string | undefined, channelSid: string | undefined) => ({
    type: ACTION_GET_NLP,
    payload: getDialogflowNLP(message, taskSid, channelSid),
  }),
  updateNLP: (data: any) => ({
    type: ACTION_UPDATE_NLP,
    payload: data,
  })
};

export function reduce(state: CannedResponsesState = initialState, action: Action): CannedResponsesState {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    // Describe how to handle the Promise while its pending
    case `${ACTION_GET_RESPONSES}_PENDING`:
      return state;
    // Describe how to handle the Promise if it's successfully fulfilled
    case `${ACTION_GET_RESPONSES}_FULFILLED`:
      return {
        ...state,
        responses: action.payload.data,
      };
    // Describe how to handle the promise if it fails
    case `${ACTION_GET_RESPONSES}_REJECTED`:
      return {
        ...state,
        error: action.payload.error,
      };
    // Describe how to handle the Promise while its pending
    case `${ACTION_GET_NLP}_PENDING`:
      return state;
    // Describe how to handle the Promise if it's successfully fulfilled
    case `${ACTION_GET_NLP}_FULFILLED`:
      const sid = action.payload.taskSid;
      const updateData = {...state.nlp};
      updateData[sid].intentInfo = action.payload;
      updateData[sid].lastMessage = action.payload.queryText;
      return {
        ...state,
        nlp: updateData,
      };
    // Describe how to handle the promise if it fails
    case `${ACTION_GET_NLP}_REJECTED`:
      return {
        ...state,
        error: action.payload.error,
      };

    case ACTION_UPDATE_NLP:
      const { taskSid, message } = action.payload;
      const update = state.nlp;
      if (update[taskSid] !== undefined) {
        update[taskSid].lastMessage = message
      } else {
        update[taskSid] = {
        lastMessage: message,
        intentInfo: null
        }
      }
      
      return {
        ...state,
        nlp: update,
      };
    default:
      return state;
  }
}
