import React from "react";
import { motion } from "framer-motion";
import personStyles from "../person.module.css";
import styled from "styled-components";

function Person({ personData, gridSize, day, dispatch }) {
  const { id, infectedDay, isCured, location, isClickable } = personData;
  const isSymptomatic = !isCured && infectedDay >= 0 && day - infectedDay >= 5;
  const handleClick = () => {
    const newMobility = isSymptomatic ? "QUARANTINED" : "SOCIALLY_DISTANCED";
    dispatch({
      type: "UPDATE_PERSON_MOBILITY",
      payload: { id, mobility: newMobility },
    });
    dispatch({ type: "INCREMENT_DAY" });
  };

  const cellSizeInPercent = 98 / gridSize;

  return (
    <>
      <StyledPerson
        cellSizeInPercent={cellSizeInPercent}
        isCured={isCured}
        isSymptomatic={isSymptomatic}
        location={location}
        positionTransition={{ duration: 0.4 }}
        onClick={isClickable ? handleClick : undefined}
        infectedDay={infectedDay}
      >
        {personData.mobility === "SOCIALLY_DISTANCED" && (
          <div className={personStyles.sociallyDistancedSquare} />
        )}
        {personData.mobility === "QUARANTINED" && (
          <div className={personStyles.quarantinedSquare} />
        )}
        <div className={personStyles.personShadow} />
      </StyledPerson>
    </>
  );
}

const StyledPerson = styled(motion.div).attrs((props) => ({
  style: {
    height: `${props.cellSizeInPercent}%`,
    width: `${props.cellSizeInPercent}%`,
    backgroundColor: props.isCured ? "#57c1ff" : props.isSymptomatic ? "#448844" : "white",
    // Show all infected (for debugging):
    // backgroundColor: props.infectedDay >= 0 ? "#448844" : "white",
    left: `${props.cellSizeInPercent * props.location.x + 1}%`,
    bottom: `${props.cellSizeInPercent * props.location.y + 1}%`,
  },
}))`
  border-radius: 50%;
  position: absolute;

  border: 1px solid black;
  box-sizing: border-box;
  z-index: 5;
`;

export default Person;
