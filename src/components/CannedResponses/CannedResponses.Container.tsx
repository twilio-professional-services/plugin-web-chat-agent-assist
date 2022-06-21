import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { AppState } from "../../states";
import { Actions } from "../../states/CannedResponsesState";
import { CannedResponseCategory, TaskNLPEntries } from "../../shared/types";
import CannedResponsesUI from "./CannedResponsesUI";

export interface StateToProps {
  responses: CannedResponseCategory[];
  nlp: TaskNLPEntries;
  error: string | undefined;
}

export interface DispatchToProps {
  responsesPromise: () => void;
  nlpPromise: (
    message: string,
    taskSid: string | undefined,
    channelSid: string | undefined
  ) => void;
}

type Props = StateToProps & DispatchToProps;

const mapStateToProps = (state: AppState): StateToProps => ({
  responses: state["web-chat-agent-assist"].CannedResponses.responses,
  nlp: state["web-chat-agent-assist"].CannedResponses.nlp,
  error: state["web-chat-agent-assist"].CannedResponses.error,
});

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchToProps => ({
  responsesPromise: bindActionCreators(Actions.responsesPromise, dispatch),
  nlpPromise: bindActionCreators(Actions.nlpPromise, dispatch),
});

const CannedResponsesContainer: React.FunctionComponent<Props> = ({
  responsesPromise,
  nlp,
  error,
  responses,
  nlpPromise,
}) => {
  React.useEffect(() => {
    responsesPromise();
  }, []);

  return (
    <CannedResponsesUI
      responses={responses}
      nlp={nlp}
      error={error}
      responsesPromise={responsesPromise}
      nlpPromise={nlpPromise}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CannedResponsesContainer);
