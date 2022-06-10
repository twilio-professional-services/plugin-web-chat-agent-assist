import { AppState as FlexAppState } from '@twilio/flex-ui';
import { combineReducers, Action as ReduxAction } from 'redux';

import { CannedResponsesState, reduce as CannedResponsesReducer } from './CannedResponsesState';

// Register your redux store under a unique namespace
export const namespace = 'web-chat-agent-assist';

// Extend this payload to be of type that your ReduxAction is
export interface Action extends ReduxAction {
  payload?: any;
}

// Register all component states under the namespace
export interface AppState {
  flex: FlexAppState;
  'web-chat-agent-assist': {
    CannedResponses: CannedResponsesState;
    // Other states
  };
}

// Combine the reducers
export default combineReducers({
  CannedResponses: CannedResponsesReducer,
});
