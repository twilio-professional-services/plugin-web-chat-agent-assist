import React from "react";
import { TaskContext } from "@twilio/flex-ui";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

import Section from "./components/Section/Section";

interface OwnProps {
  // Props passed directly to the component
  classes: any;
  responses: any;
  nlp: any;
}

// Props should be a combination of StateToProps, DispatchToProps, and OwnProps
type Props = OwnProps;

const styles = {
  root: {
    padding: "24px",
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
  },
  section: {
    marginBottom: 12,
  },
  divider: {
    marginTop: 5,
    marginBottom: 5,
  },
};

// It is recommended to keep components stateless and use redux for managing states
const CRMPanel: React.FunctionComponent<Props> = (props: Props) => {
  const { classes, responses, nlp } = props;

  const renderItems = (context: any) => {
    if (!!context.task) {
      const reservationSid = context.task._task.sid;
      const taskNLPData = nlp[reservationSid];

      if (taskNLPData !== undefined && !!taskNLPData.intentInfo) {
        console.log("responses", responses);
        const intent = taskNLPData.intentInfo.intent.displayName;
        const filteredResponses = responses.filter((section: any) => {
          if (section.section.toLowerCase() === intent) {
            return section;
          }
        });

        return [
          {
            section: `Agent Assist - ${intent}`,
            questions:
              filteredResponses.length > 0
                ? filteredResponses[0].questions
                : [
                    {
                      text: "No suggested responses.",
                      label: taskNLPData.intentInfo.intent.displayName,
                    },
                  ],
          },
        ];
      }
    }

    return [];
  };

  return (
    <TaskContext.Consumer>
      {(context) => (
        <>
          <Grid container className={classes.root}>
            <Grid item xs={12} className={classes.header}>
              <Typography className={classes.title}>
                Pre-canned Chat Responses
              </Typography>
              <Divider className={classes.divider} />
            </Grid>
            {responses.length === 0 ? (
              <CircularProgress className={classes.progress} />
            ) : (
              <>
                {Object.keys(nlp).length !== 0 &&
                  renderItems(context).map((q: any) => (
                    <Grid
                      item
                      xs={12}
                      className={classes.section}
                      key={q.section}
                    >
                      <Section {...q} />
                    </Grid>
                  ))}
                {responses.map((q: any) => (
                  <Grid
                    item
                    xs={12}
                    className={classes.section}
                    key={q.section}
                  >
                    <Section {...q} />
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </>
      )}
    </TaskContext.Consumer>
  );
};

CRMPanel.displayName = "CRMPanel";

export default withStyles(styles)(CRMPanel);