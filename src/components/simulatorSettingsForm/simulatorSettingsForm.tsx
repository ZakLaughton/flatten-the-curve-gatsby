import React, { useState, useEffect } from "react";
import {
  Grid,
  Input,
  Slider,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import simulatorSettingsFormStyles from "./simulatorSettingsForm.module.css";

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
    const newValue = event.target.value === "" ? "" : Number(event.target.value);
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
    <Card className={simulatorSettingsFormStyles.card}>
      <CardContent>
        <Typography id='input-slider' gutterBottom>
          % Socially Distanced
        </Typography>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={4}>
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
          <Grid item xs={2}>
            <Input
              value={displayValue}
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
      </CardContent>
    </Card>
  );
};
export default SimulatorSettingsForm;
