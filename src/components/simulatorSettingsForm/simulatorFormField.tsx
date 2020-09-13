import React, { useState } from "react";
import { Slider } from "@material-ui/core";
import SimulatorFormFieldStyles from "./simulatorFormField.module.scss";

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
    <div className={SimulatorFormFieldStyles.field}>
      <div className={SimulatorFormFieldStyles.icon}>
        <Icon />
      </div>
      <div className={SimulatorFormFieldStyles.slider}>
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
      </div>
      <div className={SimulatorFormFieldStyles.percentage}>{displayPercentage}%</div>
    </div>
  );
};
