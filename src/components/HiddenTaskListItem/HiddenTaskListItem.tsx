import React from "react";
import * as Flex from "@twilio/flex-ui";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { AppState } from "../../states";
import { Actions } from "../../states/CannedResponsesState";

export interface StateToProps {
  responses: any;
  nlp: any;
  error: any;
}

export interface DispatchToProps {
  responsesPromise: () => void;
  nlpPromise: (message: string, taskSid: string | undefined) => void;
  updateNLP: (data: any) => void;
}

interface HiddenComponentProps extends Flex.TaskListItemProps {
  chatChannel?: any;
  task?: any;
}

type Props = StateToProps & DispatchToProps & HiddenComponentProps;

const mapStateToProps = (state: AppState): StateToProps => ({
  responses: state["web-chat-agent-assist"].CannedResponses.responses,
  nlp: state["web-chat-agent-assist"].CannedResponses.nlp,
  error: state["web-chat-agent-assist"].CannedResponses.error,
});

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchToProps => ({
  responsesPromise: bindActionCreators(Actions.responsesPromise, dispatch),
  nlpPromise: bindActionCreators(Actions.nlpPromise, dispatch),
  updateNLP: bindActionCreators(Actions.updateNLP, dispatch),
});

class HiddenTaskListItem extends React.Component<Props> {
  async componentDidUpdate() {
    const chatChannel = this.props.chatChannel;

    const { isLoadingChannel, isLoadingMembers, isLoadingMessages, messages } =
      chatChannel;

    if (
      !isLoadingChannel &&
      !isLoadingMembers &&
      !isLoadingMessages &&
      messages.length > 0
    ) {
      const selectedTaskSid = this.props.task._task.sid ?? "TODO_FIX";
      const { messages } = chatChannel;
      const lastMessage = messages[messages.length - 1];

      // check if the task exists in state
      const existingTask = this.props.nlp[selectedTaskSid];
      // if not, create the record (default sets intentInfo = null)
      if (!existingTask && !lastMessage.isFromMe) {
        this.props.updateNLP({
          taskSid: selectedTaskSid,
          message: lastMessage.source.state.body,
        });
      }

      if (!lastMessage.isFromMe) {
        const messageBody = lastMessage.source.state.body;
        const latestIntentInfo = this.props.nlp[selectedTaskSid].intentInfo;
        const latestMessage = this.props.nlp[selectedTaskSid].lastMessage;
        if (!latestIntentInfo || latestMessage !== messageBody) {
          this.props.nlpPromise(messageBody, selectedTaskSid);
        }
      }
    }
  }

  render() {
    return <></>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HiddenTaskListItem);
