import React from "react";
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";

import CannedResponsesContainer from "./components/CannedResponses/CannedResponses.Container";
import HiddenTaskListItem from "./components/HiddenTaskListItem/HiddenTaskListItem";
import reducers, { namespace } from "./states";

const PLUGIN_NAME = "WebChatAgentAssistPlugin";

export default class WebChatAgentAssistPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    this.registerReducers(manager);

    const cannedResponseOptions: Flex.ContentFragmentProps = { sortOrder: -1 };
    const hiddenComponentOptions: Flex.ContentFragmentProps = {
      sortOrder: -1,
      if: (props) =>
        props.channelDefinition.capabilities.has("Chat") &&
        props.task.taskStatus === "assigned",
    };

    flex.TaskListItem.Content.add(
      <HiddenTaskListItem key="WebChatAgentAssistPlugin-TaskListItem" />,
      hiddenComponentOptions
    );

    flex.AgentDesktopView.Panel2.Content.replace(
      <CannedResponsesContainer key="WebChatAgentAssistPlugin-CRMPanel" />,
      cannedResponseOptions
    );
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  private registerReducers(manager: Flex.Manager) {
    if (!manager.store.addReducer) {
      // eslint-disable-next-line
      console.error(
        `You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`
      );
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
