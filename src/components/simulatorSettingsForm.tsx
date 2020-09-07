import React, { useState, useEffect } from "react";
import { Grid, Input, Slider } from "@material-ui/core";

const SimulatorSettingsForm = ({ dispatch, sociallyDistancedPercent }) => {
  const [displayValue, setDisplayValue] = useState(sociallyDistancedPercent);

  const handleSliderChange = (event: any, newValue: number) => {
    setDisplayValue(newValue);
  };

  const handleSliderCommit = (event: any, newValue: number) => {
    dispatch({
      type: "UPDATE_PERSON_BEHAVIOR",
      payload: {
        propertyName: "mobility",
        propertyValue: "SOCIALLY_DISTANCED",
        percentToTurnOn: newValue,
      },
    });
  };

  const handleBlur = () => {
    let newValue;
    if (sociallyDistancedPercent < 0) {
      newValue = 0;
    } else if (sociallyDistancedPercent > 100) {
      newValue = 100;
    }

    dispatch({
      type: "UPDATE_PERSON_BEHAVIOR",
      payload: {
        propertyName: "mobility",
        propertyValue: "SOCIALLY_DISTANCED",
        percentToTurnOn: newValue,
      },
    });
  };

  useEffect(() => {
    setDisplayValue(sociallyDistancedPercent);
  }, [sociallyDistancedPercent]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === "" ? 0 : Number(event.target.value);
    dispatch({
      type: "UPDATE_PERSON_BEHAVIOR",
      payload: {
        propertyName: "mobility",
        propertyValue: "SOCIALLY_DISTANCED",
        percentToTurnOn: newValue,
      },
    });
  };

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={3}>
        <Slider
          value={displayValue}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderCommit}
          aria-labelledby='input-slider'
          min={0}
          max={100}
          marks
          step={5}
        />
      </Grid>
      <Grid item>
        <Input
          value={displayValue}
          margin='dense'
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
  );
};
export default SimulatorSettingsForm;
