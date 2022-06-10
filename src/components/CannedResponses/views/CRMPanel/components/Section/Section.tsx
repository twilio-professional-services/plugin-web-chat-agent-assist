import React from "react";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";

import Question from "../Question";

interface OwnProps {
  section: string;
  questions: {
    label: string;
    text: string;
  }[];
  classes: any;
}

// Props should be a combination of StateToProps, DispatchToProps, and OwnProps
type Props = OwnProps;

const styles = {
  root: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontWeight: 700,
    marginBottom: 8,
    fontSize: "20px",
    color: "rgb(5, 125, 158)",
  },
  paper: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "15px",
    paddingBottom: "15px",
    marginBottom: "8px",
    borderRadius: 10,
  },
  divider: {
    marginBottom: 8,
  },
};

// It is recommended to keep components stateless and use redux for managing states
const Section: React.FunctionComponent<Props> = ({
  section,
  questions,
  classes,
}) => {
  return (
    <Paper className={classes.paper} elevation={2}>
      <Typography className={classes.sectionTitle}>{section}</Typography>
      <Divider className={classes.divider} />
      {questions.map((q) => {
        return <Question key={q.text} label={q.label} text={q.text} />;
      })}
    </Paper>
  );
};

Section.displayName = "Section";

export default withStyles(styles)(Section);
