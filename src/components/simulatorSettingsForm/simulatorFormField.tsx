import React, { useState } from "react";
import { Grid, Slider } from "@material-ui/core";

export const SimulatorFormField = ({ dispatch, value, fieldName, percentage, Icon }) => {
  const [displayPercentage, setPercentage] = useState(percentage);

  const handleBlur = () => {
    let newPercentage;
    if (percentage < 0) {
      newPercentage = 0;
    } else if (value > 100) {
      newPercentage = 100;
    }

    dispatch({
      type: "UPDATE_PERSON_BEHAVIOR",
      payload: {
        propertyName: fieldName,
        propertyValue: value,
        percentToTurnOn: newPercentage,
      },
    });
  };

  const handleSliderCommit = (event: any, newValue: number) => {
    dispatch({
      type: "UPDATE_PERSON_BEHAVIOR",
      payload: {
        propertyName: fieldName,
        propertyValue: value,
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
        propertyValue: value,
        percentToTurnOn: newValue,
      },
    });
  };

  return (
    <>
      <Grid container xs={12} spacing={1}>
        <Grid
          item
          xs={2}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Icon />
        </Grid>
        <Grid item xs={6}>
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
        <Grid item xs={3}>
          {displayPercentage}%
        </Grid>
      </Grid>
    </>
  );
};
