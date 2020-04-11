import React from "react";
import { motion } from "framer-motion";

function Person({ gridSize, personData, dispatch, day }) {
  const { id, infectedDay, isCured, location } = personData;
  const isSymptomatic = !isCured && infectedDay >= 0 && day - infectedDay >= 5;
  const handleClick = () => {
    const newMobility = isSymptomatic ? "QUARANTINED" : "SOCIALLY_DISTANCED";
    dispatch({ type: "UPDATE_PERSON_MOBILITY", payload: { id, mobility: newMobility } });
    dispatch({ type: "INCREMENT_DAY" });
  };

  const cellSizeInPercent = 100 / gridSize;

  // ! styled-components slow this movement to a crawl. Don't use them here

  const personStyle = {
    height: `${cellSizeInPercent}%`,
    width: `${cellSizeInPercent}%`,
    backgroundColor: isCured ? "#57c1ff" : isSymptomatic ? "#448844" : "white",
    borderRadius: `50%`,
    position: `absolute`,
    left: `${cellSizeInPercent * location.x}%`,
    bottom: `${cellSizeInPercent * location.y}%`,
    border: "1px solid black",
    // Use to reveal all infected for debugging:
    // border: infectedDay >= 0 ? '3px solid green' : '1px solid black',
    boxSizing: `border-box`,
    zIndex: 5,
  };

  const personShadow = {
    height: `${cellSizeInPercent}%`,
    width: `${cellSizeInPercent}%`,
    left: `${cellSizeInPercent * location.x}%`,
    bottom: `${cellSizeInPercent * location.y}%`,
    borderRadius: `50%`,
    content: "",
    position: `absolute`,
    zIndex: 4,
    boxSizing: `border-box`,
    boxShadow: `#0000009c 4px 3px 6px 0px`,
  };

  const sociallyDistancedSquareStyle = {
    height: `${cellSizeInPercent}%`,
    width: `${cellSizeInPercent}%`,
    position: `absolute`,
    left: `${cellSizeInPercent * location.x}%`,
    bottom: `${cellSizeInPercent * location.y}%`,
    border: `3px dashed #595959`,
    boxSizing: `border-box`,
    zIndex: 10,
  };

  const quarantinedSquareStyle = {
    height: `${cellSizeInPercent}%`,
    width: `${cellSizeInPercent}%`,
    position: `absolute`,
    left: `${cellSizeInPercent * location.x}%`,
    bottom: `${cellSizeInPercent * location.y}%`,
    border: `3px ridge #4c0000`,
    boxSizing: `border-box`,
    zIndex: 10,
  };

  return (
    <>
      <motion.span
        positionTransition={{ duration: 0.4 }}
        style={personStyle}
        onClick={handleClick}
      />
      {personData.mobility === "SOCIALLY_DISTANCED" && (
        <motion.div positionTransition={{ duration: 0.4 }} style={sociallyDistancedSquareStyle} />
      )}
      {personData.mobility === "QUARANTINED" && (
        <motion.div positionTransition={{ duration: 0.4 }} style={quarantinedSquareStyle} />
      )}
      <motion.div positionTransition={{ duration: 0.4 }} style={personShadow} />
    </>
  );
}

export default Person;
