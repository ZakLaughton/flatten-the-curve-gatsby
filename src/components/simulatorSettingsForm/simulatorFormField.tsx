import React, { useState, useEffect } from "react";
import { Grid, Input, Slider, Card, CardContent } from "@material-ui/core";

export const SimulatorFormField = ({ dispatch, value, fieldName, percentage }) => {
  const [displayPercentage, setPercentage] = useState(percentage);

  const handleBlur = () => {
    let newValue;
    if (value < 0) {
      newValue = 0;
    } else if (value > 100) {
      newValue = 100;
    }

    dispatch({
      type: "UPDATE_PERSON_BEHAVIOR",
      payload: {
        propertyName: fieldName,
        propertyValue: percentage,
        percentToTurnOn: newValue,
      },
    });
  };

  const handleSliderCommit = (event: any, newValue: number) => {
    dispatch({
      type: "UPDATE_PERSON_BEHAVIOR",
      payload: {
        propertyName: fieldName,
        propertyValue: "SOCIALLY_DISTANCED",
        percentToTurnOn: newValue,
      },
    });
  };

  const handleSliderChange = (event: any, newValue: number) => {
    setPercentage(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === "" ? "" : Number(event.target.value);
    dispatch({
      type: "UPDATE_PERSON_BEHAVIOR",
      payload: {
        propertyName: fieldName,
        propertyValue: "SOCIALLY_DISTANCED",
        percentToTurnOn: newValue,
      },
    });
  };

  return (
    <>
      <Grid container xs={12} spacing={2}>
        <Grid item xs={8}>
          <Slider
            value={displayPercentage}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderCommit}
            aria-labelledby='input-slider'
            min={0}
            max={100}
            marks
            step={5}
          />
        </Grid>
        <Grid item xs={4}>
          <Input
            value={displayPercentage}
            margin='none'
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};
