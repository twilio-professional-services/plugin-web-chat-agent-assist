import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { AppState } from "../../states";
import { Actions } from "../../states/CannedResponsesState";
import CannedResponsesUI from "./CannedResponsesUI";

export interface StateToProps {
  responses: any;
  nlp: any;
  error: any;
}

export interface DispatchToProps {
  responsesPromise: () => void;
  nlpPromise: (message: string, taskSid: string | undefined, channelSid: string | undefined) => void;
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

class CannedResponsesContainer extends React.Component<Props> {
  componentWillMount() {
    this.props.responsesPromise();
  }

  render() {
    return (
      <CannedResponsesUI
        responses={this.props.responses}
        nlp={this.props.nlp}
        error={this.props.error}
        responsesPromise={this.props.responsesPromise}
        nlpPromise={this.props.nlpPromise}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CannedResponsesContainer);
