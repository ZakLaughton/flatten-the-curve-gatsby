import React, { useState, useEffect } from "react";
import { Grid, Input, Slider, Card, CardContent } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import simulatorSettingsFormStyles from "./simulatorSettingsForm.module.scss";
import { SimulatorFormField } from "./simulatorFormField";
import Person, { SociallyDistancedPerson, MaskedPerson, QuarantinedPerson } from "../person";
import Popover from "@material-ui/core/Popover";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { Backdrop, Fade, Modal, IconButton, Typography } from "@material-ui/core";
import { HelpHoverIcon } from "./helpHoverIcon";

const SimulatorSettingsForm = ({ dispatch, demographicPercentages }) => {
  const {
    isSociallyDistanced: sociallyDistancedPercent,
    isMasked: maskedPercent,
    doesSelfQuarantine: selfQuarantinePercent,
  } = demographicPercentages;
  return (
    <Card className={simulatorSettingsFormStyles.card}>
      <CardContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={6}>
            <div className={simulatorSettingsFormStyles.sliderHeader}>
              <h3>Socially Distanced</h3>
              <HelpHoverIcon message='Socially distanced people have a lower chance of moving, getting infected, or infecting others' />
            </div>
            <SimulatorFormField
              dispatch={dispatch}
              fieldName='isSociallyDistanced'
              value={true}
              percentage={sociallyDistancedPercent}
              Icon={SociallyDistancedPerson}
            />
          </Grid>
          <Grid item xs={6}>
            <div className={simulatorSettingsFormStyles.sliderHeader}>
              <h3>Masked</h3>
              <HelpHoverIcon message='Masked people have a slightly lower chance of getting infected, and a significantly lower chance of infecting others' />
            </div>
            <SimulatorFormField
              dispatch={dispatch}
              fieldName='isMasked'
              value={true}
              percentage={maskedPercent}
              Icon={MaskedPerson}
            />
          </Grid>
          <Grid item xs={6}>
            <div className={simulatorSettingsFormStyles.sliderHeader}>
              <h3>Self-quarantine w/ symptoms</h3>
              <HelpHoverIcon
                message={`People who quarantine when they show symptoms will have zero chance of moving or infecting others while they're contagious`}
              />
            </div>
            <SimulatorFormField
              dispatch={dispatch}
              fieldName='doesSelfQuarantine'
              value={true}
              percentage={selfQuarantinePercent}
              Icon={QuarantinedPerson}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default SimulatorSettingsForm;
