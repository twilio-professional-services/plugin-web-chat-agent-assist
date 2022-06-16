import React from "react";

import { StateToProps, DispatchToProps } from "./CannedResponses.Container";
import CRMPanel from "./views/CRMPanel/CRMPanel";

interface OwnProps {
  // Props passed directly to the component
}

// Props should be a combination of StateToProps, DispatchToProps, and OwnProps
type Props = StateToProps & DispatchToProps & OwnProps;

// It is recommended to keep components stateless and use redux for managing states
const CannedResponsesUI: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <>
      <CRMPanel responses={props.responses} nlp={props.nlp} />
    </>
  );
};

CannedResponsesUI.displayName = "foo";

export default CannedResponsesUI;
