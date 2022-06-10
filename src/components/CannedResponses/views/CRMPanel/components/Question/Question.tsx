import React from "react";
import { Actions, TaskContext } from "@twilio/flex-ui";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { withStyles } from "@material-ui/core/styles";

interface OwnProps {
  label: string;
  text: string;
  children?: React.ReactNode;
  classes: any;
}

// Props should be a combination of StateToProps, DispatchToProps, and OwnProps
type Props = OwnProps;

const styles = {
  buttonContainer: {
    marginBottom: 12,
  },
  text: {
    marginBottom: 6,
  },
  button: {
    marginRight: 8,
    backgroundColor: "rgb(5, 125, 158)",
  },
  icon: {
    marginLeft: 6,
    fontSize: 14,
  },
};

// It is recommended to keep components stateless and use redux for managing states
const Question: React.FunctionComponent<Props> = ({ text, classes }) => {
  const onClickSend = (channelSid: string | undefined) => {
    if (!channelSid) return;
    Actions.invokeAction("SendMessage", { body: text, channelSid });
  };

  const onClickCopy = (channelSid: string | undefined) => {
    if (!channelSid) return;
    Actions.invokeAction("SetInputText", { body: text, channelSid });
  };
  return (
    <TaskContext.Consumer>
      {(context) => (
        <>
          <Typography className={classes.text}>{text}</Typography>
          {text !== "No suggested responses." && (
            <div className={classes.buttonContainer}>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onClickSend(context.chatChannel?.source?.sid)}
              >
                Send
                <SendIcon className={classes.icon} />
              </Button>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onClickCopy(context.chatChannel?.source?.sid)}
              >
                Insert
                <FileCopyIcon className={classes.icon} />
              </Button>
            </div>
          )}
        </>
      )}
    </TaskContext.Consumer>
  );
};

Question.displayName = "Question";

export default withStyles(styles)(Question);
