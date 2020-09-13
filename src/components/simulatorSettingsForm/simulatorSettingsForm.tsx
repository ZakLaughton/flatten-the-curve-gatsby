import React, { useState, useEffect } from "react";
import { Grid, Input, Slider, Card, CardContent } from "@material-ui/core";
import simulatorSettingsFormStyles from "./simulatorSettingsForm.module.scss";
import { SimulatorFormField } from "./simulatorFormField";
import Person, { SociallyDistancedPerson, MaskedPerson } from "../person";

const SimulatorSettingsForm = ({ dispatch, demographicPercentages }) => {
  const {
    isSociallyDistanced: sociallyDistancedPercent,
    isMasked: maskedPercent,
  } = demographicPercentages;
  return (
    <Card className={simulatorSettingsFormStyles.card}>
      <CardContent>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={6}>
            <h3>% Socially Distanced </h3>
            <SimulatorFormField
              dispatch={dispatch}
              fieldName='isSociallyDistanced'
              value={true}
              percentage={sociallyDistancedPercent}
              Icon={SociallyDistancedPerson}
            />
          </Grid>
          <Grid item xs={6}>
            <h3>% masked</h3>
            <SimulatorFormField
              dispatch={dispatch}
              fieldName='isMasked'
              value={true}
              percentage={maskedPercent}
              Icon={MaskedPerson}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default SimulatorSettingsForm;
